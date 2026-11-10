import { Github, Mail } from 'lucide-react';
import Button from '../components/Button';
import FadeIn from '../components/FadeIn';
import Footer from '../components/Footer';
import { CONTACT } from '../data/site';

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-30 -mt-10 flex flex-col items-center rounded-t-[40px] bg-white px-5 pb-8 pt-20 text-center sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-12 md:pb-12 md:pt-36"
    >
      <FadeIn as="h2" y={40}>
        <span
          className="font-display font-black uppercase leading-[0.9] tracking-tight text-orange-accent"
          style={{ fontSize: 'clamp(3.25rem, 12vw, 160px)' }}
        >
          Parlons-en
        </span>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-6 sm:mt-10">
        <p className="max-w-[330px] text-encre/70 sm:max-w-none" style={{ fontSize: 'clamp(1rem, 1.7vw, 1.5rem)' }}>
          Un stage, un projet, une question ? Écris-moi, je réponds vite.
        </p>
      </FadeIn>
      <FadeIn delay={0.2} className="mt-6 sm:mt-10">
        <a
          href={`mailto:${CONTACT.email}`}
          className="break-all font-display font-medium text-encre underline decoration-2 underline-offset-8 transition-colors hover:text-orange-accent"
          style={{ fontSize: 'clamp(1.4rem, 3.9vw, 3.5rem)' }}
        >
          {CONTACT.email}
        </a>
      </FadeIn>
      <FadeIn delay={0.3} className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
        <Button variant="orange" href={`mailto:${CONTACT.email}`} icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}>
          M'écrire
        </Button>
        <Button variant="contour-orange" href={CONTACT.github} icon={<Github className="h-4 w-4 sm:h-5 sm:w-5" />}>
          GitHub
        </Button>
      </FadeIn>

      <div className="mt-20 w-full md:mt-28">
        <Footer />
      </div>
    </section>
  );
}
