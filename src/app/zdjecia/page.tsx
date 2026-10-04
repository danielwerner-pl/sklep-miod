import type { Metadata } from 'next';
import credits from '@/data/credits.json';

export const metadata: Metadata = { title: 'Źródła zdjęć' };

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <h1 className="font-serif text-4xl tracking-tight">Źródła zdjęć</h1>
      <p className="mt-4 text-ink-soft">
        Prototyp korzysta ze zdjęć z Wikimedia Commons na wolnych licencjach. Zdjęcia zostały przycięte i przeskalowane.
        Docelowo zastąpią je zdjęcia pasieki.
      </p>
      <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10 text-sm">
        {credits.map((c) => (
          <li key={c.page} className="py-4">
            <a href={c.page} className="font-medium underline decoration-honey underline-offset-4" target="_blank" rel="noreferrer">
              {c.file}
            </a>
            <p className="mt-1 text-ink-soft">
              {c.author} · {c.license} · użyte jako: {c.used}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
