// Apollo Defense Intelligence Hub — theme tokens, inline-SVG icon set, UI primitives.
// Dark command-center skin layered over the Polaris I/O design system.

// ──────────────── Theme tokens (Polaris I/O light system) ────────────────
window.T = {
  // surfaces
  bg:        '#ffffff',
  bg2:       '#fafafa',
  surface:   '#fafafa',
  card:      '#ffffff',
  cardHi:    '#fafafa',
  cardInset: '#fafafa',
  rail:      '#ffffff',
  // borders
  bd:        '#e5e5e5',
  bdHi:      '#d4d4d4',
  bdStrong:  '#a3a3a3',
  // text
  text:      '#171717',
  text2:     '#525252',
  text3:     '#737373',
  text4:     '#a3a3a3',
  // accent — Polaris cobalt
  acc:       '#1570ef',
  accHi:     '#175cd3',
  cyan:      '#0e7490',
  accSoft:   '#eff6ff',
  accBd:     '#bfdbfe',
  // maturity / status — semantic triples
  ready:     '#15803d',   readyBg: '#f0fdf4',  readyBd: '#bbf7d0',
  dev:       '#b45309',   devBg:   '#fffbeb',  devBd:   '#fde68a',
  mon:       '#737373',   monBg:   '#f7f7f7',  monBd:   '#e5e5e5',
  risk:      '#dc2626',   riskBg:  '#fef2f2',  riskBd:  '#fecaca',
  warn:      '#c2410c',   warnBg:  '#fff7ed',  warnBd:  '#fed7aa',
  // misc
  font:      "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
  mono:      "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
};

(function () {
const T = window.T;

// ──────────────── Inline-SVG icon library (stroke = currentColor) ────────────────
const ICONS = {
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"/>',
  crosshair: '<circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="2.4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  layers: '<path d="M12 3 3 8l9 5 9-5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  activity: '<path d="M3 12h3.5l2.5-7 4 14 2.5-7H21"/>',
  signal: '<path d="M5 18a9 9 0 0 1 0-12M8.5 15a5 5 0 0 1 0-6M19 6a9 9 0 0 1 0 12M15.5 9a5 5 0 0 1 0 6"/><circle cx="12" cy="12" r="1.6"/>',
  fileText: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M8.5 13h7M8.5 17h7M8.5 9h2"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="13" cy="18" r="2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.2 8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9z"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  plusCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  chevDown: '<path d="M5 8.5 12 15l7-6.5"/>',
  chevRight: '<path d="M9 5l7 7-7 7"/>',
  chevLeft: '<path d="M15 5l-7 7 7 7"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/>',
  alertTri: '<path d="M12 3.5 22 19H2L12 3.5z"/><path d="M12 9.5v4M12 16.5h.01"/>',
  alertCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  dots: '<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',
  filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 4.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7z"/>',
  thumbUp: '<path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3z"/><path d="M7 11l4-7a2.5 2.5 0 0 1 2.5 2.5V10h5.6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 18 21H7"/>',
  thumbDown: '<path d="M7 13V4H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3z"/><path d="M7 13l4 7a2.5 2.5 0 0 0 2.5-2.5V14h5.6a2 2 0 0 0 2-2.3l-1.2-7A2 2 0 0 0 18 3H7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.3M21 4v4h-4"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  trendUp: '<path d="M3 17l6-6 4 4 8-8M21 7v5M21 7h-5"/>',
  trendDown: '<path d="M3 7l6 6 4-4 8 8M21 17v-5M21 17h-5"/>',
  minus: '<path d="M5 12h14"/>',
  mapPin: '<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  radioTower: '<path d="M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4"/><circle cx="12" cy="12" r="1.6"/><path d="M12 13.5 9.5 21h5L12 13.5z"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3z"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  link: '<path d="M9 13a4 4 0 0 0 6 .5l3-3a4 4 0 0 0-5.6-5.6L11 6"/><path d="M15 11a4 4 0 0 0-6-.5l-3 3a4 4 0 0 0 5.6 5.6L13 18"/>',
  route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M6 16.5V11a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.8 2.5-2.8 2.5M12 17h.01"/>',
  home: '<path d="M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  play: '<path d="M7 4.5v15l13-7.5z"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  download: '<path d="M12 3v12M7 11l5 4 5-4M4 21h16"/>',
  send: '<path d="M21 3 3 10.5l7 2.5 2.5 7L21 3z"/><path d="M10 13.5 21 3"/>',
  fileMemo: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 16.5h4"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/><path d="M12 8v4l3 2"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 3 2 3H5"/>',
  gitBranch: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-4 4.5-6 5"/>',
  flame: '<path d="M12 2c1.5 3 4.5 4.5 4.5 8.5a4.5 4.5 0 0 1-9 0c0-1.2.4-2 .9-2.7.3 1 1 1.6 1.8 1.7C10.5 7 11 4 12 2z"/><path d="M12 22a6 6 0 0 0 6-6c0-1.3-.4-2.4-1-3.3"/><path d="M12 22a6 6 0 0 1-6-6"/>',
  wind: '<path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8a2.5 2.5 0 1 1-2.5 2.5"/>',
  droplet: '<path d="M12 3s6 6 6 10.5a6 6 0 0 1-12 0C6 9 12 3 12 3z"/>',
  cloud: '<path d="M6 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.5 3.5 0 0 1 18 18H6z"/>',
  navigation: '<path d="M12 2 4 21l8-4 8 4-8-19z"/>',
  swap: '<path d="M7 4 3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8"/>',
};

function Ic({ name, size = 18, color, style, strokeWidth = 1.75 }) {
  const path = ICONS[name] || ICONS.alertCircle;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color || 'currentColor'} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flex: 'none', ...style }}
      dangerouslySetInnerHTML={{ __html: path }} />
  );
}

// ──────────────── Buttons ────────────────
function Btn({ children, variant = 'primary', size = 'sm', icon, iconRight, onClick, style, disabled, title }) {
  const [h, setH] = React.useState(false);
  const sz = {
    sm: { pad: '7px 13px', fs: 13, ic: 15, r: 8 },
    xs: { pad: '5px 10px', fs: 12, ic: 14, r: 7 },
    lg: { pad: '10px 18px', fs: 14, ic: 17, r: 9 },
  }[size];
  const variants = {
    primary: {
      background: h ? T.accHi : T.acc, color: '#ffffff', fontWeight: 700,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.18)',
    },
    secondary: {
      background: h ? '#fafafa' : '#ffffff', color: '#404040', fontWeight: 600,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px #d4d4d4',
    },
    ghost: { background: h ? '#f5f5f5' : 'transparent', color: T.text2, fontWeight: 600 },
    danger: {
      background: h ? '#fee2e2' : T.riskBg, color: T.risk, fontWeight: 700,
      boxShadow: `inset 0 0 0 1px ${T.riskBd}`,
    },
    accentSoft: {
      background: h ? '#dbeafe' : T.accSoft, color: T.accHi, fontWeight: 700,
      boxShadow: `inset 0 0 0 1px ${T.accBd}`,
    },
  };
  return (
    <button type="button" title={title} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        fontFamily: T.font, fontSize: sz.fs, lineHeight: 1.2, borderRadius: sz.r,
        padding: sz.pad, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1, transition: 'background .12s, box-shadow .12s, transform .04s',
        ...variants[variant], ...style,
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}
      onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {icon && <Ic name={icon} size={sz.ic} />}
      {children}
      {iconRight && <Ic name={iconRight} size={sz.ic} />}
    </button>
  );
}

function IconBtn({ name, onClick, active, title, size = 32, iconSize = 18, style }) {
  const [h, setH] = React.useState(false);
  return (
    <button type="button" onClick={onClick} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: size, height: size, borderRadius: 8,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: active ? T.accSoft : (h ? '#f5f5f5' : 'transparent'),
        color: active ? T.accHi : (h ? T.text : T.text2),
        border: 'none', cursor: 'pointer', flex: 'none',
        transition: 'background .12s, color .12s', ...style,
      }}>
      <Ic name={name} size={iconSize} />
    </button>
  );
}

// ──────────────── Pills / badges ────────────────
function Pill({ tone = 'neutral', dot = false, children, style, size = 'sm' }) {
  const tones = {
    neutral: { bg: '#fafafa', bd: T.bd, fg: T.text2 },
    accent:  { bg: '#d1e9ff', bd: '#b2ddff', fg: T.accHi },
    ready:   { bg: T.readyBg, bd: T.readyBd, fg: T.ready },
    dev:     { bg: T.devBg, bd: T.devBd, fg: T.dev },
    mon:     { bg: T.monBg, bd: T.monBd, fg: T.mon },
    risk:    { bg: T.riskBg, bd: T.riskBd, fg: T.risk },
    warn:    { bg: T.warnBg, bd: T.warnBd, fg: T.warn },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'xs' ? '1px 7px' : '2px 9px', borderRadius: 9999,
      border: `1px solid ${t.bd}`, background: t.bg, color: t.fg,
      fontFamily: T.font, fontWeight: 600, fontSize: size === 'xs' ? 11 : 11.5,
      lineHeight: '17px', whiteSpace: 'nowrap', ...style,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.fg }} />}
      {children}
    </span>
  );
}

// Maturity badge — Insight Ready / Developing / Monitoring
const MATURITY = {
  'Insight Ready': { tone: 'ready', cta: 'Create Analyst Report' },
  'Developing':    { tone: 'dev',   cta: 'Watch' },
  'Monitoring':    { tone: 'mon',   cta: 'Continue Monitoring' },
};

// Operation tag chip — colored by operation
function OpTag({ id, size = 'xs' }) {
  const op = window.AP.OP[id]; if (!op) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'xs' ? '1px 8px 1px 6px' : '2px 10px 2px 7px', borderRadius: 9999,
      background: `${op.color}12`, boxShadow: `inset 0 0 0 1px ${op.color}40`,
      color: op.color, fontFamily: T.font, fontWeight: 700, fontSize: size === 'xs' ? 11 : 11.5,
      lineHeight: '16px', whiteSpace: 'nowrap',
    }}>
      <Ic name={op.icon} size={size === 'xs' ? 11 : 12} /> {op.tag}
    </span>
  );
}
function MaturityBadge({ value, size }) {
  const m = MATURITY[value] || MATURITY['Monitoring'];
  return <Pill tone={m.tone} dot size={size}>{value}</Pill>;
}

// Lifecycle chip (Accelerating / Emerging / Peaking / Plateauing)
function LifecycleChip({ value }) {
  const map = {
    Accelerating: { ic: 'trendUp', c: T.ready },
    Emerging:     { ic: 'trendUp', c: T.acc },
    Peaking:      { ic: 'activity', c: T.dev },
    Plateauing:   { ic: 'minus', c: T.mon },
  };
  const m = map[value] || map.Plateauing;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: m.c }}>
      <Ic name={m.ic} size={13} /> {value}
    </span>
  );
}

// ──────────────── Evidence strength bar (compact horizontal) ────────────────
function EvidenceBar({ level, showLabel = true, width = 56 }) {
  const map = {
    'High':        { n: 3, c: T.ready },
    'Medium-High': { n: 2.5, c: T.ready },
    'Medium':      { n: 2, c: T.dev },
    'Med':         { n: 2, c: T.dev },
    'Low-Med':     { n: 1.5, c: T.warn },
    'Low':         { n: 1, c: T.mon },
  };
  const m = map[level] || map['Low'];
  const segs = 4;
  const filled = m.n / 3 * segs;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', gap: 2.5, width, flex: 'none' }}>
        {Array.from({ length: segs }).map((_, i) => {
          const on = i + 1 <= filled;
          const half = !on && i < filled;
          return <span key={i} style={{
            flex: 1, height: 6, borderRadius: 2,
            background: on ? m.c : (half ? `${m.c}88` : '#e8e8e8'),
          }} />;
        })}
      </span>
      {showLabel && <span style={{ fontSize: 12, fontWeight: 600, color: T.text2, minWidth: 52 }}>{level}</span>}
    </span>
  );
}

// Confidence dots
function ConfidenceDots({ level, showLabel = true }) {
  const map = { 'High': 3, 'Medium-High': 3, 'Medium': 2, 'Med': 2, 'Low': 1 };
  const n = map[level] || 1;
  const c = level === 'High' ? T.acc : (level === 'Medium-High' ? T.cyan : (n === 2 ? T.cyan : T.mon));
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      <span style={{ display: 'inline-flex', gap: 3 }}>
        {[1, 2, 3].map(i => <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: i <= n ? c : '#e0e0e0',
        }} />)}
      </span>
      {showLabel && <span style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>{level}</span>}
    </span>
  );
}

// ──────────────── Card + Eyebrow ────────────────
function Card({ children, style, hover, onClick, glow, accent, noAnim }) {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setH(true)} onMouseLeave={() => hover && setH(false)}
      style={{
        position: 'relative',
        background: h ? T.cardHi : T.card, borderRadius: 14,
        boxShadow: glow
          ? `inset 0 0 0 1.5px ${T.accBd}, 0 1px 2px 0 rgba(0,0,0,0.05), 0 12px 34px -16px rgba(21,112,239,0.38)`
          : `0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px ${h ? T.bdHi : T.bd}`,
        transition: 'box-shadow .14s, background .14s, transform .14s',
        animation: noAnim ? undefined : 'ap-rise .34s cubic-bezier(0.16,1,0.3,1)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}>
      {accent && <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: '14px 14px 0 0', zIndex: 1 }} />}
      {children}
    </div>
  );
}

// Tiny inline sparkline (self-contained; used in KPI tiles)
function MiniSpark({ data, color, width = 52, height = 22 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data); const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - 2 - ((v - min) / span) * (height - 4)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', flex: 'none' }}>
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.9" fill={color} />
    </svg>
  );
}

function Eyebrow({ children, style }) {
  return <div style={{
    fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase',
    color: T.text3, fontFamily: T.font, ...style,
  }}>{children}</div>;
}

// Section header with title + optional accent rule
function SectionHead({ eyebrow, title, sub, action, accent, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, ...style }}>
      <div style={{ minWidth: 0 }}>
        {eyebrow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            {accent && <span style={{ width: 22, height: 2.5, borderRadius: 2, background: accent }} />}
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}
        <div style={{ fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: T.text3, marginTop: 4 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

// KPI stat (used in strips)
function Kpi({ label, value, unit, tone, delta, spark, sub }) {
  const toneC = { ready: T.ready, dev: T.dev, risk: T.risk, acc: T.acc, warn: T.warn }[tone] || T.text;
  const up = delta && delta.dir === 'up';
  const sparkC = tone ? toneC : T.acc;
  return (
    <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: T.text3, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{ fontSize: 25, fontWeight: 700, color: tone ? toneC : T.text, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</span>
          {unit && <span style={{ fontSize: 13, fontWeight: 600, color: T.text3 }}>{unit}</span>}
        </div>
        {spark && <MiniSpark data={spark} color={sparkC} />}
      </div>
      {delta ? (
        <div style={{ fontSize: 11, fontWeight: 700, color: up ? T.ready : (delta.dir === 'flat' ? T.text3 : T.risk), display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <Ic name={delta.dir === 'flat' ? 'minus' : (up ? 'trendUp' : 'trendDown')} size={12} />{delta.txt}
        </div>
      ) : (sub && <div style={{ fontSize: 11, color: T.text4 }}>{sub}</div>)}
    </div>
  );
}

// Segmented toggle (card/table, etc.)
function SegToggle({ value, options, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: '#f5f5f5', borderRadius: 9, padding: 3, boxShadow: `inset 0 0 0 1px ${T.bd}` }}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            style={{
              border: 'none', cursor: 'pointer', borderRadius: 6, padding: '5px 11px',
              background: on ? '#ffffff' : 'transparent', color: on ? T.acc : T.text3,
              fontFamily: T.font, fontWeight: 700, fontSize: 12.5,
              display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all .12s',
              boxShadow: on ? '0 1px 2px 0 rgba(0,0,0,0.08), inset 0 0 0 1px #e5e5e5' : 'none',
            }}>
            {o.icon && <Ic name={o.icon} size={14} />}{o.label}
          </button>
        );
      })}
    </div>
  );
}

// Tiny vector-source glyph
function VectorGlyph({ vector, size = 14 }) {
  const map = {
    'FMV': 'video', 'UAS Feed': 'video', 'Drone': 'video',
    'SIGINT Metadata': 'radioTower', 'SIGINT': 'radioTower', 'Device Metadata': 'radioTower',
    'Body Cam Observation': 'eye', 'Body Cam': 'eye', 'Facility Activity': 'building',
    'Package Freshness': 'database', 'Package Audit': 'database', 'Investigation Records': 'database',
    'Geospatial': 'mapPin', 'Route Activity': 'route', 'Geospatial Movement': 'mapPin', 'Evacuation Flow': 'mapPin',
    'Weather': 'wind', 'Satellite': 'globe', 'Transportation': 'route', 'Field Report': 'user',
    'Shelter Intake': 'building', 'Utility Telemetry': 'zap', 'Associate Activity': 'gitBranch',
  };
  return <Ic name={map[vector] || 'signal'} size={size} />;
}

window.Ic = Ic;
window.Btn = Btn;
window.IconBtn = IconBtn;
window.Pill = Pill;
window.MaturityBadge = MaturityBadge;
window.MATURITY = MATURITY;
window.OpTag = OpTag;
window.LifecycleChip = LifecycleChip;
window.EvidenceBar = EvidenceBar;
window.ConfidenceDots = ConfidenceDots;
window.Card = Card;
window.MiniSpark = MiniSpark;
window.Eyebrow = Eyebrow;
window.SectionHead = SectionHead;
window.Kpi = Kpi;
window.SegToggle = SegToggle;
window.VectorGlyph = VectorGlyph;
})();
