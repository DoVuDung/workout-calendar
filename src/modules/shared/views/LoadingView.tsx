import { DumbbellLoader } from '@/components/ui/DumbbellLoader';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'Loading...' }: LoadingViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <DumbbellLoader size="lg" message={message} />
      </div>
    </div>
  );
}
