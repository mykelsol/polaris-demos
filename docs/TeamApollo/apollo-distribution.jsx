// Apollo — Distribution screen (role-specific outputs) + preview drawer
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, OpTag, Card, SectionHead, FilterChip } = window;

const STATUS_TONE = { 'Ready': 'ready', 'Draft Ready': 'accent', 'Needs Review': 'warn', 'Draft': 'mon' };
const freshnessOf = (op) => op.kind === 'real-time' ? 'Minutes to hours' : 'Hours to days';

// ──────────────── Output card ────────────────
function OutputCard({ d, onOpen }) {
  const op = window.AP.OP[d.op];
  return (
    <Card hover onClick={() => onOpen(d)} accent={op && op.color} style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name="send" size={17} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{d.title}</div>
          <div style={{ fontSize: 12, color: T.text3, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}><Ic name="user" size={12} /> {d.audience}</div>
        </div>
        <Pill tone={STATUS_TONE[d.status] || 'neutral'} size="xs" dot>{d.status}</Pill>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        <OpTag id={d.op} />
        <span style={{ fontSize: 11, color: T.text3 }}>{d.handling}</span>
      </div>
      <div style={{ fontSize: 12.5, color: T.text2, lineHeight: 1.5 }}><span style={{ fontWeight: 700, color: T.text3 }}>Contents · </span>{d.contents}</div>
      <div style={{ fontSize: 12, color: d.restricted === 'None' ? T.text4 : T.risk, lineHeight: 1.45 }}><span style={{ fontWeight: 700, color: T.text3 }}>Restricted · </span>{d.restricted}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }} onClick={e => e.stopPropagation()}>
        <Btn variant={d.status === 'Ready' ? 'primary' : 'secondary'} size="sm" icon={d.status === 'Ready' ? 'send' : 'arrowRight'} onClick={() => onOpen(d)}>{d.cta}</Btn>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: T.text3, fontVariantNumeric: 'tabular-nums' }}>{d.updated}</span>
      </div>
    </Card>
  );
}

// ──────────────── Distribution screen ────────────────
function DistributionView({ onOpen, onNav }) {
  const { distribution, operations, OP } = window.AP;
  const [f, setF] = React.useState({ op: 'All', scenario: 'All', audience: 'All', status: 'All', freshness: 'All', handling: 'All' });

  const audiences = Array.from(new Set(distribution.map(d => d.audience)));
  const handlings = Array.from(new Set(distribution.map(d => d.handling)));
  const SCEN = { 'Real-Time': 'real-time', 'Long-Tail': 'long-tail' };

  const filtered = distribution.filter(d => {
    const op = OP[d.op];
    if (f.op !== 'All' && op.tag !== f.op) return false;
    if (f.scenario !== 'All' && op.kind !== SCEN[f.scenario]) return false;
    if (f.audience !== 'All' && d.audience !== f.audience) return false;
    if (f.status !== 'All' && d.status !== f.status) return false;
    if (f.freshness !== 'All' && freshnessOf(op) !== f.freshness) return false;
    if (f.handling !== 'All' && d.handling !== f.handling) return false;
    return true;
  });

  const chips = [
    { key: 'op', label: 'Operation', value: f.op, options: ['All', ...operations.map(o => o.tag)], onChange: v => setF(s => ({ ...s, op: v })) },
    { key: 'scenario', label: 'Scenario type', value: f.scenario, options: ['All', 'Real-Time', 'Long-Tail'], onChange: v => setF(s => ({ ...s, scenario: v })) },
    { key: 'audience', label: 'Audience', value: f.audience, options: ['All', ...audiences], onChange: v => setF(s => ({ ...s, audience: v })) },
    { key: 'status', label: 'Status', value: f.status, options: ['All', 'Ready', 'Draft Ready', 'Needs Review', 'Draft'], onChange: v => setF(s => ({ ...s, status: v })) },
    { key: 'freshness', label: 'Freshness', value: f.freshness, options: ['All', 'Minutes to hours', 'Hours to days'], onChange: v => setF(s => ({ ...s, freshness: v })) },
    { key: 'handling', label: 'Handling', value: f.handling, options: ['All', ...handlings], onChange: v => setF(s => ({ ...s, handling: v })) },
  ];

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 18 }}>
        <SectionHead eyebrow="Distribution" accent={T.acc} title="Distribution"
          sub="Role-specific intelligence outputs generated from the same traceable Analyst Report and tailored by role, mission, scenario, and need-to-know." />
      </div>

      <Card style={{ background: '#fafafa', padding: '14px 16px', marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {chips.map(c => <FilterChip key={c.key} label={c.label} options={c.options} value={c.value} onChange={c.onChange} />)}
          <div style={{ marginLeft: 'auto' }}><Btn variant="ghost" size="xs" onClick={() => setF({ op: 'All', scenario: 'All', audience: 'All', status: 'All', freshness: 'All', handling: 'All' })}>Clear all</Btn></div>
        </div>
      </Card>

      {operations.map(op => {
        const rows = filtered.filter(d => d.op === op.id);
        if (!rows.length) return null;
        return (
          <div key={op.id} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <OpTag id={op.id} size="sm" />
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{op.name}</span>
              <span style={{ fontSize: 12.5, color: T.text3, fontWeight: 600 }}>· {rows.length} output{rows.length === 1 ? '' : 's'}</span>
              <span style={{ flex: 1, height: 1, background: T.bd }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {rows.map(d => <OutputCard key={d.id} d={d} onOpen={onOpen} />)}
            </div>
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div style={{ padding: '56px 24px', textAlign: 'center', color: T.text3 }}>
          <div style={{ fontWeight: 700, color: T.text2, fontSize: 14.5, marginBottom: 5 }}>No outputs match these filters</div>
          <div style={{ fontSize: 13 }}>Loosen the filters, or reset to defaults.</div>
        </div>
      )}
    </div>
  );
}

// ──────────────── Distribution preview drawer ────────────────
function DistributionPreview({ output, onClose, onToast, onOpenReport }) {
  if (!output) return null;
  const d = output;
  const op = window.AP.OP[d.op];
  const report = window.AP.INS[d.report];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(12,14,18,0.40)', backdropFilter: 'blur(3px)', zIndex: 50, animation: 'ap-fade .2s ease' }} />
      <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, background: '#fff', borderLeft: `1px solid ${T.bd}`, boxShadow: '-16px 0 40px -12px rgba(16,24,40,0.25)', zIndex: 51, display: 'flex', flexDirection: 'column', animation: 'ap-slide .26s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '18px 22px 16px', borderBottom: `1px solid ${T.bd}`, flex: 'none', background: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
            <Pill tone={STATUS_TONE[d.status] || 'neutral'} size="xs" dot>{d.status}</Pill>
            <Pill tone="warn" size="xs"><Ic name="shield" size={10} /> {d.handling}</Pill>
            <span style={{ marginLeft: 'auto' }}><IconBtn name="x" size={30} onClick={onClose} title="Close" /></span>
          </div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{d.title}</h2>
          <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.text3, flexWrap: 'wrap' }}>
            <OpTag id={d.op} />
            <span>{op.scenario}</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 24px' }}>
          <Row label="Audience"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, color: T.text }}><Ic name="user" size={14} /> {d.audience}</span></Row>
          <Row label="Handling"><Pill tone="warn" size="xs"><Ic name="shield" size={10} /> {d.handling}</Pill></Row>
          <Row label="Distribution status"><Pill tone={STATUS_TONE[d.status] || 'neutral'} size="xs" dot>{d.status}</Pill></Row>
          <Row label="Last updated" last><span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: T.text2, fontSize: 13 }}>{d.updated}</span></Row>

          <Sect title="Included sections" icon="check">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {d.included.map(s => <Pill key={s} tone="ready" size="sm">{s}</Pill>)}
            </div>
          </Sect>

          <Sect title="Excluded / restricted sections" icon="x">
            {d.excluded.length ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{d.excluded.map(s => <Pill key={s} tone="risk" size="sm">{s}</Pill>)}</div>
            ) : <span style={{ fontSize: 13, color: T.text4 }}>None — full report contents.</span>}
          </Sect>

          <Sect title="Source traceability" icon="link">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 13px', borderRadius: 10, background: T.readyBg, boxShadow: `inset 0 0 0 1px ${T.readyBd}` }}>
              <Ic name="checkCircle" size={16} color={T.ready} />
              <span style={{ fontSize: 12.5, color: T.ready, fontWeight: 600 }}>Retained · every field traces to source signals via the analyst report.</span>
            </div>
          </Sect>

          {report && (
            <Sect title="Source analyst report" icon="fileText">
              <div onClick={() => onOpenReport(report)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 10, cursor: 'pointer', boxShadow: `inset 0 0 0 1px ${T.bd}` }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ width: 28, height: 28, borderRadius: 7, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name="fileText" size={15} /></span>
                <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: T.text, lineHeight: 1.35 }}>{report.title}</span>
                <Ic name="chevRight" size={15} color={T.text4} />
              </div>
            </Sect>
          )}
        </div>

        <div style={{ borderTop: `1px solid ${T.bd}`, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 8, background: '#fff', flex: 'none' }}>
          <Btn variant="secondary" size="sm" icon="download" onClick={() => onToast(`${d.title} exported`)}>Export</Btn>
          <div style={{ flex: 1 }} />
          <Btn variant="primary" size="sm" icon="send" onClick={() => { onToast(`${d.title} distributed to ${d.audience}`); onClose(); }}>Distribute</Btn>
        </div>
      </aside>
    </>
  );
}

function Row({ label, children, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: last ? 'none' : `1px solid ${T.bd}` }}>
      <span style={{ fontSize: 12.5, color: T.text3, fontWeight: 600 }}>{label}</span>
      {children}
    </div>
  );
}
function Sect({ title, icon, children }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
        {icon && <Ic name={icon} size={14} color={T.text3} />}
        <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

window.DistributionView = DistributionView;
window.DistributionPreview = DistributionPreview;
})();
