import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categories } from '../data/mockData';

const CategoryList: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full animate-fade-in-up">
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-lg text-content-muted hover:bg-surface-card hover:text-content-primary transition-colors border border-transparent hover:border-surface-border"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-content-primary tracking-tight">Select Category</h1>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => navigate(`/items/${category.id}`)}
                        className="group relative h-56 rounded-xl overflow-hidden border border-surface-border hover:border-brand-blue/50 transition-all duration-300 shadow-sm hover:shadow-lg bg-surface-card"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-content-primary/90 via-content-primary/30 to-transparent z-10" />
                        <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                            style={{ backgroundImage: `url(${category.image})` }}
                        />

                        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col items-start">
                            <span className="text-lg font-bold truncate w-full text-left text-white group-hover:text-brand-light transition-colors drop-shadow-md">
                                {category.name}
                            </span>
                            <span className="text-xs text-surface-background mt-1 font-medium opacity-90">12 Recipes</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
