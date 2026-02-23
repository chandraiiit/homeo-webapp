'use client';

import { useAnalysis } from "../hooks/useAnalysis";
import { useCaseStore } from "../store/case.store";

interface Props {
  onBack: () => void;
}

function Spinner() {
  return (
    <div style={{
      width:        '28px',
      height:       '28px',
      border:       '2px solid var(--border)',
      borderTop:    '2px solid var(--sage)',
      borderRadius: '50%',
      animation:    'spin 0.7s linear infinite',
    }} />
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function getRankStyle(index: number): React.CSSProperties {
  if (index === 0) return { background: 'var(--gold)',  color: 'white' };
  if (index === 1) return { background: '#A8A8A8',      color: 'white' };
  if (index === 2) return { background: 'var(--earth)', color: 'white' };
  return               { background: 'var(--cream-dark)', color: 'var(--charcoal-soft)' };
}

export function AnalysisView({ onBack }: Props) {
  const { items, rubricIds } = useCaseStore();
  const ids = rubricIds();

  const { data: results = [], isLoading, isError } = useAnalysis(ids, true);

  const maxScore = results[0]?.score ?? 1;

  return (
    <div style={{
      flex:      1,
      overflowY: 'auto',
      padding:   '28px 32px',
    }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background:    'none',
          border:        '1px solid var(--border-strong)',
          borderRadius:  'var(--r-sm)',
          padding:       '7px 14px',
          fontFamily:    'var(--font-body)',
          fontSize:      '12.5px',
          color:         'var(--charcoal-soft)',
          cursor:        'pointer',
          display:       'flex',
          alignItems:    'center',
          gap:           '6px',
          marginBottom:  '24px',
          transition:    'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background    = 'var(--cream)';
          (e.currentTarget as HTMLButtonElement).style.borderColor   = 'var(--sage-light)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background    = 'none';
          (e.currentTarget as HTMLButtonElement).style.borderColor   = 'var(--border-strong)';
        }}
      >
        <ArrowLeftIcon /> Back to Rubrics
      </button>

      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize:   '30px',
          fontWeight: 500,
          color:      'var(--charcoal)',
        }}>
          Repertorization Results
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
          {ids.length} rubric{ids.length !== 1 ? 's' : ''} analysed · Ranked by cumulative grade score
        </p>

        {/* Selected rubric tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
          {items.map((item) => (
            <span
              key={item.rubric.id}
              style={{
                background:   'rgba(107,124,92,0.1)',
                border:       '1px solid var(--border-strong)',
                borderRadius: '20px',
                padding:      '4px 12px',
                fontSize:     '11.5px',
                color:        'var(--sage-dark)',
              }}
            >
              {item.chapter.name} › {[item.rubric.section, item.rubric.subsection].filter(Boolean).join(' › ')}
            </span>
          ))}
        </div>
      </div>

      {/* States */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <Spinner />
        </div>
      )}

      {isError && (
        <div style={{
          textAlign:    'center',
          padding:      '60px 0',
          color:        'var(--muted)',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize:   '20px',
            color:      'var(--charcoal-soft)',
            marginBottom: '6px',
          }}>
            Analysis failed
          </div>
          <div style={{ fontSize: '13px' }}>
            Could not reach the server. Please check your connection and try again.
          </div>
        </div>
      )}

      {/* Results */}
      {!isLoading && !isError && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {results.map((remedy, i) => (
            <div
              key={remedy.remedyId}
              style={{
                background:    'white',
                border:        '1px solid var(--border)',
                borderRadius:  'var(--r)',
                padding:       '18px 20px',
                display:       'flex',
                alignItems:    'center',
                gap:           '16px',
                animation:     `slideUp 0.3s ease ${i * 0.05}s forwards`,
                opacity:       0,
                transition:    'box-shadow 0.18s ease, transform 0.18s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
              }}
            >
              {/* Rank badge */}
              <div style={{
                width:          '32px',
                height:         '32px',
                borderRadius:   '50%',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontSize:       '13px',
                fontWeight:     600,
                flexShrink:     0,
                ...getRankStyle(i),
              }}>
                {i + 1}
              </div>

              {/* Abbreviation */}
              <div style={{
                width:      '56px',
                flexShrink: 0,
                textAlign:  'center',
              }}>
                <span style={{
                  fontFamily:  'var(--font-display)',
                  fontSize:    '15px',
                  fontStyle:   'italic',
                  fontWeight:  600,
                  color:       'var(--sage)',
                }}>
                  {remedy.abbreviation}
                </span>
              </div>

              {/* Remedy info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize:   '18px',
                  fontWeight: 500,
                  color:      'var(--charcoal)',
                }}>
                  {remedy.name}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                  {remedy.matchedRubricCount} rubric{remedy.matchedRubricCount !== 1 ? 's' : ''} matched
                </div>

                {/* Grade pips */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  {remedy.grades.map((g) => (
                    <div
                      key={g.grade}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--charcoal-soft)' }}
                    >
                      <div style={{
                        width:        '8px',
                        height:       '8px',
                        borderRadius: '50%',
                        background:   g.grade === 3
                          ? 'var(--sage-dark)'
                          : g.grade === 2
                          ? 'var(--sage-light)'
                          : 'var(--earth-light)',
                      }} />
                      {g.count}×{g.grade}
                    </div>
                  ))}
                </div>
              </div>

              {/* Score bar */}
              <div style={{ width: '140px', flexShrink: 0 }}>
                <div style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  fontSize:       '11px',
                  color:          'var(--muted)',
                  marginBottom:   '5px',
                }}>
                  <span>Score</span>
                  <strong style={{ color: 'var(--charcoal)', fontSize: '13px' }}>
                    {remedy.score}
                  </strong>
                </div>
                <div style={{
                  height:       '6px',
                  background:   'var(--cream-dark)',
                  borderRadius: '3px',
                  overflow:     'hidden',
                }}>
                  <div style={{
                    height:     '100%',
                    borderRadius: '3px',
                    background: 'linear-gradient(90deg, var(--sage), var(--sage-light))',
                    width:      `${(remedy.score / maxScore) * 100}%`,
                    transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                  }} />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}