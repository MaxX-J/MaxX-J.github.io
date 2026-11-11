// Logo « M + curseur » (variante C du fichier Figma « Logo — M curseur ») :
// le M est déjà évidé autour du curseur, les traits de clic partent de la pointe du curseur.
export const LOGO_VIEWBOX = '6 4 166 164';
export const M_PATH =
  'M75.0898 93.5653L98.5303 43.9998H125V83.9998C125 84.2467 125.018 84.4908 125.054 84.7303C125.089 84.9696 125.141 85.2046 125.21 85.4334C125.416 86.1204 125.766 86.7535 126.234 87.2899C126.391 87.4687 126.56 87.637 126.741 87.7928C127.104 88.1044 127.515 88.3664 127.966 88.5672C128.191 88.6676 128.421 88.7501 128.654 88.8153C129.121 88.9457 129.598 89.0069 130.073 88.9998C130.548 88.9928 131.02 88.918 131.474 88.7782C131.7 88.7083 131.923 88.6216 132.139 88.5194C132.571 88.315 132.978 88.0468 133.345 87.7166L140 81.7254V164H96.3662V121.889L86.0889 143.503H63.9111L53.6338 121.889V164H10V43.9998H51.4697L75.0898 93.5653Z';
export const CURSOR_PATH = 'M130 39V84L142.5 72.75L151.25 89L158.75 85.25L150 69H167.5L130 39Z';
// Les trois traits de clic, séparés pour pouvoir les faire jaillir un par un
export const RAY_PATHS = ['M130 25V14', 'M120 28L113 21', 'M140 28L147 21'];
// Pointe du curseur = point du clic
export const CLICK_POINT = { x: 130, y: 39 };

export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} fill="currentColor" aria-hidden="true">
      <path d={M_PATH} />
      <path d={CURSOR_PATH} />
      <g stroke="currentColor" strokeWidth={5} strokeLinecap="round" fill="none">
        {RAY_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
