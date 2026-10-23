// Polaris signals view — PageHeader, FilterBar, SignalsTable, row action menu

const { useState, useMemo, useRef, useEffect } = React;

// ──────────────── PageHeader + Tabs ────────────────
function PageHeader({ title, tabs, activeTab, onTab }) {
  return (
    <div style={{ padding: '32px 32px 0', flex: 'none' }}>
      <h1 style={{
        margin: 0,
        fontSize: 20, fontWeight: 700, color: '#171717',
        lineHeight: '30px', letterSpacing: '-0.01em',
      }}>{title}</h1>
      {tabs && (
        <div style={{
          marginTop: 16, borderBottom: '1px solid #e5e5e5',
          display: 'flex', gap: 0,
        }}>
          {tabs.map(t => {
            const active = t.id === activeTab;
            return (
              <Tab key={t.id} tab={t} active={active} onClick={() => onTab(t.id)} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function Tab({ tab, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: '10px 4px',
        marginRight: 16,
        fontSize: 14,
        fontWeight: active ? 700 : 600,
        color: active ? '#175cd3' : (hover ? '#171717' : '#737373'),
        cursor: 'pointer',
        borderBottom: `2px solid ${active ? '#1570ef' : 'transparent'}`,
        marginBottom: -1,
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'color .12s',
      }}>
      {tab.label}
      {tab.count != null && (
        <span style={{
          padding: '1px 7px', borderRadius: 9999,
          background: active ? '#d1e9ff' : '#f5f5f5',
          color: active ? '#175cd3' : '#525252',
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
        }}>{tab.count}</span>
      )}
    </div>
  );
}

// ──────────────── FilterBar ────────────────
function FilterBar({
  query, onQuery,
  view, onView,
  filters, onFilterChange,
  onClearAll,
  showStrengthFilter,
  searchPlaceholder = "Search signals by name, context, type, entity, agent…",
}) {
  const allFilters = useMemo(() => {
    const data = window.POLARIS_DATA;
    const types = Array.from(new Set(data.signals.map(s => s.type)));
    const entities = data.entities.map(e => e.name);
    const agents = data.agents.map(a => a.name);
    const base = [
      { key: 'status',   label: 'Status',     options: ['All', 'Unread', 'Reviewed', 'Snoozed'] },
      { key: 'strength', label: 'Strength',   options: ['All', 'High', 'Medium', 'Low'] },
      { key: 'type',     label: 'Theme',      options: ['All', ...types] },
      { key: 'entity',   label: 'Entities',   options: ['All', ...entities] },
      { key: 'agent',    label: 'Agent',      options: ['All', ...agents] },
      { key: 'date',     label: 'Date Range', options: ['Last 30 days', 'Last 7 days', 'Last 24 hours', 'All time'], defaultValue: 'Last 30 days' },
    ];
    return base;
  }, []);

  return (
    <div style={{ padding: '24px 32px 0' }}>
      <div style={{
        background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 12,
        padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* search + view switch */}
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
              placeholder={searchPlaceholder}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'var(--font-sans)', fontSize: 14, color: '#171717',
              }}
            />
            {query && (
              <IconButton icon="x-close" size={24} onClick={() => onQuery('')} title="Clear" />
            )}
            <Kbd>⌘K</Kbd>
          </div>
          {/* view switch — Table / List */}
          <div style={{
            display: 'inline-flex',
            background: '#fff', borderRadius: 8,
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #d4d4d4',
            overflow: 'hidden', flex: 'none', height: 40,
          }}>
            {['table', 'list'].map((v, i, arr) => (
              <button key={v} onClick={() => onView(v)} style={{
                padding: '0 14px', height: 40,
                border: 'none',
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

        {/* filter chips */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {allFilters.map(f => (
            <FilterChip
              key={f.key}
              label={f.label}
              options={f.options}
              value={filters[f.key]}
              defaultValue={f.defaultValue}
              onChange={v => onFilterChange(f.key, v)}
            />
          ))}
          {showStrengthFilter && (
            <FilterChip
              label="High strength only"
              options={['Off', 'On']}
              value={showStrengthFilter.value ? 'On' : 'Off'}
              onChange={v => showStrengthFilter.onChange(v === 'On')}
              tone="brand"
            />
          )}
          <div style={{ marginLeft: 'auto' }}>
            <Button variant="ghost" size="xs" onClick={onClearAll}>Clear all</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, options, value, defaultValue, onChange, tone = 'neutral' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  const isDefault = value === 'All' || value === 'Off' || (defaultValue && value === defaultValue);
  const display = isDefault ? label : (value || label);
  const filled = !isDefault;

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          height: 36, padding: '0 10px',
          background: filled ? '#d1e9ff' : '#fff',
          color: filled ? '#175cd3' : '#404040',
          boxShadow: filled
            ? 'inset 0 0 0 1px #84caff'
            : '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.04), inset 0 0 0 1px #d4d4d4',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          transition: 'background .12s, color .12s, box-shadow .12s',
        }}>
        {display}
        <Icon name="chevron-down" size={14} tint={0.6} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 40, left: 0, zIndex: 20,
          minWidth: 180,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 12px 28px -8px rgba(16,24,40,0.18), 0 1px 2px 0 rgba(16,24,40,0.06), inset 0 0 0 1px #e5e5e5',
          padding: 6,
          animation: 'pol-menu .18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {options.map(opt => (
            <div key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                fontSize: 13, fontWeight: opt === value ? 700 : 500,
                color: opt === value ? '#175cd3' : '#404040',
                background: opt === value ? '#f5fafc' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 8,
              }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = '#fafafa'; }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent'; }}
            >
              <span>{opt}</span>
              {opt === value && <Icon name="check-circle" size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────── SignalsTable ────────────────
function SignalsTable({ signals, onPick, density, strengthMode, onAction, pickedId }) {
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });
  const [openMenu, setOpenMenu] = useState(null);
  const { agents, E } = window.POLARIS_DATA;
  const agentById = Object.fromEntries(agents.map(a => [a.id, a]));

  const sorted = useMemo(() => {
    const rows = [...signals];
    const dir = sort.dir === 'asc' ? 1 : -1;
    const strengthRank = { Low: 0, Medium: 1, High: 2 };
    rows.sort((a, b) => {
      if (sort.key === 'strength') return (strengthRank[a.strength] - strengthRank[b.strength]) * dir;
      if (sort.key === 'date')     return (new Date(a.date) - new Date(b.date)) * dir;
      if (sort.key === 'entity')   return E[a.entity].localeCompare(E[b.entity]) * dir;
      if (sort.key === 'status')   return a.status.localeCompare(b.status) * dir;
      if (sort.key === 'type')     return a.type.localeCompare(b.type) * dir;
      if (sort.key === 'title')    return a.title.localeCompare(b.title) * dir;
      return 0;
    });
    return rows;
  }, [signals, sort]);

  const toggleSort = key => setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });

  const rowPad = density === 'compact' ? '10px 16px' : '14px 16px';

  const cols = [
    { key: 'title', label: 'Signal', width: 'auto', minW: 320 },
    { key: 'type', label: 'Theme', width: 150 },
    { key: 'entity', label: 'Entity', width: 170 },
    { key: 'strength', label: 'Strength', width: 130 },
    { key: 'date', label: 'Date', width: 110 },
    { key: 'status', label: 'Status', width: 110 },
  ];

  return (
    <div style={{
      margin: '24px 32px 0',
      background: '#fff', borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
      overflow: 'visible',
    }}>
      <CardHeader
        title="Signals"
        subtitle={`${signals.length} signals · 3 agents · last 30 days`}
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', tableLayout: 'auto' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
              {cols.map((col, i) => (
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
                    <SortArrow active={sort.key === col.key} dir={sort.dir} />
                  </span>
                </th>
              ))}
              <th style={{ width: 56, padding: '10px 16px' }}>
                <Checkbox indeterminate />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => {
              const isPicked = pickedId === s.id;
              const isMenuOpen = openMenu === s.id;
              return (
                <tr
                  key={s.id}
                  onClick={() => onPick(s)}
                  style={{
                    borderBottom: i < sorted.length - 1 ? '1px solid #f5f5f5' : 'none',
                    cursor: 'pointer',
                    transition: 'background .12s',
                    background: isPicked ? '#f5fafc' : (isMenuOpen ? '#fafafa' : 'transparent'),
                  }}
                  onMouseEnter={e => { if (!isPicked) e.currentTarget.style.background = '#fafafa'; }}
                  onMouseLeave={e => { if (!isPicked && !isMenuOpen) e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: rowPad, maxWidth: 380 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#171717', lineHeight: 1.35,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}>
                      {s.title}
                    </div>
                    {density !== 'compact' && (
                      <div style={{ fontSize: 12, color: '#737373', marginTop: 4, lineHeight: 1.4,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}>
                        {s.body}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: rowPad }}>
                    <span style={{
                      fontSize: 12, color: '#525252',
                      whiteSpace: 'nowrap',
                    }}>{s.type}</span>
                  </td>
                  <td style={{ padding: rowPad, fontSize: 13, color: '#404040', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {E[s.entity]}
                  </td>
                  <td style={{ padding: rowPad }}>
                    <Strength level={s.strength} mode={strengthMode} />
                  </td>
                  <td style={{ padding: rowPad, fontFamily: 'var(--font-mono)', fontSize: 12, color: '#525252', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                    {s.date}
                  </td>
                  <td style={{ padding: rowPad }}>
                    <StatusPill status={s.status} />
                  </td>
                  <td style={{ padding: rowPad, position: 'relative' }} onClick={e => e.stopPropagation()}>
                    <IconButton
                      icon="dots-vertical"
                      onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                      active={isMenuOpen}
                    />
                    {isMenuOpen && (
                      <RowActionMenu
                        onClose={() => setOpenMenu(null)}
                        onAction={(action) => {
                          onAction && onAction(action, s);
                          setOpenMenu(null);
                        }}
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
                      No signals match these filters
                    </div>
                    Loosen the strength or date range, or reset to defaults.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination total={signals.length} />
    </div>
  );
}

function CardHeader({ title, subtitle, action }) {
  return (
    <div style={{
      padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>{title}</div>
        <div style={{ fontSize: 13, color: '#737373', marginTop: 2 }}>{subtitle}</div>
      </div>
      {action}
    </div>
  );
}

function SortArrow({ active, dir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: active ? 1 : 0.4 }}>
      <path d={dir === 'asc' ? 'M5 2 L8 6 L2 6 Z' : 'M5 8 L2 4 L8 4 Z'} fill="#737373" />
    </svg>
  );
}

function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <span style={{
      width: 16, height: 16, borderRadius: 4, display: 'inline-block',
      boxShadow: 'inset 0 0 0 1px ' + (checked || indeterminate ? '#1570ef' : '#d4d4d4'),
      background: checked || indeterminate ? '#1570ef' : '#fff',
      position: 'relative', cursor: 'pointer',
    }} onClick={onChange}>
      {checked && <span style={{
        position: 'absolute', top: 2, left: 4, width: 6, height: 10,
        borderRight: '2px solid #fff', borderBottom: '2px solid #fff',
        transform: 'rotate(45deg)',
      }} />}
      {indeterminate && <span style={{
        position: 'absolute', top: 7, left: 3, width: 10, height: 2,
        background: '#fff',
      }} />}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    Unread:   { tone: 'brand',    label: 'Unread' },
    Reviewed: { tone: 'success',  label: 'Reviewed' },
    Snoozed:  { tone: 'neutral',  label: 'Snoozed' },
  };
  const cfg = map[status] || map.Unread;
  return <Pill tone={cfg.tone} dot={status === 'Unread'}>{cfg.label}</Pill>;
}

function RowActionMenu({ onClose, onAction }) {
  const items = [
    { icon: 'check-circle',  label: 'Mark reviewed', action: 'mark' },
    { icon: 'users-01',      label: 'Assign…',       action: 'assign' },
    { icon: 'arrow-up-right',label: 'Open in tab',   action: 'open' },
    { divider: true },
    { icon: 'bell-01',       label: 'Snooze 7 days', action: 'snooze' },
    { icon: 'x-close',       label: 'Dismiss',       action: 'dismiss', danger: true },
  ];
  return (
    <div style={{
      position: 'absolute',
      right: 16, top: 'calc(100% - 4px)',
      minWidth: 200,
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
          onClick={() => onAction(it.action)}
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

function Pagination({ total }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(total / 10));
  return (
    <div style={{
      padding: '14px 24px',
      borderTop: '1px solid #f0f0f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: 'var(--font-sans)', fontSize: 13, color: '#737373',
    }}>
      <Button variant="secondary" size="sm" leadingIcon="arrow-up-right" disabled={page === 1}
        onClick={() => setPage(Math.max(1, page - 1))}
        style={{ paddingLeft: 10 }}
      >
        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icon name="arrow-up-right" size={14} /></span>
        Previous
      </Button>
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {[1, 2, 3].slice(0, totalPages).map(p => (
          <PageButton key={p} num={p} active={p === page} onClick={() => setPage(p)} />
        ))}
        {totalPages > 3 && <span style={{ padding: '0 6px', color: '#737373' }}>…</span>}
        {totalPages > 3 && <PageButton num={totalPages} active={page === totalPages} onClick={() => setPage(totalPages)} />}
      </div>
      <Button variant="secondary" size="sm" trailingIcon="arrow-up-right" disabled={page === totalPages}
        onClick={() => setPage(Math.min(totalPages, page + 1))}>
        Next
      </Button>
    </div>
  );
}

function PageButton({ num, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, borderRadius: 6,
      border: 'none', cursor: 'pointer',
      background: active ? '#fafafa' : 'transparent',
      color: active ? '#171717' : '#737373',
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
    }}>{num}</button>
  );
}

Object.assign(window, { PageHeader, FilterBar, SignalsTable, CardHeader, Pagination, StatusPill, Checkbox, FilterChip });
