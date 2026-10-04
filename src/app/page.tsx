import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/products';
import { FREE_SHIPPING_FROM } from '@/lib/shipping';
import { formatPrice } from '@/lib/products';
import { site } from '@/lib/site';
import hero from '../../public/img/hero.jpg';
import pasiecznik from '../../public/img/pasiecznik.jpg';
import plaster from '../../public/img/plaster-pszczola.jpg';
import krokUl from '../../public/img/krok-ul.jpg';
import krokPlaster from '../../public/img/krok-plaster.jpg';
import krokMiodobranie from '../../public/img/krok-miodobranie.jpg';
import krokSloik from '../../public/img/krok-sloik.jpg';

const steps = [
  {
    image: krokUl,
    title: 'Ul',
    text: 'Pszczoły zbierają nektar w promieniu 3 km od pasieki. Ule stoją z dala od dróg i upraw przemysłowych.',
  },
  {
    image: krokPlaster,
    title: 'Dojrzewanie',
    text: 'Miód odbieramy dopiero, gdy pszczoły zasklepią komórki woskiem. Wtedy jest dojrzały i ma właściwą wilgotność.',
  },
  {
    image: krokMiodobranie,
    title: 'Miodobranie',
    text: 'Ramki odsklepiamy ręcznie i odwirowujemy na zimno. Miód tylko cedzimy przez sito – bez podgrzewania i filtrowania.',
  },
  {
    image: krokSloik,
    title: 'Słoik',
    text: 'Rozlewamy w małych partiach, etykietujemy datą zbioru i pakujemy tak, żeby szkło dotarło do Ciebie całe.',
  },
];

export default function Home() {
  const featured = getProducts().filter((p) => !p.soldOut).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-16">
        <div>
          <p className="eyebrow">Rodzinna pasieka od {site.since} roku</p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Miód, który pachnie <em className="not-italic text-honey-dark">latem</em>.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Odmianowe miody, pyłek i propolis z {site.hives} uli. Rozlewane ręcznie, nigdy niepodgrzewane. Prosto z pasieki
            do Twojego paczkomatu.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/sklep" className="btn-primary">
              Zobacz miody
            </Link>
            <Link href="#historia" className="btn-ghost">
              Poznaj pasiekę
            </Link>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-6 text-sm">
            <div>
              <dt className="text-ink-soft">Uli</dt>
              <dd className="mt-1 font-serif text-3xl">{site.hives}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Odmian</dt>
              <dd className="mt-1 font-serif text-3xl">5</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Dostawa</dt>
              <dd className="mt-1 font-serif text-3xl">24 h</dd>
            </div>
          </dl>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src={hero}
              alt="Drewniana łyżka nad słoikiem świeżego miodu"
              fill
              priority
              fetchPriority="high"
              quality={70}
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, calc(100vw - 40px)"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-4 rounded-2xl bg-cream px-5 py-4 shadow-xl shadow-ink/10 sm:left-[-1.5rem]">
            <p className="text-xs text-ink-soft">Darmowa dostawa od</p>
            <p className="font-serif text-2xl">{formatPrice(FREE_SHIPPING_FROM)}</p>
          </div>
        </div>
      </section>

      {/* Polecane */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Tegoroczne zbiory</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Prosto z ula</h2>
          </div>
          <Link href="/sklep" className="text-sm font-medium underline decoration-honey decoration-2 underline-offset-4">
            Wszystkie produkty →
          </Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="scroll-mt-16 bg-wax/60 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image
              src={pasiecznik}
              alt="Pszczelarz przegląda ramkę z ula"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Historia pasieki</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Trzy pokolenia, jedna łąka
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                Pierwsze ule postawił dziadek w {site.since} roku – pięć drewnianych skrzynek na skraju sadu. Dziś opiekujemy
                się {site.hives} rodzinami pszczelimi, ale robimy to tak samo jak on: spokojnie, ręcznie i z szacunkiem do
                pszczół.
              </p>
              <p>
                Ule przewozimy za kwitnieniem: wiosną na rzepak, latem pod lipy, a w sierpniu na pola gryki. Dzięki temu
                każdy miód ma swój wyraźny charakter.
              </p>
            </div>
            <p className="mt-8 font-serif text-xl">– Marcin, pszczelarz</p>
          </div>
        </div>
      </section>

      {/* Pełnoekranowy plaster */}
      <section className="relative h-[60vh] max-h-[640px] min-h-[380px] overflow-hidden">
        <Image src={plaster} alt="" fill placeholder="blur" sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8">
          <blockquote className="max-w-xl font-serif text-3xl leading-snug text-cream sm:text-5xl">
            „Na jeden słoik miodu pszczoły odwiedzają około miliona kwiatów.”
          </blockquote>
        </div>
      </section>

      {/* Od ula do słoika */}
      <section id="od-ula-do-sloika" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">Proces</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Od ula do słoika</h2>
          <p className="mt-5 text-lg text-ink-soft">
            Nie mieszamy miodów z różnych źródeł i nie skupujemy ich od innych. Każdy słoik pochodzi z naszych uli.
          </p>
        </div>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream font-serif text-lg">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-2xl">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rounded-[2rem] bg-honey px-8 py-14 text-center sm:px-16">
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">Szukasz prezentu na święta?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/80">
            Zestaw „Trzy pory roku” to trzy miody w eleganckim pudełku z drewnianą łyżeczką i kartką na życzenia.
          </p>
          <Link href="/sklep/zestaw-prezentowy" className="btn-primary mt-8">
            Zobacz zestaw
          </Link>
        </div>
      </section>
    </>
  );
}
