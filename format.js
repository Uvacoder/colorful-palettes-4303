const fs = require('fs')

function sortByRarity(palette1, palette2) {
  if (palette1.rarityScore > palette2.rarityScore) {
    return -1;
  }

  if (palette1.rarityScore < palette2.rarityScore) {
    return 1;
  }

  return 0;
}

async function main() {
  const f = await fs.readFileSync('assets/palettes.json')
  const r = await fs.readFileSync('assets/rarity.json')

  const rarity = JSON.parse(r)
  const palettes = JSON.parse(f)

  const palettesFormatted = Object.entries(palettes).map(([paletteName, colors], index) => ({ name: paletteName, colors, rarityScore: rarity[paletteName] ? 100 - rarity[paletteName] : '-1' }))

  let palettesSortedByRarity = palettesFormatted.sort(sortByRarity)

  palettesSortedByRarity.forEach((_, idx) => palettesSortedByRarity[idx].rarityPosition = idx + 1)

  console.log(palettesSortedByRarity[333])

  await fs.writeFileSync('assets/palettesFormatted.json', JSON.stringify(palettesSortedByRarity))
}

main()