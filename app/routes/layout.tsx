export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Navbar is in root layout, just pass through children
  return <>{children}</>;
}

