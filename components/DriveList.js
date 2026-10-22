// show dash when value is empty
function show(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return value;
}

// database keeps UTC, this shows India time
function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function DriveList({ drives }) {
  return (
    <div>
      {/* table: wide screens only */}
      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Branches</th>
              <th className="px-4 py-3 font-semibold">Min CGPA</th>
              <th className="px-4 py-3 font-semibold">Job type</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive) => (
              <tr key={drive.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{drive.companyName}</td>
                <td className="px-4 py-3">{drive.role}</td>
                <td className="px-4 py-3">{formatDate(drive.driveDate)}</td>
                <td className="px-4 py-3">{drive.eligibleBranch}</td>
                <td className="px-4 py-3">{show(drive.minCGPA)}</td>
                <td className="px-4 py-3">{show(drive.jobType)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* cards: phone only */}
      <div className="space-y-3 md:hidden">
        {drives.map((drive) => (
          <div key={drive.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{drive.companyName}</h3>
            <p className="text-gray-600">{drive.role}</p>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Date</dt>
                <dd className="text-right">{formatDate(drive.driveDate)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Branches</dt>
                <dd className="text-right">{drive.eligibleBranch}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Min CGPA</dt>
                <dd>{show(drive.minCGPA)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Job type</dt>
                <dd>{show(drive.jobType)}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
