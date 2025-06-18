'use client' // Error components must be Client Components

import { useEffect } from 'react'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page Error Boundary Caught:", error);
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg shadow-xl border-destructive/50">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="flex items-center text-destructive text-xl">
            <AlertTriangle className="mr-2 h-6 w-6" />
            Oops! Something Went Wrong
          </CardTitle>
          <CardDescription className="text-destructive/80">
            We encountered an error loading this part of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <p className="text-muted-foreground">
            You can try to refresh this section or navigate to a different page.
          </p>
          {error?.message && (
            <div className="p-3 bg-muted rounded-md text-xs text-muted-foreground overflow-auto max-h-32">
              <p className="font-semibold">Error Details:</p>
              <pre className="whitespace-pre-wrap break-all">{error.message}</pre>
              {error.digest && <p className="text-xs mt-1">Digest: {error.digest}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => window.location.assign('/')} 
          >
            Go Home
          </Button>
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}