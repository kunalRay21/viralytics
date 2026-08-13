import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MarketingLayout } from './layouts/MarketingLayout';
import { AppShell } from './layouts/AppShell';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisDashboardPage } from './pages/AnalysisDashboardPage';
import { ReportPage } from './pages/ReportPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing Layout (Navbar + Landing, no Sidebar) */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Dashboard Shell Layout (Navbar + Sidebar + main container) */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/analysis/:id" element={<AnalysisDashboardPage />} />
          <Route path="/analysis/:id/report" element={<ReportPage />} />
        </Route>

        {/* Catch-all redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
