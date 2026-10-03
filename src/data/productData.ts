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
    title: 'Noir Fashion Vault',
    subtitle: '48 Editorial Raw Photos',
    price: '$29',
    salesCount: 142,
    image: 'https://res.cloudinary.com/z8ule8ik/image/upload/v1786828453/3392_utfvxc.jpg',
    cover: 'editorial',
    alt: 'Noir Fashion Vault product preview',
    objectPosition: 'center 14%',
    photo: 'images/product-fashion-v2.webp',
    photoPositionCard: 'center 40%',
    photoPositionPhone: 'center top',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
  {
    id: 'card-2',
    type: 'MP4',
    title: 'Cinematic LUTs & Clips',
    subtitle: '4K Anamorphic Video Suite',
    price: '$49',
    salesCount: 98,
    image: 'https://res.cloudinary.com/z8ule8ik/image/upload/v1786828452/2148532578_vfghnf.jpg',
    cover: 'cinematic',
    alt: 'Cinematic LUTs & Clips product preview',
    objectPosition: 'center 20%',
    photo: 'images/product-cinematic-v2.webp',
    photoPositionCard: '50% 42%',
    photoPositionPhone: 'center 40%',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
  {
    id: 'card-3',
    type: 'PDF',
    title: 'Brand Strategy System',
    subtitle: '62-Page Interactive Guide',
    price: '$19',
    salesCount: 310,
    image: 'https://res.cloudinary.com/z8ule8ik/image/upload/v1786828451/2149445952_jj14nb.jpg',
    cover: 'blueprint',
    alt: 'Brand Strategy System product preview',
    objectPosition: 'center 22%',
    photo: 'images/product-brand-v2.webp',
    photoPositionCard: 'center',
    photoPositionPhone: 'center 52%',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
  {
    id: 'card-4',
    type: 'EPUB',
    title: 'Creator Playbook 2026',
    subtitle: 'Monetization Secrets',
    price: '$12',
    salesCount: 520,
    image: 'https://res.cloudinary.com/z8ule8ik/image/upload/v1786828451/2151912390_ghkexn.jpg',
    cover: 'playbook',
    alt: 'Creator Playbook 2026 product preview',
    objectPosition: 'center 18%',
    photo: 'images/product-playbook-v2.webp',
    photoPositionCard: 'center',
    photoPositionPhone: 'center 42%',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
  {
    id: 'card-5',
    type: 'ZIP',
    title: 'Dark Luxury 3D Kit',
    subtitle: 'Presets & Figma Tokens',
    price: '$39',
    salesCount: 215,
    image: 'https://res.cloudinary.com/z8ule8ik/image/upload/v1786828451/262_s5yogz.jpg',
    cover: 'facet',
    alt: 'Dark Luxury 3D Kit product preview',
    objectPosition: 'center 18%',
    photo: 'images/product-kit-v2.webp',
    photoPositionCard: 'center',
    photoPositionPhone: 'center 40%',
    badgeColor: 'bg-[#20B777]/10 text-[#7AE9B4] border-[#20B777]/25',
  },
];

export const SNAPSELL_LOGO_URL = "https://res.cloudinary.com/z8ule8ik/image/upload/v1785615194/Untitled_design_1_ivx5bi.png";
