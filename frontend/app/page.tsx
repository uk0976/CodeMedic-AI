import { Comparison } from "@/components/marketing/comparison";
import { Faq } from "@/components/marketing/faq";
import { Features } from "@/components/marketing/features";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { InteractiveDemo } from "@/components/marketing/interactive-demo";
import { Languages } from "@/components/marketing/languages";
import { Navbar } from "@/components/marketing/navbar";
import { Testimonials } from "@/components/marketing/testimonials";
import { Timeline } from "@/components/marketing/timeline";

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#0b1120]">
      <Navbar />
      <Hero />
      <Features />
      <InteractiveDemo />
      <Timeline />
      <Languages />
      <Comparison />
      <Testimonials />
      <Faq />
      <Footer />
    </main>
  );
}
