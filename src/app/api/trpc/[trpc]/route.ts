import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { NextRequest } from 'next/server'
import { appRouter } from '@/lib/routers'
import { createContext } from '@/lib/trpc'

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: ({ req }) => createContext({ req: req as NextRequest })
  })
}

export { handler as GET, handler as POST }
