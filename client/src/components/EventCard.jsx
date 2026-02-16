import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';


const EventCard = ({ event }) => {
    const date = new Date(event.date);

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="h-full bg-gray-800/40 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-colors group shadow-xl hover:shadow-blue-500/10"
        >
            <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full border border-blue-500/20">
                        {event.category}
                    </span>
                    <span className={cn(
                        "text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full border",
                        event.availableSeats > 0 ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                        {event.availableSeats > 0 ? `${event.availableSeats} Available` : 'Fully Booked'}
                    </span>
                </div>

                <div className="flex-1">
                    <h3 className="text-2xl font-black mb-3 group-hover:text-blue-400 transition-colors leading-tight">{event.name}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{event.description}</p>

                    <div className="space-y-3 mb-8 text-sm font-medium">
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                                <Calendar size={16} className="text-blue-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 uppercase tracking-tighter font-bold">Date & Time</span>
                                <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                                <MapPin size={16} className="text-blue-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 uppercase tracking-tighter font-bold">Location</span>
                                <span className="truncate max-w-[180px]">{event.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    to={`/event/${event.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl transition-all group-hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest shadow-lg"
                >
                    Explore Event
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

export default EventCard;
