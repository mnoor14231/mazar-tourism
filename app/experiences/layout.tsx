export default function ExperiencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Navbar is in root layout, just pass through children
  return <>{children}</>;
}

