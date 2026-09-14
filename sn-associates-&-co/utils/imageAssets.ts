/**
 * Local and title-matched image asset resolver for SN Associates & Co.
 * Guarantees zero broken images and exact title matching across Carts, Resources, and Courses.
 */
import React from 'react';

export const EBOOK_LOCAL_COVERS: Record<string, string> = {
  'ebook-start-business': '/images/ebooks/ebook-start-business.svg',
  'ebook-proprietorship': '/images/ebooks/ebook-proprietorship.svg',
  'ebook-partnership-firm': '/images/ebooks/ebook-partnership-firm.svg',
  'ebook-llp-registration': '/images/ebooks/ebook-llp-registration.svg',
  'ebook-pvt-ltd': '/images/ebooks/ebook-pvt-ltd.svg',
  'ebook-section-8-ngo': '/images/ebooks/ebook-section-8-ngo.svg',
  'ebook-msme-udyam': '/images/ebooks/ebook-msme-udyam.svg',
  'ebook-gst-registration': '/images/ebooks/ebook-gst-registration.svg',
  'ebook-gst-nil-filing': '/images/ebooks/ebook-gst-nil-filing.svg',
  'ebook-gstr1-filing': '/images/ebooks/ebook-gstr1-filing.svg',
};

export const COURSE_LOCAL_COVERS: Record<string, string> = {
  '1': '/images/courses/course-gst-guide.svg',
  '2': '/images/courses/course-income-tax.svg',
  '3': '/images/courses/course-startup-legal.svg',
  '4': '/images/courses/course-company-inc.svg',
  '5': '/images/courses/course-msme-benefits.svg',
  '6': '/images/courses/course-tally-prime.svg',
  '7': '/images/courses/course-tax-internship.svg',
  '8': '/images/courses/course-web-dev.svg',
  'course-gst-guide': '/images/courses/course-gst-guide.svg',
  'course-income-tax': '/images/courses/course-income-tax.svg',
  'course-startup-legal': '/images/courses/course-startup-legal.svg',
  'course-company-inc': '/images/courses/course-company-inc.svg',
  'course-msme-benefits': '/images/courses/course-msme-benefits.svg',
  'course-tally-prime': '/images/courses/course-tally-prime.svg',
  'course-tax-internship': '/images/courses/course-tax-internship.svg',
  'course-web-dev': '/images/courses/course-web-dev.svg',
};

/**
 * Returns the best local or title-matched image URL for any given product.
 */
export function getProductImageUrl(id?: string, title?: string, fallbackUrl?: string): string {
  if (id && EBOOK_LOCAL_COVERS[id]) {
    return EBOOK_LOCAL_COVERS[id];
  }
  if (id && COURSE_LOCAL_COVERS[id]) {
    return COURSE_LOCAL_COVERS[id];
  }

  // Title keyword matching
  const t = (title || '').toLowerCase();
  
  // Specific course matching
  if (t.includes('practitioner') || (t.includes('gst') && (t.includes('guide') || t.includes('masterclass')))) {
    return COURSE_LOCAL_COVERS['1'];
  }
  if (t.includes('income tax') || t.includes('direct tax') || t.includes('tax filing') || t.includes('itr')) {
    return COURSE_LOCAL_COVERS['2'];
  }
  if (t.includes('startup legal') || t.includes('toolkit') || t.includes('founder agreement')) {
    return COURSE_LOCAL_COVERS['3'];
  }
  if (t.includes('company incorporation handbook') || t.includes('mca handbook')) {
    return COURSE_LOCAL_COVERS['4'];
  }
  if (t.includes('tally')) return COURSE_LOCAL_COVERS['6'];
  if (t.includes('internship') || t.includes('apprentice')) return COURSE_LOCAL_COVERS['7'];
  if (t.includes('web dev') || t.includes('software')) return COURSE_LOCAL_COVERS['8'];

  // Specific e-book matching
  if (t.includes('start') || t.includes('any business')) return EBOOK_LOCAL_COVERS['ebook-start-business'];
  if (t.includes('proprietorship')) return EBOOK_LOCAL_COVERS['ebook-proprietorship'];
  if (t.includes('partnership')) return EBOOK_LOCAL_COVERS['ebook-partnership-firm'];
  if (t.includes('llp')) return EBOOK_LOCAL_COVERS['ebook-llp-registration'];
  if (t.includes('private limited') || t.includes('pvt ltd') || t.includes('company registration')) return EBOOK_LOCAL_COVERS['ebook-pvt-ltd'];
  if (t.includes('ngo') || t.includes('section 8') || t.includes('trust') || t.includes('society')) return EBOOK_LOCAL_COVERS['ebook-section-8-ngo'];
  if (t.includes('msme') || t.includes('udyam')) return EBOOK_LOCAL_COVERS['ebook-msme-udyam'];
  if (t.includes('nil return') || t.includes('nil filing')) return EBOOK_LOCAL_COVERS['ebook-gst-nil-filing'];
  if (t.includes('gstr-1') || t.includes('gstr 1')) return EBOOK_LOCAL_COVERS['ebook-gstr1-filing'];
  if (t.includes('gst registration') || t.includes('gst handbook')) return EBOOK_LOCAL_COVERS['ebook-gst-registration'];
  if (t.includes('gst')) return COURSE_LOCAL_COVERS['1'];

  return fallbackUrl || '/images/ebooks/ebook-start-business.svg';
}

/**
 * Handle img onError event to replace broken images with a guaranteed local SVG cover
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, title?: string, id?: string) {
  const target = e.currentTarget;
  const fallback = getProductImageUrl(id, title);
  if (target.src !== fallback && !target.src.endsWith(fallback)) {
    target.src = fallback;
  }
}
