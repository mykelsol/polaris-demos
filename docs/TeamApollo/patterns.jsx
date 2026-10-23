// Polaris — Patterns table view + Pattern drawer

// ──────────────── Maturity + Strength pills for Patterns ────────────────
// Patterns use a "maturity" lifecycle (Emerging → Developing → Insight-Ready)
// and a positive-direction strength scale where High = good signal density.
// These tones intentionally differ from the Signals table (where High = red/urgent).

const MATURITY_TONE = {
  'Insight-Ready': 'success',
  'Developing':    'brand',
  'Emerging':      'neutral',
};

const PATTERN_STRENGTH_TONE = {
  'High':   'success',
  'Medium': 'brand',
  'Low':    'neutral',
};

function MaturityPill({ value }) {
  return <Pill tone={MATURITY_TONE[value] || 'neutral'} dot={false}>{value}</Pill>;
}

function PatternStrengthPill({ value }) {
  return <Pill tone={PATTERN_STRENGTH_TONE[value] || 'neutral'} dot={false}>{value}</Pill>;
}

// ──────────────── Patterns View (filter bar + table) ────────────────
function PatternsView({ onPick, pickedId, density }) {
  const { patterns } = window.POLARIS_DATA;
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState('table');
  const [filters, setFilters] = React.useState({
    maturity: 'All', type: 'All', entity: 'All', agent: 'All', strength: 'All', date: 'Last 30 days',
  });

  const filtered = React.useMemo(() => {
    let rows = patterns;
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        (p.entitiesFull || []).some(e => e.toLowerCase().includes(q))
      );
    }
    if (filters.maturity !== 'All') rows = rows.filter(p => p.maturity === filters.maturity);
    if (filters.strength !== 'All') rows = rows.filter(p => p.strength === filters.strength);
    if (filters.type !== 'All')     rows = rows.filter(p => p.type === filters.type);
    if (filters.entity !== 'All')   rows = rows.filter(p => (p.entitiesFull || []).includes(filters.entity));
    if (filters.agent !== 'All') {
      const { agents } = window.POLARIS_DATA;
      const a = agents.find(x => x.name === filters.agent);
      if (a) rows = rows.filter(p => p.agent === a.id);
    }
    return rows;
  }, [patterns, query, filters]);

  const clearAll = () => {
    setQuery('');
    setFilters({ maturity: 'All', type: 'All', entity: 'All', agent: 'All', strength: 'All', date: 'Last 30 days' });
  };

  return (
    <>
      <PatternsFilterBar
        query={query} onQuery={setQuery}
        view={view} onView={setView}
        filters={filters}
        onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        onClearAll={clearAll}
      />
      {view === 'table'
        ? <PatternsTable patterns={filtered} onPick={onPick} pickedId={pickedId} density={density} />
        : <PatternsListView patterns={filtered} onPick={onPick} pickedId={pickedId} />
      }
    </>
  );
}

// ──────────────── Filter bar (patterns-specific) ────────────────
function PatternsFilterBar({ query, onQuery, view, onView, filters, onFilterChange, onClearAll }) {
  const data = window.POLARIS_DATA;
  const patternTypes = Array.from(new Set(data.patterns.map(p => p.type)));
  const entityNames = data.entities.map(e => e.name);
  const agentNames = data.agents.map(a => a.name);
  const filterDefs = [
    { key: 'maturity', label: 'Maturity', options: ['All', 'Insight-Ready', 'Developing', 'Emerging'] },
    { key: 'type',     label: 'Theme',    options: ['All', ...patternTypes] },
    { key: 'entity',   label: 'Entity',   options: ['All', ...entityNames] },
    { key: 'agent',    label: 'Agent',    options: ['All', ...agentNames] },
    { key: 'strength', label: 'Strength', options: ['All', 'High', 'Medium', 'Low'] },
    { key: 'date',     label: 'Date Range', options: ['Last 30 days', 'Last 7 days', 'Last 24 hours', 'All time'], defaultValue: 'Last 30 days' },
  ];

  return (
    <div style={{ padding: '24px 32px 0' }}>
      <div style={{
        background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 12,
        padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Search + view switch */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{
            flex: 1, height: 40, borderRadius: 8, background: '#fff',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #d4d4d4',
            display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
          }}>
            <Icon name="search-lg" size={18} tint={0.55} />
            <input
              value={query}
              onChange={e => onQuery(e.target.value)}
              placeholder="Search patterns by name, type, or entity…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'var(--font-sans)', fontSize: 14, color: '#171717',
              }}
            />
            {query && <IconButton icon="x-close" size={24} onClick={() => onQuery('')} title="Clear" />}
            <Kbd>⌘K</Kbd>
          </div>
          <div style={{
            display: 'inline-flex',
            background: '#fff', borderRadius: 8,
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #d4d4d4',
            overflow: 'hidden', flex: 'none', height: 40,
          }}>
            {['table', 'list'].map((v, i, arr) => (
              <button key={v} onClick={() => onView(v)} style={{
                padding: '0 14px', height: 40, border: 'none',
                borderRight: i < arr.length - 1 ? '1px solid #e5e5e5' : 'none',
                background: view === v ? '#fafafa' : '#fff',
                color: view === v ? '#171717' : '#525252',
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', textTransform: 'capitalize',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <Icon name={v === 'table' ? 'bar-chart-square-02' : 'filter-lines'} size={14} />
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {filterDefs.map(f => (
            <FilterChip
              key={f.key}
              label={f.label}
              options={f.options}
              value={filters[f.key]}
              defaultValue={f.defaultValue}
              onChange={v => onFilterChange(f.key, v)}
            />
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <Button variant="ghost" size="xs" onClick={onClearAll}>Clear all</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────── Patterns Table ────────────────
function PatternsTable({ patterns, onPick, pickedId, density }) {
  const [sort, setSort] = React.useState({ key: 'updated', dir: 'desc' });
  const [openMenu, setOpenMenu] = React.useState(null);

  const maturityRank = { Emerging: 0, Developing: 1, 'Insight-Ready': 2 };
  const strengthRank = { Low: 0, Medium: 1, High: 2 };
  const updatedRank = s => {
    const m = { 'hrs ago': 1, 'hr ago': 1, 'min ago': 1, 'Yesterday': 24, 'days ago': 48, 'day ago': 24 };
    if (s.includes('min')) return parseInt(s) || 0;
    if (s.includes('hr'))  return (parseInt(s) || 1) * 60;
    if (s === 'Yesterday') return 24 * 60;
    if (s.includes('day')) return (parseInt(s) || 1) * 24 * 60;
    return 9999;
  };

  const sorted = React.useMemo(() => {
    const rows = [...patterns];
    const dir = sort.dir === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      if (sort.key === 'maturity') return (maturityRank[a.maturity] - maturityRank[b.maturity]) * dir;
      if (sort.key === 'strength') return (strengthRank[a.strength] - strengthRank[b.strength]) * dir;
      if (sort.key === 'pattern')  return a.title.localeCompare(b.title) * dir;
      if (sort.key === 'entities') return (a.entities[0] || '').localeCompare(b.entities[0] || '') * dir;
      if (sort.key === 'type')     return a.type.localeCompare(b.type) * dir;
      if (sort.key === 'updated')  return (updatedRank(a.updated) - updatedRank(b.updated)) * dir;
      return 0;
    });
    return rows;
  }, [patterns, sort]);

  const toggleSort = key => setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });

  const rowPad = density === 'compact' ? '12px 16px' : '16px 16px';
  const insightReady = patterns.filter(p => p.maturity === 'Insight-Ready').length;

  const cols = [
    { key: 'pattern',  label: 'Pattern',  width: 'auto', minW: 320 },
    { key: 'maturity', label: 'Maturity', width: 130 },
    { key: 'strength', label: 'Strength', width: 110 },
    { key: 'entities', label: 'Entities', width: 200 },
    { key: 'type',     label: 'Theme',    width: 160 },
    { key: 'updated',  label: 'Updated',  width: 110 },
  ];

  return (
    <div style={{
      margin: '24px 32px 0',
      background: '#fff', borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
      overflow: 'visible',
    }}>
      <CardHeader
        title="Patterns"
        subtitle={`${patterns.length} active patterns · ${insightReady} insight-ready`}
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', tableLayout: 'auto' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
              {cols.map(col => (
                <th key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    textAlign: 'left', padding: '10px 16px',
                    fontSize: 12, fontWeight: 700, color: '#525252', whiteSpace: 'nowrap',
                    width: col.width, minWidth: col.minW,
                    cursor: 'pointer', userSelect: 'none',
                  }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    <PatternSortArrow active={sort.key === col.key} dir={sort.dir} />
                  </span>
                </th>
              ))}
              <th style={{ width: 56, padding: '10px 16px' }}>
                <Checkbox indeterminate />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const isPicked = pickedId === p.id;
              const isMenuOpen = openMenu === p.id;
              return (
                <tr
                  key={p.id}
                  onClick={() => onPick(p)}
                  style={{
                    borderBottom: i < sorted.length - 1 ? '1px solid #f5f5f5' : 'none',
                    cursor: 'pointer',
                    transition: 'background .12s',
                    background: isPicked ? '#f5fafc' : (isMenuOpen ? '#fafafa' : 'transparent'),
                  }}
                  onMouseEnter={e => { if (!isPicked) e.currentTarget.style.background = '#fafafa'; }}
                  onMouseLeave={e => { if (!isPicked && !isMenuOpen) e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: rowPad, maxWidth: 420 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: '#171717', lineHeight: 1.4,
                    }}>{p.title}</div>
                  </td>
                  <td style={{ padding: rowPad }}>
                    <MaturityPill value={p.maturity} />
                  </td>
                  <td style={{ padding: rowPad }}>
                    <PatternStrengthPill value={p.strength} />
                  </td>
                  <td style={{ padding: rowPad, fontSize: 13, color: '#404040', fontWeight: 600, lineHeight: 1.4 }}>
                    {p.entities.join(', ')}
                  </td>
                  <td style={{ padding: rowPad, fontSize: 13, color: '#525252', whiteSpace: 'nowrap' }}>
                    {p.type}
                  </td>
                  <td style={{
                    padding: rowPad,
                    fontFamily: 'var(--font-mono)', fontSize: 12, color: '#525252',
                    whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
                  }}>
                    {p.updated}
                  </td>
                  <td style={{ padding: rowPad, position: 'relative' }} onClick={e => e.stopPropagation()}>
                    <IconButton
                      icon="dots-vertical"
                      onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                      active={isMenuOpen}
                    />
                    {isMenuOpen && (
                      <PatternRowMenu
                        pattern={p}
                        onClose={() => setOpenMenu(null)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '64px 16px', textAlign: 'center' }}>
                  <div style={{ color: '#737373', fontSize: 14 }}>
                    <div style={{ fontWeight: 700, color: '#404040', fontSize: 15, marginBottom: 6 }}>
                      No patterns match these filters
                    </div>
                    Loosen the maturity or strength filters, or reset to defaults.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination total={patterns.length} />
    </div>
  );
}

function PatternSortArrow({ active, dir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: active ? 1 : 0.4 }}>
      <path d={dir === 'asc' ? 'M5 2 L8 6 L2 6 Z' : 'M5 8 L2 4 L8 4 Z'} fill="#737373" />
    </svg>
  );
}

function PatternRowMenu({ pattern, onClose }) {
  const items = [
    { icon: 'plus',     label: 'Generate Risk Report', action: 'generate' },
    { icon: 'bell-01',  label: 'Monitor' },
    { divider: true },
    { icon: 'x-close',  label: 'Dismiss', danger: true },
  ];
  const handleClick = (it) => {
    if (it.action === 'generate' && pattern?.insightUrl) {
      window.open(pattern.insightUrl, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };
  return (
    <div style={{
      position: 'absolute', right: 16, top: 'calc(100% - 4px)',
      minWidth: 180,
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 12px 28px -8px rgba(16,24,40,0.18), 0 1px 2px 0 rgba(16,24,40,0.06), inset 0 0 0 1px #e5e5e5',
      padding: 6, zIndex: 30,
      animation: 'pol-menu .18s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {items.map((it, i) => it.divider ? (
        <div key={i} style={{ height: 1, background: '#f0f0f0', margin: '4px 4px' }} />
      ) : (
        <div key={i}
          onClick={() => handleClick(it)}
          style={{
            padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 13, fontWeight: 600,
            color: it.danger ? '#b91c1c' : '#404040',
          }}
          onMouseEnter={e => e.currentTarget.style.background = it.danger ? '#fef2f2' : '#fafafa'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Icon name={it.icon} size={16} tint={it.danger ? 1 : 0.7} />
          {it.label}
        </div>
      ))}
    </div>
  );
}

// ──────────────── Patterns List (alternate view) ────────────────
function PatternsListView({ patterns, onPick, pickedId }) {
  const { agents } = window.POLARIS_DATA;
  const agentMap = Object.fromEntries(agents.map(a => [a.id, a]));
  return (
    <div style={{
      margin: '24px 32px 0',
      background: '#fff', borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
      overflow: 'hidden',
    }}>
      <CardHeader title="Patterns" subtitle={`${patterns.length} active patterns`} />
      <div>
        {patterns.map((p, i) => {
          const a = agentMap[p.agent];
          const isPicked = pickedId === p.id;
          return (
            <div key={p.id} onClick={() => onPick(p)} style={{
              padding: '16px 24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer',
              background: isPicked ? '#f5fafc' : 'transparent',
              transition: 'background .12s',
            }}
              onMouseEnter={e => { if (!isPicked) e.currentTarget.style.background = '#fafafa'; }}
              onMouseLeave={e => { if (!isPicked) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${a.color}14`, color: a.color,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flex: 'none',
              }}><Icon name={a.icon} size={20} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#171717', lineHeight: 1.4 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: '#737373', marginTop: 4 }}>
                  {a.name} · {p.type} · {p.entities.join(', ')} · updated {p.updated}
                </div>
              </div>
              <MaturityPill value={p.maturity} />
              <PatternStrengthPill value={p.strength} />
              <Icon name="chevron-right" size={16} tint={0.4} />
            </div>
          );
        })}
        {patterns.length === 0 && (
          <div style={{ padding: '64px 24px', textAlign: 'center', color: '#737373', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 700, color: '#404040', fontSize: 15, marginBottom: 6 }}>No patterns match these filters</div>
            Loosen the maturity or strength filters, or reset to defaults.
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────── Pattern Drawer ────────────────
function PatternDrawer({ pattern, onClose, drawerWidth }) {
  const [supportingOpen, setSupportingOpen] = React.useState(true);
  const [assistInput, setAssistInput] = React.useState('');
  const [assistResponse, setAssistResponse] = React.useState('');
  const [assistLoading, setAssistLoading] = React.useState(false);

  if (!pattern) return null;
  const { agents } = window.POLARIS_DATA;
  const agent = agents.find(a => a.id === pattern.agent);

  const askAssist = async () => {
    if (!assistInput.trim() || assistLoading) return;
    setAssistLoading(true);
    setAssistResponse('');
    try {
      if (!window.claude || !window.claude.complete) {
        setAssistResponse("Polaris Assist needs an online connection. In the live product, this box answers questions about the pattern in two sentences.");
        return;
      }
      const prompt = `You are Polaris Assist, an analyst AI inside a B2B signal-monitoring product. A user is reading a Pattern.
Answer their question in 2 short sentences, analyst voice, no fluff.

PATTERN: ${pattern.title}
MATURITY: ${pattern.maturity} · STRENGTH: ${pattern.strength} · CONFIDENCE: ${pattern.confidence}
TYPE: ${pattern.type}
ENTITIES: ${(pattern.entitiesFull || pattern.entities).join(', ')}
WHAT CHANGED: ${pattern.whatChanged}
WHY IT MATTERS: ${pattern.whyMatters}
RECOMMENDATION: ${pattern.recommendation}

USER QUESTION: ${assistInput}`;
      const reply = await window.claude.complete(prompt);
      setAssistResponse(reply);
    } catch (e) {
      setAssistResponse("(Polaris Assist is offline in this preview.)");
    } finally {
      setAssistLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(12,14,18,0.45)',
        backdropFilter: 'blur(4px)', zIndex: 10, animation: 'pol-fade-in .2s ease',
      }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: drawerWidth,
        background: '#fff', borderLeft: '1px solid #e5e5e5',
        boxShadow: '-12px 0 28px -8px rgba(16,24,40,0.18)',
        zIndex: 11, display: 'flex', flexDirection: 'column',
        animation: 'pol-slide-in .25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 18px',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          flex: 'none', background: '#fff',
        }}>
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: 'var(--font-sans)',
            fontWeight: 700, fontSize: 16, lineHeight: '24px',
            color: '#171717', letterSpacing: '-0.01em',
          }}>{pattern.title}</h2>
          <div style={{ display: 'flex', gap: 4 }}>
            <IconButton icon="dots-vertical" size={28} title="More" />
            <button title="Generate Risk Report"
              onClick={() => pattern.insightUrl && window.open(pattern.insightUrl, '_blank', 'noopener,noreferrer')}
              style={{
              width: 28, height: 28, borderRadius: 6, border: 'none',
              background: 'transparent', color: '#525252', cursor: pattern.insightUrl ? 'pointer' : 'default',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><AssistStar size={16} /></button>
            <IconButton icon="x-close" size={28} title="Close" onClick={onClose} />
          </div>
        </div>

        {/* Scroll body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '20px 24px 24px' }}>
            {/* Metadata block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6,
              fontSize: 13, color: '#404040', lineHeight: '20px' }}>
              <div>
                <span style={{ fontWeight: 700, color: '#171717' }}>{pattern.maturity.replace('-', ' ')}</span>
                <span style={{ color: '#a3a3a3', margin: '0 8px' }}>·</span>
                <span>{pattern.type}</span>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: '#171717' }}>Strength</span>: {pattern.strength}
                <span style={{ color: '#a3a3a3', margin: '0 8px' }}>·</span>
                <span style={{ fontWeight: 700, color: '#171717' }}>Confidence:</span> {pattern.confidence}
              </div>
              <div>
                <span style={{ fontWeight: 700, color: '#171717' }}>Producing Agent</span>:{' '}
                <a style={{ color: '#1570ef', fontWeight: 600, textDecoration: 'none' }}>{agent.name}</a>
                <span style={{ color: '#a3a3a3', margin: '0 8px' }}>·</span>
                <a style={{ color: '#1570ef', fontWeight: 600, textDecoration: 'none' }}>{pattern.strategy}</a>
              </div>
            </div>

            <DrawerHRule />

            <PatternSection title="What Changed">
              <p style={{ margin: 0, fontSize: 14, color: '#404040', lineHeight: 1.55 }}>{pattern.whatChanged}</p>
            </PatternSection>

            <PatternSection title="Why it matters">
              <p style={{ margin: 0, fontSize: 14, color: '#404040', lineHeight: 1.55 }}>{pattern.whyMatters}</p>
            </PatternSection>

            <PatternSection title="Recommendation">
              <p style={{ margin: 0, fontSize: 14, color: '#404040', lineHeight: 1.55 }}>{pattern.recommendation}</p>
            </PatternSection>

            <PatternSection title="Emphasize:">
              <ul style={{ margin: 0, paddingLeft: 22, fontSize: 14, color: '#404040', lineHeight: 1.7 }}>
                {pattern.emphasize.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </PatternSection>

            <DrawerHRule />

            <PatternSection title="Evidence">
              <p style={{ margin: 0, fontSize: 14, color: '#404040', lineHeight: 1.55, marginBottom: 14 }}>
                {pattern.evidenceIntro}
              </p>
              <EvidenceTable rows={pattern.evidenceFactors} />
            </PatternSection>

            <DrawerHRule />

            <SupportingSignalsCard
              open={supportingOpen}
              onToggle={() => setSupportingOpen(o => !o)}
              intro={pattern.supportingIntro}
              signals={pattern.supportingSignals}
            />

            {/* Polaris Assist input */}
            <div style={{ marginTop: 20 }}>
              {assistResponse && (
                <div style={{
                  background: '#fafafa', borderRadius: 8,
                  padding: '12px 14px', marginBottom: 10,
                  fontSize: 13, color: '#404040', lineHeight: 1.55,
                  boxShadow: 'inset 0 0 0 1px #e5e5e5',
                  whiteSpace: 'pre-wrap',
                }}>{assistResponse}</div>
              )}
              <div style={{
                background: '#fff', borderRadius: 12,
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
                padding: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <textarea
                    value={assistInput}
                    onChange={e => setAssistInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAssist(); } }}
                    placeholder="Query with Polaris Assist"
                    rows={1}
                    style={{
                      flex: 1, border: 'none', outline: 'none', resize: 'none',
                      background: 'transparent',
                      fontFamily: 'var(--font-sans)', fontSize: 14,
                      color: '#171717', lineHeight: 1.5,
                      minHeight: 24, padding: '2px 0',
                    }}
                  />
                  <button title="Voice" style={{
                    width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer',
                    color: '#737373', flex: 'none',
                  }}><MicIcon size={18} /></button>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginTop: 14, paddingTop: 10, borderTop: '1px solid #f5f5f5',
                }}>
                  <button onClick={askAssist} disabled={assistLoading || !assistInput.trim()} style={{
                    background: 'transparent', border: 'none', cursor: assistLoading ? 'wait' : 'pointer',
                    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12,
                    color: '#737373',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: 0,
                  }}>
                    <PaperclipIcon size={14} />
                    {assistLoading ? 'Thinking…' : 'Attach'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e5e5e5',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          background: '#fff', flex: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Button variant="secondary" size="sm" onClick={onClose}>Dismiss</Button>
            <FeedbackButton icon="thumbs-down" />
            <FeedbackButton icon="thumbs-up" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button variant="secondary" size="sm">Monitor</Button>
            <Button variant="primary" size="sm"
              onClick={() => pattern.insightUrl && window.open(pattern.insightUrl, '_blank', 'noopener,noreferrer')}>Generate Risk Report</Button>
          </div>
        </div>
      </aside>
    </>
  );
}

function PatternSection({ title, children }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#171717', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function DrawerHRule() {
  return <div style={{ height: 1, background: '#e5e5e5', margin: '22px 0 4px' }} />;
}

function EvidenceTable({ rows }) {
  return (
    <div style={{
      borderRadius: 8,
      boxShadow: 'inset 0 0 0 1px #e5e5e5',
      overflow: 'hidden',
      background: '#fff',
    }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: 'var(--font-sans)',
      }}>
        <thead>
          <tr style={{ background: '#fafafa' }}>
            <th style={{
              textAlign: 'left', padding: '10px 16px',
              fontSize: 12, fontWeight: 700, color: '#525252',
              borderBottom: '1px solid #e5e5e5',
              width: '38%',
            }}>Evidence Factor</th>
            <th style={{
              textAlign: 'left', padding: '10px 16px',
              fontSize: 12, fontWeight: 700, color: '#525252',
              borderBottom: '1px solid #e5e5e5',
            }}>Assessment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.factor} style={{
              borderTop: i === 0 ? 'none' : '1px solid #f5f5f5',
            }}>
              <td style={{
                padding: '14px 16px', verticalAlign: 'top',
                fontSize: 13, fontWeight: 700, color: '#171717', lineHeight: 1.5,
              }}>{r.factor}</td>
              <td style={{
                padding: '14px 16px', verticalAlign: 'top',
                fontSize: 13, color: '#404040', lineHeight: 1.55,
              }}>{r.assessment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SupportingSignalsCard({ open, onToggle, intro, signals }) {
  return (
    <div style={{
      borderRadius: 12, boxShadow: 'inset 0 0 0 1px #e5e5e5',
      overflow: 'hidden', background: '#fff',
    }}>
      <button onClick={onToggle} style={{
        width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
        padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'var(--font-sans)',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>Top Supporting Signals</span>
        <span style={{
          display: 'inline-flex', transition: 'transform .2s',
          transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
        }}><Icon name="chevron-down" size={16} tint={0.5} /></span>
      </button>
      {open && (
        <div style={{ padding: '0 18px 18px' }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: '#525252', lineHeight: 1.6 }}>{intro}</p>
          {signals.map((s, i) => (
            <div key={i} style={{
              padding: '14px 0',
              borderTop: '1px solid #f0f0f0',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#171717', lineHeight: 1.4 }}>{s.title}</div>
              <div style={{
                fontSize: 12, color: '#525252', marginTop: 4, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
              }}>
                <span style={{ fontWeight: 700, color: '#404040' }}>{s.tag}</span>
                <span style={{ color: '#a3a3a3' }}>·</span>
                <span>{s.source}</span>
                <span style={{ color: '#a3a3a3' }}>·</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>Detected {s.detected}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: '#525252', lineHeight: 1.55 }}>{s.body}</div>
            </div>
          ))}
          <div style={{ paddingTop: 14 }}>
            <Button variant="link" trailingIcon="arrow-up-right">View All Signals</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackButton({ icon }) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => setActive(a => !a)}
      style={{
        width: 32, height: 32, borderRadius: 8,
        border: 'none', cursor: 'pointer',
        background: '#fff',
        color: active ? '#1570ef' : '#737373',
        boxShadow: hover || active
          ? '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.04), inset 0 0 0 1px ' + (active ? '#84caff' : '#d4d4d4')
          : '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px #d4d4d4',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'box-shadow .12s, color .12s',
      }}>
      {icon === 'thumbs-up' ? <ThumbsUpIcon size={16} /> : <ThumbsDownIcon size={16} />}
    </button>
  );
}

// ──────────────── Inline SVGs (icons not in the asset set) ────────────────
function ThumbsUpIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.66" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3z" />
      <path d="M7 11l4-7a2.5 2.5 0 0 1 2.5 2.5V10h5.6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 18 21H7" />
    </svg>
  );
}
function ThumbsDownIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.66" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 13V4H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3z" />
      <path d="M7 13l4 7a2.5 2.5 0 0 0 2.5-2.5V14h5.6a2 2 0 0 0 2-2.3l-1.2-7A2 2 0 0 0 18 3H7" />
    </svg>
  );
}
function MicIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.66" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}
function PaperclipIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.66" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5l-9 9a5 5 0 0 1-7-7L13 5a3.5 3.5 0 0 1 5 5L9 19a2 2 0 0 1-3-3l8-8" />
    </svg>
  );
}

Object.assign(window, { PatternsView, PatternDrawer });
