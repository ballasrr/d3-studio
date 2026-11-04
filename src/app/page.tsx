import Hero from "@/components/sections/Hero";
import ProofMarquee from "@/components/sections/ProofMarquee";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import WorkPinned from "@/components/sections/WorkPinned";
import ProcessSection from "@/components/sections/ProcessSection";
import StackSection from "@/components/sections/StackSection";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

import SiteNav from "@/components/chrome/SiteNav";
import SiteFooter from "@/components/chrome/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <ProofMarquee />
        <Manifesto />
        <Services />
        <WorkPinned />
        <ProcessSection />
        <StackSection />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
