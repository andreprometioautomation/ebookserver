// pages/kindle.tsx
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Flex,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Link,
  useToast,
  Image as ChakraImage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from '@chakra-ui/react'
import bgImage from '@/public/bg.png'

type Book = { name: string; url: string }

export default function KindlePage() {
  const [isLogged, setIsLogged] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [asin, setAsin] = useState('')
  const [loadingCapture, setLoadingCapture] = useState(false)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // 1) Login se encarga sólo de autenticar y cargar libros
  const handleLogin = async () => {
    const res = await fetch('/api/login', { method: 'POST' })
    const { message } = await res.json()

    if (res.ok) {
      setIsLogged(true)
      toast({ title: 'Logged in', status: 'success', duration: 3000 })
      fetchBooks()
    } else {
      toast({ title: 'Login failed', description: message, status: 'error', duration: 3000 })
    }
  }

  // 2) Trae los PDFs ya generados
  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/listBooks')
      if (!res.ok) throw new Error()
      const data: Book[] = await res.json()
      setBooks(data)
    } catch {
      toast({ title: 'Error loading books', status: 'error', duration: 3000 })
    }
  }

  // 3) Llama a tu endpoint de capture y refresca la lista
  const handleCapture = async () => {
    if (!asin.trim()) {
      toast({ title: 'ASIN requerido', status: 'warning', duration: 3000 })
      return
    }
    setLoadingCapture(true)
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asin }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error')

      toast({ title: 'PDF creado', description: 'Listo para descargar.', status: 'success', duration: 3000 })
      fetchBooks()
      onClose()
      setAsin('')
    } catch (err: any) {
      toast({ title: 'Error creando PDF', description: err.message, status: 'error', duration: 3000 })
    } finally {
      setLoadingCapture(false)
    }
  }

  // 4) Splash hasta que inicies sesión
  if (!isLogged) {
    return (
      <Flex
        h="100vh"
        bgImage={`url(${bgImage.src})`}
        bgSize="cover"
        bgPos="center"
        align="center"
        justify="center"
      >
        <Box bg="rgba(0,0,0,0.6)" p={8} rounded="md" textAlign="center" maxW="400px">
          <Text fontSize="4xl" color="white" mb={6}>
            Kindle Library
          </Text>
          <Button colorScheme="orange" size="lg" onClick={handleLogin}>
            Iniciar sesión
          </Button>
        </Box>
      </Flex>
    )
  }

  // 5) Pantalla tras login: botón para modal + grid de PDFs
  return (
    <Box bg="gray.900" minH="100vh" py={10} px={6}>
      {/* —– MODAL DE CAPTURAR ASIN —– */}
      <Modal
        isOpen={isOpen}
        onClose={() => { if (!loadingCapture) onClose() }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Introduce ASIN</ModalHeader>
          <ModalCloseButton disabled={loadingCapture} />
          <ModalBody>
            <Input
              placeholder="ASIN"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleCapture}
              isLoading={loadingCapture}
              colorScheme="purple"
              mr={3}
            >
              Crear PDF
            </Button>
            <Button onClick={onClose} variant="ghost" disabled={loadingCapture}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Heading color="white" textAlign="center" mb={4}>
        AMAZON BOOKS
      </Heading>

      {/* Aquí está tu botón que abre el modal */}
      <Box textAlign="center" mb={6}>
        <Button colorScheme="purple" onClick={onOpen}>
          Capturar ASIN
        </Button>
      </Box>

      {/* Grid de descargas */}
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {books.map((b, i) => (
          <Card key={i} bg="blackAlpha.800">
            <CardBody>
              <Heading size="md" color="white" isTruncated mb={4}>
                {b.name}
              </Heading>
              <Link href={b.url} isExternal>
              <Button
  colorScheme="green"
  size="sm"
  onClick={() => {
    const filename = b.url.split('/').pop()
    if (!filename) return
    window.location.href = `/api/download?file=${encodeURIComponent(filename)}`
  }}
>
  Descargar PDF
</Button>
              </Link>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  )
}
