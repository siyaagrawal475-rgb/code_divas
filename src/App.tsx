import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { IncidentProvider } from './context/IncidentContext';
import { AppLayout } from './components/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { ChroniclePage } from './pages/ChroniclePage';
import { NewIncidentPage } from './pages/NewIncidentPage';
import { ArchivePage } from './pages/ArchivePage';
import { TracePage } from './pages/TracePage';
import { ReportPage } from './pages/ReportPage';

export const App: React.FC = () => {
  return (
    <IncidentProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing / Entry Screen */}
          <Route path="/" element={<LandingPage />} />

          {/* App Shell Protected/Core Screens */}
          <Route element={<AppLayout />}>
            <Route path="/chronicle" element={<ChroniclePage />} />
            <Route path="/incident/new" element={<NewIncidentPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/trace/:id" element={<TracePage />} />
            <Route path="/report/:id" element={<ReportPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </IncidentProvider>
  );
};

export default App;
