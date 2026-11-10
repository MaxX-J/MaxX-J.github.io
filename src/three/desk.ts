// @ts-nocheck — script repris tel quel de la v2 (JS sans types)
/* =========================================================
   La chambre-bureau en 3D (Three.js, sans addon)
   Un diorama « pièce découpée » : sol, deux murs, fenêtre et
   soleil, bureau, écran, chaise, étagère, affiches de projets,
   plante, lampe, horloge à l'heure réelle, tasse qui fume,
   poussière dans la lumière.
   Au scroll, la caméra plonge dans l'écran puis tout passe au
   noir pour enchaîner avec la section sombre.
   Recoloré dans la DA orange (page 404).
   ========================================================= */

import * as THREE from 'three';

THREE.ColorManagement.enabled = true;

type DeskElements = {
  section: HTMLElement;
  canvas: HTMLCanvasElement;
  fade: HTMLElement | null;
  hint: HTMLElement | null;
  pills: HTMLElement | null;
};

// Lance la scène ; renvoie une fonction qui arrête tout (démontage React), ou null sans WebGL
export function initDesk({ section, canvas, fade, hint, pills }: DeskElements): (() => void) | null {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var disposed = false, rafId = 0;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    return null;
  }

  var isSmall = window.innerWidth < 860;
  // résolution plafonnée : sur écran retina, 2x coûte 4 fois plus de pixels pour un gain à peine visible
  var maxDpr = Math.min(window.devicePixelRatio || 1, 1.5), dpr = maxDpr;
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // les ombres ne bougent pas : on les calcule une seule fois au lieu de 60 fois par seconde
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.05, 80);

  /* ---------- Reflets : un petit « studio » maison transformé en environnement ---------- */
  (function buildEnvironment() {
    var envScene = new THREE.Scene();
    var box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 0x8A4A2E, side: THREE.BackSide }));
    envScene.add(box);
    [[0, 4.8, 0, 6, 0.2, 6, 0xB8A595], [-4.8, 1, 0, 0.2, 4, 4, 0xFFB57A], [4.8, 1.5, 2, 0.2, 2, 3, 0xFFD3A8]].forEach(function (p) {
      var panel = new THREE.Mesh(new THREE.BoxGeometry(p[3], p[4], p[5]), new THREE.MeshBasicMaterial({ color: p[6] }));
      panel.position.set(p[0], p[1], p[2]);
      envScene.add(panel);
    });
    var pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    pmrem.dispose();
  })();

  scene.add(new THREE.HemisphereLight(0xFFE3C8, 0x9E4A2A, 0.35));

  // le soleil qui entre par la fenêtre (mur de gauche)
  var sun = new THREE.DirectionalLight(0xFFA65C, 4.6);
  sun.position.set(-7, 3.4, 1.0);
  sun.target.position.set(0.3, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(isSmall ? 1024 : 2048, isSmall ? 1024 : 2048);
  sun.shadow.camera.left = -5; sun.shadow.camera.right = 5;
  sun.shadow.camera.top = 5; sun.shadow.camera.bottom = -5;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 20;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun); scene.add(sun.target);

  // une lumière d'appoint rosée côté caméra
  var fill = new THREE.DirectionalLight(0xFFC4A8, 0.6);
  fill.position.set(6, 4, 6);
  scene.add(fill);

  /* ---------- Matériaux (palette du site) ---------- */
  function mat(color, rough, extra) {
    var o = { color: color, roughness: rough == null ? 0.7 : rough, metalness: 0 };
    for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }
  var M = {
    floor: mat(0xD9BD97, 0.55),
    plank: mat(0xBF9F76, 0.6),
    wall: mat(0xF0AE8C, 0.95),
    wall2: mat(0xF3E3D0, 0.95),
    skirting: mat(0xFFFFFF, 0.6),
    rug: mat(0xF16524, 0.95),
    rugLine: mat(0xFFF4EA, 0.95),
    desk: mat(0xF6F2EC, 0.4),
    deskLeg: mat(0x1F1F1F, 0.35, { metalness: 0.5 }),
    dark: mat(0x1C1C1E, 0.35, { metalness: 0.2 }),
    keys: mat(0xF4F1EC, 0.5),
    white: mat(0xFAF8F5, 0.4),
    orange: mat(0xFF7A45, 0.35),
    pot: mat(0xD27A55, 0.8),
    leaf: mat(0x3F8F5D, 0.6),
    leaf2: mat(0x5BAA70, 0.6),
    lampShade: mat(0xFFD34E, 0.35),
    wood: mat(0xB98A5C, 0.6),
    frame: mat(0x1F1F1F, 0.5),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xDDE7FF, roughness: 0.05, transparent: true, opacity: 0.18, clearcoat: 1, depthWrite: false }),
    sky: new THREE.MeshBasicMaterial({ color: 0xFFC08A, toneMapped: false }),
    mug: new THREE.MeshPhysicalMaterial({ color: 0xFF7A45, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 })
  };

  /* ---------- Boîtes arrondies (ExtrudeGeometry + biseau) ---------- */
  function roundedBox(w, h, d, r, material) {
    r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    var shape = new THREE.Shape();
    var x = -w / 2 + r, y = -h / 2 + r, iw = w - 2 * r, ih = h - 2 * r, cr = Math.min(r * 0.5, iw / 2, ih / 2);
    shape.moveTo(x + cr, y);
    shape.lineTo(x + iw - cr, y); shape.quadraticCurveTo(x + iw, y, x + iw, y + cr);
    shape.lineTo(x + iw, y + ih - cr); shape.quadraticCurveTo(x + iw, y + ih, x + iw - cr, y + ih);
    shape.lineTo(x + cr, y + ih); shape.quadraticCurveTo(x, y + ih, x, y + ih - cr);
    shape.lineTo(x, y + cr); shape.quadraticCurveTo(x, y, x + cr, y);
    var geo = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(0.001, d - 2 * r), bevelEnabled: true, bevelThickness: r, bevelSize: r,
      bevelSegments: 4, curveSegments: 6
    });
    geo.center();
    geo.computeVertexNormals();
    var mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function place(mesh, x, y, z, parent) { mesh.position.set(x, y, z); (parent || room).add(mesh); return mesh; }

  function cyl(rt, rb, h, seg, material) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 24), material);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  }

  /* ---------- Textures dessinées en 2D (aucune image externe) ---------- */
  function canvasTexture(w, h, draw) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }

  function poster(bg, fg, title, sub, accent) {
    return canvasTexture(512, 680, function (g, w, h) {
      g.fillStyle = bg; g.fillRect(0, 0, w, h);
      g.fillStyle = accent; g.beginPath(); g.arc(w * 0.7, h * 0.34, 150, 0, Math.PI * 2); g.fill();
      g.fillStyle = fg;
      g.font = "800 92px 'Kanit', Arial, sans-serif";
      var lines = title.split("\n");
      lines.forEach(function (line, i) { g.fillText(line, 36, h - 110 - (lines.length - 1 - i) * 86); });
      g.font = "24px monospace";
      g.fillText(sub, 38, h - 40);
    });
  }

  /* ---------- L'écran : du code qui s'écrit ---------- */
  var screenCanvas = document.createElement("canvas");
  screenCanvas.width = 1024; screenCanvas.height = 576;
  var sctx = screenCanvas.getContext("2d");
  var screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.encoding = THREE.sRGBEncoding;
  screenTex.anisotropy = 8;

  var CODE = [
    [["c", "// portfolio.js"]],
    [["k", "const "], ["v", "maxens"], ["p", " = {"]],
    [["p", "  role: "], ["s", "\"designer UI/UX & dev web\""], ["p", ","]],
    [["p", "  ville: "], ["s", "\"Béziers\""], ["p", ","]],
    [["p", "  outils: ["], ["s", "\"Figma\""], ["p", ", "], ["s", "\"React\""], ["p", ", "], ["s", "\"Node\""], ["p", ", "], ["s", "\"Unity\""], ["p", "],"]],
    [["p", "  cherche: "], ["s", "\"un stage de fin d'études\""], ["p", ","]],
    [["p", "};"]],
    [["p", ""]],
    [["v", "maxens"], ["p", "."], ["k", "bienvenue"], ["p", "();"]]
  ];
  var COLORS = { c: "#8A7468", k: "#FDAC55", v: "#FFFFFF", p: "#E8D9CE", s: "#FF8A4D" };
  var totalChars = CODE.reduce(function (n, line) {
    return n + line.reduce(function (m, seg) { return m + seg[1].length; }, 0) + 1;
  }, 0);

  function drawScreen(t) {
    var W = 1024, H = 576;
    sctx.fillStyle = "#1F140D"; sctx.fillRect(0, 0, W, H);
    sctx.fillStyle = "#2C1D14"; sctx.fillRect(0, 0, W, 44);
    ["#FF5F57", "#FEBC2E", "#28C840"].forEach(function (c, i) {
      sctx.fillStyle = c; sctx.beginPath(); sctx.arc(26 + i * 22, 22, 7, 0, Math.PI * 2); sctx.fill();
    });
    sctx.fillStyle = "#8A90A0"; sctx.font = "20px monospace";
    sctx.fillText("portfolio.js — maxens", 110, 29);
    var shown = reduced ? totalChars : Math.min(totalChars, Math.floor(t * 22));
    var y = 100, count = 0, cx = 48, cy = 100;
    sctx.font = "30px monospace";
    for (var i = 0; i < CODE.length; i++) {
      var x = 58;
      sctx.fillStyle = "#5A4234";
      sctx.fillText(String(i + 1), 14, y);
      cx = x; cy = y;
      for (var j = 0; j < CODE[i].length; j++) {
        var seg = CODE[i][j], txt = seg[1], left = shown - count;
        if (left <= 0) break;
        var part = txt.slice(0, left);
        sctx.fillStyle = COLORS[seg[0]];
        sctx.fillText(part, x, y);
        x += sctx.measureText(part).width;
        count += part.length;
        cx = x;
        if (part.length < txt.length) break;
      }
      if (shown - count <= 0) break;
      count += 1; y += 50;
    }
    if (Math.floor(t * 2) % 2 === 0) { sctx.fillStyle = "#FF8233"; sctx.fillRect(cx + 2, cy - 26, 14, 32); }
    screenTex.needsUpdate = true;
  }

  /* =========================================================
     La pièce : 6 x 6 au sol, murs de 3,4 m, coin au fond à gauche
     ========================================================= */
  var room = new THREE.Group();
  scene.add(room);

  var S = 6, WALL_H = 3.4, T = 0.18;

  // sol en lattes
  place(roundedBox(S, T, S, 0.04, M.floor), 0, -T / 2, 0);
  for (var p = 0; p < 8; p++) {
    var plank = new THREE.Mesh(new THREE.BoxGeometry(S - 0.1, 0.004, 0.012), M.plank);
    plank.position.set(0, 0.002, -S / 2 + (p + 1) * (S / 9));
    plank.receiveShadow = true;
    room.add(plank);
  }

  // mur du fond
  place(roundedBox(S, WALL_H, T, 0.03, M.wall), 0, WALL_H / 2 - T, -S / 2 + T / 2);

  // mur de gauche, découpé autour de la fenêtre
  var WIN = { z: 0.35, y: 1.85, w: 1.8, h: 1.35 };
  var lwX = -S / 2 + T / 2;
  var lowH = WIN.y - WIN.h / 2 + T;
  place(roundedBox(T, lowH, S, 0.005, M.wall2), lwX, lowH / 2 - T, 0);
  var topH = WALL_H - T - (WIN.y + WIN.h / 2);
  place(roundedBox(T, topH, S, 0.005, M.wall2), lwX, WIN.y + WIN.h / 2 + topH / 2, 0);
  var sideA = (WIN.z - WIN.w / 2) + S / 2;
  place(roundedBox(T, WIN.h + 0.02, sideA, 0.005, M.wall2), lwX, WIN.y, -S / 2 + sideA / 2);
  var sideB = S / 2 - (WIN.z + WIN.w / 2);
  place(roundedBox(T, WIN.h + 0.02, sideB, 0.005, M.wall2), lwX, WIN.y, S / 2 - sideB / 2);

  // fenêtre : cadre blanc, croisillons, vitre, ciel
  var win = new THREE.Group();
  [[WIN.h / 2, 0.07, WIN.w + 0.07], [-WIN.h / 2, 0.07, WIN.w + 0.07], [0, 0.045, WIN.w]].forEach(function (b) {
    var bar = roundedBox(T + 0.04, b[1], b[2], 0.015, M.white); bar.position.set(0, b[0], 0); win.add(bar);
  });
  [-WIN.w / 2, 0, WIN.w / 2].forEach(function (z) {
    var bar = roundedBox(T + 0.04, WIN.h, 0.06, 0.015, M.white); bar.position.set(0, 0, z); win.add(bar);
  });
  var sill = roundedBox(0.34, 0.05, WIN.w + 0.3, 0.015, M.white); sill.position.set(0.1, -WIN.h / 2 - 0.05, 0); win.add(sill);
  var glass = new THREE.Mesh(new THREE.PlaneGeometry(WIN.w, WIN.h), M.glass);
  glass.rotation.y = Math.PI / 2;
  win.add(glass);
  var sky = new THREE.Mesh(new THREE.PlaneGeometry(WIN.w + 0.6, WIN.h + 0.6), M.sky);
  sky.rotation.y = Math.PI / 2; sky.position.x = -0.4;
  win.add(sky);
  win.position.set(lwX, WIN.y, WIN.z);
  room.add(win);

  // petit pot sur le rebord
  var sillPot = cyl(0.07, 0.055, 0.11, 16, M.white); place(sillPot, lwX + 0.18, WIN.y - WIN.h / 2 - 0.02 + 0.055, WIN.z + 0.55);
  var succ = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 1), M.leaf2); succ.castShadow = true;
  place(succ, lwX + 0.18, WIN.y - WIN.h / 2 + 0.11, WIN.z + 0.55);

  // plinthes
  place(roundedBox(S - T, 0.1, 0.03, 0.01, M.skirting), T / 2, 0.05, -S / 2 + T + 0.015);
  place(roundedBox(0.03, 0.1, S - T, 0.01, M.skirting), -S / 2 + T + 0.015, 0.05, T / 2);

  // tapis rond
  var rug = cyl(1.4, 1.4, 0.025, 64, M.rug); rug.position.set(0.4, 0.013, 0.4); room.add(rug);
  var rugRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.018, 6, 72), M.rugLine);
  rugRing.rotation.x = -Math.PI / 2; rugRing.position.set(0.4, 0.027, 0.4); room.add(rugRing);

  /* ---------- Bureau ---------- */
  var desk = new THREE.Group();
  room.add(desk);
  var DESK = { x: 0.35, z: -2.2, y: 0.78, w: 2.6, d: 1.0 };
  place(roundedBox(DESK.w, 0.06, DESK.d, 0.025, M.desk), DESK.x, DESK.y, DESK.z, desk);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) {
    var leg = roundedBox(0.05, DESK.y - 0.03, 0.05, 0.02, M.deskLeg);
    leg.position.set(DESK.x + s[0] * (DESK.w / 2 - 0.1), (DESK.y - 0.03) / 2, DESK.z + s[1] * (DESK.d / 2 - 0.1));
    desk.add(leg);
  });

  // écran
  var SCREEN = { x: DESK.x, y: 1.36, z: DESK.z - 0.16, w: 1.12, h: 0.63 };
  place(roundedBox(0.34, 0.025, 0.22, 0.012, M.dark), SCREEN.x, DESK.y + 0.045, SCREEN.z + 0.02, desk);
  place(roundedBox(0.06, 0.4, 0.04, 0.02, M.dark), SCREEN.x, DESK.y + 0.24, SCREEN.z - 0.05, desk);
  place(roundedBox(SCREEN.w + 0.07, SCREEN.h + 0.07, 0.045, 0.02, M.dark), SCREEN.x, SCREEN.y, SCREEN.z - 0.026, desk);
  var screen = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN.w, SCREEN.h), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  screen.position.set(SCREEN.x, SCREEN.y, SCREEN.z + 0.0001);
  desk.add(screen);
  var screenGlow = new THREE.PointLight(0xFFB07A, 1.6, 2.2, 2);
  screenGlow.position.set(SCREEN.x, SCREEN.y - 0.1, SCREEN.z + 0.35);
  desk.add(screenGlow);

  // clavier + touches (une seule géométrie instanciée)
  place(roundedBox(0.82, 0.03, 0.27, 0.012, M.white), DESK.x, DESK.y + 0.045, DESK.z + 0.2, desk);
  var keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.046, 0.016, 0.046), M.keys, 14 * 4);
  var dummy = new THREE.Object3D(), n = 0;
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 14; c++) {
      dummy.position.set(DESK.x - 0.364 + c * 0.056, DESK.y + 0.066, DESK.z + 0.116 + r * 0.056);
      dummy.updateMatrix(); keys.setMatrixAt(n++, dummy.matrix);
    }
  }
  keys.castShadow = true;
  desk.add(keys);

  // tapis de souris + souris
  place(roundedBox(0.3, 0.006, 0.25, 0.003, M.dark), DESK.x + 0.62, DESK.y + 0.034, DESK.z + 0.2, desk);
  var mouse = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 12), M.white);
  mouse.scale.set(0.8, 0.5, 1.3); mouse.castShadow = true;
  place(mouse, DESK.x + 0.62, DESK.y + 0.055, DESK.z + 0.2, desk);

  // tasse qui fume
  var MUG = { x: DESK.x - 0.78, z: DESK.z + 0.2 };
  place(cyl(0.065, 0.06, 0.14, 32, M.mug), MUG.x, DESK.y + 0.1, MUG.z, desk);
  var handle = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.012, 10, 20), M.mug);
  handle.castShadow = true;
  place(handle, MUG.x + 0.07, DESK.y + 0.1, MUG.z, desk);
  var coffee = new THREE.Mesh(new THREE.CircleGeometry(0.058, 24), mat(0x3B2416, 0.2));
  coffee.rotation.x = -Math.PI / 2;
  place(coffee, MUG.x, DESK.y + 0.16, MUG.z, desk);
  var steam = [];
  for (var s2 = 0; s2 < 7; s2++) {
    var puff = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0, depthWrite: false }));
    puff.userData.offset = s2 / 7;
    desk.add(puff);
    steam.push(puff);
  }

  // lampe d'architecte
  var lamp = new THREE.Group();
  var lbase = cyl(0.11, 0.12, 0.025, 32, M.dark); lbase.position.y = 0.0125; lamp.add(lbase);
  var arm1 = roundedBox(0.03, 0.55, 0.03, 0.012, M.dark); arm1.position.set(0.05, 0.27, 0); arm1.rotation.z = -0.2; lamp.add(arm1);
  var arm2 = roundedBox(0.03, 0.42, 0.03, 0.012, M.dark); arm2.position.set(-0.05, 0.62, 0); arm2.rotation.z = 1.0; lamp.add(arm2);
  var shade = cyl(0.04, 0.12, 0.16, 32, M.lampShade); shade.position.set(-0.25, 0.62, 0); shade.rotation.z = 0.5; lamp.add(shade);
  var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: 0xFFF3C4, toneMapped: false }));
  bulb.position.set(-0.29, 0.56, 0); lamp.add(bulb);
  var bulbLight = new THREE.PointLight(0xFFC266, 3.0, 2.8, 2);
  bulbLight.position.set(-0.32, 0.5, 0);
  lamp.add(bulbLight);
  lamp.position.set(DESK.x + 1.05, DESK.y + 0.03, DESK.z - 0.22);
  lamp.rotation.y = 0.4;
  desk.add(lamp);

  // pile de livres
  [[M.dark, 0.06, 0], [M.white, 0.05, 0.12], [M.orange, 0.055, -0.08]].forEach(function (b, i) {
    var book = roundedBox(0.34, b[1], 0.25, 0.01, b[0]);
    book.position.set(DESK.x + 1.0, DESK.y + 0.06 + i * 0.056, DESK.z + 0.25);
    book.rotation.y = b[2];
    desk.add(book);
  });

  // casque VR
  var vr = new THREE.Group();
  vr.add(roundedBox(0.26, 0.14, 0.15, 0.05, M.white));
  var visor = roundedBox(0.23, 0.1, 0.02, 0.009, M.dark); visor.position.z = 0.075; vr.add(visor);
  var strap = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.012, 8, 24, Math.PI), M.dark);
  strap.rotation.x = -Math.PI / 2; strap.position.z = -0.06; vr.add(strap);
  vr.position.set(DESK.x - 0.6, DESK.y + 0.105, DESK.z - 0.22);
  vr.rotation.y = 0.5;
  desk.add(vr);

  // carnet de croquis ouvert + crayon, à côté du clavier (le côté créa)
  var sketch = new THREE.Group();
  var cover = roundedBox(0.36, 0.012, 0.25, 0.005, M.orange); sketch.add(cover);
  var pageL = new THREE.Mesh(new THREE.BoxGeometry(0.165, 0.004, 0.23), M.white); pageL.position.set(-0.088, 0.008, 0); pageL.rotation.z = 0.03; sketch.add(pageL);
  var pageR = new THREE.Mesh(new THREE.BoxGeometry(0.165, 0.004, 0.23), M.white); pageR.position.set(0.088, 0.008, 0); pageR.rotation.z = -0.03; sketch.add(pageR);
  // un wireframe griffonné sur la page de droite
  [[0.088, -0.07, 0.12, 0.03], [0.06, 0.0, 0.065, 0.07], [0.12, 0.0, 0.04, 0.07], [0.088, 0.075, 0.12, 0.02]].forEach(function (r) {
    var mark = new THREE.Mesh(new THREE.BoxGeometry(r[2], 0.001, r[3]), mat(0xFDAC55, 0.8));
    mark.position.set(r[0], 0.0115, r[1]);
    sketch.add(mark);
  });
  var pencil = cyl(0.006, 0.006, 0.17, 8, mat(0xFFC93C, 0.5)); pencil.rotation.z = Math.PI / 2; pencil.rotation.y = 0.6; pencil.position.set(-0.07, 0.018, 0.04); sketch.add(pencil);
  sketch.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  sketch.position.set(DESK.x - 0.6, DESK.y + 0.04, DESK.z + 0.22);
  sketch.rotation.y = 0.35;
  desk.add(sketch);

  /* ---------- Chaise de bureau ---------- */
  var chair = new THREE.Group();
  var seat = roundedBox(0.55, 0.08, 0.52, 0.04, M.dark); seat.position.y = 0.5; chair.add(seat);
  var back = roundedBox(0.52, 0.6, 0.07, 0.035, M.dark); back.position.set(0, 0.9, 0.27); back.rotation.x = -0.1; chair.add(back);
  var stem = cyl(0.025, 0.025, 0.4, 12, M.deskLeg); stem.position.y = 0.27; chair.add(stem);
  for (var a = 0; a < 5; a++) {
    var ang = a / 5 * Math.PI * 2;
    var leg = roundedBox(0.3, 0.035, 0.05, 0.015, M.deskLeg);
    leg.position.set(Math.cos(ang) * 0.15, 0.07, Math.sin(ang) * 0.15);
    leg.rotation.y = -ang;
    chair.add(leg);
    var wheel = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), M.dark);
    wheel.position.set(Math.cos(ang) * 0.29, 0.03, Math.sin(ang) * 0.29);
    wheel.castShadow = true;
    chair.add(wheel);
  }
  chair.position.set(DESK.x + 0.2, 0, DESK.z + 1.0);
  chair.rotation.y = 0.35;
  room.add(chair);

  /* ---------- Étagère ---------- */
  var shelfY = 2.2, shelfZ = -S / 2 + T + 0.15;
  place(roundedBox(1.5, 0.05, 0.3, 0.015, M.wood), -1.65, shelfY, shelfZ);
  [0x1F1F1F, 0xFDAC55, 0xFF7A45, 0xF6F2EC, 0x3F8F5D, 0x1F1F1F, 0xFFC93C].forEach(function (col, i) {
    var h = 0.22 + (i % 3) * 0.04;
    var b = roundedBox(0.06, h, 0.2, 0.01, mat(col, 0.6));
    b.position.set(-2.25 + i * 0.075, shelfY + 0.025 + h / 2, shelfZ);
    if (i === 6) { b.rotation.z = -0.35; b.position.x += 0.05; b.position.y -= 0.01; }
    room.add(b);
  });
  var cube = roundedBox(0.16, 0.16, 0.16, 0.03, M.orange); cube.position.set(-1.12, shelfY + 0.105, shelfZ); cube.rotation.y = 0.5; room.add(cube);
  place(cyl(0.07, 0.06, 0.12, 20, M.pot), -1.45, shelfY + 0.085, shelfZ);
  var cactus = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.1, 4, 12), M.leaf2); cactus.castShadow = true;
  place(cactus, -1.45, shelfY + 0.23, shelfZ);

  /* ---------- Affiches de projets ---------- */
  [
    { tex: poster("#F16524", "#FFFFFF", "ARCHI\nTRUC", "site vitrine · stage", "#FF8A4D"), x: 1.55, y: 2.0, w: 0.62 },
    { tex: poster("#1F140D", "#FFFFFF", "BLOONS\nVR", "jeu VR · unity", "#FF8233"), x: 2.3, y: 1.8, w: 0.5 },
    { tex: poster("#FDAC55", "#1F140D", "UI\nUX", "maquettes · figma", "#FFE0B8"), x: 2.25, y: 2.62, w: 0.42 }
  ].forEach(function (p) {
    var h = p.w * 680 / 512;
    place(roundedBox(p.w + 0.05, h + 0.05, 0.03, 0.012, M.frame), p.x, p.y, -S / 2 + T + 0.015);
    var art = new THREE.Mesh(new THREE.PlaneGeometry(p.w, h), new THREE.MeshStandardMaterial({ map: p.tex, roughness: 0.55 }));
    art.receiveShadow = true;
    place(art, p.x, p.y, -S / 2 + T + 0.032);
  });

  /* ---------- Horloge à l'heure réelle ---------- */
  var clockG = new THREE.Group();
  var face = cyl(0.24, 0.24, 0.04, 48, M.white); face.rotation.x = Math.PI / 2; clockG.add(face);
  clockG.add(new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.02, 10, 48), M.dark));
  for (var hh = 0; hh < 12; hh++) {
    var tick = new THREE.Mesh(new THREE.BoxGeometry(0.012, hh % 3 === 0 ? 0.05 : 0.03, 0.01), M.dark);
    var aa = hh / 12 * Math.PI * 2;
    tick.position.set(Math.sin(aa) * 0.19, Math.cos(aa) * 0.19, 0.025);
    tick.rotation.z = -aa;
    clockG.add(tick);
  }
  function hand(len, wid, material, z) {
    var g = new THREE.Group();
    var m = new THREE.Mesh(new THREE.BoxGeometry(wid, len, 0.006), material);
    m.position.y = len / 2 - 0.02; g.add(m);
    g.position.z = z;
    clockG.add(g);
    return g;
  }
  var hands = { h: hand(0.11, 0.02, M.dark, 0.026), m: hand(0.16, 0.014, M.dark, 0.032), s: hand(0.18, 0.006, M.orange, 0.038) };
  clockG.position.set(-0.6, 2.62, -S / 2 + T + 0.03);
  room.add(clockG);

  /* ---------- Grande plante ---------- */
  var plant = new THREE.Group();
  var bigPot = cyl(0.22, 0.17, 0.42, 32, M.pot); bigPot.position.y = 0.21; plant.add(bigPot);
  var leaves = [];
  for (var l = 0; l < 10; l++) {
    var leaf = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 10), l % 2 ? M.leaf : M.leaf2);
    var la = l / 10 * Math.PI * 2;
    leaf.scale.set(0.45, 1.25 + (l % 3) * 0.15, 0.18);
    leaf.position.y = 0.22;
    leaf.castShadow = true;
    var pivot = new THREE.Group();
    pivot.position.y = 0.42;
    pivot.rotation.z = Math.cos(la) * 0.55;
    pivot.rotation.x = Math.sin(la) * 0.55;
    pivot.add(leaf);
    pivot.userData.base = { x: pivot.rotation.x, z: pivot.rotation.z, phase: l };
    plant.add(pivot);
    leaves.push(pivot);
  }
  plant.position.set(-2.4, 0, -2.35);
  room.add(plant);

  /* ---------- Poussière dans le rayon de soleil ---------- */
  var dustCount = isSmall ? 60 : 160;
  var dustGeo = new THREE.BufferGeometry();
  var dustPos = new Float32Array(dustCount * 3);
  for (var d = 0; d < dustCount; d++) {
    dustPos[d * 3] = -2.7 + Math.random() * 3.2;
    dustPos[d * 3 + 1] = 0.3 + Math.random() * 2.6;
    dustPos[d * 3 + 2] = -0.8 + Math.random() * 2.4;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xFFF1D6, size: 0.02, transparent: true, opacity: 0.75, depthWrite: false }));
  room.add(dust);

  // lumière du soleil qui rebondit sur le sol : réchauffe toute la pièce
  var bounce = new THREE.PointLight(0xFF9A55, 1.6, 5, 2);
  bounce.position.set(-0.6, 0.35, 0.6);
  room.add(bounce);

  /* ---------- Guirlande lumineuse sur le mur du fond ---------- */
  var garland = new THREE.Group();
  var bulbs = [];
  var gPts = [];
  var G_N = isSmall ? 12 : 18, gX0 = -2.75, gX1 = 2.7, gY = 3.0, gZ = -S / 2 + T + 0.05;
  for (var gi = 0; gi <= 60; gi++) {
    var gu = gi / 60;
    gPts.push(new THREE.Vector3(gX0 + (gX1 - gX0) * gu, gY - Math.sin(gu * Math.PI * 3) * 0.08 - Math.sin(gu * Math.PI) * 0.12, gZ));
  }
  var gCurve = new THREE.CatmullRomCurve3(gPts);
  garland.add(new THREE.Mesh(new THREE.TubeGeometry(gCurve, 120, 0.006, 6, false), M.dark));
  var bulbGeo = new THREE.SphereGeometry(0.028, 12, 8);
  for (var bi = 0; bi < G_N; bi++) {
    var bp = gCurve.getPoint((bi + 0.5) / G_N);
    var bm = new THREE.Mesh(bulbGeo, new THREE.MeshBasicMaterial({ color: 0xFFD27A, toneMapped: false }));
    bm.position.copy(bp); bm.position.y -= 0.03;
    bm.userData.phase = bi * 1.7;
    garland.add(bm);
    bulbs.push(bm);
  }
  // une seule lumière pour toute la guirlande (chaque lumière ponctuelle coûte cher par pixel)
  var gLight = new THREE.PointLight(0xFFC070, 1.4, 4.5, 2);
  gLight.position.set(0.1, gY - 0.25, gZ + 0.4);
  garland.add(gLight);
  room.add(garland);

  /* =========================================================
     Caméra : vue du diorama → plongeon dans l'écran
     ========================================================= */
  scene.updateMatrixWorld(true);
  var screenWorld = new THREE.Vector3();
  screen.getWorldPosition(screenWorld);

  var START = { pos: new THREE.Vector3(7.4, 5.4, 8.6), look: new THREE.Vector3(-0.3, 1.0, -0.6) };
  var MID = { pos: new THREE.Vector3(screenWorld.x + 1.4, screenWorld.y + 0.7, screenWorld.z + 3.2), look: screenWorld.clone() };
  var END = { pos: new THREE.Vector3(screenWorld.x, screenWorld.y, screenWorld.z + 0.9), look: screenWorld.clone() };

  var pos = new THREE.Vector3(), look = new THREE.Vector3();
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  function onPointer(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener("pointermove", onPointer, { passive: true });

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  // courbe de Bézier : départ → passage → arrivée, sans à-coup
  function bezier(out, a, b, c, t) {
    var u = 1 - t;
    return out.set(0, 0, 0).addScaledVector(a, u * u).addScaledVector(b, 2 * u * t).addScaledVector(c, t * t);
  }

  function progress() {
    if (reduced) return 0;
    var rct = section.getBoundingClientRect();
    var range = rct.height - window.innerHeight;
    return range > 0 ? clamp(-rct.top / range, 0, 1) : 0;
  }

  function resize() {
    var w = section.clientWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // écran étroit : on recule pour voir toute la pièce
    var portrait = camera.aspect < 1;
    camera.fov = portrait ? 30 + 30 * (1 - camera.aspect) : 30;
    START.look.set(portrait ? 0.1 : -0.3, 1.0, portrait ? -1.2 : -0.6);
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  var visible = true;
  var observer = new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; });
  observer.observe(section);

  var clock = new THREE.Clock();
  var lastScreenKey = "";
  // si l'ordinateur peine, on baisse un peu la résolution (et on la remonte s'il respire)
  var slow = 0, fast = 0, lastT = performance.now();
  function adapt() {
    var now = performance.now(), dt = now - lastT; lastT = now;
    if (dt > 100) return; // retour d'onglet, pas représentatif
    if (dt > 24) { slow++; fast = 0; } else if (dt < 15) { fast++; slow = 0; }
    if (slow > 20 && dpr > 0.75) { dpr = Math.max(0.75, dpr - 0.25); renderer.setPixelRatio(dpr); resize(); slow = 0; }
    if (fast > 240 && dpr < maxDpr) { dpr = Math.min(maxDpr, dpr + 0.25); renderer.setPixelRatio(dpr); resize(); fast = 0; }
  }

  function frame() {
    if (disposed) return;
    rafId = requestAnimationFrame(frame);
    if (!visible || document.hidden) { lastT = performance.now(); return; }
    var t = clock.getElapsedTime();
    var p = progress();
    // écran déjà passé au noir : inutile de dessiner la 3D
    if (p >= 0.985) { if (fade) fade.style.opacity = "1"; return; }
    adapt();

    // 0 → 0,1 : vue d'ensemble ; 0,1 → 0,9 : plongeon ; 0,9 → 1 : fondu
    var k = ease(clamp((p - 0.08) / 0.82, 0, 1));
    bezier(pos, START.pos, MID.pos, END.pos, k);
    bezier(look, START.look, MID.look, END.look, k);

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    var sway = 1 - k;
    pos.x += pointer.x * 0.7 * sway;
    pos.y += -pointer.y * 0.4 * sway + Math.sin(t * 0.5) * 0.06 * sway;
    camera.position.copy(pos);
    camera.lookAt(look);

    // la vie de la pièce
    for (var li = 0; li < leaves.length; li++) {
      var b = leaves[li].userData.base;
      leaves[li].rotation.z = b.z + Math.sin(t * 1.1 + b.phase) * 0.04;
      leaves[li].rotation.x = b.x + Math.cos(t * 0.9 + b.phase) * 0.03;
    }
    for (var si = 0; si < steam.length; si++) {
      var puff = steam[si];
      var life = (t * 0.3 + puff.userData.offset) % 1;
      puff.position.set(MUG.x + Math.sin(life * 6 + si) * 0.025, DESK.y + 0.18 + life * 0.38, MUG.z);
      puff.scale.setScalar(0.6 + life * 1.8);
      puff.material.opacity = 0.3 * Math.sin(life * Math.PI);
    }
    var dp = dust.geometry.attributes.position;
    for (var i = 0; i < dustCount; i++) {
      var y = dp.getY(i) + 0.0012;
      dp.setY(i, y > 2.9 ? 0.3 : y);
      dp.setX(i, dp.getX(i) + Math.sin(t * 0.7 + i) * 0.0006);
    }
    dp.needsUpdate = true;
    for (var bj = 0; bj < bulbs.length; bj++) {
      var tw = 0.75 + 0.25 * Math.sin(t * 1.6 + bulbs[bj].userData.phase);
      bulbs[bj].material.color.setRGB(1, 0.82 * tw + 0.1, 0.48 * tw);
    }

    var now = new Date();
    var sec = now.getSeconds() + now.getMilliseconds() / 1000;
    var min = now.getMinutes() + sec / 60;
    var hr = (now.getHours() % 12) + min / 60;
    hands.s.rotation.z = -sec / 60 * Math.PI * 2;
    hands.m.rotation.z = -min / 60 * Math.PI * 2;
    hands.h.rotation.z = -hr / 12 * Math.PI * 2;

    // l'écran n'est redessiné que quand une lettre apparaît ou que le curseur clignote
    var screenKey = (reduced ? totalChars : Math.min(totalChars, Math.floor(t * 22))) + "-" + (Math.floor(t * 2) % 2);
    if (screenKey !== lastScreenKey) { drawScreen(t); lastScreenKey = screenKey; }

    var f = clamp((p - 0.9) / 0.08, 0, 1);
    if (fade) fade.style.opacity = f.toFixed(3);
    var ui = clamp(1 - p / 0.1, 0, 1);
    if (hint) hint.style.opacity = (ui * 0.85).toFixed(3);
    if (pills) pills.style.opacity = ui.toFixed(3);

    renderer.render(scene, camera);
  }

  drawScreen(0);
  frame();

  return function dispose() {
    disposed = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("resize", resize);
    observer.disconnect();
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) [].concat(o.material).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
    });
    if (scene.environment) scene.environment.dispose();
    renderer.dispose();
  };
}
