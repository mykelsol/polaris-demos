/* @ds-bundle: {"format":3,"namespace":"PolarisIODesignSystem_43c1d9","components":[],"sourceHashes":{"ui_kits/admin/app.jsx":"474652a5ca80","ui_kits/admin/chrome.jsx":"5a3a58ebaa15","ui_kits/admin/data.js":"346c9d8a5a87","ui_kits/admin/screens.jsx":"6c0bd8caa78d","ui_kits/web-app/app.jsx":"4648cffcf9e7","ui_kits/web-app/chrome.jsx":"cd58e998b85e","ui_kits/web-app/data.js":"5c8907ae0e39","ui_kits/web-app/primitives.jsx":"39fafc2c8211","ui_kits/web-app/screens.jsx":"84fb6e189df1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PolarisIODesignSystem_43c1d9 = window.PolarisIODesignSystem_43c1d9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/admin/app.jsx
try { (() => {
// Polaris Admin app
function AdminApp() {
  const [section, setSection] = useState('members');
  const titles = {
    general: ['General'],
    members: ['Members & roles'],
    agents: ['Agent control'],
    audit: ['Audit log'],
    billing: ['Plan & billing'],
    api: ['API & webhooks'],
    export: ['Data export']
  };
  const crumbs = ['Workspace', ...(titles[section] || [section])];
  let body;
  if (section === 'general') body = /*#__PURE__*/React.createElement(GeneralScreen, null);else if (section === 'members') body = /*#__PURE__*/React.createElement(MembersScreen, null);else if (section === 'agents') body = /*#__PURE__*/React.createElement(AgentsScreen, null);else if (section === 'audit') body = /*#__PURE__*/React.createElement(AuditScreen, null);else if (section === 'billing') body = /*#__PURE__*/React.createElement(PlaceholderScreen, {
    title: "Plan & billing",
    body: "Stripe-backed billing UI; not built out in this kit. Shows the chrome and navigation system."
  });else if (section === 'api') body = /*#__PURE__*/React.createElement(PlaceholderScreen, {
    title: "API & webhooks",
    body: "OAuth apps, signing secrets, webhook destinations live here."
  });else if (section === 'export') body = /*#__PURE__*/React.createElement(PlaceholderScreen, {
    title: "Data export",
    body: "Schedule one-time and recurring CSV / Parquet exports of signals, entities, and audit events."
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      background: '#fafafa'
    }
  }, /*#__PURE__*/React.createElement(AdminSidebar, {
    section: section,
    onSection: setSection
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement(AdminTopBar, {
    crumbs: crumbs
  }), body));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(AdminApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/chrome.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Polaris Admin — chrome + screens (single file; primitives are reused)
// Loaded after primitives.jsx which is symlinked-by-include from the web-app kit.

const {
  useState
} = React;

// ──────────────── AdminSidebar ────────────────
function AdminSidebar({
  section,
  onSection
}) {
  const groups = [{
    label: 'Workspace',
    items: [{
      id: 'general',
      icon: 'settings-01',
      label: 'General'
    }, {
      id: 'members',
      icon: 'users-01',
      label: 'Members & roles'
    }, {
      id: 'agents',
      icon: 'shield-tick',
      label: 'Agent control'
    }, {
      id: 'audit',
      icon: 'bell-01',
      label: 'Audit log'
    }]
  }, {
    label: 'Account',
    items: [{
      id: 'billing',
      icon: 'arrow-up-right',
      label: 'Plan & billing'
    }, {
      id: 'api',
      icon: 'globe-02',
      label: 'API & webhooks'
    }, {
      id: 'export',
      icon: 'log-out-01',
      label: 'Data export'
    }]
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 268,
      minWidth: 268,
      borderRight: '1px solid #e5e5e5',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-lockup.svg",
    alt: "Polaris I/O",
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      padding: '2px 8px',
      borderRadius: 9999,
      background: '#d1e9ff',
      color: '#1570ef',
      fontSize: 11,
      fontWeight: 700
    }
  }, "ADMIN")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 12px 16px'
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.label,
    style: {
      padding: '8px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: '#737373',
      padding: '6px 6px 4px'
    }
  }, g.label), g.items.map(it => {
    const on = it.id === section;
    return /*#__PURE__*/React.createElement("div", {
      key: it.id,
      onClick: () => onSection(it.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px',
        borderRadius: 6,
        cursor: 'pointer',
        background: on ? '#fafafa' : 'transparent',
        color: on ? '#171717' : '#262626',
        fontSize: 14,
        fontWeight: 700,
        lineHeight: '20px',
        transition: 'background .12s'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = '#f5f5f5';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 20
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, it.label));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 20px',
      borderTop: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: "AG"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#171717'
    }
  }, "Allison Gibson"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#737373'
    }
  }, "polaris.io / acme"))));
}

// ──────────────── AdminTopBar ────────────────
function AdminTopBar({
  crumbs
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 64,
      borderBottom: '1px solid #e5e5e5',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings-01",
    size: 18,
    tint: 0.6
  }), crumbs.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    tint: 0.45
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: i === crumbs.length - 1 ? '#171717' : '#525252',
      fontWeight: i === crumbs.length - 1 ? 600 : 500
    }
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#737373'
    }
  }, "polaris.io / acme"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    leadingIcon: "arrow-up-right"
  }, "View Hub")));
}

// ──────────────── AdminPageHeader ────────────────
function AdminPageHeader({
  title,
  sub,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 32px 8px',
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 24,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700,
      color: '#171717',
      letterSpacing: '-0.01em'
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#737373',
      marginTop: 6,
      maxWidth: 680,
      lineHeight: 1.5
    }
  }, sub)), action);
}

// ──────────────── Field / Form primitives ────────────────
function Field({
  label,
  hint,
  children,
  required
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: '#404040'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#1570ef',
      marginLeft: 2
    }
  }, "*")), children, hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#737373'
    }
  }, hint));
}
function TextInput({
  value,
  onChange,
  placeholder,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    placeholder: placeholder,
    style: {
      height: 40,
      padding: '0 12px',
      borderRadius: 8,
      border: '1px solid #d4d4d4',
      background: '#fff',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 14,
      color: '#171717',
      outline: 'none',
      width: '100%'
    }
  }, rest));
}
function Toggle({
  on,
  onChange,
  label,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange && onChange(!on),
    style: {
      width: 36,
      height: 20,
      borderRadius: 9999,
      background: on ? '#1570ef' : '#d4d4d4',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background .15s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: on ? 18 : 2,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: '#fff',
      transition: 'left .15s',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.15)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: '#171717'
    }
  }, label), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#737373',
      marginTop: 2
    }
  }, sub)));
}

// ──────────────── Card wrapper for sections ────────────────
function PanelCard({
  title,
  sub,
  children,
  action
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      overflow: 'hidden'
    }
  }, title && /*#__PURE__*/React.createElement("header", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: '#171717'
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#737373',
      marginTop: 2
    }
  }, sub)), action), /*#__PURE__*/React.createElement("div", null, children));
}
Object.assign(window, {
  AdminSidebar,
  AdminTopBar,
  AdminPageHeader,
  Field,
  TextInput,
  Toggle,
  PanelCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/data.js
try { (() => {
// Polaris Admin — fake data
window.POLARIS_ADMIN_DATA = (() => {
  const members = [{
    id: 'u1',
    name: 'Allison Gibson',
    email: 'allison@polaris.io',
    role: 'Workspace admin',
    status: 'active',
    lastSeen: '5m ago',
    initials: 'AG',
    color: '#1570ef'
  }, {
    id: 'u2',
    name: 'Mateo Hernández',
    email: 'mateo@polaris.io',
    role: 'Analyst',
    status: 'active',
    lastSeen: '1h ago',
    initials: 'MH',
    color: '#15803d'
  }, {
    id: 'u3',
    name: 'Priya Raghunath',
    email: 'priya@polaris.io',
    role: 'Analyst',
    status: 'active',
    lastSeen: '2h ago',
    initials: 'PR',
    color: '#b45309'
  }, {
    id: 'u4',
    name: 'Daniel Okonkwo',
    email: 'daniel@polaris.io',
    role: 'Viewer',
    status: 'invited',
    lastSeen: '—',
    initials: 'DO',
    color: '#525252'
  }, {
    id: 'u5',
    name: 'Sofia Lindqvist',
    email: 'sofia@polaris.io',
    role: 'Workspace admin',
    status: 'active',
    lastSeen: 'Mar 4',
    initials: 'SL',
    color: '#dc2626'
  }, {
    id: 'u6',
    name: 'Tomas Berg',
    email: 'tomas@polaris.io',
    role: 'Analyst',
    status: 'suspended',
    lastSeen: 'Feb 28',
    initials: 'TB',
    color: '#737373'
  }];
  const agents = [{
    id: 'growth',
    name: 'Growth Monitor',
    status: 'active',
    schedule: 'Every 4 hours',
    lastRun: '12m ago',
    owner: 'AG',
    signals30d: 18,
    version: 'v3.2'
  }, {
    id: 'risk',
    name: 'Risk Monitor',
    status: 'active',
    schedule: 'Hourly',
    lastRun: '38m ago',
    owner: 'SL',
    signals30d: 6,
    version: 'v2.8'
  }, {
    id: 'market',
    name: 'Market Monitor',
    status: 'active',
    schedule: 'Daily 9am UTC',
    lastRun: '2h ago',
    owner: 'MH',
    signals30d: 12,
    version: 'v3.0'
  }, {
    id: 'operational',
    name: 'Operational Monitor',
    status: 'paused',
    schedule: 'Every 12 hours',
    lastRun: 'Mar 2',
    owner: 'PR',
    signals30d: 11,
    version: 'v2.4'
  }];
  const audit = [{
    id: 'a1',
    who: 'Allison Gibson',
    what: 'Updated workspace name',
    target: 'Polaris I/O · ACME workspace',
    at: '12m ago'
  }, {
    id: 'a2',
    who: 'System',
    what: 'Ran scheduled agent',
    target: 'Growth Monitor',
    at: '38m ago'
  }, {
    id: 'a3',
    who: 'Mateo Hernández',
    what: 'Invited',
    target: 'daniel@polaris.io',
    at: '2h ago'
  }, {
    id: 'a4',
    who: 'Sofia Lindqvist',
    what: 'Paused agent',
    target: 'Operational Monitor',
    at: 'Mar 4'
  }, {
    id: 'a5',
    who: 'System',
    what: 'Detected new entity',
    target: 'Faden Hospital Group',
    at: 'Mar 2'
  }, {
    id: 'a6',
    who: 'Priya Raghunath',
    what: 'Changed role',
    target: 'Tomas Berg → Analyst',
    at: 'Feb 28'
  }];
  return {
    members,
    agents,
    audit
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/data.js", error: String((e && e.message) || e) }); }

// ui_kits/admin/screens.jsx
try { (() => {
// Polaris Admin — screens (General, Members, Agents, Audit, Billing/API/Export placeholders)

function GeneralScreen() {
  const [name, setName] = useState('Polaris I/O — ACME');
  const [slug, setSlug] = useState('polaris-acme');
  const [region, setRegion] = useState('US-East (Virginia)');
  const [emailSig, setEmailSig] = useState(true);
  const [slackInt, setSlackInt] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AdminPageHeader, {
    title: "General",
    sub: "Workspace-level settings. Changes here affect every member of this workspace.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "primary"
    }, "Save changes")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 32px 48px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      maxWidth: 900
    }
  }, /*#__PURE__*/React.createElement(PanelCard, {
    title: "Workspace identity"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Workspace name",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: name,
    onChange: setName
  })), /*#__PURE__*/React.createElement(Field, {
    label: "URL slug",
    hint: "polaris.io/w/{slug}"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: slug,
    onChange: setSlug
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Data residency",
    hint: "Where signals and entity records are stored."
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: region,
    onChange: setRegion
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Default lens"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: "Growth"
  })))), /*#__PURE__*/React.createElement(PanelCard, {
    title: "Notifications"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 20px 12px'
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: emailSig,
    onChange: setEmailSig,
    label: "Email \u2014 high-strength signals",
    sub: "Send a digest to all workspace admins when a High signal is detected."
  }), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 'none',
      borderTop: '1px solid #e5e5e5',
      margin: 0
    }
  }), /*#__PURE__*/React.createElement(Toggle, {
    on: slackInt,
    onChange: setSlackInt,
    label: "Slack \u2014 #polaris-intel",
    sub: "Post into #polaris-intel for any signal above 0.85 confidence."
  }), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 'none',
      borderTop: '1px solid #e5e5e5',
      margin: 0
    }
  }), /*#__PURE__*/React.createElement(Toggle, {
    on: smsAlerts,
    onChange: setSmsAlerts,
    label: "SMS \u2014 critical risk only",
    sub: "Page workspace admins for Risk lens \xB7 High strength \xB7 top decile confidence."
  }))), /*#__PURE__*/React.createElement(PanelCard, {
    title: "Danger zone",
    sub: "Irreversible actions affecting this workspace."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: '#171717'
    }
  }, "Archive workspace"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#737373',
      marginTop: 2
    }
  }, "Members lose access; data is retained for 90 days, then deleted.")), /*#__PURE__*/React.createElement(Button, {
    variant: "destructive"
  }, "Archive\u2026")))));
}
function MembersScreen() {
  const {
    members
  } = window.POLARIS_ADMIN_DATA;
  const [q, setQ] = useState('');
  const filtered = members.filter(m => !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.email.toLowerCase().includes(q.toLowerCase()));
  const statusTone = s => s === 'active' ? 'success' : s === 'invited' ? 'info' : 'error';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AdminPageHeader, {
    title: "Members & roles",
    sub: "Invite teammates, change roles, suspend users. Workspace admins can do everything; analysts can run agents; viewers can read only.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      leadingIcon: "plus"
    }, "Invite member")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 32px 48px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 380,
      height: 38,
      borderRadius: 8,
      background: '#fff',
      border: '1px solid #d4d4d4',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 12px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search-lg",
    size: 16,
    tint: 0.55
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search by name or email\u2026",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: 14,
      color: '#171717',
      fontFamily: 'Plus Jakarta Sans, sans-serif'
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    leadingIcon: "filter-lines"
  }, "Filters"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 12,
      color: '#737373'
    }
  }, filtered.length, " of ", members.length, " members")), /*#__PURE__*/React.createElement(PanelCard, null, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: '#fafafa',
      borderBottom: '1px solid #e5e5e5'
    }
  }, ['Name', 'Role', 'Status', 'Last seen', ''].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: 'left',
      padding: '10px 18px',
      fontSize: 12,
      fontWeight: 700,
      color: '#0c0e12'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, filtered.map((m, i) => /*#__PURE__*/React.createElement("tr", {
    key: m.id,
    style: {
      borderBottom: i < filtered.length - 1 ? '1px solid #e5e5e5' : 'none'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: m.initials,
    color: m.color,
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#171717',
      whiteSpace: 'nowrap'
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#737373',
      whiteSpace: 'nowrap'
    }
  }, m.email)))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px',
      fontSize: 13,
      color: '#404040'
    }
  }, m.role), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px'
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: statusTone(m.status)
  }, m.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 12,
      color: '#737373'
    }
  }, m.lastSeen), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "dots-vertical"
  })))))))));
}
function AgentsScreen() {
  const {
    agents
  } = window.POLARIS_ADMIN_DATA;
  const statusTone = s => s === 'active' ? 'success' : 'neutral';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AdminPageHeader, {
    title: "Agent control",
    sub: "Monitor agent health, change schedules, pause or roll back. Agents inherit the workspace's data residency.",
    action: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      leadingIcon: "settings-01"
    }, "Run policies"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      leadingIcon: "plus"
    }, "New agent"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 32px 48px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(PanelCard, null, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: '#fafafa',
      borderBottom: '1px solid #e5e5e5'
    }
  }, ['Agent', 'Status', 'Schedule', 'Last run', 'Owner', 'Signals (30d)', 'Version', ''].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: h === 'Signals (30d)' ? 'right' : 'left',
      padding: '10px 18px',
      fontSize: 12,
      fontWeight: 700,
      color: '#0c0e12'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, agents.map((a, i) => /*#__PURE__*/React.createElement("tr", {
    key: a.id,
    style: {
      borderBottom: i < agents.length - 1 ? '1px solid #e5e5e5' : 'none'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px',
      fontSize: 13,
      fontWeight: 700,
      color: '#171717'
    }
  }, a.name), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px'
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: statusTone(a.status)
  }, a.status)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px',
      fontSize: 13,
      color: '#404040'
    }
  }, a.schedule), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 12,
      color: '#737373'
    }
  }, a.lastRun), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: a.owner,
    size: 24,
    color: "#525252"
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 13,
      color: '#171717',
      textAlign: 'right',
      fontWeight: 600
    }
  }, a.signals30d), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 12,
      color: '#737373'
    }
  }, a.version), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 18px',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "dots-vertical"
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(MetricCard, {
    label: "Total runs (30d)",
    value: "412",
    delta: "+38"
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Avg. confidence",
    value: "0.81"
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Failed runs (30d)",
    value: "3"
  }))));
}
function AuditScreen() {
  const {
    audit
  } = window.POLARIS_ADMIN_DATA;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AdminPageHeader, {
    title: "Audit log",
    sub: "Every workspace and agent action, 365 days retained. Exportable as CSV or shipped to your SIEM via webhook.",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      leadingIcon: "arrow-up-right"
    }, "Export CSV")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 32px 48px'
    }
  }, /*#__PURE__*/React.createElement(PanelCard, null, /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  }, audit.map((a, i) => /*#__PURE__*/React.createElement("li", {
    key: a.id,
    style: {
      padding: '14px 20px',
      borderBottom: i < audit.length - 1 ? '1px solid #e5e5e5' : 'none',
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 2,
      width: 32,
      height: 32,
      borderRadius: 8,
      background: '#f5f5f5',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell-01",
    size: 16,
    tint: 0.55
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#171717'
    }
  }, /*#__PURE__*/React.createElement("b", null, a.who), " \xA0", a.what, "\xA0 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#525252'
    }
  }, a.target)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 11,
      color: '#737373',
      marginTop: 3
    }
  }, a.at)), /*#__PURE__*/React.createElement(IconButton, {
    icon: "dots-vertical"
  })))))));
}
function PlaceholderScreen({
  title,
  body
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AdminPageHeader, {
    title: title,
    sub: "This surface lives in the kit as a chrome demonstration."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 32px 48px'
    }
  }, /*#__PURE__*/React.createElement(EmptyStateAdmin, {
    title: title,
    body: body
  })));
}
function EmptyStateAdmin({
  title,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 32px',
      background: '#fafafa',
      border: '1px dashed #d4d4d4',
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 24,
      background: '#fff',
      border: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings-01",
    size: 20,
    tint: 0.6
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: '#171717'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#525252',
      maxWidth: 420,
      lineHeight: 1.5
    }
  }, body));
}
Object.assign(window, {
  GeneralScreen,
  MembersScreen,
  AgentsScreen,
  AuditScreen,
  PlaceholderScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/app.jsx
try { (() => {
// Polaris Intel Hub — main app
const {
  useState,
  useMemo
} = React;
function App() {
  const [route, setRoute] = useState('hub');
  const [tab, setTab] = useState('signals');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('table');
  const [picked, setPicked] = useState(null);
  const {
    signals,
    agents
  } = window.POLARIS_DATA;
  const filtered = useMemo(() => {
    if (!query.trim()) return signals;
    const q = query.toLowerCase();
    return signals.filter(s => s.title.toLowerCase().includes(q) || s.entity.toLowerCase().includes(q) || s.lens.toLowerCase().includes(q));
  }, [query, signals]);
  const crumbs = useMemo(() => {
    if (route === 'hub') return ['Workspaces', 'ABM Intelligence Hub'];
    if (route.startsWith('agent-')) {
      const a = agents.find(x => x.id === route.replace('agent-', ''));
      return ['Agents', a ? a.name : 'Agent'];
    }
    if (route.startsWith('entity-')) return ['Entities', 'Detail'];
    if (route === 'help') return ['Help center'];
    if (route === 'settings') return ['Resolution center'];
    if (route === 'new-agent') return ['Agents', 'New agent'];
    return ['Workspaces'];
  }, [route, agents]);
  const filters = [{
    label: 'Status'
  }, {
    label: 'Strength'
  }, {
    label: 'Confidence'
  }, {
    label: 'Lens'
  }, {
    label: 'Entity'
  }, {
    label: 'Agent'
  }, {
    label: 'Date range'
  }];
  const handleNav = r => {
    setRoute(r);
    setPicked(null);
    if (r === 'hub') setTab('signals');
  };

  // ────── route renderer
  let body;
  if (route === 'hub') {
    body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
      title: "ABM Intelligence Hub",
      sub: "Surface high-signal opportunities across your accounts in near-real time.",
      tabs: [{
        id: 'overview',
        label: 'Overview',
        count: 4
      }, {
        id: 'signals',
        label: 'Signals',
        count: filtered.length
      }, {
        id: 'patterns',
        label: 'Patterns',
        count: 9
      }, {
        id: 'agents',
        label: 'Agents',
        count: agents.length
      }],
      activeTab: tab,
      onTab: setTab
    }), tab === 'signals' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FilterBar, {
      query: query,
      onQuery: setQuery,
      view: view,
      onView: setView,
      filters: filters,
      onClearAll: () => setQuery('')
    }), filtered.length > 0 ? /*#__PURE__*/React.createElement(SignalsTable, {
      signals: filtered,
      onPick: setPicked
    }) : /*#__PURE__*/React.createElement(EmptyState, {
      title: "No signals match these filters",
      body: "Loosen the strength or date range, or reset to defaults.",
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        onClick: () => setQuery('')
      }, "Clear search")
    })), tab === 'overview' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: 16,
        margin: '24px 32px'
      }
    }, /*#__PURE__*/React.createElement(MetricCard, {
      label: "Signals last 30 days",
      value: signals.length,
      delta: "+12",
      live: true
    }), /*#__PURE__*/React.createElement(MetricCard, {
      label: "High strength",
      value: signals.filter(s => s.strength === 'High').length,
      delta: "+3"
    }), /*#__PURE__*/React.createElement(MetricCard, {
      label: "Avg. confidence",
      value: (signals.reduce((a, b) => a + b.score, 0) / signals.length).toFixed(2)
    }), /*#__PURE__*/React.createElement(MetricCard, {
      label: "Active agents",
      value: agents.filter(a => a.status === 'active').length
    })), tab === 'patterns' && /*#__PURE__*/React.createElement(EmptyState, {
      title: "No saved patterns yet",
      body: "Patterns are recurring signal clusters across entities. Pin frequent signals to surface them as patterns."
    }), tab === 'agents' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        margin: '24px 32px'
      }
    }, agents.map(a => /*#__PURE__*/React.createElement("div", {
      key: a.id,
      onClick: () => handleNav(`agent-${a.id}`),
      style: {
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: 12,
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'border-color .12s',
        display: 'flex',
        gap: 14,
        alignItems: 'center'
      },
      onMouseEnter: e => e.currentTarget.style.borderColor = '#a3a3a3',
      onMouseLeave: e => e.currentTarget.style.borderColor = '#e5e5e5'
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 10,
        background: `${a.color}14`,
        color: a.color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.icon.replace('.svg', ''),
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 15,
        color: '#171717'
      }
    }, a.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#737373',
        marginTop: 2
      }
    }, a.signals, " signals \xB7 ", a.status === 'active' ? 'Running' : 'Paused')), /*#__PURE__*/React.createElement(Pill, {
      tone: a.status === 'active' ? 'success' : 'neutral'
    }, a.status)))));
  } else if (route.startsWith('agent-')) {
    const agent = agents.find(a => a.id === route.replace('agent-', ''));
    body = /*#__PURE__*/React.createElement(AgentScreen, {
      agent: agent,
      onPick: setPicked
    });
  } else if (route === 'new-agent') {
    body = /*#__PURE__*/React.createElement(EmptyState, {
      title: "Configure a new agent",
      body: "Agents continuously monitor your entities for signals across growth, risk, market and operational lenses.",
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "primary"
      }, "Start configuration")
    });
  } else if (route === 'help') {
    body = /*#__PURE__*/React.createElement(EmptyState, {
      title: "Help center",
      body: "Documentation, API references, and the Polaris glossary live here.",
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        trailingIcon: "arrow-up-right"
      }, "Open docs")
    });
  } else {
    body = /*#__PURE__*/React.createElement(EmptyState, {
      title: crumbs[crumbs.length - 1],
      body: "This surface is a placeholder in the UI kit. It demonstrates the chrome / navigation system without front-loading the entire product."
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      background: '#fff',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    currentRoute: route,
    onNavigate: handleNav
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    crumbs: crumbs,
    onAction: handleNav
  }), body), /*#__PURE__*/React.createElement(SignalDrawer, {
    signal: picked,
    onClose: () => setPicked(null)
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/chrome.jsx
try { (() => {
// Polaris chrome — Sidebar + TopBar
// These wrap everything; pages live in <Main>.

function Sidebar({
  currentRoute,
  onNavigate
}) {
  const {
    agents,
    entities
  } = window.POLARIS_DATA;
  const Section = ({
    label,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: '8px 12px 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: '#737373',
      padding: '6px 6px 4px'
    }
  }, label), children);
  const Item = ({
    icon,
    label,
    count,
    route,
    color,
    dot
  }) => {
    const active = route === currentRoute;
    return /*#__PURE__*/React.createElement("div", {
      onClick: () => onNavigate(route),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 8px',
        borderRadius: 6,
        cursor: 'pointer',
        background: active ? '#fafafa' : 'transparent',
        color: active ? '#171717' : '#262626',
        fontSize: 14,
        fontWeight: 700,
        lineHeight: '20px',
        transition: 'background .12s'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = '#f5f5f5';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }
    }, dot && /*#__PURE__*/React.createElement(LivePulse, {
      size: 8,
      color: color || '#1570ef'
    }), icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 20,
      tint: active ? 1 : 0.7
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, label), count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '1px 7px',
        borderRadius: 9999,
        background: active ? '#d1e9ff' : '#f5f5f5',
        color: active ? '#1570ef' : '#525252',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: 11,
        fontWeight: 700
      }
    }, count));
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 268,
      minWidth: 268,
      borderRight: '1px solid #e5e5e5',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-lockup.svg",
    alt: "Polaris I/O",
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "search-lg",
    title: "Quick switch (\u2318K)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Section, {
    label: "Workspaces"
  }, /*#__PURE__*/React.createElement(Item, {
    icon: "bar-chart-square-02",
    label: "ABM Intelligence",
    count: 47,
    route: "hub"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "globe-02",
    label: "Market Watch",
    count: 12,
    route: "market"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "users-01",
    label: "Account Pulse",
    count: 8,
    route: "accounts"
  })), /*#__PURE__*/React.createElement(Section, {
    label: "Entities"
  }, entities.map(e => /*#__PURE__*/React.createElement(Item, {
    key: e.id,
    icon: "target-04",
    label: e.name,
    count: e.signals,
    route: `entity-${e.id}`
  })), /*#__PURE__*/React.createElement("div", {
    onClick: () => {},
    style: {
      padding: '6px 8px',
      fontSize: 13,
      color: '#1570ef',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "See more\u2026")), /*#__PURE__*/React.createElement(Section, {
    label: "Agents"
  }, agents.map(a => /*#__PURE__*/React.createElement(Item, {
    key: a.id,
    label: a.name,
    count: a.signals,
    route: `agent-${a.id}`,
    color: a.color,
    dot: true
  })), /*#__PURE__*/React.createElement("div", {
    onClick: () => onNavigate('new-agent'),
    style: {
      padding: '6px 8px',
      fontSize: 13,
      color: '#1570ef',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }), " New agent"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px 16px',
      borderTop: '1px solid #e5e5e5'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 0 8px'
    }
  }, /*#__PURE__*/React.createElement(Item, {
    icon: "help-circle",
    label: "Help center",
    route: "help"
  }), /*#__PURE__*/React.createElement(Item, {
    icon: "settings-01",
    label: "Resolution center",
    route: "settings"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 8px',
      borderTop: '1px solid #e5e5e5'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: "AG"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#171717',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
  }, "Allison Gibson"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#737373'
    }
  }, "Workspace admin")), /*#__PURE__*/React.createElement(IconButton, {
    icon: "log-out-01",
    title: "Sign out"
  }))));
}
function TopBar({
  crumbs = [],
  onAction
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 64,
      borderBottom: '1px solid #e5e5e5',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "home-line",
    size: 18,
    tint: 0.55
  }), crumbs.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    tint: 0.4
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: i === crumbs.length - 1 ? '#171717' : '#525252',
      fontWeight: i === crumbs.length - 1 ? 600 : 500
    }
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell-01",
    title: "Notifications"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    leadingIcon: "plus",
    onClick: () => onAction && onAction('new-agent')
  }, "New agent")));
}
Object.assign(window, {
  Sidebar,
  TopBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/data.js
try { (() => {
// Polaris Intel Hub — fake data
// All values are made up for the click-through prototype.

window.POLARIS_DATA = (() => {
  const agents = [{
    id: 'growth',
    name: 'Growth Monitor',
    icon: 'trend-up-01.svg',
    color: '#1570ef',
    signals: 18,
    status: 'active'
  }, {
    id: 'risk',
    name: 'Risk Monitor',
    icon: 'shield-tick.svg',
    color: '#dc2626',
    signals: 6,
    status: 'active'
  }, {
    id: 'market',
    name: 'Market Monitor',
    icon: 'target-04.svg',
    color: '#b45309',
    signals: 12,
    status: 'active'
  }, {
    id: 'operational',
    name: 'Operational Monitor',
    icon: 'bar-chart-square-02.svg',
    color: '#15803d',
    signals: 11,
    status: 'paused'
  }];
  const entities = [{
    id: 'shoreline',
    name: 'Shoreline Health',
    lens: 'Healthcare',
    signals: 9
  }, {
    id: 'northrose',
    name: 'Northrose Health',
    lens: 'Healthcare',
    signals: 14
  }, {
    id: 'hcf',
    name: 'Healthcare Facilities',
    lens: 'Operational',
    signals: 22
  }, {
    id: 'sports',
    name: 'Sports & Entertainment',
    lens: 'Growth',
    signals: 7
  }, {
    id: 'acme',
    name: 'Acme Manufacturing',
    lens: 'Growth',
    signals: 11
  }];
  const signals = [{
    id: 's-001',
    title: 'Manufacturing expansion may unlock high-margin opportunity',
    body: 'Acme Mfg. announced a $180M facility build-out in Ohio. Long-term sourcing arrangements typically follow within 60 days, creating a window for premium-tier service contracts.',
    entity: 'Acme Manufacturing',
    strength: 'High',
    confidence: 'High',
    lens: 'Growth',
    agent: 'growth',
    detected: '12m ago',
    evidence: 4,
    score: 0.92,
    trend: 'up'
  }, {
    id: 's-002',
    title: 'Mid-market sales pipeline restructuring detected',
    body: 'Three reorgs in 90 days, plus two new VP Sales hires from Snowflake and Gong. Indicates a shift to a hybrid enterprise-PLG motion within Q3.',
    entity: 'Boomerand',
    strength: 'High',
    confidence: 'High',
    lens: 'Growth',
    agent: 'growth',
    detected: '38m ago',
    evidence: 6,
    score: 0.88,
    trend: 'up'
  }, {
    id: 's-003',
    title: 'Entertainment venue refurbishment cycle starting',
    body: 'Marlin Athletic announced $40M in scheduled facility upgrades. Adjacent service categories (HVAC, security, AV) typically follow within one quarter.',
    entity: 'Marlin Athletic',
    strength: 'Medium',
    confidence: 'High',
    lens: 'Operational',
    agent: 'operational',
    detected: '2h ago',
    evidence: 3,
    score: 0.78,
    trend: 'flat'
  }, {
    id: 's-004',
    title: 'Operations hiring surge suggests maintenance push',
    body: 'Branhouse Group is hiring 40 plant ops roles, 80% in legacy facilities. Suggests deferred maintenance backlog clearing — adjacent procurement opportunities likely.',
    entity: 'Branhouse Group',
    strength: 'Low',
    confidence: 'Medium',
    lens: 'Operational',
    agent: 'operational',
    detected: 'Mar 4',
    evidence: 2,
    score: 0.54,
    trend: 'down'
  }, {
    id: 's-005',
    title: 'Modernization initiative likely to extend ERP renewal',
    body: 'Faden Hospital Group is publicly trialing two ERP replacements. Renewal of the incumbent appears unlikely past Q4; window opens for adjacent integrations.',
    entity: 'Faden Hospital Group',
    strength: 'Medium',
    confidence: 'Medium-High',
    lens: 'Operational',
    agent: 'risk',
    detected: 'Mar 2',
    evidence: 5,
    score: 0.71,
    trend: 'up'
  }, {
    id: 's-006',
    title: 'Two C-suite departures in 30 days — leadership volatility',
    body: 'Northrose Health saw CFO and COO leave within 30 days. Historically correlates with strategic re-platforming and a 6-month decision freeze.',
    entity: 'Northrose Health',
    strength: 'High',
    confidence: 'High',
    lens: 'Risk',
    agent: 'risk',
    detected: 'Mar 1',
    evidence: 4,
    score: 0.90,
    trend: 'up'
  }, {
    id: 's-007',
    title: 'Geographic expansion into APAC announced',
    body: 'Shoreline Health filed paperwork to operate in Singapore and Australia. Implementation services and compliance audits typically follow within 90 days.',
    entity: 'Shoreline Health',
    strength: 'Medium',
    confidence: 'High',
    lens: 'Growth',
    agent: 'market',
    detected: 'Feb 28',
    evidence: 3,
    score: 0.76,
    trend: 'up'
  }];
  return {
    agents,
    entities,
    signals
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/web-app/primitives.jsx
try { (() => {
// Polaris primitives — Icon, Button, IconButton, Pill, Avatar, Badge.
// Keep these tiny; they're the alphabet for everything above.

const polIconBase = '../../assets/icons/';

// Icon — renders the SVG via <img>. The SVGs ship with fill="#000",
// so they always render as black; we lean on context (text color or
// chip backgrounds) to express any color hierarchy. Pass `tint` to
// dim/lighten via opacity (e.g., tint=0.5 for secondary icons).
function Icon({
  name,
  size = 20,
  style,
  tint
}) {
  const url = `${polIconBase}${name}.svg`;
  return /*#__PURE__*/React.createElement("img", {
    src: url,
    alt: name,
    draggable: false,
    style: {
      width: size,
      height: size,
      display: 'inline-block',
      verticalAlign: 'middle',
      flex: 'none',
      opacity: tint != null ? tint : 1,
      ...style
    }
  });
}
function Button({
  children,
  variant = 'primary',
  size = 'sm',
  leadingIcon,
  trailingIcon,
  onClick,
  style,
  disabled,
  type = 'button'
}) {
  const base = {
    fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif',
    fontWeight: 700,
    fontSize: size === 'lg' ? 15 : size === 'xs' ? 12 : 14,
    lineHeight: size === 'lg' ? '22px' : size === 'xs' ? '16px' : '20px',
    borderRadius: size === 'xs' ? 6 : 8,
    padding: size === 'lg' ? '11px 18px' : size === 'xs' ? '5px 10px' : '8px 14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'background .12s, color .12s, transform .04s',
    opacity: disabled ? 0.55 : 1,
    whiteSpace: 'nowrap'
  };
  const variants = {
    primary: {
      background: '#1570ef',
      color: '#fff',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.18)'
    },
    secondary: {
      background: '#fff',
      color: '#404040',
      border: '1px solid #d4d4d4',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.05)'
    },
    tertiary: {
      background: 'transparent',
      color: '#525252',
      fontWeight: 600
    },
    destructive: {
      background: '#dc2626',
      color: '#fff',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.18)'
    },
    link: {
      background: 'transparent',
      color: '#1570ef',
      fontWeight: 600,
      padding: '0 4px'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, leadingIcon && /*#__PURE__*/React.createElement(Icon, {
    name: leadingIcon,
    size: size === 'lg' ? 18 : 16
  }), children, trailingIcon && /*#__PURE__*/React.createElement(Icon, {
    name: trailingIcon,
    size: size === 'lg' ? 18 : 16
  }));
}
function IconButton({
  icon,
  onClick,
  active,
  title,
  size = 32,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: title,
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      background: active ? '#fafafa' : 'transparent',
      color: active ? '#171717' : '#525252',
      border: 'none',
      cursor: 'pointer',
      transition: 'background .12s, color .12s',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  }));
}
function Pill({
  tone = 'neutral',
  dot = true,
  children,
  style
}) {
  const tones = {
    success: {
      bg: '#f0fdf4',
      bd: '#bbf7d0',
      fg: '#15803d'
    },
    warning: {
      bg: '#fffbeb',
      bd: '#fde68a',
      fg: '#b45309'
    },
    error: {
      bg: '#fef2f2',
      bd: '#fecaca',
      fg: '#dc2626'
    },
    info: {
      bg: '#eff6ff',
      bd: '#bfdbfe',
      fg: '#1d4ed8'
    },
    neutral: {
      bg: '#fafafa',
      bd: '#e5e5e5',
      fg: '#525252'
    },
    brand: {
      bg: '#d1e9ff',
      bd: '#84caff',
      fg: '#1570ef'
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '2px 8px',
      borderRadius: 9999,
      border: `1px solid ${t.bd}`,
      background: t.bg,
      color: t.fg,
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontWeight: 600,
      fontSize: 12,
      lineHeight: '18px',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: t.fg
    }
  }), children);
}
function Avatar({
  initials,
  size = 32,
  color = '#1570ef'
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontWeight: 700,
      fontSize: Math.round(size * 0.38),
      flex: 'none'
    }
  }, initials);
}
function LivePulse({
  size = 8,
  color = '#1570ef'
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 0 ${size / 2}px ${color}26`
    }
  });
}
Object.assign(window, {
  Icon,
  Button,
  IconButton,
  Pill,
  Avatar,
  LivePulse
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/screens.jsx
try { (() => {
// Polaris screens — HubScreen (signals table), SignalDrawer, AgentScreen, EmptyState

// ──────────────── PageHeader + Tabs ────────────────
function PageHeader({
  title,
  sub,
  tabs,
  activeTab,
  onTab,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 32px 0',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: '#737373',
      marginBottom: 6
    }
  }, "Workspace"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700,
      color: '#171717',
      letterSpacing: '-0.01em'
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#737373',
      marginTop: 6
    }
  }, sub)), action), tabs && /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      gap: 0,
      marginTop: 14
    }
  }, tabs.map(t => {
    const active = t.id === activeTab;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      onClick: () => onTab(t.id),
      style: {
        padding: '10px 4px',
        marginRight: 24,
        fontSize: 14,
        fontWeight: 600,
        color: active ? '#1570ef' : '#737373',
        cursor: 'pointer',
        borderBottom: `2px solid ${active ? '#1570ef' : 'transparent'}`,
        marginBottom: -1,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '0 7px',
        borderRadius: 9999,
        background: active ? '#d1e9ff' : '#f5f5f5',
        color: active ? '#1570ef' : '#525252',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: 11,
        fontWeight: 700
      }
    }, t.count));
  })));
}

// ──────────────── FilterBar ────────────────
function FilterBar({
  query,
  onQuery,
  view,
  onView,
  filters,
  onClearAll
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 32px 0',
      background: '#fafafa',
      border: '1px solid #e5e5e5',
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 40,
      borderRadius: 8,
      background: '#fff',
      border: '1px solid #d4d4d4',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 12px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search-lg",
    size: 18,
    style: {
      color: '#737373'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => onQuery(e.target.value),
    placeholder: "Search signals by topic, lens, opportunity area\u2026",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 14,
      color: '#171717'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '2px 6px',
      border: '1px solid #e5e5e5',
      borderRadius: 4,
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 11,
      color: '#737373'
    }
  }, "\u2318K")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      border: '1px solid #d4d4d4',
      borderRadius: 8,
      background: '#fff',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      overflow: 'hidden',
      flex: 'none'
    }
  }, ['table', 'list', 'map'].map((v, i, arr) => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => onView(v),
    style: {
      padding: '0 14px',
      height: 38,
      border: 'none',
      borderRight: i < arr.length - 1 ? '1px solid #e5e5e5' : 'none',
      background: view === v ? '#fafafa' : '#fff',
      color: view === v ? '#171717' : '#525252',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontWeight: 600,
      fontSize: 13,
      cursor: 'pointer',
      textTransform: 'capitalize'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "xs",
    leadingIcon: "filter-lines"
  }, "All filters"), filters.map(f => /*#__PURE__*/React.createElement(Button, {
    key: f.label,
    variant: "secondary",
    size: "xs",
    trailingIcon: "chevron-down"
  }, f.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary",
    size: "xs",
    onClick: onClearAll
  }, "Clear all"))));
}

// ──────────────── SignalsTable ────────────────
function strengthTone(s) {
  return s === 'High' ? 'error' : s === 'Medium' ? 'warning' : 'neutral';
}
function SignalsTable({
  signals,
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 32px 32px',
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      overflow: 'hidden',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px',
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: '#171717'
    }
  }, "Signals"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#737373',
      marginTop: 2
    }
  }, signals.length, " signals \xB7 3 agents \xB7 last 30 days")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "settings-01",
    title: "Columns"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "dots-vertical",
    title: "More"
  }))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'Plus Jakarta Sans, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: '#fafafa',
      borderBottom: '1px solid #e5e5e5'
    }
  }, ['Signal', 'Entity', 'Strength', 'Confidence', 'Lens', 'Agent', 'Detected'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: 'left',
      padding: '10px 18px',
      fontSize: 12,
      fontWeight: 700,
      color: '#0c0e12',
      whiteSpace: 'nowrap'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, signals.map((s, i) => /*#__PURE__*/React.createElement("tr", {
    key: s.id,
    onClick: () => onPick(s),
    style: {
      borderBottom: i < signals.length - 1 ? '1px solid #e5e5e5' : 'none',
      cursor: 'pointer',
      transition: 'background .12s'
    },
    onMouseEnter: e => e.currentTarget.style.background = '#fafafa',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 18px',
      maxWidth: 340
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#171717',
      lineHeight: 1.35
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#737373',
      marginTop: 3,
      lineHeight: 1.4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, s.body)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 18px',
      fontSize: 13,
      color: '#404040',
      whiteSpace: 'nowrap'
    }
  }, s.entity), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 18px'
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: strengthTone(s.strength)
  }, s.strength)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 18px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 12,
      color: '#262626'
    }
  }, s.score.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 18px'
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: "neutral",
    dot: false
  }, s.lens)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 18px',
      fontSize: 13,
      color: '#404040'
    }
  }, window.POLARIS_DATA.agents.find(a => a.id === s.agent)?.name.replace(' Monitor', '')), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 18px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 12,
      color: '#737373',
      whiteSpace: 'nowrap'
    }
  }, s.detected))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 18px',
      borderTop: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 12,
      color: '#737373'
    }
  }, /*#__PURE__*/React.createElement("div", null, "Page 1 of 9"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "xs",
    disabled: true
  }, "Previous"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "xs"
  }, "Next"))));
}

// ──────────────── SignalDrawer ────────────────
function SignalDrawer({
  signal,
  onClose
}) {
  if (!signal) return null;
  const agent = window.POLARIS_DATA.agents.find(a => a.id === signal.agent);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(12,14,18,0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 10
    }
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: 560,
      background: '#fff',
      borderLeft: '1px solid #e5e5e5',
      boxShadow: '-12px 0 24px -8px rgba(16,24,40,0.10)',
      zIndex: 11,
      display: 'flex',
      flexDirection: 'column',
      animation: 'pol-slide-in .25s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px 16px',
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: strengthTone(signal.strength)
  }, signal.strength, " strength"), /*#__PURE__*/React.createElement(Pill, {
    tone: "brand"
  }, /*#__PURE__*/React.createElement(LivePulse, {
    size: 5,
    color: "#1570ef"
  }), signal.lens), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 11,
      color: '#737373'
    }
  }, "conf ", signal.score.toFixed(2))), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 700,
      color: '#171717',
      lineHeight: 1.3
    }
  }, signal.title)), /*#__PURE__*/React.createElement(IconButton, {
    icon: "x-close",
    onClick: onClose,
    title: "Close"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Section, {
    label: "Analyst summary"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: '#404040',
      lineHeight: 1.55
    }
  }, signal.body)), /*#__PURE__*/React.createElement(Section, {
    label: "Entity"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      border: '1px solid #e5e5e5',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: signal.entity.split(' ').slice(0, 2).map(w => w[0]).join(''),
    color: "#262626"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: '#171717'
    }
  }, signal.entity), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#737373',
      marginTop: 2
    }
  }, "Last update \xB7 ", signal.detected)), /*#__PURE__*/React.createElement(Button, {
    variant: "link",
    trailingIcon: "arrow-up-right"
  }, "Open"))), /*#__PURE__*/React.createElement(Section, {
    label: "Detected by"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 14px',
      border: '1px solid #e5e5e5',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: `${agent.color}14`,
      color: agent.color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: agent.icon.replace('.svg', ''),
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: '#171717'
    }
  }, agent.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#737373',
      marginTop: 2
    }
  }, signal.evidence, " pieces of evidence \xB7 scanned 4 sources")))), /*#__PURE__*/React.createElement(Section, {
    label: "Suggested next steps"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      fontSize: 13,
      color: '#404040',
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("li", null, "Route to the field team owner for this account."), /*#__PURE__*/React.createElement("li", null, "Schedule a discovery call within the next 14 days."), /*#__PURE__*/React.createElement("li", null, "Add to the weekly executive digest as a watch item.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 24px',
      borderTop: '1px solid #e5e5e5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary",
    leadingIcon: "x-close"
  }, "Dismiss"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    leadingIcon: "users-01"
  }, "Assign"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    leadingIcon: "check-circle"
  }, "Mark reviewed")))));
}
function Section({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: '#737373',
      marginBottom: 8
    }
  }, label), children);
}

// ──────────────── AgentScreen ────────────────
function AgentScreen({
  agent,
  onPick
}) {
  const signals = window.POLARIS_DATA.signals.filter(s => s.agent === agent.id);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    title: agent.name,
    sub: `Monitors ${window.POLARIS_DATA.entities.length} entities · ${signals.length} signals in the last 30 days`,
    action: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      leadingIcon: "settings-01"
    }, "Configure"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      leadingIcon: "trend-up-01"
    }, "Run now"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16,
      margin: '24px 32px 0'
    }
  }, /*#__PURE__*/React.createElement(MetricCard, {
    label: "Signals last 30 days",
    value: signals.length,
    delta: `+${Math.round(signals.length * 0.4)}`,
    live: true
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Avg. confidence",
    value: (signals.reduce((a, b) => a + b.score, 0) / Math.max(1, signals.length)).toFixed(2)
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "High-strength rate",
    value: `${Math.round(signals.filter(s => s.strength === 'High').length / Math.max(1, signals.length) * 100)}%`
  })), /*#__PURE__*/React.createElement(SignalsTable, {
    signals: signals,
    onPick: onPick
  }));
}
function MetricCard({
  label,
  value,
  delta,
  live
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      padding: '14px 18px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#525252'
    }
  }, label), live && /*#__PURE__*/React.createElement(LivePulse, {
    size: 8,
    color: "#1570ef"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: 32,
      fontWeight: 600,
      color: '#171717',
      letterSpacing: '-0.01em',
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, value, delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#15803d',
      fontWeight: 600
    }
  }, delta, " \u2191")));
}

// ──────────────── EmptyState ────────────────
function EmptyState({
  title,
  body,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '48px 32px',
      padding: '48px 32px',
      background: '#fafafa',
      border: '1px dashed #d4d4d4',
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 24,
      background: '#fff',
      border: '1px solid #e5e5e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#737373'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search-lg",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: '#171717'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#525252',
      maxWidth: 380,
      lineHeight: 1.5
    }
  }, body), action);
}
Object.assign(window, {
  PageHeader,
  FilterBar,
  SignalsTable,
  SignalDrawer,
  AgentScreen,
  MetricCard,
  EmptyState
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/screens.jsx", error: String((e && e.message) || e) }); }

})();
