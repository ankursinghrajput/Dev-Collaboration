import React from 'react';

const UserCard = ({ user, onAction }) => {
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

        {/* Footer Actions */}
        {onAction && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', gap: '1rem' }}>
             <button 
              onClick={() => onAction('not_interested', user._id)}
              style={{ 
              backgroundColor: 'transparent', 
              color: 'var(--text-secondary)', 
              border: '2px solid var(--border-color)', 
              padding: '0.5rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Pass
            </button>
            <button 
              onClick={() => onAction('interested', user._id)}
              style={{ 
              backgroundColor: '#1d8082', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Connect & Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
