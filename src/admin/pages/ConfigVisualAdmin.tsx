import SingleObjectPage from '@/admin/components/SingleObjectPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { configVisualResource } from '@/services/adminService';
import type { ConfiguracionVisual } from '@/types';

const fields: FieldConfig<ConfiguracionVisual>[] = [
  { name: 'logoUrl', label: 'Logo', type: 'image' },
  { name: 'faviconUrl', label: 'Favicon', type: 'image' },
  { name: 'colorPrimario', label: 'Color primario', type: 'text', helper: 'Por defecto #1CDFE8' },
  { name: 'colorSecundario', label: 'Color secundario', type: 'text', helper: 'Por defecto #FF8AD1' },
  { name: 'tipografia', label: 'Tipografía', type: 'text' },
];

export default function ConfigVisualAdmin() {
  return (
    <SingleObjectPage<ConfiguracionVisual>
      title="Configuración visual"
      description="Logo, favicon, colores de marca y tipografía. Los valores por defecto son la identidad turquesa/rosa definida para la cátedra."
      resource={configVisualResource}
      fields={fields}
    />
  );
}
