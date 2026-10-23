// Apollo — Create Insight modal
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, MaturityBadge, VectorGlyph } = window;

const OUTPUTS = [
  { id: 'Report', label: 'Analyst Report', icon: 'fileText', desc: 'Full report separating confirmed evidence from open gaps' },
  { id: 'Brief', label: 'Executive Brief', icon: 'fileText', desc: 'Command summary with decision points' },
  { id: 'Memo', label: 'Collection Memo', icon: 'fileMemo', desc: 'Tasking memo for the top collection gaps' },
  { id: 'Field', label: 'Field Awareness Update', icon: 'send', desc: 'Role-specific update for field teams' },
];

function CreateInsightModal({ pattern, onClose, onCreate }) {
  const p = pattern;
  const { SIG, ENT, OP } = window.AP;
  const op = OP[p.op];
  const [output, setOutput] = React.useState('Report');
  const [title, setTitle] = React.useState(
    p.report ? window.AP.INS[p.report].title
      : `${ENT[p.primary].name} Analyst Report`
  );
  const [checks, setChecks] = React.useState(Object.fromEntries(p.supporting.map(s => [s.sig, true])));
  const actions = [p.nextMove, 'Separate confirmed evidence from open gaps.', 'Stage role-specific distribution outputs.'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(12,14,18,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'ap-fade .2s ease' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 'min(720px, 100%)', maxHeight: '92vh', background: '#fff', borderRadius: 16, boxShadow: '0 28px 70px -18px rgba(16,24,40,0.5)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* header */}
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.bd}`, display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
          <span style={{ width: 36, height: 36, borderRadius: 9, background: T.readyBg, color: T.ready, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name="sparkles" size={19} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Create Analyst Report</div>
            <div style={{ fontSize: 12, color: T.text3 }}>Generated from an Insight Ready pattern · {op.name}</div>
          </div>
          <IconBtn name="x" size={32} onClick={onClose} />
        </div>

        {/* body */}
        <div style={{ overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* source pattern locked */}
          <div>
            <Label>Source pattern <Lock /></Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', borderRadius: 11, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}` }}>
              <MaturityBadge value={p.maturity} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, lineHeight: 1.35 }}>{p.title}</div>
                <div style={{ fontSize: 11.5, color: T.text3, marginTop: 2 }}>{p.type} · {p.signals} signals · {p.strength} strength · {p.confidence} confidence</div>
              </div>
            </div>
          </div>

          {/* output type */}
          <div>
            <Label>Report output type</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {OUTPUTS.map(o => {
                const on = o.id === output;
                return (
                  <button key={o.id} onClick={() => setOutput(o.id)} style={{
                    textAlign: 'left', border: 'none', cursor: 'pointer', padding: '12px 14px', borderRadius: 11,
                    background: on ? '#eff6ff' : '#fff', boxShadow: `inset 0 0 0 ${on ? 1.5 : 1}px ${on ? '#84caff' : T.bd}`,
                    display: 'flex', gap: 11, alignItems: 'flex-start',
                  }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: on ? '#d1e9ff' : '#f5f5f5', color: on ? T.accHi : T.text2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={o.icon} size={16} /></span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: on ? T.accHi : T.text }}>{o.label}</div>
                      <div style={{ fontSize: 11.5, color: T.text3, marginTop: 2, lineHeight: 1.4 }}>{o.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* suggested title */}
          <div>
            <Label>Suggested title</Label>
            <input value={title} onChange={e => setTitle(e.target.value)} style={{
              width: '100%', height: 42, padding: '0 14px', borderRadius: 10, border: 'none', outline: 'none',
              background: '#fff', boxShadow: `inset 0 0 0 1px ${T.bd}`, fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.text,
            }} />
          </div>

          {/* supporting evidence checklist */}
          <div>
            <Label>Supporting evidence · {Object.values(checks).filter(Boolean).length} of {p.supporting.length} included</Label>
            <div style={{ borderRadius: 11, boxShadow: `inset 0 0 0 1px ${T.bd}`, overflow: 'hidden' }}>
              {p.supporting.map((sp, i) => {
                const s = SIG[sp.sig]; if (!s) return null;
                const on = checks[sp.sig];
                return (
                  <div key={sp.sig} onClick={() => setChecks(c => ({ ...c, [sp.sig]: !c[sp.sig] }))} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderTop: i === 0 ? 'none' : `1px solid ${T.bd}`, cursor: 'pointer' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 5, flex: 'none', background: on ? T.acc : '#fff', boxShadow: `inset 0 0 0 1px ${on ? T.acc : T.bdHi}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{on && <Ic name="check" size={12} color="#fff" strokeWidth={3} />}</span>
                    <span style={{ display: 'inline-flex', color: T.text3 }}><VectorGlyph vector={s.vector} size={14} /></span>
                    <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: T.text, lineHeight: 1.35 }}>{s.title}</span>
                    <Pill tone="neutral" size="xs">{sp.relation}</Pill>
                  </div>
                );
              })}
            </div>
          </div>

          {/* recommended actions */}
          <div>
            <Label>Recommended actions</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {actions.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, color: T.text2, lineHeight: 1.45 }}>
                  <span style={{ color: T.acc, flex: 'none', marginTop: 2 }}><Ic name="arrowRight" size={14} /></span>{a}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: '14px 22px', borderTop: `1px solid ${T.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flex: 'none', background: '#fafafa' }}>
          <span style={{ fontSize: 11.5, color: T.text3, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Ic name="link" size={13} /> Every section traces back to source signals</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="secondary" size="sm" onClick={onClose}>Cancel</Btn>
            <Btn variant="primary" size="sm" icon="sparkles" onClick={() => onCreate(p, output, title)}>Create Report</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: T.text2, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{children}</div>;
}
function Lock() {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: T.text4, textTransform: 'none', letterSpacing: 0, background: '#f5f5f5', padding: '1px 7px', borderRadius: 9999 }}><Ic name="shield" size={10} /> Locked</span>;
}

window.CreateInsightModal = CreateInsightModal;
})();
