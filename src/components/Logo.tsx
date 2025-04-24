import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Link href="/" className={`block ${className}`}>
      <Image
        src="/images/2.svg"
        alt="KlubIQ Logo"
        width={40}
        height={40}
        className="h-10 w-auto"
        priority
      />
    </Link>
  )
} 