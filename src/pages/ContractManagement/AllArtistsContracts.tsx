import { useCallback, useEffect, useState } from 'react';
import { Activity, Search, Eye, Logs } from 'lucide-react';
import { baseUrl, publisherID, userToken } from '../../constants';
import { Link } from 'react-router-dom';

const AllArtistsContracts = () => {
  const [activeTab, setActiveTab] = useState('playlogs');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const [search, setSearch] = useState('');

  const [orderDisputes, setOrderDisputes] = useState('');


  const [page, setPage] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // Default to 1 to avoid issues
  const [loading, setLoading] = useState(false);
 
  const[disputes, setDisputes]= useState([]);




    
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}api/music-monitor/stations-match-disputes/?search=${encodeURIComponent(
          search,
        )}&publisher_id=${encodeURIComponent(
          publisherID,
        )}&order_by=${encodeURIComponent(orderDisputes)}&page=${page}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${userToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDisputes(data.data.disputes);
      setTotalPages(data.data.pagination.total_pages);
      setItemCount(data.data.pagination.count);
      console.log('Total Pages:', data.data.pagination.total_pages);
      console.log('ppp:', data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, page, userToken, orderDisputes]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  return (
    <div className="min-h-screen bg-gradient-to-br ">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Logs className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  All Artist Contracts
                </h1>
                <p className="text-gray-300 text-sm">
                  All your managed artists Contracts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/10 backdrop-blur-md text-white pl-10 pr-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-between">
          {/* Period Selector */}

          <div className="mb-8">
            <div className="flex space-x-2 bg-white/10 backdrop-blur-md p-1 rounded-lg border border-white/20 w-fit">
              {['daily', 'weekly', 'monthly', 'all-time'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-400" />
            All Artists
            </h2>
            <div className="overflow-auto rounded-xl">
              <table className="min-w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-white/5 text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Song</th>
                    <th className="px-4 py-3">Artist</th>
                    <th className="px-4 py-3">Start Date & Time</th>
                    <th className="px-4 py-3">End Date & Time</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Avg. Confidence</th>
                    <th className="px-4 py-3">Earnings</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Dispute Comments</th>
                    <th className="px-4 py-3">Timestamp</th>

                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-white/10">
                  {disputes?.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-2 text-white">{log.track_title}</td>
                      <td className="px-4 py-2">{log.artist_name}</td>
                      <td className="px-4 py-2">{log.start_time}</td>
                      <td className="px-4 py-2">{log.stop_time}</td>
                      <td className="px-4 py-2">{log.duration}</td>
                      <td className="px-4 py-2">{log.confidence}%</td>
                      <td className="px-4 py-2 text-green-400 font-medium">
                        ₵{log.earnings.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">{log.status}</td>

                      <td className="px-4 py-2">{log.comment}</td>
                      <td className="px-4 py-2">{log.timestamp}</td>
                      <td className="px-4 py-2">
                      <Link to="/match-dispute-details" state={{ dispute_id: log?.id }}>
                        <button className="w-full text-xs bg-red-600 text-white py-2 rounded-sm font-semibold hover:shadow-lg transition-shadow">
                          {' '}
                          Review
                        </button>

                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default AllArtistsContracts;
