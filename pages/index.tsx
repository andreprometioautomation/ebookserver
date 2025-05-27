import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { SourcesSelector } from '@/components/SourcesSelector'

export default function Home() {
  return (
    <ChakraProvider>
      <SourcesSelector />
    </ChakraProvider>
  )
}
