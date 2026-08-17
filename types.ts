export type SectionType = 'standard' | 'gallery' | 'map';

export interface GalleryImage {
  file: string;
  caption: string;
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
}

export interface PageData {
  page_title: string;
  seo_title: string;
  meta_description: string;
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
