import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Search,
    Filter,
    Grid2x2,
    List,
    Folder,
    FileText,
    ChevronRight
} from 'lucide-react';
import {
    departments,
    brands,
    documentTypes,
    documents
} from '../data/documentRegistryData';

const DocumentRegistry: React.FC = () => {
    const { setCustomBreadcrumbs } = useOutletContext<{ setCustomBreadcrumbs: React.Dispatch<React.SetStateAction<React.ReactNode>> }>();

    // Navigation state
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Derived current navigation items
    const selectedDepartment = useMemo(() => departments.find(d => d.id === selectedDepartmentId), [selectedDepartmentId]);
    const selectedBrand = useMemo(() => brands.find(b => b.id === selectedBrandId), [selectedBrandId]);
    const selectedDocumentType = useMemo(() => documentTypes.find(dt => dt.id === selectedDocumentTypeId), [selectedDocumentTypeId]);

    // Data to render based on current level
    const visibleDepartments = departments;
    const visibleBrands = useMemo(() => brands.filter(b => b.departmentId === selectedDepartmentId), [selectedDepartmentId]);
    const visibleDocumentTypes = useMemo(() => documentTypes.filter(dt => dt.brandId === selectedBrandId), [selectedBrandId]);
    const visibleDocuments = useMemo(() => documents.filter(doc => doc.documentTypeId === selectedDocumentTypeId), [selectedDocumentTypeId]);

    useEffect(() => {
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
    }, [selectedDepartmentId, selectedBrandId, selectedDocumentTypeId, selectedDepartment, selectedBrand, selectedDocumentType, setCustomBreadcrumbs]);

    // Render folder cards
    const renderFolder = (title: string, subtitle: string, onClick: () => void) => (
        <div
            className="group bg-surface-card rounded-2xl p-5 border border-surface-border shadow-sm hover:shadow-md hover:border-brand-blue/30 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 hover:-translate-y-1 relative overflow-hidden"
            onClick={onClick}
        >
            <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                <Folder size={32} strokeWidth={1.5} />
            </div>
            <div className="text-center">
                <h3 className="font-bold text-content-primary group-hover:text-brand-blue transition-colors">{title}</h3>
                <p className="text-xs text-content-muted mt-1">{subtitle}</p>
            </div>
        </div>
    );

    const renderFolderList = (items: any[], typeName: string, onClick: (id: string) => void) => (
        <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-surface-border bg-slate-50/50">
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider w-16 text-center"></th>
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider">Name</th>
                            <th className="py-4 px-6 text-xs font-semibold text-content-secondary uppercase tracking-wider">Type</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                        {items.map((item) => (
                            <tr key={item.id} onClick={() => onClick(item.id)} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                <td className="py-4 px-6 text-brand-blue">
                                    <div className="flex justify-center">
                                        <Folder size={20} />
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="font-bold text-sm text-content-primary group-hover:text-brand-blue transition-colors">{item.name}</div>
                                </td>
                                <td className="py-4 px-6 text-sm text-content-secondary">
                                    {typeName}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-12 text-center text-content-muted">
                                    No {typeName.toLowerCase()}s found.
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
        if (selectedDocumentTypeId) {
            // Render Document List (Table)
            return (
                <div className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden shadow-sm">
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
                                {visibleDocuments.map((doc) => (
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
                                {visibleDocuments.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-content-muted">
                                            No documents found in this document type.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        } else if (selectedBrandId) {
            // Render Document Types Folder view
            return viewMode === 'list' ? renderFolderList(visibleDocumentTypes, "Document Type", setSelectedDocumentTypeId) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {visibleDocumentTypes.map(dt => renderFolder(dt.name, "Document Type", () => setSelectedDocumentTypeId(dt.id)))}
                    {visibleDocumentTypes.length === 0 && (
                        <div className="col-span-full py-12 text-center text-content-muted">No document types found.</div>
                    )}
                </div>
            );
        } else if (selectedDepartmentId) {
            // Render Brands Folder view
            return viewMode === 'list' ? renderFolderList(visibleBrands, "Brand", setSelectedBrandId) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {visibleBrands.map(b => renderFolder(b.name, "Brand", () => setSelectedBrandId(b.id)))}
                    {visibleBrands.length === 0 && (
                        <div className="col-span-full py-12 text-center text-content-muted">No brands found.</div>
                    )}
                </div>
            );
        } else {
            // Render Departments Folder view
            return viewMode === 'list' ? renderFolderList(visibleDepartments, "Department", setSelectedDepartmentId) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {visibleDepartments.map(d => renderFolder(d.name, "Department", () => setSelectedDepartmentId(d.id)))}
                </div>
            );
        }
    };

    return (
        <div className="w-full h-full flex flex-col pt-[60px]">
            {/* Full-width Options Bar */}
            <div className="absolute top-0 left-0 right-0 h-[60px] bg-white border-b border-surface-border px-[40px] flex items-center justify-between z-10 transition-all duration-300">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-full max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-1.5 border border-surface-border rounded-xl text-sm leading-5 bg-surface-background text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                            placeholder={`Search in ${selectedDocumentTypeId ? visibleDocuments.length + ' Documents' : 'Folders'}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
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
                                {selectedDocumentTypeId ? (
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
            <div className="animate-fade-in mt-2">
                {renderContent()}
            </div>

            {/* Table pagination placeholder (if showing documents) */}
            {selectedDocumentTypeId && visibleDocuments.length > 0 && (
                <div className="flex items-center justify-end mt-4 text-sm text-content-secondary gap-4 pr-4">
                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select className="bg-transparent border-none outline-none font-medium cursor-pointer">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                    <div>
                        1-{visibleDocuments.length} of {visibleDocuments.length}
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
