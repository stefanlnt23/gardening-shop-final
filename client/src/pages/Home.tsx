import MainLayout from "@/components/layouts/MainLayout";
import Hero from "@/components/sections/Hero";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CallToAction from "@/components/sections/CallToAction";
import Testimonial from "@/components/sections/Testimonial";
import ErrorHandling from "@/components/sections/ErrorHandling";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <FeaturesSection />
      <CallToAction />
      <Testimonial />
      <ErrorHandling />
    </MainLayout>
  );
}
