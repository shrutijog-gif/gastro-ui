
export interface Ingredient {
    name: string;
    netQty: string;
    code: string;
    yield: string;
    linkedRecipeId?: string; // Links to a sub-recipe/semi-finished item
}

export interface Instruction {
    step: number;
    text: string;
}

export interface Recipe {
    id: string;
    serialNumber?: string;
    name: string;
    categoryId: string;
    image: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
    allergens: string[];
    prepTime: string;
    calories: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
}

export const categories: Category[] = [
    { id: 'appetizer', name: 'Appetizers', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800' },
    { id: 'burger', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800' },
    { id: 'pizza', name: 'Pizzas', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
    { id: 'rice', name: 'Rice Items', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800' },
    { id: 'salad', name: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800' },
    { id: 'dessert', name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800' },
    { id: 'drink', name: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800' },
];

export const recipes: Recipe[] = [
    // --- BURGERS ---
    {
        id: 'ch-burger',
        serialNumber: 'SR-004',
        name: 'Classic Cheese Burger',
        categoryId: 'burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Beef Patty', netQty: '150g', code: 'BP-001', yield: '100%' },
            { name: 'Brioche Bun', netQty: '1 pc', code: 'BB-002', yield: '100%' },
            { name: 'Cheddar Cheese', netQty: '1 slice', code: 'CC-003', yield: '100%' },
            { name: 'Lettuce', netQty: '20g', code: 'VEG-001', yield: '85%' },
            { name: 'Tomato', netQty: '2 slices', code: 'VEG-002', yield: '90%' },
            { name: 'Burger Sauce', netQty: '30ml', code: 'SAU-005', yield: '100%', linkedRecipeId: 'burger-sauce' },
        ],
        instructions: [
            { step: 1, text: 'Toast the brioche bun on the grill until golden brown.' },
            { step: 2, text: 'Sear the beef patty for 3 minutes on each side. Add cheese in the last minute to melt.' },
            { step: 3, text: 'Apply burger sauce to both sides of the bun.' },
            { step: 4, text: 'Assemble: Bottom bun, lettuce, tomato, patty with cheese, top bun.' },
            { step: 5, text: 'Secure with a toothpick and serve immediately.' },
        ],
        allergens: ['Gluten', 'Dairy', 'Egg', 'Mustard'],
        prepTime: '10 mins',
        calories: '850 kcal',
    },
    // --- SEMI-FINISHED / PREPS ---
    {
        id: 'burger-sauce',
        serialNumber: 'SR-003',
        name: 'Signature Burger Sauce',
        categoryId: 'burger', // Technically a prep, but categorizing here for mock simplicity
        image: 'https://images.unsplash.com/photo-1472476449509-f06b6b553ced?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Mayonnaise', netQty: '500g', code: 'SAU-001', yield: '100%', linkedRecipeId: 'mayo-base' },
            { name: 'Ketchup', netQty: '150g', code: 'SAU-012', yield: '100%', linkedRecipeId: 'ketchup-base' },
            { name: 'Sweet Relish', netQty: '50g', code: 'VEG-020', yield: '100%' },
            { name: 'White Vinegar', netQty: '15ml', code: 'LIQ-005', yield: '100%' },
            { name: 'Garlic Powder', netQty: '5g', code: 'SP-002', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'In a large stainless steel bowl, combine mayonnaise and ketchup until smooth.' },
            { step: 2, text: 'Fold in the sweet relish to ensure even distribution.' },
            { step: 3, text: 'Add white vinegar and garlic powder; whisk vigorously for 2 minutes.' },
            { step: 4, text: 'Transfer to a sterile squeeze bottle and label. Store below 4°C.' },
        ],
        allergens: ['Egg', 'Mustard'],
        prepTime: '5 mins',
        calories: '450 kcal / 100g',
    },
    {
        id: 'tru-burger',
        serialNumber: 'SR-007',
        name: 'Truffle Mushroom Burger',
        categoryId: 'burger',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Beef Patty', netQty: '150g', code: 'BP-001', yield: '100%' },
            { name: 'Brioche Bun', netQty: '1 pc', code: 'BB-002', yield: '100%' },
            { name: 'Swiss Cheese', netQty: '1 slice', code: 'SC-004', yield: '100%' },
            { name: 'Truffle Oil', netQty: '5ml', code: 'LO-002', yield: '100%' },
            { name: 'Sautéed Mushrooms', netQty: '40g', code: 'VEG-008', yield: '80%' },
        ],
        instructions: [
            { step: 1, text: 'Sauté mushrooms with a dash of truffle oil.' },
            { step: 2, text: 'Grill patty and melt Swiss cheese on top.' },
            { step: 3, text: 'Assemble with truffle mayo.' },
        ],
        allergens: ['Gluten', 'Dairy', 'Egg'],
        prepTime: '12 mins',
        calories: '920 kcal',
    },
    {
        id: 'spicy-chk-burger',
        serialNumber: 'SR-009',
        name: 'Spicy Chicken Burger',
        categoryId: 'burger',
        image: 'https://images.unsplash.com/photo-1615297348957-84d797c55d99?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Chicken Breast (Breaded)', netQty: '140g', code: 'CP-002', yield: '100%' },
            { name: 'Spicy Slaw', netQty: '50g', code: 'VEG-010', yield: '100%' },
            { name: 'Jalapeños', netQty: '15g', code: 'VEG-011', yield: '100%' },
            { name: 'Spicy Mayo', netQty: '30ml', code: 'SAU-009', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'Deep fry chicken breast until golden and crispy (165°F internal).' },
            { step: 2, text: 'Toast bun.' },
            { step: 3, text: 'Layer spicy slaw, chicken, jalapeños, and mayo.' },
        ],
        allergens: ['Gluten', 'Egg', 'Mustard'],
        prepTime: '15 mins',
        calories: '780 kcal',
    },

    // --- PIZZAS ---
    {
        id: 'marg-pizza',
        serialNumber: 'SR-005',
        name: 'Margherita Pizza',
        categoryId: 'pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Pizza Dough', netQty: '250g', code: 'PD-001', yield: '100%' },
            { name: 'Tomato Sauce', netQty: '80g', code: 'TS-002', yield: '98%' },
            { name: 'Mozzarella', netQty: '100g', code: 'CH-004', yield: '100%' },
            { name: 'Fresh Basil', netQty: '5g', code: 'VEG-005', yield: '90%' },
            { name: 'Olive Oil', netQty: '10ml', code: 'OIL-001', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'Stretch the dough into a 12-inch circle.' },
            { step: 2, text: 'Spread tomato sauce evenly, leaving a 1-inch crust.' },
            { step: 3, text: 'Sprinkle mozzarella cheese over the sauce.' },
            { step: 4, text: 'Bake at 450°F (230°C) for 10-12 minutes until crust is golden.' },
            { step: 5, text: 'Garnish with fresh basil and a drizzle of olive oil before serving.' },
        ],
        allergens: ['Gluten', 'Dairy'],
        prepTime: '15 mins',
        calories: '700 kcal',
    },
    {
        id: 'pep-pizza',
        serialNumber: 'SR-010',
        name: 'Pepperoni Feast',
        categoryId: 'pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Pizza Dough', netQty: '250g', code: 'PD-001', yield: '100%' },
            { name: 'Tomato Sauce', netQty: '80g', code: 'TS-002', yield: '98%' },
            { name: 'Pepperoni Slices', netQty: '60g', code: 'MT-005', yield: '100%' },
            { name: 'Mozzarella', netQty: '100g', code: 'CH-004', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'Stretch dough and apply sauce.' },
            { step: 2, text: 'Add cheese and arrange pepperoni slices evenly.' },
            { step: 3, text: 'Bake until crust is brown and cheese bubbles.' },
        ],
        allergens: ['Gluten', 'Dairy', 'Pork'],
        prepTime: '15 mins',
        calories: '850 kcal',
    },
    {
        id: 'bbq-chk-pizza',
        serialNumber: 'SR-011',
        name: 'BBQ Chicken Pizza',
        categoryId: 'pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Pizza Dough', netQty: '250g', code: 'PD-001', yield: '100%' },
            { name: 'BBQ Sauce', netQty: '60g', code: 'SAU-008', yield: '100%' },
            { name: 'Grilled Chicken', netQty: '80g', code: 'MT-003', yield: '100%' },
            { name: 'Red Onion', netQty: '20g', code: 'VEG-006', yield: '90%' },
            { name: 'Cilantro', netQty: '5g', code: 'VEG-007', yield: '90%' },
        ],
        instructions: [
            { step: 1, text: 'Spread BBQ sauce on base.' },
            { step: 2, text: 'Top with cheese, chicken, and red onions.' },
            { step: 3, text: 'Bake and garnish with fresh cilantro.' },
        ],
        allergens: ['Gluten', 'Dairy'],
        prepTime: '18 mins',
        calories: '800 kcal',
    },

    // --- APPETIZERS ---
    {
        id: 'dyn-shrimp',
        serialNumber: 'SR-001',
        name: 'Dynamite Shrimp',
        categoryId: 'appetizer',
        image: 'https://images.unsplash.com/photo-1625938145744-e3805154121c?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Shrimp (Peeled)', netQty: '180g', code: 'SF-001', yield: '70%' },
            { name: 'Dynamite Sauce', netQty: '50ml', code: 'SAU-010', yield: '100%' },
            { name: 'Spring Onion', netQty: '10g', code: 'VEG-012', yield: '90%' },
        ],
        instructions: [
            { step: 1, text: 'Batter and deep fry shrimp until crispy.' },
            { step: 2, text: 'Toss immediately in dynamite sauce to coat.' },
            { step: 3, text: 'Serve in a martini glass and garnish with spring onions.' },
        ],
        allergens: ['Shellfish', 'Egg', 'Dairy'],
        prepTime: '10 mins',
        calories: '450 kcal',
    },
    {
        id: 'moz-sticks',
        serialNumber: 'SR-002',
        name: 'Mozzarella Sticks',
        categoryId: 'appetizer',
        image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Mozzarella Sticks', netQty: '6 pcs', code: 'FZ-002', yield: '100%' },
            { name: 'Marinara Dip', netQty: '40ml', code: 'SAU-011', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'Deep fry frozen sticks for 3 mins at 180°C.' },
            { step: 2, text: 'Serve hot with marinara dip.' },
        ],
        allergens: ['Gluten', 'Dairy'],
        prepTime: '5 mins',
        calories: '520 kcal',
    },
    {
        id: 'cal-fritti',
        serialNumber: 'SR-006',
        name: 'Calamari Fritti',
        categoryId: 'appetizer',
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Calamari Rings', netQty: '200g', code: 'SF-003', yield: '100%' },
            { name: 'Lemon Wedge', netQty: '1 pc', code: 'VEG-014', yield: '100%' },
            { name: 'Tartar Sauce', netQty: '40ml', code: 'SAU-012', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'Dust calamari in seasoned flour.' },
            { step: 2, text: 'Fry until golden and crisp.' },
            { step: 3, text: 'Serve with lemon and tartar sauce.' },
        ],
        allergens: ['Shellfish', 'Gluten', 'Egg'],
        prepTime: '8 mins',
        calories: '480 kcal',
    },
    {
        id: 'ch-fries',
        serialNumber: 'SR-008',
        name: 'Cheesy Fries',
        categoryId: 'appetizer',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'French Fries', netQty: '200g', code: 'FZ-005', yield: '100%' },
            { name: 'Cheese Sauce', netQty: '50ml', code: 'SAU-015', yield: '100%' },
            { name: 'Bacon Bits', netQty: '10g', code: 'MT-009', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'Fry chips until crispy.' },
            { step: 2, text: 'Pour warm cheese sauce over chips.' },
            { step: 3, text: 'Sprinkle with bacon bits.' },
        ],
        allergens: ['Dairy'],
        prepTime: '6 mins',
        calories: '600 kcal',
    },
    // --- SUB-SUB BASE INGREDIENTS ---
    {
        id: 'mayo-base',
        serialNumber: 'SR-101',
        name: 'House Mayonnaise Base',
        categoryId: 'burger',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Egg Yolk', netQty: '2 pcs', code: 'EGG-01', yield: '100%' },
            { name: 'Vegetable Oil', netQty: '200ml', code: 'OIL-02', yield: '100%' },
            { name: 'House Mustard', netQty: '10g', code: 'MUS-01', yield: '100%', linkedRecipeId: 'house-mustard' },
            { name: 'Lemon Juice', netQty: '15ml', code: 'LM-01', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'Whisk egg yolks and house mustard together until smooth.' },
            { step: 2, text: 'Very slowly drizzle in oil while whisking vigorously to emulsify.' },
            { step: 3, text: 'Stir in lemon juice and season with salt to taste.' }
        ],
        allergens: ['Egg', 'Mustard'],
        prepTime: '15 mins',
        calories: '600 kcal',
    },
    {
        id: 'ketchup-base',
        serialNumber: 'SR-102',
        name: 'House Tomato Ketchup',
        categoryId: 'burger',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Tomato Paste', netQty: '200g', code: 'TP-01', yield: '100%' },
            { name: 'White Vinegar', netQty: '50ml', code: 'VIN-01', yield: '100%' },
            { name: 'Brown Sugar', netQty: '20g', code: 'SUG-01', yield: '100%' },
            { name: 'Onion Powder', netQty: '5g', code: 'SP-03', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'Combine all ingredients in a saucepan.' },
            { step: 2, text: 'Simmer over low heat for 15 minutes.' },
            { step: 3, text: 'Allow to cool completely and store.' }
        ],
        allergens: [],
        prepTime: '20 mins',
        calories: '120 kcal',
    },
    // --- DEEP SUB-SUB-SUB BASE INGREDIENTS FOR 3RD COLUMN TESTING ---
    {
        id: 'house-mustard',
        serialNumber: 'SR-103',
        name: 'House Dijon Mustard',
        categoryId: 'burger',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800',
        ingredients: [
            { name: 'Mustard Seeds', netQty: '50g', code: 'MS-01', yield: '100%' },
            { name: 'White Wine Vinegar', netQty: '30ml', code: 'VIN-02', yield: '100%' },
            { name: 'Water', netQty: '20ml', code: 'H20-01', yield: '100%' },
            { name: 'Salt', netQty: '2g', code: 'SA-01', yield: '100%' },
        ],
        instructions: [
            { step: 1, text: 'Soak mustard seeds in vinegar and water overnight.' },
            { step: 2, text: 'Blend until smooth or desired consistency.' },
            { step: 3, text: 'Season with salt and let rest for 24 hours before use.' }
        ],
        allergens: ['Mustard'],
        prepTime: '24 hrs',
        calories: '45 kcal',
    }
];
