import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/brand/wiplus-logo-horizontal.webp'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={className} aria-label="WIPLUS Comunicaciones, ir al inicio">
      <Image
        src={logo}
        alt="WIPLUS Comunicaciones"
        loading="eager"
        sizes="180px"
        className="h-7 w-auto min-[360px]:h-8 min-[400px]:h-9 sm:h-11"
      />
    </Link>
  )
}
