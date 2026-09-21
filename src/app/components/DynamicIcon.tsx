import React from "react";
import {
  Plane,
  ShoppingBag,
  Building2,
  Home,
  Factory,
  Globe,
  Shield,
  Award,
  Target,
  Lightbulb,
  type LucideProps
} from "lucide-react";

export const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Plane,
  ShoppingBag,
  Building2,
  Home,
  Factory,
  Globe,
  Shield,
  Award,
  Target,
  Lightbulb,
};

export function DynamicIcon({ name, ...props }: { name?: string | null } & LucideProps) {
  const Icon = ICON_MAP[name || "Building2"] || Building2;
  return <Icon {...props} />;
}
