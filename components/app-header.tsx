import Image from "next/image";

export default function AppHeader() {
  return (
    <div className="flex gap-2 items-center justify-center">
      <Image src="/assets/logo.svg" alt="Logo" width={28} height={28} />
      <h1 className="text-2xl tracking-tight">Prometheus</h1>
    </div>
  );
}
