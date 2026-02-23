'use client';

import { useChapters } from "../hooks/useChapters";
import { useCaseStore } from "../store/case.store";


interface Props {
  activeChapterId?: number;
  onSelect:         (id: number) => void;
  onAnalyze:        () => void;
}

export function Sidebar({ activeChapterId, onSelect, onAnalyze }: Props) {
  const { data: chapters = [], isLoading } = useChapters();
  const items = useCaseStore((s) => s.items);

  return (
    <aside style={{
      width:          '240px',
      flexShrink:     0,
      background:     'var(--cream)',
      borderRight:    '1px solid var(--border)',
      display:        'flex',
      flexDirection:  'column',
      height:         '100vh',
      overflow:       'hidden',
    }}>

      {/* Logo */}
      <div style={{
        padding:      '24px 20px 16px',
        borderBottom: '1px solid var(--border)',
        flexShrink:   0,
      }}>
        <div style={{
          fontFamily:  'var(--font-display)',
          fontSize:    '22px',
          fontWeight:  600,
          color:       'var(--sage-dark)',
          letterSpacing: '0.5px',
        }}>
          Homeo<span style={{ color: 'var(--gold)' }}>.</span>mvp
        </div>
        <div style={{
          fontSize:      '10px',
          color:         'var(--muted)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginTop:     '3px',
        }}>
          Repertorization Engine
        </div>
      </div>

      {/* Chapter list */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        <div style={{
          fontSize:      '9px',
          fontWeight:    500,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color:         'var(--muted)',
          padding:       '8px 20px 6px',
        }}>
          Chapters
        </div>

        {isLoading ? (
          <div style={{ padding: '20px', color: 'var(--muted)', fontSize: '13px' }}>
            Loading…
          </div>
        ) : (
          chapters.map((ch) => {
            const isActive = ch.id === activeChapterId;
            return (
              <div
                key={ch.id}
                onClick={() => onSelect(ch.id)}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'space-between',
                  padding:        '9px 20px',
                  cursor:         'pointer',
                  fontSize:       '13.5px',
                  color:          isActive ? 'var(--sage-dark)' : 'var(--charcoal-soft)',
                  background:     isActive ? 'rgba(107,124,92,0.12)' : 'transparent',
                  borderLeft:     isActive ? '2px solid var(--sage)' : '2px solid transparent',
                  fontWeight:     isActive ? 500 : 400,
                  transition:     'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--cream-dark)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }
                }}
              >
                <span>{ch.name}</span>
              </div>
            );
          })
        )}
      </nav>

      {/* Footer — case tray trigger */}
      <div style={{
        padding:    '16px 20px',
        borderTop:  '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <button
          onClick={onAnalyze}
          disabled={items.length === 0}
          style={{
            width:          '100%',
            background:     items.length > 0 ? 'var(--sage)' : 'var(--muted)',
            color:          'white',
            border:         'none',
            borderRadius:   'var(--r-sm)',
            padding:        '10px 14px',
            fontFamily:     'var(--font-body)',
            fontSize:       '13px',
            fontWeight:     500,
            cursor:         items.length > 0 ? 'pointer' : 'not-allowed',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            transition:     'background 0.15s ease',
          }}
        >
          <span>Repertorize</span>
          {items.length > 0 && (
            <span style={{
              background:   'var(--gold)',
              color:        'white',
              borderRadius: '20px',
              padding:      '1px 8px',
              fontSize:     '11px',
              fontWeight:   600,
            }}>
              {items.length}
            </span>
          )}
        </button>
      </div>

    </aside>
  );
}