import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="bg-gradient-to-br from-primary to-accent bg-clip-text text-8xl font-bold text-transparent">404</p>
      <h1 className="mt-4 text-2xl font-bold">找不到這個頁面</h1>
      <p className="mt-2 text-muted-foreground">它可能被移動、改名，或從來不存在。</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
      >
        回到首頁
      </Link>
    </div>
  );
}
