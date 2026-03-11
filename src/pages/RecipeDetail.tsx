import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Users, ChefHat, AlertTriangle, X, Link as LinkIcon, ChevronDown, ChevronRight, Layers, List, Utensils, Maximize2, Minimize2 } from 'lucide-react';
import { recipes, categories } from '../data/mockData';
import type { Recipe, Ingredient, Instruction } from '../data/mockData';

// Helper to auto-link ingredient names in instruction text
const renderInstructionText = (text: string, ingredients: Ingredient[], onIngredientClick: (id: string) => void) => {
    let result: (string | React.ReactNode)[] = [text];

    ingredients.forEach(ing => {
        if (!ing.linkedRecipeId) return;

        // Escape regex characters
        const escapedName = ing.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedName})`, 'gi');

        const nextResult: (string | React.ReactNode)[] = [];
        result.forEach((part, index) => {
            if (typeof part !== 'string') {
                nextResult.push(part);
                return;
            }

            const pieces = part.split(regex);
            pieces.forEach((piece, i) => {
                if (i % 2 === 1) {
                    nextResult.push(
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
                } else if (piece) {
                    nextResult.push(piece);
                }
            });
        });
        result = nextResult;
    });

    return result;
};

// --- Sub-component for rendering an Instruction Item with optional Sub-steps ---
interface InstructionItemProps {
    instruction: Instruction;
    ingredients: Ingredient[];
    onIngredientClick: (id: string) => void;
    isSubStep?: boolean;
}

const InstructionItem: React.FC<InstructionItemProps> = ({ instruction, ingredients, onIngredientClick, isSubStep = false }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasSubSteps = instruction.subSteps && instruction.subSteps.length > 0;

    return (
        <div className={`flex flex-col gap-3 group ${isSubStep ? 'mt-3 relative' : ''}`}>
            {isSubStep && (
                <div className="absolute -left-5 top-4 w-4 border-t-2 border-surface-border rounded-bl-lg pointer-events-none" />
            )}

            <div className="flex gap-4">
                <div className={`flex-shrink-0 flex items-center justify-center font-bold transition-all shadow-sm ${isSubStep
                    ? 'w-6 h-6 rounded-md bg-surface-background border border-surface-border text-content-muted text-[10px]'
                    : 'w-8 h-8 rounded-lg bg-surface-background border border-surface-border text-content-muted group-hover:bg-brand-blue group-hover:border-brand-blue group-hover:text-white'
                    }`}>
                    {instruction.step}
                </div>

                <div className={`pt-1 text-sm leading-relaxed transition-colors flex-1 ${isSubStep
                    ? 'text-content-secondary'
                    : 'text-content-secondary group-hover:text-content-primary'
                    }`}>
                    <div className="flex items-start justify-between gap-4">
                        <div>{renderInstructionText(instruction.text, ingredients, onIngredientClick)}</div>

                        {hasSubSteps && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                                className="p-1 rounded bg-surface-background border border-surface-border hover:bg-brand-light/30 hover:border-brand-blue/30 text-content-muted hover:text-brand-blue transition-all flex-shrink-0 mt-0.5"
                                title={isExpanded ? "Collapse sub-steps" : "Expand sub-steps"}
                            >
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Render Sub Steps */}
            {hasSubSteps && isExpanded && (
                <div className="pl-4 ml-4 border-l-2 border-surface-border space-y-4 pb-2 mt-1">
                    {instruction.subSteps!.map((subStep, idx) => (
                        <InstructionItem
                            key={idx}
                            instruction={subStep}
                            ingredients={ingredients}
                            onIngredientClick={onIngredientClick}
                            isSubStep={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Sub-component to render the actual recipe content ---
interface RecipeContentProps {
    recipe: Recipe;
    depth: number;
    onClose: () => void;
    onIngredientClick: (id: string) => void;
    isFocusMode?: boolean;
    setIsFocusMode?: (focus: boolean) => void;
}

const RecipeContent: React.FC<RecipeContentProps> = ({ recipe, depth, onClose, onIngredientClick, isFocusMode, setIsFocusMode }) => {
    return (
        <div className="h-full bg-surface-card flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-5 border-b border-surface-border bg-surface-card z-10 shrink-0">
                <div className="flex items-center gap-4">
                    {depth > 0 && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-surface-background transition-colors text-content-muted hover:text-content-primary border border-transparent hover:border-surface-border"
                        >
                            <X size={24} />
                        </button>
                    )}
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
                    <div className="flex items-center gap-3 bg-surface-background px-3 py-1.5 rounded-full border border-surface-border">
                        <Clock size={16} className="text-brand-blue" />
                        <span className="text-sm font-semibold">{recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-surface-background px-3 py-1.5 rounded-full border border-surface-border">
                        <Flame size={16} className="text-orange-500" />
                        <span className="text-sm font-semibold">{recipe.calories}</span>
                    </div>
                    {!isFocusMode && setIsFocusMode && (
                        <button
                            onClick={() => setIsFocusMode(true)}
                            className="ml-2 flex items-center justify-center w-8 h-8 bg-surface-background hover:bg-brand-light/30 border border-surface-border hover:border-brand-blue/30 text-content-muted hover:text-brand-blue rounded-full transition-all group"
                            title="Enter Focus Mode"
                        >
                            <Maximize2 size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content - 3 Column Layout (Unified Scroll) */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar ${isFocusMode ? 'min-h-[calc(100vh-140px)]' : 'min-h-[calc(100vh-220px)]'}`}>
                <div className="grid grid-cols-12 divide-x divide-surface-border min-h-full">

                    {/* Column 1: Ingredients (3 cols) */}
                    <div className="col-span-3 bg-surface-background flex flex-col">
                        <div className="p-4 border-b border-surface-border bg-surface-card/50">
                            <h2 className="flex items-center gap-2 font-bold text-content-secondary uppercase tracking-wider text-xs">
                                <Users size={14} className="text-content-muted" /> Ingredients ({recipe.ingredients.length})
                            </h2>
                        </div>
                        <div className="flex-1 p-4">
                            <table className="w-full text-sm text-left relative text-content-primary">
                                <thead className="text-[10px] text-content-muted uppercase bg-surface-border/30 rounded-lg">
                                    <tr>
                                        <th className="px-3 py-2 rounded-l-md font-semibold font-sans">Item</th>
                                        <th className="px-3 py-2 w-16 text-right font-semibold font-sans">Qty</th>
                                        <th className="px-3 py-2 w-16 text-left rounded-r-md font-semibold font-sans">UoM</th>
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
                                                <td className="px-3 py-3 text-left font-mono text-xs font-medium text-content-secondary">
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
                    <div className="col-span-6 flex flex-col bg-surface-card">
                        <div className="p-4 border-b border-surface-border bg-surface-card">
                            <h2 className="flex items-center gap-2 font-bold text-content-secondary uppercase tracking-wider text-xs">
                                <ChefHat size={14} className="text-content-muted" /> Preparation Method
                            </h2>
                        </div>
                        <div className="flex-1 p-6 scroll-smooth">
                            <div className="space-y-6">
                                {recipe.instructions.map((inst, idx) => (
                                    <InstructionItem
                                        key={idx}
                                        instruction={inst}
                                        ingredients={recipe.ingredients}
                                        onIngredientClick={onIngredientClick}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Visuals & Extras (4 cols) */}
                    <div className="col-span-3 flex flex-col bg-surface-background relative">
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
                        <div className="flex-1 px-5 pb-5">
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
                    <div className="pl-2 space-y-3">
                        {recipe.instructions.map((inst, idx) => (
                            <InstructionItem
                                key={idx}
                                instruction={inst}
                                ingredients={recipe.ingredients}
                                onIngredientClick={() => { }} // Disabled inside sticky note
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Vertical Info View Component ---
interface RecipeVerticalInfoViewProps {
    baseRecipe: Recipe;
    initialSubRecipeId: string;
    onClose: () => void;
    onCloseSubRecipe: () => void;
    onIngredientClick: (id: string) => void;
}

const RecipeVerticalInfoView: React.FC<RecipeVerticalInfoViewProps> = ({ baseRecipe, initialSubRecipeId, onClose, onCloseSubRecipe, onIngredientClick }) => {
    const subRecipe = recipes.find(r => r.id === initialSubRecipeId);
    const [subSubRecipeId, setSubSubRecipeId] = useState<string | null>(null);
    const subSubRecipe = subSubRecipeId ? recipes.find(r => r.id === subSubRecipeId) : null;

    // Manage accordion states for columns. Defaulting "Ingredients" and "Instructions" to open.
    const [baseExpanded, setBaseExpanded] = useState<Record<string, boolean>>({ ingredients: true, instructions: true });
    const [subExpanded, setSubExpanded] = useState<Record<string, boolean>>({ ingredients: true, instructions: true });
    const [subSubExpanded, setSubSubExpanded] = useState<Record<string, boolean>>({ ingredients: true, instructions: true });

    const toggleAccordion = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, key: string) => {
        setter(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const renderColumnContent = (
        recipe: Recipe,
        expandedState: Record<string, boolean>,
        setExpandedState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
        onIngredientSelect?: (id: string) => void
    ) => (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">            {/* Ingredients Accordion */}
            <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden shadow-sm">
                <button
                    className="w-full p-4 flex items-center justify-between hover:bg-surface-background transition-colors"
                    onClick={() => toggleAccordion(setExpandedState, 'ingredients')}
                >
                    <h3 className="font-bold text-sm text-content-secondary uppercase tracking-wider flex items-center gap-2">
                        <List size={16} /> Ingredients
                    </h3>
                    {expandedState.ingredients ? <ChevronDown size={18} className="text-content-muted" /> : <ChevronRight size={18} className="text-content-muted" />}
                </button>
                {expandedState.ingredients && (
                    <div className="px-4 pb-4">
                        <div className="space-y-1 mt-2">
                            {recipe.ingredients.map((ing, idx) => (
                                <div key={idx} className="flex py-1.5 border-b border-surface-border/50 last:border-0 justify-between items-center text-sm">
                                    <span
                                        onClick={() => {
                                            if (onIngredientSelect && ing.linkedRecipeId) {
                                                onIngredientSelect(ing.linkedRecipeId);
                                            }
                                        }}
                                        className={`text-content-primary ${onIngredientSelect && ing.linkedRecipeId ? 'text-brand-blue hover:text-brand-blue-hover cursor-pointer underline decoration-brand-blue/30 underline-offset-4' : ''}`}
                                    >
                                        {ing.name}
                                    </span>
                                    <div className="flex text-content-muted gap-2 text-xs justify-end pr-2">
                                        <span className="w-12 text-right font-mono text-content-primary">{ing.netQty.match(/^([\d.]+)/)?.[1] || ing.netQty}</span>
                                        <span className="w-14 text-left font-mono">{ing.netQty.match(/[a-zA-Z]+$/)?.[0] || ''}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions Accordion */}
            <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden shadow-sm">
                <button
                    className="w-full p-4 flex items-center justify-between hover:bg-surface-background transition-colors"
                    onClick={() => toggleAccordion(setExpandedState, 'instructions')}
                >
                    <h3 className="font-bold text-sm text-content-secondary uppercase tracking-wider flex items-center gap-2">
                        <Layers size={16} /> Preparation Method
                    </h3>
                    {expandedState.instructions ? <ChevronDown size={18} className="text-content-muted" /> : <ChevronRight size={18} className="text-content-muted" />}
                </button>
                {expandedState.instructions && (
                    <div className="px-4 pb-4 space-y-3 mt-2">
                        {recipe.instructions.map((inst, idx) => (
                            <InstructionItem
                                key={idx}
                                instruction={inst}
                                ingredients={recipe.ingredients}
                                onIngredientClick={(id) => {
                                    if (onIngredientSelect) onIngredientSelect(id);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Additional Info Accordion */}
            <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden shadow-sm">
                <button
                    className="w-full p-4 flex items-center justify-between hover:bg-surface-background transition-colors"
                    onClick={() => toggleAccordion(setExpandedState, 'details')}
                >
                    <h3 className="font-bold text-sm text-content-secondary uppercase tracking-wider flex items-center gap-2">
                        <Utensils size={16} /> Details
                    </h3>
                    {expandedState.details ? <ChevronDown size={18} className="text-content-muted" /> : <ChevronRight size={18} className="text-content-muted" />}
                </button>
                {expandedState.details && (
                    <div className="p-4 pt-0 grid border-t border-surface-border/50 mt-2 pt-4">
                        <div className="flex justify-between py-2 border-b border-surface-border/50 text-sm">
                            <span className="text-content-muted">Prep Time</span>
                            <span className="font-medium text-content-primary">{recipe.prepTime}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-surface-border/50 text-sm">
                            <span className="text-content-muted">Calories</span>
                            <span className="font-medium text-content-primary">{recipe.calories}</span>
                        </div>
                        <div className="flex justify-between py-2 text-sm items-center">
                            <span className="text-content-muted">Allergens</span>
                            <div className="flex gap-1 flex-wrap justify-end">
                                {recipe.allergens.map((allergen, idx) => (
                                    <span key={idx} className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded textxs font-semibold">
                                        {allergen}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col overflow-hidden bg-surface-background rounded-b-xl animate-fade-in-up">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-card shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <img src={baseRecipe.image} alt={baseRecipe.name} className="w-8 h-8 rounded-md object-cover shadow-sm border border-black/5 shrink-0" />
                        <h1 className="text-lg font-bold text-content-primary flex items-center gap-2">
                            {baseRecipe.name}
                        </h1>
                    </div>
                </div>
            </header>

            {/* Columns Layout */}
            <div className="flex-1 flex divide-x divide-surface-border overflow-hidden">
                {/* Column 1: Main Recipe */}
                <div className="flex-1 flex flex-col bg-surface-background h-full min-w-[300px]">
                    <div className="p-3 border-b border-surface-border bg-slate-50/60 px-6 shrink-0 flex justify-between items-center">
                        <h2 className="font-bold text-slate-700 uppercase tracking-wider text-xs truncate mr-2">Main Recipe - {baseRecipe.name}</h2>
                        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors shrink-0 p-1 rounded-md hover:bg-slate-200/50">
                            <X size={14} />
                        </button>
                    </div>
                    {renderColumnContent(baseRecipe, baseExpanded, setBaseExpanded, onIngredientClick)}
                </div>

                {/* Column 2: Sub-Recipe */}
                <div className="flex-1 flex flex-col bg-surface-background/50 h-full min-w-[300px]">
                    <div className="p-3 border-b border-surface-border bg-emerald-50/60 px-6 shrink-0 flex justify-between items-center">
                        <h2 className="font-bold text-emerald-700 uppercase tracking-wider text-xs truncate mr-2">Sub-Recipe - {subRecipe?.name}</h2>
                        <button onClick={onCloseSubRecipe} className="text-emerald-700/50 hover:text-emerald-800 transition-colors shrink-0 p-1 rounded-md hover:bg-emerald-200/50">
                            <X size={14} />
                        </button>
                    </div>
                    {subRecipe ? (
                        renderColumnContent(subRecipe, subExpanded, setSubExpanded, setSubSubRecipeId)
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-content-muted text-sm">Recipe not found</div>
                    )}
                </div>

                {/* Column 3: Sub-Sub-Recipe */}
                {subSubRecipe && (
                    <div className="flex-1 flex flex-col bg-surface-background/30 h-full min-w-[300px] animate-fade-in-right border-l border-surface-border">
                        <div className="p-3 border-b border-surface-border bg-amber-50/60 px-6 shrink-0 flex justify-between items-center">
                            <h2 className="font-bold text-amber-700 uppercase tracking-wider text-xs truncate mr-2">Sub-Sub-Recipe - {subSubRecipe.name}</h2>
                            <button onClick={() => setSubSubRecipeId(null)} className="text-amber-700/50 hover:text-amber-800 transition-colors shrink-0 p-1 rounded-md hover:bg-amber-200/50">
                                <X size={14} />
                            </button>
                        </div>
                        {renderColumnContent(subSubRecipe, subSubExpanded, setSubSubExpanded)}
                    </div>
                )}
            </div>
        </div>
    );
};
interface RecipeHierarchyViewProps {
    baseRecipe: Recipe;
    initialSelectedSubId?: string | null;
    onClose: () => void;
}

const RecipeHierarchyView: React.FC<RecipeHierarchyViewProps> = ({ baseRecipe, initialSelectedSubId, onClose }) => {
    const [selectedSubId, setSelectedSubId] = useState<string | null>(initialSelectedSubId || null);
    const [expandedSubId, setExpandedSubId] = useState<string | null>(initialSelectedSubId || null);
    const [expandedSubSubId, setExpandedSubSubId] = useState<string | null>(null);

    const subRecipe = selectedSubId ? recipes.find(r => r.id === selectedSubId) : null;

    // Helper to render tight instructions for accordion
    const renderTightInstructions = (recipe: Recipe, onLinkClick: (linkedId: string) => void) => (
        <div className="space-y-3 mt-3 ml-2 border-l-2 border-surface-border pl-4 py-1">
            {recipe.instructions.map((inst, idx) => (
                <InstructionItem
                    key={idx}
                    instruction={inst}
                    ingredients={recipe.ingredients}
                    onIngredientClick={onLinkClick}
                />
            ))}
        </div>
    );

    const showThirdColumn = !!(subRecipe && subRecipe.ingredients.some(ing => ing.linkedRecipeId));
    const colSpanClass = showThirdColumn ? 'col-span-4' : 'col-span-6';

    return (
        <div className="h-full flex flex-col overflow-hidden bg-surface-background rounded-b-xl">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-card shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-background transition-colors text-content-muted hover:text-content-primary">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-content-primary flex items-center gap-2">
                        {baseRecipe.name}
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-wider ml-2 flex items-center gap-1">
                            <Layers size={10} /> Hierarchy View
                        </span>
                    </h1>
                </div>
            </header>

            {/* 3 Column Grid */}
            <div className="flex-1 grid grid-cols-12 divide-x divide-surface-border overflow-hidden">

                {/* Column 1: Main Instructions */}
                <div className={`${colSpanClass} bg-surface-background flex flex-col h-full transition-all duration-300`}>
                    <div className="p-3 border-b border-surface-border bg-surface-card/50 px-4">
                        <h2 className="font-bold text-content-secondary uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded bg-surface-border text-content-muted flex items-center justify-center">1</span>
                            Main Instructions
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                        <div className="bg-surface-card border border-surface-border rounded-xl shadow-sm p-4 h-full">
                            <div className="font-bold text-sm text-content-primary flex items-center gap-2 mb-4 pb-3 border-b border-surface-border">
                                {baseRecipe.name}
                            </div>
                            <div className="space-y-4">
                                {baseRecipe.instructions.map((inst, idx) => (
                                    <InstructionItem
                                        key={idx}
                                        instruction={inst}
                                        ingredients={baseRecipe.ingredients}
                                        onIngredientClick={(linkedId) => {
                                            setSelectedSubId(linkedId);
                                            setExpandedSubId(linkedId);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Sub-Recipes */}
                <div className={`${colSpanClass} bg-surface-card/30 flex flex-col h-full relative transition-all duration-300`}>
                    <div className="p-3 border-b border-surface-border bg-surface-card/50 px-4">
                        <h2 className="font-bold text-content-secondary uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded bg-surface-border text-content-muted flex items-center justify-center">2</span>
                            Sub-Recipes
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="space-y-3">
                            {baseRecipe.ingredients.filter(ing => ing.linkedRecipeId).map(ing => {
                                const sr = recipes.find(r => r.id === ing.linkedRecipeId);
                                if (!sr) return null;
                                return (
                                    <div key={sr.id} className="bg-surface-card border border-brand-blue/20 rounded-xl overflow-hidden shadow-sm">
                                        <button
                                            className="w-full p-3 flex items-center justify-between bg-brand-light/30 hover:bg-brand-light/50 transition-colors"
                                            onClick={() => {
                                                setSelectedSubId(sr.id);
                                                setExpandedSubId(expandedSubId === sr.id ? null : sr.id);
                                            }}
                                        >
                                            <span className="font-bold text-sm text-brand-blue flex items-center gap-2">
                                                {sr.name} <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-blue/10 text-brand-blue uppercase font-bold tracking-wider">Prep</span>
                                            </span>
                                            {expandedSubId === sr.id ? <ChevronDown size={16} className="text-brand-blue" /> : <ChevronRight size={16} className="text-brand-blue/50" />}
                                        </button>

                                        {expandedSubId === sr.id && (
                                            <div className="p-4 bg-surface-card pt-0">
                                                {renderTightInstructions(sr, (linkedId) => {
                                                    setSelectedSubId(sr.id); // Ensure this remains selected
                                                    setExpandedSubSubId(linkedId);
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {baseRecipe.ingredients.filter(ing => ing.linkedRecipeId).length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-content-muted opacity-50 space-y-3 mt-10">
                                    <Layers size={32} className="opacity-20" />
                                    <span className="text-xs font-medium uppercase tracking-wider">No Sub-Recipes</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Column 3: Sub-Sub-Recipes */}
                {showThirdColumn && (
                    <div className="col-span-4 bg-surface-background flex flex-col h-full relative shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] transition-all animate-fade-in-up">
                        <div className="p-3 border-b border-surface-border bg-surface-card/50 px-4">
                            <h2 className="font-bold text-content-secondary uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded bg-surface-border text-content-muted flex items-center justify-center">3</span>
                                Sub-Sub-Recipes
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {!subRecipe || subRecipe.ingredients.filter(ing => ing.linkedRecipeId).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-content-muted opacity-50 space-y-3">
                                    <Layers size={32} className="opacity-20" />
                                    <span className="text-xs font-medium uppercase tracking-wider text-center px-6">Select a nested item from Column 2</span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {subRecipe.ingredients.filter(ing => ing.linkedRecipeId).map(ing => {
                                        const ssr = recipes.find(r => r.id === ing.linkedRecipeId);
                                        if (!ssr) return null;
                                        return (
                                            <div key={ssr.id} className="bg-surface-card border border-amber-200/50 rounded-xl overflow-hidden shadow-sm">
                                                <button
                                                    className="w-full p-3 flex items-center justify-between bg-amber-50 hover:bg-amber-100/50 transition-colors"
                                                    onClick={() => {
                                                        setExpandedSubSubId(expandedSubSubId === ssr.id ? null : ssr.id);
                                                    }}
                                                >
                                                    <span className="font-bold text-sm text-amber-900 flex items-center gap-2">
                                                        {ssr.name} <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200/40 text-amber-800 uppercase font-bold tracking-wider">Prep</span>
                                                    </span>
                                                    {expandedSubSubId === ssr.id ? <ChevronDown size={16} className="text-amber-700" /> : <ChevronRight size={16} className="text-amber-700/50" />}
                                                </button>

                                                {expandedSubSubId === ssr.id && (
                                                    <div className="p-4 bg-surface-card pt-0">
                                                        {renderTightInstructions(ssr, () => {
                                                            // Optional: handle deeper links if needed in the future
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )
                }
            </div >
        </div >
    );
};

// --- Main Container Component ---
const RecipeDetail: React.FC = () => {
    const navigate = useNavigate();
    const { recipeId } = useParams<{ recipeId: string }>();

    // Global layout state
    const { isSidebarOpen, isFocusMode, setIsFocusMode } = useOutletContext<{
        isSidebarOpen: boolean;
        setCustomBreadcrumbs: (crumbs: React.ReactNode | null) => void;
        isFocusMode: boolean;
        setIsFocusMode: (focus: boolean) => void;
    }>();

    // Manage stack of recipe IDs
    const [recipeStack, setRecipeStack] = useState<string[]>([]);

    // Manage display mode ('stack' for overlapping columns, 'sticky' for floating notes)
    const [displayMode, setDisplayMode] = useState<'stack' | 'sticky' | 'hierarchy' | 'vertical-info'>('stack');

    // Manage active overlay base recipe for Hierarchy view
    const [hierarchyTriggerId, setHierarchyTriggerId] = useState<string | null>(null);
    const [verticalInfoTriggerId, setVerticalInfoTriggerId] = useState<string | null>(null);

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
        if (displayMode === 'hierarchy') {
            setHierarchyTriggerId(linkedId);
            return;
        }
        if (displayMode === 'vertical-info') {
            setVerticalInfoTriggerId(linkedId);
            return;
        }

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

            {/* Focus Mode Floating Exit Button */}
            {isFocusMode && (
                <button
                    onClick={() => setIsFocusMode(false)}
                    className="fixed top-6 right-6 w-12 h-12 bg-white text-content-primary rounded-full shadow-lg border border-surface-border flex items-center justify-center z-50 hover:bg-surface-background hover:text-brand-blue hover:scale-105 transition-all group"
                    title="Exit Focus Mode"
                >
                    <Minimize2 size={24} className="group-hover:stroke-brand-blue transition-colors" />
                </button>
            )}

            {/* Edge-to-Edge Category Strip */}
            {!isFocusMode && (
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
                            <button
                                onClick={() => setDisplayMode('hierarchy')}
                                className={`px-3 py-1.5 text-xs font-bold transition-colors rounded-md ${displayMode === 'hierarchy' ? 'bg-indigo-100 text-indigo-900 shadow-sm border border-indigo-200/50' : 'text-content-secondary hover:text-indigo-600'}`}
                            >
                                Hierarchy
                            </button>
                            <button
                                onClick={() => setDisplayMode('vertical-info')}
                                className={`px-3 py-1.5 text-xs font-bold transition-colors rounded-md ${displayMode === 'vertical-info' ? 'bg-emerald-100 text-emerald-900 shadow-sm border border-emerald-200/50' : 'text-content-secondary hover:text-emerald-600'}`}
                            >
                                Vertical Info
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Recipe Detail Container */}
            <div className={`flex-1 relative overflow-hidden flex bg-surface-background transition-all duration-300 ${isFocusMode ? 'mt-0 rounded-none border-0' : isSidebarOpen ? 'mt-14 rounded-xl border border-surface-border shadow-sm' : 'mt-[52px]'}`}>
                {/* Always render the base stack */}
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
                    if (displayMode === 'stack' || displayMode === 'hierarchy') {
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
                    } else if (displayMode === 'sticky') {
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
                    return null;
                })}

                {/* DYNAMIC HIERARCHY OVERLAY */}
                {hierarchyTriggerId && (
                    <div
                        className="absolute inset-y-0 right-0 z-[100] bg-surface-background shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.3)] border-l border-surface-border transition-transform duration-300 ease-in-out"
                        style={{ width: '92%' }}
                    >
                        <RecipeHierarchyView
                            baseRecipe={recipes.find(r => r.id === (recipeId || recipeStack[0]))!}
                            initialSelectedSubId={hierarchyTriggerId}
                            onClose={() => setHierarchyTriggerId(null)}
                        />
                    </div>
                )}

                {/* DYNAMIC VERTICAL INFO OVERLAY */}
                {displayMode === 'vertical-info' && verticalInfoTriggerId && (
                    <div
                        className="absolute inset-y-0 right-0 z-[110] bg-surface-background shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.3)] border-l border-surface-border transition-transform duration-300 ease-in-out"
                        style={{ width: '100%' }}
                    >
                        <RecipeVerticalInfoView
                            baseRecipe={recipes.find(r => r.id === (recipeId || recipeStack[0]))!}
                            initialSubRecipeId={verticalInfoTriggerId}
                            onClose={() => {
                                setVerticalInfoTriggerId(null);
                                setDisplayMode('stack');
                            }}
                            onCloseSubRecipe={() => {
                                setVerticalInfoTriggerId(null);
                            }}
                            onIngredientClick={(id) => setVerticalInfoTriggerId(id)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeDetail;
