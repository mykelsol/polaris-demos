// Apollo — Monitoring Strategy configuration view
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill, Card, SectionHead } = window;

function EntityChip({ id, onRemove }) {
  const { ENT } = window.AP;
  const e = ENT[id]; if (!e) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 8px 5px 9px', borderRadius: 8, background: '#fff', boxShadow: `inset 0 0 0 1px ${T.bd}`, fontSize: 12.5, fontWeight: 600, color: T.text }}>
      <Ic name={e.icon} size={13} color={T.text3} /> {e.name}
      <span style={{ color: T.text4, display: 'inline-flex', cursor: 'pointer' }}><Ic name="x" size={12} /></span>
    </span>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 0', borderBottom: `1px solid ${T.bd}` }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: T.text3, marginTop: 2 }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function Seg({ value, options, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: '#f5f5f5', borderRadius: 9, padding: 3, boxShadow: `inset 0 0 0 1px ${T.bd}` }}>
      {options.map(o => {
        const on = o === value;
        return <button key={o} onClick={() => onChange(o)} style={{ border: 'none', cursor: 'pointer', borderRadius: 6, padding: '6px 13px', background: on ? '#fff' : 'transparent', color: on ? T.acc : T.text3, fontFamily: T.font, fontWeight: 700, fontSize: 12.5, boxShadow: on ? '0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 1px #e5e5e5' : 'none' }}>{o}</button>;
      })}
    </div>
  );
}

function StrategyView({ embedded, agentId, onNav, onToast }) {
  const { strategy, agentById } = window.AP;
  const [cadence, setCadence] = React.useState(strategy.cadence);
  const [sensitivity, setSensitivity] = React.useState(strategy.sensitivity);
  const ag = agentId ? agentById[agentId] : null;

  const inner = (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 22, alignItems: 'start' }}>
      {/* form */}
      <Card style={{ padding: '6px 24px 20px' }}>
        <Field label="Monitoring objective" hint="What this strategy is built to detect">
          <div style={{ padding: '12px 14px', borderRadius: 10, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}`, fontSize: 14, color: T.text2, lineHeight: 1.5 }}>{strategy.objective}</div>
        </Field>
        <Field label="Primary entities" hint="Highest-priority targets for this strategy">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {strategy.primaryEntities.map(id => <EntityChip key={id} id={id} />)}
            <Btn variant="ghost" size="xs" icon="plus">Add</Btn>
          </div>
        </Field>
        <Field label="Secondary entities" hint="Supporting entities monitored for corroboration">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {strategy.secondaryEntities.map(id => <EntityChip key={id} id={id} />)}
            <Btn variant="ghost" size="xs" icon="plus">Add</Btn>
          </div>
        </Field>
        <Field label="Source vectors" hint="Evidence types this strategy ingests">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {strategy.vectors.map(v => (
              <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 8, background: '#eff6ff', boxShadow: 'inset 0 0 0 1px #bfdbfe', fontSize: 12.5, fontWeight: 700, color: T.accHi }}>
                <window.VectorGlyph vector={v} size={13} /> {v}
              </span>
            ))}
          </div>
        </Field>
        <div style={{ display: 'flex', gap: 40 }}>
          <Field label="Cadence" hint="How often the agent runs"><Seg value={cadence} options={['30 min', 'Hourly', '2 hr', 'Daily']} onChange={setCadence} /></Field>
          <Field label="Sensitivity" hint="Detection threshold"><Seg value={sensitivity} options={['Conservative', 'Balanced', 'Aggressive']} onChange={setSensitivity} /></Field>
        </div>
        <div style={{ paddingTop: 18, display: 'flex', gap: 10 }}>
          <Btn variant="primary" size="sm" icon="check" onClick={() => onToast && onToast('Strategy saved as v1.5 draft')}>Save strategy</Btn>
          <Btn variant="secondary" size="sm" icon="play" onClick={() => onToast && onToast('Preview-light recomputed')}>Run preview</Btn>
        </div>
      </Card>

      {/* sidebar: preview + version + timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>
        <Card style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active version</span>
            <Pill tone="accent" size="xs">{strategy.version}</Pill>
          </div>
          <div style={{ fontSize: 11.5, color: T.text3, marginBottom: 14 }}>Preview-light on recent evidence</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <PreviewStat label="Would emit" value={strategy.preview.emit} tone="ready" />
            <PreviewStat label="Would watch" value={strategy.preview.watch} tone="dev" />
            <PreviewStat label="Would reject" value={strategy.preview.reject} tone="mon" />
          </div>
        </Card>

        <Card style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Strategy timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {strategy.timeline.slice().reverse().map((t, i, arr) => (
              <div key={t.v} style={{ display: 'flex', gap: 11 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: t.current ? T.acc : '#fff', boxShadow: `inset 0 0 0 ${t.current ? 3 : 1.5}px ${t.current ? T.acc : T.bdHi}`, marginTop: 3 }} />
                  {i < arr.length - 1 && <span style={{ width: 1.5, flex: 1, background: T.bd, minHeight: 26 }} />}
                </div>
                <div style={{ paddingBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: t.current ? T.acc : T.text }}>{t.v}</span>
                    {t.current && <Pill tone="accent" size="xs">Active</Pill>}
                  </div>
                  <div style={{ fontSize: 12, color: T.text2, marginTop: 3, lineHeight: 1.45 }}>{t.note}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  if (embedded) return inner;

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <SectionHead eyebrow="Monitoring strategy" accent={T.acc}
          title="Command post monitoring strategy · v1.4"
          sub="Compound signals into patterns, promote Insight Ready patterns, and govern role-based distribution across both operations"
          action={<Btn variant="secondary" size="sm" icon="cpu" onClick={() => onNav && onNav('agents')}>View agents</Btn>} />
      </div>
      {inner}
    </div>
  );
}

function PreviewStat({ label, value, tone }) {
  const c = { ready: T.ready, dev: T.dev, mon: T.mon }[tone];
  return (
    <div style={{ flex: 1, padding: '11px 12px', borderRadius: 10, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}` }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: c, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: T.text3, marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
    </div>
  );
}

window.StrategyView = StrategyView;
})();
