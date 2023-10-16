import { GameState } from ".";
import type { EffectName } from "./Colony/ColonyManager";

const ResourceTypes = [
  "fuel",
  "minerals",
  "biotic materials",
  "machinery",
  "nanotechnologies",
  "dark matter",
] as const;

export type ResourcePrimitive = (typeof ResourceTypes)[number];

export const isResourcePrimitive = (option: string): option is ResourcePrimitive => 
ResourceTypes.includes(option as any);

export const isCardType = (option: string): option is CardType =>
  ["delivery", "engineering", "terraforming", "military"].includes(option);

export const isSelectableEngineeringCard = (
  value: unknown
): value is SelectableEngineeringCard => {
  return (
    typeof value === "object" &&
    !!value &&
    "isSelected" in value &&
    "id" in value &&
    "type" in value &&
    value.type === "engineering" &&
    "connection" in value &&
    "name" in value
  );
};

export type Resource = ResourcePrimitive | ResourcePrimitive[];

export type CardDefinition =
  | DeliveryCard
  | EngineeringCard
  | TerraformingCard
  | MilitaryCard;

export type CardType = "delivery" | "engineering" | "terraforming" | "military";

export interface DeliveryCard {
  id: number;
  type: "delivery";
  resources: /*ResourcePrimitive | */ ResourcePrimitive[];
  // points: number
}

export interface EngineeringCard {
  id: number;
  type: "engineering";
  connection: "start" | "continue" | "end";
  entryPoint?: Resource;
  exitPoint?: Resource[];
  points?: number;
  name: string;
}

export type SelectableEngineeringCard = EngineeringCard & {
  isSelected: boolean;
};

export interface TerraformingCard {
  name: string;
  id: number;
  type: "terraforming";
  resources: Resource[];
  points: number;
}

export interface MilitaryCard {
  id: number;
  type: "military";
  weapon: "orbital" | "intelligence" | "fighters" | "spaceborne";
  name: string;
  // points: number
}

export type EffectActivateFn = (gameState: GameState) => Promise<unknown>;

export type FullTrigger = {
  activate: EffectActivateFn;
  effects: EffectName[];
};

export type Trigger =
  | EffectName
  | EffectActivateFn
  | EffectName[]
  | FullTrigger;

export const TriggerNames = ["before", "after", "during", "beforeSelect", "afterSelect"] as const;

export type TriggerName = (typeof TriggerNames)[number]

export interface ColonyCard {
  id: number;
  type: "colony";
  benefit: string;
  mutateAction: CardType;
  data?: unknown;
  players?: number;
  name: string;
  triggers: {
    [key in TriggerName]?: Trigger
  }
}

export const expandTrigger = (trigger?: Trigger): FullTrigger => {
  if (!trigger) {
    return { activate: async () => {}, effects: [] };
  }
  if (typeof trigger === "function") {
    return { activate: trigger, effects: [] };
  }
  if (Array.isArray(trigger)) {
    return { activate: async () => {}, effects: trigger };
  }
  if (typeof trigger === "string") {
    return { activate: async () => {}, effects: [trigger] };
  }
  return trigger;
};
