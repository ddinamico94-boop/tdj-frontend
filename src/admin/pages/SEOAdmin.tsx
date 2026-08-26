import SingleObjectPage from '@/admin/components/SingleObjectPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { configSEOResource } from '@/services/adminService';
import type { ConfiguracionSEO } from '@/types';

const fields: FieldConfig<ConfiguracionSEO>[] = [
  { name: 'nombreSitio', label: 'Nombre del sitio', type: 'text' },
  { name: 'tituloSEO', label: 'Título SEO', type: 'text', fullWidth: true },
  { name: 'descripcion', label: 'Descripción SEO', type: 'textarea', fullWidth: true },
  { name: 'imagenCompartirUrl', label: 'Imagen para compartir (OG)', type: 'image' },
  { name: 'faviconUrl', label: 'Favicon', type: 'image' },
  { name: 'autor', label: 'Autor', type: 'text' },
];

export default function SEOAdmin() {
  return (
    <SingleObjectPage<ConfiguracionSEO>
      title="SEO"
      description="Metadatos para buscadores y para compartir en redes sociales."
      resource={configSEOResource}
      fields={fields}
    />
  );
}
