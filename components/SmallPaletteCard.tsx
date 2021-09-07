import { mix, linearGradient, getContrast } from 'polished'
import IColorPalette from '../types/colorPalette';

import { Flex, Box, Heading, Text, Tooltip, Tag } from '@chakra-ui/react';

interface PaletteCardProps {
  palette: IColorPalette
}

export default function SmallPaletteCard({ palette }: PaletteCardProps) {
  return (
    <Flex minW="100px" h="200px" flexDir="column" borderWidth="2px" borderRadius="15px" bgColor={`linear-gradient(304deg, ${palette.colors[0]}, 0%, ${palette.colors[4]}, 100%)`}>
      <Box position="absolute" bgColor="green">
        <Heading ml="10px" mt="5px" position="absolute" left="0px" top="0px" fontWeight="bold" color="teal.500" size="md">
          <i>#{palette.rarityPosition}</i>
        </Heading>
      </Box>

      <Flex py="20px" justifyContent="center" flexDir="column" alignItems="center">
        <Heading size="md">
          <a href={`https://opensea.io/assets/0x1308c158e60d7c4565e369df2a86ebd853eef2fb/${palette.name}`} target="_blank" rel="noreferrer">
            Palette #{palette.name}
          </a>
        </Heading>

        <Tooltip label="The higher the rarest">
          <Text color="gray.400">Rarity # of {palette.rarityScore}</Text>
        </Tooltip>

      </Flex>

      {palette.colors.map((color, index) => (
        <Flex key={index} bgColor={color} w="100%" h="100%" justifyContent="center" alignItems="center" borderBottomRadius={index === 4 ? '10px' : '0px'}>
          <Text color={getContrast(color, '#fff') > getContrast(color, '#000') ? undefined : 'black'}>{color}</Text>
        </Flex>
      ))}

    </Flex>
  )
}