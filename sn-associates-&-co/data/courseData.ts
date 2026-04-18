import { Product } from '../types';

export const courses: Product[] = [
  {
    id: '1',
    title: 'Complete GST Practitioner Guide 2025',
    type: 'E-Book',
    price: 499,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff0a77?auto=format&fit=crop&q=80&w=800',
    description: 'A comprehensive guide to becoming a GST practitioner, covering registration, returns, and audits. Perfect for accountants and students.',
    rating: 4.8,
    students: 1240,
    author: "Nagendra M",
    updatedDate: "Jan 2025",
    language: "English",
    features: ['Updated for 2025', '200+ Pages', 'Practical Examples'],
    content: [
      { title: "Introduction to GST", items: ["Concept of Supply", "Charge of GST", "Composition Levy"] },
      { title: "Registration", items: ["Persons liable for registration", "Procedure for registration", "Amendment of registration"] },
      { title: "Returns", items: ["Furnishing details of outward supplies", "Furnishing details of inward supplies", "First Return"] }
    ]
  },
  {
    id: '2',
    title: 'Income Tax Filing Masterclass',
    type: 'Course',
    price: 2499,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1554224154-260327c00c40?auto=format&fit=crop&q=80&w=800',
    description: 'Video course covering ITR-1 to ITR-7 filing with live portal demonstrations. Learn to file taxes like a pro.',
    rating: 4.9,
    students: 850,
    author: "CA Team SN",
    updatedDate: "Feb 2025",
    language: "English & Hindi",
    features: ['10 Hours Content', 'Live Demo', 'Certificate'],
    content: [
      { title: "Basics of Income Tax", items: ["Previous Year vs Assessment Year", "Heads of Income", "Deductions under Chapter VI-A"] },
      { title: "Filing ITR-1 (Sahaj)", items: ["Who can file ITR-1?", "Step-by-step filing on portal", "Verification"] },
      { title: "Capital Gains", items: ["Short Term vs Long Term", "Exemptions", "ITR-2 Filing Demo"] }
    ]
  },
  {
    id: '3',
    title: 'Startup Legal Toolkit',
    type: 'E-Book',
    price: 999,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    description: 'Essential legal templates and checklists for Indian founders and entrepreneurs. Save lakhs on legal fees.',
    rating: 4.7,
    students: 2100,
    author: "Legal Team SN",
    updatedDate: "Dec 2024",
    language: "English",
    features: ['50+ Templates', 'Founder Agreements', 'Drafts'],
    content: [
      { title: "Agreements", items: ["Founders Agreement", "Employment Agreement", "NDA Template"] },
      { title: "Policies", items: ["Privacy Policy", "Terms of Use", "HR Policy Manual"] }
    ]
  },
  {
    id: '4',
    title: 'Company Incorporation Handbook',
    type: 'E-Book',
    price: 399,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    description: 'Step-by-step guide to registering Pvt Ltd, LLP, and OPC in India using the SPICe+ form.',
    rating: 4.6,
    students: 500,
    author: "Nagendra M",
    updatedDate: "Jan 2025",
    language: "English",
    features: ['SPICe+ Forms', 'Process Flow', 'Documents List'],
    content: [
      { title: "Pre-Incorporation", items: ["Name Reservation", "DSC & DIN", "MoA & AoA Drafting"] },
      { title: "Filing Process", items: ["Agile Pro", "SPICe+ Part A & B", "PAN & TAN"] }
    ]
  },
  {
    id: '5',
    title: 'MSME Benefits & Registration',
    type: 'E-Book',
    price: 299,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
    description: 'Unlock government schemes, subsidies, and loans available for MSMEs. A must-read for small business owners.',
    rating: 4.8,
    students: 3000,
    author: "SN Associates",
    updatedDate: "Jan 2025",
    language: "English",
    features: ['Udyam Guide', 'Subsidies List', 'Loan Schemes'],
    content: [
      { title: "Udyam Registration", items: ["Eligibility", "Portal Walkthrough", "Certificate Download"] },
      { title: "Benefits", items: ["Collateral Free Loans", "Subsidy Schemes", "Payment Protection"] }
    ]
  },
  {
    id: '6',
    title: 'Tally Prime for Accountants',
    type: 'Course',
    price: 1999,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    description: 'Master Tally Prime from scratch. Accounting, Inventory, and GST compliance module included.',
    rating: 4.9,
    students: 1500,
    author: "Expert Tally Trainer",
    updatedDate: "Feb 2025",
    language: "English",
    features: ['Practical Scenarios', 'Shortcut Keys', 'GST Setup'],
    content: [
      { title: "Getting Started", items: ["Company Creation", "Ledger Groups", "Voucher Entry"] },
      { title: "GST in Tally", items: ["Enabling GST", "Recording Sales/Purchase", "Generating E-Way Bill"] }
    ]
  },
  {
    id: '7',
    title: 'Professional Taxation Internship',
    type: 'Internship',
    price: 4999,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff0a77?auto=format&fit=crop&q=80&w=800',
    description: '3-month practical internship on live GST and Income Tax portals. Certified by SN Associates.',
    rating: 5.0,
    students: 150,
    author: "Nagendra M",
    updatedDate: "Feb 2025",
    language: "English",
    features: ['Live Portal Access', 'Client Handling', 'Certification'],
    content: [
      { title: "Month 1", items: ["GST Basics", "Registration Process", "Return Filing"] },
      { title: "Month 2", items: ["Income Tax Filing", "TDS Returns", "Tax Planning"] }
    ]
  },
  {
    id: '8',
    title: 'Web Development Internship',
    type: 'Internship',
    price: 6999,
    originalPrice: 14999,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    description: 'Learn to build professional business websites using React and Next.js. Work on live projects.',
    rating: 4.9,
    students: 85,
    author: "Tech Team SN",
    updatedDate: "Feb 2025",
    language: "English",
    features: ['Live Projects', 'Frontend Mastery', 'Portfolio Building'],
    content: [
      { title: "Basics", items: ["HTML/CSS Refresher", "React Hooks", "State Management"] },
      { title: "Projects", items: ["Landing Page Build", "E-commerce Integration", "Deployment"] }
    ]
  }
];