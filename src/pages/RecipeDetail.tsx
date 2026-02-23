import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Users, ChefHat, AlertTriangle, X, Link as LinkIcon } from 'lucide-react';
import { recipes, categories } from '../data/mockData';
import type { Recipe, Ingredient } from '../data/mockData';

// Helper to auto-link ingredient names in instruction text
const renderInstructionText = (text: string, ingredients: Ingredient[], onIngredientClick: (id: string) => void) => {
    let result: (string | React.ReactNode)[] = [text];

    ingredients.forEach(ing => {
        if (!ing.linkedRecipeId) return;

        // Escape regex characters
        const escapedName = ing.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedName})`, 'gi');

        result = result.flatMap((part, index) => {
            if (typeof part !== 'string') return [part];

            const pieces = part.split(regex);
            return pieces.map((piece, i) => {
                if (i % 2 === 1) {
                    return (
                        <span
                            key={`${ing.linkedRecipeId}-${index}-${i}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onIngredientClick(ing.linkedRecipeId!);
                            }}
                            className="text-brand-blue cursor-pointer hover:underline font-semibold mx-0.5 inline-flex items-center gap-0.5"
                            title={`View ${ing.name} recipe`}
                        >
                            {piece}
                        </span>
                    );
                }
                return piece;
            });
        });
    });

    return result;
};

// --- Sub-component to render the actual recipe content ---
interface RecipeContentProps {
    recipe: Recipe;
    depth: number;
    onClose: () => void;
    onIngredientClick: (linkedId: string) => void;
}

const RecipeContent: React.FC<RecipeContentProps> = ({ recipe, depth, onClose, onIngredientClick }) => {
    return (
        <div className="h-full bg-surface-card flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-5 border-b border-surface-border bg-surface-card z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-surface-background transition-colors text-content-muted hover:text-content-primary border border-transparent hover:border-surface-border"
                    >
                        {depth === 0 ? <ArrowLeft size={24} /> : <X size={24} />}
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-content-primary flex items-center gap-2">
                        {recipe.serialNumber && (
                            <span className="text-sm font-medium text-content-muted/60">
                                {recipe.serialNumber}
                            </span>
                        )}
                        {recipe.name}
                    </h1>
                </div>

                <div className="flex gap-4 text-sm font-medium text-content-secondary">
                    <div className="flex items-center gap-2 bg-surface-background px-3 py-1.5 rounded-lg border border-surface-border">
                        <span className="text-[10px] font-bold text-content-muted uppercase tracking-wider">Yield</span>
                        <span className="text-content-primary">1 Portion</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-surface-background px-3 py-1.5 rounded-lg border border-surface-border">
                        <Clock size={16} className="text-brand-blue" />
                        {recipe.prepTime}
                    </div>
                    <div className="flex items-center gap-1.5 bg-surface-background px-3 py-1.5 rounded-lg border border-surface-border">
                        <Flame size={16} className="text-orange-500" />
                        {recipe.calories}
                    </div>
                </div>
            </header>

            {/* Main Content - 3 Column Layout */}
            <div className="flex-1 grid grid-cols-12 divide-x divide-surface-border overflow-hidden">

                {/* Column 1: Ingredients (3 cols) */}
                <div className="col-span-3 bg-surface-background flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-surface-border bg-surface-card/50">
                        <h2 className="flex items-center gap-2 font-bold text-content-secondary uppercase tracking-wider text-xs">
                            <Users size={14} className="text-content-muted" /> Ingredients ({recipe.ingredients.length})
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <table className="w-full text-sm text-left relative text-content-primary">
                            <thead className="text-[10px] text-content-muted uppercase bg-surface-border/30 rounded-lg">
                                <tr>
                                    <th className="px-3 py-2 rounded-l-md font-semibold font-sans">Item</th>
                                    <th className="px-3 py-2 w-16 text-right font-semibold font-sans">Qty</th>
                                    <th className="px-3 py-2 w-16 text-right rounded-r-md font-semibold font-sans">UoM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-border/50">
                                {recipe.ingredients.map((ing, idx) => {
                                    const isClickable = !!ing.linkedRecipeId;
                                    // Split netQty (e.g. "150g" -> "150", "g")
                                    const qtyMatch = ing.netQty.match(/^([\d.]+)\s*([a-zA-Z]+)?$/);
                                    const qty = qtyMatch ? qtyMatch[1] : ing.netQty;
                                    const uom = qtyMatch ? (qtyMatch[2] || '') : '';

                                    return (
                                        <tr
                                            key={idx}
                                            className={`transition-colors ${isClickable ? 'hover:bg-brand-light/40 cursor-pointer group' : 'hover:bg-surface-card'}`}
                                            onClick={() => isClickable && onIngredientClick(ing.linkedRecipeId!)}
                                        >
                                            <td className="px-3 py-3">
                                                <div className={`font-semibold flex items-center gap-1.5 ${isClickable ? 'text-brand-blue group-hover:underline' : 'text-content-primary'}`}>
                                                    {ing.name}
                                                    {isClickable && <LinkIcon size={12} className="opacity-50" />}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-right font-mono text-xs font-medium text-content-primary">
                                                {qty}
                                            </td>
                                            <td className="px-3 py-3 text-right font-mono text-xs font-medium text-content-secondary">
                                                {uom}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Removed Yield Block */}
                    </div>
                </div>

                {/* Column 2: Preparation (5 cols) */}
                <div className="col-span-6 flex flex-col overflow-hidden bg-surface-card">
                    <div className="p-4 border-b border-surface-border bg-surface-card">
                        <h2 className="flex items-center gap-2 font-bold text-content-secondary uppercase tracking-wider text-xs">
                            <ChefHat size={14} className="text-content-muted" /> Preparation Method
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
                        <div className="space-y-6">
                            {recipe.instructions.map((inst) => (
                                <div key={inst.step} className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-background border border-surface-border text-content-muted font-bold flex items-center justify-center group-hover:bg-brand-blue group-hover:border-brand-blue group-hover:text-white transition-all shadow-sm">
                                        {inst.step}
                                    </div>
                                    <div className="pt-1.5 text-sm leading-relaxed text-content-secondary group-hover:text-content-primary transition-colors">
                                        {renderInstructionText(inst.text, recipe.ingredients, onIngredientClick)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 3: Visuals & Extras (4 cols) */}
                <div className="col-span-3 flex flex-col bg-surface-background overflow-hidden relative">
                    {/* Top Half: Image */}
                    <div className="h-2/5 min-h-[200px] relative bg-surface-border/20 border-b border-surface-border m-4 rounded-xl overflow-hidden shadow-sm">
                        <div
                            className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700"
                            style={{ backgroundImage: `url(${recipe.image})` }}
                        />
                        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-content-primary px-2.5 py-1 rounded-md text-[10px] font-bold border border-surface-border/50 shadow-sm uppercase">
                            Plating Ref
                        </div>
                    </div>

                    {/* Bottom Half: Details */}
                    <div className="flex-1 px-5 pb-5 overflow-y-auto custom-scrollbar">
                        <h3 className="font-bold text-content-secondary uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                            <AlertTriangle size={14} className="text-orange-500" />
                            Allergens
                        </h3>
                        {recipe.allergens.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {recipe.allergens.map(allergen => (
                                    <span key={allergen} className="px-2.5 py-1 bg-surface-card border border-surface-border rounded-md text-[10px] font-bold tracking-wide text-content-secondary shadow-sm uppercase">
                                        {allergen}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-content-muted mb-6">No known allergens</div>
                        )}

                        <h3 className="font-bold text-content-secondary uppercase tracking-wider text-xs mb-3">
                            Critical Control Points
                        </h3>
                        <div className="space-y-2.5">
                            <div className="p-3 bg-red-50/50 border border-red-100 text-xs text-red-800 rounded-lg shadow-sm">
                                <strong className="text-red-900 drop-shadow-sm">Temp:</strong> Ensure target internal temps to avoid risk.
                            </div>
                            <div className="p-3 bg-orange-50/50 border border-orange-100 text-xs text-orange-800 rounded-lg shadow-sm">
                                <strong className="text-orange-900 drop-shadow-sm">Quality:</strong> Check dates carefully before use.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};


// --- Draggable Sticky Note Component ---
interface DraggableStickyNoteProps {
    recipe: Recipe;
    index: number;
    onClose: () => void;
}

const DraggableStickyNote: React.FC<DraggableStickyNoteProps> = ({ recipe, index, onClose }) => {
    // Initial position based on index to stagger them
    const initialTop = 80 + (index * 30);
    const initialRight = 60 + (index * 40);
    const rotation = index % 2 === 1 ? '-2deg' : '3deg';

    const [position, setPosition] = useState({ x: -initialRight, y: initialTop });
    const [isDragging, setIsDragging] = useState(false);

    // We use a ref to track the drag start offset
    const dragStartRef = React.useRef({ x: 0, y: 0 });

    const handlePointerDown = (e: React.PointerEvent) => {
        // Only drag from the header area
        if ((e.target as HTMLElement).closest('button')) return;

        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        // Calculate new position
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;

        // Optional: you could add boundaries here if you don't want them dragged off screen completely.
        setPosition({ x: newX, y: Math.max(0, newY) }); // Prevent dragging over top nav
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Render into document.body to escape the parent container's overflow-hidden
    return createPortal(
        <div
            className="fixed shadow-2xl border border-amber-200 bg-amber-50 rounded-lg flex flex-col overflow-hidden text-amber-950 animate-fade-in-up transition-shadow"
            style={{
                top: 0,
                right: 0,
                transform: `translate(${position.x}px, ${position.y}px) rotate(${isDragging ? '0deg' : rotation}) scale(${isDragging ? 1.02 : 1})`,
                width: '340px',
                maxHeight: 'calc(100vh - 120px)',
                zIndex: isDragging ? 9999 : 9900 + index,
                cursor: isDragging ? 'grabbing' : 'auto',
                boxShadow: isDragging ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : undefined
            }}
        >
            {/* Sticky Header - This is the drag handle */}
            <div
                className="bg-amber-200 p-3 flex justify-between items-center border-b border-amber-300 cursor-grab active:cursor-grabbing select-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
                    <LinkIcon size={14} className="opacity-60 flex-shrink-0" />
                    <span className="font-bold text-sm truncate">{recipe.name}</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex gap-0.5 opacity-30 mr-2 pointer-events-none">
                        <div className="w-1 h-1 bg-amber-900 rounded-full" />
                        <div className="w-1 h-1 bg-amber-900 rounded-full" />
                        <div className="w-1 h-1 bg-amber-900 rounded-full" />
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="p-1 hover:bg-amber-300 rounded text-amber-800 transition-colors cursor-pointer"
                        title="Close sticky note"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Sticky Content - Scrollable, not draggable */}
            <div className="p-5 overflow-y-auto w-full custom-scrollbar text-sm space-y-6 flex-1">
                <div>
                    <h4 className="font-bold uppercase text-[10px] tracking-wider mb-2 opacity-60 flex items-center gap-1.5 border-b border-amber-200 pb-1">
                        <Users size={12} /> Ingredients
                    </h4>
                    <ul className="space-y-1.5">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex justify-between items-end border-b border-amber-900/10 pb-1">
                                <span className="font-medium">{ing.name}</span>
                                <span className="font-mono text-xs opacity-80">{ing.netQty}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold uppercase text-[10px] tracking-wider mb-2 opacity-60 flex items-center gap-1.5 border-b border-amber-200 pb-1">
                        <ChefHat size={12} /> Prep Steps
                    </h4>
                    <ol className="list-decimal pl-4 space-y-2">
                        {recipe.instructions.map((inst, i) => (
                            <li key={i} className="pl-1 leading-snug">{inst.text}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Main Container Component ---
const RecipeDetail: React.FC = () => {
    const navigate = useNavigate();
    const { recipeId } = useParams<{ recipeId: string }>();
    const { isSidebarOpen } = useOutletContext<{ isSidebarOpen: boolean }>();

    // Manage stack of recipe IDs for overlapping views
    const [recipeStack, setRecipeStack] = useState<string[]>([]);

    // Manage display mode ('stack' for overlapping columns, 'sticky' for floating notes)
    const [displayMode, setDisplayMode] = useState<'stack' | 'sticky'>('stack');

    useEffect(() => {
        if (recipeId) {
            setRecipeStack([recipeId]);
        }
    }, [recipeId]);

    const handleClose = (index: number) => {
        if (index === 0) {
            // Close main view -> go back
            navigate(-1);
        } else {
            // Close an overlaid view -> slice stack
            setRecipeStack(prev => prev.slice(0, index));
        }
    };

    const handleIngredientClick = (linkedId: string) => {
        // Prevent opening if it's already the top of the stack
        if (recipeStack[recipeStack.length - 1] === linkedId) return;
        setRecipeStack(prev => [...prev, linkedId]);
    };

    if (recipeStack.length === 0) {
        return <div className="p-8 text-center text-content-muted animate-pulse">Loading...</div>;
    }

    const baseRecipe = recipes.find(r => r.id === recipeStack[0]);
    const categoryId = baseRecipe?.categoryId;

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {/* Edge-to-Edge Category Strip */}
            <div className={`absolute top-0 left-0 right-0 bg-white border-b border-surface-border z-10 transition-all duration-300 ${isSidebarOpen ? 'px-10' : 'px-4'}`}>
                <div className="flex items-center justify-between w-full h-[52px]">
                    <div className="flex overflow-x-auto gap-2 py-3 no-scrollbar max-w-[70%]">
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

                    {/* Display Mode Toggle */}
                    <div className="flex bg-surface-background border border-surface-border rounded-lg p-0.5 shadow-sm shrink-0">
                        <button
                            onClick={() => setDisplayMode('stack')}
                            className={`px-3 py-1.5 text-xs font-bold transition-colors rounded-md ${displayMode === 'stack' ? 'bg-white text-brand-blue shadow-sm border border-surface-border/50' : 'text-content-secondary hover:text-brand-blue'}`}
                        >
                            Overlay View
                        </button>
                        <button
                            onClick={() => setDisplayMode('sticky')}
                            className={`px-3 py-1.5 text-xs font-bold transition-colors rounded-md ${displayMode === 'sticky' ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-200/50' : 'text-content-secondary hover:text-amber-600'}`}
                        >
                            Sticky Notes
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Recipe Detail Container */}
            <div className={`flex-1 relative overflow-hidden flex bg-surface-background transition-all duration-300 ${isSidebarOpen ? 'mt-14 rounded-xl border border-surface-border shadow-sm' : 'mt-[52px]'}`}>
                {recipeStack.map((id, index) => {
                    const recipe = recipes.find(r => r.id === id);
                    if (!recipe) return null;

                    const isBase = index === 0;

                    if (isBase) {
                        // Base recipe always takes full width at z-0
                        return (
                            <div key={`${id}-${index}`} className="absolute inset-0 z-0">
                                <RecipeContent
                                    recipe={recipe}
                                    depth={index}
                                    onClose={() => handleClose(index)}
                                    onIngredientClick={handleIngredientClick}
                                />
                            </div>
                        );
                    }

                    // Sub-recipes render based on displayMode
                    if (displayMode === 'stack') {
                        return (
                            <div
                                key={`${id}-${index}`}
                                className="absolute inset-y-0 right-0 transition-all duration-300 ease-in-out bg-surface-card shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.3)] border-l border-surface-border"
                                style={{
                                    width: '92%',
                                    zIndex: index * 10
                                }}
                            >
                                <RecipeContent
                                    recipe={recipe}
                                    depth={index}
                                    onClose={() => handleClose(index)}
                                    onIngredientClick={handleIngredientClick}
                                />
                            </div>
                        );
                    } else {
                        // Sticky Note Mode
                        return (
                            <DraggableStickyNote
                                key={`${id}-${index}`}
                                recipe={recipe}
                                index={index}
                                onClose={() => handleClose(index)}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default RecipeDetail;
