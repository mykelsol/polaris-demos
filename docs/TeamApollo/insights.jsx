// Polaris — Entity Insights tab
// A per-entity "insights workspace": the entity's signals re-framed as
// assignable, status-tracked insight records. Reuses the Polaris chip-style
// FilterBar vocabulary (the "updated filtering") rather than the legacy
// All-Filters toolbar from the reference screenshot.

const { useState: useStateI, useMemo: useMemoI, useRef: useRefI, useEffect: useEffectI } = React;

// ──────────────── Workspace roster (insight owners) ────────────────
const POLARIS_TEAM = [
  { name: 'Priya Nadar',   initials: 'PN', color: '#1570ef' },
  { name: 'Marcus Webb',   initials: 'MW', color: '#7c3aed' },
  { name: 'Dana Cole',     initials: 'DC', color: '#15803d' },
  { name: 'Sofia Ramos',   initials: 'SR', color: '#b45309' },
  { name: 'Theo Brandt',   initials: 'TB', color: '#0891b2' },
];

// Workflow status vocabulary for risk reports.
const INSIGHT_STATUSES = [
  { id: 'New', label: 'New', tone: 'brand' },
  { id: 'In Review', label: 'In Review', tone: 'warning' },
  { id: 'Active', label: 'Active', tone: 'success' },
  { id: 'Archived', label: 'Archived', tone: 'neutral' },
];

// ──────────────── date helpers ────────────────
function parseDate(s) { const d = new Date(s); return isNaN(d) ? null : d; }
function fmtDate(d) {
  if (!d) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

const NOW = new Date('2026-05-29T00:00:00');

// Derive a stable insight record from a signal.
function deriveInsight(sig, idx) {
  const category = (sig.type || '').split('/')[0].trim() || 'General';
  const archived = sig.status === 'Snoozed';
  // Workflow status: Unread→New, Reviewed→Active, Snoozed→Archived, else→In Review.
  let status;
  if (archived) status = 'Archived';
  else if (sig.status === 'Unread') status = 'New';
  else if (sig.status === 'Reviewed') status = 'Active';
  else status = 'In Review';

  // Deterministic owner assignment — roughly every other item.
  let owner = null;
  if (status === 'Active' || (status !== 'Archived' && idx % 2 === 0)) {
    owner = POLARIS_TEAM[idx % POLARIS_TEAM.length].name;
  }

  const added = parseDate(sig.date) || NOW;
  // Last updated trends toward "recently": a deterministic offset, clamped to now.
  let updated = addDays(added, 5 + ((idx * 7 + (sig.evidence || 2) * 3) % 18));
  if (updated > NOW) updated = NOW;

  return {
    id: sig.id,
    title: sig.title,
    body: sig.body,
    category,
    archived,
    status,
    owner,
    added,
    updated,
    isNew: sig.status === 'Unread',
    strength: sig.strength,
  };
}

// ──────────────── click-outside hook ────────────────
function useOutside(onClose) {
  const ref = useRefI(null);
  useEffectI(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, [onClose]);
  return ref;
}

// ──────────────── Main view ────────────────
function EntityInsights({ entityId, onToast, onCrumb }) {
  const { entities, signals } = window.POLARIS_DATA;
  const entity = entities.find(e => e.id === entityId);

  // Build the entity's insight records once per entity.
  const baseRecords = useMemoI(() => {
    const rows = signals.filter(s => s.entity === entityId);
    return rows.map((s, i) => deriveInsight(s, i));
  }, [signals, entityId]);

  // Editable overrides for owner / status, keyed by insight id.
  const [edits, setEdits] = useStateI({});
  // Reset edits when entity changes.
  useEffectI(() => { setEdits({}); }, [entityId]);

  const records = useMemoI(() => baseRecords.map(r => ({
    ...r,
    owner:  edits[r.id]?.owner  !== undefined ? edits[r.id].owner  : r.owner,
    status: edits[r.id]?.status !== undefined ? edits[r.id].status : r.status,
  })), [baseRecords, edits]);

  const setOwner  = (id, owner)  => setEdits(e => ({ ...e, [id]: { ...e[id], owner } }));
  const setStatus = (id, status) => setEdits(e => ({ ...e, [id]: { ...e[id], status } }));

  // Toolbar state
  const [tab, setTab] = useStateI('current'); // current | archive
  const [query, setQuery] = useStateI('');
  const [filters, setFilters] = useStateI({ category: 'All', owner: 'All', status: 'All', date: 'All time' });

  const categories = useMemoI(() => Array.from(new Set(baseRecords.map(r => r.category))).sort(), [baseRecords]);
  const ownerOptions = useMemoI(() => ['All', 'Unassigned', ...POLARIS_TEAM.map(p => p.name)], []);

  const filtered = useMemoI(() => {
    let rows = records.filter(r => (tab === 'archive' ? r.archived : !r.archived));
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.body.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.owner || '').toLowerCase().includes(q));
    if (filters.category !== 'All') rows = rows.filter(r => r.category === filters.category);
    if (filters.owner === 'Unassigned') rows = rows.filter(r => !r.owner);
    else if (filters.owner !== 'All') rows = rows.filter(r => r.owner === filters.owner);
    if (filters.status !== 'All') rows = rows.filter(r => r.status === filters.status);
    if (filters.date !== 'All time') {
      const days = filters.date === 'Last 7 days' ? 7 : (filters.date === 'Last 30 days' ? 30 : 90);
      const cutoff = addDays(NOW, -days);
      rows = rows.filter(r => r.added >= cutoff);
    }
    return rows;
  }, [records, tab, query, filters]);

  const clearAll = () => {
    setQuery('');
    setFilters({ category: 'All', owner: 'All', status: 'All', date: 'All time' });
  };

  const currentCount = records.filter(r => !r.archived).length;
  const archiveCount = records.filter(r => r.archived).length;

  // Detail (Risk Report) state
  const [openId, setOpenId] = useStateI(null);
  useEffectI(() => { setOpenId(null); }, [entityId]);
  const openRec = openId ? records.find(r => r.id === openId) : null;

  // Surface the open report's title into the app breadcrumb.
  useEffectI(() => {
    if (!onCrumb) return;
    const t = openId ? (signals.find(s => s.id === openId) || {}).title : null;
    onCrumb(t || null);
  }, [openId, entityId]);

  // Close the open report when the breadcrumb "Risk Reports" crumb is clicked.
  useEffectI(() => {
    const h = () => setOpenId(null);
    window.addEventListener('polaris:closeReport', h);
    return () => window.removeEventListener('polaris:closeReport', h);
  }, []);

  if (openRec) {
    return (
      <RiskReportView
        rec={openRec}
        entity={entity}
        onBack={() => setOpenId(null)}
        onOwner={(name) => { setOwner(openRec.id, name); onToast && onToast(name ? `Assigned to ${name}` : 'Owner cleared'); }}
        onStatus={(s) => { setStatus(openRec.id, s); onToast && onToast(`Status set to ${s}`); }}
        onToast={onToast}
      />
    );
  }

  return (
    <div style={{ padding: '24px 32px 32px' }}>
      <InsightsToolbar
        query={query} onQuery={setQuery}
        tab={tab} onTab={setTab}
        currentCount={currentCount} archiveCount={archiveCount}
        filters={filters}
        onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        onClearAll={clearAll}
        categories={categories}
        ownerOptions={ownerOptions}
        onRefresh={() => onToast && onToast('Risk reports refreshed — no new items since last sync')}
      />

      <div style={{
        marginTop: 16,
        background: '#fff', borderRadius: 12,
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
        overflow: 'visible',
      }}>
        {/* column header */}
        <div style={{
          display: 'grid', gridTemplateColumns: INSIGHTS_GRID,
          background: '#fafafa',
          borderBottom: '1px solid #e5e5e5', borderTopLeftRadius: 12, borderTopRightRadius: 12,
          padding: '11px 24px',
          fontSize: 12, fontWeight: 700, color: '#525252',
        }}>
          <span>Risk report</span>
          <span>Owner</span>
          <span>Category</span>
          <span>Status</span>
          <span>Date added</span>
          <span>Last updated</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', color: '#737373' }}>
            <div style={{ fontWeight: 700, color: '#404040', fontSize: 15, marginBottom: 6 }}>
              No risk reports match these filters
            </div>
            {tab === 'archive'
              ? 'Nothing has been archived for this entity yet.'
              : 'Loosen the category, owner, or date range, or reset to defaults.'}
          </div>
        ) : (
          filtered.map((r, i) => (
            <InsightRow
              key={r.id}
              rec={r}
              first={i === 0}
              onOpen={() => setOpenId(r.id)}
              onOwner={(name) => { setOwner(r.id, name); onToast && onToast(name ? `Assigned to ${name}` : 'Owner cleared'); }}
              onStatus={(s) => { setStatus(r.id, s); onToast && onToast(`Status set to ${s}`); }}
            />
          ))
        )}

        <Pagination total={filtered.length} />
      </div>
    </div>
  );
}

const INSIGHTS_GRID = 'minmax(280px, 1fr) 220px 116px 140px 116px 116px';

// ──────────────── Toolbar (updated chip filtering) ────────────────
function InsightsToolbar({
  query, onQuery, tab, onTab, currentCount, archiveCount,
  filters, onFilterChange, onClearAll, categories, ownerOptions, onRefresh,
}) {
  return (
    <div style={{
      background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 12,
      padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {/* search + current/archive + view actions */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{
          flex: 1, height: 40, borderRadius: 8, background: '#fff',
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #d4d4d4',
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', minWidth: 0,
        }}>
          <Icon name="search-lg" size={18} tint={0.55} />
          <input
            value={query}
            onChange={e => onQuery(e.target.value)}
            placeholder="Search risk reports by title, category, owner…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'var(--font-sans)', fontSize: 14, color: '#171717', minWidth: 0,
            }}
          />
          {query && <IconButton icon="x-close" size={24} onClick={() => onQuery('')} title="Clear" />}
        </div>

        {/* Current / Archive segmented control */}
        <div style={{
          display: 'inline-flex', background: '#fff', borderRadius: 8,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #d4d4d4',
          overflow: 'hidden', flex: 'none', height: 40,
        }}>
          {[['current', 'Current', currentCount], ['archive', 'Archive', archiveCount]].map(([id, label, n], i) => (
            <button key={id} onClick={() => onTab(id)} style={{
              padding: '0 16px', height: 40, border: 'none',
              borderRight: i === 0 ? '1px solid #e5e5e5' : 'none',
              background: tab === id ? '#fafafa' : '#fff',
              color: tab === id ? '#171717' : '#525252',
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7,
            }}>
              {label}
              <span style={{
                padding: '1px 6px', borderRadius: 9999,
                background: tab === id ? '#d1e9ff' : '#f0f0f0',
                color: tab === id ? '#175cd3' : '#737373',
                fontSize: 11, fontWeight: 700,
              }}>{n}</span>
            </button>
          ))}
        </div>

        <ToolbarIcon title="Refresh" onClick={onRefresh}>
          <path d="M3 9a9 9 0 0 1 15-3.7L21 7" /><path d="M21 4v3h-3" />
          <path d="M21 15a9 9 0 0 1-15 3.7L3 17" /><path d="M3 20v-3h3" />
        </ToolbarIcon>
      </div>

      {/* filter chips */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <FilterChip label="Category" options={['All', ...categories]} value={filters.category} onChange={v => onFilterChange('category', v)} />
        <FilterChip label="Owner" options={ownerOptions} value={filters.owner} onChange={v => onFilterChange('owner', v)} />
        <FilterChip label="Status" options={['All', 'New', 'In Review', 'Active', 'Archived']} value={filters.status} onChange={v => onFilterChange('status', v)} />
        <FilterChip label="Date added" options={['All time', 'Last 7 days', 'Last 30 days', 'Last 90 days']} value={filters.date} defaultValue="All time" onChange={v => onFilterChange('date', v)} />
        <div style={{ marginLeft: 'auto' }}>
          <Button variant="ghost" size="xs" onClick={onClearAll}>Clear all</Button>
        </div>
      </div>
    </div>
  );
}

function ToolbarIcon({ title, onClick, children }) {
  const [hover, setHover] = useStateI(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: 40, height: 40, borderRadius: 8, flex: 'none', cursor: 'pointer',
        background: '#fff', color: hover ? '#171717' : '#525252',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.04), inset 0 0 0 1px #d4d4d4',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'color .12s',
      }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.66" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}

// ──────────────── Insight row ────────────────
function InsightRow({ rec, first, onOpen, onOwner, onStatus }) {
  const [hover, setHover] = useStateI(false);
  const stop = (e) => e.stopPropagation();
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'grid', gridTemplateColumns: INSIGHTS_GRID, alignItems: 'center',
        gap: 0,
        padding: '18px 24px',
        borderTop: first ? 'none' : '1px solid #f0f0f0',
        background: hover ? '#fafafa' : 'transparent',
        cursor: 'pointer',
        transition: 'background .12s',
      }}
    >
      {/* Insight */}
      <div style={{ paddingRight: 24, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
          {rec.isNew && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1570ef', flex: 'none', marginTop: 7 }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 15, fontWeight: 700, color: hover ? '#175cd3' : '#171717', lineHeight: 1.35,
              transition: 'color .12s',
            }}>{rec.title}</div>
            <div style={{
              marginTop: 5, fontSize: 13, color: '#737373', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{rec.body}</div>
          </div>
        </div>
      </div>

      {/* Owner */}
      <div style={{ paddingRight: 16 }} onClick={stop}>
        <OwnerSelect owner={rec.owner} onChange={onOwner} />
      </div>

      {/* Category */}
      <div style={{ fontSize: 14, color: '#404040', paddingRight: 12 }}>{rec.category}</div>

      {/* Status */}
      <div style={{ paddingRight: 12 }} onClick={stop}>
        <StatusSelect status={rec.status} onChange={onStatus} />
      </div>

      {/* Dates */}
      <div style={{ fontSize: 13, color: '#525252', fontVariantNumeric: 'tabular-nums' }}>{fmtDate(rec.added)}</div>
      <div style={{ fontSize: 13, color: '#525252', fontVariantNumeric: 'tabular-nums' }}>{fmtDate(rec.updated)}</div>
    </div>
  );
}

// ──────────────── Owner select ────────────────
function OwnerSelect({ owner, onChange }) {
  const [open, setOpen] = useStateI(false);
  const ref = useOutside(() => setOpen(false));
  const person = POLARIS_TEAM.find(p => p.name === owner);

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', height: 40, padding: '0 10px',
        background: '#fff', borderRadius: 8, cursor: 'pointer', border: 'none',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.04), inset 0 0 0 1px #d4d4d4',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-sans)',
      }}>
        {person
          ? <Avatar initials={person.initials} color={person.color} size={24} />
          : <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f5f5f5',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#a3a3a3', flex: 'none' }}>
              <Icon name="users-01" size={14} tint={0.6} />
            </span>}
        <span style={{
          flex: 1, textAlign: 'left',
          fontSize: 13, fontWeight: person ? 700 : 600,
          color: person ? '#171717' : '#737373',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{person ? person.name : 'Assign owner'}</span>
        <Icon name="chevron-down" size={14} tint={0.55} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 44, left: 0, zIndex: 30, minWidth: '100%',
          background: '#fff', borderRadius: 8, padding: 6,
          boxShadow: '0 12px 28px -8px rgba(16,24,40,0.18), 0 1px 2px 0 rgba(16,24,40,0.06), inset 0 0 0 1px #e5e5e5',
          animation: 'pol-menu .18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {POLARIS_TEAM.map(p => (
            <div key={p.name}
              onClick={() => { onChange(p.name); setOpen(false); }}
              style={{
                padding: '7px 10px', borderRadius: 6, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 9,
                background: p.name === owner ? '#f5fafc' : 'transparent',
              }}
              onMouseEnter={e => { if (p.name !== owner) e.currentTarget.style.background = '#fafafa'; }}
              onMouseLeave={e => { if (p.name !== owner) e.currentTarget.style.background = 'transparent'; }}
            >
              <Avatar initials={p.initials} color={p.color} size={24} />
              <span style={{ fontSize: 13, fontWeight: p.name === owner ? 700 : 500, color: p.name === owner ? '#175cd3' : '#404040' }}>{p.name}</span>
            </div>
          ))}
          {owner && (
            <>
              <div style={{ height: 1, background: '#f0f0f0', margin: '4px 4px' }} />
              <div onClick={() => { onChange(null); setOpen(false); }}
                style={{ padding: '7px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#737373', display: 'flex', alignItems: 'center', gap: 9 }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ width: 24, display: 'inline-flex', justifyContent: 'center' }}><Icon name="x-close" size={14} tint={0.6} /></span>
                Clear owner
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────── Status select ────────────────
function StatusSelect({ status, onChange }) {
  const [open, setOpen] = useStateI(false);
  const ref = useOutside(() => setOpen(false));
  const cfg = INSIGHT_STATUSES.find(s => s.id === status);
  const tones = {
    brand:   { bg: '#fff', bd: '#84caff', fg: '#175cd3' },
    warning: { bg: '#fff', bd: '#fde68a', fg: '#b45309' },
    success: { bg: '#fff', bd: '#bbf7d0', fg: '#15803d' },
    neutral: { bg: '#fff', bd: '#e5e5e5', fg: '#525252' },
  };
  const t = cfg ? tones[cfg.tone] : { bg: '#fff', bd: '#d4d4d4', fg: '#737373' };

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 30, padding: '0 8px 0 10px',
        background: t.bg, color: t.fg,
        border: 'none', borderRadius: 9999, cursor: 'pointer',
        boxShadow: `inset 0 0 0 1px ${t.bd}`,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
      }}>
        {cfg ? cfg.label : 'Select a status'}
        <Icon name="chevron-down" size={13} tint={0.6} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 34, left: 0, zIndex: 30, minWidth: 150,
          background: '#fff', borderRadius: 8, padding: 6,
          boxShadow: '0 12px 28px -8px rgba(16,24,40,0.18), 0 1px 2px 0 rgba(16,24,40,0.06), inset 0 0 0 1px #e5e5e5',
          animation: 'pol-menu .18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {INSIGHT_STATUSES.map(s => {
            const st = tones[s.tone];
            return (
              <div key={s.id}
                onClick={() => { onChange(s.id); setOpen(false); }}
                style={{
                  padding: '7px 10px', borderRadius: 6, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: s.id === status ? '#fafafa' : 'transparent',
                }}
                onMouseEnter={e => { if (s.id !== status) e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={e => { if (s.id !== status) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: st.fg, flex: 'none' }} />
                <span style={{ fontSize: 13, fontWeight: s.id === status ? 700 : 500, color: '#404040' }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════ Risk Report (detail view) ════════════════
// A single insight rendered as a full analyst risk report: header card with
// workflow + assignable metadata, then a sectioned brief (disposition,
// situation, business impact, risk drivers, mitigation actions).

const TODAY = new Date('2026-06-08T00:00:00');
function fmtGen(d) { return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
const GENERATED_LABEL = fmtGen(TODAY);

function fmtRelative(d) {
  if (!d) return '—';
  const days = Math.round((TODAY - d) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return days + ' days ago';
  if (days < 14) return '1 week ago';
  if (days < 30) return Math.floor(days / 7) + ' weeks ago';
  return fmtDate(d);
}

// Risk-domain library — drivers + mitigation actions tailored by signal theme.
const DOMAIN_LIBRARY = {
  Price: {
    domain: 'Commodity Price & Volatility',
    drivers: [
      'Futures-curve movement and spot-versus-contract basis spreads',
      'USDA supply/demand revisions (WASDE, Cattle on Feed, ERS)',
      'Input-cost pass-through from feed, fuel, and packaging',
      'Hedging coverage ratios and roll timing on open positions',
      'Supplier margin commentary and quarterly guidance',
      'Menu-mix and operator price-elasticity feedback',
    ],
    actions: [
      'Review hedging coverage and roll schedule across exposed positions',
      'Pressure-test contract pricing against the current futures curve',
      'Engage key suppliers to confirm cost pass-through assumptions',
      'Model margin sensitivity to a further 5–10% input-cost move',
      'Align category planning and the promotional calendar to the cost outlook',
      'Set watch thresholds on cutout, basis, and feed-cost indicators',
    ],
  },
  Supply: {
    domain: 'Supply Continuity & Capacity',
    drivers: [
      'Inventory and herd/flock levels versus prior-year baselines',
      'Plant utilization, capacity exits, and regional throughput',
      'Lead-time changes and allocation behavior from suppliers',
      'Logistics, cold-chain, and refrigerated-freight availability',
      'Disease and biosecurity status across producing regions',
      'Single-source exposure and qualified backup coverage',
    ],
    actions: [
      'Confirm inventory buffers and safety-stock levels on critical SKUs',
      'Engage primary suppliers on capacity, lead times, and contingency plans',
      'Assess alternate sourcing regions and approved backup suppliers',
      'Review cold-chain capacity and route-diversification options',
      'Stress-test continuity under a sustained regional disruption',
      'Establish escalation criteria tied to supply-continuity thresholds',
    ],
  },
  Supplier: {
    domain: 'Supplier & Counterparty Health',
    drivers: [
      'Earnings, EBITDA, and margin trajectory of key suppliers',
      'M&A, restructuring, and workforce/headcount actions',
      'Plant consolidations and facility-level capacity changes',
      'Commercial-coverage and account-team continuity',
      'Contract-renewal timing and leverage windows',
      'Credit, liquidity, and counterparty-risk indicators',
    ],
    actions: [
      'Reassess the counterparty-risk rating for the affected supplier',
      'Map exposure by SKU, facility, and contract to this supplier',
      'Engage commercial contacts to confirm coverage and continuity',
      'Prepare a renewal strategy and identify leverage points',
      'Identify and qualify alternate suppliers for critical volume',
      'Set watch triggers on earnings, restructuring, and plant actions',
    ],
  },
  Trade: {
    domain: 'Geopolitical & Trade',
    drivers: [
      'Tariff, export-tax, and border-control policy changes',
      'Import/export bans and regionalization protocols',
      'Trade-flow rerouting and origin-substitution effects',
      'Currency and freight-cost movement on affected lanes',
      'Regulatory timelines and comment/implementation windows',
      'Retaliatory-action and escalation risk across partners',
    ],
    actions: [
      'Map exposure to affected origins, lanes, and tariff lines',
      'Model landed-cost impact under current and escalated scenarios',
      'Engage suppliers on origin flexibility and rerouting options',
      'Review contractual price-adjustment and force-majeure terms',
      'Identify alternate approved origins for exposed volume',
      'Establish escalation criteria tied to policy and trade-flow shifts',
    ],
  },
  Climate: {
    domain: 'Climate & Environmental',
    drivers: [
      'Drought-monitor coverage across producing regions',
      'Feed, hay, and forage availability and pricing',
      'Heifer-retention and herd-rebuild constraints',
      'Water availability and irrigation stress',
      'Extreme-weather and wildfire disruption to operations',
      'Multi-region correlation compounding supply pressure',
    ],
    actions: [
      'Quantify exposure in drought- and weather-affected sourcing regions',
      'Track feed-cost and forage indicators against contract assumptions',
      'Engage suppliers on regional capacity and continuity planning',
      'Assess alternate sourcing outside the affected geographies',
      'Model multi-year supply impact if conditions persist',
      'Set watch thresholds on drought coverage and feed costs',
    ],
  },
  Regulatory: {
    domain: 'Regulatory & Policy',
    drivers: [
      'Agency reviews, rulemakings, and public-comment periods',
      'Labeling, classification, and approval-status changes',
      'Emergency authorizations and movement controls',
      'Cross-border regulatory alignment and divergence',
      'Compliance-cost and reformulation implications',
      'Timeline risk between proposal and enforcement',
    ],
    actions: [
      'Track the regulatory timeline and key comment/implementation dates',
      'Assess product, labeling, and sourcing exposure to the change',
      'Engage regulatory affairs and affected suppliers early',
      'Model compliance-cost and reformulation scenarios',
      'Prepare contingency plans for an adverse or accelerated outcome',
      'Set watch triggers on agency actions and enforcement signals',
    ],
  },
  Demand: {
    domain: 'Demand & Category',
    drivers: [
      'Operator and franchisee cost and pricing feedback',
      'Menu-mix shifts across protein categories',
      'Consumer price-elasticity and traffic response',
      'Promotional-calendar and value-platform pressure',
      'Competitive pricing and category dynamics',
      'Pass-through behavior across the value chain',
    ],
    actions: [
      'Quantify category exposure and pricing-power headroom',
      'Align promotional and value-platform plans to the cost outlook',
      'Monitor operator pricing actions and traffic response',
      'Model menu-mix sensitivity across protein substitution',
      'Coordinate category planning with procurement strategy',
      'Set watch thresholds on operator and consumer signals',
    ],
  },
};
const DEFAULT_DOMAIN = {
  domain: 'Cross-Category Risk',
  drivers: [
    'Corroborating signal volume and source diversity',
    'Direction and velocity of the underlying trend',
    'Exposure across affected SKUs, suppliers, and regions',
    'Cost, supply-continuity, and availability implications',
    'Adjacent-pattern linkage and escalation potential',
  ],
  actions: [
    'Confirm exposure across affected SKUs, suppliers, and regions',
    'Engage relevant suppliers and internal owners to validate',
    'Model cost and continuity impact under a base and a stressed case',
    'Identify mitigation levers and alternate options',
    'Establish watch thresholds and escalation criteria',
  ],
};

function deriveRiskReport(sig, rec, entity) {
  const token = (sig.type || '').split(/[\/·]/)[0].trim();
  const lib = DOMAIN_LIBRARY[token] || DEFAULT_DOMAIN;
  const entName = (entity && entity.name) || 'this category';
  const cat = (rec.category || entName).toLowerCase();

  const disposition = sig.strength === 'High' ? 'Escalate'
    : sig.strength === 'Medium' ? 'Watch' : 'Monitor';

  const dispositionNote = disposition === 'Escalate'
    ? `The risk is material to ${cat} cost and supply reliability and is corroborated by multiple signals. Prioritize for active mitigation and brief the strategy owner.`
    : disposition === 'Watch'
    ? `The risk is relevant to ${cat} cost and supply reliability, but direct disruption is not confirmed. Continue monitoring and reassess if new supplier, logistics, or input-cost signals emerge.`
    : `This is an early-stage signal with limited corroboration. Maintain passive monitoring and reassess if additional signals develop.`;

  const trend = disposition === 'Escalate' ? 'rising and increasingly corroborated'
    : disposition === 'Watch' ? 'building but not yet confirmed' : 'early-stage and low-confidence';

  const situation = [];
  if (sig.body) situation.push(sig.body);
  situation.push(`For the ${cat} category, the current signal pattern suggests ${trend} pressure across production, processing, and distribution, with continued exposure to cost volatility.`);

  const businessImpact = [];
  if (sig.whyMatters) businessImpact.push(sig.whyMatters);
  businessImpact.push(`The primary business impacts are expected to be cost, assured supply, and availability${entName === 'this category' ? '' : ' for McDonald\u2019s ' + entName + ' sourcing'}, with potential downstream effects on pricing, supplier resilience, and category planning.`);

  const potentialImpact = sig.strength === 'High' ? 'High' : sig.strength === 'Medium' ? 'Moderate' : 'Low';
  const analystRiskLevel = (sig.strength === 'High' && sig.confidence === 'High') ? 'High'
    : (sig.strength === 'High' || sig.confidence === 'High') ? 'Elevated'
    : sig.strength === 'Medium' ? 'Moderate' : 'Low';

  return {
    disposition, dispositionNote,
    confidence: sig.confidence || 'Medium',
    situation, businessImpact,
    drivers: lib.drivers, actions: lib.actions,
    riskDomain: lib.domain,
    potentialImpact, analystRiskLevel,
  };
}

// ──────────────── small building blocks ────────────────
function ReportCard({ children, style }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
      ...style,
    }}>{children}</div>
  );
}

function ReportSection({ title, children, first, action }) {
  return (
    <div style={{ padding: first ? '0 0 24px' : '24px 0', borderTop: first ? 'none' : '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#171717', letterSpacing: '-0.01em' }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: 'flex', gap: 13, fontSize: 15.5, color: '#404040', lineHeight: 1.55 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a3a3a3', flex: 'none', marginTop: 8 }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function FieldShell({ label, children }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13, color: '#737373', fontWeight: 600, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );
}

function ShareIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  );
}

function ShareButton({ onClick }) {
  const [hover, setHover] = useStateI(false);
  return (
    <button onClick={onClick} title="Share report"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: 36, height: 36, borderRadius: 8, flex: 'none', cursor: 'pointer',
        background: '#fff', color: hover ? '#171717' : '#525252',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.04), inset 0 0 0 1px #d4d4d4',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'color .12s',
      }}>
      <ShareIcon size={17} />
    </button>
  );
}

function MetaSelect({ value, options, onChange }) {
  const [open, setOpen] = useStateI(false);
  const ref = useOutside(() => setOpen(false));
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', height: 44, padding: '0 12px', background: '#fff', borderRadius: 8, cursor: 'pointer', border: 'none',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.04), inset 0 0 0 1px #d4d4d4',
        display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)',
      }}>
        <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#171717', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        <Icon name="chevron-down" size={16} tint={0.5} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 48, left: 0, zIndex: 30, minWidth: '100%', maxWidth: 320,
          background: '#fff', borderRadius: 8, padding: 6,
          boxShadow: '0 12px 28px -8px rgba(16,24,40,0.18), 0 1px 2px 0 rgba(16,24,40,0.06), inset 0 0 0 1px #e5e5e5',
          animation: 'pol-menu .18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {options.map(o => (
            <div key={o} onClick={() => { onChange(o); setOpen(false); }}
              style={{ padding: '8px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 14,
                fontWeight: o === value ? 700 : 500, color: o === value ? '#175cd3' : '#404040',
                background: o === value ? '#f5fafc' : 'transparent', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              onMouseEnter={e => { if (o !== value) e.currentTarget.style.background = '#fafafa'; }}
              onMouseLeave={e => { if (o !== value) e.currentTarget.style.background = 'transparent'; }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function HeaderStatusSelect({ status, onChange }) {
  const [open, setOpen] = useStateI(false);
  const ref = useOutside(() => setOpen(false));
  const cfg = INSIGHT_STATUSES.find(s => s.id === status);
  const tones = { brand: '#175cd3', warning: '#b45309', success: '#15803d', neutral: '#525252' };
  const dot = cfg ? tones[cfg.tone] : '#737373';
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 38, padding: '0 12px', background: '#fff', borderRadius: 8, cursor: 'pointer', border: 'none',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.04), inset 0 0 0 1px #d4d4d4',
        display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: '#171717', whiteSpace: 'nowrap',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flex: 'none' }} />
        Status: {cfg ? cfg.label : '—'}
        <Icon name="chevron-down" size={14} tint={0.55} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 42, right: 0, zIndex: 30, minWidth: 170,
          background: '#fff', borderRadius: 8, padding: 6,
          boxShadow: '0 12px 28px -8px rgba(16,24,40,0.18), 0 1px 2px 0 rgba(16,24,40,0.06), inset 0 0 0 1px #e5e5e5',
          animation: 'pol-menu .18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {INSIGHT_STATUSES.map(s => (
            <div key={s.id} onClick={() => { onChange(s.id); setOpen(false); }}
              style={{ padding: '8px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, background: s.id === status ? '#fafafa' : 'transparent' }}
              onMouseEnter={e => { if (s.id !== status) e.currentTarget.style.background = '#fafafa'; }}
              onMouseLeave={e => { if (s.id !== status) e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: tones[s.tone], flex: 'none' }} />
              <span style={{ fontSize: 13, fontWeight: s.id === status ? 700 : 500, color: '#404040' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────── Risk report view ────────────────
function RiskReportView({ rec, entity, onBack, onOwner, onStatus, onToast }) {
  const { signals, agents, patterns } = window.POLARIS_DATA;
  const sig = signals.find(s => s.id === rec.id) || {};
  const report = useMemoI(() => deriveRiskReport(sig, rec, entity), [rec.id]);

  // Signals + linked pattern feeding this report.
  const relatedSignals = useMemoI(() => {
    const rows = signals.filter(s => s.pattern && s.pattern === sig.pattern);
    return rows.length ? rows : [sig];
  }, [signals, sig.pattern, sig.id]);
  const linkedPattern = useMemoI(() => patterns.find(p => p.title === sig.pattern), [patterns, sig.pattern]);

  const [category, setCategory] = useStateI(rec.category);
  const [riskDomain, setRiskDomain] = useStateI(report.riskDomain);
  const [impact, setImpact] = useStateI(report.potentialImpact);
  const [analyst, setAnalyst] = useStateI(report.analystRiskLevel);
  const [assistOpen, setAssistOpen] = useStateI(false);
  const [section, setSection] = useStateI('summary');
  useEffectI(() => { setSection('summary'); }, [rec.id]);
  useEffectI(() => {
    setCategory(rec.category);
    setRiskDomain(report.riskDomain);
    setImpact(report.potentialImpact);
    setAnalyst(report.analystRiskLevel);
  }, [rec.id]);

  // Esc returns to the list.
  useEffectI(() => {
    const h = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') { e.preventDefault(); onBack(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onBack]);

  const confTone = report.confidence === 'High' ? 'success' : (report.confidence === 'Low' ? 'neutral' : 'warning');

  const categoryOptions = Array.from(new Set([rec.category, 'Markets', 'Supply', 'Supplier', 'Trade', 'Climate', 'Regulatory', 'Demand']));
  const domainOptions = Array.from(new Set([report.riskDomain, ...Object.values(DOMAIN_LIBRARY).map(d => d.domain)]));
  const impactOptions = ['Critical', 'High', 'Moderate', 'Low'];
  const analystOptions = ['High', 'Elevated', 'Moderate', 'Low'];

  return (
    <div style={{ padding: '20px 32px 56px', maxWidth: 1180, margin: '0 auto' }}>
      {/* sub-navigation: back + section tabs */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: 40, marginBottom: 18 }}>
        <button onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none',
          cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: '#404040', padding: '4px 0',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#171717'}
          onMouseLeave={e => e.currentTarget.style.color = '#404040'}>
          <BackArrow size={18} />
          Back to Risk Reports
        </button>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <ReportTabs value={section} onChange={setSection} />
        </div>
      </div>

      {/* header card */}
      <ReportCard style={{ padding: '26px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 360px', minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', lineHeight: 1.2, textWrap: 'pretty' }}>{rec.title}</h2>
            <div style={{ marginTop: 10, fontSize: 14, color: '#737373' }}>
              Date Added: <strong style={{ color: '#404040', fontWeight: 700 }}>{fmtDate(rec.added)}</strong>
              <span style={{ margin: '0 8px', color: '#d4d4d4' }}>•</span>
              Last Updated: <strong style={{ color: '#404040', fontWeight: 700 }}>{fmtRelative(rec.updated)}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto', flexWrap: 'wrap' }}>
            <ShareButton onClick={() => onToast && onToast('Report link copied to clipboard')} />
            <HeaderStatusSelect status={rec.status} onChange={onStatus} />
            <Button variant="secondary" size="sm" onClick={() => onToast && onToast('Regenerating brief — this runs live in the product')}>Regenerate Brief</Button>
            <Button variant="primary" size="sm" onClick={() => setAssistOpen(true)}>
              <span style={{ display: 'inline-flex', marginRight: 2 }}><AssistStar size={15} /></span>
              Open in Polaris Assist
            </Button>
          </div>
        </div>

        <div style={{ height: 1, background: '#f0f0f0', margin: '22px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
          <FieldShell label="Owner"><OwnerSelect owner={rec.owner} onChange={onOwner} /></FieldShell>
          <FieldShell label="Category"><MetaSelect value={category} options={categoryOptions} onChange={setCategory} /></FieldShell>
          <FieldShell label="Risk Domain"><MetaSelect value={riskDomain} options={domainOptions} onChange={setRiskDomain} /></FieldShell>
          <FieldShell label="Potential Impact"><MetaSelect value={impact} options={impactOptions} onChange={setImpact} /></FieldShell>
          <FieldShell label="Analyst Risk Level"><MetaSelect value={analyst} options={analystOptions} onChange={setAnalyst} /></FieldShell>
        </div>
      </ReportCard>

      <div style={{ height: 16 }} />

      {/* body — switches by section tab */}
      {section === 'summary' && (
      <ReportCard style={{ padding: '26px 30px' }}>
        <ReportSection first
          title={`Recommended Disposition: ${report.disposition}`}
          action={<Pill tone={confTone} dot={false} size="sm" style={{ fontWeight: 600 }}>{`Confidence: ${report.confidence}`}</Pill>}
        >
          <div style={{ marginTop: 6, fontSize: 13, color: '#a3a3a3', fontWeight: 600 }}>Generated: {GENERATED_LABEL}</div>
          <p style={{ margin: '12px 0 0', fontSize: 15.5, color: '#404040', lineHeight: 1.6 }}>{report.dispositionNote}</p>
        </ReportSection>

        <ReportSection title="Situation Summary">
          {report.situation.map((p, i) => (
            <p key={i} style={{ margin: i === 0 ? '12px 0 0' : '14px 0 0', fontSize: 15.5, color: '#404040', lineHeight: 1.65 }}>{p}</p>
          ))}
        </ReportSection>

        <ReportSection title="Business Impact">
          {report.businessImpact.map((p, i) => (
            <p key={i} style={{ margin: i === 0 ? '12px 0 0' : '14px 0 0', fontSize: 15.5, color: '#404040', lineHeight: 1.65 }}>{p}</p>
          ))}
        </ReportSection>

        <ReportSection title="Key Risk Drivers / Watch Indicators">
          <BulletList items={report.drivers} />
        </ReportSection>

        <ReportSection title="Recommended Mitigation Actions">
          <BulletList items={report.actions} />
        </ReportSection>
      </ReportCard>
      )}

      {section === 'signals' && <ReportSignalsTab signals={relatedSignals} mainId={sig.id} agents={agents} entity={entity} />}
      {section === 'pattern' && <ReportPatternTab pattern={linkedPattern} patternName={sig.pattern} agents={agents} />}
      {section === 'activity' && <ReportActivityTab rec={rec} report={report} owner={rec.owner} />}

      {assistOpen && (
        <PolarisAssist
          connectedTitle={`${rec.title}${entity && entity.name ? ' — ' + entity.name : ''}`}
          onClose={() => setAssistOpen(false)}
          onReturnToast={(m) => onToast && onToast(m)}
        />
      )}
    </div>
  );
}

function BackArrow({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function ReportTabs({ value, onChange }) {
  const tabs = ['Summary', 'Signals', 'Pattern', 'Activity'];
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {tabs.map(t => {
        const id = t.toLowerCase();
        const active = value === id;
        return (
          <button key={t} onClick={() => onChange(id)} style={{
            padding: '8px 18px', border: 'none', borderRadius: 8, cursor: 'pointer',
            background: active ? '#fff' : 'transparent',
            boxShadow: active ? '0 1px 2px 0 rgba(0,0,0,0.06), inset 0 0 0 1px #e5e5e5' : 'none',
            color: active ? '#171717' : '#737373',
            fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-sans)', transition: 'color .12s, background .12s',
          }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#404040'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#737373'; }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}

// ──────────────── Signals tab ────────────────
function ReportSignalsTab({ signals, mainId, agents, entity }) {
  const agentMap = Object.fromEntries(agents.map(a => [a.id, a]));
  return (
    <ReportCard style={{ overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>Signals used in this report</div>
        <div style={{ fontSize: 13, color: '#737373', marginTop: 3 }}>{signals.length} corroborating signal{signals.length === 1 ? '' : 's'} across {new Set(signals.map(s => s.agent)).size} agents</div>
      </div>
      {signals.map((s, i) => {
        const a = agentMap[s.agent];
        return (
          <div key={s.id} style={{ padding: '16px 24px', borderTop: i === 0 ? 'none' : '1px solid #f0f0f0', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <Strength level={s.strength} mode="badge" />
                <span style={{ fontSize: 12, color: '#525252', fontWeight: 600 }}>{s.type}</span>
                {s.id === mainId && <Pill tone="brand" dot={false} size="xs">Primary</Pill>}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#171717', lineHeight: 1.35 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, color: '#525252', marginTop: 5, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.body}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 9, fontSize: 12, color: '#737373', flexWrap: 'wrap' }}>
                {a && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: a.color, fontWeight: 700 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 3, background: `${a.color}14`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={a.icon} size={10} /></span>
                    {a.name}
                  </span>
                )}
                <span>·</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{s.date}</span>
                <span>·</span>
                <span>{s.evidence} evidence pts</span>
              </div>
            </div>
          </div>
        );
      })}
    </ReportCard>
  );
}

// ──────────────── Pattern tab ────────────────
function ReportPatternTab({ pattern, patternName, agents }) {
  if (!pattern) {
    return (
      <ReportCard style={{ padding: '26px 30px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#171717', marginBottom: 6 }}>{patternName || 'Linked pattern'}</div>
        <p style={{ margin: 0, fontSize: 14.5, color: '#737373', lineHeight: 1.6 }}>This report is associated with the pattern above. The full pattern record opens in the Patterns tab.</p>
      </ReportCard>
    );
  }
  const matTone = pattern.maturity === 'Insight-Ready' ? 'success' : (pattern.maturity === 'Developing' ? 'brand' : 'neutral');
  const ents = pattern.entitiesFull || pattern.entities || [];
  const blocks = [
    ['What changed', pattern.whatChanged],
    ['Why it matters', pattern.whyMatters],
    ['Recommendation', pattern.recommendation],
  ].filter(b => b[1]);
  return (
    <ReportCard style={{ padding: '26px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <Pill tone={matTone} dot={false}>{pattern.maturity}</Pill>
            <Strength level={pattern.strength} mode="badge" />
            {pattern.type && <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 600 }}>{pattern.type}</span>}
          </div>
          <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#171717', letterSpacing: '-0.01em', lineHeight: 1.3, textWrap: 'pretty' }}>{pattern.title}</h3>
        </div>
        <Button variant="secondary" size="sm" trailingIcon="arrow-up-right" onClick={() => pattern.insightUrl && window.open(pattern.insightUrl, '_blank', 'noopener,noreferrer')}>Open pattern</Button>
      </div>

      {ents.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 600 }}>Entities:</span>
          {ents.map(e => <Pill key={e} tone="neutral" dot={false} size="xs">{e}</Pill>)}
        </div>
      )}

      {blocks.map(([label, text], i) => (
        <div key={label} style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#737373', marginBottom: 8 }}>{label}</div>
          <p style={{ margin: 0, fontSize: 14.5, color: '#404040', lineHeight: 1.65 }}>{text}</p>
        </div>
      ))}
    </ReportCard>
  );
}

// ──────────────── Activity tab ────────────────
function ReportActivityTab({ rec, report, owner }) {
  const events = [];
  events.push({ icon: 'bar-chart-square-02', color: '#1570ef', title: 'Risk report generated', meta: `Polaris · ${GENERATED_LABEL}`, body: `Synthesized from ${report.confidence.toLowerCase()}-confidence signals into a ${report.disposition} disposition.` });
  if (owner) events.push({ icon: 'users-01', color: '#7c3aed', title: `Owner assigned — ${owner}`, meta: fmtDate(rec.added), body: 'Report routed to an analyst for review.' });
  events.push({ icon: 'shield-tick', color: '#15803d', title: `Status set to "${rec.status}"`, meta: fmtRelative(rec.updated), body: 'Workflow state updated on the report.' });
  events.push({ icon: 'trend-up-01', color: '#b45309', title: 'Draft brief generated in Polaris Assist', meta: `${GENERATED_LABEL} · 9:42 AM`, body: 'Full Risk Mitigation Brief drafted; condensed summary synced back to this report.' });
  events.push({ icon: 'bell-01', color: '#0891b2', title: 'Brief shared by email', meta: `${GENERATED_LABEL} · 9:48 AM`, body: 'Sent to beef.procurement@mcd.com and category.risk@mcd.com.' });

  return (
    <ReportCard style={{ padding: '26px 30px' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#171717', marginBottom: 4 }}>Activity</div>
      <div style={{ fontSize: 13, color: '#737373', marginBottom: 20 }}>Timeline of generation, workflow, and Polaris Assist actions on this report.</div>
      <div style={{ position: 'relative' }}>
        {events.map((ev, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i === events.length - 1 ? 0 : 22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: `${ev.color}14`, color: ev.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ev.icon} size={16} /></span>
              {i !== events.length - 1 && <span style={{ width: 2, flex: 1, background: '#f0f0f0', marginTop: 4 }} />}
            </div>
            <div style={{ minWidth: 0, paddingBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: '#171717' }}>{ev.title}</span>
                <span style={{ fontSize: 12, color: '#a3a3a3', fontWeight: 600 }}>{ev.meta}</span>
              </div>
              <div style={{ fontSize: 13.5, color: '#525252', marginTop: 3, lineHeight: 1.55 }}>{ev.body}</div>
            </div>
          </div>
        ))}
      </div>
    </ReportCard>
  );
}

Object.assign(window, { EntityInsights });
