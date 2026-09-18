import Link from 'next/link';

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-6 py-16 text-[var(--color-text-primary)]">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">About MOT7KM</p>
        <h1 className="text-4xl font-black sm:text-6xl">A simpler way to share every menu.</h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
          This is a mock information page for the public menu platform. Business menus live under the menu route.
        </p>
        <Link href="/" className="w-fit rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-text-on-primary)]">
          Back to home
        </Link>
      </div>
    </main>
  );
}