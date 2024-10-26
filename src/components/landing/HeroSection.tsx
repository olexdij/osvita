import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Learn Faster with{" "}
          <span className="text-primary">OSVITA</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          The next-generation AI-powered learning platform that transforms how organizations create, 
          deliver, and track educational content.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">Book Demo</Button>
        </div>
      </div>
    </section>
  );
}