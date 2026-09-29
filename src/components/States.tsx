export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading pieces">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[4/5]" />
          <div className="skeleton mt-5 h-3 w-24" />
          <div className="skeleton mt-3 h-6 w-48" />
        </div>
      ))}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return <p role="alert" className="border border-line px-6 py-5 text-sand">{message}</p>;
}
