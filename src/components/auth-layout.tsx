import Image from "next/image";
import { Compass } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <Image
          src="https://picsum.photos/seed/naija-auth-hero/1200/1600"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <Compass className="h-7 w-7" aria-hidden />
            Naija Adventure Tours
          </div>
          <blockquote className="font-display text-3xl font-semibold leading-snug">
            &ldquo;Nigeria, in real life — not just on a map.&rdquo;
          </blockquote>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-6 lg:px-16">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
