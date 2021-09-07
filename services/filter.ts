import IColorPalette from "../types/colorPalette";
import sorting from "./sortingFunctions";

// type SortOptions = 'rarity' | 'name';

export default class PaletteFilter {
  private palettes: IColorPalette[];
  private sortBy: string;
  
  constructor(allPalettes) {
    this.palettes = allPalettes
    this.sortBy = 'rarity'
  }

  changeSorting(sortBy: string) {
    this.sortBy = sortBy
  }

  getNPalettes(n, customPalettes=undefined) {
    const p = [];
    let palettesToUse = this.palettes
    if (customPalettes) palettesToUse = customPalettes
    
    for (let i = 0; i < n; i++) {
      if (i < palettesToUse.length) {
        p.push(palettesToUse[i])
      }
    }
    
    return p;
  }

  filterByName(name) {
    const pFinded = this.palettes.filter(p => p.name.includes(name) || p.colors.includes(name.toLowerCase()))

    return this.sort(pFinded);
  }

  sort(customPalettes, n=undefined) {
    const sortingFunction = sorting[this.sortBy]

    const r = customPalettes.sort(sortingFunction);

    if (n) return this.getNPalettes(n, r)
  
    return r;
  }
}