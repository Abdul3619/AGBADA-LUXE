import { ImagePlus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadImage } from '../lib/api';
import { prepareImage } from './image';
import { useAdmin } from './session';
import { adminBtnGhost, Notice } from './ui';

interface Props {
  id: string;
  url: string | null;
  onChange: (value: { url: string; path: string } | null) => void;
  aspect?: string;
}

export function ImageField({ id, url, onChange, aspect = 'aspect-[4/5]' }: Props) {
  const { token, handleError } = useAdmin();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const prepared = await prepareImage(file);
      onChange(await uploadImage(token, prepared.blob, prepared.extension));
    } catch (err) {
      setError(err instanceof Error && !('code' in err) ? err.message : handleError(err));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <div>
      <div className={`${aspect} relative w-full max-w-xs overflow-hidden border border-line bg-ink`}>
        {url ? (
          <img src={url} alt="Selected" className="h-full w-full object-cover" data-testid="image-preview" />
        ) : (
          <button type="button" onClick={() => input.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-3 text-stone hover:text-gold">
            <ImagePlus size={28} strokeWidth={1} />
            <span className="text-xs uppercase tracking-[0.18em]">Add image</span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/80 text-xs uppercase tracking-[0.18em] text-sand">
            Uploading…
          </div>
        )}
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => input.current?.click()} className={adminBtnGhost}>
          <ImagePlus size={14} /> {url ? 'Replace image' : 'Upload image'}
        </button>
        {url && (
          <button type="button" disabled={busy} onClick={() => onChange(null)} className={adminBtnGhost}>
            <Trash2 size={14} /> Remove
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-stone">JPEG, PNG, WebP or AVIF. Large photos are resized automatically.</p>
      {error && <div className="mt-3"><Notice tone="error">{error}</Notice></div>}
    </div>
  );
}
