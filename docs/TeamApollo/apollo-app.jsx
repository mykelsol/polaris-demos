// Apollo — main app: routing, drawers, modal, assist, toast, tweaks
(function () {
const T = window.T;
const { Sidebar, TopBar, GlobalHub, EntitiesIndex, EntityOverview, AgentsIndex, AgentView,
  PatternsView, SignalsView, InsightsIndex, InsightDetail, StrategyView, PatternDrawer, SignalDrawer,
  CreateInsightModal, AssistPanel, OperationsIndex, OperationView, DistributionView, DistributionPreview,
  PersistenceView, Ic, Btn, SectionHead, Card, OpTag } = window;

const ACCENTS = {
  Cobalt:  { acc: '#1570ef', accHi: '#175cd3' },
  Royal:   { acc: '#2563eb', accHi: '#1d4ed8' },
  Indigo:  { acc: '#4f46e5', accHi: '#4338ca' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "Cobalt",
  "sidebarCollapsed": false,
  "drawerWidth": 540,
  "denseTables": false
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  React.useMemo(() => { const a = ACCENTS[tweaks.accent] || ACCENTS.Cobalt; window.T.acc = a.acc; window.T.accHi = a.accHi; }, [tweaks.accent]);

  const [route, setRoute] = React.useState('hub');
  const [pickedPattern, setPickedPattern] = React.useState(null);
  const [pickedSignal, setPickedSignal] = React.useState(null);
  const [pickedDist, setPickedDist] = React.useState(null);
  const [modalPattern, setModalPattern] = React.useState(null);
  const [assistOpen, setAssistOpen] = React.useState(false);
  const [toast, setToast] = React.useState('');
  const [running, setRunning] = React.useState(false);
  const mainRef = React.useRef(null);

  const showToast = (m) => { setToast(m); window.clearTimeout(App._t); App._t = window.setTimeout(() => setToast(''), 2800); };

  const nav = (r) => {
    setPickedPattern(null); setPickedSignal(null); setModalPattern(null); setPickedDist(null);
    setRoute(r);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const onPickEntity = (id) => { setPickedPattern(null); setPickedSignal(null); nav(`entity:${id}`); };
  const onNavAgent = (id) => { setPickedPattern(null); setPickedSignal(null); nav(`agent:${id}`); };
  const onOpenInsight = (i) => { setPickedPattern(null); setPickedSignal(null); setPickedDist(null); nav(`insight:${i.id}`); };
  const onOpenOp = (id) => nav(`op:${id}`);
  const onCreateInsight = (p) => setModalPattern(p);
  const onPickPattern = (p) => { setPickedSignal(null); setPickedPattern(p); };
  const onPickSignal = (s) => { setPickedSignal(s); };
  const onOpenDist = (d) => setPickedDist(d);

  const runAgents = () => {
    if (running) return;
    setRunning(true);
    window.setTimeout(() => { setRunning(false); showToast('Agents run complete · 9 new signals, 2 patterns promoted across both operations'); }, 1500);
  };

  const doCreate = (p, output, title) => {
    setModalPattern(null);
    const report = p.report ? window.AP.INS[p.report] : null;
    showToast(`Analyst Report draft created · "${title}"`);
    if (report) { setPickedPattern(null); nav(`insight:${report.id}`); }
  };

  // sidebar active highlight
  let sidebarRoute = route;
  if (route.startsWith('entity:')) sidebarRoute = 'entities';
  else if (route.startsWith('agent:')) sidebarRoute = 'agents';
  else if (route.startsWith('insight:')) sidebarRoute = 'insights';
  else if (route.startsWith('op:')) sidebarRoute = route; // keep op highlight in operations group

  const { patterns, signals, INS } = window.AP;

  let body;
  if (route === 'hub') {
    body = <GlobalHub onPickPattern={onPickPattern} onCreateInsight={onCreateInsight} onPickEntity={onPickEntity}
      onNavAgent={onNavAgent} onOpenInsight={onOpenInsight} onNav={nav} onOpenOp={onOpenOp} onOpenDist={onOpenDist} />;
  } else if (route === 'operations') {
    body = <OperationsIndex onOpenOp={onOpenOp} onPickPattern={onPickPattern} />;
  } else if (route.startsWith('op:')) {
    body = <OperationView opId={route.slice(3)} onPickPattern={onPickPattern} onCreateInsight={onCreateInsight}
      onPickEntity={onPickEntity} onPickSignal={onPickSignal} onOpenInsight={onOpenInsight} onNavAgent={onNavAgent} onNav={nav} />;
  } else if (route === 'entities') {
    body = <EntitiesIndex onPickEntity={onPickEntity} />;
  } else if (route.startsWith('entity:')) {
    body = <EntityOverview entityId={route.slice(7)} onPickPattern={onPickPattern} onCreateInsight={onCreateInsight}
      onPickSignal={onPickSignal} onOpenInsight={onOpenInsight} onPickEntity={onPickEntity} onNavAgent={onNavAgent} onAssist={() => setAssistOpen(true)} />;
  } else if (route === 'agents') {
    body = <AgentsIndex onPickAgent={onNavAgent} />;
  } else if (route.startsWith('agent:')) {
    body = <AgentView agentId={route.slice(6)} onPickPattern={onPickPattern} onCreateInsight={onCreateInsight}
      onPickSignal={onPickSignal} onOpenInsight={onOpenInsight} onPickEntity={onPickEntity} onNav={nav} />;
  } else if (route === 'patterns') {
    body = <PageWrap eyebrow="Patterns" title="All patterns" sub="The primary intelligence object · Signals compound into Patterns, Patterns become Analyst Reports"><PatternsView patterns={patterns} onPick={onPickPattern} onCta={p => p.maturity === 'Insight Ready' ? onCreateInsight(p) : onPickPattern(p)} /></PageWrap>;
  } else if (route === 'signals') {
    body = <PageWrap eyebrow="Signals" title="Evidence library" sub="Discrete pieces of evidence detected by agents · linked to patterns, never reported in isolation"><SignalsView signals={signals} onPick={onPickSignal} /></PageWrap>;
  } else if (route === 'insights') {
    body = <InsightsIndex onOpenInsight={onOpenInsight} />;
  } else if (route.startsWith('insight:')) {
    const rep = INS[route.slice(8)];
    body = <InsightDetail insight={rep} onBack={() => nav('insights')} onPickSignal={onPickSignal} onPickEntity={onPickEntity} onOpenDist={onOpenDist}
      onReturnToPattern={() => { const p = window.AP.PAT[rep.sourcePattern]; nav('patterns'); if (p) setTimeout(() => onPickPattern(p), 30); }}
      onToast={showToast} />;
  } else if (route === 'distribution') {
    body = <DistributionView onOpen={onOpenDist} onNav={nav} />;
  } else if (route === 'persistence') {
    body = <PersistenceView />;
  } else if (route === 'strategy') {
    body = <StrategyView onNav={nav} onToast={showToast} />;
  } else if (route === 'settings') {
    body = <SettingsPlaceholder />;
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <Sidebar route={sidebarRoute} onNav={nav} collapsed={tweaks.sidebarCollapsed} />
      <main ref={mainRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto', background: '#fafafa' }}>
        <TopBar onToggleSidebar={() => setTweak('sidebarCollapsed', !tweaks.sidebarCollapsed)} onRunAgents={runAgents} onAssist={() => setAssistOpen(true)} running={running} />
        <div style={{ flex: 1 }}>{body}</div>
      </main>

      {pickedPattern && <PatternDrawer pattern={pickedPattern} drawerWidth={tweaks.drawerWidth} onClose={() => setPickedPattern(null)}
        onCreateInsight={onCreateInsight} onViewSignals={() => { setPickedPattern(null); nav('signals'); }}
        onViewAgent={() => { const aid = pickedPattern.agent; setPickedPattern(null); onNavAgent(aid); }}
        onViewOperation={(opId) => { setPickedPattern(null); onOpenOp(opId); }}
        onPickEntity={(id) => { setPickedPattern(null); onPickEntity(id); }} onPickSignal={onPickSignal} />}

      {pickedSignal && <SignalDrawer signal={pickedSignal} drawerWidth={tweaks.drawerWidth} onClose={() => setPickedSignal(null)}
        onPickEntity={(id) => { setPickedSignal(null); onPickEntity(id); }}
        onPickPattern={(p) => { setPickedSignal(null); onPickPattern(p); }}
        onViewAgent={() => { const aid = pickedSignal.agent; setPickedSignal(null); onNavAgent(aid); }} />}

      {pickedDist && <DistributionPreview output={pickedDist} onClose={() => setPickedDist(null)} onToast={showToast}
        onOpenReport={(r) => { setPickedDist(null); onOpenInsight(r); }} />}

      {modalPattern && <CreateInsightModal pattern={modalPattern} onClose={() => setModalPattern(null)} onCreate={doCreate} />}

      {assistOpen && <AssistPanel onClose={() => setAssistOpen(false)} />}

      {toast && <Toast msg={toast} onClose={() => setToast('')} />}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Appearance">
          <window.TweakColor label="Accent" value={tweaks.accent}
            options={['Cobalt', 'Royal', 'Indigo'].map(k => ACCENTS[k].acc)}
            onChange={(hex) => { const name = Object.keys(ACCENTS).find(k => ACCENTS[k].acc === hex) || 'Cobalt'; setTweak('accent', name); }} />
          <window.TweakToggle label="Collapse navigation" value={tweaks.sidebarCollapsed} onChange={v => setTweak('sidebarCollapsed', v)} />
        </window.TweakSection>
        <window.TweakSection label="Layout">
          <window.TweakSlider label="Drawer width" value={tweaks.drawerWidth} min={460} max={640} step={20} unit="px" onChange={v => setTweak('drawerWidth', v)} />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

function PageWrap({ eyebrow, title, sub, children }) {
  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 18 }}><SectionHead eyebrow={eyebrow} accent={window.T.acc} title={title} sub={sub} /></div>
      {children}
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div style={{ padding: '24px 32px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 18 }}><SectionHead eyebrow="Settings" accent={window.T.acc} title="Instance settings" sub="Configuration for the Command Post Intelligence Hub demo instance" /></div>
      <Card style={{ padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Instance', 'Command Post Intelligence Hub', 'globe'],
            ['Environment', 'Synthetic multi-operation demo', 'database'],
            ['Data classification', 'Fictional / unclassified demo', 'eye'],
            ['Last sync', window.AP.sync, 'refresh'],
            ['Active agents', '10 agents across both operations', 'cpu'],
            ['Active operations', 'Sierra Ember · Iron Shield', 'navigation'],
          ].map(([k, v, ic]) => (
            <div key={k} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 11, boxShadow: `inset 0 0 0 1px ${window.T.bd}` }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, background: '#eff4ff', color: window.T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={ic} size={17} /></span>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: window.T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: window.T.text, marginTop: 3 }}>{v}</div></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Toast({ msg, onClose }) {
  return (
    <div style={{ position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 90, background: '#0f1b2e', color: '#fff', padding: '12px 18px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, boxShadow: '0 14px 32px -10px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 560, animation: 'ap-toast .24s cubic-bezier(0.16,1,0.3,1)' }}>
      <Ic name="checkCircle" size={17} color="#34d8a0" />
      {msg}
      <span onClick={onClose} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'inline-flex', marginLeft: 4 }}><Ic name="x" size={15} /></span>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
