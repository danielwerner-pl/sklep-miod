'use client';

import { useEffect, useRef, useState } from 'react';
import type { Paczkomat } from '@/lib/shipping';

const TOKEN = process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN;
const BASE =
  process.env.NEXT_PUBLIC_INPOST_SANDBOX === '1'
    ? 'https://sandbox-easy-geowidget-sdk.easypack24.net'
    : 'https://geowidget.inpost.pl';

type PointDetail = { name: string; address?: { line1?: string; line2?: string } };

/**
 * Wybór paczkomatu. Z tokenem: mapa InPost Geowidget v5 (ładowana dopiero po otwarciu,
 * żeby nie obciążać strony). Bez tokenu (prototyp): ręczne wpisanie kodu paczkomatu.
 */
export function InpostPicker({ value, onChange }: { value: Paczkomat | null; onChange: (p: Paczkomat | null) => void }) {
  const [open, setOpen] = useState(false);

  if (!TOKEN) return <ManualPicker value={value} onChange={onChange} />;

  return (
    <div>
      {value ? (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-ink/15 p-5">
          <div>
            <p className="font-medium">Paczkomat {value.name}</p>
            <p className="text-sm text-ink-soft">{value.address}</p>
          </div>
          <button type="button" className="btn-ghost" onClick={() => setOpen(true)}>
            Zmień
          </button>
        </div>
      ) : (
        <button type="button" className="btn-honey" onClick={() => setOpen(true)}>
          Wybierz paczkomat na mapie
        </button>
      )}
      {open && (
        <GeowidgetDialog
          onClose={() => setOpen(false)}
          onSelect={(p) => {
            onChange(p);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function GeowidgetDialog({ onClose, onSelect }: { onClose: () => void; onSelect: (p: Paczkomat) => void }) {
  const host = useRef<HTMLDivElement>(null);
  // Callbacki w refie, żeby widget nie był tworzony od nowa przy każdym renderze rodzica.
  const cb = useRef({ onClose, onSelect });
  cb.current = { onClose, onSelect };

  useEffect(() => {
    if (!document.querySelector('link[data-inpost]')) {
      const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: `${BASE}/inpost-geowidget.css` });
      link.dataset.inpost = '';
      document.head.append(link);
      const script = Object.assign(document.createElement('script'), { src: `${BASE}/inpost-geowidget.js`, defer: true });
      document.head.append(script);
    }
    const widget = document.createElement('inpost-geowidget');
    widget.setAttribute('onpoint', 'onpointselect');
    widget.setAttribute('token', TOKEN!);
    widget.setAttribute('language', 'pl');
    widget.setAttribute('config', 'parcelcollect');
    host.current?.append(widget);

    const handler = (e: Event) => {
      const d = (e as CustomEvent<PointDetail>).detail;
      cb.current.onSelect({ name: d.name, address: [d.address?.line1, d.address?.line2].filter(Boolean).join(', ') });
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cb.current.onClose();
    document.addEventListener('onpointselect', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('onpointselect', handler);
      document.removeEventListener('keydown', onKey);
      widget.remove();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" role="dialog" aria-modal aria-label="Wybór paczkomatu">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-cream">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
          <p className="font-medium">Wybierz paczkomat</p>
          <button type="button" onClick={onClose} className="text-sm underline">
            Zamknij
          </button>
        </div>
        <div ref={host} className="flex-1" />
      </div>
    </div>
  );
}

function ManualPicker({ value, onChange }: { value: Paczkomat | null; onChange: (p: Paczkomat | null) => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/25 p-5">
      <label htmlFor="paczkomat" className="font-medium">
        Kod paczkomatu
      </label>
      <p className="mt-1 text-sm text-ink-soft">
        W wersji produkcyjnej w tym miejscu otworzy się mapa InPost. Na razie wpisz kod, np. <code>KRA01M</code>, albo{' '}
        <a href="https://inpost.pl/znajdz-paczkomat" target="_blank" rel="noreferrer" className="underline">
          znajdź go na inpost.pl
        </a>
        .
      </p>
      <input
        id="paczkomat"
        value={value?.name ?? ''}
        onChange={(e) => {
          const name = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
          onChange(name ? { name, address: '' } : null);
        }}
        placeholder="np. KRA01M"
        className="mt-3 w-full max-w-xs rounded-xl border border-ink/20 bg-cream px-4 py-3 uppercase outline-none focus:border-ink"
        autoComplete="off"
      />
    </div>
  );
}
