import { useRef, useEffect, useCallback, useState, type ChangeEvent } from 'react';
import { uploadOrEncode } from '@/services/fileUpload';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Editor de contenido enriquecido (punto 7 del brief) construido con
// contentEditable + document.execCommand: liviano, sin dependencias
// externas que instalar. Cubre: negrita, cursiva, subrayado, títulos,
// subtítulos, listas, numeración, citas, tablas, links, imágenes, videos
// (embeds de YouTube/Vimeo), separadores, bloques destacados, alineación
// y tamaño de texto. Si más adelante hace falta algo más avanzado
// (colaboración en tiempo real, control de versiones), se puede
// reemplazar por TipTap/Slate sin cambiar la interfaz de este componente
// (value/onChange en HTML).

const BASIC_BUTTONS: { cmd: string; label: string; title: string; block?: string }[] = [
  { cmd: 'bold', label: 'N', title: 'Negrita' },
  { cmd: 'italic', label: 'I', title: 'Cursiva' },
  { cmd: 'underline', label: 'S', title: 'Subrayado' },
];

const BLOCK_BUTTONS: { cmd: string; label: string; title: string; block?: string }[] = [
  { cmd: 'formatBlock', label: 'Título', title: 'Título (H2)', block: 'h2' },
  { cmd: 'formatBlock', label: 'Subtítulo', title: 'Subtítulo (H3)', block: 'h3' },
  { cmd: 'formatBlock', label: '¶', title: 'Párrafo normal', block: 'p' },
  { cmd: 'formatBlock', label: '“ ”', title: 'Cita', block: 'blockquote' },
];

const LIST_BUTTONS: { cmd: string; label: string; title: string }[] = [
  { cmd: 'insertUnorderedList', label: '• Lista', title: 'Lista con viñetas' },
  { cmd: 'insertOrderedList', label: '1. Lista', title: 'Lista numerada' },
];

const ALIGN_BUTTONS: { cmd: string; label: string; title: string }[] = [
  { cmd: 'justifyLeft', label: '⟸', title: 'Alinear a la izquierda' },
  { cmd: 'justifyCenter', label: '≡', title: 'Centrar' },
  { cmd: 'justifyRight', label: '⟹', title: 'Alinear a la derecha' },
];

const FONT_SIZES = [
  { label: 'Pequeño', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Grande', value: '5' },
  { label: 'Muy grande', value: '7' },
];

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = useCallback(() => {
    if (ref.current) onChange(ref.current.innerHTML);
  }, [onChange]);

  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    ref.current?.focus();
  }

  function insertHtmlAtSelection(html: string) {
    restoreSelection();
    document.execCommand('insertHTML', false, html);
    emit();
  }

  function exec(cmd: string, block?: string) {
    ref.current?.focus();
    if (block) {
      document.execCommand('formatBlock', false, block);
    } else {
      document.execCommand(cmd, false);
    }
    emit();
  }

  function setFontSize(size: string) {
    ref.current?.focus();
    document.execCommand('fontSize', false, size);
    emit();
  }

  function insertLink() {
    const url = window.prompt('URL del enlace:');
    if (!url) return;
    ref.current?.focus();
    document.execCommand('createLink', false, url);
    emit();
  }

  function insertHr() {
    ref.current?.focus();
    document.execCommand('insertHorizontalRule', false);
    emit();
  }

  function insertCallout() {
    insertHtmlAtSelection(
      '<div class="callout"><p>Bloque destacado — escribí acá el texto que querés resaltar.</p></div><p><br></p>'
    );
  }

  function openImagePicker() {
    saveSelection();
    imageInputRef.current?.click();
  }

  function handleImageFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    uploadOrEncode(file)
      .then((url) => {
        insertHtmlAtSelection(`<img src="${url}" alt="" style="max-width:100%;border-radius:12px;margin:.6em 0;" />`);
      })
      .catch((err) => {
        window.alert(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
      });
  }

  function insertVideo() {
    const url = window.prompt('URL del video (YouTube o Vimeo):');
    if (!url) return;
    saveSelection();
    const embedUrl = toEmbedUrl(url);
    if (!embedUrl) {
      window.alert('No se reconoció la URL. Usá un link de YouTube o Vimeo.');
      return;
    }
    insertHtmlAtSelection(
      `<div class="video-embed"><iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe></div><p><br></p>`
    );
  }

  function insertTable() {
    let rows = '';
    for (let r = 0; r < tableRows; r++) {
      let cols = '';
      for (let c = 0; c < tableCols; c++) {
        cols += r === 0 ? '<th>Encabezado</th>' : '<td>Celda</td>';
      }
      rows += `<tr>${cols}</tr>`;
    }
    insertHtmlAtSelection(`<table><tbody>${rows}</tbody></table><p><br></p>`);
    setTableModalOpen(false);
  }

  const toolbarBtnClass =
    'px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-line hover:border-cyan whitespace-nowrap';

  return (
    <div className="border border-line rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-line bg-bg">
        {BASIC_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(btn.cmd)}
            className={toolbarBtnClass}
          >
            {btn.label}
          </button>
        ))}

        <select
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => setFontSize(e.target.value)}
          defaultValue="3"
          title="Tamaño de texto"
          className={toolbarBtnClass}
        >
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <span className="w-px h-5 bg-line mx-0.5" />

        {BLOCK_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(btn.cmd, btn.block)}
            className={toolbarBtnClass}
          >
            {btn.label}
          </button>
        ))}

        <span className="w-px h-5 bg-line mx-0.5" />

        {LIST_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(btn.cmd)}
            className={toolbarBtnClass}
          >
            {btn.label}
          </button>
        ))}

        <span className="w-px h-5 bg-line mx-0.5" />

        {ALIGN_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(btn.cmd)}
            className={toolbarBtnClass}
          >
            {btn.label}
          </button>
        ))}

        <span className="w-px h-5 bg-line mx-0.5" />

        <button type="button" title="Insertar link" onMouseDown={(e) => e.preventDefault()} onClick={insertLink} className={toolbarBtnClass}>
          🔗 Link
        </button>
        <button type="button" title="Insertar imagen" onMouseDown={(e) => e.preventDefault()} onClick={openImagePicker} className={toolbarBtnClass}>
          🖼️ Imagen
        </button>
        <button type="button" title="Insertar video" onMouseDown={(e) => e.preventDefault()} onClick={insertVideo} className={toolbarBtnClass}>
          ▶️ Video
        </button>
        <button
          type="button"
          title="Insertar tabla"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            saveSelection();
            setTableModalOpen(true);
          }}
          className={toolbarBtnClass}
        >
          ▦ Tabla
        </button>
        <button type="button" title="Bloque destacado" onMouseDown={(e) => e.preventDefault()} onClick={insertCallout} className={toolbarBtnClass}>
          ★ Destacado
        </button>
        <button type="button" title="Separador" onMouseDown={(e) => e.preventDefault()} onClick={insertHr} className={toolbarBtnClass}>
          ── Separador
        </button>

        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
      </div>

      <div
        ref={ref}
        contentEditable
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className="min-h-[160px] px-4 py-3 text-sm leading-relaxed outline-none prose-editor"
        suppressContentEditableWarning
      />

      {tableModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs">
            <h3 className="text-sm font-semibold mb-3">Insertar tabla</h3>
            <label className="block text-xs font-semibold text-ink-soft mb-1">Filas</label>
            <input
              type="number"
              min={1}
              max={12}
              value={tableRows}
              onChange={(e) => setTableRows(Number(e.target.value))}
              className="w-full mb-3 px-3 py-2 rounded-lg border border-line text-sm"
            />
            <label className="block text-xs font-semibold text-ink-soft mb-1">Columnas</label>
            <input
              type="number"
              min={1}
              max={8}
              value={tableCols}
              onChange={(e) => setTableCols(Number(e.target.value))}
              className="w-full mb-4 px-3 py-2 rounded-lg border border-line text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setTableModalOpen(false)} className="btn btn-outline">
                Cancelar
              </button>
              <button type="button" onClick={insertTable} className="btn btn-grad">
                Insertar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .prose-editor:empty:before { content: attr(data-placeholder); color: #9CA3AF; }
        .prose-editor h2 { font-size: 1.25rem; font-weight: 600; margin: .6em 0 .3em; font-family:'Space Grotesk',sans-serif; }
        .prose-editor h3 { font-size: 1.05rem; font-weight: 600; margin: .5em 0 .3em; font-family:'Space Grotesk',sans-serif; }
        .prose-editor blockquote { border-left: 3px solid #1CDFE8; padding-left: .8em; color: #4A4E5A; margin: .5em 0; }
        .prose-editor ul, .prose-editor ol { padding-left: 1.4em; margin: .4em 0; }
        .prose-editor a { color: #FF8AD1; text-decoration: underline; }
        .prose-editor hr { border: none; border-top: 1px solid #E7E9EE; margin: 1em 0; }
        .prose-editor table { border-collapse: collapse; width: 100%; margin: .6em 0; font-size: .9em; }
        .prose-editor th, .prose-editor td { border: 1px solid #E7E9EE; padding: .5em .7em; text-align: left; }
        .prose-editor th { background: linear-gradient(135deg, rgba(28,223,232,.12), rgba(255,138,209,.12)); font-weight: 600; }
        .prose-editor .callout { background: linear-gradient(135deg, rgba(28,223,232,.1), rgba(255,138,209,.1)); border-left: 3px solid #FF8AD1; border-radius: 10px; padding: .8em 1em; margin: .6em 0; }
        .prose-editor .video-embed { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin: .6em 0; }
        .prose-editor .video-embed iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
        .prose-editor img { max-width: 100%; border-radius: 12px; }
      `}</style>
    </div>
  );
}

/** Convierte una URL de YouTube o Vimeo en su versión embebible. Devuelve
 * null si no se reconoce el formato (no se inventan embeds genéricos). */
function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
