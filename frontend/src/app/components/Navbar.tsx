// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/test-supabase"
            className="text-white hover:text-gray-300"
          >
            Test Supabase
          </Link>
        </li>
      </ul>
    </nav>
  );
}
