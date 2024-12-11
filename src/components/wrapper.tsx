export function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="max-w-screen-xl mx-auto p-8">{children}</div>;
}
