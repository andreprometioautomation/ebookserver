import React from 'react'
import { useRouter } from 'next/router'
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
  const router = useRouter()

  return (
    <Box bg="gray.900" py={12} px={6}   w="100%"           // ensure full width
    minH="100vh" >
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
          <Card
            key={src.key}
            cursor="pointer"
            onClick={() => router.push(`/${src.key}`)}
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
        ))}
      </SimpleGrid>
    </Box>
  )
}
