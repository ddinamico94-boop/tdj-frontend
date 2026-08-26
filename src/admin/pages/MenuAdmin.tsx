import ResourceListPage from '@/admin/components/ResourceListPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { menuResource, genId } from '@/services/adminService';
import type { ItemMenu } from '@/types';

const fields: FieldConfig<ItemMenu>[] = [
  { name: 'label', label: 'Nombre', type: 'text', required: true },
  { name: 'to', label: 'Enlace (ruta interna o URL)', type: 'text', required: true },
  { name: 'icono', label: 'Ícono (opcional)', type: 'text' },
  { name: 'orden', label: 'Orden', type: 'number' },
  { name: 'visible', label: 'Visible en el menú', type: 'checkbox' },
];

export default function MenuAdmin() {
  return (
    <ResourceListPage<ItemMenu>
      title="Menú principal"
      description="Nombres, enlaces, orden y visibilidad de la barra de navegación del sitio público."
      resource={menuResource}
      fields={fields}
      itemLabel={(m) => m.label}
      columns={[
        { header: 'Nombre', render: (m) => <span className="font-medium">{m.label}</span> },
        { header: 'Enlace', render: (m) => <span className="font-mono text-xs">{m.to}</span> },
        { header: 'Orden', render: (m) => m.orden },
        { header: 'Visible', render: (m) => (m.visible ? '✓' : '—') },
      ]}
      emptyItem={(currentItems) => ({
        id: genId('menu'),
        label: '',
        to: '/',
        orden: currentItems.length,
        visible: true,
      })}
    />
  );
}
