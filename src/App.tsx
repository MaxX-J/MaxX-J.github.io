import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { scrollToElement, scrollToTop, startSmoothScroll } from './lib/smoothScroll';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectsPage from './pages/ProjectsPage';

// Remonte en haut à chaque changement de page, ou défile jusqu'à l'ancre (#contact…)
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      scrollToTop(true);
      return;
    }
    const timer = window.setTimeout(() => {
      const target = document.getElementById(hash.slice(1));
      if (target) scrollToElement(target);
    }, 50);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  // Défilement fluide sur tout le site
  useEffect(() => startSmoothScroll(), []);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projets" element={<ProjectsPage />} />
        <Route path="/projets/:slug" element={<ProjectDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
