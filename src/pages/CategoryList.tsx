import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';

const CategoryList: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full animate-fade-in-up">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => navigate(`/items/${category.id}`)}
                        className="group relative flex flex-col h-56 rounded-xl overflow-hidden border border-surface-border hover:border-brand-blue/50 transition-all duration-300 shadow-sm hover:shadow-lg bg-surface-card"
                    >
                        {/* Image Container */}
                        <div className="relative w-full flex-1 overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                                style={{ backgroundImage: `url(${category.image})` }}
                            />
                        </div>

                        {/* Text Container Below Image */}
                        <div className="w-full p-4 bg-surface-card flex flex-col items-start border-t border-surface-border">
                            <span className="text-base font-bold truncate w-full text-left text-content-primary group-hover:text-brand-blue transition-colors">
                                {category.name}
                            </span>
                            <span className="text-xs text-content-secondary mt-1 font-medium">12 Recipes</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
