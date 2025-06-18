'use client' // Error components must be Client Components

import { useEffect } from 'react'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary Caught:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
          <PageTitle title="Something went wrong!" />
          <p className="mb-4 text-center text-lg text-muted-foreground">
            We encountered an unexpected issue with the application. Please try refreshing the page.
          </p>
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Try again
          </Button>
           <p className="mt-4 text-sm text-muted-foreground">
            If the problem persists, please contact support.
          </p>
           {error?.message && (
            <details className="mt-4 p-2 border rounded-md text-xs bg-muted text-muted-foreground w-full max-w-md">
              <summary>Error Details (for debugging)</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
                {error.stack && `\nStack: ${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  )
}