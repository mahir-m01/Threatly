import { Banner } from '@/components/landing-page/banner';
import { Navbar } from "@/components/landing-page/navbar";
import { Hero } from "@/components/landing-page/hero";
import { LogoTicker } from "@/components/landing-page/logo-ticker";
import { Features } from "@/components/landing-page/features";
import { ProductShowcase } from "@/components/landing-page/product-showcase";
import { FAQs } from "@/components/landing-page/faqs";
import { CallToAction } from "@/components/landing-page/call-to-action";
import { Footer } from "@/components/landing-page/footer";


export default function Home(){
  return(
      <>
          <Banner />
          <Navbar />
          <Hero />
          <LogoTicker />
          <Features />
          <ProductShowcase />
          <FAQs />
          <CallToAction />
          <Footer />
      </>

      )
}