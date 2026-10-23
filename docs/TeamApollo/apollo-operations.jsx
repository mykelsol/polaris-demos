// Apollo — Operations index + Operation detail view
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, OpTag, Card, SectionHead, KpiStrip, OperationCard, PatternCard, PatternsView,
  OperationMap, RelationshipGraph, BarChart, DonutChart, HBars, Sparkline, ChartPanel } = window;

// ──────────────── Operations index ────────────────
function OperationsIndex({ onOpenOp, onPickPattern }) {
  const { operations } = window.AP;
  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 18 }}>
        <SectionHead eyebrow="Operations" accent={T.acc} title="Active operations"
          sub="The same Polaris architecture runs a real-time disaster response and a long-tail investigation. Everything cascades from the command post."
          action={<Pill tone="neutral" size="sm"><Ic name="navigation" size={12} /> 2 active</Pill>} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {operations.map(op => <OperationCard key={op.id} op={op} onOpen={() => onOpenOp(op.id)} onPickPattern={onPickPattern} />)}
      </div>
    </div>
  );
}

function FreshnessList({ rows, kind }) {
  const cap = kind === 'real-time' ? 60 : 1440;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((s, i) => {
        const c = { ready: T.ready, dev: T.dev, risk: T.risk, mon: T.mon }[s.tone];
        const pc = Math.max(8, Math.min(100, 100 - (s.mins / cap) * 100));
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flex: 'none' }} />
            <span style={{ flex: 1, fontSize: 12, color: T.text2, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
            <span style={{ width: 60, height: 7, borderRadius: 4, background: '#eee', flex: 'none', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: `${pc}%`, background: c }} /></span>
            <span style={{ width: 40, textAlign: 'right', fontSize: 11.5, fontWeight: 700, color: T.text2, fontVariantNumeric: 'tabular-nums', flex: 'none' }}>{s.mins < 60 ? s.mins + 'm' : (s.mins / 60).toFixed(1) + 'h'}</span>
          </div>
        );
      })}
    </div>
  );
}

const READY_TONE = { 'Ready': 'ready', 'Draft': 'mon', 'Review': 'warn' };
function DistReadiness({ rows }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ flex: 1, fontSize: 12.5, color: T.text2, fontWeight: 600 }}>{r.audience}</span>
          <Pill tone={READY_TONE[r.state] || 'neutral'} size="xs" dot>{r.state}</Pill>
        </div>
      ))}
    </div>
  );
}

// ──────────────── Operation detail ────────────────
function OperationView({ opId, onPickPattern, onCreateInsight, onPickEntity, onPickSignal, onOpenInsight, onNavAgent, onNav }) {
  const { OP, PAT, patByOp } = window.AP;
  const op = OP[opId];
  if (!op) return null;
  const esc = PAT[op.escalating];
  const pats = patByOp(opId);

  const maturitySeg = Object.entries(op.maturity).map(([k, v]) => ({ label: k, value: v, color: { 'Insight Ready': T.ready, 'Developing': T.dev, 'Monitoring': T.mon }[k] }));
  const gapRows = op.gapsByOwner.map(g => ({ label: g.owner, value: g.n, color: T.risk }));

  const headerStats = [
    ['Scenario type', op.scenario],
    ['Lead agency', op.leadAgency],
    ['Status', op.status],
    ['Freshness requirement', op.freshnessReq],
    ['Persistence model', op.persistence],
    ['Last updated', op.updated],
  ];

  const ironVectors = [
    { label: 'Device metadata', value: 41 }, { label: 'Drone', value: 33 }, { label: 'Geospatial', value: 28 },
    { label: 'Body cam', value: 14 }, { label: 'Associate activity', value: 11 }, { label: 'Investigation records', value: 9 },
  ];
  const confTrend = [54, 58, 57, 62, 64, 66, 68, 70, 72, 71, 74, 76];

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      {/* breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Btn variant="ghost" size="sm" icon="chevLeft" onClick={() => onNav('operations')}>Operations</Btn>
        <Ic name="chevRight" size={14} color={T.text4} />
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{op.name}</span>
      </div>

      {/* header card */}
      <div style={{ position: 'relative', background: '#fff', borderRadius: 14, boxShadow: `0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px ${T.bd}`, overflow: 'hidden' }}>
        <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${op.color}, ${op.color}66)`, zIndex: 1 }} />
        <div style={{ padding: '24px 24px 20px', background: `linear-gradient(180deg, ${op.color}0a, transparent 140px)` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <span style={{ width: 52, height: 52, borderRadius: 13, background: `${op.color}16`, color: op.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={op.icon} size={28} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>{op.name}</h1>
                <Pill tone={op.statusTone} size="xs" dot>{op.status}</Pill>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '12px 28px', marginTop: 12, justifyContent: 'start' }}>
                {headerStats.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 260 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.35 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <Btn variant="secondary" size="sm" icon="sparkles" onClick={() => onNav('hub')} style={{ flex: 'none' }}>Command Hub</Btn>
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'center' }}>Supporting teams</span>
            {op.supporting.map(t => <Pill key={t} tone="neutral" size="xs">{t}</Pill>)}
          </div>
          <p style={{ margin: '16px 0 0', fontSize: 14, color: T.text2, lineHeight: 1.6, maxWidth: 920 }}>{op.summary}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, padding: '12px 15px', borderRadius: 11, background: `${op.color}0c`, boxShadow: `inset 0 0 0 1px ${op.color}33` }}>
            <Ic name="help" size={16} color={op.color} style={{ marginTop: 1, flex: 'none' }} />
            <span style={{ fontSize: 13.5, color: T.text2, lineHeight: 1.5 }}><b style={{ color: T.text }}>Primary question · </b>{op.primaryQ}</span>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${T.bd}` }}>
          <KpiStrip kpis={op.kpis.map((k, i) => ({ ...k, key: i }))} cols={op.kpis.length} />
        </div>
      </div>

      {/* operation map */}
      <div style={{ marginTop: 24 }}>
        <SectionHead eyebrow="Operation map" accent={op.color} title="Where it is changing"
          sub="Toggle layers · click an entity or risk area to drill in" style={{ marginBottom: 14 }} />
        <OperationMap opId={opId} onPickEntity={onPickEntity} onPickPattern={onPickPattern} height={400} />
      </div>

      {/* entity relationship graph (Iron Shield) */}
      {op.graph && (
        <div style={{ marginTop: 24 }}>
          <SectionHead eyebrow="Entity relationship graph" accent={op.color} title="How the network connects"
            sub="Filter by confidence · toggle current activity vs historical relationship context" style={{ marginBottom: 14 }} />
          <RelationshipGraph graph={op.graph} onPickNode={onPickEntity} height={440} />
        </div>
      )}

      {/* charts */}
      <div style={{ marginTop: 24 }}>
        <SectionHead eyebrow="Operation intelligence" accent={T.cyan} title="What changed, what supports it, what is missing" style={{ marginBottom: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <ChartPanel title="Signal volume" sub={op.signalVolumeAxis} icon="signal" accent={op.color}>
            <BarChart data={op.signalVolume} color={op.color} axis={op.signalVolumeAxis} />
          </ChartPanel>
          <ChartPanel title="Patterns by maturity" icon="layers">
            <DonutChart segments={maturitySeg} centerLabel="patterns" size={120} />
          </ChartPanel>
          <ChartPanel title="Source coverage by freshness" icon="database">
            <FreshnessList rows={op.sourceFreshness} kind={op.kind} />
          </ChartPanel>
          <ChartPanel title={`${op.gapsLabel} by owner`} icon="alertTri" accent={T.risk}>
            <HBars rows={gapRows} />
          </ChartPanel>
          {op.kind === 'real-time' ? (
            <ChartPanel title="Distribution readiness by audience" icon="send">
              <DistReadiness rows={op.distReadiness} />
            </ChartPanel>
          ) : (
            <>
              <ChartPanel title="Signals by source vector" sub="30d" icon="signal">
                <HBars rows={ironVectors} color={op.color} />
              </ChartPanel>
              <ChartPanel title="Confidence trend" sub="30d" icon="trendUp" accent={T.ready}>
                <Sparkline data={confTrend} color={T.ready} width={300} height={70} />
                <div style={{ fontSize: 11, color: T.text4, fontWeight: 600 }}>Network confidence rising toward Medium-High</div>
              </ChartPanel>
            </>
          )}
          {op.kind === 'real-time' && (
            <ChartPanel title="Distribution readiness" sub="by status" icon="send">
              <DonutChart size={118} centerLabel="outputs" segments={[
                { label: 'Ready', value: op.distReadiness.filter(d => d.state === 'Ready').length, color: T.ready },
                { label: 'Draft', value: op.distReadiness.filter(d => d.state === 'Draft').length, color: T.dev },
                { label: 'Review', value: op.distReadiness.filter(d => d.state === 'Review').length, color: T.warn },
              ].filter(s => s.value)} />
            </ChartPanel>
          )}
        </div>
      </div>

      {/* primary escalating pattern */}
      {esc && (
        <div style={{ marginTop: 24 }}>
          <SectionHead eyebrow="Primary escalating pattern" accent={T.risk} title="Ready for analyst review"
            action={<Btn variant="ghost" size="sm" iconRight="arrowRight" onClick={() => onNav('patterns')}>All patterns</Btn>}
            style={{ marginBottom: 14 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <PatternCard pattern={esc} prominent onOpen={() => onPickPattern(esc)} onCta={() => esc.maturity === 'Insight Ready' ? onCreateInsight(esc) : onPickPattern(esc)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pats.filter(p => p.id !== esc.id && p.escalating).map(p => (
                <PatternCard key={p.id} pattern={p} onOpen={() => onPickPattern(p)} onCta={() => p.maturity === 'Insight Ready' ? onCreateInsight(p) : onPickPattern(p)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* all operation patterns */}
      <div style={{ marginTop: 28 }}>
        <SectionHead eyebrow="Operation patterns" accent={T.acc} title="Signals compounding into patterns" style={{ marginBottom: 14 }} />
        <PatternsView patterns={pats} onPick={onPickPattern} onCta={p => p.maturity === 'Insight Ready' ? onCreateInsight(p) : onPickPattern(p)} />
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}

window.OperationsIndex = OperationsIndex;
window.OperationView = OperationView;
})();
