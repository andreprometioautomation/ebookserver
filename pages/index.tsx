import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Link,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
} from '@chakra-ui/react';

type Book = {
  name: string;
  url: string;
};

export default function Home() {
  const [asin, setAsin] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const toast = useToast();

  // Login simulado
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setIsLogged(true);
        toast({
          title: 'Login exitoso',
          description: data.message,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        fetchBooks();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'Algo salió mal',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Obtener la lista de PDFs en /output-pdfs (public)
  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/listBooks');
      if (!res.ok) throw new Error('Error fetching books');
      const data: Book[] = await res.json();
      setBooks(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar la lista de libros',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Ejecuta la captura + creación PDF en una sola llamada
  const handleCaptureAll = async () => {
    if (!asin.trim()) {
      toast({
        title: 'ASIN requerido',
        description: 'Por favor ingresa un ASIN válido',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setPdfUrl(null);
      // Solo llamada a /api/capture que hace captura + PDF
      const captureRes = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asin }),
      });
      const captureData = await captureRes.json();
      if (!captureRes.ok) throw new Error(captureData.message);

      setPdfUrl(captureData.pdfPath);

      toast({
        title: 'PDF creado',
        description: 'El PDF está listo para descargar',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      // Actualiza la lista de libros automáticamente
      fetchBooks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear el PDF',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Carga lista libros al iniciar sesión
  useEffect(() => {
    if (isLogged) fetchBooks();
  }, [isLogged]);

  return (
    <Box
      bg="white"
      border="4px solid transparent"
      borderRadius="xl"
      p={6}
      maxW="500px"
      mx="auto"
      mt={10}
      boxShadow="lg"
      bgImage="url('/1034.png')"
      bgRepeat="no-repeat"
      bgSize="cover"
    >
      <VStack spacing={6}>
        <Text fontSize="3xl" fontWeight="bold" color="purple.700" textAlign="center">
          Amazon Kindle Capture
        </Text>

        {!isLogged ? (
          <Button colorScheme="purple" width="full" onClick={handleLogin}>
            Iniciar sesión en Kindle Library
          </Button>
        ) : (
          <>
            <Input
              placeholder="Introduce ASIN"
              value={asin}
              onChange={e => setAsin(e.target.value)}
              borderColor="purple.300"
              focusBorderColor="purple.500"
            />
            <Button
              onClick={handleCaptureAll}
              bgGradient="linear(to-r, purple.500, purple.700)"
              color="white"
              width="full"
              _hover={{ bg: 'purple.600' }}
            >
              Capturar y Crear PDF
            </Button>

            {pdfUrl && (
              <Link href={pdfUrl} download target="_blank" width="full">
                <Button colorScheme="green" width="full" mt={2}>
                  Descargar PDF generado
                </Button>
              </Link>
            )}

            {books.length > 0 && (
              <Box mt={6} width="full">
                <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
                  Libros descargados
                </Text>
                <SimpleGrid columns={[1, 1, 2]} spacing={4}>
                  {books.map((book, i) => (
                    <Card key={i} border="1px solid #E2E8F0" borderRadius="md">
                      <CardBody>
                        <Heading fontSize="md" mb={2} isTruncated>
                          {book.name}
                        </Heading>
                        <Link href={book.url} download target="_blank">
                          <Button colorScheme="blue" width="full">
                            Descargar libro
                          </Button>
                        </Link>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
}
