import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const { data } = await axios.get(`/api/events/${id}`);
            setEvent(data);
        } catch (error) {
            console.error('Error fetching event:', error);
        }
        setLoading(false);
    };

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRegistering(true);
        setStatus({ type: '', message: '' });
        try {
            await axios.post(`/api/events/${id}/register`);
            setStatus({ type: 'success', message: 'Spot secured successfully! See you there.' });
            fetchEvent(); // Refresh seats
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to secure your spot' });
        }
        setRegistering(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="animate-spin text-blue-500" size={64} />
            <p className="text-gray-400 animate-pulse text-xl font-bold tracking-widest uppercase">Fetching details</p>
        </div>
    );

    if (!event) return (
        <div className="text-center py-32 space-y-4">
            <AlertCircle className="mx-auto text-red-500" size={64} />
            <h2 className="text-2xl font-black">Event Not Found</h2>
            <button onClick={() => navigate('/')} className="text-blue-400 hover:underline">Back to Explore</button>
        </div>
    );

    const eventDate = new Date(event.date);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group px-4 py-2 rounded-xl bg-gray-800/30 w-fit"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-black text-xs uppercase tracking-widest">Explore More</span>
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-8 space-y-12"
                >
                    <div className="relative h-[25rem] md:h-[35rem] rounded-[3rem] overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-12 overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                            <h1 className="text-6xl md:text-8xl font-black text-white text-center leading-[0.9] tracking-tighter drop-shadow-2xl z-10 transition-transform duration-700 group-hover:scale-105">
                                {event.name}
                            </h1>
                        </div>
                    </div>

                    <div className="px-4 space-y-12">
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-1 lg:w-16 bg-blue-600 rounded-full"></div>
                                <h2 className="text-4xl font-black tracking-tight">The Experience</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-xl font-medium antialiased">
                                {event.description}
                            </p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-start gap-6 p-8 bg-gray-800/30 rounded-[2.5rem] border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
                                <div className="bg-blue-600/20 p-4 rounded-2xl">
                                    <Calendar className="text-blue-400" size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest">Chronology</h4>
                                    <p className="text-2xl font-black text-white leading-tight">
                                        {eventDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <p className="text-gray-400 font-bold">{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 p-8 bg-gray-800/30 rounded-[2.5rem] border border-gray-700/50 hover:bg-gray-800/50 transition-colors">
                                <div className="bg-purple-600/20 p-4 rounded-2xl">
                                    <MapPin className="text-purple-400" size={32} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest">Venue</h4>
                                    <p className="text-2xl font-black text-white leading-tight">{event.location}</p>
                                    <p className="text-gray-400 font-bold">In-person experience</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="lg:col-span-4"
                >
                    <div className="bg-gray-800/40 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border border-gray-700/50 sticky top-12 shadow-2xl">
                        <div className="mb-10 p-6 bg-gray-900/50 rounded-2xl border border-gray-700/30">
                            <div className="flex items-center gap-3 mb-2">
                                <Sparkles className="text-amber-400" size={20} />
                                <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest">Elite Host</span>
                            </div>
                            <p className="text-xs text-gray-500 font-black uppercase tracking-tighter mb-1">Presented By</p>
                            <p className="font-black text-2xl text-blue-400 tracking-tight">{event.organizer}</p>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-black tracking-tighter block mb-1">Capacity</span>
                                    <span className="text-2xl font-black text-white">{event.capacity}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 uppercase font-black tracking-tighter block mb-1">Available</span>
                                    <span className={`text-4xl font-black ${event.availableSeats > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {event.availableSeats}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full bg-gray-900 h-4 rounded-full overflow-hidden p-1 border border-gray-700/50">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(event.availableSeats / event.capacity) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={cn(
                                        "h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                                        event.availableSeats > 0 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-red-500"
                                    )}
                                ></motion.div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {status.message && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-6 rounded-[2rem] flex items-center gap-4 mb-8 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-green-500/10 shadow-xl' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}
                                >
                                    {status.type === 'success' ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertCircle size={24} className="shrink-0" />}
                                    <p className="text-sm font-black uppercase tracking-tight leading-tight">{status.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleRegister}
                            disabled={registering || event.availableSeats <= 0}
                            className="w-full group relative bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black py-6 rounded-[2rem] transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
                        >
                            {registering ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : event.availableSeats > 0 ? (
                                <>
                                    <span>Secure Your Spot</span>
                                    <Users size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            ) : (
                                'Sold Out'
                            )}
                        </button>

                        <p className="text-center mt-6 text-[10px] text-gray-500 font-black uppercase tracking-widest">Secure & encrypted registration</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EventDetails;
