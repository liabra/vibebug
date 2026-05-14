import sharp from 'sharp'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../public/icons')
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

// Lightning bolt on dark rounded background — violet #534AB7
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0F0F0F"/>
  <polygon
    points="292,52 148,268 242,268 214,460 364,236 268,236"
    fill="#534AB7"
  />
  <polygon
    points="292,52 148,268 242,268 214,460 364,236 268,236"
    fill="#534AB7" opacity="0.25" transform="translate(6,6)"
  />
</svg>`

const buf = Buffer.from(svg)

await Promise.all([
  sharp(buf).resize(192, 192).png().toFile(join(outDir, 'icon-192.png')),
  sharp(buf).resize(512, 512).png().toFile(join(outDir, 'icon-512.png')),
])

console.log('✓ icon-192.png')
console.log('✓ icon-512.png')
console.log('Icons generated in public/icons/')
