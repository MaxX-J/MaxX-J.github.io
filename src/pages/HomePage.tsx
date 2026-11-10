import ContactSection from '../sections/ContactSection';
import DeskSection from '../sections/DeskSection';
import HeroSection from '../sections/HeroSection';
import MarqueeSection from '../sections/MarqueeSection';
import ProjectsSection from '../sections/ProjectsSection';
import SkillsSection from '../sections/SkillsSection';
import StatementSection from '../sections/StatementSection';
import ToolsMarqueeSection from '../sections/ToolsMarqueeSection';

export default function HomePage() {
  return (
    <main style={{ overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <DeskSection />
      <StatementSection />
      <SkillsSection />
      <ToolsMarqueeSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
