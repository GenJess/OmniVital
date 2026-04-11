import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RitualGrid from "@/components/RitualGrid";
import ExperienceSection from "@/components/ExperienceSection";
import ScienceSection from "@/components/ScienceSection";
import CommunitySection from "@/components/CommunitySection";
import VoiceAgent from "@/components/VoiceAgent";
import logoMark from "@/assets/logo-mark.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <RitualGrid />
        <ExperienceSection />
        <ScienceSection />
        <CommunitySection />
      </main>

      <footer className="py-8 px-6 border-t border-border/30">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logoMark} alt="OmniVital" className="w-6 h-6 rounded-md" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 font-medium">
              © 2025 OmniVital
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground/40 pb-2 md:pb-0">
            Premium Performance Wellness
          </p>
        </div>
      </footer>

      <VoiceAgent />
    </div>
  );
};

export default Index;
