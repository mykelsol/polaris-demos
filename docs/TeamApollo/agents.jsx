// Polaris — Agents tab table, Patterns view, Overview view

function AgentsTable({ density }) {
  const { agents } = window.POLARIS_DATA;
  const [openMenu, setOpenMenu] = React.useState(null);
  const rowPad = density === 'compact' ? '10px 16px' : '14px 16px';

  return (
    <div style={{
      margin: '24px 32px 0',
      background: '#fff', borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
      overflow: 'visible',
    }}>
      <CardHeader
        title="Agents"
        subtitle={`${agents.length} agents · ${agents.filter(a => a.status === 'active').length} active · ${agents.filter(a => a.status === 'paused').length} paused`}
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
              {['Agent', 'Type', 'Shape', 'Entities', 'Signals', 'Patterns', 'Last run', 'Status'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 16px',
                  fontSize: 12, fontWeight: 700, color: '#525252', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
              <th style={{ width: 56, padding: '10px 16px' }}>
                <Checkbox />
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a, i) => {
              const isMenuOpen = openMenu === a.id;
              return (
                <tr key={a.id} style={{
                  borderBottom: i < agents.length - 1 ? '1px solid #f5f5f5' : 'none',
                  transition: 'background .12s',
                  background: isMenuOpen ? '#fafafa' : 'transparent',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => { if (!isMenuOpen) e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: rowPad }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: `${a.color}14`, color: a.color,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        flex: 'none',
                      }}><Icon name={a.icon} size={16} /></span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#171717', whiteSpace: 'nowrap' }}>{a.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: rowPad, fontSize: 13, color: '#525252', whiteSpace: 'nowrap' }}>{a.type}</td>
                  <td style={{ padding: rowPad, fontSize: 13, color: '#525252', whiteSpace: 'nowrap' }}>{a.shape}</td>
                  <td style={{ padding: rowPad, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#404040', fontVariantNumeric: 'tabular-nums' }}>{a.entities}</td>
                  <td style={{ padding: rowPad, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#404040', fontVariantNumeric: 'tabular-nums' }}>{a.signals}</td>
                  <td style={{ padding: rowPad, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#404040', fontVariantNumeric: 'tabular-nums' }}>{a.patterns}</td>
                  <td style={{ padding: rowPad, fontSize: 12, color: '#737373', whiteSpace: 'nowrap' }}>{a.lastRun}</td>
                  <td style={{ padding: rowPad }}>
                    {a.status === 'active' ? (
                      <Pill tone="success">Active</Pill>
                    ) : (
                      <Pill tone="neutral">Paused</Pill>
                    )}
                  </td>
                  <td style={{ padding: rowPad, position: 'relative' }} onClick={e => e.stopPropagation()}>
                    <IconButton
                      icon="dots-vertical"
                      onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                      active={isMenuOpen}
                    />
                    {isMenuOpen && <AgentActionMenu agent={a} onClose={() => setOpenMenu(null)} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination total={agents.length} />
    </div>
  );
}

function AgentActionMenu({ agent, onClose }) {
  const items = [
    { icon: 'trend-up-01',   label: 'Run now' },
    { icon: 'settings-01',   label: 'Configure' },
    { icon: 'arrow-up-right',label: 'Open in tab' },
    { divider: true },
    { icon: agent.status === 'active' ? 'bell-01' : 'check-circle',
      label: agent.status === 'active' ? 'Pause' : 'Resume' },
    { icon: 'x-close',       label: 'Archive', danger: true },
  ];
  return (
    <div style={{
      position: 'absolute', right: 16, top: 'calc(100% - 4px)',
      minWidth: 180,
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 12px 28px -8px rgba(16,24,40,0.18), 0 1px 2px 0 rgba(16,24,40,0.06), inset 0 0 0 1px #e5e5e5',
      padding: 6, zIndex: 30,
      animation: 'pol-menu .18s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {items.map((it, i) => it.divider ? (
        <div key={i} style={{ height: 1, background: '#f0f0f0', margin: '4px 4px' }} />
      ) : (
        <div key={i}
          onClick={onClose}
          style={{
            padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 13, fontWeight: 600,
            color: it.danger ? '#b91c1c' : '#404040',
          }}
          onMouseEnter={e => e.currentTarget.style.background = it.danger ? '#fef2f2' : '#fafafa'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Icon name={it.icon} size={16} tint={it.danger ? 1 : 0.7} />
          {it.label}
        </div>
      ))}
    </div>
  );
}

// ──────────────── Overview ────────────────
function OverviewView({ signals, agents, onPickSignal, onPickPattern, onJumpToTab }) {
  const total = signals.length;
  const high = signals.filter(s => s.strength === 'High').length;
  const unread = signals.filter(s => s.status === 'Unread').length;
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const topRecent = [...signals].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const { E, patterns } = window.POLARIS_DATA;

  // Top Patterns — Insight-Ready first, then by strength, capped to 3.
  const maturityRank = { 'Insight-Ready': 0, 'Developing': 1, 'Emerging': 2 };
  const strengthRank = { 'High': 0, 'Medium': 1, 'Low': 2 };
  const topPatterns = React.useMemo(() => (
    [...(patterns || [])]
      .sort((a, b) => (maturityRank[a.maturity] ?? 9) - (maturityRank[b.maturity] ?? 9)
                   || (strengthRank[a.strength] ?? 9) - (strengthRank[b.strength] ?? 9))
      .slice(0, 3)
  ), [patterns]);

  return (
    <div style={{ padding: '24px 32px 32px' }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Signals (30d)" value={total} delta="+12" live />
        <StatCard label="High strength" value={high} delta={`+${Math.floor(high*0.3)}`} />
        <StatCard label="Unread" value={unread} />
        <StatCard label="Active agents" value={`${activeAgents}/${agents.length}`} />
      </div>

      {/* Top Patterns — workspace-level */}
      <div style={{
        background: '#fff', borderRadius: 12,
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
        marginTop: 16,
      }}>
        <CardHeader
          title="Top Patterns"
          subtitle="Cross-signal narratives your agents are most confident about"
          action={<Button variant="link" trailingIcon="arrow-up-right" onClick={() => onJumpToTab('patterns')}>View all</Button>}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${topPatterns.length || 1}, minmax(0, 1fr))`,
          borderTop: '1px solid #f0f0f0',
        }}>
          {topPatterns.map((p, i) => (
            <OverviewPatternCard
              key={p.id}
              pattern={p}
              onOpen={() => onPickPattern && onPickPattern(p)}
              borderLeft={i > 0}
            />
          ))}
        </div>
      </div>

      {/* Two-column row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginTop: 16 }}>
        {/* Recent signals */}
        <div style={{
          background: '#fff', borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
        }}>
          <CardHeader
            title="Recent signals"
            subtitle="Latest activity from your agents"
            action={<Button variant="link" trailingIcon="arrow-up-right" onClick={() => onJumpToTab('signals')}>View all</Button>}
          />
          <div>
            {topRecent.map((s, i) => (
              <div key={s.id}
                onClick={() => onPickSignal(s)}
                style={{
                  padding: '14px 24px',
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  cursor: 'pointer',
                  transition: 'background .12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Strength level={s.strength} mode="badge" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#171717', lineHeight: 1.4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: '#737373', marginTop: 3 }}>
                    {E[s.entity]} · {s.date}
                  </div>
                </div>
                <Icon name="chevron-right" size={16} tint={0.4} style={{ marginTop: 4 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Agent activity */}
        <div style={{
          background: '#fff', borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
        }}>
          <CardHeader
            title="Agent activity"
            subtitle="Performance over the last 30 days"
            action={<Button variant="link" trailingIcon="arrow-up-right" onClick={() => onJumpToTab('agents')}>Manage</Button>}
          />
          <div>
            {agents.map((a, i) => {
              const max = Math.max(...agents.map(x => x.signals));
              const pct = (a.signals / max) * 100;
              return (
                <div key={a.id} style={{
                  padding: '14px 24px',
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: `${a.color}14`, color: a.color,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flex: 'none',
                  }}><Icon name={a.icon} size={14} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#171717', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#404040', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{a.signals}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: '#f5f5f5', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`, background: a.color,
                        borderRadius: 3, transition: 'width .4s',
                      }} />
                    </div>
                  </div>
                  {a.status === 'active'
                    ? <LivePulse size={6} color={a.color} />
                    : <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d4d4d4' }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, live }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
      padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#737373', letterSpacing: '.02em' }}>{label}</div>
        {live && <LivePulse size={6} color="#1570ef" />}
      </div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
      }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 600,
          color: '#171717', letterSpacing: '-0.02em', lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>{value}</span>
        {delta && <span style={{ fontSize: 12, color: '#15803d', fontWeight: 700 }}>{delta} ↑</span>}
      </div>
    </div>
  );
}

// ──────────────── Empty / Placeholder ────────────────
function PlaceholderScreen({ title, body, icon = 'help-circle' }) {
  return (
    <div style={{
      margin: '48px 32px', padding: '64px 32px',
      background: '#fafafa', borderRadius: 12,
      boxShadow: 'inset 0 0 0 1px #e5e5e5',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 24, background: '#fff',
        boxShadow: 'inset 0 0 0 1px #e5e5e5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#737373',
      }}><Icon name={icon} size={20} /></div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#171717' }}>{title}</div>
      <div style={{ fontSize: 14, color: '#525252', maxWidth: 460, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

// ──────────────── Toast ────────────────
function Toast({ msg, onDismiss }) {
  React.useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [msg, onDismiss]);
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: '#0c0e12', color: '#fff', padding: '10px 16px', borderRadius: 8,
      fontSize: 13, fontWeight: 600,
      boxShadow: '0 12px 28px -8px rgba(16,24,40,0.45)',
      zIndex: 50,
      display: 'flex', alignItems: 'center', gap: 8,
      animation: 'pol-menu .2s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <Icon name="check-circle" size={16} tint={0.9} style={{ filter: 'invert(1)' }} />
      {msg}
    </div>
  );
}

// ──────────────── Workspace-overview pattern card ────────────────
function OverviewPatternCard({ pattern, onOpen, borderLeft }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '18px 20px 20px',
        borderLeft: borderLeft ? '1px solid #f0f0f0' : 'none',
        cursor: 'pointer',
        background: hover ? '#fafafa' : 'transparent',
        transition: 'background .12s',
        display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <MaturityPill value={pattern.maturity} />
        <span style={{ fontSize: 12, color: '#737373', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {pattern.type}
        </span>
      </div>
      <div style={{
        fontSize: 15, fontWeight: 700, color: '#171717',
        lineHeight: 1.35, letterSpacing: '-0.005em',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{pattern.title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {(pattern.entitiesFull || pattern.entities || []).slice(0, 3).map(en => (
          <span key={en} style={{
            fontSize: 11, fontWeight: 700, color: '#404040',
            padding: '2px 8px', borderRadius: 9999,
            background: '#f5f5f5', border: '1px solid #e5e5e5',
            whiteSpace: 'nowrap',
          }}>{en}</span>
        ))}
      </div>
      <div style={{
        fontSize: 12, color: '#737373',
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
      }}>
        <span>{(pattern.supportingSignals?.length ?? 0)} signals</span>
        <span style={{ color: '#d4d4d4' }}>·</span>
        <span>{pattern.strength} strength</span>
        <span style={{ color: '#d4d4d4' }}>·</span>
        <span>Updated {pattern.updated}</span>
      </div>
    </div>
  );
}

Object.assign(window, { AgentsTable, OverviewView, OverviewPatternCard, PlaceholderScreen, StatCard, Toast });
