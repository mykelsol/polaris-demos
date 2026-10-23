// Apollo — Agent View (tabs) + Agents index
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, Card, Tabs, PatternsView, SignalsView, InsightMiniCard, SectionHead, MATURITY } = window;

function agentScope(agentId) {
  const { patterns, signals, reports, PAT } = window.AP;
  return {
    pats: patterns.filter(p => p.agent === agentId),
    sigs: signals.filter(s => s.agent === agentId),
    ins: reports.filter(i => PAT[i.sourcePattern] && PAT[i.sourcePattern].agent === agentId),
  };
}

const RUN_HISTORY = [
  { time: 'Jun 11 · 14:44 CT', label: '8m ago', emit: 5, watch: 3, reject: 9, promoted: 'Promoted North Ridge evacuation corridor to Insight Ready' },
  { time: 'Jun 11 · 13:44 CT', label: '1h ago', emit: 3, watch: 4, reject: 11, promoted: 'No new Insight Ready promotions' },
  { time: 'Jun 11 · 12:44 CT', label: '2h ago', emit: 6, watch: 2, reject: 8, promoted: 'Detected convergence around POI Orion' },
  { time: 'Jun 11 · 11:44 CT', label: '3h ago', emit: 2, watch: 3, reject: 10, promoted: 'No new Insight Ready promotions' },
  { time: 'Jun 11 · 10:44 CT', label: '4h ago', emit: 4, watch: 2, reject: 7, promoted: 'Opened collection gap on Route 18 clearance timing' },
];

function AgentView({ agentId, onPickPattern, onCreateInsight, onPickSignal, onOpenInsight, onPickEntity, onNav }) {
  const { agentById, ENT } = window.AP;
  const ag = agentById[agentId];
  const [tab, setTab] = React.useState('overview');
  React.useEffect(() => { setTab('overview'); }, [agentId]);
  if (!ag) return null;

  const { pats, sigs, ins } = agentScope(agentId);
  const k = ag.kpis;

  const headerStats = [
    ['Status', ag.status], ['Lens', ag.lens], ['Shape', ag.shape],
    ['Strategy', ag.version], ['Cadence', ag.cadence], ['Last run', ag.lastRun],
  ];
  const kpiCells = [
    { label: 'Signals · 24h', value: k.signals24h },
    { label: 'High Strength', value: k.highStrength },
    { label: 'Active Patterns', value: k.patterns },
    { label: 'Insight Ready', value: k.insightReady, tone: 'ready' },
    { label: 'Open Gaps', value: k.gaps, tone: k.gaps > 2 ? 'risk' : null },
    { label: 'Last Run', value: ag.lastRun, text: true },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'signals', label: 'Signals', icon: 'signal', count: sigs.length },
    { id: 'patterns', label: 'Patterns', icon: 'layers', count: pats.length },
    { id: 'reports', label: 'Reports', icon: 'fileText', count: ins.length },
    { id: 'config', label: 'Configuration', icon: 'sliders' },
    { id: 'history', label: 'History', icon: 'history' },
  ];

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      {/* header card */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: `0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px ${T.bd}`, overflow: 'hidden' }}>
        <div style={{ padding: '22px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <span style={{ width: 52, height: 52, borderRadius: 13, background: `${ag.color}14`, color: ag.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxShadow: `inset 0 0 0 1px ${ag.color}40` }}><Ic name={ag.icon} size={27} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>{ag.name}</h1>
                <Pill tone="ready" size="xs" dot>{ag.status}</Pill>
              </div>
              <div style={{ display: 'flex', gap: 18, marginTop: 10, flexWrap: 'wrap' }}>
                {headerStats.map(([kk, v]) => (
                  <div key={kk} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kk}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <Btn variant="secondary" size="sm" icon="sliders" onClick={() => setTab('config')}>Edit strategy</Btn>
          </div>
          <div style={{ marginTop: 16, padding: '13px 16px', borderRadius: 11, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}`, display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <Ic name="target" size={17} color={T.acc} style={{ marginTop: 1, flex: 'none' }} />
            <div><span style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent purpose</span>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: T.text2, lineHeight: 1.55 }}>{ag.purpose}</p></div>
          </div>
        </div>
        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderTop: `1px solid ${T.bd}`, background: '#fafafa' }}>
          {kpiCells.map((c, i) => (
            <div key={c.label} style={{ padding: '13px 18px', borderLeft: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{c.label}</div>
              <div style={{ fontSize: c.text ? 16 : 22, fontWeight: 700, marginTop: 4, color: c.tone === 'ready' ? T.ready : (c.tone === 'risk' ? T.risk : T.text), fontVariantNumeric: 'tabular-nums' }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22 }}><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      <div style={{ marginTop: 22 }}>
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 20 }}>
            <Card style={{ padding: '20px 22px' }}>
              <SectionHead eyebrow="Monitoring strategy" accent={ag.color} title="Detection objectives" style={{ marginBottom: 16 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ag.strategy.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: T.readyBg, color: T.ready, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}><Ic name="check" size={14} strokeWidth={2.4} /></span>
                    <span style={{ fontSize: 13.5, color: T.text2, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card style={{ padding: '18px 18px', alignSelf: 'start' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 13 }}>Monitored entities</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ag.monitored.map(id => {
                  const e = ENT[id]; if (!e) return null;
                  return (
                    <div key={id} onClick={() => onPickEntity(id)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px', borderRadius: 8, cursor: 'pointer' }}
                      onMouseEnter={ev => ev.currentTarget.style.background = '#fafafa'} onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}>
                      <span style={{ width: 24, height: 24, borderRadius: 6, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={e.icon} size={14} /></span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.text }}>{e.name}</span>
                      <window.FreshDot score={e.freshness} />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
        {tab === 'patterns' && <PatternsView patterns={pats} onPick={onPickPattern} onCta={p => p.maturity === 'Insight Ready' ? onCreateInsight(p) : onPickPattern(p)} />}
        {tab === 'signals' && <SignalsView signals={sigs} onPick={onPickSignal} />}
        {tab === 'reports' && (
          ins.length ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>{ins.map(i => <InsightMiniCard key={i.id} insight={i} onOpen={() => onOpenInsight(i)} />)}</div>
            : <div style={{ padding: '56px 24px', textAlign: 'center', color: T.text3 }}><div style={{ fontWeight: 700, color: T.text2, fontSize: 14.5 }}>No analyst reports from this agent yet</div></div>
        )}
        {tab === 'config' && window.StrategyView && <window.StrategyView embedded agentId={agentId} onNav={onNav} />}
        {tab === 'history' && <RunHistory agent={ag} />}
      </div>
    </div>
  );
}

function RunHistory({ agent }) {
  return (
    <Card style={{ overflow: 'hidden' }}>
      <div style={{ padding: '15px 18px', borderBottom: `1px solid ${T.bd}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Ic name="history" size={17} color={T.acc} />
        <span style={{ fontSize: 14.5, fontWeight: 700, color: T.text }}>Run history</span>
        <span style={{ fontSize: 12.5, color: T.text3 }}>· {agent.cadence} cadence</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.font }}>
        <thead><tr style={{ background: '#fafafa', borderBottom: `1px solid ${T.bd}` }}>
          {['Run', 'When', 'Emitted', 'Watched', 'Rejected', 'Result'].map(c => <th key={c} style={{ textAlign: 'left', padding: '10px 18px', fontSize: 11.5, fontWeight: 700, color: T.text3, whiteSpace: 'nowrap' }}>{c}</th>)}
        </tr></thead>
        <tbody>
          {RUN_HISTORY.map((r, i) => (
            <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
              <td style={{ padding: '13px 18px', fontSize: 12.5, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{r.time}</td>
              <td style={{ padding: '13px 18px', fontSize: 12.5, color: T.text3, whiteSpace: 'nowrap' }}>{r.label}</td>
              <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 700, color: T.ready, fontVariantNumeric: 'tabular-nums' }}>{r.emit}</td>
              <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 700, color: T.dev, fontVariantNumeric: 'tabular-nums' }}>{r.watch}</td>
              <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 600, color: T.text3, fontVariantNumeric: 'tabular-nums' }}>{r.reject}</td>
              <td style={{ padding: '13px 18px', fontSize: 12.5, color: T.text2 }}>{r.promoted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function AgentsIndex({ onPickAgent }) {
  const { agents } = window.AP;
  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 18 }}>
        <SectionHead eyebrow="Agents" accent={T.acc} title="10 active agents"
          sub="Each agent runs a monitoring strategy across a set of entities and compounds signals into patterns"
          action={<Btn variant="secondary" size="sm" icon="plus">New agent</Btn>} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {agents.map(ag => {
          const k = ag.kpis;
          return (
            <Card key={ag.id} hover onClick={() => onPickAgent(ag.id)} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
                <span style={{ width: 42, height: 42, borderRadius: 11, background: `${ag.color}14`, color: ag.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={ag.icon} size={22} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{ag.name}</span>
                    <Pill tone="ready" size="xs" dot>{ag.status}</Pill>
                  </div>
                  <div style={{ fontSize: 12, color: T.text3, marginTop: 3 }}>{ag.lens} · {ag.shape} · {ag.version} · {ag.cadence}</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: T.text2, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ag.purpose}</p>
              <div style={{ display: 'flex', gap: 20, paddingTop: 13, borderTop: `1px solid ${T.bd}` }}>
                <AgStat label="Signals 24h" value={k.signals24h} />
                <AgStat label="Patterns" value={k.patterns} />
                <AgStat label="Insight Ready" value={k.insightReady} tone="ready" />
                <AgStat label="Open Gaps" value={k.gaps} tone={k.gaps > 2 ? 'risk' : null} />
                <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 11.5, color: T.text3 }}>Last run {ag.lastRun}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
function AgStat({ label, value, tone }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, color: tone === 'ready' ? T.ready : (tone === 'risk' ? T.risk : T.text), fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

window.AgentView = AgentView;
window.AgentsIndex = AgentsIndex;
})();
