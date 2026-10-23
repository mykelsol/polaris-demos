// Apollo — shared FilterBar + Patterns view + Signals (evidence library) view
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, MaturityBadge, MATURITY, LifecycleChip, EvidenceBar, ConfidenceDots, Card, SegToggle, PatternCard, VectorGlyph } = window;

// ──────────────── Filter chip ────────────────
function FilterChip({ label, options, value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, []);
  const filled = value && value !== 'All';
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 34, padding: '0 11px', borderRadius: 8, border: 'none', cursor: 'pointer',
        background: filled ? '#d1e9ff' : '#fff', color: filled ? T.accHi : T.text2,
        boxShadow: filled ? 'inset 0 0 0 1px #84caff' : `0 1px 2px 0 rgba(0,0,0,0.04), inset 0 0 0 1px ${T.bd}`,
        fontFamily: T.font, fontWeight: 600, fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: filled ? T.accHi : T.text3, fontWeight: 700 }}>{label}</span>
        {filled && <span>{value}</span>}
        <Ic name="chevDown" size={13} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 38, left: 0, zIndex: 20, minWidth: 180, background: '#fff', borderRadius: 10, boxShadow: '0 12px 28px -8px rgba(16,24,40,0.18), inset 0 0 0 1px #e5e5e5', padding: 6 }}>
          {options.map(o => (
            <div key={o} onClick={() => { onChange(o); setOpen(false); }} style={{
              padding: '8px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
              fontWeight: o === value ? 700 : 500, color: o === value ? T.accHi : T.text2,
              background: o === value ? '#eff6ff' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
              onMouseEnter={e => { if (o !== value) e.currentTarget.style.background = '#fafafa'; }}
              onMouseLeave={e => { if (o !== value) e.currentTarget.style.background = o === value ? '#eff6ff' : 'transparent'; }}>
              {o}{o === value && <Ic name="check" size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterBar({ query, onQuery, placeholder, chips, view, onView, viewOptions, onClear, right }) {
  return (
    <Card style={{ background: '#fafafa', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, height: 38, borderRadius: 9, background: '#fff', boxShadow: `inset 0 0 0 1px ${T.bd}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
          <Ic name="search" size={16} color={T.text3} />
          <input value={query} onChange={e => onQuery(e.target.value)} placeholder={placeholder}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: T.font, fontSize: 13.5, color: T.text }} />
          {query && <IconBtn name="x" size={24} iconSize={14} onClick={() => onQuery('')} />}
        </div>
        {right}
        {viewOptions && <SegToggle value={view} options={viewOptions} onChange={onView} />}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {chips.map(c => <FilterChip key={c.key} label={c.label} options={c.options} value={c.value} onChange={c.onChange} />)}
        <div style={{ marginLeft: 'auto' }}><Btn variant="ghost" size="xs" onClick={onClear}>Clear all</Btn></div>
      </div>
    </Card>
  );
}

// ──────────────── Patterns view ────────────────
const MATURITY_ORDER = ['Insight Ready', 'Developing', 'Monitoring'];

function PatternsView({ scope, patterns, onPick, onCta, embedded }) {
  const { agents } = window.AP;
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState('cards');
  const [f, setF] = React.useState({ maturity: 'All', type: 'All', strength: 'All', confidence: 'All', agent: 'All' });

  const types = Array.from(new Set(patterns.map(p => p.type)));
  const filtered = patterns.filter(p => {
    const q = query.trim().toLowerCase();
    if (q && !(p.title.toLowerCase().includes(q) || p.type.toLowerCase().includes(q))) return false;
    if (f.maturity !== 'All' && p.maturity !== f.maturity) return false;
    if (f.type !== 'All' && p.type !== f.type) return false;
    if (f.strength !== 'All' && p.strength !== f.strength) return false;
    if (f.confidence !== 'All' && p.confidence !== f.confidence) return false;
    if (f.agent !== 'All' && window.AP.agentById[p.agent].name !== f.agent) return false;
    return true;
  });

  const chips = [
    { key: 'maturity', label: 'Maturity', value: f.maturity, options: ['All', ...MATURITY_ORDER], onChange: v => setF(s => ({ ...s, maturity: v })) },
    { key: 'type', label: 'Type', value: f.type, options: ['All', ...types], onChange: v => setF(s => ({ ...s, type: v })) },
    { key: 'strength', label: 'Strength', value: f.strength, options: ['All', 'High', 'Medium-High', 'Medium', 'Low-Med', 'Low'], onChange: v => setF(s => ({ ...s, strength: v })) },
    { key: 'confidence', label: 'Confidence', value: f.confidence, options: ['All', 'High', 'Medium-High', 'Medium', 'Low'], onChange: v => setF(s => ({ ...s, confidence: v })) },
    { key: 'agent', label: 'Agent', value: f.agent, options: ['All', ...agents.map(a => a.name)], onChange: v => setF(s => ({ ...s, agent: v })) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <FilterBar query={query} onQuery={setQuery} placeholder="Search patterns by title or type…" chips={chips}
        view={view} onView={setView} viewOptions={[{ value: 'cards', label: 'Cards', icon: 'grid' }, { value: 'table', label: 'Table', icon: 'list' }]}
        onClear={() => { setQuery(''); setF({ maturity: 'All', type: 'All', strength: 'All', confidence: 'All', agent: 'All' }); }} />

      {view === 'cards' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {MATURITY_ORDER.map(m => {
            const rows = filtered.filter(p => p.maturity === m);
            if (!rows.length) return null;
            return (
              <div key={m}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
                  <MaturityBadge value={m} />
                  <span style={{ fontSize: 12.5, color: T.text3, fontWeight: 600 }}>{rows.length} pattern{rows.length === 1 ? '' : 's'}</span>
                  <span style={{ flex: 1, height: 1, background: T.bd }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {rows.map(p => <PatternCard key={p.id} pattern={p} onOpen={() => onPick(p)} onCta={() => onCta(p)} />)}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <EmptyRow text="No patterns match these filters" />}
        </div>
      ) : (
        <PatternsTable patterns={filtered} onPick={onPick} onCta={onCta} />
      )}
    </div>
  );
}

function PatternsTable({ patterns, onPick, onCta }) {
  const { ENT, agentById } = window.AP;
  const cols = ['Pattern', 'Maturity', 'Lifecycle', 'Strength', 'Confidence', 'Signals', 'Type', 'Agent', 'Updated', ''];
  return (
    <Card style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.font, minWidth: 1080 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: `1px solid ${T.bd}` }}>
              {cols.map((c, i) => <th key={i} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 11.5, fontWeight: 700, color: T.text3, whiteSpace: 'nowrap' }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {patterns.map((p, i) => {
              const ent = ENT[p.primary]; const ag = agentById[p.agent];
              return (
                <tr key={p.id} onClick={() => onPick(p)} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}`, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 16px', maxWidth: 340 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, lineHeight: 1.35 }}>{p.title}</div>
                    <div style={{ fontSize: 11.5, color: T.text3, marginTop: 3, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Ic name={ent.icon} size={12} /> {ent.name}</div>
                  </td>
                  <td style={{ padding: '13px 16px' }}><MaturityBadge value={p.maturity} /></td>
                  <td style={{ padding: '13px 16px' }}><LifecycleChip value={p.lifecycle} /></td>
                  <td style={{ padding: '13px 16px' }}><EvidenceBar level={p.strength} showLabel={false} width={48} /></td>
                  <td style={{ padding: '13px 16px' }}><ConfidenceDots level={p.confidence} showLabel={false} /></td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: T.text2, fontVariantNumeric: 'tabular-nums' }}>{p.signals}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12.5, color: T.text2, whiteSpace: 'nowrap' }}>{p.type}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: T.text2, whiteSpace: 'nowrap' }}>
                      <span style={{ width: 18, height: 18, borderRadius: 5, background: `${ag.color}14`, color: ag.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ic name={ag.icon} size={11} /></span>
                      {ag.name.replace(' Agent', '')}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: T.text3, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{p.updated}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <Btn variant={p.maturity === 'Insight Ready' ? 'primary' : 'secondary'} size="xs" onClick={() => onCta(p)}>{MATURITY[p.maturity].cta}</Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {patterns.length === 0 && <EmptyRow text="No patterns match these filters" />}
      </div>
    </Card>
  );
}

// ──────────────── Signals view (evidence library) ────────────────
function SignalsView({ signals, onPick }) {
  const { agents, entities, ENT, agentById } = window.AP;
  const [query, setQuery] = React.useState('');
  const [sel, setSel] = React.useState({});
  const [f, setF] = React.useState({ status: 'All', strength: 'All', confidence: 'All', type: 'All', entity: 'All', agent: 'All', vector: 'All', date: 'Last 7 days' });

  const vectors = Array.from(new Set(signals.map(s => s.vector)));
  const filtered = signals.filter(s => {
    const q = query.trim().toLowerCase();
    if (q && !(s.title.toLowerCase().includes(q) || s.claim.toLowerCase().includes(q))) return false;
    if (f.status !== 'All' && s.status !== f.status) return false;
    if (f.strength !== 'All' && s.strength !== f.strength) return false;
    if (f.confidence !== 'All' && s.confidence !== f.confidence) return false;
    if (f.vector !== 'All' && s.vector !== f.vector) return false;
    if (f.entity !== 'All' && !s.tags.some(t => ENT[t.id].name === f.entity)) return false;
    if (f.agent !== 'All' && agentById[s.agent].name !== f.agent) return false;
    return true;
  });

  const chips = [
    { key: 'status', label: 'Status', value: f.status, options: ['All', 'Linked', 'Open'], onChange: v => setF(s => ({ ...s, status: v })) },
    { key: 'strength', label: 'Strength', value: f.strength, options: ['All', 'High', 'Medium-High', 'Medium', 'Low-Med', 'Low'], onChange: v => setF(s => ({ ...s, strength: v })) },
    { key: 'confidence', label: 'Confidence', value: f.confidence, options: ['All', 'High', 'Medium-High', 'Medium', 'Low'], onChange: v => setF(s => ({ ...s, confidence: v })) },
    { key: 'vector', label: 'Source vector', value: f.vector, options: ['All', ...vectors], onChange: v => setF(s => ({ ...s, vector: v })) },
    { key: 'entity', label: 'Entity', value: f.entity, options: ['All', ...entities.map(e => e.name)], onChange: v => setF(s => ({ ...s, entity: v })) },
    { key: 'agent', label: 'Agent', value: f.agent, options: ['All', ...agents.map(a => a.name)], onChange: v => setF(s => ({ ...s, agent: v })) },
    { key: 'date', label: 'Date range', value: f.date, options: ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'All time'], onChange: v => setF(s => ({ ...s, date: v })) },
  ];

  const cols = [
    { k: 'cb', w: 40 }, { k: 'sig', label: 'Signal' }, { k: 'str', label: 'Strength' }, { k: 'conf', label: 'Confidence' },
    { k: 'tags', label: 'Entity Tags' }, { k: 'type', label: 'Signal Type' }, { k: 'src', label: 'Source' },
    { k: 'agent', label: 'Agent' }, { k: 'det', label: 'Detected' }, { k: 'status', label: 'Status' }, { k: 'act', w: 44 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <FilterBar query={query} onQuery={setQuery} placeholder="Search signals by claim, type, source…" chips={chips}
        onClear={() => { setQuery(''); setF({ status: 'All', strength: 'All', confidence: 'All', type: 'All', entity: 'All', agent: 'All', vector: 'All', date: 'Last 7 days' }); }} />
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '15px 18px', borderBottom: `1px solid ${T.bd}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Ic name="database" size={17} color={T.acc} />
          <span style={{ fontSize: 14.5, fontWeight: 700, color: T.text }}>Evidence library</span>
          <span style={{ fontSize: 12.5, color: T.text3 }}>· {filtered.length} signals · supporting evidence for patterns</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.font, minWidth: 1180 }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: `1px solid ${T.bd}` }}>
                {cols.map(c => <th key={c.k} style={{ width: c.w, textAlign: 'left', padding: '10px 16px', fontSize: 11.5, fontWeight: 700, color: T.text3, whiteSpace: 'nowrap' }}>{c.label || ''}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const ag = agentById[s.agent];
                return (
                  <tr key={s.id} onClick={() => onPick(s)} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}`, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                      <Checkbox checked={!!sel[s.id]} onChange={() => setSel(p => ({ ...p, [s.id]: !p[s.id] }))} />
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: 320 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.35 }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: T.text3, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{s.id}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}><EvidenceBar level={s.strength} showLabel={false} width={44} /></td>
                    <td style={{ padding: '12px 16px' }}><ConfidenceDots level={s.confidence} showLabel={false} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 180 }}>
                        {s.tags.slice(0, 2).map(t => <Pill key={t.id} tone={t.role === 'Primary' ? 'accent' : 'neutral'} size="xs">{ENT[t.id].name}</Pill>)}
                        {s.tags.length > 2 && <Pill tone="neutral" size="xs">+{s.tags.length - 2}</Pill>}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.text2, whiteSpace: 'nowrap' }}><VectorGlyph vector={s.vector} /> {s.vector}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12.5, color: T.text2, whiteSpace: 'nowrap' }}>{s.source}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.text2, whiteSpace: 'nowrap' }}>
                        <span style={{ width: 17, height: 17, borderRadius: 4, background: `${ag.color}14`, color: ag.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ic name={ag.icon} size={10} /></span>
                        {ag.name.replace(' Agent', '')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: T.text3, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{s.detected}</td>
                    <td style={{ padding: '12px 16px' }}><Pill tone={s.status === 'Linked' ? 'ready' : 'warn'} size="xs" dot>{s.status}</Pill></td>
                    <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}><IconBtn name="dots" size={28} iconSize={16} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyRow text="No signals match these filters" />}
        </div>
      </Card>
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <span onClick={onChange} style={{
      width: 17, height: 17, borderRadius: 5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      background: checked ? T.acc : '#fff', boxShadow: `inset 0 0 0 1px ${checked ? T.acc : T.bdHi}`,
    }}>
      {checked && <Ic name="check" size={12} color="#fff" strokeWidth={3} />}
    </span>
  );
}

function EmptyRow({ text }) {
  return (
    <div style={{ padding: '56px 24px', textAlign: 'center', color: T.text3 }}>
      <div style={{ fontWeight: 700, color: T.text2, fontSize: 14.5, marginBottom: 5 }}>{text}</div>
      <div style={{ fontSize: 13 }}>Loosen the filters, or reset to defaults.</div>
    </div>
  );
}

window.FilterBar = FilterBar;
window.FilterChip = FilterChip;
window.PatternsView = PatternsView;
window.PatternsTable = PatternsTable;
window.SignalsView = SignalsView;
window.ApCheckbox = Checkbox;
window.EmptyRow = EmptyRow;
})();
