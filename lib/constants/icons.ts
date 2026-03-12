import {
  Droplet, Wind, Scale, Flower, Circle, Thermometer,
  Eye, CircleDot, Flower2, Ruler, Sparkles, Blend, Smile,
  LucideIcon,
} from "lucide-react";

export const SKIN_TYPE_ICONS: Record<string, LucideIcon> = {
  oily: Droplet,
  dry: Wind,
  combination: Scale,
  sensitive: Flower,
  acne_prone: Circle,
  rosacea: Thermometer,
};

export const SOLUTION_ICONS: Record<string, LucideIcon> = {
  "goz-alti-morluklari": Eye,
  "akne-kapatma": Circle,
  "genis-gozenekler": CircleDot,
  "kizariklik-rozasea": Flower2,
  "yuz-sekillendirme": Ruler,
  "yas-belirtileri": Sparkles,
  "esit-olmayan-cilt-tonu": Blend,
  "ince-dudaklar": Smile,
};
