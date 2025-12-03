export default function ReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Navbar is in root layout, just pass through children
  return <>{children}</>;
}

