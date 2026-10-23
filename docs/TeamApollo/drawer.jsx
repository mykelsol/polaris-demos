// Polaris signal drawer — matches /Intel-Hub/Global-View Figma frame

function SignalDrawer({ signal, onClose, drawerWidth }) {
  const [assistInput, setAssistInput] = React.useState('');
  const [assistResponse, setAssistResponse] = React.useState('');
  const [assistLoading, setAssistLoading] = React.useState(false);

  if (!signal) return null;
  const { agents, E } = window.POLARIS_DATA;
  const agent = agents.find(a => a.id === signal.agent);

  const askAssist = async () => {
    if (!assistInput.trim() || assistLoading) return;
    setAssistLoading(true);
    setAssistResponse('');
    try {
      if (!window.claude || !window.claude.complete) {
        setAssistResponse("Polaris Assist needs an online connection. This standalone export of the prototype runs without API access — in the live product, this box answers questions about the signal in two sentences.");
        return;
      }
      const workspaceLabel = window.POLARIS_DATA.workspace?.label || 'ABM Intelligence Hub';
      const prompt = `You are Polaris Assist, an analyst AI inside a B2B signal-monitoring product (${workspaceLabel}).
A user is reading a Signal in the drawer. Answer their question in 2 short sentences, analyst voice, no fluff.

SIGNAL: ${signal.title}
ENTITY: ${E[signal.entity]}
STRENGTH: ${signal.strength} · CONFIDENCE: ${signal.confidence}
BODY: ${signal.body}
LINKAGE: ${signal.linkage}

USER QUESTION: ${assistInput}`;
      const reply = await window.claude.complete(prompt);
      setAssistResponse(reply);
    } catch (e) {
      setAssistResponse("(Polaris Assist is offline in this preview.)");
    } finally {
      setAssistLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(12,14,18,0.45)',
        backdropFilter: 'blur(4px)', zIndex: 10, animation: 'pol-fade-in .2s ease',
      }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: drawerWidth,
        background: '#fff', borderLeft: '1px solid #e5e5e5',
        boxShadow: '-12px 0 28px -8px rgba(16,24,40,0.18)',
        zIndex: 11, display: 'flex', flexDirection: 'column',
        animation: 'pol-slide-in .25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          background: '#fafafa',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          flex: 'none',
        }}>
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: 'var(--font-sans)',
            fontWeight: 700, fontSize: 16, lineHeight: '24px',
            color: '#171717', letterSpacing: '-0.01em',
          }}>{signal.title}</h2>
          <div style={{ display: 'flex', gap: 4 }}>
            <IconButton icon="bell-01"  title="Snooze"   size={28} />
            <IconButton icon="users-01" title="Assign"   size={28} />
            <IconButton icon="x-close"  title="Close"    size={28} onClick={onClose} />
          </div>
        </div>

        {/* Scroll body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '20px 24px' }}>
            {/* Metadata block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <MetaRow label="Entity">
                <span style={{ fontWeight: 700, color: '#171717' }}>{E[signal.entity]}</span>
              </MetaRow>
              <MetaRow>
                <Strength level={signal.strength} mode="badge" />
                <span style={{ color: '#737373', fontSize: 13 }}>·</span>
                <Pill tone="neutral" dot={false}>Confidence: {signal.confidence}</Pill>
              </MetaRow>
              <MetaRow label="Linked Pattern">
                <span style={{ color: '#1570ef', fontWeight: 600, fontSize: 13 }}>{signal.pattern}</span>
              </MetaRow>
              <MetaRow label="Producing Agent">
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, color: '#404040', fontWeight: 600,
                }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: 4,
                    background: `${agent.color}14`, color: agent.color,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name={agent.icon} size={12} /></span>
                  {agent.name}
                </span>
                <span style={{ color: '#a3a3a3' }}>·</span>
                <span style={{ fontSize: 12, color: '#737373' }}>{signal.strategy}</span>
              </MetaRow>
            </div>

            <Divider />

            {/* Summary */}
            <DrawerSection title="Summary">
              <p style={{ margin: 0, fontSize: 14, color: '#404040', lineHeight: 1.55 }}>{signal.body}</p>
            </DrawerSection>

            <Divider tight />

            {/* Why it matters */}
            <DrawerSection title="Why it matters">
              <p style={{ margin: 0, fontSize: 14, color: '#404040', lineHeight: 1.55 }}>{signal.whyMatters}</p>
            </DrawerSection>

            <Divider tight />

            {/* Linkage Reason */}
            <DrawerSection title="Linkage Reason">
              <p style={{ margin: 0, fontSize: 14, color: '#404040', lineHeight: 1.55 }}>{signal.linkage}</p>
            </DrawerSection>

            <Divider tight />

            {/* Evidence */}
            <DrawerSection title="Evidence">
              <p style={{ margin: 0, fontSize: 14, color: '#404040', lineHeight: 1.55 }}>{signal.evidenceText}</p>
              <div style={{ marginTop: 10 }}>
                <Button variant="link" trailingIcon="arrow-up-right" size="xs">View source</Button>
              </div>
            </DrawerSection>
          </div>

          <Divider />

          {/* Polaris Assist */}
          <div style={{ padding: '16px 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                width: 20, height: 20, borderRadius: 5,
                background: 'linear-gradient(135deg, #1570ef, #001030)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}><AssistStar size={12} /></span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#171717' }}>Query with Polaris Assist</span>
            </div>

            {assistResponse && (
              <div style={{
                background: '#fafafa', borderRadius: 8,
                padding: '12px 14px', marginBottom: 10,
                fontSize: 13, color: '#404040', lineHeight: 1.55,
                boxShadow: 'inset 0 0 0 1px #e5e5e5',
                whiteSpace: 'pre-wrap',
              }}>{assistResponse}</div>
            )}

            <div style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
              padding: 12,
            }}>
              <textarea
                value={assistInput}
                onChange={e => setAssistInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAssist(); } }}
                placeholder="Ask anything…"
                rows={2}
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  resize: 'none', background: 'transparent',
                  fontFamily: 'var(--font-sans)', fontSize: 14,
                  color: '#171717', lineHeight: 1.5,
                  minHeight: 36,
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <IconButton icon="help-circle" size={24} title="Suggestions" />
                  <IconButton icon="filter-lines" size={24} title="Context" />
                </div>
                <Button variant="primary" size="xs" onClick={askAssist} disabled={assistLoading || !assistInput.trim()}>
                  {assistLoading ? 'Thinking…' : 'Ask'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function MetaRow({ label, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      fontSize: 13, color: '#525252', lineHeight: '20px',
    }}>
      {label && <span style={{ color: '#737373', fontWeight: 600 }}>{label}:</span>}
      {children}
    </div>
  );
}

function DrawerSection({ title, children }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{
        fontSize: 13, fontWeight: 700, color: '#171717', marginBottom: 8,
      }}>{title}</div>
      {children}
    </div>
  );
}

function Divider({ tight }) {
  return (
    <div style={{ height: 1, background: '#f0f0f0', margin: tight ? '20px 0 0' : '24px 0 4px' }} />
  );
}

Object.assign(window, { SignalDrawer, MetaRow, DrawerSection, Divider });
