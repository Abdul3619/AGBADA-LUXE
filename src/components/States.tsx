export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="aspect-[4/5] animate-pulse bg-charcoal" />
          <div className="mt-5 h-3 w-24 animate-pulse bg-charcoal" />
          <div className="mt-3 h-6 w-48 animate-pulse bg-charcoal" />
        </div>
      ))}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return <p role="alert" className="border border-line px-6 py-5 text-sand">{message}</p>;
}
