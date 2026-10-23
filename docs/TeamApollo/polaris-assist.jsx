// Polaris Assist — full-page workspace that opens from a Risk Report's
// "Open in Polaris Assist" action. Lands directly in the Risk Mitigation Brief
// workflow with the current report context loaded. Brief edits, regenerations,
// and emails are framed as syncing back to the Risk Report's condensed summary.

const { useState: useStateA, useRef: useRefA, useEffect: useEffectA } = React;

// ──────────────── canonical example brief (Middle East Geopolitical & Trade — Beef) ────────────────
const ASSIST_CONTEXT = {
  title: 'Middle East Geopolitical & Trade Risk — Beef',
  region: 'Middle East',
  category: 'Beef',
  riskDomain: 'Geopolitical & Trade / Energy Exposure',
  potentialImpact: ['Cost', 'Assured Supply', 'Availability'],
  analystRiskLevel: 'Red',
  signalsUsed: 12,
  disposition: 'Watch',
  confidence: 'Medium-High',
};

// Editable brief sections — initial HTML content for the document editor.
const BRIEF_SECTIONS = [
  {
    id: 'exec', level: 2, title: 'Executive Summary',
    html: `<p>Escalating geopolitical tension in the Middle East — centered on disruption risk around the <strong>Strait of Hormuz</strong> — is driving volatility across energy, transportation, and global food supply chains. For McDonald's beef category, the dominant exposures are rising fuel and logistics costs, higher feed and fertilizer inputs, and reduced predictability across production, processing, and distribution.</p>
<p>Physical supply disruption is <strong>not yet confirmed</strong>. However, the current signal pattern indicates building pressure on the beef value chain and sustained exposure to cost volatility. Recommended disposition is <strong>Watch</strong> at <strong>Medium-High</strong> confidence, with active monitoring of energy, freight, and feed-cost indicators.</p>`,
  },
  {
    id: 'analysis', level: 2, title: 'Risk Analysis',
    html: `<p>The risk is energy-led and propagates into the beef value chain through three reinforcing channels. None require a confirmed physical closure to register cost impact — insurance, freight, and input-cost markets are already repricing the elevated probability.</p>`,
  },
  {
    id: 'energy', level: 3, title: 'Energy-driven Cost Volatility',
    html: `<p>Roughly a fifth of globally traded oil and a significant share of LNG transit the Strait of Hormuz. Closure risk, militarization, or insurance-driven rerouting raises crude, diesel, and bunker-fuel prices. Diesel and transport fuel feed directly into cattle transport, rendering, processing energy, and refrigerated distribution — compressing supplier margins and increasing pass-through pressure on beef SKUs.</p>`,
  },
  {
    id: 'feed', level: 3, title: 'Rising Feed and Input Costs',
    html: `<p>Energy is a primary input to nitrogen fertilizer production and to grain drying and transport. Sustained energy price increases feed through to corn, soy, and forage costs, raising cattle-feeding costs and pressuring placements. The lag between an energy shock and feed-cost realization is typically one to two quarters, extending the exposure window well beyond the headline event.</p>`,
  },
  {
    id: 'supply', level: 3, title: 'Global Supply Chain Disruption',
    html: `<p>Rerouting around the affected region lengthens shipping lanes, tightens refrigerated freight capacity, and raises insurance premiums and fuel surcharges. Cold-chain integrity costs rise as transit times extend, and port congestion increases the probability of lead-time variability for imported inputs and packaging. The compounding effect is reduced sourcing flexibility precisely when cost pressure is highest.</p>`,
  },
  {
    id: 'drivers', level: 2, title: 'Key Drivers & Watch Indicators',
    html: `<ul>
<li>Oil and fuel price volatility tied to Strait of Hormuz disruption</li>
<li>Freight rates, shipping-insurance premiums, and fuel surcharges</li>
<li>Cold-chain and refrigerated transport pricing</li>
<li>Fertilizer, corn, and soy price trends affecting feed costs</li>
<li>Port congestion, rerouting, and refrigerated freight capacity</li>
<li>Supplier reports of margin pressure, lead-time changes, or reduced flexibility</li>
<li>Global supply-chain pressure indices and regional logistics disruption</li>
</ul>`,
  },
  {
    id: 'scenario', level: 2, title: 'Scenario Analysis',
    html: `<p><strong>Base case — most likely.</strong> Tension persists without a sustained physical closure. Elevated but manageable cost pressure on fuel, freight, and feed; pass-through builds gradually over one to two quarters.</p>
<p><strong>Escalation.</strong> Partial or temporary closure, or insurer withdrawal from the lane. Sharp fuel and freight spikes, refrigerated-capacity scarcity, and acute lead-time variability; immediate margin and availability pressure on beef.</p>
<p><strong>De-escalation.</strong> Diplomatic resolution or credible de-risking. Energy and freight costs normalize over one to two quarters; residual feed-cost lag unwinds last.</p>`,
  },
  {
    id: 'mitigation', level: 2, title: 'Recommended Mitigation Strategies',
    html: `<ul>
<li>Layer fuel/freight and feed-input hedges where contractually feasible</li>
<li>Diversify logistics routes and pre-qualify alternate freight capacity</li>
<li>Run supplier contingency checks on cost pressure, lead times, and flexibility</li>
<li>Build targeted inventory and safety-stock buffers on critical beef SKUs</li>
<li>Deploy supply-chain visibility tools across lanes, ports, and fuel indices</li>
<li>Establish escalation thresholds tied to fuel, freight, and feed-cost triggers</li>
</ul>`,
  },
  {
    id: 'next', level: 2, title: 'Next Steps',
    html: `<ol>
<li>Brief the FY26 Beef Procurement owner within 5 business days</li>
<li>Engage top beef suppliers to confirm cost pressures and contingency plans</li>
<li>Stand up a weekly watch on fuel, freight, and feed indicators</li>
<li>Prepare escalation criteria if supplier exposure or cost pressure materially increases</li>
</ol>`,
  },
];

const SUMMARY = {
  situation: 'Middle East tension — disruption risk around the Strait of Hormuz — is raising volatility across energy, transportation, and global food supply chains. For beef, the most relevant risks are rising fuel and logistics costs, higher feed and fertilizer inputs, and reduced predictability across production, processing, and distribution.',
  impact: 'Higher procurement costs, margin pressure, cold-chain logistics volatility, and increased feed/input costs for producers. Persistent disruption could raise supplier operating costs, extend lead times, and reduce sourcing and distribution flexibility.',
  drivers: [
    'Oil and fuel price volatility tied to Strait of Hormuz disruption',
    'Freight rates, shipping insurance, and fuel surcharges',
    'Cold-chain and refrigerated transport pricing',
    'Fertilizer, corn, and soy feed-cost trends',
    'Port congestion, rerouting, and refrigerated capacity',
  ],
  actions: [
    'Review exposure to fuel, freight, feed, and fertilizer-linked cost increases',
    'Engage key beef suppliers to confirm cost pressures and contingency plans',
    'Evaluate fuel, freight, or feed-input hedging where applicable',
    'Assess alternate sourcing regions and route diversification',
    'Establish watch thresholds and escalation criteria',
  ],
  rationale: 'The risk is relevant to beef cost and supply reliability, but direct supplier disruption is not confirmed. Continue monitoring and reassess if new supplier, logistics, or input-cost signals emerge.',
};

// ──────────────── shared bits ────────────────
function AStat({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 600, flex: 'none' }}>{label}</span>
      <span style={{ fontSize: 12.5, color: '#171717', fontWeight: 600, textAlign: 'right' }}>{children}</span>
    </div>
  );
}

function AssistCard({ title, subtitle, action, children, style, bodyPad = '16px 18px' }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5', display: 'flex', flexDirection: 'column', minHeight: 0, ...style }}>
      {(title || action) && (
        <div style={{ padding: '13px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flex: 'none' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#171717' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 11.5, color: '#737373', marginTop: 2 }}>{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: bodyPad, minHeight: 0 }}>{children}</div>
    </div>
  );
}

// ──────────────── editor toolbar ────────────────
function EditorToolbar() {
  const btns = [
    { cmd: 'bold', label: 'B', style: { fontWeight: 800 } },
    { cmd: 'italic', label: 'I', style: { fontStyle: 'italic' } },
    { cmd: 'underline', label: 'U', style: { textDecoration: 'underline' } },
    { sep: true },
    { cmd: 'insertUnorderedList', label: '• List' },
    { cmd: 'insertOrderedList', label: '1. List' },
  ];
  const run = (e, cmd) => { e.preventDefault(); document.execCommand(cmd, false, null); };
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5, display: 'flex', alignItems: 'center', gap: 4,
      padding: '8px 10px', background: '#fff', borderBottom: '1px solid #f0f0f0',
      borderTopLeftRadius: 12, borderTopRightRadius: 12,
    }}>
      {btns.map((b, i) => b.sep
        ? <span key={i} style={{ width: 1, height: 18, background: '#e5e5e5', margin: '0 4px' }} />
        : (
          <button key={i} onMouseDown={(e) => run(e, b.cmd)} title={b.cmd}
            style={{ minWidth: 30, height: 28, padding: '0 8px', border: 'none', borderRadius: 6, background: 'transparent',
              cursor: 'pointer', fontSize: 13, color: '#404040', fontFamily: 'var(--font-sans)', ...b.style }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{b.label}</button>
        ))}
      <span style={{ marginLeft: 'auto', fontSize: 11.5, color: '#a3a3a3', fontWeight: 600 }}>Draft — editable</span>
    </div>
  );
}

// ──────────────── regenerate popover ────────────────
function RegeneratePopover({ onClose, onConfirm }) {
  const ref = useRefA(null);
  useEffectA(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, []);
  const inputs = [
    { icon: 'target-04', label: 'Current report context', note: 'Region, category, risk domain, and analyst inputs' },
    { icon: 'bar-chart-square-02', label: 'Latest signals', note: '12 signals · refreshed at generation time' },
    { icon: 'shield-tick', label: "McDonald's mitigation knowledge", note: 'Playbooks, hedging, and sourcing strategy' },
  ];
  return (
    <div ref={ref} style={{
      position: 'absolute', top: 48, right: 0, width: 360, zIndex: 60,
      background: '#fff', borderRadius: 12, padding: 14,
      boxShadow: '0 18px 40px -12px rgba(16,24,40,0.28), 0 2px 6px 0 rgba(16,24,40,0.08), inset 0 0 0 1px #e5e5e5',
      animation: 'pol-menu .16s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>Regenerate brief from</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {inputs.map(it => (
          <div key={it.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 10px', borderRadius: 8, background: '#fafafa', boxShadow: 'inset 0 0 0 1px #eee' }}>
            <span style={{ width: 26, height: 26, borderRadius: 6, background: '#d1e9ff', color: '#175cd3', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name={it.icon} size={15} /></span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#171717' }}>{it.label}</div>
              <div style={{ fontSize: 11.5, color: '#737373', marginTop: 1, lineHeight: 1.4 }}>{it.note}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#15803d', flex: 'none', marginTop: 2 }}><Icon name="check-circle" size={16} /></span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: '#737373', lineHeight: 1.5, background: '#fffbeb', borderRadius: 8, padding: '10px 12px', boxShadow: 'inset 0 0 0 1px #fde68a' }}>
        Regenerating will create a new draft version and update the Risk Report summary.
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={onConfirm}>
          <span style={{ display: 'inline-flex', marginRight: 2 }}><AssistStar size={14} /></span>
          Regenerate
        </Button>
      </div>
    </div>
  );
}

// ──────────────── email composer ────────────────
function EmailComposer({ onClose, onSend }) {
  const [recipients, setRecipients] = useStateA(['beef.procurement@mcd.com', 'category.risk@mcd.com']);
  const [draft, setDraft] = useStateA('');
  const [opts, setOpts] = useStateA({ exec: true, actions: true, indicators: true, appendix: false });
  const addRecipient = (e) => {
    if (e.key === 'Enter' && draft.trim()) {
      e.preventDefault();
      setRecipients(r => [...r, draft.trim()]);
      setDraft('');
    }
  };
  const optList = [
    ['exec', 'Include executive summary'],
    ['actions', 'Include recommended mitigation actions'],
    ['indicators', 'Include watch indicators'],
    ['appendix', 'Include signals appendix'],
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(16,24,40,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 'min(720px, 100%)', maxHeight: '100%', background: '#fff', borderRadius: 14, boxShadow: '0 24px 60px -16px rgba(16,24,40,0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: '#d1e9ff', color: '#175cd3', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bell-01" size={16} /></span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#171717' }}>Send brief by email</div>
          </div>
          <IconButton icon="x-close" onClick={onClose} title="Close" />
        </div>
        {/* body */}
        <div style={{ padding: '18px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* recipients */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: '#525252' }}>Recipients</label>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', minHeight: 42, padding: '6px 8px', borderRadius: 8, background: '#fff', boxShadow: 'inset 0 0 0 1px #d4d4d4' }}>
              {recipients.map((r, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f5f5f5', borderRadius: 6, padding: '4px 8px', fontSize: 12.5, color: '#171717', fontWeight: 600 }}>
                  {r}
                  <span onClick={() => setRecipients(rs => rs.filter((_, j) => j !== i))} style={{ cursor: 'pointer', color: '#a3a3a3', display: 'inline-flex' }}><Icon name="x-close" size={12} /></span>
                </span>
              ))}
              <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={addRecipient}
                placeholder={recipients.length ? 'Add more…' : 'Add recipients…'}
                style={{ flex: 1, minWidth: 120, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'var(--font-sans)', color: '#171717', height: 28 }} />
            </div>
          </div>
          {/* subject */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: '#525252' }}>Subject</label>
            <div style={{ marginTop: 6, padding: '10px 12px', borderRadius: 8, background: '#fafafa', boxShadow: 'inset 0 0 0 1px #e5e5e5', fontSize: 13.5, color: '#171717', fontWeight: 600 }}>
              Risk Mitigation Brief: {ASSIST_CONTEXT.title}
            </div>
          </div>
          {/* body preview */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: '#525252' }}>Body preview</label>
            <div style={{ marginTop: 6, padding: '14px 16px', borderRadius: 8, background: '#fafafa', boxShadow: 'inset 0 0 0 1px #e5e5e5', fontSize: 13, color: '#404040', lineHeight: 1.55, maxHeight: 168, overflowY: 'auto' }}>
              <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#171717' }}>Recommended Disposition: Watch · Confidence: Medium-High</p>
              <p style={{ margin: '0 0 8px' }}>{SUMMARY.situation}</p>
              {opts.exec && <p style={{ margin: '0 0 8px' }}>{SUMMARY.impact}</p>}
              {opts.actions && (
                <>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#171717' }}>Recommended mitigation actions</p>
                  <ul style={{ margin: '0 0 8px', paddingLeft: 18 }}>{SUMMARY.actions.slice(0, 4).map((a, i) => <li key={i}>{a}</li>)}</ul>
                </>
              )}
              {opts.indicators && (
                <>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#171717' }}>Watch indicators</p>
                  <ul style={{ margin: '0 0 8px', paddingLeft: 18 }}>{SUMMARY.drivers.slice(0, 4).map((a, i) => <li key={i}>{a}</li>)}</ul>
                </>
              )}
              {opts.appendix && <p style={{ margin: 0, color: '#737373', fontStyle: 'italic' }}>Signals appendix (12 signals) attached.</p>}
            </div>
          </div>
          {/* options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {optList.map(([k, label]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 8, cursor: 'pointer', background: opts[k] ? '#f5fafc' : '#fff', boxShadow: `inset 0 0 0 1px ${opts[k] ? '#84caff' : '#e5e5e5'}` }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, flex: 'none', background: opts[k] ? '#1570ef' : '#fff', boxShadow: opts[k] ? 'none' : 'inset 0 0 0 1px #d4d4d4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {opts[k] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>}
                </span>
                <input type="checkbox" checked={opts[k]} onChange={() => setOpts(o => ({ ...o, [k]: !o[k] }))} style={{ display: 'none' }} />
                <span style={{ fontSize: 13, color: '#404040', fontWeight: 600 }}>{label}</span>
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#737373' }}>
            <Icon name="check-circle" size={14} tint={0.6} />
            Email activity will sync back to the Risk Report.
          </div>
        </div>
        {/* footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 10, flex: 'none' }}>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => onSend(recipients.length)}>Send Email</Button>
        </div>
      </div>
    </div>
  );
}

// ──────────────── main workspace ────────────────
function PolarisAssist({ connectedTitle, onClose, onReturnToast }) {
  const [regenOpen, setRegenOpen] = useStateA(false);
  const [emailOpen, setEmailOpen] = useStateA(false);
  const [version, setVersion] = useStateA(1);
  const [generatedAt, setGeneratedAt] = useStateA('Jun 8, 2026 · 9:42 AM');
  const [synced, setSynced] = useStateA(true);
  const [localToast, setLocalToast] = useStateA('');
  const ctx = ASSIST_CONTEXT;
  const reportTitle = connectedTitle || ctx.title;

  const toast = (m) => { setLocalToast(m); window.clearTimeout(PolarisAssist._t); PolarisAssist._t = window.setTimeout(() => setLocalToast(''), 2600); };

  const doRegenerate = () => {
    setRegenOpen(false);
    setVersion(v => v + 1);
    setGeneratedAt('Jun 8, 2026 · ' + (9 + version) + ':' + (10 + version * 7 % 50) + ' AM');
    setSynced(true);
    toast('New draft generated — Risk Report summary updated');
  };
  const doSend = (n) => { setEmailOpen(false); toast(`Brief emailed to ${n} recipient${n === 1 ? '' : 's'} — logged on the Risk Report`); };
  const doReturn = () => { onReturnToast && onReturnToast('Brief v' + version + ' saved · summary synced · returned to Risk Report'); onClose(); };

  const impactStr = ctx.potentialImpact.join(', ');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 4000, background: '#f5f6f8', display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <header style={{ flex: 'none', background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '14px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, minWidth: 0 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #1570ef, #175cd3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><AssistStar size={22} /></span>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#171717', letterSpacing: '-0.01em' }}>Polaris Assist</span>
                <Pill tone="brand" dot={false}>Risk Mitigation Brief</Pill>
              </div>
              <div style={{ marginTop: 5, fontSize: 13, color: '#525252', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="target-04" size={14} tint={0.55} />
                  Connected to Risk Report: <strong style={{ color: '#171717', fontWeight: 700 }}>{reportTitle}</strong>
                </span>
              </div>
              <div style={{ marginTop: 4, fontSize: 12.5, color: '#737373', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#15803d' }} />
                  Draft generated{version > 1 ? ` · v${version}` : ''}
                </span>
                <span style={{ color: '#d4d4d4' }}>·</span>
                <span>{generatedAt}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none', position: 'relative' }}>
            <Button variant="secondary" size="sm" onClick={() => setRegenOpen(o => !o)}>
              <span style={{ display: 'inline-flex', marginRight: 2 }}><AssistStar size={14} /></span>
              Regenerate Brief
            </Button>
            <Button variant="secondary" size="sm" leadingIcon="bell-01" onClick={() => setEmailOpen(true)}>Send by Email</Button>
            <Button variant="primary" size="sm" onClick={doReturn}>
              <span style={{ transform: 'rotate(180deg)', display: 'inline-flex', marginRight: 2 }}><Icon name="arrow-up-right" size={15} /></span>
              Return to Risk Report
            </Button>
            {regenOpen && <RegeneratePopover onClose={() => setRegenOpen(false)} onConfirm={doRegenerate} />}
          </div>
        </div>
      </header>

      {/* body — 3 columns */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '264px minmax(0, 1fr) 360px', gap: 16, padding: 20, overflow: 'hidden' }}>
        {/* context panel */}
        <div style={{ minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AssistCard title="Risk context">
            <AStat label="Region">{ctx.region}</AStat>
            <AStat label="Category">{ctx.category}</AStat>
            <AStat label="Risk Domain"><span style={{ maxWidth: 150, display: 'inline-block' }}>{ctx.riskDomain}</span></AStat>
            <AStat label="Potential Impact"><span style={{ maxWidth: 150, display: 'inline-block' }}>{impactStr}</span></AStat>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 600 }}>Analyst Risk Level</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef2f2', color: '#b91c1c', boxShadow: 'inset 0 0 0 1px #fecaca', borderRadius: 9999, padding: '2px 9px', fontSize: 12, fontWeight: 700 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#b91c1c' }} />Red
              </span>
            </div>
            <AStat label="Signals Used">{ctx.signalsUsed}</AStat>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '10px 0 0' }}>
              <span style={{ fontSize: 12.5, color: '#737373', fontWeight: 600, maxWidth: 130 }}>McDonald's mitigation knowledge</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#15803d', fontSize: 12, fontWeight: 700 }}>
                <Icon name="check-circle" size={14} />Applied
              </span>
            </div>
          </AssistCard>

          <AssistCard title="How this connects" bodyPad="14px 18px">
            <div style={{ fontSize: 12.5, color: '#525252', lineHeight: 1.55 }}>
              <p style={{ margin: '0 0 8px' }}><strong style={{ color: '#171717' }}>Risk Report</strong> handles triage and disposition.</p>
              <p style={{ margin: 0 }}><strong style={{ color: '#171717' }}>Polaris Assist</strong> is where the full brief is edited, regenerated, and emailed. Edits sync to the report's condensed summary.</p>
            </div>
          </AssistCard>
        </div>

        {/* brief editor */}
        <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <EditorToolbar />
            <div style={{ overflowY: 'auto', padding: '8px 40px 40px' }} onInput={() => setSynced(false)}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', margin: '24px 0 4px', lineHeight: 1.2 }}>{ctx.title}</h1>
              <div style={{ fontSize: 13, color: '#737373', marginBottom: 8 }}>Risk Mitigation Brief · Generated {generatedAt}</div>
              {BRIEF_SECTIONS.map(sec => (
                <div key={sec.id} style={{ marginTop: sec.level === 2 ? 28 : 18 }}>
                  {sec.level === 2
                    ? <h2 style={{ fontSize: 18, fontWeight: 700, color: '#171717', margin: '0 0 8px', paddingBottom: 8, borderBottom: '1px solid #f0f0f0', letterSpacing: '-0.01em' }}>{sec.title}</h2>
                    : <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', margin: '0 0 6px' }}>{sec.title}</h3>}
                  <div
                    contentEditable suppressContentEditableWarning
                    className="assist-prose"
                    style={{ fontSize: 14.5, color: '#404040', lineHeight: 1.65, outline: 'none', borderRadius: 6 }}
                    dangerouslySetInnerHTML={{ __html: sec.html }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* summary panel */}
        <div style={{ minHeight: 0, overflowY: 'auto' }}>
          <AssistCard
            style={{ position: 'relative' }}
            title="Risk Report Summary"
            subtitle="This condensed view appears on the Risk Report"
            action={synced
              ? <Pill tone="success" dot={false}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="check-circle" size={12} />Synced</span></Pill>
              : <Pill tone="warning" dot={false}>Pending sync</Pill>}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Pill tone="warning" dot={false} style={{ fontWeight: 700 }}>Disposition: Watch</Pill>
              <Pill tone="brand" dot={false}>Confidence: Medium-High</Pill>
            </div>
            <SummaryBlock title="Situation Summary">{SUMMARY.situation}</SummaryBlock>
            <SummaryBlock title="Business Impact">{SUMMARY.impact}</SummaryBlock>
            <SummaryBlock title="Key Risk Drivers / Watch Indicators">
              <ul style={{ margin: '6px 0 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {SUMMARY.drivers.map((d, i) => <li key={i} style={{ display: 'flex', gap: 8 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a3a3a3', flex: 'none', marginTop: 7 }} />{d}</li>)}
              </ul>
            </SummaryBlock>
            <SummaryBlock title="Recommended Mitigation Actions">
              <ul style={{ margin: '6px 0 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {SUMMARY.actions.map((d, i) => <li key={i} style={{ display: 'flex', gap: 8 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a3a3a3', flex: 'none', marginTop: 7 }} />{d}</li>)}
              </ul>
            </SummaryBlock>
            <SummaryBlock title="Rationale" last>{SUMMARY.rationale}</SummaryBlock>
          </AssistCard>
        </div>
      </div>

      {emailOpen && <EmailComposer onClose={() => setEmailOpen(false)} onSend={doSend} />}

      {localToast && (
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 90, background: '#171717', color: '#fff', padding: '11px 18px', borderRadius: 9999, fontSize: 13, fontWeight: 600, boxShadow: '0 12px 28px -8px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="check-circle" size={15} style={{ filter: 'invert(1)' }} />
          {localToast}
        </div>
      )}
    </div>
  );
}

function SummaryBlock({ title, children, last }) {
  return (
    <div style={{ padding: '12px 0', borderBottom: last ? 'none' : '1px solid #f0f0f0' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#737373', marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#404040', lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

Object.assign(window, { PolarisAssist });
