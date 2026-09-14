/**
 * Centralized Social Media Configuration for SN Associates & Co.
 */
export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  description: string;
  color: string;
  iconName: 'linkedin' | 'instagram' | 'twitter' | 'youtube' | 'facebook' | 'whatsapp';
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/sn-associates-co/',
    handle: '@sn-associates-co',
    description: 'Corporate announcements, GST circulars & tax jurisprudence',
    color: '#0a66c2',
    iconName: 'linkedin'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/snassociates.co/',
    handle: '@snassociates.co',
    description: 'Bite-sized tax tips, compliance reels & startup guides',
    color: '#e4405f',
    iconName: 'instagram'
  },
  {
    name: 'X (Twitter)',
    url: 'https://x.com/snassociates_co',
    handle: '@snassociates_co',
    description: 'Breaking MCA, CBDT & CBIC statutory circulars in real-time',
    color: '#000000',
    iconName: 'twitter'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@snassociates',
    handle: '@snassociates',
    description: 'Video masterclasses, live portal walkthroughs & webinars',
    color: '#ff0000',
    iconName: 'youtube'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/snassociates.co',
    handle: 'SN Associates & Co',
    description: 'Client stories, firm milestones & SME advisories',
    color: '#1877f2',
    iconName: 'facebook'
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/917406581456?text=Hello%20SN%20Associates%20%26%20Co%2C%20I%20would%20like%20to%20consult%20regarding%20tax%20and%20legal%20services.',
    handle: '+91 7406581456',
    description: 'Direct instant advisory & document submission with CA team',
    color: '#25d366',
    iconName: 'whatsapp'
  }
];
