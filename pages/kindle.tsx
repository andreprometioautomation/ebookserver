import React, { useState, useEffect } from 'react'
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
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
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

  // Check if storageState.json exists on backend (simple check)
  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/checkLogin')
      if (res.ok) {
        const { logged } = await res.json()
        setIsLogged(logged)
        if (logged) fetchBooks()
      } else {
        setIsLogged(false)
      }
    } catch {
      setIsLogged(false)
    }
  }

  useEffect(() => {
    checkLoginStatus()
  }, [])

  // Opens manual login window with Playwright
  const handleManualLogin = () => {
    // Opens external window for login (e.g., to a route that launches Playwright browser)
    window.open('/api/generateStorage', '_blank', 'width=600,height=700')
    toast({
      title: 'Login window opened',
      description: 'After logging in, close the window to continue',
      status: 'info',
      duration: 6000,
    })
  }

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

  const handleCapture = async () => {
    if (!asin.trim()) {
      toast({ title: 'ASIN required', status: 'warning', duration: 3000 })
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

      toast({
        title: 'PDF created',
        description: 'Ready to download.',
        status: 'success',
        duration: 3000,
      })
      fetchBooks()
      onClose()
      setAsin('')
    } catch (err: any) {
      toast({
        title: 'Error creating PDF',
        description: err.message,
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoadingCapture(false)
    }
  }

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
          <Button colorScheme="orange" size="lg" onClick={handleManualLogin}>
            Login manually
          </Button>
          <Text mt={4} color="gray.300" fontSize="sm">
            A window will open for you to log in to Amazon Kindle. After closing it, come back here and
            your session will be ready.
          </Text>
        </Box>
      </Flex>
    )
  }

  return (
    <Box bg="gray.900" minH="100vh" py={10} px={6}>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (!loadingCapture) onClose()
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter ASIN</ModalHeader>
          <ModalCloseButton disabled={loadingCapture} />
          <ModalBody>
            <Input placeholder="ASIN" value={asin} onChange={(e) => setAsin(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCapture} isLoading={loadingCapture} colorScheme="purple" mr={3}>
              Create PDF
            </Button>
            <Button onClick={onClose} variant="ghost" disabled={loadingCapture}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Heading color="white" textAlign="center" mb={4}>
        AMAZON BOOKS
      </Heading>

      <Box textAlign="center" mb={6}>
        <Button colorScheme="purple" onClick={onOpen}>
          Capture ASIN
        </Button>
      </Box>

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
                  Download PDF
                </Button>
              </Link>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  )
}
