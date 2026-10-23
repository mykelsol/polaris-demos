// Polaris Intel Hub — Global View main app
// Wires sidebar nav, tabs, filter bar, signals table, drawer, agents tab, and tweaks.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "strengthMode": "badge",
  "sidebarCollapsed": false,
  "drawerWidth": 480,
  "showHighStrengthChip": true,
  "showOverviewBeforeSignals": false
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  const { signals, agents, entities } = window.POLARIS_DATA;

  const [route, setRoute] = React.useState('hub');
  const [tab, setTab] = React.useState('signals');
  const [view, setView] = React.useState('table');
  const [query, setQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    status: 'All', strength: 'All', type: 'All', entity: 'All', agent: 'All', date: 'Last 30 days',
  });
  const [highOnly, setHighOnly] = React.useState(false);
  const [picked, setPicked] = React.useState(null);
  const [pickedPattern, setPickedPattern] = React.useState(null);
  const [toast, setToast] = React.useState('');
  const [reportCrumb, setReportCrumb] = React.useState(null);

  // Build agent-name → id lookup
  const agentByName = React.useMemo(() => Object.fromEntries(agents.map(a => [a.name, a.id])), [agents]);
  const entityByName = React.useMemo(() => Object.fromEntries(entities.map(e => [e.name, e.id])), [entities]);

  // Apply filters + search
  const filteredSignals = React.useMemo(() => {
    let rows = signals;
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.body.toLowerCase().includes(q) ||
        window.POLARIS_DATA.E[s.entity].toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.pattern.toLowerCase().includes(q)
      );
    }
    if (filters.status !== 'All')   rows = rows.filter(s => s.status === filters.status);
    if (filters.strength !== 'All') rows = rows.filter(s => s.strength === filters.strength);
    if (filters.type !== 'All')     rows = rows.filter(s => s.type === filters.type);
    if (filters.entity !== 'All')   rows = rows.filter(s => window.POLARIS_DATA.E[s.entity] === filters.entity);
    if (filters.agent !== 'All') {
      const aid = agentByName[filters.agent];
      if (aid) rows = rows.filter(s => s.agent === aid);
    }
    if (tweaks.showHighStrengthChip && highOnly) {
      rows = rows.filter(s => s.strength === 'High');
    }
    return rows;
  }, [signals, query, filters, highOnly, tweaks.showHighStrengthChip, agentByName]);

  // When sidebar nav routes to a non-hub destination
  const handleNav = (r) => {
    setRoute(r);
    setPicked(null);
    setPickedPattern(null);
    setReportCrumb(null);
    // Coming back to hub resets the tab
    if (r === 'hub') setTab(tweaks.showOverviewBeforeSignals ? 'overview' : 'signals');
    // If an entity, route to its Overview tab (with signals/patterns pre-filtered).
    if (r.startsWith('entity-')) {
      const id = r.replace('entity-', '');
      const ent = entities.find(e => e.id === id);
      if (ent) {
        setRoute('hub'); setTab('overview');
        setFilters(f => ({ ...f, entity: ent.name }));
      }
    }
    if (r.startsWith('agent-')) {
      const id = r.replace('agent-', '');
      const a = agents.find(x => x.id === id);
      if (a) {
        setRoute('hub'); setTab('signals');
        setFilters(f => ({ ...f, agent: a.name }));
      }
    }
  };

  const handleTab = (id) => {
    setTab(id);
    setPicked(null);
    setPickedPattern(null);
    setReportCrumb(null);
    window.dispatchEvent(new CustomEvent('polaris:closeReport'));
  };

  // Breadcrumb click — navigate up the chain.
  const handleCrumb = (label) => {
    if (label === workspaceLabel) { handleNav('hub'); return; }
    if (label === 'Risk Reports') {
      // Close the open report, stay on the Risk Reports tab.
      setReportCrumb(null);
      window.dispatchEvent(new CustomEvent('polaris:closeReport'));
      return;
    }
    if (filters.entity !== 'All' && label === filters.entity) {
      setTab('overview');
      setReportCrumb(null);
      window.dispatchEvent(new CustomEvent('polaris:closeReport'));
    }
  };

  // Active route — for sidebar highlight
  const activeSidebarRoute = (() => {
    if (route !== 'hub') return route;
    // Map current filter → sidebar item
    if (filters.entity !== 'All' && entityByName[filters.entity]) return `entity-${entityByName[filters.entity]}`;
    if (filters.agent  !== 'All' && agentByName[filters.agent])   return `agent-${agentByName[filters.agent]}`;
    return 'hub';
  })();

  const clearAllFilters = () => {
    setQuery('');
    setHighOnly(false);
    setFilters({
      status: 'All', strength: 'All', type: 'All', entity: 'All', agent: 'All', date: 'Last 30 days',
    });
  };

  const rowAction = (action, signal) => {
    if (action === 'mark')     setToast(`Marked "${truncate(signal.title)}" reviewed`);
    if (action === 'assign')   setToast(`Assigned "${truncate(signal.title)}" to you`);
    if (action === 'snooze')   setToast(`Snoozed "${truncate(signal.title)}" for 7 days`);
    if (action === 'dismiss')  setToast(`Dismissed "${truncate(signal.title)}"`);
    if (action === 'open')     setToast(`Opened "${truncate(signal.title)}" in a new tab`);
  };

  const workspaceLabel = window.POLARIS_DATA.workspace?.label || 'ABM Intelligence Hub';

  // Breadcrumbs
  const crumbs = (() => {
    if (route === 'hub') {
      const base = [workspaceLabel];
      if (filters.entity !== 'All') {
        base.push(filters.entity);
        if (tab === 'insights') {
          base.push('Risk Reports');
          if (reportCrumb) base.push(reportCrumb);
        }
      }
      else if (filters.agent !== 'All') base.push(filters.agent);
      else if (tab === 'patterns') base.push('Patterns');
      else if (tab === 'agents')   base.push('Agents');
      else if (tab === 'overview') base.push('Overview');
      return base;
    }
    if (route === 'help')    return ['Help Center'];
    if (route === 'resolve') return ['Resolution Center'];
    if (route === 'new-agent') return ['Agents', 'New Agent'];
    if (route === 'entities-more') return ['Entities'];
    return [workspaceLabel];
  })();

  // When an entity is the active context, expose its per-entity Insights tab.
  const activeEntityId = (filters.entity !== 'All' && entityByName[filters.entity]) ? entityByName[filters.entity] : null;
  const entityInsightCount = React.useMemo(() => {
    if (!activeEntityId) return 0;
    return signals.filter(s => s.entity === activeEntityId).length;
  }, [signals, activeEntityId]);

  // Body
  let body;
  if (route === 'hub') {
    const hubTabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'signals',  label: 'Signals',  count: filteredSignals.length },
      { id: 'patterns', label: 'Patterns', count: window.POLARIS_DATA.patterns.length },
      ...(activeEntityId ? [{ id: 'insights', label: 'Risk Reports', count: entityInsightCount }] : []),
      { id: 'agents',   label: 'Agents',   count: agents.length },
    ];
    body = (
      <>
        <PageHeader
          title={workspaceLabel}
          tabs={hubTabs}
          activeTab={tab}
          onTab={handleTab}
        />

        {tab === 'insights' && activeEntityId && (
          <EntityInsights entityId={activeEntityId} onToast={setToast} onCrumb={setReportCrumb} />
        )}

        {tab === 'overview' && (
          (filters.entity !== 'All' && entityByName[filters.entity])
            ? <EntityOverview
                entityId={entityByName[filters.entity]}
                onPickPattern={setPickedPattern}
                onJumpToTab={handleTab}
                onManageMonitoring={() => setToast('Monitoring configuration opens in the live product.')}
              />
            : <OverviewView
                signals={signals} agents={agents}
                onPickSignal={setPicked}
                onPickPattern={setPickedPattern}
                onJumpToTab={handleTab}
              />
        )}

        {tab === 'signals' && (
          <>
            <FilterBar
              query={query} onQuery={setQuery}
              view={view} onView={setView}
              filters={filters}
              onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
              onClearAll={clearAllFilters}
              showStrengthFilter={tweaks.showHighStrengthChip
                ? { value: highOnly, onChange: setHighOnly }
                : null}
            />
            {view === 'table' ? (
              <SignalsTable
                signals={filteredSignals}
                onPick={setPicked}
                density={tweaks.density}
                strengthMode={tweaks.strengthMode}
                onAction={rowAction}
                pickedId={picked?.id}
              />
            ) : (
              <SignalsListView
                signals={filteredSignals}
                onPick={setPicked}
                strengthMode={tweaks.strengthMode}
                pickedId={picked?.id}
              />
            )}
          </>
        )}

        {tab === 'patterns' && (
          <PatternsView
            onPick={setPickedPattern}
            pickedId={pickedPattern?.id}
            density={tweaks.density}
          />
        )}

        {tab === 'agents' && (
          <>
            <FilterBar
              query={query} onQuery={setQuery}
              view={view} onView={setView}
              filters={filters}
              onFilterChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
              onClearAll={clearAllFilters}
              searchPlaceholder="Search agents or entities…"
            />
            <AgentsTable density={tweaks.density} />
          </>
        )}
      </>
    );
  } else if (route === 'help') {
    body = (
      <>
        <PageHeader title="Help Center" />
        <PlaceholderScreen
          title="Documentation, API reference, and glossary"
          body="The Polaris Help Center lives here in production. This is a placeholder in the prototype."
          icon="help-circle"
        />
      </>
    );
  } else if (route === 'resolve') {
    body = (
      <>
        <PageHeader title="Resolution Center" />
        <PlaceholderScreen
          title="Issues queued for review"
          body="Resolution center collects signals that need analyst confirmation before they're routed to a workspace."
          icon="alert-circle"
        />
      </>
    );
  } else if (route === 'new-agent') {
    body = (
      <>
        <PageHeader title="New Agent" />
        <PlaceholderScreen
          title="Configure a new agent"
          body="Agents continuously monitor entities for signals across growth, risk, market, and operational lenses. Choose a shape, scope, and strategy to begin."
          icon="plus"
        />
      </>
    );
  } else if (route === 'entities-more') {
    body = (
      <>
        <PageHeader title="Entities" />
        <PlaceholderScreen
          title="All monitored entities"
          body="The full entity list — including segments, markets, and named accounts — lives here."
          icon="target-04"
        />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <Sidebar
        currentRoute={activeSidebarRoute}
        onNavigate={handleNav}
        collapsed={tweaks.sidebarCollapsed}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto', background: '#fff' }}>
        <TopBar
          crumbs={crumbs}
          onSidebarToggle={() => setTweak('sidebarCollapsed', !tweaks.sidebarCollapsed)}
          onAction={handleNav}
          onCrumbClick={handleCrumb}
        />
        {body}
        <div style={{ height: 80 }} />
      </main>

      <SignalDrawer
        signal={picked}
        onClose={() => setPicked(null)}
        drawerWidth={tweaks.drawerWidth}
      />

      <PatternDrawer
        pattern={pickedPattern}
        onClose={() => setPickedPattern(null)}
        drawerWidth={tweaks.drawerWidth}
      />

      <FloatingAssist onClick={() => setToast('Polaris Assist is available inside any open signal.')} />

      <Toast msg={toast} onDismiss={() => setToast('')} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakRadio
            label="Density"
            value={tweaks.density}
            options={['comfortable', 'compact']}
            onChange={v => setTweak('density', v)}
          />
          <TweakToggle
            label="Collapse sidebar"
            value={tweaks.sidebarCollapsed}
            onChange={v => setTweak('sidebarCollapsed', v)}
          />
          <TweakSlider
            label="Drawer width"
            value={tweaks.drawerWidth}
            min={400} max={680} step={10} unit="px"
            onChange={v => setTweak('drawerWidth', v)}
          />
        </TweakSection>
        <TweakSection label="Signals table">
          <TweakRadio
            label="Strength display"
            value={tweaks.strengthMode}
            options={['badge', 'dot', 'bar']}
            onChange={v => setTweak('strengthMode', v)}
          />
          <TweakToggle
            label="Show 'high strength only' quick filter"
            value={tweaks.showHighStrengthChip}
            onChange={v => setTweak('showHighStrengthChip', v)}
          />
          <TweakToggle
            label="Start on Overview tab"
            value={tweaks.showOverviewBeforeSignals}
            onChange={v => setTweak('showOverviewBeforeSignals', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// ──────────────── Signals list view (alt to table) ────────────────
function SignalsListView({ signals, onPick, strengthMode, pickedId }) {
  const { E, agents } = window.POLARIS_DATA;
  const agentMap = Object.fromEntries(agents.map(a => [a.id, a]));
  return (
    <div style={{
      margin: '24px 32px 0',
      background: '#fff', borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
      overflow: 'hidden',
    }}>
      <CardHeader title="Signals" subtitle={`${signals.length} signals · 3 agents · last 30 days`} />
      <div>
        {signals.length === 0 && (
          <div style={{ padding: '64px 24px', textAlign: 'center', color: '#737373', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 700, color: '#404040', fontSize: 15, marginBottom: 6 }}>No signals match these filters</div>
            Loosen the strength or date range, or reset to defaults.
          </div>
        )}
        {signals.map((s, i) => {
          const a = agentMap[s.agent];
          const isPicked = pickedId === s.id;
          return (
            <div key={s.id}
              onClick={() => onPick(s)}
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #f0f0f0',
                display: 'flex', gap: 16,
                cursor: 'pointer',
                background: isPicked ? '#f5fafc' : 'transparent',
                transition: 'background .12s',
              }}
              onMouseEnter={e => { if (!isPicked) e.currentTarget.style.background = '#fafafa'; }}
              onMouseLeave={e => { if (!isPicked) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Strength level={s.strength} mode={strengthMode} />
                  <span style={{ fontSize: 12, color: '#737373', fontWeight: 600 }}>·</span>
                  <span style={{ fontSize: 12, color: '#525252', fontWeight: 600 }}>{s.type}</span>
                  <span style={{ fontSize: 12, color: '#737373' }}>·</span>
                  <span style={{ fontSize: 12, color: '#525252', fontWeight: 600 }}>{E[s.entity]}</span>
                  <span style={{ marginLeft: 'auto' }}><StatusPill status={s.status} /></span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#171717', lineHeight: 1.35 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#525252', marginTop: 6, lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {s.body}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: 12, color: '#737373' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    color: a.color, fontWeight: 700,
                  }}>
                    <span style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: `${a.color}14`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}><Icon name={a.icon} size={10} /></span>
                    {a.name}
                  </span>
                  <span>·</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{s.date}</span>
                  <span>·</span>
                  <span>{s.evidence} evidence pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Pagination total={signals.length} />
    </div>
  );
}

function truncate(s, n = 40) {
  return s.length > n ? s.slice(0, n) + '…' : s;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
