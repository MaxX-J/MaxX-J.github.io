// Contenu du site (fusion du portfolio final et de la v2).

export const CONTACT = {
  email: 'sevilla.maxens@gmail.com',
  github: 'https://github.com/MaxX-J',
  // Dépose ton CV en PDF dans public/ sous ce nom
  cv: '/cv-maxens-sevilla.pdf',
};

// Dans l'ordre de l'accueil ; tous mènent à une section de l'accueil (id = l'ancre)
export const NAV_LINKS = [
  { label: 'À propos', id: 'a-propos' },
  { label: 'Savoir-faire', id: 'competences' },
  { label: 'Projets', id: 'projets' },
  { label: 'Contact', id: 'contact' },
];

// Présentation affichée quand le badge </> s'ouvre
export const ABOUT_TEXT =
  "Designer UI/UX avant tout, je navigue aussi entre le code et la 3D. Je conçois des interfaces claires, je les développe pour le web et je crée des expériences interactives sous Unity. Je cherche un stage pour mettre tout ça au service d'une équipe : on construit quelque chose ensemble ?";

const V2 = '/images/projets/v2';

export const SKILLS = [
  {
    name: 'UI/UX Design',
    // Mot affiché dans « Je conçois et je code »
    word: 'Des interfaces',
    description:
      'Recherche utilisateur, wireframes, prototypes et design systems : des interfaces pensées pour être simples, belles et utiles.',
    tools: ['Figma', 'FigJam', 'Photoshop', 'Illustrator'],
    image: '/images/projets/gestion-mmi/accueil-responsable.webp',
    alt: "L'accueil de Gestion MMI",
  },
  {
    name: 'Développement web',
    word: 'Des sites web',
    description:
      "Intégration au pixel près, sites responsives et animés, du prototype jusqu'à la mise en ligne.",
    tools: ['HTML / CSS', 'JavaScript', 'React', 'Tailwind'],
    image: '/images/projets/architruc/couverture.webp',
    alt: "Le site Architruc & Baltaz'art",
  },
  {
    name: '3D & Unity',
    word: 'Des jeux et de la VR',
    description:
      'Modélisation, rendu et expériences interactives en temps réel, du mini-jeu au prototype immersif.',
    tools: ['Unity', 'C#', 'Blender'],
    image: '/images/projets/bloons-vr/bananeraie.webp',
    alt: 'La bananeraie de Bloons VR',
  },
  {
    name: 'Motion design',
    word: 'Des animations',
    description:
      'Animations et micro-interactions qui donnent du rythme et de la personnalité aux interfaces.',
    tools: ['After Effects', 'Figma Smart Animate'],
    // vidéo : lue en boucle, sans le son, quand la ligne est active
    image: '/videos/motion/vox.mp4',
    alt: 'Exercice « Vox » en motion design',
  },
];

export const CATEGORIES = ['UI/UX', 'Dév web', '3D & Unity', 'Motion', 'Graphisme'] as const;
export type Category = (typeof CATEGORIES)[number];

// Aperçus des sites du prompt (1re image des GIF de motionsites.ai, en WebP léger : les GIF faisaient ~10 Mo chacun)
const preview = (n: number) => `/images/marquee/${String(n).padStart(2, '0')}.webp`;

// Contenu de la page détaillée d'un projet. Les champs optionnels masquent leur section s'ils sont absents.
export type ProjectDetails = {
  pitch: string;
  role: string;
  duration: string;
  context: string;
  tools: string[];
  links?: { label: string; href: string }[];
  problem: string;
  // Titre de la 1re section (par défaut « Le contexte »)
  problemTitle?: string;
  problemImages?: string[];
  team?: { name: string; role: string }[];
  // Sections libres façon étude de cas, avec leurs photos ; `mine` signale ma partie
  sections?: { title: string; text: string; images?: string[]; mine?: boolean }[];
  // Si présent, les sections deviennent les sous-parties d'un seul chapitre (ex. « Le jeu »), avec une intro
  sectionsTitle?: string;
  sectionsIntro?: string;
  sectionsIntroImages?: string[];
  steps: { title: string; text: string }[];
  // Titre des cartes d'étapes (par défaut « Ma démarche »)
  stepsTitle?: string;
  gallery?: string[];
  caption?: string;
  results?: { value: string; label: string }[];
  learning?: string;
  // Toutes les photos, affichées dans la galerie en fin de page
  photos?: string[];
};

type ProjectInput = {
  title: string;
  category: Category;
  context: string;
  year: string;
  // Année de BUT MMI (1, 2 ou 3), affichée à côté de l'année et utilisée pour ranger les projets
  mmi: 1 | 2 | 3;
  // [image haute gauche, image basse gauche, grande image droite] ; la 1re sert de couverture
  images: [string, string, string];
  // Ordre d'apparition dans la grille de l'accueil (le 1er prend deux cases)
  home?: number;
  // Logo affiché sur la carte de l'accueil (sinon le titre en grand)
  logo?: string;
  // Image du haut de la page projet, si elle doit différer de la 1re image (par défaut : l'image fixe de la vidéo)
  cover?: string;
  tag?: string;
  details?: ProjectDetails;
};

export type Project = ProjectInput & { slug: string };

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const BLOONS = '/images/projets/bloons-vr';
const GMMI = '/images/projets/gestion-mmi';
const MOTION = '/videos/motion';
const ARCHI = '/images/projets/architruc';
const ARCHI_VIDEO = '/videos/architruc';
const BUDGET = '/images/projets/app-budget';
const BRICK = '/images/projets/planet-brick';
const TRENCH = '/images/projets/trench-hero';
const VIVRE = '/images/projets/vivre-beziers';
const FILME = '/images/projets/je-filme';
const CHAIN = '/images/projets/blockchain-3d';
const SPOTIFY = '/images/projets/spotify-stats';
const LOUP = '/images/projets/loup-garou';
const HACK = '/images/projets/hackathon';
const FILME_VIDEO = '/videos/je-filme';

const PROJECTS_INPUT: ProjectInput[] = [
  {
    title: "Architruc & Baltaz'art", category: 'Dév web', context: 'Stage · site vitrine', year: '2026', mmi: 2,
    images: [`${ARCHI}/couverture.webp`, `${ARCHI}/realisations.webp`, `${ARCHI_VIDEO}/archi-business.mp4`], home: 1, logo: `${V2}/architruc-logo.svg`,
    details: {
      pitch:
        "Mon stage de 2e année chez Architruc & Baltaz'art, une boutique de mobilier design à Béziers : j'ai refait leur site de A à Z, de l'audit jusqu'à la mise en ligne, pour qu'il soit plus clair, plus rapide et qu'il mette enfin en avant leur offre professionnelle.",
      role: 'Développeur web',
      duration: '8 semaines',
      context: "Stage BUT MMI 2 chez Architruc & Baltaz'art, Béziers",
      tools: ['HTML / CSS', 'JavaScript', 'Node.js', 'SEO', 'PageSpeed', 'Search Console'],
      links: [{ label: 'Voir le site', href: 'https://archi-truc-beziers.com' }],
      problemTitle: 'Le point de départ',
      problem:
        "Architruc & Baltaz'art vend du mobilier design haut de gamme, mais l'essentiel de son activité, c'est l'aménagement d'espaces pour les professionnels, et ça ne se voyait pas en ligne. L'idée de départ était de mettre à jour le site WordPress. Avant de toucher à quoi que ce soit, je l'ai audité sur ordinateur et sur téléphone : navigation peu homogène, menu cassé sur mobile, réalisations sans contexte, carte de contact qui pointait sur Paris, des photos de plus de 10 Mo. PageSpeed le confirmait : 56/100 sur mobile, avec 27 secondes pour afficher le contenu principal.",
      problemImages: [`${ARCHI}/avant-accueil.webp`, `${ARCHI}/accueil-apres.webp`],
      sectionsTitle: 'La refonte',
      sectionsIntro:
        "La refonte du site a été le fil rouge de mes deux mois dans l'entreprise. Ma tutrice me donnait le besoin et me laissait avancer en autonomie, puis on faisait le point sur mes propositions.",
      sectionsIntroImages: [`${ARCHI}/showrooms.webp`, `${ARCHI}/marques.webp`],
      sections: [
        {
          title: 'Repartir de zéro',
          text: "L'équipe n'utilisait pas WordPress pour faire ses mises à jour, et l'ancien site empilait une quinzaine de feuilles de style générées par Elementor. J'ai proposé de repartir sur un site vitrine en HTML, CSS et JavaScript : plus léger, et maîtrisé au pixel près. J'ai gardé l'orange et le ton décalé de la marque, fait des deux points du nouveau logo un signe récurrent, et construit neuf pages. Pour les réalisations, une seule page modèle se remplit selon le projet choisi : ajouter un projet ne demande plus de créer une page. Un script Node.js optimise les photos par lots.",
          images: [`${ARCHI}/avant-realisations.webp`, `${ARCHI}/realisations.webp`, `${ARCHI}/projet-hero.webp`, `${ARCHI}/projet-galerie.webp`],
        },
        {
          title: 'Rapide et bien référencé',
          text: "J'ai mis le site en ligne sur l'hébergement OVHcloud de l'entreprise, avec une page de maintenance pendant la bascule. Puis j'ai continué à optimiser : de 56 à 93/100 sur mobile, de 69 à 99/100 sur ordinateur. Côté référencement (SEO), j'ai repris les bases pour que le nouveau site ne perde pas la place de l'ancien dans Google : textes alternatifs, méta-descriptions, sitemap, redirections des anciennes adresses WordPress et une page 404 à l'image de la marque. Dans Google Search Console, j'ai repéré les anciennes URL encore introuvables et corrigé des redirections qui ne marchaient qu'en local. Un README permet de reprendre le projet après mon départ.",
          images: [`${ARCHI}/pagespeed-avant.webp`, `${ARCHI}/pagespeed-apres.webp`],
        },
        {
          title: 'Archi Business',
          text: "L'offre professionnelle représente la majorité du chiffre d'affaires, mais elle était à peine présentée. J'ai refait sa page de A à Z : les secteurs accompagnés, un métier en trois piliers (conception, mobilier professionnel, mise en œuvre), les chiffres clés et les projets réalisés pour les pros.",
          images: [`${ARCHI}/avant-business.webp`, `${ARCHI_VIDEO}/archi-business.mp4`],
        },
      ],
      steps: [
        { title: 'Audit', text: "Le site parcouru sur ordinateur et téléphone, mesuré avec PageSpeed, et les vrais usages de l'équipe." },
        { title: 'Choix technique', text: 'Abandonner WordPress pour un site statique léger, adapté à une équipe qui ne le modifiait pas.' },
        { title: 'Conception & code', text: 'Neuf pages, un modèle de réalisation réutilisable, le responsive retravaillé pour le téléphone.' },
        { title: 'Mise en ligne & SEO', text: 'Hébergement, référencement, redirections, Search Console, optimisations et un README pour la suite.' },
      ],
      results: [
        { value: '93', label: 'sur 100 en performance sur mobile, contre 56 pour l’ancien site' },
        { value: '99', label: 'sur 100 sur ordinateur, contre 69 avant la refonte' },
        { value: '9', label: 'pages conçues et codées, du site vitrine à la page Archi Business' },
      ],
      learning:
        "Avant de refaire l'apparence d'un site, il faut comprendre comment l'entreprise s'en sert : c'est ce qui m'a fait abandonner WordPress. Et la mise en ligne n'est pas la fin d'un projet : c'est en production que j'ai trouvé les redirections cassées.",
      photos: [
        // d'autres pages du site, qui n'apparaissent pas plus haut
        'galerie-golfe', 'galerie-golfe-galerie', 'galerie-conexio', 'galerie-conexio-galerie', 'galerie-projets', 'galerie-esprit',
        'galerie-montmorency', 'galerie-citadelle', 'galerie-appart', 'galerie-contact-showrooms', 'galerie-contact-form', 'page-404',
      ].map((name) => `${ARCHI}/${name}.webp`),
    },
  },
  {
    // Ma parution pour le magazine l'Art…vues, pendant le stage chez Architruc & Baltaz'art
    title: "Parution l'Art…vues", category: 'Graphisme', context: "Stage chez Architruc · print", year: '2026', mmi: 2,
    images: [`${ARCHI}/parution-carte.webp`, `${ARCHI}/parution-imprimee.webp`, `${ARCHI}/parution-avant.webp`],
    details: {
      pitch:
        "Pendant mon stage de 2e année chez Architruc & Baltaz'art, en parallèle de la refonte de leur site : une pleine page pour le magazine l'Art…vues (juin-juillet 2026), pour remplacer leur ancienne publicité par une parution plus claire, en une semaine.",
      role: 'Graphiste',
      duration: '1 semaine',
      context: "Stage BUT MMI 2 chez Architruc & Baltaz'art, Béziers",
      tools: ['Illustrator', 'InDesign'],
      problemTitle: 'La demande',
      problem:
        "Format imposé de 230 × 300 mm, une semaine avant la date de remise, et une ancienne publicité comme point de départ. Il fallait faire passer l'essentiel d'un coup d'œil : le design à Béziers, l'aménagement d'espaces, pour les particuliers comme pour les professionnels. Ci-dessous : l'ancienne publicité, ma parution, puis la page imprimée dans le magazine.",
      problemImages: [`${ARCHI}/parution-avant.webp`, `${ARCHI}/parution-apres.webp`, `${ARCHI}/parution-imprimee.webp`],
      steps: [
        { title: 'Première piste', text: "Très orange, autour d'une chaise blanche : validée par ma tutrice, refusée par la gérante, trop proche de l'ancienne." },
        { title: 'Plus de clarté', text: 'Une photo encadrée par un grand aplat orange, inspirée de Pinterest et du magazine Intramuros. Encore trop chargée.' },
        { title: 'Défendre la hiérarchie', text: "J'ai proposé de retirer la liste des marques pour garder l'essentiel et le nom ARCHITRUC à la verticale." },
        { title: "Prête pour l'impression", text: 'Une photo USM au meuble orange, mise au propre dans InDesign et exportée en PDF/X-4.' },
      ],
      learning:
        "Adapter mes propositions aux retours, mais aussi défendre un choix quand il sert le message : retirer la liste des marques a rendu la parution plus lisible.",
      // les pistes de travail, dans l'ordre
      photos: [1, 2, 3, 4].map((n) => `${ARCHI}/parution-piste-${n}.webp`),
    },
  },
  {
    title: 'Bloons VR', category: '3D & Unity', context: 'SAÉ · en équipe', year: '2026', mmi: 3,
    images: [`${BLOONS}/bananeraie.webp`, `${BLOONS}/maquette-direct.webp`, `${BLOONS}/menu.webp`], home: 2, tag: 'Nouveau',
    details: {
      pitch:
        "Un tower defense en réalité virtuelle dans l'univers de Bloons TD : on tire à l'arc sur les ballons, on pose ses singes à la main sur une maquette et on fait tourner sa bananeraie pour tout payer.",
      role: 'Gameplay, économie & sons',
      duration: '3 semaines',
      context: 'SAÉ BUT MMI 3, équipe de 2',
      tools: ['Unity 6', 'C#', 'Meta Quest 3', 'Blender'],
      // GDD : lien vers la version « main » sur GitHub, toujours à jour (le document est encore en cours)
      links: [
        { label: 'GDD (en cours)', href: 'https://github.com/dyzlek/SAE501/blob/main/docs/GDD.md' },
        { label: 'Code source', href: 'https://github.com/dyzlek/SAE501' },
      ],
      problemTitle: 'Le projet',
      problemImages: [`${BLOONS}/cabane-exterieur.webp`],
      problem:
        "SAÉ de 3e année de BUT MMI à l'IUT de Béziers : un jeu en réalité virtuelle sous Unity pour Meta Quest, en équipe de deux et en trois semaines, encadrés par quatre enseignants. On incarne Quincy : on tire à l'arc sur les ballons, on pose ses singes à la main sur une maquette de la carte, et on récolte des bananes pour financer le tout. Semaine 1, prouver : un prototype gris jouable au casque. Semaine 2, construire : le jeu complet, du menu jusqu'aux 100 vagues. Le jeu s'accompagne d'un game design document (GDD), qui décrit le concept, les mécaniques et l'équilibrage : il est encore en cours et évolue avec le projet.",
      team: [
        { name: 'Dylan', role: 'Hub, carte et singes, intégration, dépôt Git' },
        { name: 'Maxens (moi)', role: "Économie : la bananeraie, bonus de gameplay, casino, sons, coffre et raretés, améliorations de l'arc" },
      ],
      sectionsTitle: 'Le jeu',
      sectionsIntro:
        "Le hub est passé d'un cercle de cubes gris à une cabane posée au milieu des montagnes. Pour avancer à deux sans se marcher dessus : une branche par tâche, des pull requests relues, un tableau d'issues GitHub, un test au casque par jour et un build chaque vendredi. Chacun tient un journal de bord, y compris son usage de l'IA.",
      sectionsIntroImages: [`${BLOONS}/avant-hub-gris.webp`, `${BLOONS}/apres-cabane.webp`],
      sections: [
        {
          title: 'Le hub',
          text: "Une cabane en rondins modélisée dans Blender par script Python, éclairée aux lanternes. Au centre, une maquette de la carte qui montre la vague en direct : on y pose ses singes à la main et on en fusionne deux identiques pour monter de rareté. Autour : la bibliothèque des singes (7 types × 8 raretés), le coffre et l'armoire à trophées. Aucun texte collé au visage : tout est écrit sur des ardoises et des plaques du décor.",
          images: [`${BLOONS}/cabane-interieur.webp`, `${BLOONS}/maquette-direct.webp`, `${BLOONS}/bibliotheque.webp`, `${BLOONS}/trophees.webp`],
        },
        {
          title: 'La carte et les vagues',
          text: "Un labyrinthe à taille réelle où l'on défend le chemin à l'arc, avec des améliorations (perforante, tir triple, explosion). 100 vagues progressives : ballons rapides, blindés, boss qui se divisent en éclatant, et dirigeables rouges aux vagues 25, 50, 75 et 100. Chaque vague de boss est annoncée par des cloches puis un orage : pluie, brume, éclairs et un tonnerre qu'on sent dans les manettes.",
          images: [`${BLOONS}/carte.webp`, `${BLOONS}/boss-orage.webp`, `${BLOONS}/boss-divise.webp`, `${BLOONS}/orage.webp`],
        },
        {
          title: 'La bananeraie',
          mine: true,
          text: "Ma partie : un niveau à part, derrière la porte de la cabane, qui finance tout le jeu. On attrape les bananes et on les lance dans le panier avant qu'elles pourrissent, on plante jusqu'à 3 bananiers et on achète des singes récolteurs qui se répartissent le travail. Une banane sur 25 tombe dorée et vaut 10 fois plus. Le bananier continue de produire pendant qu'on défend la carte.",
          images: [`${BLOONS}/bananeraie.webp`, `${BLOONS}/trois-bananiers.webp`, `${BLOONS}/recolteurs.webp`, `${BLOONS}/arrivee-bananeraie.webp`, `${BLOONS}/banane-doree.webp`],
        },
        {
          title: 'Coffre et casino',
          text: "Le coffre s'ouvre sur une roulette façon CS, avec des raretés qui se débloquent au fil des vagues. Dans la bananeraie, j'ai refait la roulette du casino : un tapis à 3 zones, des jetons, et une roue qu'on lance à la main comme un croupier, modélisée par script dans Blender. En fin de semaine 2, une borne de blackjack contre un singe croupier est venue la rejoindre sur la terrasse, à côté du classement.",
          images: [`${BLOONS}/coffre-roulette.webp`, `${BLOONS}/casino.webp`, `${BLOONS}/roulette-blender.webp`],
        },
        {
          title: 'Menus et progression',
          text: "Un menu principal avec pause et options, une sauvegarde automatique, un tutoriel en 17 étapes sur des tableaux du décor, des trophées du bronze au diamant, et un classement local et en ligne (serveur PHP + MySQL de l'IUT). En bonus, un mode coop en ligne avec Netcode et Unity Relay. Tout ça en visant 72 images par seconde sur le Quest.",
          images: [`${BLOONS}/tutoriel.webp`, `${BLOONS}/classement.webp`, `${BLOONS}/trophee-succes.webp`],
        },
      ],
      stepsTitle: 'Ma part',
      steps: [
        {
          title: 'La bananeraie',
          text: "Un niveau à part derrière la porte de la cabane : jusqu'à 3 bananiers, des bananes à attraper et lancer dans le panier avant qu'elles pourrissent, et des singes récolteurs qui se répartissent le travail.",
        },
        {
          title: 'Bonus de gameplay',
          text: "Des boss qui se divisent en éclatant, des bananes dorées (1 sur 25, ×10), l'annonce des vagues de boss et une vibration différente pour chaque action.",
        },
        {
          title: 'Le casino',
          text: "Refonte de la roulette : un tapis à 3 zones, des jetons, et une roue qu'on lance à la main comme un croupier, modélisée par script dans Blender.",
        },
        {
          title: 'Sons & musique',
          text: "Tous les sons branchés dans le jeu, des musiques qui changent selon la phase (préparation, vague, boss) et un tic de roulette généré par le code.",
        },
      ],
      learning:
        "Mesurer avant de corriger : les singes récolteurs semblaient se bloquer, ils n'avançaient en fait qu'au tiers de leur vitesse à cause de l'interpolation physique. Et en VR, chaque idée se valide au casque, pas dans l'éditeur.",
      // de nouvelles captures (ma partie surtout), qui n'apparaissent pas plus haut
      photos: [
        'allee-vers-porte', 'allee-vue', 'bananeraie-portail', 'bananeraie-singes-dehors', 'arc-tendu', 'vr-fleche-encochee',
        'ballons-tous', 'tableau-boss-arrive', 'tableau-vague-boss', 'coffre-ouvert', 'coffre-roulette-tous-types', 'roulette-en-jeu',
      ].map((name) => `${BLOONS}/galerie-${name}.webp`),
    },
  },
  {
    title: 'Gestion MMI', category: 'UI/UX', context: 'Projet de cours · refonte UX/UI', year: '2026', mmi: 3,
    images: [`${GMMI}/couverture.webp`, `${GMMI}/telephone-sombre.webp`, `${GMMI}/deplacement.webp`], home: 3,
    details: {
      pitch:
        "La refonte de l'outil interne du département MMI : un outil utile mais pénible, codé vite et sans design, que j'ai repensé de l'audit jusqu'au prototype cliquable, pour que chaque enseignant trouve d'abord ce qui le concerne.",
      role: 'UX/UI designer',
      duration: 'Sept. – oct. 2026',
      context: 'BUT MMI 3, IUT de Béziers',
      tools: ['Figma', 'FigJam', 'Google Forms'],
      // Prototypes sur ordinateur, un par parcours (hide-ui : sans l'interface de Figma autour)
      links: [
        {
          label: 'Proto · enseignant',
          href: 'https://www.figma.com/proto/Qu0yrfwUhnAsUVBJdTjSVP/Therond---Gestion-MMI?page-id=116:8072&node-id=18-3&starting-point-node-id=18-3&scaling=scale-down&hide-ui=1',
        },
        {
          label: 'Proto · chef de département',
          href: 'https://www.figma.com/proto/Qu0yrfwUhnAsUVBJdTjSVP/Therond---Gestion-MMI?page-id=116:8070&node-id=116-7926&starting-point-node-id=116-7926&scaling=scale-down&hide-ui=1',
        },
      ],
      problemTitle: 'Le point de départ',
      problemImages: [`${GMMI}/avant-accueil.webp`, `${GMMI}/avant-repartition.webp`, `${GMMI}/avant-maquette.webp`],
      problem:
        "Gestion MMI, c'est l'outil interne du département : le planning des événements, la répartition des cours entre enseignants, les souhaits d'enseignement et les jurys de soutenance. Il marche, mais il a été codé vite : des emojis à la place d'icônes, 12 couleurs de groupes sans légende, aucun menu permanent, pas de recherche, un total à 200 % et un bouton « Enregistrer sur GitHub ». Sur téléphone, c'est l'ordinateur en plus petit. Le projet demandait de le repenser entièrement, avec en plus une nouvelle fonction : demander à déplacer un cours.",
      sectionsTitle: 'La refonte',
      sectionsIntro:
        "Le planning était l'écran le plus critiqué : tout le département affiché, une couleur par groupe, rien pour se repérer. Il résume bien la refonte. Avant, l'outil montrait tout à tout le monde ; maintenant, il montre d'abord « mes cours », « mes soutenances » et ce qui me reste à faire, et le reste du département est à un clic. L'outil se découpe en deux parcours : celui de l'enseignant, qui consulte ses cours, ses souhaits et ses soutenances, et celui du chef de département, qui garde tout cet espace et y ajoute la gestion (répartition, équipe, jurys, demandes à valider). Chacun existe sur ordinateur et sur téléphone.",
      sectionsIntroImages: [`${GMMI}/avant-planning.webp`, `${GMMI}/planning.webp`],
      sections: [
        {
          title: 'Écouter avant de dessiner',
          text: "J'ai d'abord audité l'outil écran par écran, puis lancé deux questionnaires et un entretien avec deux enseignantes. Le premier questionnaire, trop long, ne récoltait que des « RAS » : je l'ai refait plus court, et envoyé aux enseignants titulaires. Les retours ont été clairs : aucun module ne dépasse 2,6/5, le planning fait « arc-en-ciel », un responsable compte ses séances à la main à côté de l'écran, et pour déplacer cinq cours il faut remplir « cinq fois l'usine à clics ». De là sont nés deux personas, Gérard l'enseignant et Julien le responsable, puis 42 idées triées par impact et par effort.",
        },
        {
          title: 'Une identité à elle',
          text: "L'outil n'avait ni nom stable ni logo : il empruntait ceux de l'IUT. J'ai dessiné un symbole où deux silhouettes en arche forment le « m » de MMI ; la tête verte, c'est vous, « ce qui me concerne ». Un violet créatif mais assez foncé pour rester sérieux, un vert d'accent, et deux polices : Bricolage Grotesque pour les titres, Atkinson Hyperlegible pour le texte. Toutes les couleurs sont des variables Figma en clair et en sombre, avec chaque contraste vérifié selon le WCAG.",
          images: [`${GMMI}/identite-logo.webp`, `${GMMI}/identite-couleurs.webp`, `${GMMI}/identite-typo.webp`],
        },
        {
          title: 'Un accueil pour chacun',
          text: "L'accueil devient un tableau de bord personnel. Gérard y voit ses cours du jour, ses prochaines soutenances, l'échéance de ses souhaits et son service d'heures. Julien, le responsable, y voit surtout ce qu'il reste à traiter : les dépassements d'heures, les ressources sans enseignant, les demandes en attente. Un menu permanent ne montre que ce que les droits de chacun permettent.",
          images: [`${GMMI}/accueil-enseignant.webp`, `${GMMI}/accueil-responsable.webp`],
        },
        {
          title: 'Un planning lisible',
          text: "« Mon planning » s'ouvre par défaut, en semaine, avec un repère « maintenant ». Une couleur par famille de groupes au lieu de douze, et le nom du groupe toujours écrit dessus : la couleur ne parle jamais seule. Les SAÉ, qui se répétaient chaque jour, deviennent une barre de période. Les douze boutons de groupes deviennent deux filtres déroulants, Groupes et Salles, avec les groupes rangés par promo et par parcours.",
          images: [`${GMMI}/wireframe-planning.webp`, `${GMMI}/planning-salles.webp`, `${GMMI}/planning-sombre.webp`],
        },
        {
          title: 'Déplacer un cours',
          text: "La nouvelle fonction, et l'écran le plus poussé. En trois étapes : on choisit un ou plusieurs cours dans une seule demande, l'outil propose les créneaux où le groupe et l'enseignant sont libres, puis on donne un motif. Une confirmation claire suit l'envoi, et chaque demande a un statut : en attente, acceptée, refusée. Côté responsable, il l'accepte, la refuse ou propose un autre créneau, et l'enseignant est prévenu.",
          images: [`${GMMI}/wireframe-deplacement.webp`, `${GMMI}/deplacement.webp`, `${GMMI}/traiter-demande.webp`],
        },
        {
          title: 'Souhaits, soutenances et répartition',
          text: "Les souhaits affichent leurs règles, un compteur et un statut (brouillon, envoyé, validé). Les soutenances ont enfin une vue « mes soutenances » et une fiche complète. Pour le responsable, la répartition filtre ce qui pose problème, explique ses calculs au clic et compte les séances à côté des heures ; la composition des jurys vérifie les disponibilités.",
          images: [`${GMMI}/souhaits.webp`, `${GMMI}/soutenances.webp`, `${GMMI}/repartition.webp`, `${GMMI}/jurys.webp`],
        },
        {
          title: 'Téléphone et mode sombre',
          text: "Sur ordinateur, on gère ; sur téléphone, on consulte. La version mobile a une barre d'onglets en bas, des cartes à la place des tableaux, et des notifications quand une demande est acceptée ou qu'un cours bouge. Chacun des 15 écrans existe en clair et en sombre, sur ordinateur et sur téléphone.",
          images: [`${GMMI}/telephone-clair.webp`, `${GMMI}/telephone-sombre.webp`, `${GMMI}/accueil-sombre.webp`],
        },
      ],
      steps: [
        { title: 'Audit', text: "L'outil passé au crible écran par écran : navigation, couleurs, hiérarchie, jargon, actions risquées." },
        { title: 'Écoute', text: 'Deux questionnaires et un entretien avec des enseignantes, titulaire et vacataire.' },
        { title: 'Définition', text: 'Deux personas, une carte d’empathie, une problématique et 42 idées triées par impact et effort.' },
        { title: 'Conception', text: 'Arborescence, wireframes, design system, 15 écrans finaux et 4 prototypes cliquables.' },
      ],
      results: [
        { value: '15', label: 'écrans, chacun en clair et en sombre, sur ordinateur et sur téléphone' },
        { value: '42', label: 'idées issues de la recherche, triées par impact et par effort' },
        { value: '4', label: 'prototypes cliquables : les deux parcours, enseignant et chef de département, sur ordinateur et sur téléphone' },
      ],
      learning:
        "Un questionnaire trop long ne récolte que des « RAS » : la version courte, envoyée aux bons profils, m'en a appris bien plus. Et tant qu'il n'est pas testé par de vrais enseignants, un prototype reste une hypothèse : c'est la prochaine étape.",
      // des écrans qui n'apparaissent pas plus haut
      photos: [
        'connexion', 'galerie-wireframe-accueil', 'galerie-enseignants', 'galerie-journal', 'galerie-compte', 'galerie-planning-departement',
        'galerie-souhaits-equipe', 'galerie-wireframe-repartition', 'galerie-repartition-sombre', 'galerie-deplacement-sombre',
        'galerie-traiter-sombre', 'galerie-jurys-sombre',
      ].map((name) => `${GMMI}/${name}.webp`),
    },
  },
  // À compléter : visuels provisoires
  {
    // Projet perso : les captures viennent d'un foyer de démo (Maxens et Léa, données inventées), jamais de nos vrais comptes
    title: 'App budget', category: 'Dév web', context: 'Projet perso · app mobile', year: '2026', mmi: 3,
    images: [`${BUDGET}/couverture.webp`, `${BUDGET}/commun.webp`, `${BUDGET}/budget.webp`], home: 4,
    details: {
      pitch:
        "Une app installable sur téléphone, que j'ai conçue et développée pour ma copine et moi : chacun y suit son budget perso, et nos dépenses communes se partagent et se remboursent sans calcul. Un projet perso, construit avec Claude Code. Toutes les captures viennent d'un compte test, avec des données inventées : nos vrais comptes restent privés.",
      role: 'Designer & développeur',
      duration: 'Novembre 2026',
      context: 'Projet perso',
      tools: ['Figma', 'Next.js', 'TypeScript', 'Supabase', 'Claude Code'],
      problemTitle: 'Le besoin',
      problem:
        "À deux, on jonglait entre un tableur, des notes et des « je te dois combien ? ». Je voulais une seule app pour deux usages : le budget de chacun, qui reste privé, et un espace commun où les dépenses partagées se règlent toutes seules. J'ai commencé par un cahier des charges, puis dessiné l'identité dans Figma : du gris chaud, des pastels, et trois pastilles qui se chevauchent pour le logo.",
      problemImages: [`${BUDGET}/accueil-a-deux.webp`],
      sectionsTitle: "L'app",
      sections: [
        {
          title: 'Le Commun',
          text: "Une dépense se partage en 50/50, en pourcentage ou au montant exact, et l'app alterne le centime quand le compte ne tombe pas rond. On voit le même solde, chacun de son côté : « Léa te doit » d'un côté, « Tu dois à Maxens » de l'autre. On se rembourse par virement ou en espèces, que l'autre confirme, et « Faire les comptes » clôt le mois.",
          images: [`${BUDGET}/commun.webp`],
        },
        {
          title: 'Le budget perso',
          text: "Des catégories, des enveloppes mensuelles qui passent à l'orange à 80 % et au rouge à 100 %, les revenus attendus et un reste à vivre qui compte ma part du Commun. Le bilan compare chaque catégorie au mois précédent.",
          images: [`${BUDGET}/budget.webp`],
        },
        {
          title: 'Voir venir',
          text: "Le calendrier montre les jours les plus dépensiers et ce qui est prévu. Les récurrents (abonnements, aides, épargne) se rapprochent des vraies opérations, et les objectifs d'épargne avancent avec le solde des livrets.",
          images: [`${BUDGET}/organisation.webp`],
        },
        {
          title: 'Banque et sécurité',
          text: "Les opérations arrivent de la banque toutes seules, sans doublons, et se classent grâce à des règles. Côté sécurité : inscription fermée, double authentification, et des règles d'accès dans la base Supabase pour que chacun ne voie que ce qui le concerne.",
          images: [`${BUDGET}/comptes.webp`],
        },
        {
          title: 'Développée avec Claude Code',
          text: "J'ai développé l'app avec Claude Code, l'agent de code d'Anthropic. J'ai gardé la main sur ce qui compte : le cahier des charges, les maquettes, les choix techniques, la relecture et les tests sur nos téléphones. Lui écrivait le code avec moi, phase par phase. Résultat : quatre phases livrées en quelques jours, avec des tests automatiques sur les calculs et sur les règles d'accès.",
        },
      ],
      steps: [
        { title: 'Cahier des charges', text: 'Nos usages à deux, découpés en phases : fondations, Commun, budget perso, synchro bancaire.' },
        { title: 'Identité', text: "Une DA dans Figma : gris chaud, pastels et un logo de trois pastilles qui se chevauchent." },
        { title: 'Développement', text: "Next.js, TypeScript et Supabase, avec Claude Code : je cadre, il code, je relis et je teste." },
        { title: 'Usage réel', text: "L'app tourne sur nos téléphones, et chaque irritant du quotidien devient une correction." },
      ],
      results: [
        { value: '37', label: "écrans, du tableau de bord aux réglages, pensés d'abord pour le téléphone" },
        { value: '159', label: "tests automatiques sur les calculs, l'import des relevés et les règles d'accès" },
        { value: '4', label: 'phases livrées en quelques jours : fondations, Commun, budget perso et synchro bancaire' },
      ],
      learning:
        "Un agent de code va vite, mais il fait ce qu'on lui demande : plus mon cahier des charges et mes maquettes étaient précis, meilleur était le résultat. Mon rôle s'est déplacé vers la conception, la relecture et les tests, et savoir cadrer une IA est devenu une compétence à part entière.",
      // presque tous les écrans du compte test de Maxens
      photos: [
        'accueil', 'accueil-2', 'notifications', 'budget', 'budget-2', 'categorie', 'enveloppes', 'revenus', 'recurrents', 'epargne',
        'bilan', 'revue', 'revue-2', 'calendrier', 'commun', 'commun-detail', 'commun-nouvelle', 'commun-rembourser', 'commun-comptes', 'comptes',
        'compte', 'transaction', 'operation-nouvelle', 'reglages', 'reglages-categories', 'reglages-regles', 'reglages-foyer',
        'reglages-notifications', 'reglages-securite', 'reglages-banques',
      ].map((name) => `${BUDGET}/galerie-${name}.webp`),
    },
  },
  {
    // 1re image = la grande de la carte : le Marathon MMI, puis Vox, puis Kill Bill
    title: 'Motion design', category: 'Motion', context: 'After Effects · Animate', year: '2025', mmi: 2,
    images: [`${MOTION}/marathon.mp4`, `${MOTION}/vox.mp4`, `${MOTION}/kill-bill.mp4`], home: 5,
    cover: `${MOTION}/marathon-couverture.webp`,
    details: {
      pitch: 'Trois vidéos animées, de mes débuts sur After Effects à une commande pour un vrai prestataire.',
      role: 'Motion designer',
      duration: '2e et 3e année',
      context: 'BUT MMI, IUT de Béziers',
      tools: ['After Effects', 'Animate'],
      // pas de partie d'intro : on passe directement aux trois vidéos
      problem: '',
      sections: [
        {
          title: 'Marathon MMI',
          text: "Réalisée pendant le Marathon MMI de 2e année, un événement où l'on travaille pour un vrai prestataire, avec ses attentes et ses délais. Une vidéo de présentation de Level Up, un projet de l'IUT de Montpellier qui explore les compétences développées par les jeux de stratégie, les jeux de rôles ou le storytelling.",
          images: [`${MOTION}/marathon.mp4`],
        },
        {
          title: 'Exercice « Vox »',
          text: 'Typographie animée et synchronisation audio précise.',
          images: [`${MOTION}/vox.mp4`],
        },
        {
          title: 'Générique Kill Bill',
          text: "SAÉ · After Effects + Animate : un générique de film complet, avec un vrai travail sur les transitions et l'atmosphère. Ce sont mes débuts sur After Effects : le rendu n'est pas parfait, mais c'est un bon début.",
          images: [`${MOTION}/kill-bill.mp4`],
        },
      ],
      steps: [],
    },
  },
  {
    // Affiche de 1re année retenue et exposée à la mairie ; pas de noms propres dans le texte (prof, maire)
    title: 'Vivre & étudier à Béziers', category: 'Graphisme', context: 'Affiche · exposée à la mairie', year: '2025', mmi: 1,
    images: [`${VIVRE}/affiche.webp`, `${VIVRE}/mairie-groupe.webp`, `${VIVRE}/affiche-hd.webp`],
    details: {
      pitch:
        "Une affiche pour donner envie de venir étudier à Béziers : la ville racontée en illustrations, de ses monuments au canal. Retenue parmi celles de la promo, elle a été exposée à la mairie.",
      role: 'Graphiste & illustrateur',
      duration: 'Février 2025',
      context: 'BUT MMI 1, IUT de Béziers',
      tools: ['Illustrator', 'InDesign'],
      problemTitle: 'Le projet',
      problem:
        "« Vivre et étudier à Béziers en 2025 » : chaque étudiant de la promo devait créer une affiche qui donne une image dynamique et inspirante de la ville, pour attirer les étudiants de demain. Le but de départ était de suivre une direction artistique imposée : tout le travail consistait à trouver ma place à l'intérieur de ce cadre. J'ai choisi de raconter Béziers comme une balade : ses monuments (la cathédrale, les halles, le pont Vieux…) reliés par un cours d'eau qui serpente sur toute l'affiche, dans un style plat et coloré, avec un petit personnage en kayak et un goéland pour la touche de vie.",
      sections: [
        {
          title: 'Exposée à la mairie',
          text: "Les affiches ont été présentées lors des vœux de la direction de l'IUT et ont reçu un très bon accueil. La mienne fait partie de celles retenues : le maire de Béziers a salué le travail et a souhaité exposer les affiches à la mairie, où nous avons été invités pour le vernissage. Mon premier projet avec une vraie visibilité, au-delà de l'école.",
          images: [`${VIVRE}/mairie-affiche-v2.webp`, `${VIVRE}/mairie-groupe.webp`],
        },
      ],
      steps: [
        { title: 'Suivre la DA', text: "Partir de la direction artistique imposée par le sujet, et la respecter jusqu'au bout." },
        { title: 'Repérer', text: 'Les lieux qui font Béziers, de la cathédrale aux halles en passant par le pont Vieux.' },
        { title: 'Illustrer', text: 'Chaque monument redessiné en vectoriel dans Illustrator, dans un style plat aux couleurs chaudes.' },
        { title: 'Composer', text: "Une balade qui serpente le long de l'eau, puis la mise en page finale dans InDesign." },
      ],
    },
  },
  {
    // Deux vidéos de 1re année. « Je filme ma formation » : fichier d'origine non réencodé (choix de l'utilisateur),
    // montage crédité à une coéquipière, ne pas me l'attribuer. Pub musique : intégrée depuis YouTube (rien de téléchargé).
    title: 'Vidéo', category: 'Motion', context: 'Court-métrage & concours · en équipe', year: '2025', mmi: 1,
    images: [`${FILME_VIDEO}/je-filme-ma-formation.mp4`, 'youtube:aPt2vD_mj0k', `${FILME}/hero-pianiste.webp`],
    cover: `${FILME}/hero-pianiste.webp`,
    details: {
      pitch:
        "Deux projets vidéo tournés en équipe en première année : « Bienvenue en MMI », sélectionné au concours national « Je filme ma formation », et un court-métrage publicitaire autour de la musique.",
      role: 'Scénario & tournage',
      duration: '2024 – 2025',
      context: 'BUT MMI 1, en équipe',
      tools: ['Scénario', 'Tournage'],
      problemTitle: 'Je filme ma formation',
      problem:
        "Le concours national « Je filme ma formation » invite les étudiants à présenter leur formation en vidéo. À quatre, pour la SAÉ 1.06, on voulait faire découvrir le BUT MMI de façon claire, dynamique et accessible, en montrant toutes les compétences qu'on y développe, sans tomber dans la vidéo de présentation classique. Résultat : « Bienvenue en MMI », 2 min 40.",
      problemImages: [`${FILME_VIDEO}/je-filme-ma-formation.mp4`],
      sections: [
        {
          title: 'Une matière, un genre',
          text: "Pour éviter la visite guidée, chaque matière prend le style d'un genre de film : le développement web façon Matrix, un western sous le soleil, une ambiance de télénovela pour l'espagnol, une vieille cassette VHS pour la communication, un plateau éclairé comme au cinéma. Entre deux, des étudiants racontent la formation face caméra, smartphone en main.",
        },
        {
          title: 'Sélectionnée au Grand Rex',
          text: "Notre vidéo a été retenue pour la cérémonie officielle du concours, au Grand Rex à Paris. Nous n'avons pas remporté de prix, mais c'était une vraie reconnaissance pour un premier projet vidéo complet en équipe, de l'écriture du scénario au tournage avec nos professeurs et nos camarades.",
        },
        {
          title: 'Publicité sur la musique',
          text: "Un court-métrage publicitaire autour de la musique, tourné en format cinéma : une jeune femme en robe rouge, la lumière naturelle d'une fenêtre et des plans serrés, pour faire ressentir l'écoute plutôt que de la montrer. J'ai participé à l'écriture et au tournage.",
          images: ['youtube:aPt2vD_mj0k'],
        },
      ],
      steps: [
        { title: 'Écrire', text: "Un scénario pensé pour l'image : un genre par matière, une ambiance pour la pub." },
        { title: 'Tourner', text: 'Cadrage et lumière, avec les moyens du bord : IUT, extérieurs, lumière naturelle.' },
        { title: 'Monter', text: "Effets, transitions et rythme, pour tenir l'attention du début à la fin." },
      ],
    },
  },
  {
    // R507 en binôme ; l'utilisateur ne veut pas de répartition « qui a fait quoi » sur la page
    title: 'Blockchain 3D', category: 'UI/UX', context: 'Expérience web 3D · en binôme', year: '2026', mmi: 3,
    images: [`${CHAIN}/etape-2.webp`, `${CHAIN}/etape-5.webp`, `${CHAIN}/etape-6.webp`],
    cover: `${CHAIN}/etape-1.webp`,
    details: {
      pitch:
        "Une expérience web en 3D pour faire comprendre la blockchain à quelqu'un qui n'y connaît rien : une maquette en papier découpé où l'on suit une transaction, de sa création jusqu'à une tentative de triche.",
      role: 'Designer UI/UX',
      duration: 'Octobre – novembre 2026',
      context: 'Ressource R507, BUT MMI 3, en binôme',
      tools: ['Three.js', 'Vite', 'Tests utilisateurs', 'GitHub Projects'],
      links: [
        { label: "Voir l'expérience", href: 'https://dyzlek.github.io/r507-blockchain-3d/' },
        { label: 'Code source', href: 'https://github.com/dyzlek/r507-blockchain-3d' },
      ],
      problemTitle: 'Le défi',
      problem:
        "La blockchain est pleine de mots qui font peur : hachage, minage, consensus, double dépense. Le sujet demandait une visualisation pédagogique pour un public non initié. Notre parti pris : tout raconter avec des objets du quotidien, posés sur un bureau, et suivre un seul fil rouge, « Dylan envoie 5 jetons à Maxens ».",
      sectionsTitle: "L'expérience",
      sections: [
        {
          title: 'Une maquette en papier découpé',
          text: "Les blocs deviennent des coffres en carton, les empreintes des tampons encreurs, le réseau un archipel d'îles reliées par des avions en papier. Une image simple pour chaque notion, et un encart « En vrai… » qui donne le terme technique exact et la limite de la métaphore.",
          images: [`${CHAIN}/etape-2.webp`],
        },
        {
          title: 'Huit étapes, une transaction',
          text: "Le parcours avance notion par notion : la structure d'un bloc, le chaînage par les sceaux, la falsification qui se voit, le réseau, le minage, le consensus et enfin la double dépense. À chaque étape, on agit : allumer la lampe du coffre, falsifier un bloc, éteindre une île, lancer le minage. Les empreintes sont de vrais SHA-256 calculés dans le navigateur.",
          images: [`${CHAIN}/etape-3.webp`, `${CHAIN}/etape-4.webp`, `${CHAIN}/etape-5.webp`, `${CHAIN}/etape-6.webp`],
        },
        {
          title: 'Consensus et double dépense',
          text: "Les deux notions les plus abstraites ont leur propre mise en scène : une course entre les îles pour la preuve de travail et la preuve d'enjeu, puis une chaîne secrète qui tente de doubler la vraie pour dépenser deux fois les mêmes jetons.",
          images: [`${CHAIN}/etape-7.webp`, `${CHAIN}/etape-8.webp`],
        },
        {
          title: 'Accessible et testé',
          text: "Contrastes mesurés, états toujours doublés par du texte, parcours entièrement faisable au clavier, animations réduites si on le demande, et une version téléphone où la fiche passe sous la scène. On l'a ensuite fait tester par des personnes non initiées : la structure d'un bloc et la falsification passent bien, le consensus et la double dépense beaucoup moins, ce qui nous a donné les priorités de la seconde version.",
        },
      ],
      steps: [
        { title: 'Cadrer', text: "Le public, les sept notions à faire comprendre et le fil rouge de la transaction." },
        { title: 'Imaginer', text: 'Une métaphore par notion et une direction artistique en papier découpé.' },
        { title: 'Construire', text: 'Le parcours en huit étapes, chacune avec son interaction, intégré en Three.js.' },
        { title: 'Tester', text: 'Un protocole de test et un questionnaire de compréhension, puis des corrections.' },
      ],
    },
  },
  {
    // Premier projet JavaScript, gardé pour montrer l'évolution. Données : une playlist Spotify réelle (pas forcément la mienne)
    title: 'Spotify Stats', category: 'Dév web', context: 'Premier projet JavaScript', year: '2025', mmi: 1,
    images: [`${SPOTIFY}/accueil.webp`, `${SPOTIFY}/albums.webp`, `${SPOTIFY}/details-morceau.webp`],
    details: {
      pitch:
        "Mon tout premier site en JavaScript, en première année : un tableau de bord de statistiques Spotify. Je le garde ici pour montrer d'où je suis parti.",
      role: 'Développeur web',
      duration: 'Semestre 2',
      context: 'BUT MMI 1, IUT de Béziers',
      tools: ['JavaScript', 'Bootstrap', 'Chart.js', 'JSON'],
      problemTitle: 'Le projet',
      problem:
        "À partir d'un export de données Spotify réelles, le site affiche le top 10 des artistes, la répartition des genres, les albums les plus écoutés et la liste complète des morceaux. Un clic sur un morceau ouvre une fenêtre avec sa pochette, un extrait audio, sa popularité et ses artistes.",
      sections: [
        {
          title: 'Mes débuts avec le DOM',
          text: "Tout est généré en JavaScript à partir d'un fichier JSON : les graphiques avec Chart.js, les cartes d'albums et le tableau des morceaux. C'est aussi là que j'ai découvert Bootstrap, en construisant les fenêtres de détail, et que j'ai compris l'importance d'une navigation claire et d'une mise en page responsive.",
          images: [`${SPOTIFY}/albums.webp`, `${SPOTIFY}/details-morceau.webp`, `${SPOTIFY}/liste-morceaux.webp`],
        },
        {
          title: 'Le chemin parcouru',
          text: "Un an et demi plus tard, je conçois mes interfaces dans Figma avant de les coder, je travaille avec React, Next.js et TypeScript, et je relie mes sites à de vraies bases de données. Ce premier projet reste la base de tout le reste.",
        },
      ],
      steps: [
        { title: 'Lire les données', text: "Charger et parcourir un fichier JSON d'export Spotify." },
        { title: 'Visualiser', text: 'Deux graphiques Chart.js : top des artistes et répartition des genres.' },
        { title: 'Afficher', text: 'Cartes, tableau et fenêtres de détail générés dans le DOM avec Bootstrap.' },
      ],
    },
  },
  {
    // Projet perso pendant la 1re année de BUT MMI (en dehors des cours)
    title: 'Loup-Garou en ligne', category: 'Dév web', context: 'Projet perso · jeu multijoueur', year: '2025', mmi: 1,
    images: [`${LOUP}/nuit-loups.webp`, `${LOUP}/salle-attente.webp`, `${LOUP}/fin.webp`],
    details: {
      pitch:
        "Un projet perso, fait pendant ma première année de BUT MMI : le jeu du Loup-Garou, jouable à plusieurs en temps réel dans le navigateur, chacun sur son téléphone ou son ordinateur.",
      role: 'Développeur',
      duration: 'BUT MMI 1',
      context: 'Projet personnel',
      tools: ['Node.js', 'Express', 'Socket.io', 'JavaScript'],
      links: [{ label: 'Code source', href: 'https://github.com/MaxX-J/Werewolf-Game' }],
      problemTitle: "L'idée",
      problem:
        "Jouer au Loup-Garou entre amis sans meneur de jeu ni cartes : un joueur crée une partie, partage un code à quatre lettres, et le serveur distribue les rôles, enchaîne les nuits et les jours, compte les votes et annonce la victoire. De 5 à 12 joueurs.",
      problemImages: [`${LOUP}/accueil.webp`, `${LOUP}/salle-attente.webp`],
      sectionsTitle: 'Le jeu',
      sections: [
        {
          title: 'La nuit',
          text: "Chacun découvre son rôle en secret : loup-garou, voyante, sorcière, chasseur ou simple villageois. La nuit, seuls les joueurs concernés voient leur action : les loups votent ensemble pour leur victime, la voyante découvre un rôle, la sorcière choisit d'utiliser ou non ses potions.",
          images: [`${LOUP}/role-loup.webp`],
        },
        {
          title: 'Le jour',
          text: "Au lever du jour, le village apprend qui est mort, discute dans le chat de la partie puis vote pour éliminer un suspect. Le chasseur emporte quelqu'un avec lui en mourant. La partie s'arrête quand tous les loups sont éliminés, ou quand ils sont aussi nombreux que les villageois.",
          images: [`${LOUP}/jour-discussion.webp`, `${LOUP}/vote.webp`, `${LOUP}/fin.webp`],
        },
        {
          title: 'Sous le capot',
          text: "Un serveur Node.js avec Express et Socket.io garde l'état de chaque partie et envoie à chaque joueur uniquement ce qu'il a le droit de voir : son rôle, les autres loups s'il en est un, le résultat de la voyante. Le client, en JavaScript sans framework, réagit aux événements en temps réel.",
        },
      ],
      steps: [
        { title: 'Règles', text: 'Les rôles, l’ordre de la nuit et les conditions de victoire traduits en logique de jeu.' },
        { title: 'Serveur', text: 'Parties identifiées par un code, état partagé et événements en temps réel avec Socket.io.' },
        { title: 'Interface', text: 'Accueil, salle d’attente, actions de nuit, chat, vote et écran de fin.' },
      ],
    },
  },
  {
    // Hackathon 2026 de l'IUT, équipe Fabrikus World (MMI + ROB/IA + RT, 10-11 personnes) ; moi : dashboard + concept/pitch.
    // Texte à compléter avec le document final rendu (l'utilisateur le cherche)
    title: 'SmartWaste', category: 'Dév web', context: 'Hackathon 2026 · équipe pluridisciplinaire', year: '2026', mmi: 2,
    images: [`${HACK}/tableau-de-bord.webp`, `${HACK}/fiche-poubelle.webp`, `${HACK}/tableau-de-bord.webp`],
    details: {
      pitch:
        "Au hackathon 2026 de l'IUT, notre équipe a travaillé pour Fabrikus World, un parc d'attractions : SmartWaste, un tableau de bord qui montre aux équipes d'entretien quelles poubelles du parc vider en priorité.",
      role: 'Développeur front & pitch',
      duration: 'Hackathon',
      context: 'Hackathon 2026, IUT de Béziers',
      tools: ['HTML', 'CSS', 'JavaScript'],
      problemTitle: 'Le défi',
      problem:
        "Plusieurs commanditaires, et des équipes qui mélangeaient les filières de l'IUT : MMI, robotique et intelligence artificielle, réseaux et télécoms. Dans notre équipe d'une dizaine d'étudiants, chacun s'occupait de son domaine, mais l'idée est née ensemble, en brainstorming : aider les équipes d'entretien de Fabrikus World à savoir où intervenir, plutôt que de faire la tournée de toutes les poubelles.",
      sections: [
        {
          title: 'Le tableau de bord',
          text: "J'ai développé l'interface que verraient les agents : la carte du parc avec ses quatre zones (Farwest, Belle Époque, Pirate et Jungle), chaque poubelle placée et colorée selon son état, et à côté la liste triée par priorité d'intervention. Une poubelle a trois bacs (recyclage, verre, ordures) : la plus pleine passe en tête, de « Correct » à « À vider » puis « Critique ». Un clic ouvre sa fiche avec les jauges de chaque bac et un bouton pour l'ajouter à l'itinéraire. Dans cette maquette, les niveaux de remplissage sont simulés.",
          images: [`${HACK}/fiche-poubelle.webp`],
        },
        {
          title: 'Le pitch',
          text: "J'ai aussi participé à la construction du concept et au pitch final : présenter en quelques minutes le problème du parc, la solution de l'équipe et la part de chaque filière.",
        },
      ],
      steps: [
        { title: 'Comprendre', text: 'Le besoin du commanditaire, discuté avec toute l’équipe.' },
        { title: 'Imaginer', text: 'Le concept SmartWaste, trouvé ensemble en brainstorming.' },
        { title: 'Développer', text: 'La carte, les jauges et le tri par priorité, en HTML, CSS et JavaScript.' },
        { title: 'Pitcher', text: 'Présenter la solution de toute l’équipe.' },
      ],
    },
  },
  {
    // SAÉ 3.01 en trio ; captures : celles de mon ancien portfolio + scènes lancées sur la version en ligne (espace de Maël)
    title: 'Trench Hero', category: 'Dév web', context: "SAÉ · jeu pour borne d'arcade", year: '2025', mmi: 2,
    images: [`${TRENCH}/titre.webp`, `${TRENCH}/niveau1-vague.webp`, `${TRENCH}/niveau3-2.webp`],
    details: {
      pitch:
        "Un jeu d'action en pixel art pensé pour une borne d'arcade : on incarne le caporal Alvin York, héros américain de 1918, à travers trois niveaux jusqu'au face-à-face avec le major allemand. Réalisé en trio.",
      role: 'Développeur',
      duration: 'Semestre 3',
      context: 'SAÉ 3.01, BUT MMI 2, en trio',
      tools: ['Phaser', 'JavaScript', 'Tiled', 'Pixabay'],
      links: [{ label: 'Jouer', href: 'https://web-mmi2.iutbeziers.fr/~mael.thing-leoh/Jeu_SAE301/' }],
      problemTitle: 'Le projet',
      problem:
        "La SAÉ demandait de créer un jeu web avec Phaser, puis de l'adapter à une borne d'arcade : un joystick et quelques boutons, sans souris ni clavier. Tout le jeu se joue donc au joystick : on se déplace, et on s'arrête pour tirer.",
      problemImages: [`${TRENCH}/histoire-1.webp`],
      sectionsTitle: 'Le jeu',
      sections: [
        {
          title: 'Trois cartes, une histoire',
          text: "Le jeu suit la vraie campagne d'Alvin York en 1918 : les tranchées, la forêt d'Argonne, puis les ruines de Châtel-Chéhéry. Chaque étape a sa carte, construite en tuiles avec Tiled, et des écrans de transition racontent la suite à la première personne.",
          images: [`${TRENCH}/niveau1-vague.webp`, `${TRENCH}/niveau2-action.webp`, `${TRENCH}/histoire-2.webp`, `${TRENCH}/histoire-3.webp`],
        },
        {
          title: 'Des vagues et des bonus',
          text: "Les deux premiers niveaux enchaînent cinq vagues d'ennemis. Entre deux vagues, on choisit un bonus parmi trois (cadence de tir, dégâts…), ce qui change un peu la partie à chaque fois.",
          images: [`${TRENCH}/bonus.webp`, `${TRENCH}/niveau1-2.webp`],
        },
        {
          title: 'Le major allemand',
          text: "Le dernier niveau est un combat de boss : le major arrive dans son char, dernier obstacle avant l'écran de victoire et la fin de l'histoire.",
          images: [`${TRENCH}/niveau3-2.webp`, `${TRENCH}/victoire.webp`],
        },
        {
          title: 'Un mode 1 contre 1',
          text: "Pour profiter des deux postes de la borne, un mode duel oppose deux joueurs sur la même carte, chacun dans son camp.",
          images: [`${TRENCH}/1vs1-1.webp`],
        },
        {
          title: 'Les outils',
          text: "Phaser pour le moteur du jeu (scènes, physique arcade, animations), Tiled pour dessiner les cartes en tuiles, exportées en JSON et chargées par Phaser, et Pixabay pour les musiques et les bruitages libres de droits.",
        },
      ],
      steps: [
        { title: 'Concevoir', text: "L'histoire d'Alvin York découpée en trois étapes, et un gameplay simple : bouger, s'arrêter, tirer." },
        { title: 'Dessiner les cartes', text: 'Trois cartes en tuiles avec Tiled : tranchées, forêt et village en ruines.' },
        { title: 'Développer', text: 'Les scènes Phaser : menu, niveaux, vagues, bonus, boss, histoire et mode duel.' },
        { title: 'Adapter à la borne', text: 'Des commandes réduites au joystick et aux boutons, pour jouer à un ou à deux.' },
      ],
      learning:
        "Adapter un jeu à une borne d'arcade oblige à tout simplifier : avec un joystick et deux boutons, chaque action doit se comprendre sans explication. Et à trois, bien se répartir le travail compte autant que le code.",
      photos: ['niveau1-1', 'game-over', 'niveau3-1', '1vs1-2'].map((name) => `${TRENCH}/${name}.webp`),
    },
  },
  {
    // SAÉ 2.03 en binôme avec Maël : pages publiques capturées sur sa version en ligne,
    // pages connectées et admin sur une copie locale avec des comptes test
    title: 'Planet Brick', category: 'Dév web', context: 'SAÉ · PHP, MySQL', year: '2025', mmi: 1,
    images: [`${BRICK}/accueil.webp`, `${BRICK}/catalogue.webp`, `${BRICK}/set-bugatti.webp`],
    details: {
      pitch:
        "Planet Brick, un site pour les fans de LEGO : on y parcourt près de 15 000 sets, on gère sa collection et sa wishlist, on note et on commente. Mon premier vrai projet avec une base de données, réalisé en binôme en première année.",
      role: 'Développeur web',
      duration: 'Semestre 2',
      context: 'SAÉ 2.03, BUT MMI 1, en binôme',
      tools: ['PHP', 'MySQL', 'PDO', 'Bootstrap'],
      links: [{ label: 'Voir le site', href: 'https://web-mmi2.iutbeziers.fr/~mael.thing-leoh/sae_lego/' }],
      problemTitle: 'Le projet',
      problem:
        "La SAÉ demandait un site dynamique en PHP, relié à une base de données. Point de départ : un fichier CSV de près de 15 000 sets LEGO, avec pour chacun son numéro, son nom, son année, son nombre de pièces, son image et son thème. À partir de là, on a conçu la base et construit tout ce qu'un fan attend : un compte, sa collection, ses envies et son avis. Les pages connectées sont montrées avec des comptes test.",
      problemImages: [`${BRICK}/accueil-stats.webp`],
      sectionsTitle: 'Le site',
      sections: [
        {
          title: 'Le catalogue',
          text: "Les sets s'affichent par pages de 50, qu'on peut filtrer par thème et trier par nom, numéro ou année. Chaque fiche donne le nombre de pièces, l'année de sortie, la note moyenne et la liste des membres qui possèdent le set.",
          images: [`${BRICK}/catalogue.webp`, `${BRICK}/set-bugatti.webp`],
        },
        {
          title: 'Collection, wishlist et avis',
          text: "Une fois inscrit, on ajoute un set à sa collection ou à sa wishlist en un clic, on lui donne une note sur 5 et on laisse un commentaire, modifiable ensuite. L'accueil met en avant les sets les mieux notés par la communauté, et chaque membre a sa page de profil.",
          images: [`${BRICK}/set-avis.webp`, `${BRICK}/profil.webp`, `${BRICK}/accueil-mieux-notes.webp`],
        },
        {
          title: 'Le back-office',
          text: "Un compte administrateur ouvre un tableau de bord pour ajouter, modifier ou supprimer des sets, promouvoir ou supprimer des membres, et modérer les commentaires.",
          images: [`${BRICK}/admin-utilisateurs.webp`, `${BRICK}/admin-commentaires.webp`],
        },
        {
          title: 'La sécurité, dès le départ',
          text: "Les mots de passe sont hachés, toutes les requêtes passent par des requêtes préparées (PDO) pour bloquer les injections SQL, et chaque texte saisi est échappé à l'affichage contre les failles XSS. Les pages d'administration vérifient le rôle du compte à chaque chargement.",
        },
      ],
      steps: [
        { title: 'Modéliser', text: 'Cinq tables reliées : membres, sets, collection, wishlist, et notes avec commentaires.' },
        { title: 'Importer', text: 'Les 15 000 sets du fichier CSV chargés dans la base.' },
        { title: 'Développer', text: 'Une page PHP par fonction : catalogue, fiche, compte, collection, back-office.' },
        { title: 'Sécuriser', text: 'Mots de passe hachés, requêtes préparées, échappement des textes et contrôle des rôles.' },
      ],
      learning:
        "C'est ici que j'ai découvert le duo PHP et base de données : penser les tables avant les pages, et ne jamais faire confiance à ce que l'utilisateur envoie.",
      photos: ['catalogue-technic', 'set-falcon', 'connexion', 'inscription', 'admin', 'admin-sets'].map((name) => `${BRICK}/${name}.webp`),
    },
  },
];

// Rangés par année de BUT MMI, de la plus récente à la plus ancienne (l'ordre d'écriture est gardé dans chaque année)
export const PROJECTS: Project[] = PROJECTS_INPUT.map((p) => ({ ...p, slug: slugify(p.title) })).sort((a, b) => b.mmi - a.mmi);

// « 2026 · MMI 3 »
export const yearLabel = (p: Pick<Project, 'year' | 'mmi'>) => `${p.year} · MMI ${p.mmi}`;

export const HOME_PROJECTS = PROJECTS.filter((p) => p.home).sort((a, b) => a.home! - b.home!);

// Contenu par défaut tant que le vrai texte d'un projet n'est pas écrit
const DEFAULT_STEPS: Record<Category, { title: string; text: string }[]> = {
  'UI/UX': [
    { title: 'Recherche', text: 'Comprendre les utilisateurs et leurs besoins.' },
    { title: 'Wireframes', text: 'Poser la structure et le parcours.' },
    { title: 'Design UI', text: 'Couleurs, typographies et composants.' },
    { title: 'Prototype & tests', text: 'Tester, mesurer et ajuster.' },
  ],
  'Dév web': [
    { title: 'Maquette', text: 'Valider le design et les animations.' },
    { title: 'Intégration', text: 'Code responsive, au pixel près.' },
    { title: 'Animations', text: 'Interactions et transitions fluides.' },
    { title: 'Mise en ligne', text: 'Optimisation et déploiement.' },
  ],
  '3D & Unity': [
    { title: 'Concept', text: 'Idée, références et intentions.' },
    { title: 'Modélisation', text: 'Assets 3D et textures.' },
    { title: 'Intégration Unity', text: 'Scène, lumière et logique en C#.' },
    { title: 'Tests', text: 'Jouabilité et optimisation.' },
  ],
  Graphisme: [
    { title: 'Brief', text: 'Comprendre le support, le format et le message.' },
    { title: 'Recherches', text: 'Plusieurs pistes graphiques à comparer.' },
    { title: 'Retours', text: 'Ajuster avec le client, défendre ses choix.' },
    { title: 'Fichier final', text: "Préparer le fichier pour l'impression." },
  ],
  Motion: [
    { title: 'Storyboard', text: "Découpage et rythme de l'animation." },
    { title: 'Design', text: 'Styles, couleurs et éléments graphiques.' },
    { title: 'Animation', text: 'Mouvements, timing et transitions.' },
    { title: 'Export', text: 'Formats adaptés au web et aux réseaux.' },
  ],
};

export function getProjectDetails(p: Project): ProjectDetails {
  return (
    p.details ?? {
      pitch: `${p.title} : description du projet à venir.`,
      role: p.category,
      duration: 'À préciser',
      context: p.context,
      // CATEGORIES et SKILLS sont dans le même ordre
      tools: SKILLS[CATEGORIES.indexOf(p.category)]?.tools.slice(0, 3) ?? [],
      problem: 'Le contexte et la problématique de ce projet arrivent bientôt.',
      steps: DEFAULT_STEPS[p.category],
      gallery: [p.images[1], p.images[2], p.images[0]],
    }
  );
}


// 20 aperçus (le 21e du prompt n'existe plus en ligne)
export const MARQUEE_IMAGES = Array.from({ length: 20 }, (_, i) => preview(i + 1));
