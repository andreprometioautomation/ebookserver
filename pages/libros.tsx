// pages/libros.tsx
import { useEffect, useState } from 'react';
import { Box, Heading, VStack, Text, Link, Spinner } from '@chakra-ui/react';

export default function Libros() {
  const [books, setBooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data.books))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4}>Libros Capturados</Heading>
      {loading ? (
        <Spinner />
      ) : (
        <VStack align="start" spacing={3}>
          {books.map(asin => (
            <Box key={asin}>
              <Text>Libro ASIN: {asin}</Text>
              <Link
                href={`/pdfs/output_${asin}.pdf`}
                color="blue.500"
                isExternal
              >
                Ver PDF
              </Link>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
