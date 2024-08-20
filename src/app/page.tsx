import Link from 'next/link';

async function getAssignments() {
  const res = await fetch('http://localhost:3000/assignment.json', { cache: 'no-store' });
  const data = await res.json();
  return data?.items as any[];
}

export default async function HomePage() {
  const assignments = await getAssignments();

  return (
    <div className="relative h-screen bg-white">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-3 bg-custom-blue shadow-md z-20">
        <h1 className="text-2xl font-bold">Mark My Words</h1>
        <div className="flex items-center space-x-4">
          <Link href="/guides" className="text-gray-600 hover:text-gray-800">User Guides</Link>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">User's name</span>
            <img src="/path/to/profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" /> {/* Profile Image */}
          </div>
        </div>
      </div>

      {/* Layout for Sidebar and Main Content */}
      <div className="pt-12 flex h-full">
        {/* Left Menu */}
        <aside className="w-1/13 bg-gray-300 text-white p-4 z-10">
          <nav>
            <ul>
              <li className="pt-12 mb-4">
                <Link href="/dashboard" className="block p-2 bg-gray-100 rounded hover:bg-grey-200">
                </Link>
              </li>
              <li className="pt-12 mb-4">
                <Link href="/dashboard" className="block p-2 bg-gray-100 rounded hover:bg-grey-200">
                </Link>
              </li>
              {/* Add more menu items as needed */}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Create Assessment Button */}
          <div className="flex justify-between items-center mb-6 text-black">
            <h1 className="text-xl font-bold">Reading Comprehensive</h1>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center hover:bg-yellow-600">
              + Create Assessment
            </button>
          </div>


          {/* Assignments Table */}
          <table className="w-full table-auto border-collapse text-black">
            <thead>
              <tr className="bg-gray-300">
                <th className="border px-4 py-2">Assignment Name</th>
                <th className="border px-4 py-2">Actions</th>
                <th className="border px-4 py-2">View</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{assignment.name}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                  <td className="border px-4 py-2">
                    <Link href={`/assignment/${assignment.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      View Assignment
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
