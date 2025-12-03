export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Login page doesn't need the navbar from root layout
  return <>{children}</>;
}

