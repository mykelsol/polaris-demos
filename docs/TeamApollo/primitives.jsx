// Polaris primitives — Icon / Button / IconButton / Pill / Avatar / LivePulse / Kbd / Strength

const POL_ICON_BASE = './assets/icons/';

function Icon({ name, size = 20, style, tint }) {
  const src = (window.__resources && window.__resources['icon-' + name]) || `${POL_ICON_BASE}${name}.svg`;
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      style={{
        width: size, height: size,
        display: 'inline-block', verticalAlign: 'middle',
        flex: 'none',
        opacity: tint != null ? tint : 1,
        ...style,
      }}
    />
  );
}

function Button({ children, variant = 'primary', size = 'sm', leadingIcon, trailingIcon, onClick, style, disabled, type = 'button' }) {
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    fontSize: size === 'lg' ? 15 : (size === 'xs' ? 12 : 13),
    lineHeight: size === 'lg' ? '22px' : (size === 'xs' ? '16px' : '20px'),
    borderRadius: size === 'xs' ? 6 : 8,
    padding: size === 'lg' ? '10px 16px' : (size === 'xs' ? '5px 10px' : '8px 12px'),
    display: 'inline-flex', alignItems: 'center', gap: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'background .12s, color .12s, transform .04s, box-shadow .12s',
    opacity: disabled ? 0.55 : 1,
    whiteSpace: 'nowrap',
  };
  const variants = {
    primary:    { background: '#1570ef', color: '#fff',
                  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.18)' },
    secondary:  { background: '#fff', color: '#404040',
                  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px #d4d4d4' },
    tertiary:   { background: 'transparent', color: '#525252', fontWeight: 600 },
    ghost:      { background: 'transparent', color: '#404040', fontWeight: 600,
                  boxShadow: 'inset 0 0 0 1px transparent' },
    link:       { background: 'transparent', color: '#1570ef', fontWeight: 700, padding: '0 2px' },
    destructive:{ background: '#dc2626', color: '#fff',
                  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.18)' },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {leadingIcon && <Icon name={leadingIcon} size={size === 'lg' ? 18 : (size === 'xs' ? 14 : 16)} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={size === 'lg' ? 18 : (size === 'xs' ? 14 : 16)} />}
    </button>
  );
}

function IconButton({ icon, onClick, active, title, size = 32, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: size, height: size,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 6,
        background: active ? '#f5f5f5' : (hover ? '#fafafa' : 'transparent'),
        color: active ? '#171717' : '#525252',
        border: 'none', cursor: 'pointer',
        transition: 'background .12s, color .12s',
        flex: 'none',
        ...style,
      }}>
      <Icon name={icon} size={18} />
    </button>
  );
}

function Pill({ tone = 'neutral', dot = true, children, style, size = 'sm' }) {
  const tones = {
    success: { bg: '#f0fdf4', bd: '#bbf7d0', fg: '#15803d' },
    warning: { bg: '#fffbeb', bd: '#fde68a', fg: '#b45309' },
    error:   { bg: '#fef2f2', bd: '#fecaca', fg: '#b91c1c' },
    info:    { bg: '#eff6ff', bd: '#bfdbfe', fg: '#1d4ed8' },
    neutral: { bg: '#fafafa', bd: '#e5e5e5', fg: '#404040' },
    brand:   { bg: '#d1e9ff', bd: '#84caff', fg: '#175cd3' },
    purple:  { bg: '#f5f3ff', bd: '#ddd6fe', fg: '#6d28d9' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'xs' ? '1px 6px' : '2px 8px',
      borderRadius: 9999,
      border: `1px solid ${t.bd}`, background: t.bg, color: t.fg,
      fontFamily: 'var(--font-sans)', fontWeight: 600,
      fontSize: size === 'xs' ? 11 : 12,
      lineHeight: size === 'xs' ? '16px' : '18px',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: t.fg }} />}
      {children}
    </span>
  );
}

function Avatar({ initials, size = 32, color = '#262626', src }) {
  if (src) {
    return <img src={src} alt={initials} style={{
      width: size, height: size, borderRadius: '50%', objectFit: 'cover', flex: 'none',
    }} />;
  }
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: color,
      color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700, fontSize: Math.round(size * 0.38),
      flex: 'none', letterSpacing: '-0.02em',
    }}>{initials}</span>
  );
}

function LivePulse({ size = 8, color = '#1570ef', animated = true }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: color,
      flex: 'none',
      animation: animated ? 'pol-pulse 1.8s ease-out infinite' : 'none',
    }} />
  );
}

function Kbd({ children }) {
  return (
    <span style={{
      padding: '2px 6px', border: '1px solid #e5e5e5', borderRadius: 4,
      fontFamily: 'var(--font-mono)', fontSize: 11, color: '#737373',
      background: '#fff', lineHeight: 1,
    }}>{children}</span>
  );
}

// Strength column — display style varies by tweak
function Strength({ level, mode = 'badge' }) {
  const tone = level === 'High' ? 'error' : (level === 'Medium' ? 'warning' : 'neutral');
  const color = level === 'High' ? '#b91c1c' : (level === 'Medium' ? '#b45309' : '#737373');
  if (mode === 'badge') {
    return <Pill tone={tone}>{level}</Pill>;
  }
  if (mode === 'dot') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#404040', fontSize: 13, fontWeight: 600 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        {level}
      </span>
    );
  }
  // bar
  const filled = level === 'High' ? 3 : (level === 'Medium' ? 2 : 1);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {[1, 2, 3].map(i => (
          <span key={i} style={{
            width: 4, height: 14, borderRadius: 1.5,
            background: i <= filled ? color : '#e5e5e5',
          }} />
        ))}
      </span>
      <span style={{ fontSize: 12, color: '#404040', fontWeight: 600 }}>{level}</span>
    </span>
  );
}

// Section eyebrow used in drawer
function Eyebrow({ children, style }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
      textTransform: 'uppercase', color: '#737373',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, { Icon, Button, IconButton, Pill, Avatar, LivePulse, Kbd, Strength, Eyebrow });
