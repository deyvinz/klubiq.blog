'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/search', label: 'Search' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-secondary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-secondary hover:text-primary/80"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-secondary hover:text-primary/80 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
} 