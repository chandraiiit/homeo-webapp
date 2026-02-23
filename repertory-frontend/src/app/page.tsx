'use client';

import { useState } from 'react';
import { useChapters } from './hooks/useChapters';
import { Sidebar } from './components/Sidebar';
import { AnalysisView } from './components/AnalysisView';
import { RubricBrowser } from './components/RubricBrowser';
import { CaseTray } from './components/CaseTray';

type View = 'browser' | 'analysis';

export default function HomePage() {
  const { data: chapters = [] } = useChapters();
  const [activeChapterId, setActiveChapterId] = useState<number | undefined>();
  const [view, setView] = useState<View>('browser');

  const activeChapter = chapters.find((c) => c.id === activeChapterId) ?? chapters[0];

  function handleChapterSelect(id: number) {
    setActiveChapterId(id);
    setView('browser');
  }

  function handleAnalyze() {
    setView('analysis');
  }

  function handleBack() {
    setView('browser');
  }

  return (
    <div style={{
      display:  'flex',
      height:   '100vh',
      overflow: 'hidden',
      background: 'var(--warm-white)',
    }}>

      <Sidebar
        activeChapterId={activeChapter?.id}
        onSelect={handleChapterSelect}
        onAnalyze={handleAnalyze}
      />

      <main style={{
        flex:      1,
        display:   'flex',
        overflow:  'hidden',
      }}>
        {view === 'analysis' ? (
          <AnalysisView onBack={handleBack} />
        ) : (
          <>
            <RubricBrowser chapter={activeChapter} />
            <CaseTray onAnalyze={handleAnalyze} />
          </>
        )}
      </main>

    </div>
  );
}