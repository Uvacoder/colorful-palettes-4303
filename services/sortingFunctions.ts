import rarity from '../assets/rarity.json';
import IColorPalette from '../types/colorPalette';

function sortByRarity(palette1: IColorPalette, palette2: IColorPalette) {
  if (palette1.rarityScore > palette2.rarityScore) {
    return -1;
  }

  if (palette1.rarityScore < palette2.rarityScore) {
    return 1;
  }

  return 0;
}

function sortByName(palette1: IColorPalette, palette2: IColorPalette) {
  if (parseInt(palette1.name) < parseInt(palette2.name)) {
    return -1;
  }

  if (parseInt(palette1.name) > parseInt(palette2.name)) {
    return 1;
  }

  return 0;
}

const sorting = {
  rarity: sortByRarity,
  name: sortByName
}

export default sorting;