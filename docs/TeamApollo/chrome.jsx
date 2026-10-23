// Polaris chrome — Sidebar + TopBar + Floating Assist
// Matches /Intel-Hub/Global-View Figma frame.

function Sidebar({ currentRoute, onNavigate, collapsed }) {
  const { agents, entities, workspace, entityGroups } = window.POLARIS_DATA;
  const workspaceLabel = workspace?.label || 'ABM Intelligence Hub';
  const workspaceIcon = workspace?.icon || 'bar-chart-square-02';
  // entityGroups is optional: [{ id, label, icon, entityIds: [...] }]
  const groups = entityGroups || [{ id: 'all', label: 'Entities', icon: 'target-04', entityIds: entities.map(e => e.id) }];

  return (
    <aside style={{
      width: collapsed ? 72 : 280,
      minWidth: collapsed ? 72 : 280,
      transition: 'width .2s cubic-bezier(0.16, 1, 0.3, 1), min-width .2s',
      borderRight: '1px solid #e5e5e5', background: '#fff',
      display: 'flex', flexDirection: 'column', height: '100%',
      flex: 'none',
    }}>
      {/* logo header */}
      <div style={{
        height: 64, padding: '0 20px',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        flex: 'none',
      }}>
        {collapsed ? (
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: '#001030',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: '#fff' }}>P</span>
            <span style={{ color: '#FF8200' }}>.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800,
              fontSize: 17, color: '#001030', letterSpacing: '-0.02em',
            }}>POLARIS</span>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800,
              fontSize: 17, color: '#2868C0', letterSpacing: '-0.02em',
            }}>I/O</span>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: '#FF8200', marginLeft: 2,
            }} />
          </div>
        )}
        {!collapsed && <IconButton icon="search-lg" title="Quick switch (⌘K)" />}
      </div>

      {/* main scroll */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <SidebarSection label="Workspaces" collapsed={collapsed}>
          <SidebarItem
            icon={workspaceIcon}
            label={workspaceLabel}
            route="hub"
            currentRoute={currentRoute}
            onNavigate={onNavigate}
            collapsed={collapsed}
          />
        </SidebarSection>

        {groups.map(group => {
          const items = group.entityIds
            .map(id => entities.find(e => e.id === id))
            .filter(Boolean);
          const visible = items.slice(0, group.limit || 4);
          const hasMore = items.length > visible.length;
          return (
            <SidebarSection key={group.id} label={group.label} collapsed={collapsed}>
              {visible.map(e => (
                <SidebarItem
                  key={e.id}
                  icon={group.icon || 'target-04'}
                  label={e.name}
                  route={`entity-${e.id}`}
                  currentRoute={currentRoute}
                  onNavigate={onNavigate}
                  collapsed={collapsed}
                />
              ))}
              {!collapsed && hasMore && (
                <div onClick={() => onNavigate('entities-more')}
                  style={{ padding: '6px 8px 2px 12px', fontSize: 13, color: '#1570ef', fontWeight: 700, cursor: 'pointer' }}>
                  See more
                </div>
              )}
            </SidebarSection>
          );
        })}

        <SidebarSection label="Agents" collapsed={collapsed}>
          {agents.slice(0, 6).map(a => (
            <SidebarItem
              key={a.id}
              icon={a.icon}
              iconColor={a.color}
              label={a.name}
              route={`agent-${a.id}`}
              currentRoute={currentRoute}
              onNavigate={onNavigate}
              collapsed={collapsed}
            />
          ))}
          {!collapsed && (
            <div onClick={() => onNavigate('new-agent')}
              style={{ padding: '6px 8px 2px 12px', fontSize: 13, color: '#1570ef', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="plus" size={14} /> New Agent
            </div>
          )}
        </SidebarSection>
      </div>

      {/* footer */}
      <div style={{ padding: '8px 12px 12px', flex: 'none' }}>
        <SidebarItem icon="help-circle"  label="Help Center"            route="help"    currentRoute={currentRoute} onNavigate={onNavigate} collapsed={collapsed} />
        <SidebarItem icon="alert-circle" label="Resolution Center"      route="resolve" currentRoute={currentRoute} onNavigate={onNavigate} collapsed={collapsed} />

        <div style={{
          marginTop: 8, padding: '10px 8px',
          border: '1px solid #e5e5e5', borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar initials="AG" color="#1570ef" size={32} />
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#171717',
                  whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Allison Gibson</div>
                <div style={{ fontSize: 11, color: '#737373' }}>Workspace admin</div>
              </div>
              <IconButton icon="log-out-01" title="Sign out" size={28} />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarSection({ label, children, collapsed }) {
  return (
    <div style={{ padding: '8px 12px 4px' }}>
      {!collapsed && (
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
          textTransform: 'uppercase', color: '#737373',
          padding: '8px 8px 4px',
        }}>{label}</div>
      )}
      {collapsed && <div style={{ height: 8 }} />}
      {children}
    </div>
  );
}

function SidebarItem({ icon, iconColor, label, route, currentRoute, onNavigate, collapsed }) {
  const active = route === currentRoute;
  const [hover, setHover] = React.useState(false);

  return (
    <div
      onClick={() => onNavigate(route)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '8px' : '8px 8px',
        margin: '1px 0',
        borderRadius: 6, cursor: 'pointer',
        background: active ? '#d1e9ff' : (hover ? '#fafafa' : 'transparent'),
        color: active ? '#175cd3' : '#262626',
        fontSize: 14, fontWeight: active ? 700 : 600, lineHeight: '20px',
        transition: 'background .12s, color .12s',
        justifyContent: collapsed ? 'center' : 'flex-start',
        height: 38,
      }}
    >
      {iconColor ? (
        <span style={{
          width: 20, height: 20, borderRadius: 4,
          background: `${iconColor}14`, color: iconColor,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flex: 'none',
        }}><Icon name={icon} size={14} /></span>
      ) : (
        <Icon name={icon} size={20} tint={active ? 1 : 0.7} />
      )}
      {!collapsed && (
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      )}
    </div>
  );
}

function TopBar({ crumbs = [], onSidebarToggle, onAction, onCrumbClick }) {
  return (
    <header style={{
      height: 64, borderBottom: '1px solid #e5e5e5', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', flex: 'none',
    }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, minWidth: 0 }}>
        <IconButton icon="home-line" size={28} title="Home" onClick={onSidebarToggle} />
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <React.Fragment key={i}>
              <Icon name="chevron-right" size={14} tint={0.4} />
              <span
                onClick={isLast ? undefined : () => onCrumbClick && onCrumbClick(c, i)}
                onMouseEnter={isLast ? undefined : (e) => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#171717'; }}
                onMouseLeave={isLast ? undefined : (e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#525252'; }}
                style={{
                  color: isLast ? '#171717' : '#525252',
                  fontWeight: isLast ? 700 : 600,
                  padding: '4px 8px', borderRadius: 6,
                  background: isLast ? '#fafafa' : 'transparent',
                  whiteSpace: 'nowrap',
                  cursor: isLast ? 'default' : 'pointer',
                  transition: 'background .12s, color .12s',
                }}>{c}</span>
            </React.Fragment>
          );
        })}
      </nav>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <IconButton icon="bell-01" title="Notifications" />
        <Button variant="secondary" size="sm" leadingIcon="plus" onClick={() => onAction && onAction('new-agent')}>New Agent</Button>
      </div>
    </header>
  );
}

function FloatingAssist({ onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Ask Polaris Assist"
      style={{
        position: 'fixed', right: 28, bottom: 24, zIndex: 8,
        width: 48, height: 48, borderRadius: 24,
        background: 'linear-gradient(135deg, #1570ef, #001030)',
        border: 'none', color: '#fff', cursor: 'pointer',
        boxShadow: hover
          ? '0 12px 28px -8px rgba(21,112,239,0.45), 0 2px 6px rgba(0,0,0,0.18)'
          : '0 6px 16px -4px rgba(21,112,239,0.35), 0 2px 4px rgba(0,0,0,0.15)',
        transition: 'box-shadow .2s, transform .12s',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <AssistStar />
    </button>
  );
}

function AssistStar({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L13.8 8.4 L20.5 9.2 L15.4 13.4 L17.0 20 L12 16.3 L7.0 20 L8.6 13.4 L3.5 9.2 L10.2 8.4 Z"
        fill="#fff" />
      <circle cx="19" cy="5" r="1.2" fill="#fff" opacity="0.85" />
      <circle cx="5" cy="18" r="0.9" fill="#fff" opacity="0.7" />
    </svg>
  );
}

Object.assign(window, { Sidebar, TopBar, FloatingAssist, AssistStar });
