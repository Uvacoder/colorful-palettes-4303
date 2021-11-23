/* eslint-disable react/no-children-prop */
import palettes from '../assets/palettesFormatted.json';

import { GetStaticProps } from 'next';
import InfiniteScroll from 'react-infinite-scroll-component';
import IColorPalette from '../types/colorPalette';

import { Heading, Flex, Text, Box, Input, InputGroup, InputLeftElement, SimpleGrid, Select} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import PaletteCard from '../components/PaletteCard';
import { useState, useEffect } from 'react';
import PaletteFilter from '../services/filter';

interface IndexPageProps {
  palettes: IColorPalette[];
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
          <Heading>abc OpenPalette explorer 🎨</Heading>
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
        <SimpleGrid mt="10px" columns={[1, 1, 2, 3, 4]} spacing={10}>
          {palettesOnScreen.map(palette => (
            <PaletteCard key={palette.name} palette={palette} />
          ))}
        </SimpleGrid>
      </InfiniteScroll>
        
    </Flex>
  )
}

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  return {
    props: {
      palettes: palettes as IColorPalette[],
    },
    revalidate: 5,
  };
};
