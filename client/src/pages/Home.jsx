import { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { Search, Filter, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [categories] = useState(['All', 'Technology', 'Music', 'Business', 'Health', 'Workshop', 'Entertainment']);

    useEffect(() => {
        fetchEvents();
    }, [category]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/events?category=${category}&search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents();
    };

    return (
        <div className="space-y-8 pb-12">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 py-8"
            >
                <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 tracking-tight">
                    Discover Amazing Events
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                    Join thousands of people discovering local workshops, global conferences, and everything in between.
                </p>
            </motion.header>

            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/50 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-gray-700 shadow-2xl flex flex-col md:flex-row gap-4 items-center"
            >
                <form onSubmit={handleSearch} className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                    <input
                        type="text"
                        placeholder="Search events by name..."
                        className="w-full bg-gray-900/80 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition placeholder-gray-500 font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-56">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            className="w-full bg-gray-900/80 border border-gray-700 rounded-2xl py-4 pl-12 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition cursor-pointer font-medium"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <Filter size={14} />
                        </div>
                    </div>
                    <button
                        onClick={fetchEvents}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-2"
                    >
                        Explore
                    </button>
                </div>
            </motion.section>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <Loader2 className="animate-spin text-blue-500" size={64} />
                    <p className="text-gray-400 animate-pulse text-xl font-bold tracking-widest uppercase">Fetching events</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {events.length > 0 ? (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {events.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <EventCard event={event} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-700 mx-auto max-w-2xl"
                        >
                            <div className="bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar className="text-gray-500" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-300 mb-2">No Events Found</h3>
                            <p className="text-gray-500 mb-8 px-8">We couldn't find any events matching your current filters. Try searching for something else or clearing filters.</p>
                            <button
                                onClick={() => { setSearch(''); setCategory('All'); fetchEvents(); }}
                                className="text-blue-400 font-black hover:text-blue-300 transition uppercase tracking-widest text-sm"
                            >
                                Clear All Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default Home;
