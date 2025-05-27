// components/SourcesSelector.tsx
import React from 'react'
import NextLink from 'next/link'
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Text,
} from '@chakra-ui/react'

type Source = {
  key: string
  label: string
  description: string
  image: string
}

const sources: Source[] = [
  {
    key: 'kindle',
    label: 'Kindle Library',
    description: 'Your favorite e-books in one place',
    image: '/images/kindle-thumb.jpg',
  },
  {
    key: 'iti',
    label: 'ITI Library',
    description: 'PDFs from iti.org',
    image: '/images/iti-thumb.jpg',
  },
]

export function SourcesSelector() {
  return (
    <Box
      bg="gray.900"
      w="100%"
      minH="100vh"
      py={12}
      px={6}
    >
      <Text
        color="white"
        fontSize="4xl"
        fontWeight="bold"
        textAlign="center"
        mb={8}
      >
        OUR SOURCES
      </Text>

      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {sources.map((src) => (
          <NextLink key={src.key} href={`/${src.key}`} passHref>
            {/* Card renders as <a> now, so clicks work */}
            <Card
              as="a"
              cursor="pointer"
              overflow="hidden"
              _hover={{ transform: 'scale(1.02)' }}
              transition="0.2s"
            >
              <CardBody p={0}>
                <Image
                  src={src.image}
                  alt={src.label}
                  objectFit="cover"
                  w="100%"
                  h="150px"
                />
                <Box p={4}>
                  <Text fontWeight="bold" mb={1}>
                    {src.label}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {src.description}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </NextLink>
        ))}
      </SimpleGrid>
    </Box>
  )
}
