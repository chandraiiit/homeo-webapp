'use client';

import { useCaseStore } from "../store/case.store";


interface Props {
  onAnalyze: () => void;
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6" />
      <path d="M9 3v8l-4 9h14l-4-9V3" />
    </svg>
  );
}

export function CaseTray({ onAnalyze }: Props) {
  const { items, removeRubric, clearCase } = useCaseStore();

  return (
    <aside style={{
      width:         '300px',
      flexShrink:    0,
      borderLeft:    '1px solid var(--border)',
      background:    'var(--cream)',
      display:       'flex',
      flexDirection: 'column',
      height:        '100%',
      overflow:      'hidden',
    }}>

      {/* Header */}
      <div style={{
        padding:      '18px 20px 14px',
        borderBottom: '1px solid var(--border)',
        flexShrink:   0,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize:   '18px',
          fontWeight: 500,
          color:      'var(--charcoal)',
        }}>
          Case Tray
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
          {items.length === 0
            ? 'No symptoms selected'
            : `${items.length} symptom${items.length !== 1 ? 's' : ''} selected`}
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {items.length === 0 ? (
          <div style={{
            textAlign:  'center',
            padding:    '40px 16px',
            color:      'var(--muted)',
            fontSize:   '13px',
            lineHeight: 1.6,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px', opacity: 0.4 }}>🌿</div>
            <div>Select rubrics from the list to build your case for repertorization.</div>
          </div>
        ) : (
          items.map((item) => {
            const nameParts = [
              item.rubric.section,
              item.rubric.subsection,
            ].filter(Boolean);

            return (
              <div
                key={item.rubric.id}
                style={{
                  background:    'white',
                  border:        '1px solid var(--border)',
                  borderRadius:  'var(--r-sm)',
                  padding:       '10px 12px',
                  marginBottom:  '8px',
                  display:       'flex',
                  alignItems:    'flex-start',
                  justifyContent: 'space-between',
                  gap:           '8px',
                  animation:     'slideUp 0.2s ease forwards',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily:  'var(--font-display)',
                    fontSize:    '14px',
                    fontWeight:  500,
                    color:       'var(--charcoal)',
                    lineHeight:  1.3,
                    overflow:    'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:  'nowrap',
                  }}>
                    {nameParts.join(' › ')}
                  </div>
                  <div style={{
                    fontSize:   '10px',
                    color:      'var(--muted)',
                    marginTop:  '3px',
                  }}>
                    {item.chapter.name}
                  </div>
                </div>

                <button
                  onClick={() => removeRubric(item.rubric.id)}
                  style={{
                    background:  'none',
                    border:      'none',
                    color:       'var(--muted)',
                    cursor:      'pointer',
                    padding:     '2px',
                    flexShrink:  0,
                    display:     'flex',
                    alignItems:  'center',
                    transition:  'color 0.12s ease',
                    marginTop:   '2px',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#c0392b';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)';
                  }}
                >
                  <XIcon />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding:       '14px 16px',
        borderTop:     '1px solid var(--border)',
        flexShrink:    0,
        display:       'flex',
        flexDirection: 'column',
        gap:           '8px',
      }}>
        <button
          onClick={onAnalyze}
          disabled={items.length === 0}
          style={{
            width:          '100%',
            padding:        '11px',
            border:         'none',
            borderRadius:   'var(--r-sm)',
            background:     items.length > 0 ? 'var(--sage)' : 'var(--muted)',
            color:          'white',
            fontFamily:     'var(--font-body)',
            fontSize:       '13.5px',
            fontWeight:     500,
            cursor:         items.length > 0 ? 'pointer' : 'not-allowed',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '7px',
            transition:     'background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (items.length > 0)
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--sage-dark)';
          }}
          onMouseLeave={(e) => {
            if (items.length > 0)
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--sage)';
          }}
        >
          <FlaskIcon />
          Repertorize ({items.length})
        </button>

        {items.length > 0 && (
          <button
            onClick={clearCase}
            style={{
              width:        '100%',
              padding:      '8px',
              border:       '1px solid var(--border-strong)',
              borderRadius: 'var(--r-sm)',
              background:   'none',
              color:        'var(--muted)',
              fontFamily:   'var(--font-body)',
              fontSize:     '12px',
              cursor:       'pointer',
              transition:   'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--sage-light)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--sage-dark)';
              (e.currentTarget as HTMLButtonElement).style.background = 'white';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)';
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            Clear all
          </button>
        )}
      </div>

    </aside>
  );
}