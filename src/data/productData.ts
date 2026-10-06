export interface ProductCardData {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  price: string;
  salesCount: number;
  image: string;
  /** Self-contained SVG cover variant (see ProductCover) */
  cover: 'editorial' | 'cinematic' | 'blueprint' | 'playbook' | 'facet';
  alt: string;
  objectPosition?: string;
  /** Optional bundled photo (public/images). When set it replaces the SVG cover. */
  photo?: string;
  /** Crop for the portrait hero card */
  photoPositionCard?: string;
  /** Crop for the landscape slot inside the phone */
  photoPositionPhone?: string;
  badgeColor: string;
}

export const PRODUCTS: ProductCardData[] = [
  {
    id: 'card-1',
    type: 'JPG',
    title: 'Noir Muse Collection',
    subtitle: '48 Editorial Raw Photos',
    price: '$29',
    salesCount: 142,
    image: 'images/product-noir-muse.jpg',
    cover: 'editorial',
    alt: 'Noir Muse Collection product preview',
    objectPosition: 'center 20%',
    photo: 'images/product-noir-muse.jpg',
    photoPositionCard: 'center 18%',
    photoPositionPhone: 'center top',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
  {
    id: 'card-2',
    type: 'MP4',
    title: 'Afterdark Cinema Pack',
    subtitle: '4K Anamorphic Video Suite',
    price: '$49',
    salesCount: 98,
    image: 'images/product-afterdark.jpg',
    cover: 'cinematic',
    alt: 'Afterdark Cinema Pack product preview',
    objectPosition: 'center 40%',
    photo: 'images/product-afterdark.jpg',
    photoPositionCard: 'center 40%',
    photoPositionPhone: 'center 40%',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
  {
    id: 'card-3',
    type: 'PDF',
    title: 'Brand Identity Blueprint',
    subtitle: '62-Page Interactive Guide',
    price: '$19',
    salesCount: 310,
    image: 'images/product-brand-blueprint.jpg',
    cover: 'blueprint',
    alt: 'Brand Identity Blueprint product preview',
    objectPosition: 'center 55%',
    photo: 'images/product-brand-blueprint.jpg',
    photoPositionCard: 'center 55%',
    photoPositionPhone: 'center 52%',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
  {
    id: 'card-4',
    type: 'EPUB',
    title: 'Creator Growth Playbook',
    subtitle: 'Monetization Secrets',
    price: '$12',
    salesCount: 520,
    image: 'images/product-creator-playbook.jpg',
    cover: 'playbook',
    alt: 'Creator Growth Playbook product preview',
    objectPosition: 'center 30%',
    photo: 'images/product-creator-playbook.jpg',
    photoPositionCard: 'center 30%',
    photoPositionPhone: 'center 42%',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
  {
    id: 'card-5',
    type: 'ZIP',
    title: 'Emerald Design Kit',
    subtitle: 'Presets & Figma Tokens',
    price: '$39',
    salesCount: 215,
    image: 'images/product-kit-v2.webp',
    cover: 'facet',
    alt: 'Emerald Design Kit product preview',
    objectPosition: 'center 18%',
    photo: 'images/product-kit-v2.webp',
    photoPositionCard: 'center',
    photoPositionPhone: 'center 40%',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
];

export const SNAPSELL_LOGO_URL = "https://res.cloudinary.com/z8ule8ik/image/upload/v1785615194/Untitled_design_1_ivx5bi.png";
