import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Clock, LogIn, LogOut, Calendar, Search } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: string;
  notes?: string;
}

const Attendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    check_in: new Date().toTimeString().split(' ')[0].substring(0, 5),
    check_out: ''
  });

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/api/attendance', {
        params: { date: selectedDate }
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/attendance/check-in', {
        employee_id: formData.employee_id,
        date: formData.date,
        check_in: formData.check_in
      });
      fetchAttendance();
      resetForm();
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async (record: AttendanceRecord) => {
    const checkOutTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
    try {
      await api.post('/api/attendance/check-out', {
        employee_id: record.employee_id,
        date: record.date,
        check_out: checkOutTime
      });
      fetchAttendance();
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      date: new Date().toISOString().split('T')[0],
      check_in: new Date().toTimeString().split(' ')[0].substring(0, 5),
      check_out: ''
    });
    setShowCheckInForm(false);
  };

  const filteredAttendance = attendance.filter(record =>
    record.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading attendance records...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <button
          onClick={() => setShowCheckInForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Check In
        </button>
      </div>

      {showCheckInForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Check In Employee</h2>
          <form onSubmit={handleCheckIn} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Employee ID"
              value={formData.employee_id}
              onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="time"
              value={formData.check_in}
              onChange={(e) => setFormData({...formData, check_in: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Check In
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {record.first_name} {record.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.employee_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.check_in || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.check_out || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!record.check_out && (
                      <button
                        onClick={() => handleCheckOut(record)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        <LogOut className="w-3 h-3 inline mr-1" />
                        Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Present Today</div>
              <div className="text-lg font-medium text-gray-900">
                {attendance.filter(r => r.status === 'present').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Checked In Only</div>
              <div className="text-lg font-medium text-gray-900">
                {attendance.filter(r => r.check_in && !r.check_out).length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Completed</div>
              <div className="text-lg font-medium text-gray-900">
                {attendance.filter(r => r.check_in && r.check_out).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
