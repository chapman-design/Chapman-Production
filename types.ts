export type SectionType = 'standard' | 'gallery' | 'map' | 'locations_list' | 'reviews_list';

export interface GalleryImage {
  file: string;
  caption: string;
}

export interface ReviewItem {
  quote: string;
  author: string;
  location?: string;
  projectType?: string;
  source?: 'Houzz' | 'Google' | 'Direct' | 'Yelp' | 'Client Letter' | string;
  sourceUrl?: string;
  rating?: number;
  year?: string;
}

export interface ExternalReviewBadge {
  platform: 'Houzz' | 'Google' | 'Yelp' | 'Direct' | string;
  url: string;
  label?: string;
  ratingNote?: string;
}

export interface Section {
  type: SectionType;
  title?: string;
  content?: string;
  image?: string;
  imageCaption?: string;
  images?: GalleryImage[];
  pos?: 'left' | 'right';
  isSpecial?: boolean;
  locations?: { city: string; count: number }[];
  reviews?: ReviewItem[];
  badges?: ExternalReviewBadge[];
}

export interface PageData {
  page_title: string;
  seo_title?: string;
  meta_description?: string;
  sections: Section[];
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'houzz' | 'linkedin' | 'pinterest' | 'twitter';
  url: string;
}

export interface SiteSettings {
  name: string;
  phone: string;
  address: string;
  email: string;
  tagline: string;
  footer_description: string;
  logo?: string;
  social_links: SocialLink[];
}

export interface SiteData {
  site_settings: SiteSettings;
  pages: {
    [key: string]: PageData;
  };
}
