'use client';

import { useState } from 'react';
import { Chapter, Rubric } from '../services/api';
import { useRubrics } from '../hooks/useRubrics';
import { useCaseStore } from '../store/case.store';

interface Props {
  chapter?: Chapter;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Spinner() {
  return (
    <div style={{
      width:        '26px',
      height:       '26px',
      border:       '2px solid var(--border)',
      borderTop:    '2px solid var(--sage)',
      borderRadius: '50%',
      animation:    'spin 0.7s linear infinite',
    }} />
  );
}

function RubricCard({
  rubric,
  selected,
  onToggle,
}: {
  rubric:   Rubric;
  selected: boolean;
  onToggle: () => void;
}) {
  const nameParts = [rubric.section, rubric.subsection, rubric.modality].filter(Boolean);

  return (
    <div
      onClick={onToggle}
      style={{
        background:   selected ? 'rgba(107,124,92,0.04)' : 'white',
        border:       selected ? '1px solid var(--sage)' : '1px solid var(--border)',
        borderRadius: 'var(--r)',
        padding:      '16px 18px',
        marginBottom: '10px',
        display:      'flex',
        alignItems:   'flex-start',
        gap:          '14px',
        cursor:       'pointer',
        transition:   'all 0.18s ease',
        boxShadow:    selected ? '0 0 0 2px rgba(107,124,92,0.15)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--sage-light)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Checkbox */}
      <div style={{
        width:          '20px',
        height:         '20px',
        borderRadius:   '5px',
        border:         selected ? 'none' : '1.5px solid var(--border-strong)',
        background:     selected ? 'var(--sage)' : 'transparent',
        flexShrink:     0,
        marginTop:      '2px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        color:          'white',
        transition:     'all 0.15s ease',
      }}>
        {selected && <CheckIcon />}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize:      '11px',
          color:         'var(--sage)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom:  '4px',
        }}>
          {rubric.chapter?.name}
        </div>
        <div style={{
          fontFamily:   'var(--font-display)',
          fontSize:     '17px',
          fontWeight:   500,
          color:        'var(--charcoal)',
          lineHeight:   1.3,
          marginBottom: '5px',
        }}>
          {nameParts.join(' › ')}
        </div>
        <div style={{
          fontSize:   '12.5px',
          color:      'var(--charcoal-soft)',
          lineHeight: 1.5,
        }}>
          {rubric.description}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RubricBrowser({ chapter }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  const { data, isLoading, isFetching } = useRubrics(chapter?.id, search, page);
  const { addRubric, removeRubric, hasRubric } = useCaseStore();

  function toggleRubric(rubric: Rubric) {
    if (!chapter) return;
    hasRubric(rubric.id)
      ? removeRubric(rubric.id)
      : addRubric(rubric, chapter);
  }

  const rubrics   = data?.data  ?? [];
  const total     = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{
      flex:      1,
      display:   'flex',
      flexDirection: 'column',
      overflow:  'hidden',
    }}>

      {/* Header */}
      <div style={{
        padding:        '20px 28px 16px',
        borderBottom:   '1px solid var(--border)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexShrink:     0,
        background:     'var(--warm-white)',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize:   '26px',
            fontWeight: 500,
            color:      'var(--charcoal)',
          }}>
            {chapter?.name ?? 'Select a Chapter'}
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
            {total} rubric{total !== 1 ? 's' : ''}
            {isFetching && !isLoading ? ' · updating…' : ''}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{
            position: 'absolute',
            left:     '12px',
            color:    'var(--muted)',
            display:  'flex',
          }}>
            <SearchIcon />
          </span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search rubrics…"
            style={{
              padding:      '8px 14px 8px 36px',
              border:       '1px solid var(--border-strong)',
              borderRadius: '20px',
              fontFamily:   'var(--font-body)',
              fontSize:     '13px',
              background:   'white',
              color:        'var(--charcoal)',
              outline:      'none',
              width:        '240px',
              transition:   'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--sage)';
              e.target.style.boxShadow   = '0 0 0 3px rgba(107,124,92,0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-strong)';
              e.target.style.boxShadow   = 'none';
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Spinner />
          </div>
        ) : rubrics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.4 }}>🔍</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize:   '20px',
              color:      'var(--charcoal-soft)',
              marginBottom: '6px',
            }}>
              No rubrics found
            </div>
            <div style={{ fontSize: '13px' }}>Try a different search term.</div>
          </div>
        ) : (
          <>
            {rubrics.map((rubric) => (
              <RubricCard
                key={rubric.id}
                rubric={rubric}
                selected={hasRubric(rubric.id)}
                onToggle={() => toggleRubric(rubric)}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '12px',
                padding:        '20px 0',
              }}>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  style={{
                    padding:      '6px 14px',
                    border:       '1px solid var(--border-strong)',
                    borderRadius: 'var(--r-sm)',
                    background:   'white',
                    cursor:       page === 1 ? 'not-allowed' : 'pointer',
                    color:        page === 1 ? 'var(--muted)' : 'var(--charcoal)',
                    fontFamily:   'var(--font-body)',
                    fontSize:     '13px',
                  }}
                >
                  ← Prev
                </button>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  style={{
                    padding:      '6px 14px',
                    border:       '1px solid var(--border-strong)',
                    borderRadius: 'var(--r-sm)',
                    background:   'white',
                    cursor:       page === totalPages ? 'not-allowed' : 'pointer',
                    color:        page === totalPages ? 'var(--muted)' : 'var(--charcoal)',
                    fontFamily:   'var(--font-body)',
                    fontSize:     '13px',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}