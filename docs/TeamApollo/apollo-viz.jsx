// Apollo — visualization library: charts, operation maps, relationship graph,
// coverage matrix, distribution matrix, persistence lifecycle, pattern timeline.
(function () {
const T = window.T;
const { Ic, Pill, Card } = window;

const STATE_C = { green: T.ready, amber: T.dev, red: T.risk, gray: T.mon };
const STATE_BG = { green: T.readyBg, amber: T.devBg, red: T.riskBg, gray: T.monBg };
const STATE_LABEL = { green: 'Current / strong', amber: 'Partial / needs update', red: 'Stale / missing', gray: 'Unavailable' };

// ──────────────── Bar chart (vertical) ────────────────
function BarChart({ data, color = T.acc, height = 110, axis, labels }) {
  const max = Math.max(...data, 1);
  const peak = data.indexOf(max);
  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 4, height, borderBottom: `1px solid ${T.bd}` }}>
        {data.map((v, i) => {
          const cur = i === data.length - 1;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
              {(cur || i === peak) && <span style={{ fontSize: 9.5, fontWeight: 700, color: cur ? color : T.text4, marginBottom: 3, fontVariantNumeric: 'tabular-nums' }}>{v}</span>}
              <div title={`${v}`} style={{ width: '100%', height: `${Math.max(3, (v / max) * 100)}%`, background: cur ? `linear-gradient(180deg, ${color}, ${color}cc)` : `linear-gradient(180deg, ${color}66, ${color}33)`, borderRadius: '3px 3px 0 0', transition: 'height .2s' }} />
            </div>
          );
        })}
      </div>
      {axis && <div style={{ fontSize: 10.5, color: T.text4, marginTop: 7, textAlign: 'center', fontWeight: 600 }}>{axis}</div>}
    </div>
  );
}

// ──────────────── Donut chart ────────────────
function DonutChart({ segments, size = 132, thickness = 18, centerLabel, centerValue }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ededed" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const len = (s.value / total) * circ;
            const gap = Math.min(2.5, len * 0.06);
            const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap="round"
              strokeDasharray={`${Math.max(0.1, len - gap)} ${circ - len + gap}`} strokeDashoffset={-offset} />;
            offset += len; return el;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: T.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{centerValue != null ? centerValue : total}</span>
          {centerLabel && <span style={{ fontSize: 10, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>{centerLabel}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flex: 'none' }} />
            <span style={{ fontSize: 12.5, color: T.text2, fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: 12.5, color: T.text, fontWeight: 700, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────── Horizontal bar list ────────────────
function HBars({ rows, color = T.acc, unit }) {
  const max = Math.max(...rows.map(r => r.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ width: 132, flex: 'none', fontSize: 12, color: T.text2, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
          <span style={{ flex: 1, height: 10, borderRadius: 5, background: '#f0f0f0', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${Math.max(5, (r.value / max) * 100)}%`, background: r.color || color, borderRadius: 5 }} />
          </span>
          <span style={{ width: 30, textAlign: 'right', fontSize: 12.5, fontWeight: 700, color: T.text, fontVariantNumeric: 'tabular-nums', flex: 'none' }}>{r.value}{unit || ''}</span>
        </div>
      ))}
    </div>
  );
}

// ──────────────── Sparkline (area) ────────────────
function Sparkline({ data, color = T.acc, width = 132, height = 38 }) {
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - 4 - ((v - min) / span) * (height - 8)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs><linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.22" /><stop offset="1" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <path d={area} fill={`url(#sg-${color.replace('#', '')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.length && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.8" fill={color} />}
    </svg>
  );
}

// ──────────────── Map configs (stylized synthetic maps) ────────────────
const MAP = {
  'sierra-ember': {
    layers: [
      { id: 'fire', label: 'Fire perimeter', updated: '14m' },
      { id: 'roads', label: 'Roads', updated: '34m' },
      { id: 'shelters', label: 'Shelters', updated: '16m' },
      { id: 'utilities', label: 'Utilities', updated: '21m' },
      { id: 'teams', label: 'Field teams', updated: '12m' },
      { id: 'drone', label: 'Drone coverage', updated: '18m' },
      { id: 'evac', label: 'Evacuation flow', updated: '41m' },
    ],
    regions: [{ layer: 'fire', x: 54, y: 14, w: 40, h: 30, label: 'Active fire perimeter', tone: 'fire' }],
    coverage: [{ layer: 'drone', x: 40, y: 30, r: 26, label: 'Drone Feed Ember-2' }],
    wind: { layer: 'fire', x: 80, y: 8, angle: 215, label: 'Wind shift' },
    paths: [
      { layer: 'roads', d: 'M8 44 C 28 40, 44 34, 62 22', label: 'North Ridge Corridor', tone: 'risk', entity: 'ent-northridge', pattern: 'p-evac', dash: false },
      { layer: 'roads', d: 'M10 50 C 34 50, 52 48, 74 46', label: 'Route 18', tone: 'warn', entity: 'ent-route18', dash: true, dashLabel: 'Partial blockage' },
    ],
    arrows: [{ layer: 'evac', x1: 40, y1: 40, x2: 16, y2: 46 }, { layer: 'evac', x1: 50, y1: 38, x2: 22, y2: 44 }],
    markers: [
      { layer: 'roads', id: 'ent-northridge', x: 50, y: 28, icon: 'route', label: 'North Ridge Corridor', tone: 'risk', pattern: 'p-evac' },
      { layer: 'roads', id: 'ent-route18', x: 60, y: 44, icon: 'route', label: 'Route 18', tone: 'warn' },
      { layer: 'shelters', id: 'ent-westvalley', x: 12, y: 40, icon: 'building', label: 'West Valley Shelters', tone: 'dev' },
      { layer: 'utilities', id: 'ent-pine', x: 70, y: 30, icon: 'zap', label: 'Pine Substation', tone: 'risk', pattern: 'p-utility' },
      { layer: 'teams', id: 'ent-bravo', x: 44, y: 20, icon: 'shield', label: 'Fire Division Bravo', tone: 'ready' },
      { layer: 'teams', id: 'ent-sheriff', x: 30, y: 36, icon: 'user', label: 'Sheriff Evac Unit', tone: 'ready' },
    ],
  },
  'iron-shield': {
    layers: [
      { id: 'pois', label: 'POIs', updated: '2.1h' },
      { id: 'vehicles', label: 'Vehicles', updated: '2.4h' },
      { id: 'devices', label: 'Devices', updated: '1.8h' },
      { id: 'facilities', label: 'Facilities', updated: '2.6h' },
      { id: 'routes', label: 'Routes', updated: '3.2h' },
      { id: 'sensor', label: 'Sensor coverage', updated: '2.1h' },
      { id: 'history', label: 'Historical activity', updated: '30d' },
    ],
    regions: [{ layer: 'pois', x: 38, y: 14, w: 26, h: 22, label: 'Orion recent activity', tone: 'orion' }],
    coverage: [{ layer: 'sensor', x: 50, y: 36, r: 24, label: 'Drone Feed Raven-3' }],
    paths: [
      { layer: 'routes', d: 'M22 40 C 40 38, 58 40, 78 34', label: 'Route Falcon', tone: 'dev', entity: 'route-falcon', dash: true, dashLabel: 'Short-duration window' },
      { layer: 'history', d: 'M20 22 C 34 26, 48 24, 56 30', label: 'Movement over time', tone: 'mon', dash: true },
    ],
    arrows: [{ layer: 'routes', x1: 50, y1: 38, x2: 64, y2: 48 }],
    markers: [
      { layer: 'pois', id: 'poi-orion', x: 48, y: 24, icon: 'user', label: 'POI Orion', tone: 'risk', pattern: 'p-orion' },
      { layer: 'facilities', id: 'site-lattice', x: 52, y: 40, icon: 'building', label: 'Site Lattice', tone: 'dev' },
      { layer: 'facilities', id: 'site-a', x: 66, y: 50, icon: 'building', label: 'Crit. Infra Site A', tone: 'risk' },
      { layer: 'vehicles', id: 'veh-v214', x: 34, y: 34, icon: 'route', label: 'Vehicle V-214', tone: 'dev' },
      { layer: 'devices', id: 'dev-d77', x: 40, y: 46, icon: 'radioTower', label: 'Device D-77 hits', tone: 'ready' },
      { layer: 'pois', id: 'poi-kestrel', x: 62, y: 22, icon: 'user', label: 'POI Kestrel', tone: 'dev' },
      { layer: 'pois', id: 'poi-slate', x: 70, y: 36, icon: 'user', label: 'POI Slate', tone: 'mon' },
      { layer: 'sensor', id: 'src-bodycam', x: 28, y: 28, icon: 'eye', label: 'Body cam encounter', tone: 'mon' },
    ],
  },
};

function pct(v, total) { return (v / total) * 100; }

// ──────────────── Operation map ────────────────
function OperationMap({ opId, onPickEntity, onPickPattern, height = 360, compact }) {
  const cfg = MAP[opId]; if (!cfg) return null;
  const op = window.AP.OP[opId];
  const [on, setOn] = React.useState(Object.fromEntries(cfg.layers.map(l => [l.id, true])));
  const VB = { w: 100, h: 56 };
  const sx = x => (x / 100) * VB.w, sy = y => (y / 100) * VB.h;
  const toneC = { fire: '#dc2626', orion: '#1570ef', risk: T.risk, warn: T.warn, dev: T.dev, ready: T.ready, mon: T.mon };

  return (
    <Card style={{ overflow: 'hidden' }}>
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '13px 16px', borderBottom: `1px solid ${T.bd}` }}>
          <Ic name="navigation" size={16} color={op.color} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>Operation map</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {cfg.layers.map(l => (
              <button key={l.id} onClick={() => setOn(s => ({ ...s, [l.id]: !s[l.id] }))} title={`Updated ${l.updated} ago`}
                style={{ border: 'none', cursor: 'pointer', padding: '4px 9px', borderRadius: 7, fontFamily: T.font, fontSize: 11.5, fontWeight: 700,
                  background: on[l.id] ? '#d1e9ff' : '#f5f5f5', color: on[l.id] ? T.accHi : T.text3,
                  boxShadow: on[l.id] ? 'inset 0 0 0 1px #84caff' : `inset 0 0 0 1px ${T.bd}`, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: on[l.id] ? T.acc : T.bdHi }} /> {l.label}
              </button>
            ))}
          </span>
        </div>
      )}
      <div style={{ position: 'relative', height, background: op.kind === 'real-time' ? 'linear-gradient(155deg,#fbf6f2 0%,#f3f1ef 55%,#eef0f3 100%)' : 'linear-gradient(155deg,#f2f6fc 0%,#eef1f6 55%,#edf0f4 100%)' }}>
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            {cfg.regions.map((r, i) => (
              <radialGradient key={'g' + i} id={`glow-${opId}-${i}`} cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor={toneC[r.tone]} stopOpacity="0.40" />
                <stop offset="55%" stopColor={toneC[r.tone]} stopOpacity="0.16" />
                <stop offset="100%" stopColor={toneC[r.tone]} stopOpacity="0" />
              </radialGradient>
            ))}
            <radialGradient id={`cone-${opId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={op.color} stopOpacity="0.18" />
              <stop offset="68%" stopColor={op.color} stopOpacity="0.06" />
              <stop offset="100%" stopColor={op.color} stopOpacity="0" />
            </radialGradient>
            <marker id={`arr-${opId}`} markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
              <path d="M0 0 L4 2.5 L0 5 Z" fill={op.color} />
            </marker>
          </defs>
          {/* generic basemap: land, water, park, blocks */}
          <rect x="0" y="0" width={VB.w} height={VB.h} fill="#eef0ee" opacity="0.5" />
          <ellipse cx="26" cy="20" rx="34" ry="20" fill="#000" opacity="0.018" />
          <ellipse cx="74" cy="42" rx="40" ry="22" fill="#000" opacity="0.022" />
          <ellipse cx="50" cy="50" rx="60" ry="14" fill="#fff" opacity="0.18" />
          <path d="M0 0 L18 0 C 24 10, 14 20, 0 24 Z" fill="#cfe3f0" opacity="0.6" />
          <path d="M100 56 L100 30 C 88 34, 84 46, 90 56 Z" fill="#cfe3f0" opacity="0.5" />
          <rect x="60" y="4" width="16" height="14" rx="1.2" fill="#dde8d3" opacity="0.55" />
          <rect x="34" y="36" width="10" height="9" rx="0.8" fill="#dde8d3" opacity="0.4" />
          {/* city blocks */}
          {[[6,6,7,5],[15,4,8,4],[26,7,6,6],[36,3,9,5],[48,8,7,4],[58,20,8,6],[68,24,6,5],[78,18,9,7],[8,30,7,6],[20,34,8,5],[42,26,7,6],[52,32,9,5],[64,38,7,6],[86,32,8,6],[10,48,9,5],[24,46,7,5],[46,46,8,6],[72,46,8,5],[88,46,7,6]].map((b,i) => (
            <rect key={'blk'+i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx="0.6" fill="#fff" opacity="0.42" />
          ))}
          {/* street grid */}
          {Array.from({ length: 11 }).map((_, i) => <line key={'v' + i} x1={i * 10} y1="0" x2={i * 10} y2={VB.h} stroke="#fff" strokeOpacity="0.9" strokeWidth="0.5" />)}
          {Array.from({ length: 7 }).map((_, i) => <line key={'h' + i} x1="0" y1={i * 8} x2={VB.w} y2={i * 8} stroke="#fff" strokeOpacity="0.9" strokeWidth="0.5" />)}
          {Array.from({ length: 21 }).map((_, i) => <line key={'v2' + i} x1={i * 5} y1="0" x2={i * 5} y2={VB.h} stroke="#fff" strokeOpacity="0.55" strokeWidth="0.22" />)}
          {Array.from({ length: 14 }).map((_, i) => <line key={'h2' + i} x1="0" y1={i * 4} x2={VB.w} y2={i * 4} stroke="#fff" strokeOpacity="0.55" strokeWidth="0.22" />)}
          {/* arterial roads */}
          <path d="M0 44 C 20 40, 30 48, 50 42 S 80 36, 100 40" fill="none" stroke="#fff" strokeOpacity="0.95" strokeWidth="1" />
          <path d="M0 30 C 22 26, 36 32, 56 26 S 84 22, 100 26" fill="none" stroke="#fff" strokeOpacity="0.95" strokeWidth="1" />
          <path d="M0 16 C 26 13, 40 18, 60 13 S 86 9, 100 12" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="0.85" />
          <path d="M8 0 L70 56" fill="none" stroke="#f2c98a" strokeOpacity="0.8" strokeWidth="1" />
          {/* rail line */}
          <path d="M0 52 C 30 50, 55 54, 100 50" fill="none" stroke="#b9b3a6" strokeOpacity="0.7" strokeWidth="0.5" strokeDasharray="0.4 1.3" />
          {/* roundabout */}
          <circle cx="46" cy="30" r="1.6" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="0.5" />
          {/* tiny building footprints */}
          {[[9,8],[17,6],[29,9],[39,5],[51,10],[61,22],[70,26],[80,20],[11,50],[26,48],[48,48],[74,48],[90,48]].map((p,i) => (
            <rect key={'bldg'+i} x={p[0]} y={p[1]} width="0.9" height="0.9" fill="#b9c3bb" opacity="0.5" />
          ))}
          {/* coastline edge */}
          <path d="M0 24 C 8 26, 14 22, 18 16" fill="none" stroke="#a9c7d8" strokeOpacity="0.7" strokeWidth="0.4" />
          {/* coverage cones */}
          {cfg.coverage.filter(c => on[c.layer]).map((c, i) => {
            const rr = c.r * 0.6;
            return <g key={'c' + i}>
              <ellipse cx={sx(c.x)} cy={sy(c.y)} rx={rr} ry={rr * 0.62} fill={`url(#cone-${opId})`} />
              <ellipse cx={sx(c.x)} cy={sy(c.y)} rx={rr} ry={rr * 0.62} fill="none" stroke={op.color} strokeOpacity="0.45" strokeWidth="0.18" strokeDasharray="1.1 0.9" />
            </g>;
          })}
          {/* regions (perimeter glow) */}
          {cfg.regions.filter(r => on[r.layer]).map((r, i) => {
            const cx = sx(r.x + r.w / 2), cy = sy(r.y + r.h / 2), rxv = sx(r.w / 2) * 1.18, ryv = sy(r.h / 2) * 1.18;
            return <g key={'r' + i}>
              <ellipse cx={cx} cy={cy} rx={rxv} ry={ryv} fill={`url(#glow-${opId}-${i})`} />
              <ellipse cx={cx} cy={cy} rx={sx(r.w / 2)} ry={sy(r.h / 2)} fill="none" stroke={toneC[r.tone]} strokeOpacity="0.55" strokeWidth="0.3" strokeDasharray="1.6 1.1" />
            </g>;
          })}
          {/* paths (with soft glow under risk routes) */}
          {cfg.paths.filter(p => on[p.layer]).map((p, i) => (
            <g key={'p' + i}>
              {!p.dash && <path d={p.d} fill="none" stroke={toneC[p.tone]} strokeOpacity="0.18" strokeWidth="2.6" strokeLinecap="round" />}
              <path d={p.d} fill="none" stroke={toneC[p.tone]} strokeWidth="1.05" strokeLinecap="round"
                strokeDasharray={p.dash ? '2 1.4' : 'none'} style={{ cursor: p.entity ? 'pointer' : 'default' }}
                onClick={() => { if (p.pattern && onPickPattern) onPickPattern(window.AP.PAT[p.pattern]); else if (p.entity && onPickEntity) onPickEntity(p.entity); }} />
            </g>
          ))}
          {/* arrows */}
          {cfg.arrows.filter(a => on[a.layer]).map((a, i) => (
            <line key={'a' + i} x1={sx(a.x1)} y1={sy(a.y1)} x2={sx(a.x2)} y2={sy(a.y2)} stroke={op.color} strokeOpacity="0.7" strokeWidth="0.55" strokeDasharray="1.4 0.9" markerEnd={`url(#arr-${opId})`} />
          ))}
        </svg>
        {/* wind badge */}
        {cfg.wind && on[cfg.wind.layer] && (
          <div style={{ position: 'absolute', left: `${cfg.wind.x}%`, top: `${cfg.wind.y}%`, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 4, background: '#fff', borderRadius: 7, padding: '3px 8px', boxShadow: '0 2px 8px -3px rgba(16,24,40,0.3), inset 0 0 0 1px ' + T.warnBd, fontSize: 10.5, fontWeight: 700, color: T.warn }}>
            <Ic name="wind" size={12} /> {cfg.wind.label}
          </div>
        )}
        {/* markers */}
        {cfg.markers.filter(m => on[m.layer]).map(m => {
          const mc = toneC[m.tone];
          return (
            <button key={m.id} onClick={() => { if (m.pattern && onPickPattern) onPickPattern(window.AP.PAT[m.pattern]); else if (onPickEntity) onPickEntity(m.id); }}
              style={{ position: 'absolute', left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%,-50%)', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: 0 }}>
              <span style={{ position: 'relative', width: compact ? 22 : 26, height: compact ? 22 : 26, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.tone === 'risk' && <span style={{ position: 'absolute', inset: -3, borderRadius: 10, background: mc, opacity: 0.25, animation: 'ap-pulse 2s ease-out infinite' }} />}
                <span style={{ position: 'relative', width: compact ? 22 : 26, height: compact ? 22 : 26, borderRadius: 8, background: '#fff', color: mc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1.5px ${mc}, 0 3px 8px -2px rgba(16,24,40,0.32)` }}>
                  <Ic name={m.icon} size={compact ? 13 : 15} />
                </span>
              </span>
              {!compact && <span style={{ fontSize: 10, fontWeight: 700, color: T.text, background: 'rgba(255,255,255,0.92)', borderRadius: 5, padding: '1px 5px', whiteSpace: 'nowrap', boxShadow: `inset 0 0 0 1px ${T.bd}` }}>{m.label}</span>}
            </button>
          );
        })}
        {/* legend */}
        {!compact && (
          <div style={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', flexDirection: 'column', gap: 5, background: 'rgba(255,255,255,0.92)', borderRadius: 8, padding: '8px 11px', boxShadow: `0 4px 12px -4px rgba(16,24,40,0.22), inset 0 0 0 1px ${T.bd}` }}>
            {[['risk', op.kind === 'real-time' ? 'Elevated risk' : 'Priority entity'], ['dev', 'Developing'], [op.kind === 'real-time' ? 'fire' : 'orion', op.kind === 'real-time' ? 'Fire perimeter' : 'Recent activity'], ['ready', 'Confirmed / fresh']].map(([k, lbl]) => (
              <span key={lbl} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10, fontWeight: 600, color: T.text2 }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: toneC[k] }} /> {lbl}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// ──────────────── Relationship graph ────────────────
const CONF_RANK = { 'High': 3, 'Medium-High': 2, 'Medium': 1 };
function RelationshipGraph({ graph, onPickNode, onPickEdge, height = 420, compact }) {
  const { ENT } = window.AP;
  const [minConf, setMinConf] = React.useState('All');
  const [mode, setMode] = React.useState('current');
  const VB = { w: 100, h: 100 };
  const N = Object.fromEntries(graph.nodes.map(n => [n.id, n]));
  const showEdge = (e) => {
    if (minConf !== 'All' && CONF_RANK[e.conf] < CONF_RANK[minConf]) return false;
    if (mode === 'current' && e.rel === 'Historical relationship') return false;
    return true;
  };
  const NODE_TONE = { person: '#dc2626', device: '#be185d', vehicle: '#7c3aed', facility: '#0891b2', route: '#c2410c', package: '#15803d' };

  return (
    <Card style={{ overflow: 'hidden' }}>
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '13px 16px', borderBottom: `1px solid ${T.bd}` }}>
          <Ic name="gitBranch" size={16} color={T.acc} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>Entity relationship graph</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {['current', 'all'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 7, fontFamily: T.font, fontSize: 11.5, fontWeight: 700,
                background: mode === m ? '#d1e9ff' : '#f5f5f5', color: mode === m ? T.accHi : T.text3, boxShadow: mode === m ? 'inset 0 0 0 1px #84caff' : `inset 0 0 0 1px ${T.bd}` }}>
                {m === 'current' ? 'Current activity' : 'With history'}
              </button>
            ))}
            {['All', 'Medium-High', 'High'].map(c => (
              <button key={c} onClick={() => setMinConf(c)} style={{ border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 7, fontFamily: T.font, fontSize: 11.5, fontWeight: 700,
                background: minConf === c ? '#eff6ff' : '#fff', color: minConf === c ? T.accHi : T.text3, boxShadow: `inset 0 0 0 1px ${minConf === c ? '#bfdbfe' : T.bd}` }}>{c === 'All' ? 'All conf.' : c}</button>
            ))}
          </span>
        </div>
      )}
      <div style={{ position: 'relative', height, background: 'radial-gradient(circle at 50% 40%, #fbfcfd, #f1f3f6)' }}>
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {graph.edges.filter(showEdge).map((e, i) => {
            const a = N[e.a], b = N[e.b]; if (!a || !b) return null;
            const hist = e.rel === 'Historical relationship';
            const rank = CONF_RANK[e.conf] || 1;
            const ec = hist ? T.bdHi : (rank >= 3 ? '#1570ef' : (rank === 2 ? '#5aa2e8' : '#b9c9e0'));
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ec} strokeOpacity={hist ? 0.7 : 0.85} strokeWidth={rank >= 3 ? 0.65 : (rank === 2 ? 0.45 : 0.3)} strokeLinecap="round" strokeDasharray={hist ? '1.6 1.2' : 'none'}
              style={{ cursor: onPickEdge ? 'pointer' : 'default' }} onClick={() => onPickEdge && onPickEdge(e)} />;
          })}
        </svg>
        {graph.nodes.map(n => {
          const ent = ENT[n.id]; const c = NODE_TONE[n.kind] || T.acc;
          return (
            <button key={n.id} onClick={() => onPickNode && onPickNode(n.id)}
              onMouseEnter={e => { const s = e.currentTarget.firstChild; if (s) s.style.transform = 'scale(1.12)'; }}
              onMouseLeave={e => { const s = e.currentTarget.firstChild; if (s) s.style.transform = 'scale(1)'; }}
              style={{ position: 'absolute', left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: 0, width: 92 }}>
              <span style={{ width: compact ? 27 : 32, height: compact ? 27 : 32, borderRadius: 9, background: `linear-gradient(180deg,#fff,${c}0c)`, color: c, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1.5px ${c}, 0 3px 9px -2px ${c}55`, transition: 'transform .14s cubic-bezier(0.16,1,0.3,1)' }}>
                <Ic name={(ent && ent.icon) || 'crosshair'} size={compact ? 14 : 17} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: T.text, background: 'rgba(255,255,255,0.92)', borderRadius: 5, padding: '1px 5px', whiteSpace: 'nowrap', boxShadow: `inset 0 0 0 1px ${T.bd}` }}>{n.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ──────────────── Source coverage matrix / heatmap ────────────────
function CoverageMatrix({ rows }) {
  const cols = [['fresh', 'Freshness'], ['conf', 'Confidence'], ['quality', 'Coverage'], ['gap', 'Current gap']];
  return (
    <div>
      <Card style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.font }}>
          <thead><tr style={{ background: '#fafafa', borderBottom: `1px solid ${T.bd}` }}>
            <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: T.text3 }}>Source vector</th>
            {cols.map(c => <th key={c[0]} style={{ textAlign: 'center', padding: '10px 8px', fontSize: 11, fontWeight: 700, color: T.text3, whiteSpace: 'nowrap' }}>{c[1]}</th>)}
            <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: T.text3 }}>Owner</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
                <td style={{ padding: '11px 16px', fontSize: 12.5, fontWeight: 700, color: T.text, whiteSpace: 'nowrap' }}>{r.source}</td>
                {cols.map(c => {
                  const st = r.cells[c[0]];
                  return <td key={c[0]} style={{ padding: '9px 8px', textAlign: 'center' }}>
                    <span title={STATE_LABEL[st]} style={{ display: 'inline-block', width: 22, height: 22, borderRadius: 6, background: STATE_BG[st], boxShadow: `inset 0 0 0 1.5px ${STATE_C[st]}` }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: STATE_C[st], marginTop: 7 }} />
                    </span>
                  </td>;
                })}
                <td style={{ padding: '11px 16px', fontSize: 12, color: T.text2, whiteSpace: 'nowrap' }}>{r.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div style={{ display: 'flex', gap: 16, marginTop: 11, flexWrap: 'wrap' }}>
        {Object.keys(STATE_C).map(k => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: T.text3, fontWeight: 600 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: STATE_C[k] }} /> {STATE_LABEL[k]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ──────────────── Distribution matrix ────────────────
const DIST_TONE = { 'Ready': 'ready', 'Distributed': 'ready', 'Draft Ready': 'accent', 'Draft': 'mon', 'Needs Review': 'warn', 'Expiring soon': 'risk' };
function DistributionMatrix({ rows }) {
  return (
    <Card style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.font, minWidth: 760 }}>
          <thead><tr style={{ background: '#fafafa', borderBottom: `1px solid ${T.bd}` }}>
            {['Audience', 'Included sections', 'Restricted sections', 'Status', 'Freshness req.', 'Traceability'].map(c => <th key={c} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: T.text3, whiteSpace: 'nowrap' }}>{c}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${T.bd}` }}>
                <td style={{ padding: '12px 16px', fontSize: 12.5, fontWeight: 700, color: T.text, whiteSpace: 'nowrap' }}>{r.audience}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 240 }}>{r.included.map(s => <Pill key={s} tone="ready" size="xs">{s}</Pill>)}</span></td>
                <td style={{ padding: '12px 16px' }}><span style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 200 }}>{r.restrictedSections.length ? r.restrictedSections.map(s => <Pill key={s} tone="risk" size="xs">{s}</Pill>) : <span style={{ fontSize: 12, color: T.text4 }}>None</span>}</span></td>
                <td style={{ padding: '12px 16px' }}><Pill tone={DIST_TONE[r.status] || 'neutral'} size="xs" dot>{r.status}</Pill></td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: T.text2, whiteSpace: 'nowrap' }}>{r.freshnessReq}</td>
                <td style={{ padding: '12px 16px' }}>{r.traceability ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: T.ready }}><Ic name="checkCircle" size={14} /> Retained</span> : <span style={{ fontSize: 12, color: T.text4 }}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ──────────────── Persistence lifecycle diagram ────────────────
function PersistenceLifecycle({ steps, color, title, subtitle, icon }) {
  return (
    <Card style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, background: `${color}16`, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic name={icon} size={17} /></span>
        <div><div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{title}</div><div style={{ fontSize: 12, color: T.text3 }}>{subtitle}</div></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
              <span style={{ width: 24, height: 24, borderRadius: 7, background: i === 0 ? color : '#fff', color: i === 0 ? '#fff' : color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, boxShadow: `inset 0 0 0 1.5px ${color}` }}>{i + 1}</span>
              {i < steps.length - 1 && <span style={{ width: 2, flex: 1, background: `${color}40`, minHeight: 16 }} />}
            </div>
            <div style={{ paddingBottom: i < steps.length - 1 ? 14 : 0, paddingTop: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text2, lineHeight: 1.4 }}>{s}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ──────────────── Pattern timeline ────────────────
const TL_TONE = { signal: T.acc, maturity: T.ready, report: '#7c3aed', distribution: '#0891b2' };
const TL_ICON = { signal: 'signal', maturity: 'checkCircle', report: 'fileText', distribution: 'send' };
function PatternTimeline({ events, axis }) {
  return (
    <div>
      <div style={{ position: 'relative', paddingLeft: 4 }}>
        <div style={{ position: 'absolute', left: 13, top: 8, bottom: 8, width: 2, background: T.bd }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {events.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, flex: 'none', background: '#fff', color: TL_TONE[e.kind] || T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 0 1.5px ${TL_TONE[e.kind] || T.acc}`, zIndex: 1 }}><Ic name={TL_ICON[e.kind] || 'signal'} size={14} /></span>
              <span style={{ flex: 1, fontSize: 12.5, color: T.text2, fontWeight: e.kind !== 'signal' ? 700 : 500, lineHeight: 1.4 }}>{e.label}</span>
              <span style={{ fontSize: 11, color: T.text4, fontVariantNumeric: 'tabular-nums', flex: 'none' }}>{e.t}</span>
            </div>
          ))}
        </div>
      </div>
      {axis && <div style={{ fontSize: 11, color: T.text4, marginTop: 10, fontWeight: 600 }}>{axis}</div>}
    </div>
  );
}

// ──────────────── Mini map (static preview) ────────────────
function MiniMap({ opId, height = 130 }) {
  return <div style={{ pointerEvents: 'none' }}><OperationMap opId={opId} height={height} compact /></div>;
}

// ──────────────── Chart panel wrapper ────────────────
function ChartPanel({ title, sub, icon, accent, children, style }) {
  return (
    <Card style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <Ic name={icon} size={15} color={accent || T.acc} />}
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{title}</span>
        {sub && <span style={{ fontSize: 11.5, color: T.text3, marginLeft: 'auto' }}>{sub}</span>}
      </div>
      {children}
    </Card>
  );
}

Object.assign(window, {
  BarChart, DonutChart, HBars, Sparkline, OperationMap, RelationshipGraph,
  CoverageMatrix, DistributionMatrix, PersistenceLifecycle, PatternTimeline, MiniMap, ChartPanel,
  STATE_C, STATE_BG, STATE_LABEL, DIST_TONE,
});
})();
