/* eslint-disable react/no-children-prop */
import rarity from '../assets/rarity.json';
import axios from 'axios';
import { GetStaticProps } from 'next';
import InfiniteScroll from 'react-infinite-scroll-component';
import IColorPalette from '../types/colorPalette';

import { Heading, Flex, Text, Box, Input, InputGroup, InputLeftElement, SimpleGrid, Select} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import PaletteCard from '../components/PaletteCard';
import { useState, useEffect } from 'react';
import PaletteFilter from '../services/filter';
import SmallPaletteCard from '../components/SmallPaletteCard';

interface IndexPageProps {
  palettes: IColorPalette[];
}

interface ColorPaletteDTO {
  [key: string]: [string, string, string, string, string]
}

export default function Home({ palettes }: IndexPageProps) {
  const [palettesOnMemory, setPalettesOnMemory] = useState(palettes);
  const [palettesOnScreen, setPalettesOnScreen] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('rarity');
  const [filter, _] = useState(new PaletteFilter(palettes))

  const [searchNumber, setSearchNumber] = useState('');


  useEffect(() => {
    const p = [];

    for (let i = 0; i < 40; i++) {
      p.push(palettes[i])
    }

    setPalettesOnScreen(p);
  }, [palettes])

  const fetchMore = () => {
    const p = palettesOnScreen
    const l = p.length

    for (let i = 0; i < 40; i++) {
      if (i + l < palettesOnMemory.length) {
        p.push(palettesOnMemory[i + l])
      }
    }

    if (p.length === palettesOnMemory.length) setHasMore(false)
    else if (palettesOnMemory.length > p.length) setHasMore(true)

    setPalettesOnScreen([...p])
  }

  useEffect(() => {
    const p = filter.getNPalettes(40, palettesOnMemory);

    if (p.length < 40) setHasMore(false)
    else if (palettesOnMemory.length > p.length) setHasMore(true)

    setPalettesOnScreen([...p])
  }, [palettesOnMemory])
  
  useEffect(() => {
    if (searchNumber === '') {
      const sorted = filter.sort(palettes)
      setPalettesOnMemory([...sorted])
    } else {
      const r = filter.filterByName(searchNumber);
      
      setPalettesOnMemory([...r])
    }
  }, [searchNumber])

  useEffect(() => {
    filter.changeSorting(sortBy)

    const sorted = filter.sort(palettesOnMemory)

    setPalettesOnMemory([...sorted])
  }, [sortBy])

  return (
    <Flex px={['20px', '20px', "50px"]} py="30px" flexDir="column">
      <Flex alignItems="center" w="100%" flexDir={['column', 'column', 'column', 'row']}>
        <Box minW={{sm: '0px', md: '500px'}}>  
          <Heading>OpenPalette explorer 🎨</Heading>
          <Text color="gray.400">Explore all awesome colors palettes from the OpenPalette project!</Text>
        </Box>

        <Flex w="100%" alignItems="center" mt={['20px', '20px', '20px', '0px']}>
          <InputGroup ml={['0px', '0px', '0px', "50px"]} maxW="700px">
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input maxW="700px" placeholder="Search a palette number or a hex color"
              value={searchNumber}
              onChange={e => setSearchNumber(e.target.value)}
            />
          </InputGroup>

          <Select
            w="120px"
            minW={['80px', '120px', '120px']}
            ml="10px"
            variant="filled"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="rarity">Rarity</option>
            <option value="name">Name</option>
          </Select>
        </Flex>
      </Flex>

      {!!searchNumber && (
        <Box mt="20px" ml="10px">
          <Text fontWeight="bold">{palettesOnMemory.length} Color palettes found. ({(palettesOnMemory.length / palettes.length * 100).toFixed(3)}%)</Text>
        </Box>
      )}
      
      <InfiniteScroll
        dataLength={palettesOnScreen.length} //This is important field to render the next data
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <SimpleGrid mt="10px" columns={[2, 2, 3, 4, 5, 7]} spacing={5}>
          {palettesOnScreen.map(palette => (
            <SmallPaletteCard key={palette.name} palette={palette} />
          ))}
        </SimpleGrid>
      </InfiniteScroll>
        
    </Flex>
  )
}

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  const response = await axios.get<ColorPaletteDTO>('https://gist.githubusercontent.com/WilliamIPark/a6bf9a63541d83b0c360c16101067f68/raw/1fe39c1d1052e6f00b22020e6fa73a61d63ad13e/open-palette-index.json');

  const palettesFormatted = Object.entries(response.data).map(([paletteName, colors], index) => ({ name: paletteName, colors, rarityScore: rarity[paletteName] ? 100 - rarity[paletteName] : '-1' }))

  const filter = new PaletteFilter(palettesFormatted)

  let palettesSortedByRarity = filter.sort(palettesFormatted)

  palettesSortedByRarity.forEach((_, idx) => palettesSortedByRarity[idx].rarityPosition = idx + 1)
  
  return {
    props: {
      palettes: palettesSortedByRarity,
    },
    revalidate: 5,
  };
};