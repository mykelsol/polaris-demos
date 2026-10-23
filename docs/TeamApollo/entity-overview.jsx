// Polaris — Entity Overview (entity header + Top Patterns + Monitoring Coverage)

function EntityOverview({ entityId, onPickPattern, onJumpToTab, onManageMonitoring }) {
  const { entities, entityProfiles, patterns, agents, entityGroups } = window.POLARIS_DATA;
  const entity = entities.find(e => e.id === entityId);
  const profile = entityProfiles?.[entityId];

  if (!entity) return null;

  // Insight-Ready patterns whose entitiesFull (or entities) list contains this entity name.
  const myPatterns = React.useMemo(() => {
    const name = entity.name;
    return patterns
      .filter(p => p.maturity === 'Insight-Ready')
      .filter(p => (p.entitiesFull || p.entities || []).some(en => en === name))
      .slice(0, 4);
  }, [patterns, entity.name]);

  // Resolve the entity group's icon for the header avatar.
  const group = (entityGroups || []).find(g => g.entityIds && g.entityIds.includes(entityId));
  const headerIcon = group?.icon || (entity.kind === 'commodity' ? 'chart-breakout-square' : 'building-07');
  const accent = entity.kind === 'commodity' ? '#0891b2' : '#1570ef';

  const monitoring = profile?.monitoring || [];
  const narrative = profile?.narrative || `Monitoring activity, agents, and patterns associated with ${entity.name}.`;
  const footprint = profile?.footprint || entity.lens;
  const updated   = profile?.updated   || 'recently';
  const contributing = profile?.agentsContributing ?? 0;

  return (
    <div style={{ padding: '24px 32px 32px' }}>
      {/* Entity header card */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
        padding: '22px 24px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <EntityMonogram name={entity.name} icon={headerIcon} accent={accent} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 22, fontWeight: 700, color: '#171717',
              letterSpacing: '-0.01em', lineHeight: 1.2,
            }}>{entity.name}</div>
            <div style={{
              marginTop: 6,
              fontSize: 13, color: '#525252', lineHeight: 1.6,
            }}>
              <span style={{ fontWeight: 700, color: '#171717' }}>
                {entity.kind === 'commodity' ? 'Category Footprint' : 'Supply Footprint'}:
              </span>{' '}
              {footprint}
              {'  ·  '}{contributing} agent{contributing === 1 ? '' : 's'} contributing
              {'  ·  '}Updated {updated}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onManageMonitoring}>Manage Monitoring</Button>
        </div>
        <p style={{
          margin: '16px 0 0',
          fontSize: 14, color: '#404040', lineHeight: 1.6,
        }}>{narrative}</p>
      </div>

      {/* Two-column body */}
      <div style={{
        marginTop: 16,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: 16,
      }}>
        {/* Top Patterns */}
        <div style={{
          background: '#fff', borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
          overflow: 'hidden',
        }}>
          <CardHeader
            title="Top Patterns"
            subtitle={myPatterns.length ? `${myPatterns.length} Insight-Ready for ${entity.name}` : null}
            action={myPatterns.length ? <Button variant="link" trailingIcon="arrow-up-right" onClick={() => onJumpToTab('patterns')}>View all</Button> : null}
          />
          {myPatterns.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#737373', borderTop: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 700, color: '#404040', fontSize: 14, marginBottom: 4 }}>No Insight-Ready patterns yet</div>
              Patterns are promoted to Insight-Ready once agents detect enough corroborating signals.
            </div>
          ) : (
            myPatterns.map((p, i) => (
              <EntityPatternRow
                key={p.id}
                pattern={p}
                entityName={entity.name}
                onOpen={() => onPickPattern(p)}
                first={i === 0}
              />
            ))
          )}
        </div>

        {/* Monitoring Coverage */}
        <div style={{
          background: '#fff', borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 0 0 1px #e5e5e5',
          padding: '18px 18px 16px',
          alignSelf: 'start',
        }}>
          <div style={{
            fontSize: 15, fontWeight: 700, color: '#171717', marginBottom: 12,
          }}>Monitoring Coverage</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {monitoring.map(m => (
              <MonitoringRow key={m.label} label={m.label} status={m.status} />
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Button variant="secondary" size="sm" leadingIcon="plus" onClick={onManageMonitoring}>
              Add Monitoring Focus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────── Entity header monogram ────────────────
function EntityMonogram({ name, icon, accent }) {
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 10,
      background: `${accent}14`,
      color: accent,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flex: 'none',
      boxShadow: `inset 0 0 0 1px ${accent}33`,
    }}>
      <Icon name={icon} size={26} />
    </div>
  );
}

// ──────────────── Pattern row inside Top Patterns ────────────────
function EntityPatternRow({ pattern, entityName, onOpen, first }) {
  const [hover, setHover] = React.useState(false);
  const meta = [
    entityName,
    pattern.type,
    `${pattern.supportingSignals?.length ?? 0} signals`,
    `${pattern.strength} Strength`,
    `Updated ${pattern.updated}`,
  ].filter(Boolean);

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '18px 24px',
        borderTop: first ? '1px solid #f0f0f0' : '1px solid #f5f5f5',
        cursor: 'pointer',
        transition: 'background .12s',
        background: hover ? '#fafafa' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              fontSize: 15, fontWeight: 700, color: '#171717', lineHeight: 1.35, flex: 1,
            }}>{pattern.title}</div>
            <MaturityPill value={pattern.maturity} />
          </div>
          <div style={{
            marginTop: 6, fontSize: 12, color: '#737373',
            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
          }}>
            {meta.map((m, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: '#d4d4d4' }}>·</span>}
                <span>{m}</span>
              </React.Fragment>
            ))}
          </div>
          <p style={{
            margin: '10px 0 0',
            fontSize: 13, color: '#525252', lineHeight: 1.55,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{pattern.whatChanged || pattern.supportingIntro}</p>
          <div style={{
            marginTop: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }} onClick={e => e.stopPropagation()}>
            <Button
              variant="secondary" size="sm"
              onClick={() => pattern.insightUrl
                ? window.open(pattern.insightUrl, '_blank', 'noopener,noreferrer')
                : onOpen()}
            >Generate Risk Report</Button>
            <div style={{ display: 'flex', gap: 4 }}>
              <PatternRowIconButton icon="bookmark" title="Save" />
              <PatternRowIconButton icon="archive" title="Archive" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatternRowIconButton({ icon, title }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 32, height: 32, borderRadius: 8,
        background: '#fff', border: 'none', cursor: 'pointer',
        color: '#737373',
        boxShadow: hover
          ? '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.04), inset 0 0 0 1px #d4d4d4'
          : '0 1px 2px 0 rgba(0,0,0,0.05), inset 0 -2px 0 0 rgba(0,0,0,0.05), inset 0 0 0 1px #d4d4d4',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'box-shadow .12s',
      }}
    >
      {icon === 'bookmark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.66" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.66" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
      )}
    </button>
  );
}

// ──────────────── Monitoring row ────────────────
function MonitoringRow({ label, status }) {
  const active = status === 'active';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: active ? '#15803d' : '#d4d4d4',
          flex: 'none',
        }} />
        <span style={{
          fontSize: 13, fontWeight: 600, color: '#171717',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{label}</span>
      </div>
      <CoveragePill active={active} />
    </div>
  );
}

function CoveragePill({ active }) {
  const style = active
    ? { color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0' }
    : { color: '#737373', background: '#fafafa', border: '1px solid #e5e5e5' };
  return (
    <span style={{
      ...style,
      fontSize: 11, fontWeight: 700,
      padding: '2px 8px', borderRadius: 9999,
      whiteSpace: 'nowrap', flex: 'none',
    }}>{active ? 'Active' : 'Not Configured'}</span>
  );
}

Object.assign(window, { EntityOverview });
