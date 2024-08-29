import type { ReactElement } from 'react'
import Layout from '../components/layout'
// import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'
 
const Page: NextPageWithLayout = () => {
  return (
    <>
      <main className="text-black flex-1 p-8">
        This is the home page
      </main>
    </>
  )
}
 
export default Page