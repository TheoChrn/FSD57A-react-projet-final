export function SubPageLoader({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex flex-1 items-center justify-center">
      {children}...
    </span>
  );
}
