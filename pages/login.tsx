// pages/login.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react'

// Import your background (or pass in as a prop)
import bgImage from '@/public/bg.png'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const router                  = useRouter()
  const toast                   = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/logintoapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    setLoading(false)

    if (res.ok) {
        localStorage.setItem('isLogged', 'true')
router.push('/')
      // On success, redirect wherever you like
   
    } else {
      const { message } = await res.json()
      toast({
        title: 'Login failed',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex
      h="100vh"
      bgImage={`url(${bgImage.src})`}
      bgSize="cover"
      bgPos="center"
      align="center"
      justify="center"
    >
      <Box
        bg="rgba(0,0,0,0.6)"
        p={8}
        rounded="md"
        w={['90%', '400px']}
        color="white"
        textAlign="center"
      >
        <Heading size="sm" mb={6} letterSpacing="widest">
          LOG IN
        </Heading>

        <form onSubmit={handleSubmit}>
          <FormControl mb={4} isRequired>
            <FormLabel>Email address:</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              bg="white"
              color="black"
            />
          </FormControl>

          <FormControl mb={6} isRequired>
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              bg="white"
              color="black"
            />
          </FormControl>

          <Button
            type="submit"
            w="100%"
            bg="white"
            color="black"
            _hover={{ bg: 'gray.100' }}
            isLoading={loading}
          >
            START READING
          </Button>
        </form>
      </Box>
    </Flex>
  )
}
