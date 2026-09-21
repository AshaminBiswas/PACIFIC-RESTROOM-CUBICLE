import { create } from "zustand";

export type ProductCategory = "toilet_cubicle" | "toilet_partition" | "locker_system";
export type WoodMaterialType = "hpl" | "plywood";
export type FinishType = "cream" | "sage" | "purple" | "oak" | "charcoal";
export type HardwareFinish = "brass" | "chrome" | "black";

export interface SystemDimensions {
  width: number;       // in mm
  depth: number;       // in mm
  height: number;      // in mm
}

export interface SystemAccessories {
  // Toilet Cubicle / Partition Accessories
  indicatorLock: boolean;
  coatHook: boolean;
  ledBacklight: boolean;
  supportLeg: boolean;
  
  // Locker Accessories
  goldKnob: boolean;
  keyLock: boolean;
  digitalLock: boolean;
  numberPlate: boolean;
}

export interface CubicleState {
  category: ProductCategory;
  model: string; // "classic" | "arch" | "rectangular" | "grid" | "z_locker"
  dimensions: SystemDimensions;
  materials: {
    type: WoodMaterialType;
    finish: FinishType;
    hardware: HardwareFinish;
  };
  accessories: SystemAccessories;
  resetCameraKey: number;

  // Actions
  setCategory: (category: ProductCategory) => void;
  setModel: (model: string) => void;
  setDimension: (key: keyof SystemDimensions, value: number) => void;
  setMaterial: (key: "type" | "finish" | "hardware", value: string) => void;
  toggleAccessory: (key: keyof SystemAccessories) => void;
  resetConfig: () => void;
  incrementResetCamera: () => void;

  // Calculations
  getStallCount: () => number;
  getLockerGrid: () => { cols: number; rows: number };
  getEstimatedPriceRange: () => { min: number; max: number };
  getConfigJson: () => string;
}

const DEFAULT_DIMENSIONS = {
  toilet_cubicle: { width: 2200, depth: 1500, height: 2000 },
  toilet_partition: { width: 600, depth: 800, height: 1200 },
  locker_system: { width: 2000, depth: 450, height: 1800 }
};

const DEFAULT_ACCESSORIES: SystemAccessories = {
  indicatorLock: true,
  coatHook: true,
  ledBacklight: false,
  supportLeg: true,
  goldKnob: true,
  keyLock: true,
  digitalLock: false,
  numberPlate: true
};

export const useCubicleStore = create<CubicleState>((set, get) => ({
  category: "toilet_cubicle",
  model: "classic",
  dimensions: { ...DEFAULT_DIMENSIONS.toilet_cubicle },
  materials: {
    type: "hpl",
    finish: "cream",
    hardware: "brass"
  },
  accessories: { ...DEFAULT_ACCESSORIES },
  resetCameraKey: 0,

  setCategory: (category) => {
    set((state) => {
      // Load appropriate default dimensions for this category
      const defaultDims = DEFAULT_DIMENSIONS[category];
      
      // Default models per category
      let defaultModel = "classic";
      if (category === "toilet_partition") defaultModel = "rectangular";
      if (category === "locker_system") defaultModel = "grid";

      return {
        category,
        model: defaultModel,
        dimensions: { ...defaultDims }
      };
    });
  },

  setModel: (model) => set({ model }),

  setDimension: (key, value) => {
    set((state) => {
      const updatedDimensions = { ...state.dimensions, [key]: value };
      
      // Category specific bounds/clamps
      if (state.category === "toilet_cubicle") {
        if (key === "width") updatedDimensions.width = Math.min(3600, Math.max(900, value));
        if (key === "depth") updatedDimensions.depth = Math.min(2200, Math.max(1000, value));
        if (key === "height") updatedDimensions.height = Math.min(2400, Math.max(1600, value));
      } else if (state.category === "toilet_partition") {
        if (key === "width") updatedDimensions.width = Math.min(1200, Math.max(400, value));
        if (key === "depth") updatedDimensions.depth = Math.min(1000, Math.max(400, value));
        if (key === "height") updatedDimensions.height = Math.min(1800, Math.max(900, value));
      } else if (state.category === "locker_system") {
        if (key === "width") updatedDimensions.width = Math.min(3000, Math.max(600, value));
        if (key === "depth") updatedDimensions.depth = Math.min(800, Math.max(300, value));
        if (key === "height") updatedDimensions.height = Math.min(2200, Math.max(900, value));
      }

      return { dimensions: updatedDimensions };
    });
  },

  setMaterial: (key, value) => {
    set((state) => ({
      materials: {
        ...state.materials,
        [key]: value as any
      }
    }));
  },

  toggleAccessory: (key) => {
    set((state) => ({
      accessories: {
        ...state.accessories,
        [key]: !state.accessories[key]
      }
    }));
  },

  resetConfig: () => {
    set({
      category: "toilet_cubicle",
      model: "classic",
      dimensions: { ...DEFAULT_DIMENSIONS.toilet_cubicle },
      materials: {
        type: "hpl",
        finish: "cream",
        hardware: "brass"
      },
      accessories: { ...DEFAULT_ACCESSORIES },
      resetCameraKey: 0
    });
  },

  incrementResetCamera: () => {
    set((state) => ({ resetCameraKey: state.resetCameraKey + 1 }));
  },

  getStallCount: () => {
    const { category, dimensions } = get();
    if (category !== "toilet_cubicle") return 0;
    // Width determines the number of stalls (each stall needs approx 800 - 1100 mm width)
    if (dimensions.width <= 1100) return 1;
    if (dimensions.width <= 2100) return 2;
    if (dimensions.width <= 3100) return 3;
    return 4;
  },

  getLockerGrid: () => {
    const { category, dimensions } = get();
    if (category !== "locker_system") return { cols: 0, rows: 0 };
    // Standard locker width is approx 350-450mm, height is 400-500mm
    const cols = Math.max(2, Math.min(8, Math.round(dimensions.width / 400)));
    const rows = Math.max(2, Math.min(5, Math.round(dimensions.height / 450)));
    return { cols, rows };
  },

  getEstimatedPriceRange: () => {
    const { category, model, dimensions, materials, accessories, getStallCount, getLockerGrid } = get();
    
    let baseCost = 10000;

    // Material type multiplier
    const materialTypeMulti = materials.type === "hpl" ? 1.25 : 1.0; // HPL is more premium

    // Finish multiplier
    const finishCosts = {
      cream: 0,
      sage: 1200,
      purple: 1800,
      oak: 2500, // natural wood veneer/oak
      charcoal: 1500
    };
    const finishCost = finishCosts[materials.finish] || 0;

    // Hardware finish
    const hwCosts = {
      brass: 3500, // gold knob / handles
      chrome: 1800,
      black: 2200
    };
    const hwCost = hwCosts[materials.hardware] || 0;

    if (category === "toilet_cubicle") {
      const stalls = getStallCount();
      // Cost per stall (doors + partition dividers)
      const costPerStall = 18000 + (dimensions.depth / 1000) * 4000;
      baseCost = stalls * costPerStall;

      // Model factor
      if (model === "arch") {
        baseCost += stalls * 3000; // Arched top doors and thick rounded pilasters need CNC work
      }

      // Accessories
      if (accessories.indicatorLock) baseCost += stalls * 800;
      if (accessories.coatHook) baseCost += stalls * 300;
      if (accessories.supportLeg) baseCost += stalls * 1500;
      if (accessories.ledBacklight) baseCost += 2500; // LED border glow
      
      baseCost += (stalls + 1) * hwCost; // hardware handles per divider/pillar

    } else if (category === "toilet_partition") {
      // Single divider screen
      baseCost = 6000 + (dimensions.depth / 1000) * (dimensions.height / 1000) * 3500;
      if (model === "arch") baseCost += 1500;
      
      if (accessories.supportLeg) baseCost += 1200;
      if (accessories.bracketClamps) baseCost += 600;
      baseCost += hwCost * 0.5;

    } else if (category === "locker_system") {
      const { cols, rows } = getLockerGrid();
      const compartments = cols * rows;
      
      // Cost per locker compartment (doors + hinges + backing)
      const costPerCompartment = 3200 + (dimensions.depth / 1000) * 1200;
      baseCost = compartments * costPerCompartment;

      // Add accessories per compartment
      if (accessories.goldKnob) baseCost += compartments * 400;
      if (accessories.keyLock) baseCost += compartments * 600;
      if (accessories.digitalLock) baseCost += compartments * 2500;
      if (accessories.numberPlate) baseCost += compartments * 150;

      baseCost += hwCost * 0.2 * compartments;
    }

    baseCost = Math.round(baseCost * materialTypeMulti) + finishCost;

    // Price range: ±8%
    const lower = Math.round((baseCost * 0.95) / 500) * 500;
    const upper = Math.round((baseCost * 1.12) / 500) * 500;

    return { min: lower, max: upper };
  },

  getConfigJson: () => {
    const { category, model, dimensions, materials, accessories } = get();
    return JSON.stringify({ category, model, dimensions, materials, accessories }, null, 2);
  }
}));
