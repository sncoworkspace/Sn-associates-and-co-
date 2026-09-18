import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  keywords?: string[];
  schemaData?: Record<string, any> | Array<Record<string, any>>;
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  keywords = [],
  schemaData,
}) => {
  const brand = 'SN Associates & Co';
  const siteTitle = title.includes('SN Associates') ? title : `${title} | ${brand}`;
  const defaultUrl = 'https://snassociatesandco.com';
  const canonical = canonicalUrl ? `${defaultUrl}${canonicalUrl}` : defaultUrl;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: brand,
    image: 'https://snassociatesandco.com/logo.png',
    '@Id': 'https://snassociatesandco.com',
    url: 'https://snassociatesandco.com',
    telephone: '+91 7406581456',
    priceRange: '₹₝',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bangalore Business District',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9716,
      longitude: 77.5946
    }
  };

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://snassociatesandco.com/logo.png" />
      <meta property="og:site_name" content={brand} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://snassociatesandco.com/logo.png" />


      <script type="application/ld+json">
        {JSON.stringify(schemaData || defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;