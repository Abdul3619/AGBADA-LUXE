// House photos as responsive WebP (640 and 896 px wide; the originals are 896 px).
import hero640 from '../assets/images/hero-agbada-640.webp';
import hero896 from '../assets/images/hero-agbada-896.webp';
import bespoke640 from '../assets/images/bespoke-suit-640.webp';
import bespoke896 from '../assets/images/bespoke-suit-896.webp';
import ceremonial640 from '../assets/images/ceremonial-640.webp';
import ceremonial896 from '../assets/images/ceremonial-896.webp';

export interface ResponsiveImage {
  src: string;
  srcSet: string;
}

const make = (small: string, large: string): ResponsiveImage => ({ src: large, srcSet: `${small} 640w, ${large} 896w` });

export const IMAGES = {
  hero: make(hero640, hero896),
  bespoke: make(bespoke640, bespoke896),
  ceremonial: make(ceremonial640, ceremonial896),
};
