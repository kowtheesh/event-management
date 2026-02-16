import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, XCircle, Loader2, ArrowRight, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const { data } = await axios.get('/api/events/user/me');
            setRegistrations(data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
        setLoading(false);
    };

    const handleCancel = async (eventId) => {
        if (!window.confirm('Are you sure you want to cancel your registration?')) return;
        try {
            await axios.delete(`/api/events/${eventId}/cancel`);
            fetchRegistrations(); // Refresh list
        } catch (error) {
            alert('Failed to cancel registration');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="animate-spin text-blue-500" size={64} />
            <p className="text-gray-400 animate-pulse text-xl font-bold tracking-widest uppercase">Loading Dashboard</p>
        </div>
    );

    const now = new Date();
    const upcoming = registrations.filter(r => new Date(r.Event.date) >= now);
    const past = registrations.filter(r => new Date(r.Event.date) < now);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-12 pb-20">
            <motion.header
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8"
            >
                <div className="space-y-2">
                    <h1 className="text-5xl md:text-6xl font-black text-white leading-none">Your Space</h1>
                    <p className="text-gray-500 text-lg font-medium">Hello, {user.name}. Here's what's on your radar.</p>
                </div>
                <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 p-6 rounded-[2rem] flex items-center gap-8 shadow-2xl">
                    <div className="flex flex-col items-center gap-1 group cursor-default">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black py-1">Booked</span>
                        <span className="text-3xl font-black text-blue-400 group-hover:scale-110 transition-transform">{registrations.length}</span>
                    </div>
                    <div className="h-12 w-px bg-gray-700"></div>
                    <div className="flex flex-col items-center gap-1 group cursor-default">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black py-1">Upcoming</span>
                        <span className="text-3xl font-black text-purple-400 group-hover:scale-110 transition-transform">{upcoming.length}</span>
                    </div>
                </div>
            </motion.header>

            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600/20 p-3 rounded-2xl">
                        <Calendar className="text-blue-400" size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Upcoming Journeys</h2>
                </div>

                {upcoming.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {upcoming.map(reg => (
                            <motion.div
                                key={reg.id}
                                variants={itemVariants}
                                className="bg-gray-800/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-gray-700/50 flex flex-col justify-between group relative overflow-hidden shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                                <div className="z-10 relative">
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-4 py-2 rounded-full border border-blue-500/20 uppercase tracking-widest">
                                            {reg.Event.category}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCancel(reg.Event.id)}
                                            className="text-gray-500 hover:text-red-400 transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                                        >
                                            <XCircle size={18} />
                                            Cancel
                                        </motion.button>
                                    </div>

                                    <h3 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors leading-tight">{reg.Event.name}</h3>

                                    <div className="space-y-4 text-gray-400 font-medium italic">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={18} className="text-blue-400" />
                                            <span>{new Date(reg.Event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin size={18} className="text-blue-400" />
                                            <span>{reg.Event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/event/${reg.Event.id}`}
                                    className="mt-10 flex items-center justify-center gap-3 bg-gray-900 border border-gray-700/50 hover:bg-blue-600 hover:border-blue-500 text-white font-black py-4 rounded-2xl transition-all group/btn text-xs uppercase tracking-widest z-10 relative"
                                >
                                    View Full Event
                                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-gray-800/20 rounded-[3rem] border-2 border-dashed border-gray-700 mx-auto"
                    >
                        <div className="bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LayoutGrid className="text-gray-600" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-300 mb-2">Clear Schedule</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't booked any experiences yet. Ready to start your adventure?</p>
                        <Link to="/" className="bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-4 rounded-2xl transition-all inline-block shadow-lg shadow-blue-600/30 uppercase tracking-widest text-xs">
                            Discover Events
                        </Link>
                    </motion.div>
                )}
            </section>

            <AnimatePresence>
                {past.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 pt-12 border-t border-gray-800/50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-700/30 p-3 rounded-2xl">
                                <CheckCircle2 className="text-gray-500" size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-500 tracking-tight">Memory Lane</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {past.map(reg => (
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    key={reg.id}
                                    className="bg-gray-800/20 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 flex flex-col opacity-60 hover:opacity-100 transition-all cursor-default"
                                >
                                    <h3 className="font-black text-gray-300 text-xl mb-4 leading-tight">{reg.Event.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-6">
                                        <Calendar size={14} />
                                        <span>Completed on {new Date(reg.Event.date).toLocaleDateString()}</span>
                                    </div>
                                    <Link
                                        to={`/event/${reg.Event.id}`}
                                        className="mt-auto text-[10px] text-blue-400/50 hover:text-blue-400 uppercase font-black tracking-[0.2em] transition-colors"
                                    >
                                        Review Event
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
