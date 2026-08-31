import React, { useState, useEffect, useRef } from 'react';
import { SAFETY_GUIDANCE } from '../../utils/safetyGuidanceData';

// Ahnaf — Safety Guidance Banner Component
// Renders dynamically when a resident selects a complaint/issue category.
// severity: 'critical' | 'warning' | 'info'

const SEVERITY_STYLES = {
  critical: {
    bg: 'rgba(220, 38, 38, 0.08)',
    border: 'rgba(220, 38, 38, 0.4)',
    badge: { bg: 'rgba(220, 38, 38, 0.15)', color: '#ef4444', border: 'rgba(220, 38, 38, 0.5)' },
    titleColor: '#ef4444',
    actionDot: '#ef4444',
    doNotDot: '#f97316',
    hotlineBg: 'rgba(220, 38, 38, 0.12)',
    hotlineBorder: 'rgba(220, 38, 38, 0.3)',
    hotlineColor: '#ef4444',
    label: 'CRITICAL EMERGENCY',
  },
  warning: {
    bg: 'rgba(234, 179, 8, 0.07)',
    border: 'rgba(234, 179, 8, 0.35)',
    badge: { bg: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: 'rgba(234, 179, 8, 0.4)' },
    titleColor: '#eab308',
    actionDot: '#eab308',
    doNotDot: '#f97316',
    hotlineBg: 'rgba(234, 179, 8, 0.1)',
    hotlineBorder: 'rgba(234, 179, 8, 0.3)',
    hotlineColor: '#eab308',
    label: 'SAFETY WARNING',
  },
  info: {
    bg: 'rgba(14, 165, 233, 0.06)',
    border: 'rgba(14, 165, 233, 0.3)',
    badge: { bg: 'rgba(14, 165, 233, 0.12)', color: '#38bdf8', border: 'rgba(14, 165, 233, 0.35)' },
    titleColor: '#38bdf8',
    actionDot: '#38bdf8',
    doNotDot: '#fb923c',
    hotlineBg: 'rgba(14, 165, 233, 0.08)',
    hotlineBorder: 'rgba(14, 165, 233, 0.25)',
    hotlineColor: '#38bdf8',
    label: 'ADVISORY',
  },
};

function SafetyGuidanceBanner({ issueKey, compact = false }) {
  const [visible, setVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const prevKey = useRef(null);

  const guidance = issueKey ? SAFETY_GUIDANCE[issueKey] : null;

  // Animate in on key change
  useEffect(() => {
    if (!issueKey) {
      setVisible(false);
      setCheckedItems([]);
      return;
    }
    if (prevKey.current !== issueKey) {
      setVisible(false);
      setCheckedItems([]);
      const timer = setTimeout(() => setVisible(true), 50);
      prevKey.current = issueKey;
      return () => clearTimeout(timer);
    }
    setVisible(true);
  }, [issueKey]);

  if (!guidance) return null;

  const s = SEVERITY_STYLES[guidance.severity] || SEVERITY_STYLES.info;

  const toggleCheck = (idx) => {
    setCheckedItems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const allChecked = checkedItems.length === guidance.actions.length;

  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: '14px',
        padding: compact ? '14px 16px' : '18px 20px',
        marginTop: '12px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      role="alert"
      aria-live="polite"
    >
      {/* ── Header ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: compact ? '20px' : '26px', lineHeight: 1 }}>{guidance.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                padding: '2px 8px',
                borderRadius: '99px',
                background: s.badge.bg,
                color: s.badge.color,
                border: `1px solid ${s.badge.border}`,
              }}
            >
              {s.label}
            </span>
          </div>
          <p
            style={{
              color: s.titleColor,
              fontWeight: 800,
              fontSize: compact ? '12px' : '13px',
              marginTop: '3px',
              lineHeight: 1.3,
            }}
          >
            {guidance.title}
          </p>
        </div>
      </div>

      {/* ── Summary ────────────────────────────────── */}
      <p
        style={{
          color: '#94a3b8',
          fontSize: '11px',
          lineHeight: 1.6,
          borderLeft: `2px solid ${s.border}`,
          paddingLeft: '10px',
          margin: 0,
        }}
      >
        {guidance.summary}
      </p>

      {/* ── Immediate Actions Checklist ───────────── */}
      {!compact && (
        <div>
          <p
            style={{
              color: '#64748b',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            ✅ Immediate Actions — Check each off as you complete them:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {guidance.actions.map((action, idx) => {
              const done = checkedItems.includes(idx);
              return (
                <label
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '5px 8px',
                    borderRadius: '8px',
                    background: done ? 'rgba(34,197,94,0.07)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleCheck(idx)}
                    style={{ marginTop: '1px', accentColor: '#22c55e', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      color: done ? '#22c55e' : '#cbd5e1',
                      textDecoration: done ? 'line-through' : 'none',
                      opacity: done ? 0.7 : 1,
                      lineHeight: 1.5,
                      transition: 'color 0.2s',
                    }}
                  >
                    {action}
                  </span>
                </label>
              );
            })}
          </div>
          {allChecked && (
            <div
              style={{
                marginTop: '8px',
                padding: '6px 10px',
                borderRadius: '8px',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#22c55e',
                fontSize: '10px',
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              ✓ You have completed all safety steps. Please now submit your complaint.
            </div>
          )}
        </div>
      )}

      {/* ── DO NOT list (compact: show, full: show) ── */}
      {guidance.doNots && guidance.doNots.length > 0 && (
        <div>
          <p
            style={{
              color: '#64748b',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              marginBottom: '5px',
              textTransform: 'uppercase',
            }}
          >
            🚫 Do NOT:
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {guidance.doNots.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                <span style={{ color: s.doNotDot, fontSize: '10px', marginTop: '1px', flexShrink: 0 }}>✕</span>
                <span style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.5 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Emergency Hotlines ───────────────────── */}
      {guidance.hotlines && guidance.hotlines.length > 0 && (
        <div>
          <p
            style={{
              color: '#64748b',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            📞 Emergency Hotlines:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {guidance.hotlines.map((h, idx) => (
              <a
                key={idx}
                href={`tel:${h.number}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '99px',
                  background: s.hotlineBg,
                  border: `1px solid ${s.hotlineBorder}`,
                  color: s.hotlineColor,
                  fontSize: '11px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  letterSpacing: '0.03em',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <span>📞</span>
                <span>{h.label}: {h.number}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SafetyGuidanceBanner;
