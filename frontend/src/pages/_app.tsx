import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import '@/styles/global.css'
import SideBar from '@/components/SideBar'
import Header from '@/components/Header'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
 
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)
 
  return (
    <>
      <div className="relative min-h-screen flex bg-white">
        <SideBar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="p-8">
              {getLayout(<Component {...pageProps} />)}
            </main>
          </div>
        </div>
    </>
  )
}