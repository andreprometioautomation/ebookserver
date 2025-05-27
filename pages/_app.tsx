// pages/_app.tsx
import React, { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { ChakraProvider } from '@chakra-ui/react'

const publicRoutes: string[] = ['/login']  // rutas públicas

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [ready, setReady] = useState<boolean>(false)

  useEffect(() => {
    const authCheck = (url: string) => {
      const path = url.split('?')[0]
      const isLogged =
        typeof window !== 'undefined' && localStorage.getItem('isLogged') === 'true'

      if (!isLogged && !publicRoutes.includes(path)) {
        router.push('/login')
      } else {
        setReady(true)
      }
    }

    // al cargar la página
    authCheck(router.pathname)

    // en cada cambio de ruta
    router.events.on('routeChangeStart', authCheck)
    return () => {
      router.events.off('routeChangeStart', authCheck)
    }
  }, [router])

  // hasta que no sepamos el estado de auth, no renderizamos nada
  if (!ready) return null

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
