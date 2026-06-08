import React, { useMemo, useCallback, lazy, Suspense } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import PiLogin from './components/PiLogin';
import { NAV_TABS } from './utils/constants';

const Dashboard = lazy(() => import('./modules/dashboard/index'));
const Defence = lazy(() => import('./modules/defence/index'));
const Theft = lazy(() => import('./modules/theft/index'));
const FileSweeper = lazy(() => import('./modules/fileSweeper/index'));
const Education = lazy(() => import('./modules/education/index'));

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#00ff88' }}>
      <span className="mono">Loading...</span>
    </div>
  );
}

function AppContent() {
  const { state, setActiveTab, resetState } = useAppContext();

  const handleReset = useCallback(() => {
    resetState();
  }, [resetState]);

  const moduleMap = useMemo(() => ({
    dashboard: Dashboard,
    defence: Defence,
    theft: Theft,
    sweeper: FileSweeper,
    education: Education,
  }), []);

  const ActiveModule = moduleMap[state.activeTab] || Dashboard;

  if (!state.isAuthenticated) {
    return <PiLogin />;
  }

  return (
    <div className="app-container">
      <ErrorBoundary onReset={handleReset}>
        <div className="scrollable-content">
          <Suspense fallback={<LoadingFallback />}>
            {state.isLocked ? (
              <Theft />
            ) : (
              <ActiveModule />
            )}
          </Suspense>
        </div>
      </ErrorBoundary>

      <nav className="bottom-nav">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${state.activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

