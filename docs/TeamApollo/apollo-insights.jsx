// Apollo — Analyst Reports index + full tabbed Analyst Report detail
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, OpTag, Card, SectionHead, InsightMiniCard, EvidenceBar, ConfidenceDots, VectorGlyph, MaturityBadge,
  Tabs, CoverageMatrix, DistributionMatrix, Sparkline, MiniMap, RelationshipGraph } = window;

const CONF_TONE = (c) => c === 'High' ? 'ready' : (c === 'Medium-High' ? 'accent' : (c === 'Medium' ? 'dev' : 'mon'));
const PRIO_TONE = { High: 'risk', Medium: 'dev', Low: 'mon' };
const DIST_ROW_TONE = { 'Ready': 'ready', 'Distribute': 'ready', 'Draft Ready': 'accent', 'Draft': 'mon', 'Needs Review': 'warn' };

// ──────────────── Index ────────────────
function InsightsIndex({ onOpenInsight }) {
  const { reports, operations } = window.AP;
  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 18 }}>
        <SectionHead eyebrow="Analyst Reports" accent={T.ready} title="Work products generated from Insight Ready patterns"
          sub="Reports separate confirmed evidence from open gaps and stage role-specific distribution. Reports are never created from isolated signals." />
      </div>
      {operations.map(op => {
        const rows = reports.filter(r => r.op === op.id);
        if (!rows.length) return null;
        return (
          <div key={op.id} style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
              <OpTag id={op.id} size="sm" />
              <span style={{ fontSize: 12.5, color: T.text3, fontWeight: 600 }}>{rows.length} report{rows.length === 1 ? '' : 's'}</span>
              <span style={{ flex: 1, height: 1, background: T.bd }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {rows.map(r => <InsightMiniCard key={r.id} insight={r} onOpen={() => onOpenInsight(r)} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────── Generic table ────────────────
function DocTable({ cols, children, minWidth }) {
  return (
    <div style={{ borderRadius: 12, boxShadow: `inset 0 0 0 1px ${T.bd}`, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.font, minWidth: minWidth || 0 }}>
          <thead><tr style={{ background: '#fafafa', borderBottom: `1px solid ${T.bd}` }}>
            {cols.map((c, i) => <th key={i} style={{ textAlign: 'left', padding: '11px 15px', fontSize: 11, fontWeight: 700, color: T.text3, whiteSpace: 'nowrap' }}>{c}</th>)}
          </tr></thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
const td = { padding: '12px 15px', fontSize: 12.5, color: T.text2, lineHeight: 1.45, verticalAlign: 'top' };

// ──────────────── Stat tile ────────────────
function StatTile({ label, children, big }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 11, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}`, display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{label}</span>
      {big ? <span style={{ fontSize: 22, fontWeight: 700, color: T.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{children}</span> : children}
    </div>
  );
}

// ──────────────── Evacuation / resource flow chart ────────────────
function FlowChart() {
  const node = (label, sub, tone) => (
    <div style={{ flex: 'none', textAlign: 'center', width: 116 }}>
      <div style={{ padding: '11px 10px', borderRadius: 10, background: '#fff', boxShadow: `inset 0 0 0 1.5px ${tone}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{label}</div>
        <div style={{ fontSize: 10.5, color: T.text3, marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
  const arrow = <Ic name="arrowRight" size={18} color={T.text4} style={{ flex: 'none' }} />;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {node('North Ridge', 'Corridor at risk', T.risk)}
        {arrow}
        {node('Route 18', 'Partial blockage', T.warn)}
        {arrow}
        {node('West Valley', 'Intake pressure', T.dev)}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: T.text2, padding: '5px 11px', borderRadius: 9999, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}` }}><Ic name="user" size={13} color={T.ready} /> Field team staging · Division Bravo</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: T.text2, padding: '5px 11px', borderRadius: 9999, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}` }}><Ic name="zap" size={13} color={T.risk} /> Utility risk · Pine Substation</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: T.text2, padding: '5px 11px', borderRadius: 9999, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}` }}><Ic name="route" size={13} color={T.warn} /> Route constraint · 2 segments</span>
      </div>
    </div>
  );
}

// ──────────────── Report detail ────────────────
function InsightDetail({ insight, onBack, onReturnToPattern, onToast, onPickSignal, onPickEntity, onOpenDist }) {
  const r = insight;
  const { PAT, ENT, OP } = window.AP;
  const src = PAT[r.sourcePattern];
  const ent = ENT[r.primary];
  const op = OP[r.op];
  const pkg = r.relatedPackage ? ENT[r.relatedPackage] : null;
  const [tab, setTab] = React.useState('summary');
  React.useEffect(() => { setTab('summary'); }, [r.id]);

  const tabs = [
    { id: 'summary', label: 'Summary', icon: 'fileText' },
    { id: 'evidence', label: 'Confirmed evidence', icon: 'checkCircle', count: r.confirmedEvidence.length },
    { id: 'gaps', label: r.gapsLabel, icon: 'alertTri', count: r.gaps.length },
    { id: 'coverage', label: 'Source coverage', icon: 'database', count: r.coverage.length },
    { id: 'recs', label: 'Recommendations', icon: 'zap', count: r.recommendations.length },
    { id: 'distribution', label: 'Distribution', icon: 'send', count: r.distribution.length },
    { id: 'trace', label: 'Traceability', icon: 'link', count: r.traceability.length },
  ];

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '20px 32px 48px' }}>
      {/* breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Btn variant="ghost" size="sm" icon="chevLeft" onClick={onBack}>Analyst Reports</Btn>
        <Ic name="chevRight" size={14} color={T.text4} />
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{r.title}</span>
      </div>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
        <span style={{ width: 48, height: 48, borderRadius: 12, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxShadow: 'inset 0 0 0 1px #bfdbfe' }}><Ic name={r.type.includes('Memo') ? 'fileMemo' : 'fileText'} size={26} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{r.title}</h1>
            <Pill tone={DIST_ROW_TONE[r.status] || 'accent'} dot>{r.status}</Pill>
          </div>
          <div style={{ fontSize: 13, color: T.text3, marginTop: 7, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <OpTag id={r.op} />
            <span style={{ fontWeight: 600, color: T.text2 }}>{r.type}</span>
            <span style={{ color: T.bdHi }}>·</span>
            <span onClick={() => onPickEntity && onPickEntity(r.primary)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer', color: T.acc, fontWeight: 600 }}><Ic name={ent.icon} size={13} /> {ent.name}</span>
            {pkg && <><span style={{ color: T.bdHi }}>·</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Ic name="shield" size={13} /> {pkg.name}</span></>}
          </div>
        </div>
        <Btn variant="primary" size="sm" icon="send" onClick={() => setTab('distribution')} style={{ flex: 'none' }}>Distribute</Btn>
      </div>

      {/* generated-from */}
      <div onClick={onReturnToPattern} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 15px', borderRadius: 11, cursor: 'pointer', boxShadow: `inset 0 0 0 1px ${T.bd}`, marginBottom: 18 }}
        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em', flex: 'none' }}>Generated from</span>
        {src && <MaturityBadge value={src.maturity} size="xs" />}
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.35 }}>{r.generatedFrom}</span>
        <Ic name="chevRight" size={16} color={T.text4} />
      </div>

      {/* visual summary header */}
      <Card style={{ padding: '18px 20px', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Ic name="navigation" size={15} color={op.color} />
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Visual summary</span>
          <span style={{ fontSize: 11.5, color: T.text3, marginLeft: 'auto' }}>Freshness window · {r.freshnessWindow}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: r.showGraph ? '1.1fr 1fr' : '1fr', gap: 16, marginBottom: 16 }}>
          <MiniMap opId={r.op} height={150} />
          {r.showGraph && <RelationshipGraph graph={op.graph} height={150} compact />}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
          <StatTile label="60-min signals"><Sparkline data={r.sparkline} color={op.color} width={120} height={34} /></StatTile>
          <StatTile label="Coverage score" big>{r.coverageScore}</StatTile>
          <StatTile label="Evidence"><EvidenceBar level={r.evidenceStrength} /></StatTile>
          <StatTile label="Confidence"><ConfidenceDots level={r.confidence} /></StatTile>
          <StatTile label="Open gaps" big><span style={{ color: T.risk }}>{r.openGaps}</span></StatTile>
          <StatTile label="Dist. readiness"><Pill tone={r.distReady === 'High' ? 'ready' : 'dev'} size="xs" dot>{r.distReady}</Pill></StatTile>
        </div>
      </Card>

      {/* tabs */}
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      <div style={{ marginTop: 22 }}>
        {tab === 'summary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Card style={{ padding: '20px 22px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 11 }}>Executive summary</div>
              <p style={{ margin: 0, fontSize: 14.5, color: T.text2, lineHeight: 1.65 }}>{r.summary}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 15 }}>
                {r.sourceVectors.map(v => <Pill key={v} tone="neutral" size="xs"><VectorGlyph vector={v} size={11} /> {v}</Pill>)}
              </div>
            </Card>
            {r.op === 'sierra-ember' && (
              <Card style={{ padding: '20px 22px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>Evacuation / resource flow</div>
                <FlowChart />
              </Card>
            )}
          </div>
        )}

        {tab === 'evidence' && (
          <DocTable cols={['Evidence area', 'Supporting signals', 'Confidence', 'Freshness', 'Source vectors']} minWidth={720}>
            {r.confirmedEvidence.map((e, i) => (
              <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
                <td style={{ ...td, fontWeight: 700, color: T.text, maxWidth: 280 }}>{e.area}</td>
                <td style={td}><span style={{ fontWeight: 700, color: T.text }}>{e.signals}</span></td>
                <td style={td}><Pill tone={CONF_TONE(e.confidence)} size="xs" dot>{e.confidence}</Pill></td>
                <td style={{ ...td, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{e.freshness}</td>
                <td style={td}>{e.vectors}</td>
              </tr>
            ))}
          </DocTable>
        )}

        {tab === 'gaps' && (
          <DocTable cols={['Gap', 'Why it matters', 'Priority', r.op === 'sierra-ember' ? 'Recommended collection / update' : 'Recommended collection', 'Owner']} minWidth={860}>
            {r.gaps.map((g, i) => (
              <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
                <td style={{ ...td, fontWeight: 700, color: T.text, maxWidth: 230 }}>{g.gap}</td>
                <td style={{ ...td, maxWidth: 240 }}>{g.why}</td>
                <td style={td}><Pill tone={PRIO_TONE[g.priority]} size="xs" dot>{g.priority}</Pill></td>
                <td style={{ ...td, maxWidth: 230 }}>{g.collection}</td>
                <td style={{ ...td, fontWeight: 600, color: T.text, whiteSpace: 'nowrap' }}>{g.owner}</td>
              </tr>
            ))}
          </DocTable>
        )}

        {tab === 'coverage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <DocTable cols={['Source vector', 'Current status', 'Freshness', 'Contribution', 'Gap']} minWidth={780}>
              {r.coverage.map((c, i) => (
                <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
                  <td style={{ ...td, fontWeight: 700, color: T.text, whiteSpace: 'nowrap' }}>{c.source}</td>
                  <td style={td}><Pill tone="ready" size="xs" dot>{c.status}</Pill></td>
                  <td style={{ ...td, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{c.freshness}</td>
                  <td style={{ ...td, maxWidth: 230 }}>{c.contribution}</td>
                  <td style={{ ...td, maxWidth: 200, color: T.text2 }}>{c.gap}</td>
                </tr>
              ))}
            </DocTable>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>Source coverage matrix</div>
              <CoverageMatrix rows={r.coverage} />
            </div>
          </div>
        )}

        {tab === 'recs' && (
          <Card style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>{r.op === 'sierra-ember' ? 'Recommended command actions' : 'Recommended analyst actions'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {r.recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: '#eff4ff', color: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontSize: 11, fontWeight: 700, marginTop: 1 }}>{i + 1}</span>
                  <span style={{ fontSize: 14, color: T.text2, lineHeight: 1.5 }}>{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === 'distribution' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <DocTable cols={['Audience', 'Distributed output', 'Contents', 'Restricted fields', 'Status', '']} minWidth={920}>
              {r.distribution.map((d, i) => (
                <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
                  <td style={{ ...td, fontWeight: 700, color: T.text, whiteSpace: 'nowrap' }}>{d.audience}</td>
                  <td style={{ ...td, fontWeight: 600, color: T.text2, whiteSpace: 'nowrap' }}>{d.output}</td>
                  <td style={{ ...td, maxWidth: 250 }}>{d.contents}</td>
                  <td style={{ ...td, maxWidth: 160, color: d.restricted === 'None' ? T.text4 : T.risk }}>{d.restricted}</td>
                  <td style={td}><Pill tone={DIST_ROW_TONE[d.status] || 'neutral'} size="xs" dot>{d.status}</Pill></td>
                  <td style={{ ...td, textAlign: 'right' }}><Btn variant={d.status === 'Ready' ? 'primary' : 'secondary'} size="xs" icon={d.status === 'Ready' ? 'send' : 'arrowRight'} onClick={() => onToast(`${d.output} · ${d.action === 'Distribute' ? 'distributed to ' + d.audience : 'opened'}`)}>{d.action}</Btn></td>
                </tr>
              ))}
            </DocTable>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>Distribution matrix</div>
              <DistributionMatrix rows={r.distribution} />
            </div>
          </div>
        )}

        {tab === 'trace' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 9, alignItems: 'center', padding: '11px 14px', borderRadius: 10, background: '#eff6ff', boxShadow: 'inset 0 0 0 1px #bfdbfe' }}>
              <Ic name="link" size={15} color={T.accHi} />
              <span style={{ fontSize: 12.5, color: T.accHi, fontWeight: 600 }}>Every finding traces back to its source signals, vectors, and pattern. Intelligence is never asserted without evidence.</span>
            </div>
            <DocTable cols={['Finding', 'Source signals', 'Source vectors', 'Pattern', 'Confidence', 'Last updated']} minWidth={880}>
              {r.traceability.map((tr, i) => (
                <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
                  <td style={{ ...td, fontWeight: 700, color: T.text, maxWidth: 240 }}>{tr.finding}</td>
                  <td style={td}><span style={{ fontWeight: 700, color: T.text }}>{tr.signals}</span></td>
                  <td style={{ ...td, maxWidth: 220 }}>{tr.vectors}</td>
                  <td style={td}><Pill tone="neutral" size="xs">{tr.pattern}</Pill></td>
                  <td style={td}><Pill tone={CONF_TONE(tr.confidence)} size="xs" dot>{tr.confidence}</Pill></td>
                  <td style={{ ...td, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: T.text3 }}>{tr.updated}</td>
                </tr>
              ))}
            </DocTable>
          </div>
        )}
      </div>

      {/* footer actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24, paddingTop: 18, borderTop: `1px solid ${T.bd}` }}>
        <Btn variant="ghost" size="sm" icon="chevLeft" onClick={onReturnToPattern}>Return to pattern</Btn>
        <div style={{ flex: 1 }} />
        <Btn variant="secondary" size="sm" icon="download" onClick={() => onToast('Report exported · logged to traceability chain')}>Export</Btn>
        <Btn variant="primary" size="sm" icon="send" onClick={() => onToast('Role-specific outputs queued for distribution')}>Distribute outputs</Btn>
      </div>
    </div>
  );
}

window.InsightsIndex = InsightsIndex;
window.InsightDetail = InsightDetail;
})();
