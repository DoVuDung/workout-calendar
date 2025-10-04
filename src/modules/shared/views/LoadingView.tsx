interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'Loading...' }: LoadingViewProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
