import Header from "@/components/header";

/**
 * Renders the application layout with a header at the top and main content area below.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr]">
      <Header />
      <main>{children}</main>
    </div>
  );
}
