import Link from 'next/link';

export default function HomePage() {

  return (
    <div className="relative h-screen bg-white">
      <div className="pt-12 flex h-full">
        <aside className="w-1/13 bg-gray-300 text-white p-4 z-10">
          <nav>
            <ul>
              <li className="pt-12 mb-4">
                <Link href="/" className="block p-2 bg-gray-100 rounded hover:bg-grey-200">
                </Link>
              </li>
              <li className="pt-12 mb-4">
                <Link href="/assignment" className="block p-2 bg-gray-100 rounded hover:bg-grey-200">
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8 text-black">
          <h1>Home Page</h1>
        </main>
      </div>
    </div>
  );
}
