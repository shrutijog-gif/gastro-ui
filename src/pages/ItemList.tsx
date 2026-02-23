import React, { useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Search, Clock, Flame } from 'lucide-react';
import { categories, recipes } from '../data/mockData';

const ItemList: React.FC = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams<{ categoryId: string }>();
    const [searchTerm, setSearchTerm] = useState('');
    const { isSidebarOpen } = useOutletContext<{ isSidebarOpen: boolean }>();

    const activeCategory = categories.find(c => c.id === categoryId);
    const categoryRecipes = recipes.filter(r =>
        r.categoryId === categoryId &&
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {/* Edge-to-Edge Category Strip */}
            <div className={`absolute top-0 left-0 right-0 bg-white border-b border-surface-border z-10 transition-all duration-300 ${isSidebarOpen ? 'px-10' : 'px-6'}`}>
                <div className="flex overflow-x-auto gap-2 py-3 no-scrollbar w-full">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => navigate(`/items/${cat.id}`)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap border ${cat.id === categoryId
                                ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                                : 'bg-surface-background text-content-secondary border-surface-border hover:border-brand-blue/40'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Header & Controls */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${isSidebarOpen ? 'mt-16 mb-6' : 'mt-14 px-6 pt-6 mb-6'}`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/categories')}
                        className="p-2 rounded-lg text-content-muted hover:bg-surface-card hover:text-content-primary transition-colors border border-transparent hover:border-surface-border"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-content-primary tracking-tight">{activeCategory?.name || 'Items'}</h1>
                </div>

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-brand border border-surface-border bg-surface-background focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Items Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300 ${isSidebarOpen ? '' : 'px-6 pb-6'}`}>
                {categoryRecipes.length > 0 ? (
                    categoryRecipes.map((recipe) => (
                        <button
                            key={recipe.id}
                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                            className="group bg-surface-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-surface-border text-left flex flex-col h-full hover:border-brand-blue/30 w-full"
                        >
                            <div className="relative h-44 w-full overflow-hidden bg-surface-background border-b border-surface-border">
                                <div
                                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                    style={{ backgroundImage: `url(${recipe.image})` }}
                                />
                            </div>

                            <div className="p-4 flex-1 flex flex-col w-full">
                                <h3 className="text-base font-bold text-content-primary mb-1 group-hover:text-brand-blue transition-colors line-clamp-2">
                                    {recipe.name}
                                </h3>
                                <p className="text-xs text-content-secondary line-clamp-1 mb-3">
                                    Classic preparation style
                                </p>

                                <div className="mt-auto flex items-center gap-4 text-xs text-content-muted font-medium">
                                    <div className="flex items-center gap-1.5 px-1 py-1">
                                        <span className="font-semibold text-content-muted/60">{recipe.serialNumber || recipe.id}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-surface-background px-2 py-1 rounded border border-surface-border">
                                        <Clock size={12} className="text-brand-blue" />
                                        {recipe.prepTime}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-surface-background px-2 py-1 rounded border border-surface-border">
                                        <Flame size={12} className="text-orange-500" />
                                        {recipe.calories}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-surface-card rounded-xl border border-dashed border-surface-border text-content-muted">
                        <Search size={40} className="mb-3 opacity-20" />
                        <p className="text-sm font-medium">No recipes found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemList;
