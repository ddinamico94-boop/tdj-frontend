import SingleObjectPage from '@/admin/components/SingleObjectPage';
import type { FieldConfig } from '@/admin/components/FormField';
import { programaResource } from '@/services/adminService';
import type { Programa } from '@/types';

const fields: FieldConfig<Programa>[] = [
  { name: 'titulo', label: 'Título', type: 'text', fullWidth: true },
  { name: 'presentacion', label: 'Presentación', type: 'richtext', fullWidth: true },
  { name: 'objetivos', label: 'Objetivos', type: 'stringArray', fullWidth: true },
  { name: 'pdfUrl', label: 'PDF del programa', type: 'file', accept: '.pdf,application/pdf', fullWidth: true },
];

export default function ProgramaAdmin() {
  return (
    <SingleObjectPage<Programa>
      title="Programa"
      description="Presentación, objetivos y PDF del programa de la materia."
      resource={programaResource}
      fields={fields}
    />
  );
}
