import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center px-4 text-center">
      <Compass className="h-12 w-12 text-primary" aria-hidden />
      <h1 className="mt-6 font-display text-4xl font-bold text-foreground">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/packages">Browse Tour Packages</Link>
        </Button>
      </div>
    </div>
  );
}
