import React, { useState } from 'react';

const UserCard = ({ user, onAction, reviewMode, requestId, connectionMode, onUnfollow, sentMode, onCancel }) => {
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (status, id) => {
    if (!onAction) return;
    setActionLoading(status);
    try {
      await onAction(status, id);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div 
      className="user-card"
      style={{
        backgroundColor: 'var(--surface-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'row',
        gap: '1.5rem',
        alignItems: 'flex-start'
      }}
    >
      {/* Avatar (Left side) */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        flexShrink: 0
      }}>
        {user.photoUrl ? (
          <img 
            src={user.photoUrl} 
            alt={user.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Content (Right side) */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header Info */}
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
          {user.name}
        </h3>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', margin: '0 0 0.75rem 0', fontWeight: '500' }}>
          {[user.age ? `${user.age} yrs` : null, user.gender].filter(Boolean).join(' • ') || 'Developer'}
        </p>

        {/* Description */}
        <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
          {user.about || "No description provided."}
        </p>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {user.skills.map((skill, index) => (
              <span key={index} style={{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: 'var(--text-primary)',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '500',
                border: '1px solid var(--border-color)'
              }}>
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Feed Mode Actions (Connect / Pass) */}
        {onAction && !reviewMode && !connectionMode && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', gap: '1rem' }}>
             <button 
              onClick={() => handleAction('not_interested', user._id)}
              disabled={actionLoading !== null}
              className="card-btn-pass"
              style={{ 
                backgroundColor: 'transparent', 
                color: 'var(--text-secondary)', 
                border: '2px solid var(--border-color)', 
                padding: '0.5rem 1.25rem', 
                borderRadius: 'var(--radius-md)', 
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading === 'not_interested' ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}>
              {actionLoading === 'not_interested' ? '...' : '✕  Pass'}
            </button>
            <button 
              onClick={() => handleAction('interested', user._id)}
              disabled={actionLoading !== null}
              className="card-btn-connect"
              style={{ 
                backgroundColor: '#6366f1', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1.25rem', 
                borderRadius: 'var(--radius-md)', 
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading === 'interested' ? 0.6 : 1,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
              }}>
              {actionLoading === 'interested' ? '...' : '🤝  Connect'}
            </button>
          </div>
        )}

        {/* Review Mode Actions (Accept / Reject) */}
        {onAction && reviewMode && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', gap: '1rem' }}>
            <button 
              onClick={() => handleAction('rejected', requestId)}
              disabled={actionLoading !== null}
              className="card-btn-reject"
              style={{ 
                backgroundColor: 'transparent', 
                color: '#ef4444', 
                border: '2px solid #ef4444', 
                padding: '0.5rem 1.25rem', 
                borderRadius: 'var(--radius-md)', 
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading === 'rejected' ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}>
              {actionLoading === 'rejected' ? '...' : '✕  Reject'}
            </button>
            <button 
              onClick={() => handleAction('accepted', requestId)}
              disabled={actionLoading !== null}
              className="card-btn-accept"
              style={{ 
                backgroundColor: '#10b981', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1.25rem', 
                borderRadius: 'var(--radius-md)', 
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading === 'accepted' ? 0.6 : 1,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}>
              {actionLoading === 'accepted' ? '...' : '✓  Accept'}
            </button>
          </div>
        )}

        {/* Connection Mode (Unfollow) */}
        {connectionMode && onUnfollow && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', gap: '1rem', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              ✓ Connected
            </span>
            <button
              onClick={onUnfollow}
              className="card-btn-reject"
              style={{
                backgroundColor: 'transparent',
                color: '#ef4444',
                border: '1.5px solid #ef4444',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Unfollow
            </button>
          </div>
        )}

        {/* Sent Mode Actions (Cancel Request) */}
        {sentMode && onCancel && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', gap: '1rem', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              ⏳ Pending
            </span>
            <button
              onClick={async () => {
                setActionLoading('cancel');
                try {
                  await onCancel(requestId);
                } finally {
                  setActionLoading(null);
                }
              }}
              disabled={actionLoading !== null}
              className="card-btn-reject"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1.5px solid var(--border-color)',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              {actionLoading === 'cancel' ? '...' : 'Cancel Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
