// Apollo — Entity Overview (operation-aware) + tabbed workspace + Tabs primitive + Entities index
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, OpTag, Card, SectionHead, PatternsView, SignalsView, InsightMiniCard, AssistPanel,
  MaturityBadge, MiniMap, RelationshipGraph } = window;

// Shared tabs
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${T.bd}`, flexWrap: 'wrap' }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            border: 'none', background: 'transparent', cursor: 'pointer', padding: '11px 4px', marginRight: 14,
            fontFamily: T.font, fontSize: 13.5, fontWeight: on ? 700 : 600, color: on ? T.accHi : T.text3,
            borderBottom: `2px solid ${on ? T.acc : 'transparent'}`, marginBottom: -1,
            display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'color .12s',
          }}>
            {t.icon && <Ic name={t.icon} size={15} />}
            {t.label}
            {t.count != null && <span style={{ padding: '1px 7px', borderRadius: 9999, background: on ? '#d1e9ff' : '#f0f0f0', color: on ? T.accHi : T.text3, fontSize: 11, fontWeight: 700 }}>{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

const KIND_LABEL = { corridor: 'Evacuation Corridor', route: 'Route', shelter: 'Shelter Network', facility: 'Facility', team: 'Response Team', area: 'Area of Interest', person: 'Person of Interest', device: 'Device', vehicle: 'Vehicle', sensor: 'Source / Sensor', package: 'Intelligence Package' };

function entityScope(entity) {
  const { patterns, signals, reports, PAT } = window.AP;
  const id = entity.id;
  const pats = patterns.filter(p => p.primary === id || p.context.primary === id || p.context.secondary.includes(id));
  const sigs = signals.filter(s => s.tags.some(t => t.id === id));
  const ins = reports.filter(i => i.primary === id || (PAT[i.sourcePattern] && (PAT[i.sourcePattern].primary === id || PAT[i.sourcePattern].context.secondary.includes(id))));
  return { pats, sigs, ins };
}

const CONTEXT = {
  'ent-northridge': 'The North Ridge evacuation corridor is the primary route for Operation Sierra Ember. Current evidence shows the corridor shifting toward elevated risk as wind, fire-line movement, and a Route 18 blockage converge. The corridor is still usable, but the risk window is changing quickly.',
  'poi-orion': 'POI Orion is the primary entity in the Operation Iron Shield convergence pattern. Multiple independent sources — drone, body cam, device metadata, vehicle movement, and associate interactions — have converged around Orion in the last 8 hours near critical infrastructure access points, with historical records providing relationship context.',
  'ent-pine': 'Pine Substation is a critical utility facility in Operation Sierra Ember. Satellite heat expansion, utility telemetry faults, and drone observation indicate rising exposure as the fire perimeter approaches, with potential staging or shutdown coordination required.',
  'site-a': 'Critical Infrastructure Site A is the protected facility at the center of Operation Iron Shield. Network movement along Route Falcon and associate clustering near Site Lattice suggest possible activity toward the site, though intent and destination remain unresolved.',
};
const KIND_CONTEXT = (e) => `${e.name} is a monitored ${KIND_LABEL[e.kind].toLowerCase()} in ${window.AP.OP[e.op].name}. Polaris links its signals into patterns and traces every finding back to source evidence.`;

function EntityOverview({ entityId, onPickPattern, onCreateInsight, onPickSignal, onOpenInsight, onPickEntity, onNavAgent, onAssist }) {
  const { ENT, OP } = window.AP;
  const entity = ENT[entityId];
  const [tab, setTab] = React.useState('overview');
  React.useEffect(() => { setTab('overview'); }, [entityId]);
  if (!entity) return null;
  const op = OP[entity.op];

  const { pats, sigs, ins } = entityScope(entity);
  const ready = pats.filter(p => p.maturity === 'Insight Ready').length;
  const vectors = new Set(sigs.map(s => s.vector)).size;

  const kpiCells = [
    { label: 'Active Patterns', value: pats.length },
    { label: 'Insight Ready', value: ready, tone: 'ready' },
    { label: 'Linked Signals', value: sigs.length },
    { label: 'Source Vectors', value: vectors },
    { label: 'Analyst Reports', value: ins.length },
    { label: 'Open Gaps', value: entity.gaps, tone: entity.gaps > 2 ? 'risk' : null },
  ];

  const headerStats = [
    ['Type', KIND_LABEL[entity.kind]],
    ['Operation', op.tag],
    ['Priority', entity.priority],
    ['Last activity', entity.lastActivity],
  ];

  const showGraph = op.graph && ['poi-orion', 'poi-kestrel', 'poi-slate', 'site-lattice', 'site-a', 'dev-d77', 'veh-v214', 'route-falcon', 'pkg-is17'].includes(entityId);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'patterns', label: 'Patterns', icon: 'layers', count: pats.length },
    { id: 'signals', label: 'Signals', icon: 'signal', count: sigs.length },
    { id: 'reports', label: 'Reports', icon: 'fileText', count: ins.length },
    { id: 'assist', label: 'Polaris Assist', icon: 'sparkles' },
  ];

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      {/* header card */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: `0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px ${T.bd}`, overflow: 'hidden' }}>
        <div style={{ padding: '22px 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <span style={{ width: 52, height: 52, borderRadius: 13, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxShadow: 'inset 0 0 0 1px #bfdbfe' }}><Ic name={entity.icon} size={28} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>{entity.name}</h1>
                <Pill tone={entity.priority === 'High' ? 'risk' : (entity.priority === 'Medium' ? 'dev' : 'mon')} size="xs" dot>{entity.priority} priority</Pill>
                <OpTag id={entity.op} />
              </div>
              <div style={{ display: 'flex', gap: 18, marginTop: 10, flexWrap: 'wrap' }}>
                {headerStats.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <FreshnessScore score={entity.freshness} />
          </div>
          <p style={{ margin: '16px 0 0', fontSize: 14, color: T.text2, lineHeight: 1.6, maxWidth: 880 }}>{CONTEXT[entityId] || KIND_CONTEXT(entity)}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderTop: `1px solid ${T.bd}`, background: '#fafafa' }}>
          {kpiCells.map((c, i) => (
            <div key={c.label} style={{ padding: '13px 18px', borderLeft: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, color: c.tone === 'ready' ? T.ready : (c.tone === 'risk' ? T.risk : T.text), fontVariantNumeric: 'tabular-nums' }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22 }}><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      <div style={{ marginTop: 22 }}>
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: showGraph ? '1fr 1fr' : '1.2fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>{op.kind === 'real-time' ? 'Recent activity map' : 'Activity / movement map'}</div>
                <MiniMap opId={entity.op} height={200} />
              </div>
              {showGraph ? (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Relationship context</div>
                  <RelationshipGraph graph={op.graph} height={200} compact onPickNode={onPickEntity} />
                </div>
              ) : (
                <Card style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>Related patterns</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pats.slice(0, 4).map(p => (
                      <div key={p.id} onClick={() => onPickPattern(p)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 9, cursor: 'pointer', boxShadow: `inset 0 0 0 1px ${T.bd}` }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <MaturityBadge value={p.maturity} size="xs" />
                        <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: T.text, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</span>
                        <Ic name="chevRight" size={14} color={T.text4} />
                      </div>
                    ))}
                    {!pats.length && <span style={{ fontSize: 13, color: T.text3 }}>No related patterns yet.</span>}
                  </div>
                </Card>
              )}
            </div>
            {ins.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Related analyst reports</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {ins.map(i => <InsightMiniCard key={i.id} insight={i} onOpen={() => onOpenInsight(i)} />)}
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'patterns' && <PatternsView patterns={pats} onPick={onPickPattern} onCta={p => p.maturity === 'Insight Ready' ? onCreateInsight(p) : onPickPattern(p)} />}
        {tab === 'signals' && <SignalsView signals={sigs} onPick={onPickSignal} />}
        {tab === 'reports' && (
          ins.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {ins.map(i => <InsightMiniCard key={i.id} insight={i} onOpen={() => onOpenInsight(i)} />)}
            </div>
          ) : <div style={{ padding: '56px 24px', textAlign: 'center', color: T.text3 }}><div style={{ fontWeight: 700, color: T.text2, fontSize: 14.5 }}>No analyst reports yet</div><div style={{ fontSize: 13, marginTop: 5 }}>Create a report from an Insight Ready pattern.</div></div>
        )}
        {tab === 'assist' && <AssistPanel inline contextLabel={entity.name} />}
      </div>
    </div>
  );
}

function FreshnessScore({ score }) {
  const c = score >= 75 ? T.ready : (score >= 55 ? T.dev : T.risk);
  const r = 26, circ = 2 * Math.PI * r;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 'none' }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#ededed" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={c} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} transform="rotate(-90 32 32)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: T.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{score}</span>
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Freshness</span>
    </div>
  );
}

// ──────────────── Entities index (grouped by operation) ────────────────
function EntitiesIndex({ onPickEntity }) {
  const { entities, operations } = window.AP;
  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 18 }}>
        <SectionHead eyebrow="Entities" accent={T.acc} title={`${entities.length} entities monitored`} sub="Corridors, routes, facilities, persons, devices, vehicles, packages, teams, and sources across both operations" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        {operations.map(op => {
          const rows = entities.filter(e => e.op === op.id);
          return (
            <div key={op.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
                <OpTag id={op.id} size="sm" />
                <span style={{ fontSize: 12.5, color: T.text3, fontWeight: 600 }}>{rows.length} entities</span>
                <span style={{ flex: 1, height: 1, background: T.bd }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {rows.map(e => (
                  <Card key={e.id} hover onClick={() => onPickEntity(e.id)} style={{ padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={e.icon} size={18} /></span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: T.text3 }}>{KIND_LABEL[e.kind]}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Pill tone={e.priority === 'High' ? 'risk' : (e.priority === 'Medium' ? 'dev' : 'mon')} size="xs" dot>{e.priority}</Pill>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.text2 }}>
                        <window.FreshDot score={e.freshness} /> {e.patterns} patterns
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.Tabs = Tabs;
window.EntityOverview = EntityOverview;
window.EntitiesIndex = EntitiesIndex;
window.entityScope = entityScope;
window.KIND_LABEL = KIND_LABEL;
})();
