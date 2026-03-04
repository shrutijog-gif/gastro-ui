import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings,
    Folders,
    MonitorSmartphone,
    Star,
    History,
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-surface-background w-full overflow-hidden flex flex-col items-center">

            {/* Subtle light effect without explicit colors, using pure white gradients to create depth */}
            <div className="absolute top-[-20%] left-1/4 w-[70%] h-[50%] bg-gradient-to-b from-white/80 to-transparent rounded-b-[100%] blur-3xl pointer-events-none opacity-60" />

            <div className="relative z-10 flex flex-col w-full max-w-6xl mx-auto py-8 px-6 lg:px-8">

                {/* Hero Section */}
                <div className="mb-10 flex flex-col items-start animate-fade-in-up">
                    <h1 className="text-4xl font-extrabold text-content-primary tracking-tight font-sans drop-shadow-sm">
                        Welcome back to the Hub, System
                    </h1>
                    <p className="text-base text-content-secondary mt-2 font-medium bg-white/50 inline-block px-3 py-1 rounded-full border border-white/60 shadow-sm backdrop-blur-sm">Your Digital Workspace</p>
                </div>

                {/* Apps Section */}
                <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center mb-5 gap-2">
                        <div className="h-6 w-1.5 bg-brand-blue rounded-full"></div>
                        <h2 className="text-lg font-bold text-content-primary tracking-wide">Apps</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* Administration Card */}
                        <div className="group relative bg-surface-card rounded-2xl p-5 flex items-center gap-5 cursor-pointer overflow-hidden border border-surface-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="w-14 h-14 rounded-2xl bg-brand-blue flex flex-shrink-0 items-center justify-center shadow-md group-hover:shadow-[0_0_20px_rgba(29,112,209,0.4)] transition-all duration-300">
                                <Settings size={28} strokeWidth={1.5} className="text-white transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-content-primary text-lg">Administration</span>
                                <span className="text-xs text-content-muted font-medium mt-0.5">System settings & users</span>
                            </div>
                            <div className="ml-auto w-8 h-8 rounded-full border border-surface-border flex items-center justify-center group-hover:border-brand-blue/30 group-hover:bg-brand-light/20 transition-all opacity-opacity flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-content-muted group-hover:bg-brand-blue transition-colors"></div>
                            </div>
                        </div>

                        {/* Document Registry Card */}
                        <div
                            className="group relative bg-surface-card rounded-2xl p-5 flex items-center gap-5 cursor-pointer overflow-hidden border border-surface-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            onClick={() => navigate('/registry')}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="w-14 h-14 rounded-2xl bg-brand-blue flex flex-shrink-0 items-center justify-center shadow-md group-hover:shadow-[0_0_20px_rgba(29,112,209,0.4)] transition-all duration-300">
                                <Folders size={28} strokeWidth={1.5} className="text-white transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-content-primary text-lg">Document Registry</span>
                                <span className="text-xs text-content-muted font-medium mt-0.5">Manage culinary standards</span>
                            </div>
                            <div className="ml-auto w-8 h-8 rounded-full border border-surface-border flex items-center justify-center group-hover:border-brand-blue/30 group-hover:bg-brand-light/20 transition-all opacity-opacity flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-content-muted group-hover:bg-brand-blue transition-colors"></div>
                            </div>
                        </div>

                        {/* Masters Card */}
                        <div className="group relative bg-surface-card rounded-2xl p-5 flex items-center gap-5 cursor-pointer overflow-hidden border border-surface-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="w-14 h-14 rounded-2xl bg-brand-blue flex flex-shrink-0 items-center justify-center shadow-md group-hover:shadow-[0_0_20px_rgba(29,112,209,0.4)] transition-all duration-300">
                                <MonitorSmartphone size={28} strokeWidth={1.5} className="text-white transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-content-primary text-lg">Masters</span>
                                <span className="text-xs text-content-muted font-medium mt-0.5">Core data configuration</span>
                            </div>
                            <div className="ml-auto w-8 h-8 rounded-full border border-surface-border flex items-center justify-center group-hover:border-brand-blue/30 group-hover:bg-brand-light/20 transition-all opacity-opacity flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-content-muted group-hover:bg-brand-blue transition-colors"></div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Favorite Features Section */}
                <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center mb-5 gap-2">
                        <div className="h-4 w-4 rounded-full bg-amber-100 flex items-center justify-center"><Star size={10} className="text-amber-500 fill-amber-500" /></div>
                        <h2 className="text-lg font-bold text-content-primary tracking-wide">Favorite Features</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={`fav-${item}`} className="relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-xl p-4 flex items-center justify-between hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-left group hover:-translate-y-0.5">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex flex-col pl-2">
                                    <span className="font-bold text-[15px] text-content-primary">My Documents {item}</span>
                                    <span className="text-xs text-content-muted font-medium mt-0.5">Document Registry</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-surface-background flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                                    <Star size={16} className="text-amber-400 fill-amber-400 shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Features Section */}
                <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center mb-5 gap-2">
                        <div className="h-4 w-4 rounded-full bg-brand-light flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue" /></div>
                        <h2 className="text-lg font-bold text-content-primary tracking-wide">Recent Features</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={`rec-${item}`} className="relative bg-white/40 backdrop-blur-xl border border-white/60 hover:border-white/80 rounded-xl p-4 flex items-center justify-between hover:bg-white/70 transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-left group hover:-translate-y-0.5">
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue/50 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex flex-col pl-2">
                                    <span className="font-bold text-[15px] text-content-secondary group-hover:text-content-primary transition-colors">Draft Report {item}</span>
                                    <span className="text-xs text-content-muted font-medium mt-0.5">Administration</span>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-surface-border flex items-center justify-center group-hover:bg-white transition-colors">
                                    <History size={14} className="text-content-muted transition-colors shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
