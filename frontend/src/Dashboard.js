import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ handleLogout }) {
  const [allAssignments, setAllAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllAssignments = () => {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/api/key-assignments/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then(response => {
      setAllAssignments(response.data);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to fetch assignments. Please try again.');
      setLoading(false);
      console.error(err);
    });
  };

  useEffect(() => {
    fetchAllAssignments();
  }, []);

  const totalKeys = allAssignments.length;
  const issuedKeys = allAssignments.filter(a => a.status === 'Issued').length;
  const returnedKeys = allAssignments.filter(a => a.status === 'Returned').length;
  
  const filteredAssignments = allAssignments.filter(assignment =>
    assignment.staff_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.key_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Go to Assignment System
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-600">Total Assignments</h2>
          <p className="text-4xl font-bold text-gray-800">{totalKeys}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-green-600">Issued Keys</h2>
          <p className="text-4xl font-bold text-green-800">{issuedKeys}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-blue-600">Returned Keys</h2>
          <p className="text-4xl font-bold text-blue-800">{returnedKeys}</p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Assignment History</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Staff ID or Key ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssignments.map(assignment => (
              <tr key={assignment.id}>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.staff_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.key_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assignment.status === 'Issued' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(assignment.issue_time).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.return_time ? new Date(assignment.return_time).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;