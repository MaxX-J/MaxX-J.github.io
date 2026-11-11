// Après `vite build` : une vraie page HTML par adresse du site, pour que GitHub Pages réponde 200 (et non 404)
// et que chaque page ait son titre, sa description et son image d'aperçu (LinkedIn, mails, Google).
// Le contenu affiché reste celui de l'appli React ; seules les balises <head> changent.
// Génère aussi sitemap.xml et robots.txt.
import { build } from 'esbuild';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SITE = 'https://maxx-j.github.io';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

// site.ts est en TypeScript : on le compile à la volée pour lire la liste des projets
const tmp = join(root, 'node_modules', '.prerender-site.mjs');
await build({ entryPoints: [join(root, 'src/data/site.ts')], bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'error' });
const { PROJECTS, getProjectDetails } = await import(pathToFileURL(tmp).href + `?t=${Date.now()}`);
rmSync(tmp);

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Une description courte : la première phrase du pitch, coupée proprement vers 160 caractères
const short = (s) => {
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= 160) return t;
  const cut = t.slice(0, 157);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
};
const ogImage = (slug) => (existsSync(join(dist, 'og', `${slug}.jpg`)) ? `${SITE}/og/${slug}.jpg` : `${SITE}/og/accueil.jpg?v=2`);

function page({ path, title, description, image }) {
  const url = SITE + path;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Maxens Sevilla" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ');
  return template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('</head>', `    ${head}\n  </head>`);
}

const write = (file, html) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

const home = {
  path: '/',
  title: 'Maxens Sevilla — Designer UI/UX, dév web & 3D',
  description: 'Designer qui code : interfaces, sites web, jeux et VR. Portfolio de Maxens Sevilla, en BUT MMI à Béziers, qui cherche un stage du 2 février au 24 avril 2027.',
  image: `${SITE}/og/accueil.jpg?v=2`,
};
write(join(dist, 'index.html'), page(home));
// Adresse inconnue : l'appli affiche sa page 404
write(join(dist, '404.html'), page({ ...home, path: '/404' }));

const pages = [home];
const list = { path: '/projets/', title: 'Projets — Maxens Sevilla', description: `Tous mes projets, du BUT MMI 3 au MMI 1 : UI/UX, développement web, 3D et VR, motion design, graphisme et vidéo.`, image: `${SITE}/og/accueil.jpg?v=2` };
write(join(dist, 'projets', 'index.html'), page(list));
pages.push(list);

for (const p of PROJECTS) {
  const d = getProjectDetails(p);
  const meta = { path: `/projets/${p.slug}`, title: `${p.title} — Maxens Sevilla`, description: short(d.pitch), image: ogImage(p.slug) };
  // projets/<slug>.html : GitHub Pages le sert à l'adresse /projets/<slug>, sans redirection
  write(join(dist, 'projets', `${p.slug}.html`), page(meta));
  pages.push(meta);
}

const today = new Date().toISOString().slice(0, 10);
write(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
write(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`prerender : ${pages.length} pages, sitemap et robots.txt`);
