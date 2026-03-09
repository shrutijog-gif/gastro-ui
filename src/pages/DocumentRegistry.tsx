import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Search,
    Filter,
    Grid2x2,
    List,
    FileText,
    ChevronRight,
    FolderTree,
    Files
} from 'lucide-react';
import {
    departments,
    brands,
    documentTypes,
    documents
} from '../data/documentRegistryData';

const RealisticFolderIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg viewBox="0 0 120 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 20C14 15.5817 17.5817 12 22 12H44C46.5 12 48.5 13.5 50 16L56 26H104C108.418 26 112 29.5817 112 34V82C112 86.4183 108.418 90 104 90H22C17.5817 90 14 86.4183 14 82V20Z" fill="#F0A710" />
        <defs>
            <linearGradient id="frontGradient" x1="60" y1="30" x2="60" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F8D56A" />
                <stop offset="100%" stopColor="#F2BC2A" />
            </linearGradient>
        </defs>
        <path d="M12 38C12 33.5817 15.5817 30 20 30H106C110.418 30 114 33.5817 114 38V82C114 86.4183 110.418 90 106 90H20C15.5817 90 12 86.4183 12 82V38Z" fill="url(#frontGradient)" />
        <path d="M12 38C12 33.5817 15.5817 30 20 30H106C110.418 30 114 33.5817 114 38V40C114 35.5817 110.418 32 106 32H20C15.5817 32 12 35.5817 12 40V38Z" fill="#FFF2AD" />
    </svg>
);

const DocumentRegistry: React.FC = () => {
    const { setCustomBreadcrumbs } = useOutletContext<{ setCustomBreadcrumbs: React.Dispatch<React.SetStateAction<React.ReactNode>> }>();

    // Navigation state
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // All Documents View State
    const [isAllDocsView, setIsAllDocsView] = useState(false);
    const [filterDepartment, setFilterDepartment] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterDocType, setFilterDocType] = useState<string>('all');

    // Derived current navigation items
    const selectedDepartment = useMemo(() => departments.find(d => d.id === selectedDepartmentId), [selectedDepartmentId]);
    const selectedBrand = useMemo(() => brands.find(b => b.id === selectedBrandId), [selectedBrandId]);
    const selectedDocumentType = useMemo(() => documentTypes.find(dt => dt.id === selectedDocumentTypeId), [selectedDocumentTypeId]);

    // Data to render based on current level
    const visibleDepartments = departments;
    const visibleBrands = useMemo(() => brands.filter(b => b.departmentId === selectedDepartmentId), [selectedDepartmentId]);
    const visibleDocumentTypes = useMemo(() => documentTypes.filter(dt => dt.brandId === selectedBrandId), [selectedBrandId]);
    const visibleDocuments = useMemo(() => documents.filter(doc => doc.documentTypeId === selectedDocumentTypeId), [selectedDocumentTypeId]);

    // Unique filter options for All Documents
    const uniqueDepartments = useMemo(() => Array.from(new Set(documents.map(d => d.department))), []);
    const uniqueCategories = useMemo(() => {
        let docsForCats = documents;
        if (filterDepartment !== 'all') docsForCats = docsForCats.filter(d => d.department === filterDepartment);
        return Array.from(new Set(docsForCats.map(d => d.category)));
    }, [filterDepartment]);
    const uniqueDocTypes = useMemo(() => {
        let docsForTypes = documents;
        if (filterDepartment !== 'all') docsForTypes = docsForTypes.filter(d => d.department === filterDepartment);
        if (filterCategory !== 'all') docsForTypes = docsForTypes.filter(d => d.category === filterCategory);
        return Array.from(new Set(docsForTypes.map(d => d.type)));
    }, [filterDepartment, filterCategory]);

    // Filtered All Documents
    const filteredAllDocs = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = searchQuery ?
                doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.id.toLowerCase().includes(searchQuery.toLowerCase()) : true;

            const matchesDept = filterDepartment === 'all' ? true : doc.department === filterDepartment;
            const matchesCat = filterCategory === 'all' ? true : doc.category === filterCategory;
            const matchesType = filterDocType === 'all' ? true : doc.type === filterDocType;

            return matchesSearch && matchesDept && matchesCat && matchesType;
        });
    }, [searchQuery, filterDepartment, filterCategory, filterDocType]);

    useEffect(() => {
        if (isAllDocsView) {
            const crumbs = (
                <>
                    <div className="flex items-center text-content-secondary cursor-pointer hover:text-brand-blue" onClick={() => setIsAllDocsView(false)}>
                        Document Registry
                    </div>
                    <ChevronRight size={16} className="mx-2 text-content-muted shrink-0" />
                    <div className="text-brand-blue font-bold">
                        All Documents
                    </div>
                </>
            );
            setCustomBreadcrumbs(crumbs);
            return () => setCustomBreadcrumbs(null);
        }

        const crumbs = (
            <>
                <div className="flex items-center text-content-secondary cursor-pointer hover:text-brand-blue" onClick={() => {
                    setSelectedDepartmentId(null);
                    setSelectedBrandId(null);
                    setSelectedDocumentTypeId(null);
                }}>
                    Document Registry
                </div>

                <ChevronRight size={16} className="mx-2 text-content-muted shrink-0" />

                <div className={`cursor-pointer hover:text-brand-blue transition-colors ${!selectedDepartmentId ? 'text-brand-blue font-bold' : 'text-content-secondary'}`}
                    onClick={() => {
                        setSelectedDepartmentId(null);
                        setSelectedBrandId(null);
                        setSelectedDocumentTypeId(null);
                    }}>
                    Registry
                </div>

                {selectedDepartment && (
                    <>
                        <ChevronRight size={16} className="mx-2 text-content-muted shrink-0" />
                        <div className={`cursor-pointer hover:text-brand-blue transition-colors ${!selectedBrandId ? 'text-brand-blue font-bold' : 'text-content-secondary'}`}
                            onClick={() => {
                                setSelectedBrandId(null);
                                setSelectedDocumentTypeId(null);
                            }}>
                            {selectedDepartment.name}
                        </div>
                    </>
                )}

                {selectedBrand && (
                    <>
                        <ChevronRight size={16} className="mx-2 text-content-muted shrink-0" />
                        <div className={`cursor-pointer hover:text-brand-blue transition-colors ${!selectedDocumentTypeId ? 'text-brand-blue font-bold' : 'text-content-secondary'}`}
                            onClick={() => {
                                setSelectedDocumentTypeId(null);
                            }}>
                            {selectedBrand.name}
                        </div>
                    </>
                )}

                {selectedDocumentType && (
                    <>
                        <ChevronRight size={16} className="mx-2 text-content-muted shrink-0" />
                        <div className="text-brand-blue font-bold">
                            {selectedDocumentType.name}
                        </div>
                    </>
                )}
            </>
        );
        setCustomBreadcrumbs(crumbs);
        return () => setCustomBreadcrumbs(null);
    }, [selectedDepartmentId, selectedBrandId, selectedDocumentTypeId, selectedDepartment, selectedBrand, selectedDocumentType, isAllDocsView, setCustomBreadcrumbs]);

    // Render folder cards
    const renderFolder = (title: string, count: number, onClick: () => void) => {
        return (
            <div
                className="group cursor-pointer flex flex-col items-center justify-start gap-1 transition-transform duration-300 hover:-translate-y-1 relative"
                onClick={onClick}
            >
                <div className="relative">
                    <RealisticFolderIcon className="w-24 h-24 drop-shadow-sm group-hover:drop-shadow-md" />
                    <div className="absolute inset-0 flex items-center justify-center pt-5 pointer-events-none">
                        <span className="text-xs font-bold text-amber-800 group-hover:text-amber-900 transition-colors">
                            {count === 0 ? '-' : count}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center px-1 -mt-2">
                    <h3 className="text-sm font-medium text-slate-700 group-hover:text-brand-blue transition-colors truncate max-w-[100px] text-center" title={title}>
                        {title}
                    </h3>
                </div>
            </div>
        );
    };

    const renderFolderList = (items: any[], typeName: string, onClick: (id: string) => void, getCount: (id: string) => number) => (
        <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-surface-border bg-slate-50/50">
                            <th className="py-4 pl-6 pr-2 text-xs font-semibold text-content-secondary uppercase tracking-wider w-12 text-center"></th>
                            <th className="py-4 pl-0 pr-6 text-xs font-semibold text-content-secondary uppercase tracking-wider">Name</th>
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider">Type</th>
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider text-right">Items</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                        {items.map((item) => {
                            const count = getCount(item.id);
                            return (
                                <tr key={item.id} onClick={() => onClick(item.id)} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <td className="py-3 pl-6 pr-2">
                                        <div className="flex justify-center">
                                            <RealisticFolderIcon className="w-8 h-8 drop-shadow-sm" />
                                        </div>
                                    </td>
                                    <td className="py-4 pl-0 pr-6">
                                        <div className="font-bold text-sm text-content-primary group-hover:text-brand-blue transition-colors">{item.name}</div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-content-secondary">
                                        {typeName}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-content-secondary text-right">
                                        {count} document(s)
                                    </td>
                                </tr>
                            );
                        })}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-content-muted">
                                    No {typeName.toLowerCase()}s found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDocumentGrid = (docs: typeof documents) => (
        <div className="flex flex-wrap gap-6 p-4 pt-0">
            {docs.map(doc => (
                <div key={doc.id} className="bg-surface-card border border-surface-border rounded-2xl p-5 w-[280px] shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between">
                            <div className="p-2 bg-brand-blue/10 rounded-xl text-brand-blue">
                                <FileText size={20} />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-content-secondary rounded-lg">{doc.version}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-content-primary group-hover:text-brand-blue transition-colors leading-tight line-clamp-2" title={doc.title}>{doc.title}</h3>
                        <p className="text-xs text-content-muted mt-1.5 line-clamp-2">{doc.description}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-surface-border flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-content-secondary font-medium">{doc.department}</span>
                            <span className="text-xs text-content-muted">{doc.date}</span>
                        </div>
                        <div className="text-[10px] items-center flex justify-between tracking-wider font-semibold w-full">
                            <span className="text-content-muted uppercase truncate mr-2" title={doc.category}>{doc.category}</span>
                            <span className="text-brand-blue px-2 py-0.5 bg-brand-blue/10 rounded font-medium shrink-0 max-w-[50%] truncate ml-auto" title={doc.type}>{doc.type}</span>
                        </div>
                    </div>
                </div>
            ))}
            {docs.length === 0 && (
                <div className="w-full py-12 text-center text-content-muted">
                    No documents found.
                </div>
            )}
        </div>
    );

    const renderDocumentTable = (docs: typeof documents) => (
        <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden shadow-sm m-4 mt-0">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-surface-border bg-slate-50/50">
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider">ID & Version</th>
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider">Date</th>
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider">Title & Description</th>
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider">Category & Type</th>
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider">Department</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                        {docs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                <td className="py-4 px-6">
                                    <div className="font-bold text-sm text-content-primary">{doc.id}</div>
                                    <div className="text-xs text-content-muted mt-0.5">{doc.version}</div>
                                </td>
                                <td className="py-4 px-6 text-sm text-content-secondary">
                                    {doc.date}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-start gap-2">
                                        <FileText size={16} className="text-brand-blue mt-0.5 shrink-0" />
                                        <div>
                                            <div className="font-bold text-sm text-content-primary group-hover:text-brand-blue transition-colors">{doc.title}</div>
                                            <div className="text-xs text-content-muted mt-0.5">{doc.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="font-medium text-sm text-content-primary">{doc.category}</div>
                                    <div className="text-xs text-content-muted mt-0.5">{doc.type}</div>
                                </td>
                                <td className="py-4 px-6 text-sm text-content-secondary">
                                    {doc.department}
                                </td>
                            </tr>
                        ))}
                        {docs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-content-muted">
                                    No documents found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Render logic to determine what is currently visible
    const renderContent = () => {
        if (isAllDocsView) {
            return viewMode === 'list' ? renderDocumentTable(filteredAllDocs) : renderDocumentGrid(filteredAllDocs);
        } else if (selectedDocumentTypeId) {
            // Render Document List (Table)
            return viewMode === 'list' ? renderDocumentTable(visibleDocuments) : renderDocumentGrid(visibleDocuments);
        } else if (selectedBrandId) {
            // Render Document Types Folder view
            return viewMode === 'list' ? renderFolderList(visibleDocumentTypes, "Document Type", setSelectedDocumentTypeId, (id) => documents.filter(d => d.documentTypeId === id).length) : (
                <div className="flex flex-wrap gap-8 p-4">
                    {visibleDocumentTypes.map(dt => renderFolder(dt.name, documents.filter(d => d.documentTypeId === dt.id).length, () => setSelectedDocumentTypeId(dt.id)))}
                    {visibleDocumentTypes.length === 0 && (
                        <div className="w-full py-12 text-center text-content-muted">No document types found.</div>
                    )}
                </div>
            );
        } else if (selectedDepartmentId) {
            // Render Brands Folder view
            return viewMode === 'list' ? renderFolderList(visibleBrands, "Brand", setSelectedBrandId, (id) => documentTypes.filter(dt => dt.brandId === id).reduce((acc, dt) => acc + documents.filter(d => d.documentTypeId === dt.id).length, 0)) : (
                <div className="flex flex-wrap gap-8 p-4">
                    {visibleBrands.map(b => {
                        const count = documentTypes.filter(dt => dt.brandId === b.id).reduce((acc, dt) => acc + documents.filter(d => d.documentTypeId === dt.id).length, 0);
                        return renderFolder(b.name, count, () => setSelectedBrandId(b.id));
                    })}
                    {visibleBrands.length === 0 && (
                        <div className="w-full py-12 text-center text-content-muted">No brands found.</div>
                    )}
                </div>
            );
        } else {
            // Render Departments Folder view
            return viewMode === 'list' ? renderFolderList(visibleDepartments, "Department", setSelectedDepartmentId, (id) => brands.filter(b => b.departmentId === id).reduce((acc, b) => acc + documentTypes.filter(dt => dt.brandId === b.id).reduce((acc2, dt) => acc2 + documents.filter(doc => doc.documentTypeId === dt.id).length, 0), 0)) : (
                <div className="flex flex-wrap gap-8 p-4">
                    {visibleDepartments.map(d => {
                        const count = brands.filter(b => b.departmentId === d.id).reduce((acc, b) => acc + documentTypes.filter(dt => dt.brandId === b.id).reduce((acc2, dt) => acc2 + documents.filter(doc => doc.documentTypeId === dt.id).length, 0), 0);
                        return renderFolder(d.name, count, () => setSelectedDepartmentId(d.id));
                    })}
                </div>
            );
        }
    };

    return (
        <div className="w-full h-full flex flex-col pt-[60px]">
            {/* Full-width Options Bar */}
            <div className="absolute top-0 left-0 right-0 h-[60px] bg-white border-b border-surface-border px-[40px] flex items-center justify-between z-10 transition-all duration-300">
                <div className="flex items-center gap-4 flex-1">
                    {/* View Toggle */}
                    <div className="flex bg-surface-background border border-surface-border rounded-xl p-0.5 shadow-sm shrink-0 mr-2">
                        <button
                            onClick={() => setIsAllDocsView(false)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!isAllDocsView ? 'bg-white text-brand-blue shadow-sm border border-surface-border/50' : 'text-content-muted hover:text-content-secondary'}`}
                        >
                            <FolderTree size={16} /> Folder View
                        </button>
                        <button
                            onClick={() => setIsAllDocsView(true)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isAllDocsView ? 'bg-white text-brand-blue shadow-sm border border-surface-border/50' : 'text-content-muted hover:text-content-secondary'}`}
                        >
                            <Files size={16} /> All Documents
                        </button>
                    </div>

                    <div className="relative w-full max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-1.5 border border-surface-border rounded-xl text-sm leading-5 bg-surface-background text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                            placeholder={isAllDocsView ? `Search in ${filteredAllDocs.length} Documents` : `Search in ${selectedDocumentTypeId ? visibleDocuments.length + ' Documents' : 'Folders'}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {isAllDocsView && (
                        <div className="flex items-center gap-3 animate-fade-in pl-2 border-l border-surface-border">
                            <select
                                className="block w-40 pl-3 py-1.5 border border-surface-border rounded-xl text-sm bg-surface-background focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-content-primary"
                                value={filterDepartment}
                                onChange={(e) => {
                                    setFilterDepartment(e.target.value);
                                    setFilterCategory('all');
                                    setFilterDocType('all');
                                }}
                            >
                                <option value="all">All Departments</option>
                                {uniqueDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>

                            <select
                                className="block w-36 pl-3 py-1.5 border border-surface-border rounded-xl text-sm bg-surface-background focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-content-primary"
                                value={filterCategory}
                                onChange={(e) => {
                                    setFilterCategory(e.target.value);
                                    setFilterDocType('all');
                                }}
                            >
                                <option value="all">All Categories</option>
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <select
                                className="block w-44 pl-3 py-1.5 border border-surface-border rounded-xl text-sm bg-surface-background focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all text-content-primary"
                                value={filterDocType}
                                onChange={(e) => setFilterDocType(e.target.value)}
                            >
                                <option value="all">All Document Types</option>
                                {uniqueDocTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-3 py-2 border border-surface-border rounded-xl transition-colors text-sm font-medium ${isFilterOpen ? 'bg-slate-50 text-brand-blue border-brand-blue/30' : 'bg-white hover:bg-slate-50 text-content-secondary'}`}
                        >
                            <Filter size={16} /> Filters
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-surface-border rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 p-4 animate-fade-in-up">
                                {isAllDocsView || selectedDocumentTypeId ? (
                                    <>
                                        <h4 className="text-[10px] font-bold text-content-muted uppercase tracking-wider mb-2">Sort Documents</h4>
                                        <div className="space-y-1 mb-4">
                                            <button className="w-full text-left px-3 py-2 text-sm text-content-primary hover:bg-surface-background rounded-lg transition-colors">
                                                Alphabetical (A-Z)
                                            </button>
                                            <button className="w-full text-left px-3 py-2 text-sm text-content-primary hover:bg-surface-background rounded-lg transition-colors">
                                                Alphabetical (Z-A)
                                            </button>
                                            <button className="w-full text-left px-3 py-2 text-sm text-content-primary hover:bg-surface-background rounded-lg transition-colors">
                                                By Date (Newest)
                                            </button>
                                            <button className="w-full text-left px-3 py-2 text-sm text-content-primary hover:bg-surface-background rounded-lg transition-colors">
                                                By Date (Oldest)
                                            </button>
                                        </div>
                                        <h4 className="text-[10px] font-bold text-content-muted uppercase tracking-wider mb-2">Filter Documents</h4>
                                        <div className="space-y-1">
                                            <label className="flex items-center gap-3 text-sm text-content-primary p-2 hover:bg-surface-background rounded-lg cursor-pointer transition-colors">
                                                <input type="checkbox" className="rounded border-surface-border text-brand-blue focus:ring-brand-blue" />
                                                <span className="flex-1">Last 30 Days</span>
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="text-[10px] font-bold text-content-muted uppercase tracking-wider mb-2">Sort Folders</h4>
                                        <div className="space-y-1 mb-4">
                                            <button className="w-full text-left px-3 py-2 text-sm text-content-primary hover:bg-surface-background rounded-lg transition-colors">
                                                Alphabetical (A-Z)
                                            </button>
                                            <button className="w-full text-left px-3 py-2 text-sm text-content-primary hover:bg-surface-background rounded-lg transition-colors">
                                                Alphabetical (Z-A)
                                            </button>
                                        </div>
                                        <h4 className="text-[10px] font-bold text-content-muted uppercase tracking-wider mb-2">Filter Folders</h4>
                                        <div className="space-y-1">
                                            <label className="flex items-center gap-3 text-sm text-content-primary p-2 hover:bg-surface-background rounded-lg cursor-pointer transition-colors">
                                                <input type="checkbox" className="rounded border-surface-border text-brand-blue focus:ring-brand-blue" />
                                                <span className="flex-1">Hide Empty Folders</span>
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Always show grid/list toggle since either folders or documents support it */}
                    <div className="flex bg-surface-background border border-surface-border rounded-xl p-0.5 shadow-sm shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-brand-blue shadow-sm border border-surface-border/50' : 'text-content-muted hover:text-content-secondary'}`}
                        >
                            <Grid2x2 size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-brand-blue shadow-sm border border-surface-border/50' : 'text-content-muted hover:text-content-secondary'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="animate-fade-in mt-4 border-t border-transparent pt-2">
                {renderContent()}
            </div>

            {/* Table pagination placeholder (if showing documents) */}
            {(isAllDocsView ? filteredAllDocs.length > 0 : selectedDocumentTypeId && visibleDocuments.length > 0) && (
                <div className="flex items-center justify-end mt-2 text-sm text-content-secondary gap-4 pr-4 pb-4">
                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select className="bg-transparent border-none outline-none font-medium cursor-pointer">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                    <div>
                        1-{isAllDocsView ? filteredAllDocs.length : visibleDocuments.length} of {isAllDocsView ? filteredAllDocs.length : visibleDocuments.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1 text-content-muted hover:text-content-primary transition-colors disabled:opacity-50" disabled><ChevronRight size={16} className="rotate-180" /></button>
                        <button className="p-1 text-content-muted hover:text-content-primary transition-colors disabled:opacity-50" disabled><ChevronRight size={16} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentRegistry;
