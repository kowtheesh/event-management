import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, LogOut, User, LayoutDashboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Explore', path: '/' },
        ...(user ? [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : [])
    ];

    return (
        <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 py-4">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 text-2xl font-black group">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/20">
                        <Calendar size={24} className="text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Bellcorp</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                "text-sm font-black uppercase tracking-widest transition-colors relative py-1",
                                location.pathname === link.path ? "text-blue-400" : "text-gray-400 hover:text-white"
                            )}
                        >
                            {link.name}
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4 pl-4">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">Verified Member</span>
                                <span className="text-sm font-bold text-gray-200">{user.name}</span>
                            </div>
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg relative group overflow-hidden">
                                <User size={20} className="text-white z-10" />
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 p-3 rounded-2xl transition-all border border-gray-700 shadow-xl active:scale-90"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors px-4"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                            >
                                <Sparkles size={16} />
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
