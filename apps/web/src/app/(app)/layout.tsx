import Header from "@/components/header";

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
