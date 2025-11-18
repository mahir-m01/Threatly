import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[linear-gradient(to_bottom,#000,#0D2042_34%,#2167A1_65%,#6ea3DB_82%)]">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-white">Oops! Lost in Cyberspace</h1>
          <p className="text-white/70">Looks like you&apos;ve ventured into the unknown digital realm.</p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md bg-white text-black px-8 text-sm font-medium shadow transition-colors hover:bg-[#2167A1] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          Return to website
        </Link>
      </div>
    </div>
  )
}
