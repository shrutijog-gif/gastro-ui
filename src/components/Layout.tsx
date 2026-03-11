import React, { useMemo, useState } from 'react';
import { Outlet, useLocation, Link, NavLink } from 'react-router-dom';
import { LayoutGrid, CheckSquare, Bell, ChevronRight, FileText, Home as HomeIcon, BookOpen, Maximize2, Minimize2 } from 'lucide-react';
import { categories, recipes } from '../data/mockData';

const Layout: React.FC = () => {
    const location = useLocation();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [customBreadcrumbs, setCustomBreadcrumbs] = useState<React.ReactNode | null>(null);

    // Generate breadcrumbs based on current route
    const breadcrumbs = useMemo(() => {
        const paths = location.pathname.split('/').filter(Boolean);
        let crumbs = [{ label: 'App', path: '/' }]; // Base

        if (paths[0] === 'dashboard') {
            crumbs = [{ label: 'Dashboard', path: '/dashboard' }];
        } else if (paths[0] === 'home') {
            crumbs = [{ label: 'Recipe Book', path: '/home' }];
        } else if (paths[0] === 'categories') {
            crumbs.push({ label: 'Categories', path: '/categories' });
        } else if (paths[0] === 'items' && paths[1]) {
            const category = categories.find(c => c.id === paths[1]);
            if (category) {
                crumbs.push({ label: category.name, path: `/items/${category.id}` });
            }
        } else if (paths[0] === 'recipe' && paths[1]) {
            const recipe = recipes.find(r => r.id === paths[1]);
            if (recipe) {
                // Try to find the category to build full path Recipe Book > Category > Recipe
                const category = categories.find(c => c.id === recipe.categoryId);
                if (category) {
                    crumbs.push({ label: category.name, path: `/items/${category.id}` });
                }
                crumbs.push({ label: recipe.name, path: location.pathname });
            }
        }

        return crumbs;
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-surface-background text-content-primary font-sans flex flex-col">
            {/* Top Navigation (Header) */}
            <header className="h-[64px] bg-white border-b border-surface-border flex items-center justify-between px-6 z-20 shrink-0">
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    <button className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-content-muted hover:bg-surface-background transition-colors mr-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <FileText size={18} className="text-content-secondary shrink-0" />
                    <div className="flex items-center text-sm font-semibold text-content-primary whitespace-nowrap overflow-x-auto custom-scrollbar pb-1 -mb-1">
                        {customBreadcrumbs ? customBreadcrumbs : breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.path}>
                                {index > 0 && <ChevronRight size={16} className="mx-2 text-content-muted shrink-0" />}
                                <Link
                                    to={crumb.path}
                                    className={`hover:text-brand-blue transition-colors ${index === breadcrumbs.length - 1 ? 'text-content-primary' : 'text-content-muted'}`}
                                >
                                    {crumb.label}
                                </Link>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Right Utilities */}
                <div className="flex items-center justify-end gap-3 w-1/3 shrink-0">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-8 h-8 rounded text-content-muted hover:bg-surface-background flex items-center justify-center transition-colors"
                            title={isSidebarOpen ? "Enter Fullscreen (Hide Sidebar)" : "Exit Fullscreen (Show Sidebar)"}
                        >
                            {isSidebarOpen ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                        </button>

                        <button className="w-8 h-8 rounded bg-blue-50 text-brand-blue flex items-center justify-center hover:bg-blue-100 transition-colors">
                            <CheckSquare size={16} fill="currentColor" className="text-brand-blue" />
                        </button>
                        <button className="w-8 h-8 rounded relative text-content-muted hover:bg-surface-background transition-colors flex items-center justify-center">
                            <Bell size={18} />
                            {/* Notification Badge */}
                            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                99+
                            </span>
                        </button>
                        <button className="w-8 h-8 rounded flex items-center justify-center text-content-muted hover:bg-surface-background transition-colors bg-purple-50">
                            <LayoutGrid size={16} className="text-purple-600" />
                        </button>
                    </div>
                    <div className="h-6 w-px bg-surface-border mx-2"></div>
                    <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-xs flex items-center justify-center cursor-pointer">
                        SA
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Side Navigation */}
                {isSidebarOpen && (
                    <aside className="w-[72px] bg-surface-card border-r border-surface-border flex flex-col items-center py-6 shrink-0 z-10 transition-all duration-300">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => `w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isActive ? 'bg-brand-light text-brand-blue' : 'text-content-muted hover:bg-surface-background'}`}
                        >
                            <LayoutGrid size={24} />
                        </NavLink>
                        <NavLink
                            to="/home"
                            className={({ isActive }) => `w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isActive ? 'bg-brand-light text-brand-blue' : 'text-content-muted hover:bg-surface-background'}`}
                        >
                            <HomeIcon size={24} />
                        </NavLink>
                        <NavLink
                            to="/categories"
                            className={({ isActive }) => `w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isActive ? 'bg-brand-light text-brand-blue' : 'text-content-muted hover:bg-surface-background'}`}
                        >
                            <BookOpen size={24} />
                        </NavLink>
                    </aside>
                )}

                {/* Main Content */}
                <main className={`flex-1 overflow-y-auto relative transition-all duration-300 p-[40px]`}>
                    <div className="w-full h-full space-y-6">
                        <Outlet context={{ isSidebarOpen, setCustomBreadcrumbs }} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
