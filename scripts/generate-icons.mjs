import sharp from "sharp";
import { mkdirSync } from "fs";
import { join } from "path";

const iconsDir = join(process.cwd(), "public", "icons");
mkdirSync(iconsDir, { recursive: true });

// SVG base del icono: fondo azul corporativo con una llave inglesa blanca
const svg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#1d4ed8"/>
  <g transform="translate(256,256)">
    <circle r="150" fill="none" stroke="#ffffff" stroke-width="28" opacity="0.25"/>
    <path d="M-70 -20 L-20 -70 L-20 -30 L30 -80 L80 -30 L30 20 L70 20 L20 70 L-30 20 L-30 70 L-70 20 Z"
      fill="#ffffff" transform="rotate(45)"/>
  </g>
</svg>`;

async function generate() {
  for (const size of [192, 512]) {
    const buffer = Buffer.from(svg(size));
    await sharp(buffer).png().toFile(join(iconsDir, `icon-${size}.png`));
    console.log(`Generado icon-${size}.png`);
  }
  console.log("Iconos PWA generados correctamente.");
}

generate().catch((err) => {
  console.error("Error generando iconos:", err);
  process.exit(1);
});
