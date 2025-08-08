import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('assignment');
  const [keyAssignments, setKeyAssignments] = useState([]);
  const [staffId, setStaffId] = useState('');
  const [keyId, setKeyId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // This line forces the token to be removed on every page load,
    // ensuring the login page always appears first.
    localStorage.removeItem('token');
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchKeyAssignments();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setKeyAssignments([]);
    setCurrentView('assignment');
  };

  const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    },
  });

  const fetchKeyAssignments = () => {
    axiosInstance.get('key-assignments/')
      .then(response => {
        setKeyAssignments(response.data.filter(item => item.status === 'Issued'));
      })
      .catch(error => {
        console.error('There was an error fetching the key assignments!', error);
        toast.error('Failed to fetch issued keys.');
      });
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post('key-assignments/', {
        staff_id: staffId,
        key_id: keyId,
        status: 'Issued',
      });
      toast.success('Key issued successfully!');
      setStaffId('');
      setKeyId('');
      fetchKeyAssignments();
    } catch (error) {
      console.error('There was an error issuing the key!', error);
      toast.error('Error issuing key.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnKey = async (id) => {
    try {
      await axiosInstance.patch(`key-assignments/${id}/`, {
        status: 'Returned',
        return_time: new Date().toISOString(),
      });
      toast.success('Key returned successfully!');
      fetchKeyAssignments();
    } catch (error) {
      console.error('There was an error returning the key!', error);
      toast.error('Error returning key.');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Login onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  const renderView = () => {
    if (currentView === 'dashboard') {
      return <Dashboard handleLogout={handleLogout} />;
    }
    
    return (
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">RFID Key Assignment System</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:outline-none"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Assignment Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Issue New Key</h2>
            <form onSubmit={handleIssueSubmit}>
              <div className="mb-4">
                <label htmlFor="staffId" className="block text-gray-700 font-bold mb-2">Staff ID (RFID Scan)</label>
                <input
                  type="text"
                  id="staffId"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Staff ID"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="keyId" className="block text-gray-700 font-bold mb-2">Key ID</label>
                <input
                  type="text"
                  id="keyId"
                  value={keyId}
                  onChange={(e) => setKeyId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Key ID"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isSubmitting ? 'Submitting...' : 'Issue Key'}
              </button>
            </form>
          </div>
          {/* List of Issued Keys */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Issued Keys</h2>
            {keyAssignments.length > 0 ? (
              <ul className="space-y-4">
                {keyAssignments.map(assignment => (
                  <li key={assignment.id} className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">Staff: {assignment.staff_id}</p>
                      <p>Key ID: {assignment.key_id}</p>
                      <p className="text-sm text-gray-500">Issued: {new Date(assignment.issue_time).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleReturnKey(assignment.id)}
                      className="bg-green-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-green-600 focus:outline-none"
                    >
                      Return
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No keys are currently issued.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {renderView()}
    </>
  );
}

export default App;