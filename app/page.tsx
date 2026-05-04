import HeroSection from "@/components/HeroSection";
import OurStorySection from "@/components/OurStorySection";
import WeddingDetailsSection from "@/components/WeddingDetailsSection";
import PhotoSection from "@/components/PhotoSection";
import RSVPSection from "@/components/RSVPSection";
import NavBar from "@/components/NavBar";
import AudioPlayer from "@/components/AudioPlayer";

export default function Home() {
  return (
    <main className="relative">
      <NavBar />
      <HeroSection />
      <OurStorySection />
      <WeddingDetailsSection />
      <PhotoSection />
      <RSVPSection />
      {/* Floating music player — fixed position, always visible */}
      <AudioPlayer />
    </main>
  );
}
