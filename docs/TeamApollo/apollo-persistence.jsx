// Apollo — Persistence / Traceability rules screen
(function () {
const T = window.T;
const { Ic, Pill, OpTag, Card, SectionHead, PersistenceLifecycle } = window;

function PersistenceView() {
  const { persistence, OP } = window.AP;
  const td = { padding: '14px 16px', fontSize: 13, color: T.text2, lineHeight: 1.5, verticalAlign: 'top' };

  return (
    <div style={{ padding: '24px 32px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <SectionHead eyebrow="Persistence / traceability rules" accent={T.acc}
          title="Real-time events and investigations use different rules"
          sub="Freshness, persistence, and traceability differ by scenario. The same architecture supports both." />
      </div>

      {/* rules table */}
      <Card style={{ overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.font, minWidth: 940 }}>
            <thead><tr style={{ background: '#fafafa', borderBottom: `1px solid ${T.bd}` }}>
              {['Scenario', 'Persistence model', 'Freshness rule', 'Traceability rule', 'Example'].map(c => <th key={c} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 11, fontWeight: 700, color: T.text3, whiteSpace: 'nowrap' }}>{c}</th>)}
            </tr></thead>
            <tbody>
              {persistence.rules.map((r, i) => (
                <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
                  <td style={{ ...td, maxWidth: 210 }}>
                    <div style={{ marginBottom: 7 }}><OpTag id={r.op} /></div>
                    <span style={{ fontWeight: 700, color: T.text }}>{r.scenario}</span>
                  </td>
                  <td style={{ ...td, maxWidth: 220 }}>{r.model}</td>
                  <td style={{ ...td, fontWeight: 600, color: T.text, whiteSpace: 'nowrap' }}>{r.freshness}</td>
                  <td style={{ ...td, maxWidth: 280 }}>{r.traceability}</td>
                  <td style={{ ...td, maxWidth: 180, color: T.text3 }}>{r.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* comparison panel */}
      <SectionHead eyebrow="Comparison" accent={T.cyan} title="Real-time event vs long-tail investigation" style={{ marginBottom: 14 }} />
      <Card style={{ overflow: 'hidden', marginBottom: 28 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.font }}>
          <thead><tr style={{ background: '#fafafa', borderBottom: `1px solid ${T.bd}` }}>
            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: 11, fontWeight: 700, color: T.text3 }}>Dimension</th>
            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: 11.5, fontWeight: 700, color: '#c2410c' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Ic name="flame" size={13} /> Real-Time Natural Disaster Response</span></th>
            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: 11.5, fontWeight: 700, color: '#1570ef' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Ic name="shield" size={13} /> Long-Tail Threat Investigation</span></th>
          </tr></thead>
          <tbody>
            {persistence.comparison.map((row, i) => (
              <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
                <td style={{ padding: '13px 18px', fontSize: 12.5, fontWeight: 700, color: T.text, whiteSpace: 'nowrap' }}>{row.dim}</td>
                <td style={{ padding: '13px 18px', fontSize: 13, color: T.text2, lineHeight: 1.45 }}>{row.rt}</td>
                <td style={{ padding: '13px 18px', fontSize: 13, color: T.text2, lineHeight: 1.45 }}>{row.lt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* lifecycle visual */}
      <SectionHead eyebrow="Lifecycle" accent={T.acc} title="How each scenario flows and what persists" style={{ marginBottom: 14 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <PersistenceLifecycle steps={persistence.lifecycle.rt} color="#c2410c" icon="flame"
          title="Real-Time Natural Disaster Response" subtitle="Short window · event chain retained" />
        <PersistenceLifecycle steps={persistence.lifecycle.lt} color="#1570ef" icon="shield"
          title="Long-Tail Threat Investigation" subtitle="Persistent graph · versioned reports" />
      </div>

      <div style={{ marginTop: 22, display: 'flex', gap: 10, padding: '14px 16px', borderRadius: 12, background: '#eff6ff', boxShadow: 'inset 0 0 0 1px #bfdbfe' }}>
        <Ic name="link" size={17} color={T.accHi} style={{ flex: 'none', marginTop: 1 }} />
        <span style={{ fontSize: 13, color: T.accHi, lineHeight: 1.55 }}>Across both models, every conclusion remains traceable back to source signals. Real-time tactical views expire quickly while the event chain and distributed-output history are preserved; investigation evidence graphs, pattern revisions, and report versions persist indefinitely.</span>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}

window.PersistenceView = PersistenceView;
})();
