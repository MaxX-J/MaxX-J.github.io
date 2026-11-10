import { useLayoutEffect, useRef, useState } from 'react';

// Zone occupée par les lettres, en part du conteneur (top/height) et en marge latérale (px)
type Box = { top: number; height: number; side: number };

type StretchedTitleProps = {
  text: string;
  box: Box;
  // Zone sur mobile (< 768px) si différente
  mobileBox?: Box;
  className?: string;
};

const FONT = '900 200px Kanit';
const FONT_SIZE = 200;
const LETTER_SPACING = 0.07 * FONT_SIZE; // 7 %, comme dans la maquette Figma

type Bounds = { x: number; y: number; width: number; height: number };

// Tracé exact des lettres (sans l'espace vide que la police garde au-dessus des majuscules)
function measureInk(text: string) {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return { ascent: FONT_SIZE * 0.7, descent: 0, firstLeft: 0, lastRight: FONT_SIZE * 0.6 };
  ctx.font = FONT;
  const m = ctx.measureText(text);
  const chars = [...text];
  return {
    ascent: m.actualBoundingBoxAscent,
    descent: m.actualBoundingBoxDescent,
    firstLeft: ctx.measureText(chars[0]).actualBoundingBoxLeft,
    lastRight: ctx.measureText(chars[chars.length - 1]).actualBoundingBoxRight,
  };
}

// Grand texte blanc étiré pour remplir une zone précise, avec fondu vers le bas (effet de la page 404)
export default function StretchedTitle({ text, box, mobileBox, className = '' }: StretchedTitleProps) {
  const upper = text.toUpperCase();
  const textRef = useRef<SVGTextElement>(null);
  const [ready, setReady] = useState(false);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [mobile, setMobile] = useState(false);

  useLayoutEffect(() => {
    const update = () => setMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    // les mesures ne sont justes qu'une fois la police Kanit chargée
    document.fonts.load(FONT).then(() => setReady(true));
    return () => window.removeEventListener('resize', update);
  }, []);

  // Position réelle des lettres affichées + tracé exact de la 1re et de la dernière
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!ready || !el) return;
    const n = el.getNumberOfChars();
    const ink = measureInk(upper);
    const left = el.getStartPositionOfChar(0).x - ink.firstLeft;
    const right = el.getStartPositionOfChar(n - 1).x + ink.lastRight;
    setBounds({ x: left, y: -ink.ascent, width: right - left, height: ink.ascent + ink.descent });
  }, [ready, upper]);

  const b = mobile && mobileBox ? mobileBox : box;

  return (
    <div className={`mask-fade-bottom pointer-events-none absolute inset-0 overflow-hidden opacity-80 ${className}`} aria-hidden>
      {ready && (
        <svg
          className="absolute overflow-visible"
          style={{
            left: b.side,
            top: `${b.top * 100}%`,
            height: `${b.height * 100}%`,
            width: `calc(100% - ${b.side * 2}px)`,
            visibility: bounds ? 'visible' : 'hidden',
          }}
          viewBox={bounds ? `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}` : `0 -${FONT_SIZE} 1000 ${FONT_SIZE}`}
          preserveAspectRatio="none"
        >
          <text
            ref={textRef}
            x={0}
            y={0}
            fill="#fff"
            fontFamily="Kanit"
            fontWeight={900}
            fontSize={FONT_SIZE}
            letterSpacing={LETTER_SPACING}
            style={{ fontKerning: 'none' }}
          >
            {upper}
          </text>
        </svg>
      )}
    </div>
  );
}
