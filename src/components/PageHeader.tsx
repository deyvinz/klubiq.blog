import { marked } from "marked"

interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="mt-6 text-lg leading-8 text-gray-600" dangerouslySetInnerHTML={{ __html: marked(description) }} />          
      )}
    </div>
  )
} 