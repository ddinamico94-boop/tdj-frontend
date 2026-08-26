import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { contentService } from '@/services/contentService';
import type { ItemMenu, SiteConfig } from '@/types';

export default function PublicLayout() {
  const [menu, setMenu] = useState<ItemMenu[]>([]);
  const [site, setSite] = useState<SiteConfig | null>(null);

  useEffect(() => {
    contentService.getMenu().then(setMenu);
    contentService.getSiteConfig().then(setSite);
  }, []);

  if (!site) return null; // loading mínimo; reemplazar por skeleton si se desea

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar menu={menu} site={site} />
      <main className="flex-1 max-w-[1120px] mx-auto px-5 py-8 w-full">
        <Outlet />
      </main>
      <Footer menu={menu} site={site} />
    </div>
  );
}
