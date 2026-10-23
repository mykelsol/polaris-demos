// Apollo — chrome: Sidebar + TopBar
(function () {
const T = window.T;
const { Ic, Btn, IconBtn, Pill } = window;

const NAV = [
  { id: 'hub',      label: 'Command Hub',        icon: 'globe' },
  { id: 'operations',label: 'Operations',        icon: 'navigation' },
  { id: 'entities', label: 'Entities',           icon: 'crosshair' },
  { id: 'patterns', label: 'Patterns',           icon: 'layers' },
  { id: 'signals',  label: 'Signals',            icon: 'signal' },
  { id: 'insights', label: 'Analyst Reports',    icon: 'fileText' },
  { id: 'distribution', label: 'Distribution',   icon: 'send' },
  { id: 'agents',   label: 'Agents',             icon: 'cpu' },
  { id: 'strategy', label: 'Monitoring Strategy',icon: 'sliders' },
  { id: 'settings', label: 'Settings',           icon: 'settings' },
];

function Sidebar({ route, onNav, collapsed }) {
  const { operations, entities } = window.AP;
  const priority = entities.filter(e => ['ent-northridge', 'ent-pine', 'poi-orion', 'dev-d77'].includes(e.id));

  return (
    <aside style={{
      width: collapsed ? 72 : 256, minWidth: collapsed ? 72 : 256,
      transition: 'width .2s cubic-bezier(0.16,1,0.3,1), min-width .2s',
      borderRight: `1px solid ${T.bd}`, background: T.rail,
      display: 'flex', flexDirection: 'column', height: '100%', flex: 'none',
    }}>
      {/* logo */}
      <div style={{ height: 64, padding: collapsed ? '0' : '0 18px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', flex: 'none', borderBottom: `1px solid ${T.bd}` }}>
        {collapsed ? (
          <div style={{ width: 34, height: 34, borderRadius: 9, background: '#001030', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>
            P<span style={{ color: T.acc }}>.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: '#001030', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <Ic name="globe" size={19} color="#fff" />
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#001030', letterSpacing: '-0.02em' }}>POLARIS</span>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#2868C0', letterSpacing: '-0.02em' }}>I/O</span>
              </div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', color: T.text3, marginTop: 2 }}>COMMAND POST</div>
            </div>
          </div>
        )}
      </div>

      {/* nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
        {!collapsed && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.09em', color: T.text4, textTransform: 'uppercase', padding: '4px 8px 8px' }}>Command Post</div>}
        {NAV.map(n => { const active = route === n.id; return <NavItem key={n.id + (active ? '#on' : '')} item={n} active={active} collapsed={collapsed} onNav={onNav} />; })}

        {!collapsed && (
          <>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.09em', color: T.text4, textTransform: 'uppercase', padding: '16px 8px 8px' }}>Active Operations</div>
            {operations.map(op => { const active = route === `op:${op.id}`; return (
              <OpNavItem key={op.id + (active ? '#on' : '')} op={op} active={active} onNav={onNav} />
            ); })}

            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.09em', color: T.text4, textTransform: 'uppercase', padding: '16px 8px 8px' }}>Priority Entities</div>
            {priority.map(e => { const active = route === `entity:${e.id}`; return (
              <EntityNavItem key={e.id + (active ? '#on' : '')} entity={e} active={active} onNav={onNav} />
            ); })}
          </>
        )}
      </div>

      {/* user footer */}
      <div style={{ padding: '10px 12px 14px', flex: 'none', borderTop: `1px solid ${T.bd}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? 0 : '4px 4px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#1570ef', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flex: 'none' }}>RC</span>
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>R. Calder</div>
                <div style={{ fontSize: 11, color: T.text3 }}>Command Post Intel Lead</div>
              </div>
              <IconBtn name="logout" size={28} iconSize={16} title="Sign out" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function OpNavItem({ op, active, onNav }) {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={() => onNav(`op:${op.id}`)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 8px', borderRadius: 7, cursor: 'pointer',
        color: active ? T.accHi : T.text2, background: active ? '#d1e9ff' : (h ? '#fafafa' : 'transparent'),
        fontWeight: active ? 700 : 600, fontSize: 12.5, transition: 'background .12s, color .12s' }}>
      <span style={{ width: 20, height: 20, borderRadius: 5, background: `${op.color}16`, color: op.color, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ic name={op.icon} size={13} /></span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{op.tag}</span>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: op.color, flex: 'none' }} />
    </div>
  );
}

function NavItem({ item, active, collapsed, onNav }) {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={() => onNav(item.id)} title={collapsed ? item.label : undefined}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, height: 38, margin: '2px 0',
        padding: collapsed ? 0 : '0 9px', justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 7, cursor: 'pointer',
        background: active ? '#d1e9ff' : (h ? '#fafafa' : 'transparent'),
        color: active ? '#175cd3' : T.text2,
        fontWeight: active ? 700 : 600, fontSize: 13.5, transition: 'background .12s, color .12s',
      }}>
      <Ic name={item.icon} size={19} />
      {!collapsed && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
    </div>
  );
}

function EntityNavItem({ entity, active, onNav }) {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={() => onNav(`entity:${entity.id}`)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px', borderRadius: 7, cursor: 'pointer',
        color: active ? T.accHi : T.text2, background: active ? '#d1e9ff' : (h ? '#fafafa' : 'transparent'),
        fontWeight: active ? 700 : 600, fontSize: 13, transition: 'background .12s, color .12s' }}>
      <span style={{ width: 18, color: active ? T.accHi : T.text3, flex: 'none', display: 'inline-flex' }}><Ic name={entity.icon} size={15} /></span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entity.name}</span>
      <FreshDot score={entity.freshness} />
    </div>
  );
}

function FreshDot({ score }) {  const c = score >= 75 ? T.ready : (score >= 55 ? T.dev : T.risk);
  return <span title={`Freshness ${score}/100`} style={{ width: 7, height: 7, borderRadius: '50%', background: c, flex: 'none' }} />;
}

function TopBar({ onToggleSidebar, onRunAgents, onAssist, running }) {
  const { sync } = window.AP;
  return (
    <header style={{
      height: 64, borderBottom: `1px solid ${T.bd}`, background: '#fff',
      display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', flex: 'none',
    }}>
      <IconBtn name="home" size={32} title="Toggle navigation" onClick={onToggleSidebar} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.text, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>Command Post Intelligence Hub</span>
            <Pill tone="warn" size="xs" style={{ fontWeight: 700 }}>
              <Ic name="shield" size={11} /> Synthetic Demo
            </Pill>
          </div>
          <div style={{ fontSize: 11.5, color: T.text3, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.ready, display: 'inline-block' }} />
            2 operations · last sync <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: T.text2 }}>{sync}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 12 }} />

      {/* search */}
      <div style={{ flex: '0 1 240px', minWidth: 0, height: 38, borderRadius: 9, background: '#fafafa', boxShadow: `inset 0 0 0 1px ${T.bd}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
        <Ic name="search" size={16} color={T.text3} />
        <input placeholder="Search…" style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: T.font, fontSize: 13, color: T.text }} />
      </div>

      <Btn variant="secondary" size="sm" icon={running ? 'refresh' : 'play'} onClick={onRunAgents} style={{ flex: 'none' }}>
        {running ? 'Running…' : 'Run Agents'}
      </Btn>
      <Btn variant="primary" size="sm" icon="sparkles" onClick={onAssist} style={{ flex: 'none' }}>Polaris Assist</Btn>
      <IconBtn name="bell" size={36} iconSize={19} title="Alerts" />
    </header>
  );
}

window.Sidebar = Sidebar;
window.TopBar = TopBar;
window.NAV = NAV;
window.FreshDot = FreshDot;
})();
