import { Button } from '@/components/ui/button';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({ message = 'Something went wrong', onRetry }: ErrorViewProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="text-red-500 text-6xl">!</div>
        <h3 className="text-lg font-semibold text-gray-900">Error</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
