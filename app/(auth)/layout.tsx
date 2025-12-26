import SignInForm from "@/modules/auth/client/sign-in-form";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex p-3 items-center justify-center h-screen overflow-hidden">
      <div className="flex w-full h-full">
        <div className="relative hidden w-full md:flex md:w-2/5 flex-col justify-between overflow-hidden rounded-[30px] bg-black p-12 text-white">
          <div className="absolute inset-0 z-0 opacity-80 overflow-hidden">
            <Image
              src="/assets/auth.svg"
              alt="Abstract flows"
              fill
              className="object-cover object-left"
              priority
            />
            {/* We'll use a mask to focus on the left panel's illustration part */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>
        <div className="flex w-full md:w-3/5">{children}</div>
      </div>
    </div>
  );
}
