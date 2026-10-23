// Apollo — Command Hub + shared cards (PatternCard, KPI strip, report cards, operation cards, agent activity)
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, OpTag, MaturityBadge, MATURITY, LifecycleChip, EvidenceBar, ConfidenceDots, Card, SectionHead, Kpi,
  MiniMap, BarChart, DonutChart, HBars, ChartPanel } = window;

const PAGE = '28px 32px';

// ──────────────── Pattern card (shared) ────────────────
function PatternCard({ pattern, onOpen, onCta, prominent }) {
  const { ENT } = window.AP;
  const p = pattern;
  const ent = ENT[p.primary];
  const m = MATURITY[p.maturity];
  const ctaVariant = p.maturity === 'Insight Ready' ? 'primary' : (p.maturity === 'Developing' ? 'accentSoft' : 'secondary');
  const ctaIcon = p.maturity === 'Insight Ready' ? 'sparkles' : (p.maturity === 'Developing' ? 'eye' : 'clock');

  return (
    <Card glow={prominent} hover onClick={onOpen} accent={window.AP.OP[p.op] && window.AP.OP[p.op].color}
      style={{ padding: prominent ? '22px 22px 20px' : '18px 18px 17px', display: 'flex', flexDirection: 'column', gap: prominent ? 13 : 11 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <MaturityBadge value={p.maturity} />
        <OpTag id={p.op} />
        <Pill tone="neutral" size="xs">{p.type}</Pill>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: T.text3, fontVariantNumeric: 'tabular-nums' }}>
          <Ic name="clock" size={13} color={T.text4} /> {p.updated}
        </span>
      </div>

      <div>
        <div style={{ fontSize: prominent ? 16.5 : 15, fontWeight: 700, color: T.text, lineHeight: 1.32, letterSpacing: '-0.01em' }}>{p.title}</div>
        <p style={{ margin: '7px 0 0', fontSize: 13, color: T.text2, lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: prominent ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.synthesis}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, color: T.text }}>
          <span style={{ width: 20, height: 20, borderRadius: 5, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={ent.icon} size={13} /></span>
          {ent.name}
        </span>
        <span style={{ color: T.bdHi }}>·</span>
        <span style={{ color: T.text3, fontWeight: 600 }}>{p.signals} signals</span>
        <span style={{ color: T.bdHi }}>·</span>
        <LifecycleChip value={p.lifecycle} />
      </div>

      <div style={{ display: 'flex', gap: 22, padding: prominent ? '13px 0' : '11px 0', borderTop: `1px solid ${T.bd}`, borderBottom: `1px solid ${T.bd}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: T.text3, textTransform: 'uppercase' }}>Evidence</span>
          <EvidenceBar level={p.strength} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: T.text3, textTransform: 'uppercase' }}>Confidence</span>
          <ConfidenceDots level={p.confidence} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
        <Btn variant={ctaVariant} size="sm" icon={ctaIcon} onClick={() => onCta(p)}>{m.cta}</Btn>
        <Btn variant="ghost" size="sm" iconRight="arrowRight" onClick={onOpen}>Open pattern</Btn>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
          <IconBtn name="thumbUp" size={30} iconSize={15} title="Useful" />
          <IconBtn name="thumbDown" size={30} iconSize={15} title="Not useful" />
        </span>
      </div>
    </Card>
  );
}

// ──────────────── KPI strip (wraps to N columns) ────────────────
function KpiStrip({ kpis, cols = 5 }) {
  return (
    <Card noAnim style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, overflow: 'hidden' }}>
      {kpis.map((k, i) => (
        <div key={k.key || i} style={{ borderLeft: i % cols === 0 ? 'none' : `1px solid ${T.bd}`, borderTop: i >= cols ? `1px solid ${T.bd}` : 'none' }}>
          <Kpi label={k.label} value={k.value} unit={k.unit} tone={k.tone} delta={k.delta} spark={k.spark} />
        </div>
      ))}
    </Card>
  );
}

// ──────────────── Operation card ────────────────
function OperationCard({ op, onOpen, onPickPattern }) {
  const { PAT } = window.AP;
  const esc = PAT[op.escalating];
  return (
    <Card hover accent={op.color} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div onClick={onOpen} style={{ cursor: 'pointer' }}>
        <MiniMap opId={op.id} height={130} />
      </div>
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 13 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: `${op.color}16`, color: op.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={op.icon} size={20} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>{op.name}</span>
              <Pill tone={op.statusTone} size="xs" dot>{op.status}</Pill>
            </div>
            <div style={{ fontSize: 12, color: T.text3, marginTop: 3 }}>{op.scenario}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '11px 13px', borderRadius: 10, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}` }}>
          <Ic name="help" size={15} color={op.color} style={{ marginTop: 1, flex: 'none' }} />
          <span style={{ fontSize: 12.5, color: T.text2, lineHeight: 1.45 }}>{op.primaryQ}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {op.kpis.slice(0, 4).map(k => (
            <div key={k.label}>
              <div style={{ fontSize: 18, fontWeight: 700, color: k.tone === 'ready' ? T.ready : (k.tone === 'risk' ? T.risk : T.text), fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{k.value}{k.unit || ''}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {esc && (
          <div onClick={() => onPickPattern(esc)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 10, cursor: 'pointer', boxShadow: `inset 0 0 0 1px ${T.bd}` }}
            onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <MaturityBadge value={esc.maturity} size="xs" />
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: T.text, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{esc.title}</span>
            <Ic name="chevRight" size={15} color={T.text4} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Btn variant="secondary" size="sm" icon={op.icon} onClick={onOpen}>Open operation</Btn>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: T.text3, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Ic name="clock" size={12} /> {op.updated}</span>
        </div>
      </div>
    </Card>
  );
}

// ──────────────── Report mini card ────────────────
const REPORT_STATUS_TONE = { 'Ready': 'ready', 'Ready to Send': 'ready', 'Draft Ready': 'accent', 'Needs Review': 'warn', 'Draft': 'mon' };
function InsightMiniCard({ insight, onOpen }) {
  const { OP } = window.AP;
  const r = insight;
  const op = OP[r.op];
  const statusTone = REPORT_STATUS_TONE[r.status] || 'accent';
  const typeIcon = r.type.includes('Memo') ? 'fileMemo' : 'fileText';
  return (
    <Card hover onClick={onOpen} accent={op && op.color} style={{ padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={typeIcon} size={16} /></span>
        {op && <OpTag id={r.op} />}
        <span style={{ marginLeft: 'auto' }}><Pill tone={statusTone} size="xs" dot>{r.status}</Pill></span>
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{r.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: T.text3 }}>
        <span style={{ fontWeight: 600 }}>{r.type}</span>
        <span style={{ color: T.bdHi }}>·</span>
        <span>{r.openGaps} open gaps</span>
      </div>
      <Btn variant="ghost" size="xs" iconRight="arrowRight" onClick={onOpen} style={{ alignSelf: 'flex-start' }}>Open report</Btn>
    </Card>
  );
}

// ──────────────── Agent activity feed ────────────────
function AgentActivityFeed({ onNavAgent }) {
  const { agentActivity, agentById } = window.AP;
  return (
    <Card style={{ overflow: 'hidden' }}>
      {agentActivity.map((a, i) => {
        const ag = agentById[a.agent]; if (!ag) return null;
        const c = { ready: T.ready, dev: T.dev, risk: T.risk, neutral: T.mon }[a.tone];
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 16px', borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: `${ag.color}14`, color: ag.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}><Ic name={ag.icon} size={16} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.4 }}>{a.text}</div>
              <div style={{ fontSize: 11.5, color: T.text3, marginTop: 3, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                <span onClick={() => onNavAgent(a.agent)} style={{ color: T.acc, fontWeight: 600, cursor: 'pointer' }}>{ag.name}</span>
                {a.op && a.op !== 'both' && <OpTag id={a.op} />}
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>· {a.time}</span>
              </div>
            </div>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flex: 'none', marginTop: 6 }} />
          </div>
        );
      })}
    </Card>
  );
}

// ──────────────── Distribution queue (compact) ────────────────
const Q_TONE = { 'Ready': 'ready', 'Draft Ready': 'accent', 'Needs Review': 'warn', 'Draft': 'mon' };
function DistributionQueue({ onOpen }) {
  const { distribution } = window.AP;
  const rows = distribution.slice(0, 6);
  return (
    <Card style={{ overflow: 'hidden' }}>
      {rows.map((d, i) => (
        <div key={d.id} onClick={() => onOpen(d)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: i === 0 ? 'none' : `1px solid ${T.bd}`, cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name="send" size={14} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
            <div style={{ fontSize: 11.5, color: T.text3, display: 'flex', alignItems: 'center', gap: 6 }}><OpTag id={d.op} /> · {d.audience}</div>
          </div>
          <Pill tone={Q_TONE[d.status] || 'neutral'} size="xs" dot>{d.status}</Pill>
        </div>
      ))}
    </Card>
  );
}

// ──────────────── Source coverage summary ────────────────
function SourceCoverageSummary() {
  const { operations } = window.AP;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {operations.map(op => (
        <Card key={op.id} style={{ padding: '15px 17px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <OpTag id={op.id} size="sm" />
            <span style={{ marginLeft: 'auto', fontSize: 11.5, color: T.text3 }}>Median freshness <b style={{ color: T.text, fontVariantNumeric: 'tabular-nums' }}>{op.kpis.find(k => k.label.includes('Freshness')).value}h</b></span>
          </div>
          {op.sourceFreshness.map((s, i) => {
            const c = { ready: T.ready, dev: T.dev, risk: T.risk, mon: T.mon }[s.tone];
            const pc = Math.max(8, Math.min(100, 100 - (s.mins / (op.kind === 'real-time' ? 60 : 1440)) * 100));
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flex: 'none' }} />
                <span style={{ flex: 1, fontSize: 12, color: T.text2, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
                <span style={{ width: 54, height: 6, borderRadius: 3, background: '#eee', flex: 'none', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: `${pc}%`, background: c }} /></span>
                <span style={{ width: 38, textAlign: 'right', fontSize: 11.5, fontWeight: 700, color: T.text2, fontVariantNumeric: 'tabular-nums', flex: 'none' }}>{s.mins < 60 ? s.mins + 'm' : (s.mins / 60).toFixed(1) + 'h'}</span>
              </div>
            );
          })}
        </Card>
      ))}
    </div>
  );
}

// ──────────────── Command Hub ────────────────
function GlobalHub({ onPickPattern, onCreateInsight, onPickEntity, onPickPackage, onNavAgent, onOpenInsight, onNav, onOpenOp, onOpenDist }) {
  const { kpis, patterns, reports, operations } = window.AP;
  const escalating = patterns.filter(p => p.escalating);
  const sectionGap = { marginTop: 40 };

  const KPI_META = {
    agents:   { delta: { dir: 'up', txt: '+2 since 06:00' } },
    signals:  { delta: { dir: 'up', txt: '+38 last hr' }, spark: [6, 9, 8, 12, 11, 16, 14, 19] },
    patterns: { delta: { dir: 'up', txt: '+3 today' }, spark: [18, 19, 21, 22, 24, 25, 26, 27] },
    ready:    { delta: { dir: 'up', txt: '+2' } },
    reports:  { delta: { dir: 'up', txt: '+4' }, spark: [5, 6, 7, 8, 9, 10, 11] },
    dist:     { delta: { dir: 'up', txt: '+6' } },
  };
  const enrichedKpis = kpis.map(k => ({ ...k, ...(KPI_META[k.key] || {}) }));

  const vectorVolume = [
    { label: 'Drone', value: 92 }, { label: 'Device metadata', value: 78 }, { label: 'Geospatial', value: 64 },
    { label: 'Field report', value: 47 }, { label: 'Weather', value: 41 }, { label: 'Body cam', value: 33 },
    { label: 'Utility telemetry', value: 29 }, { label: 'Transportation', value: 28 },
  ];
  const maturitySeg = [
    { label: 'Insight Ready', value: 7, color: T.ready }, { label: 'Developing', value: 11, color: T.dev }, { label: 'Monitoring', value: 9, color: T.mon },
  ];
  const reportsByOp = [{ label: 'Sierra Ember', value: 6, color: '#c2410c' }, { label: 'Iron Shield', value: 5, color: '#1570ef' }];
  const gapsByPriority = [{ label: 'High', value: 8, color: T.risk }, { label: 'Medium', value: 7, color: T.dev }, { label: 'Low', value: 3, color: T.mon }];

  return (
    <div style={{ padding: PAGE, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <SectionHead
          eyebrow="Command Hub" accent={T.acc}
          title="Across this operation, what is changing, what do we know, what is still missing, and who needs to know?"
          sub="The command post is the source of truth. Signals compound into Patterns, Patterns become Analyst Reports, and Reports distribute by role."
          action={<Btn variant="secondary" size="sm" icon="navigation" onClick={() => onNav('operations')}>All operations</Btn>}
        />
      </div>

      <KpiStrip kpis={enrichedKpis} cols={5} />

      {/* Escalating patterns — most important */}
      <div style={sectionGap}>
        <SectionHead eyebrow="Escalating patterns" accent={T.risk}
          title="Ready for analyst review across both operations"
          sub={`${escalating.length} Insight Ready patterns crossed the threshold · the primary intelligence object`}
          action={<Btn variant="ghost" size="sm" iconRight="arrowRight" onClick={() => onNav('patterns')}>All patterns</Btn>}
          style={{ marginBottom: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {escalating.map(p => (
            <PatternCard key={p.id} pattern={p} prominent
              onOpen={() => onPickPattern(p)}
              onCta={() => p.maturity === 'Insight Ready' ? onCreateInsight(p) : onPickPattern(p)} />
          ))}
        </div>
      </div>

      {/* Active operations */}
      <div style={sectionGap}>
        <SectionHead eyebrow="Active operations" accent={T.acc}
          title="One architecture, two scenarios"
          sub="Polaris switches between a real-time disaster response and a long-tail investigation"
          style={{ marginBottom: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {operations.map(op => <OperationCard key={op.id} op={op} onOpen={() => onOpenOp(op.id)} onPickPattern={onPickPattern} />)}
        </div>
      </div>

      {/* Command Hub visuals */}
      <div style={sectionGap}>
        <SectionHead eyebrow="Operation intelligence" accent={T.cyan}
          title="What changed, where, and what supports it"
          sub="Visuals reinforce the hierarchy: Signals → Patterns → Analyst Report → Distribution"
          style={{ marginBottom: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <ChartPanel title="Signals by source vector" sub="24h" icon="signal">
            <HBars rows={vectorVolume} color={T.acc} />
          </ChartPanel>
          <ChartPanel title="Patterns by maturity" sub="27 active" icon="layers">
            <DonutChart segments={maturitySeg} centerLabel="patterns" />
          </ChartPanel>
          <ChartPanel title="Analyst reports by operation" sub="11 total" icon="fileText">
            <DonutChart segments={reportsByOp} centerLabel="reports" size={118} />
          </ChartPanel>
          <ChartPanel title="Open gaps by priority" sub="18 open" icon="alertTri" accent={T.risk}>
            <HBars rows={gapsByPriority} />
          </ChartPanel>
        </div>
      </div>

      {/* Analyst reports + Agent activity */}
      <div style={{ ...sectionGap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 20 }}>
        <div>
          <SectionHead eyebrow="Analyst reports" accent={T.ready} title="Generated from Insight Ready patterns"
            action={<Btn variant="ghost" size="sm" iconRight="arrowRight" onClick={() => onNav('insights')}>All</Btn>}
            style={{ marginBottom: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reports.map(r => <InsightMiniCard key={r.id} insight={r} onOpen={() => onOpenInsight(r)} />)}
          </div>
        </div>
        <div>
          <SectionHead eyebrow="Distribution queue" accent={T.acc} title="Role-specific outputs by audience"
            action={<Btn variant="ghost" size="sm" iconRight="arrowRight" onClick={() => onNav('distribution')}>All</Btn>}
            style={{ marginBottom: 14 }} />
          <DistributionQueue onOpen={onOpenDist} />
          <div style={{ marginTop: 22 }}>
            <SectionHead eyebrow="Agent activity" accent={T.cyan} title="What the agents did"
              action={<Btn variant="ghost" size="sm" iconRight="arrowRight" onClick={() => onNav('agents')}>Agents</Btn>}
              style={{ marginBottom: 14 }} />
            <AgentActivityFeed onNavAgent={onNavAgent} />
          </div>
        </div>
      </div>

      {/* Source coverage */}
      <div style={sectionGap}>
        <SectionHead eyebrow="Source coverage" accent={T.dev} title="Which sources support the picture, and how fresh"
          sub="Median freshness by operation · green current, amber needs update, red stale" style={{ marginBottom: 14 }} />
        <SourceCoverageSummary />
      </div>

      {/* Persistence / traceability rules */}
      <div style={sectionGap}>
        <SectionHead eyebrow="Persistence / traceability rules" accent={T.acc}
          title="Real-time events and investigations follow different rules"
          action={<Btn variant="secondary" size="sm" icon="arrowRight" onClick={() => onNav('persistence')}>View rules</Btn>}
          style={{ marginBottom: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {operations.map(op => (
            <Card key={op.id} style={{ padding: '16px 18px', display: 'flex', gap: 12 }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: `${op.color}16`, color: op.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={op.kind === 'real-time' ? 'clock' : 'history'} size={17} /></span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>{op.kind === 'real-time' ? 'Short operational window' : 'Persistent evidence graph'}</div>
                <div style={{ fontSize: 12.5, color: T.text2, marginTop: 4, lineHeight: 1.5 }}>{op.persistence}</div>
                <div style={{ fontSize: 11.5, color: T.text3, marginTop: 7 }}>Freshness requirement · <b style={{ color: T.text2 }}>{op.freshnessReq}</b></div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}

window.PatternCard = PatternCard;
window.KpiStrip = KpiStrip;
window.OperationCard = OperationCard;
window.InsightMiniCard = InsightMiniCard;
window.AgentActivityFeed = AgentActivityFeed;
window.DistributionQueue = DistributionQueue;
window.SourceCoverageSummary = SourceCoverageSummary;
window.GlobalHub = GlobalHub;
})();
