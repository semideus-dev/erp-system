export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-svh place-items-center px-4 py-8">
      {children}
    </main>
  );
}
