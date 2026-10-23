// Apollo — Polaris Assist (right slide-over + inline mode)
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill } = window;

const CANNED = {
  'What changed in Operation Sierra Ember in the last hour?':
    'Sierra Ember escalated. A wind model update shifted toward the North Ridge corridor (SE-001), drone imagery shows fire-line movement near the western access road (SE-002), Route 18 has a partial blockage (SE-004), and evacuation traffic is increasing (SE-005). Net effect: the evacuation corridor pattern crossed the Insight Ready threshold 8 minutes ago, and Pine Substation infrastructure risk also reached Insight Ready.',
  'Which evacuation corridors are becoming risky?':
    'The North Ridge evacuation corridor is the active risk. 11 signals across weather, drone, field reports, transportation, evacuation flow, and utility telemetry converge on a constraining corridor. Evidence strength and confidence are High, lifecycle is Accelerating. Recommended next move: create the North Ridge Evacuation Corridor Risk Analyst Report and distribute role-specific updates.',
  'Generate an Analyst Report from the North Ridge pattern.':
    'I can draft the North Ridge Evacuation Corridor Risk Analyst Report from the Insight Ready pattern (11 signals, High strength, High confidence). The report will separate confirmed evidence — wind shift, fire-line movement, Route 18 blockage, rising traffic, substation exposure — from 4 open operational gaps, and stage role-specific distribution. Open Create Analyst Report to generate the draft.',
  "What should be distributed to fire operations versus sheriff's office?":
    'Fire Operations receives the Field Operations Update: fire-line movement, visibility, route status, and staging recommendations, with no restricted fields. The Sheriff\u2019s Office receives the Evacuation Route Update: route risk, traffic flow, and public safety guidance, with utility telemetry details hidden. Both trace back to the same North Ridge report.',
  'What changed around POI Orion in the last 8 hours?':
    'Orion shifted from intermittent observation to concentrated multi-source activity. A drone feed placed an Orion-associated vehicle near Site Lattice (IS-001), body cam captured a partial visual match (IS-002), Device D-77 reappeared after a 36-hour quiet period (IS-003), and associates Kestrel and Slate appeared in overlapping windows. The convergence pattern is Insight Ready at High strength, Medium-High confidence.',
  'What intelligence gaps remain before IS-17 is report-ready?':
    'Five gaps remain. Full visual confirmation of Orion is missing (High), intent behind associate clustering is unknown (High), the Route Falcon destination is unresolved (High), Device D-77 custody is not confirmed (Medium), and IS-17 has one stale assumption (Medium). Recommend a Collection Memo tasking the top three before final analyst reporting.',
  'Which signals support the Iron Shield convergence pattern?':
    'Nine signals support it: drone observation of an Orion-linked vehicle (IS-001), partial body cam match (IS-002), D-77 reappearance and co-location with V-214 (IS-003, IS-004), Kestrel interaction with the Orion vehicle (IS-005), Slate near Site Lattice (IS-006), a short-duration Route Falcon movement window (IS-007), two short Site Lattice arrivals (IS-008), and a stale IS-17 assumption (IS-009).',
  'Create a field awareness update from the Iron Shield report.':
    'The Field Awareness Update for the Field Team includes latest confirmed activity, operationally relevant cautions, and a tasking summary. Restricted fields hide source identities, sensitive methods, and historical investigation notes. It is Ready to distribute and traces back to the Critical Infrastructure Threat Convergence Analyst Report.',
  'Compare real-time disaster persistence rules with long-tail investigation persistence rules.':
    'Sierra Ember (real-time) uses a short operational window with a retained event chain — freshness in minutes to hours, tactical views expire quickly, distributed-output history is kept. Iron Shield (long-tail) uses a persistent evidence graph with versioned reports — freshness in hours to days plus historical context, preserving all signal links, pattern revisions, relationship changes, and report versions.',
  'Show me all Insight Ready patterns with unresolved gaps.':
    'Four Insight Ready patterns carry unresolved gaps. North Ridge evacuation corridor (4 operational gaps), Pine Substation infrastructure risk (2 gaps), Orion network convergence (5 intelligence gaps), and D-77 device association (1 custody gap). All four are eligible for analyst reporting; gaps should be carried into the report and collection plan.',
  'Summarize the command brief for each active operation.':
    'Sierra Ember: one Insight Ready evacuation corridor pattern (11 signals, High/High) plus rising substation risk; largest gaps are Route 18 clearance, Mile Marker 12 visibility, shelter capacity, and utility crew posture. Iron Shield: one Insight Ready convergence pattern around Orion (9 signals, High/Medium-High); largest gaps are visual confirmation, associate intent, Route Falcon destination, D-77 custody, and a stale IS-17 assumption.',
};

function respondTo(prompt) {
  const { assistSampleSierra, assistSampleIron } = window.AP;
  if (prompt in CANNED) return CANNED[prompt];
  const q = prompt.toLowerCase();
  if (q.includes('orion') || q.includes('iron shield') || q.includes('is-17') || q.includes('convergence')) return assistSampleIron;
  if (q.includes('sierra') || q.includes('evac') || q.includes('corridor') || q.includes('north ridge')) return assistSampleSierra;
  if (q.includes('distribut')) return CANNED["What should be distributed to fire operations versus sheriff's office?"];
  if (q.includes('persist') || q.includes('traceab')) return CANNED['Compare real-time disaster persistence rules with long-tail investigation persistence rules.'];
  if (q.includes('gap')) return CANNED['Show me all Insight Ready patterns with unresolved gaps.'];
  return 'Grounded in patterns first. Across both operations there are 7 Insight Ready patterns. The strongest are the North Ridge evacuation corridor (Sierra Ember) and the POI Orion network convergence (Iron Shield). Ask about an operation, a pattern, a gap, or what should be distributed for a focused answer.';
}

function AssistPanel({ inline, contextLabel, onClose }) {
  const { assistPrompts } = window.AP;
  const [msgs, setMsgs] = React.useState([]);
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef(null);

  const send = (text) => {
    const t = (text || input).trim(); if (!t) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: t }, { role: 'assistant', text: respondTo(t) }]);
  };
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs]);

  const body = (
    <>
      {/* header */}
      <div style={{ padding: inline ? '16px 18px' : '18px 22px', borderBottom: `1px solid ${T.bd}`, display: 'flex', alignItems: 'center', gap: 11, flex: 'none', background: '#fff' }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #1570ef, #001030)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name="sparkles" size={18} color="#fff" /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Polaris Assist</div>
          <div style={{ fontSize: 11.5, color: T.text3 }}>{contextLabel ? `Context · ${contextLabel}` : 'Grounded in patterns, signals & evidence · both operations'}</div>
        </div>
        {!inline && <IconBtn name="x" size={32} onClick={onClose} />}
      </div>

      {/* conversation */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: inline ? '18px' : '20px 22px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: inline ? 320 : 0 }}>
        {msgs.length === 0 && (
          <div style={{ display: 'flex', gap: 11 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #1570ef, #001030)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name="sparkles" size={15} color="#fff" /></span>
            <div style={{ flex: 1, fontSize: 13.5, color: T.text2, lineHeight: 1.6, paddingTop: 4 }}>
              I monitor everything across both active operations{contextLabel ? ` — focused on ${contextLabel}` : ''}. Ask about what changed in an operation, which patterns are Insight Ready, what gaps remain, or what should be distributed to a given role. I answer from patterns first, traceable to signals.
            </div>
          </div>
        )}
        {msgs.map((m, i) => m.role === 'user' ? (
          <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '86%', background: '#1570ef', color: '#fff', padding: '10px 14px', borderRadius: '12px 12px 4px 12px', fontSize: 13.5, fontWeight: 500, lineHeight: 1.5 }}>{m.text}</div>
        ) : (
          <div key={i} style={{ display: 'flex', gap: 11 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #1570ef, #001030)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}><Ic name="sparkles" size={15} color="#fff" /></span>
            <div style={{ flex: 1, fontSize: 13.5, color: T.text2, lineHeight: 1.6, background: '#fafafa', borderRadius: 12, padding: '12px 14px', boxShadow: `inset 0 0 0 1px ${T.bd}` }}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* suggested prompts */}
      <div style={{ padding: inline ? '0 18px 12px' : '0 22px 12px', flex: 'none' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 9 }}>Suggested prompts</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: msgs.length ? 0 : 'none', overflow: 'hidden', transition: 'max-height .2s' }}>
          {(msgs.length ? assistPrompts.slice(0, 0) : assistPrompts).map((p, i) => (
            <button key={i} onClick={() => send(p)} style={{
              textAlign: 'left', border: 'none', cursor: 'pointer', padding: '9px 12px', borderRadius: 9,
              background: '#fff', boxShadow: `inset 0 0 0 1px ${T.bd}`, fontFamily: T.font, fontSize: 12.5, color: T.text2, lineHeight: 1.4,
              display: 'flex', alignItems: 'center', gap: 9,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${T.bdHi}`; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${T.bd}`; }}>
              <Ic name="sparkles" size={13} color={T.acc} /> {p}
            </button>
          ))}
        </div>
        {msgs.length > 0 && (
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {assistPrompts.slice(0, 3).map((p, i) => (
              <button key={i} onClick={() => send(p)} style={{ border: 'none', cursor: 'pointer', padding: '6px 11px', borderRadius: 9999, background: '#eff6ff', boxShadow: 'inset 0 0 0 1px #bfdbfe', fontFamily: T.font, fontSize: 11.5, fontWeight: 600, color: T.accHi }}>{p.length > 38 ? p.slice(0, 36) + '…' : p}</button>
            ))}
          </div>
        )}
      </div>

      {/* input */}
      <div style={{ padding: inline ? '0 18px 18px' : '0 22px 20px', flex: 'none' }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: `0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px ${T.bd}`, padding: 12 }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask Polaris Assist…" rows={2}
            style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontFamily: T.font, fontSize: 13.5, color: T.text, lineHeight: 1.5, minHeight: 34 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: T.text4, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Ic name="shield" size={12} /> Synthetic demo</span>
            <Btn variant="primary" size="xs" icon="send" onClick={() => send()} disabled={!input.trim()}>Ask</Btn>
          </div>
        </div>
      </div>
    </>
  );

  if (inline) {
    return (
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: `0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px ${T.bd}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 760 }}>
        {body}
      </div>
    );
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(12,14,18,0.40)', backdropFilter: 'blur(3px)', zIndex: 50, animation: 'ap-fade .2s ease' }} />
      <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, background: '#fff', borderLeft: `1px solid ${T.bd}`, boxShadow: '-16px 0 40px -12px rgba(16,24,40,0.25)', zIndex: 51, display: 'flex', flexDirection: 'column', animation: 'ap-slide .26s cubic-bezier(0.16,1,0.3,1)' }}>
        {body}
      </aside>
    </>
  );
}

window.AssistPanel = AssistPanel;
})();
