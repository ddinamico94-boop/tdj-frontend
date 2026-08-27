import { Routes, Route } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/pages/Home';
import Unidades from '@/pages/Unidades';
import UnidadDetalle from '@/pages/UnidadDetalle';
import ProgramaPage from '@/pages/ProgramaPage';
import Bibliografia from '@/pages/Bibliografia';
import Material from '@/pages/Material';
import Sitios from '@/pages/Sitios';
import Novedades from '@/pages/Novedades';
import CalendarioPage from '@/pages/CalendarioPage';
import NotFound from '@/pages/NotFound';

import AuthGuard from '@/admin/AuthGuard';
import AdminLayout from '@/admin/AdminLayout';
import Login from '@/admin/pages/Login';
import Dashboard from '@/admin/pages/Dashboard';
import UnidadesAdmin from '@/admin/pages/UnidadesAdmin';
import ProgramaAdmin from '@/admin/pages/ProgramaAdmin';
import CalendarioAdmin from '@/admin/pages/CalendarioAdmin';
import BibliografiaAdmin from '@/admin/pages/BibliografiaAdmin';
import MaterialAdmin from '@/admin/pages/MaterialAdmin';
import NovedadesAdmin from '@/admin/pages/NovedadesAdmin';
import EnlacesAdmin from '@/admin/pages/EnlacesAdmin';
import MenuAdmin from '@/admin/pages/MenuAdmin';
import FooterAdmin from '@/admin/pages/FooterAdmin';
import ConfigVisualAdmin from '@/admin/pages/ConfigVisualAdmin';
import SEOAdmin from '@/admin/pages/SEOAdmin';
import UsuariosAdmin from '@/admin/pages/UsuariosAdmin';
import MiCuenta from '@/admin/pages/MiCuenta';

export default function App() {
  return (
    <Routes>
      {/* Sitio público */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/unidades" element={<Unidades />} />
        <Route path="/unidades/:id" element={<UnidadDetalle />} />
        <Route path="/programa" element={<ProgramaPage />} />
        <Route path="/bibliografia" element={<Bibliografia />} />
        <Route path="/material" element={<Material />} />
        <Route path="/sitios" element={<Sitios />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/calendario" element={<CalendarioPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Panel administrativo */}
      <Route path="/admin/login" element={<Login />} />
      <Route element={<AuthGuard />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="unidades" element={<UnidadesAdmin />} />
          <Route path="programa" element={<ProgramaAdmin />} />
          <Route path="calendario" element={<CalendarioAdmin />} />
          <Route path="bibliografia" element={<BibliografiaAdmin />} />
          <Route path="material" element={<MaterialAdmin />} />
          <Route path="novedades" element={<NovedadesAdmin />} />
          <Route path="enlaces" element={<EnlacesAdmin />} />
          <Route path="menu" element={<MenuAdmin />} />
          <Route path="footer" element={<FooterAdmin />} />
          <Route path="visual" element={<ConfigVisualAdmin />} />
          <Route path="seo" element={<SEOAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="cuenta" element={<MiCuenta />} />
        </Route>
      </Route>
    </Routes>
  );
}