import Link from 'next/link';


async function getAssignments(assignmentID:string) {
    const res = await fetch ('http://localhost:3000/assignment.json',
    {
        next: {revalidate: 10},
    });
    const data = await res.json();
    let assignment = null;
    const numericAssignmentID = Number(assignmentID);
    for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].id === numericAssignmentID) {
            assignment = data.items[i];
            break;
        }
    }
    return assignment;
}


export default async function AssignmentPage({params}: any){
    const assignment = await getAssignments(params.id);
    return (
    <div className="relative h-screen bg-white">

      {/* Layout for Sidebar and Main Content */}
      <div className="pt-12 flex h-full">
        {/* Left Menu */}
        <aside className="w-1/13 bg-gray-300 text-white p-4 z-10">
          <nav>
            <ul>
              <li className="pt-12 mb-4">
                <Link href="/" className="block p-2 bg-gray-100 rounded hover:bg-grey-200">
                </Link>
              </li>
              <li className="pt-12 mb-4">
                <Link href="/" className="block p-2 bg-gray-100 rounded hover:bg-grey-200">
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
            <h1 className="text-xl font-bold">{assignment.name}</h1>
          </div>
        </main>
      </div>
    </div>
    )
}
