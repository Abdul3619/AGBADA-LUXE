import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SettingsProvider } from './lib/settings';
import About from './pages/About';
import Collection from './pages/Collection';
import Consultation from './pages/Consultation';
import Contact from './pages/Contact';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProductPage from './pages/Product';

const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="collection" element={<Collection />} />
            <Route path="collection/:id" element={<ProductPage />} />
            <Route path="consultation" element={<Consultation />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="the-lookout" element={<Navigate to="/collection" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route
            path="admin/*"
            element={
              <Suspense fallback={<div className="min-h-screen bg-ink" />}>
                <AdminApp />
              </Suspense>
            }
          />
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  );
}
