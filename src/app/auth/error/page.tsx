import ErrorMessage from '@/components/ErrorMessage';

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string; error_description?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ErrorMessage 
        message={searchParams.error_description || 'An authentication error occurred'} 
      />
    </div>
  );
} 