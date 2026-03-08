import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavMenu } from './components/NavMenu';
import { RemoteControl } from './pages/RemoteControl';
import { FilesPage } from './pages/FilesPage';

const App: React.FC = () => (
  <BrowserRouter>
    {/* Bottom tab navigation — visible on every page */}
    <NavMenu />

    {/* Page content; pb-16 clears the fixed bottom nav */}
    <div className="pb-16">
      <Routes>
        <Route path="/" element={<RemoteControl />} />
        <Route path="/files" element={<FilesPage />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
