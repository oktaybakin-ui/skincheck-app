import {
  Droplet, Wind, Scale, Flower, Circle, Thermometer,
  Eye, CircleDot, Flower2, Ruler, Sparkles, Blend, Smile,
  Moon, Pipette, Maximize, Clock, Palette, Pen, Brush,
  Sun, Heart, ShieldCheck, Gem, Wand2, Scissors, Target,
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
  "goz-alti-morluklari": Moon,
  "akne-kapatma": Pipette,
  "genis-gozenekler": Maximize,
  "kizariklik-rozasea": Flower2,
  "yuz-sekillendirme": Ruler,
  "yas-belirtileri": Clock,
  "esit-olmayan-cilt-tonu": Palette,
  "ince-dudaklar": Smile,
  "smokey-eye": Eye,
  "dogal-no-makeup": Sparkles,
  "kas-sekillendirme": Pen,
  "eyeliner-teknikleri": Brush,
  "allik-uygulama": Heart,
  "goz-fari-baslangic": CircleDot,
  "bronzlasma-efekti": Sun,
  "kirpik-bakim": Scissors,
  "yaglanma-kontrolu": Droplet,
  "gelinlik-makyaji": Gem,
  "ten-rengi-eslesme": Target,
  "dudak-bakimi": Blend,
  "hassas-cilt-makyaji": Flower,
  "goz-kapagi-dusukluğu": Eye,
  "makyaj-sabitleme": ShieldCheck,
};
