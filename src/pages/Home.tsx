import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, UtensilsCrossed, BookOpen } from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col animate-fade-in-up w-full max-w-5xl mx-auto py-8">

            {/* Header / Module Name */}
            <div className="mb-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-brand-light text-brand-blue rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <BookOpen size={32} />
                </div>
                <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">
                    Recipe Book
                </h1>
                <p className="text-content-secondary mt-2">Manage your culinary standards and preparations</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full mt-4">
                {/* Finished Recipes Button */}
                <button
                    onClick={() => navigate('/categories')}
                    className="flex-1 group relative overflow-hidden rounded-2xl bg-surface-card border border-surface-border hover:border-brand-blue/80 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col items-center justify-center h-64 md:h-72"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10" />

                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1400')" }}
                    />

                    <div className="relative z-20 flex flex-col items-center p-6 text-white text-center">
                        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500 shadow-md border border-white/20 group-hover:border-transparent">
                            <ChefHat size={36} strokeWidth={1.5} />
                        </div>
                        <span className="text-2xl font-bold tracking-wide uppercase drop-shadow-md">Finished Recipes</span>
                        <span className="mt-2 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">Browse completed dishes</span>
                    </div>
                </button>

                {/* Semi-Finished Button */}
                <button
                    onClick={() => navigate('/categories')}
                    className="flex-1 group relative overflow-hidden rounded-2xl bg-surface-card border border-surface-border hover:border-emerald-500/80 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col items-center justify-center h-64 md:h-72"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10" />

                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1400')" }}
                    />

                    <div className="relative z-20 flex flex-col items-center p-6 text-white text-center">
                        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500 shadow-md border border-white/20 group-hover:border-transparent">
                            <UtensilsCrossed size={36} strokeWidth={1.5} />
                        </div>
                        <span className="text-2xl font-bold tracking-wide uppercase drop-shadow-md">Semi-Finished</span>
                        <span className="mt-2 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">Access master batches & preps</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Home;
