'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import { getStrapiMedia } from '@/lib/strapi'

interface SearchResult {
  title: string
  excerpt: string
  slug: string
  date: string
  category?: string
  coverUrl?: string
}

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dialogRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dialog when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev))
          break
        case 'Enter':
          event.preventDefault()
          if (selectedIndex > -1) {
            handleResultClick(results[selectedIndex].slug)
          } else if (query) {
            handleViewAll()
          }
          break
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, query])

  // Handle search
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleResultClick = (slug: string) => {
    setIsOpen(false)
    router.push(`/blog/${slug}`)
  }

  const handleViewAll = () => {
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-text hover:text-primary transition-colors"
        aria-label="Search"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4">
          <div
            ref={dialogRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mt-20"
          >
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSelectedIndex(-1)
                  }}
                  placeholder="Search blog posts..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-text/60">Searching...</div>
              ) : results.length > 0 ? (
                <>
                  <ul className="divide-y">
                    {results.map((result, index) => (
                      <li
                        key={result.slug}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          index === selectedIndex ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => handleResultClick(result.slug)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className="flex gap-4">
                          {result.coverUrl && (
                            <div className="relative w-24 h-16 flex-shrink-0">
                              <Image
                                src={getStrapiMedia(result.coverUrl)}
                                alt={result.title}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <h3 className="text-h3 font-heading font-bold text-primary mb-1">
                              {result.title}
                            </h3>
                            {result.category && (
                              <span className="inline-block px-2 py-1 text-small font-medium text-secondary bg-secondary/10 rounded-full mb-2">
                                {result.category}
                              </span>
                            )}
                            <p className="text-body text-text/80 line-clamp-1">
                              {result.excerpt}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 border-t">
                    <button
                      onClick={handleViewAll}
                      className="w-full py-2 text-center text-primary hover:text-primary/80 transition-colors"
                    >
                      View all results
                    </button>
                  </div>
                </>
              ) : query ? (
                <div className="p-4 text-center text-text/60">
                  No results found
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 