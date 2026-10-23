// Apollo — Pattern drawer + Signal drawer (right-side)
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, OpTag, MaturityBadge, MATURITY, LifecycleChip, EvidenceBar, ConfidenceDots, VectorGlyph, PatternTimeline } = window;

const RELATION_TONE = { Introduces: 'accent', Reinforces: 'ready', Updates: 'dev' };

function Shell({ children, onClose, width = 520, header }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(12,14,18,0.40)', backdropFilter: 'blur(3px)', zIndex: 40, animation: 'ap-fade .2s ease' }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width, background: '#fff', borderLeft: `1px solid ${T.bd}`,
        boxShadow: '-16px 0 40px -12px rgba(16,24,40,0.25)', zIndex: 41, display: 'flex', flexDirection: 'column',
        animation: 'ap-slide .26s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {header}
        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      </aside>
    </>
  );
}

function Section({ title, children, icon }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        {icon && <Ic name={icon} size={15} color={T.text3} />}
        <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text, letterSpacing: '0.01em' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
function Para({ children }) { return <p style={{ margin: 0, fontSize: 13.5, color: T.text2, lineHeight: 1.6 }}>{children}</p>; }
function Rule() { return <div style={{ height: 1, background: T.bd, margin: '22px 0 0' }} />; }

// ──────────────── Pattern drawer ────────────────
function PatternDrawer({ pattern, drawerWidth, onClose, onCreateInsight, onViewSignals, onViewAgent, onPickEntity, onPickSignal, onViewOperation }) {
  if (!pattern) return null;
  const p = pattern;
  const { ENT, agentById, SIG, OP } = window.AP;
  const ag = agentById[p.agent];
  const m = MATURITY[p.maturity];
  const op = OP[p.op];
  const pkg = p.relatedPackage ? ENT[p.relatedPackage] : null;

  // timeline: supporting signals + maturity/report/distribution markers
  const tlEvents = p.supporting.map(sp => { const s = SIG[sp.sig]; return s ? { label: s.title, t: s.detected.replace(/^.*· /, '').replace(' context', ''), kind: 'signal' } : null; }).filter(Boolean);
  tlEvents.push({ label: 'Pattern maturity change to ' + p.maturity, t: p.updated, kind: 'maturity' });
  if (p.report) { tlEvents.push({ label: 'Analyst Report creation point', t: 'now', kind: 'report' }); tlEvents.push({ label: 'Distribution point', t: 'queued', kind: 'distribution' }); }

  const header = (
    <div style={{ padding: '18px 22px 16px', borderBottom: `1px solid ${T.bd}`, flex: 'none', background: '#fafafa' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11, flexWrap: 'wrap' }}>
        <MaturityBadge value={p.maturity} />
        <OpTag id={p.op} />
        <Pill tone="neutral" size="xs">{p.type}</Pill>
        <span style={{ marginLeft: 'auto' }}><IconBtn name="x" size={30} onClick={onClose} title="Close" /></span>
      </div>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text, lineHeight: 1.32, letterSpacing: '-0.01em' }}>{p.title}</h2>
      <div style={{ marginTop: 8, fontSize: 12, color: T.text3 }}>Related operation · <span style={{ fontWeight: 700, color: op.color }}>{op.name}</span>{pkg && <span> · Related package <b style={{ color: T.text2 }}>{pkg.name}</b></span>}</div>
    </div>
  );

  return (
    <Shell onClose={onClose} width={drawerWidth} header={header}>
      <div style={{ padding: '4px 22px 24px' }}>
        {/* assessment grid (Strength / Confidence / Signals / Lifecycle) */}
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: T.bd, borderRadius: 12, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${T.bd}` }}>
          <StatCell label="Evidence strength"><EvidenceBar level={p.strength} /></StatCell>
          <StatCell label="Confidence"><ConfidenceDots level={p.confidence} /></StatCell>
          <StatCell label="Signal count"><span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{p.signals} signals</span></StatCell>
          <StatCell label="Lifecycle"><LifecycleChip value={p.lifecycle} /></StatCell>
        </div>

        <Section title="What changed" icon="activity"><Para>{p.whatChanged}</Para></Section>
        <Section title="Why it matters" icon="alertCircle"><Para>{p.whyMatters}</Para></Section>

        <Section title="Entity context" icon="crosshair">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            <EntityTag id={p.context.primary} role="Primary" onClick={onPickEntity} />
            {p.context.secondary.map(id => <EntityTag key={id} id={id} role="Secondary" onClick={onPickEntity} />)}
          </div>
        </Section>

        <Rule />

        <Section title="Lifecycle state" icon="trendUp">
          <Para><span style={{ fontWeight: 700, color: T.text }}>{p.lifecycle}</span> · {p.lifecycleNote}</Para>
        </Section>

        <Section title={`Supporting signals · ${p.supporting.length}`} icon="signal">
          <div style={{ borderRadius: 12, boxShadow: `inset 0 0 0 1px ${T.bd}`, overflow: 'hidden' }}>
            {p.supporting.map((sp, i) => {
              const s = SIG[sp.sig];
              if (!s) return null;
              return (
                <div key={sp.sig} onClick={() => onPickSignal(s)} style={{ padding: '13px 15px', borderTop: i === 0 ? 'none' : `1px solid ${T.bd}`, cursor: 'pointer', display: 'flex', gap: 11 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: '#f4f7fc', color: T.text2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}><VectorGlyph vector={s.vector} size={14} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text, lineHeight: 1.4 }}>{s.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 5 }}>
                      <Pill tone={RELATION_TONE[sp.relation]} size="xs">{sp.relation}</Pill>
                      <span style={{ fontSize: 11, color: T.text3 }}>{s.source}</span>
                      <span style={{ fontSize: 11, color: T.text4, fontVariantNumeric: 'tabular-nums' }}>· {s.detected}</span>
                    </div>
                  </div>
                  <Ic name="chevRight" size={15} color={T.text4} style={{ marginTop: 4 }} />
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10 }}><Btn variant="ghost" size="xs" iconRight="arrowUpRight" onClick={onViewSignals}>View all signals</Btn></div>
        </Section>

        <Section title="Pattern timeline" icon="history">
          <PatternTimeline events={tlEvents} axis={op.kind === 'real-time' ? 'Last 60 minutes' : 'Last 8 hours · 30-day historical context'} />
        </Section>

        <Rule />

        <Section title="Insight readiness" icon="checkCircle">
          <div style={{ padding: '13px 15px', borderRadius: 10, background: p.maturity === 'Insight Ready' ? T.readyBg : T.monBg, boxShadow: `inset 0 0 0 1px ${p.maturity === 'Insight Ready' ? T.readyBd : T.monBd}` }}>
            <Para>{p.readiness}</Para>
          </div>
        </Section>

        <Section title="Recommended next move" icon="zap">
          <div style={{ padding: '13px 15px', borderRadius: 10, background: '#eff6ff', boxShadow: 'inset 0 0 0 1px #bfdbfe' }}>
            <Para>{p.nextMove}</Para>
          </div>
        </Section>

        <Section title="Producing agent" icon="cpu">
          <div onClick={onViewAgent} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '8px 12px', borderRadius: 9, cursor: 'pointer', boxShadow: `inset 0 0 0 1px ${T.bd}` }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: `${ag.color}14`, color: ag.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ic name={ag.icon} size={14} /></span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.acc }}>{ag.name}</span>
            <span style={{ fontSize: 11.5, color: T.text3 }}>· {ag.version} · {ag.cadence}</span>
          </div>
        </Section>
      </div>

      {/* footer */}
      <div style={{ borderTop: `1px solid ${T.bd}`, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 8, background: '#fff', flex: 'none', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          <IconBtn name="thumbUp" size={32} iconSize={16} title="Useful" />
          <IconBtn name="thumbDown" size={32} iconSize={16} title="Not useful" />
        </div>
        <Btn variant="ghost" size="sm" icon="navigation" onClick={() => onViewOperation && onViewOperation(p.op)}>Operation</Btn>
        {op.graph && <Btn variant="ghost" size="sm" icon="gitBranch" onClick={() => onViewOperation && onViewOperation(p.op)}>Graph</Btn>}
        <div style={{ flex: 1 }} />
        <Btn variant="secondary" size="sm" icon="signal" onClick={onViewSignals}>Signals</Btn>
        {p.maturity === 'Insight Ready'
          ? <Btn variant="primary" size="sm" icon="sparkles" onClick={() => onCreateInsight(p)}>Create Analyst Report</Btn>
          : <Btn variant={p.maturity === 'Developing' ? 'accentSoft' : 'secondary'} size="sm" icon={p.maturity === 'Developing' ? 'eye' : 'clock'}>{m.cta}</Btn>}
      </div>
    </Shell>
  );
}

function StatCell({ label, children }) {
  return (
    <div style={{ background: '#fff', padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: T.text3, textTransform: 'uppercase' }}>{label}</span>
      {children}
    </div>
  );
}

function EntityTag({ id, role, onClick }) {
  const { ENT } = window.AP;
  const e = ENT[id];
  return (
    <span onClick={() => onClick(id)} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 7px', borderRadius: 9999, cursor: 'pointer',
      background: role === 'Primary' ? '#d1e9ff' : '#fafafa', boxShadow: `inset 0 0 0 1px ${role === 'Primary' ? '#84caff' : T.bd}`,
      fontSize: 12, fontWeight: 700, color: role === 'Primary' ? T.accHi : T.text2,
    }}>
      <Ic name={e.icon} size={13} /> {e.name}
      <span style={{ fontSize: 10, fontWeight: 600, color: T.text3, marginLeft: 1 }}>· {role}</span>
    </span>
  );
}

// ──────────────── Signal drawer ────────────────
function SignalDrawer({ signal, drawerWidth, onClose, onPickEntity, onPickPattern, onViewAgent }) {
  if (!signal) return null;
  const s = signal;
  const { ENT, agentById, PAT } = window.AP;
  const ag = agentById[s.agent];

  const header = (
    <div style={{ padding: '18px 22px 16px', borderBottom: `1px solid ${T.bd}`, flex: 'none', background: '#fafafa' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
        <Pill tone="neutral" size="xs"><span style={{ fontVariantNumeric: 'tabular-nums' }}>{s.id}</span></Pill>
        <Pill tone={s.status === 'Linked' ? 'ready' : 'warn'} size="xs" dot>{s.status}</Pill>
        <span style={{ marginLeft: 'auto' }}><IconBtn name="x" size={30} onClick={onClose} title="Close" /></span>
      </div>
      <h2 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: T.text, lineHeight: 1.34, letterSpacing: '-0.01em' }}>{s.title}</h2>
      <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.text3 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 600, color: T.text2 }}><VectorGlyph vector={s.vector} /> {s.vector}</span>
        <span style={{ color: T.bdHi }}>·</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>Detected {s.detected.includes('context') ? s.detected : s.detected + ' CT'}</span>
      </div>
    </div>
  );

  return (
    <Shell onClose={onClose} width={drawerWidth} header={header}>
      <div style={{ padding: '4px 22px 24px' }}>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: T.bd, borderRadius: 12, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${T.bd}` }}>
          <StatCell label="Strength"><EvidenceBar level={s.strength} /></StatCell>
          <StatCell label="Confidence"><ConfidenceDots level={s.confidence} /></StatCell>
        </div>

        <Section title="Claim" icon="flag"><Para>{s.claim}</Para></Section>
        <Section title="Why it matters" icon="alertCircle"><Para>{s.whyMatters}</Para></Section>

        <Section title="Entity tags" icon="crosshair">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {s.tags.map(t => <EntityTag key={t.id} id={t.id} role={t.role} onClick={onPickEntity} />)}
          </div>
        </Section>

        <Rule />

        <Section title="Evidence" icon="database"><Para>{s.evidence}</Para>
          <div style={{ marginTop: 9 }}><Btn variant="ghost" size="xs" iconRight="arrowUpRight">View source record</Btn></div>
        </Section>

        <Section title="Recommended action" icon="zap">
          <div style={{ padding: '13px 15px', borderRadius: 10, background: '#eff6ff', boxShadow: 'inset 0 0 0 1px #bfdbfe' }}><Para>{s.action}</Para></div>
        </Section>

        {s.questions && s.questions.length > 0 && (
          <Section title="Open questions" icon="help">
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.questions.map((q, i) => (
                <li key={i} style={{ display: 'flex', gap: 9, fontSize: 13.5, color: T.text2, lineHeight: 1.5 }}>
                  <span style={{ color: T.dev, flex: 'none', marginTop: 2 }}><Ic name="help" size={15} /></span>{q}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Rule />

        <Section title="Linked patterns" icon="layers">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {s.patterns.map(pid => {
              const p = PAT[pid]; if (!p) return null;
              return (
                <div key={pid} onClick={() => onPickPattern(p)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 9, cursor: 'pointer', boxShadow: `inset 0 0 0 1px ${T.bd}` }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <MaturityBadge value={p.maturity} size="xs" />
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: T.text, lineHeight: 1.35 }}>{p.title}</span>
                  <Ic name="chevRight" size={15} color={T.text4} />
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Producing agent" icon="cpu">
          <div onClick={onViewAgent} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '8px 12px', borderRadius: 9, cursor: 'pointer', boxShadow: `inset 0 0 0 1px ${T.bd}` }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: `${ag.color}14`, color: ag.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ic name={ag.icon} size={14} /></span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.acc }}>{ag.name}</span>
          </div>
        </Section>
      </div>

      <div style={{ borderTop: `1px solid ${T.bd}`, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 8, background: '#fff', flex: 'none' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          <IconBtn name="thumbUp" size={32} iconSize={16} title="Useful" />
          <IconBtn name="thumbDown" size={32} iconSize={16} title="Not useful" />
        </div>
        <div style={{ flex: 1 }} />
        <Btn variant="secondary" size="sm" icon="link">Add to evidence matrix</Btn>
      </div>
    </Shell>
  );
}

window.PatternDrawer = PatternDrawer;
window.SignalDrawer = SignalDrawer;
window.ApEntityTag = EntityTag;
})();
