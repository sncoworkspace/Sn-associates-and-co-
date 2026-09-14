import { Product } from '../types';

export const courses: Product[] = [
  // 10 Core Business E-Books (All ₹299 each)
  {
    id: 'ebook-start-business',
    title: 'How to Start Any Business in India – Legal + Practical Guide',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-start-business.svg',
    description: 'A clean and visually engaging infographic that outlines the key steps to start a business in India, combining legal requirements such as company registration, GST, and licenses with practical elements like business planning, market research, and funding, making it an ideal quick-reference guide for beginners looking for a clear and structured roadmap to launch their venture successfully.',
    rating: 4.9,
    students: 3120,
    author: 'CA Nagendra M & Legal Team',
    updatedDate: '2025',
    language: 'English',
    features: ['Infographic Roadmap', 'ROC Guidelines', 'Immediate PDF Access'],
    driveLink: 'https://drive.google.com/file/d/1cLZcfoQ2gpWe-CCKo0yZR4Vd_P0ybuBs/view?usp=sharing',
    content: [
      { title: 'Choosing Business Structure', items: ['Proprietorship vs LLP vs Pvt Ltd', 'Name Approval on MCA portal'] },
      { title: 'Statutory Licenses', items: ['GST, PAN, TAN & MSME / Udyam Registration', 'Current Account Setup'] }
    ]
  },
  {
    id: 'ebook-proprietorship',
    title: 'Proprietorship Registration for all types of business',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-proprietorship.svg',
    description: 'A simple step-by-step guide to Proprietorship Registration for any type of business, covering key essentials like PAN, Aadhaar, bank account, and required licenses such as GST or Shop Act. It explains the complete process from choosing a business name to obtaining registrations and starting operations quickly and compliantly.',
    rating: 4.8,
    students: 2840,
    author: 'Team SN Associates',
    updatedDate: '2025',
    language: 'English',
    features: ['Complete Checklist', 'Zero-Error Documentation', 'Downloadable PDF'],
    driveLink: 'https://drive.google.com/file/d/1gDBmilJO6l8xNdXKV5sb1tf1X6nZbnI0/view?usp=drive_link',
    content: [
      { title: 'Documentation & ID Proofs', items: ['Aadhaar, PAN & Address Proof requirements', 'Trade Name Selection'] },
      { title: 'Tax & License Procedures', items: ['Udyam/MSME Registration process', 'GST threshold and application'] }
    ]
  },
  {
    id: 'ebook-partnership-firm',
    title: 'Partnership Firm Registration + Sample Deed',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-partnership-firm.svg',
    description: 'Partnership Firm Registration covers name selection, deed drafting, and the registration process, including a simple sample deed with key clauses like profit sharing and roles.',
    rating: 4.9,
    students: 1980,
    author: 'Advocate & CA Legal Cell',
    updatedDate: '2025',
    language: 'English',
    features: ['Sample Partnership Deed', 'Notarization Guide', 'Firm PAN & GST Roadmap'],
    driveLink: 'https://drive.google.com/file/d/19_mzelz-MjJyCfCDVkiqj59fNuLjVbv3/view?usp=drive_link',
    content: [
      { title: 'Drafting Partnership Deed', items: ['Capital Contribution Clauses', 'Profit & Loss Sharing Ratios', 'Dispute Resolution'] },
      { title: 'Registrar of Firms (ROF)', items: ['Application Form 1', 'Stamp Duty Calculation & Notarization'] }
    ]
  },
  {
    id: 'ebook-llp-registration',
    title: 'LLP Registration Guide – Documents + Compliance',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-llp-registration.svg',
    description: 'LLP registration includes essential documents like PAN, Aadhaar, address proof, and partner details, along with the incorporation process and key compliances such as annual filing, ROC returns, and record maintenance.',
    rating: 4.8,
    students: 1650,
    author: 'Corporate Legal Team',
    updatedDate: '2025',
    language: 'English',
    features: ['LLP Agreement Checklist', 'MCA Portal Filing', 'ROC Annual Filing Matrix'],
    driveLink: 'https://drive.google.com/file/d/19WkkcpVMF9bjeHep7AfYltqDUHA7qqMZ/view?usp=drive_link',
    content: [
      { title: 'Incorporation Stages', items: ['DPIN & DSC procurement', 'RUN-LLP Name Reservation', 'FiLLiP Form Filing'] },
      { title: 'Post-Incorporation Compliance', items: ['Form 3 Agreement Filing', 'Form 11 Annual Return', 'Form 8 Statement of Accounts'] }
    ]
  },
  {
    id: 'ebook-pvt-ltd',
    title: 'Private Limited Company Registration',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-pvt-ltd.svg',
    description: 'Private Limited Company registration covers requirements, documents, and incorporation steps via MCA, along with important compliances like ROC filings and maintaining statutory records.',
    rating: 4.9,
    students: 2240,
    author: 'CA Nagendra M & MCA Team',
    updatedDate: '2025',
    language: 'English',
    features: ['SPICe+ Part A & B Guide', 'MOA & AOA Templates', 'Commencement of Business (INC-20A)'],
    driveLink: 'https://drive.google.com/file/d/1G7zj49eHsEWRhWfwYLvWsEmHDCZfKntR/view?usp=drive_link',
    content: [
      { title: 'Pre-Incorporation & SPICe+', items: ['Director DIN & DSC', 'Name Reservation', 'SPICe+ Part B Submission'] },
      { title: 'Mandatory Compliances', items: ['Auditor Appointment (ADT-1)', 'INC-20A Bank Account Opening', 'Board Meetings Protocol'] }
    ]
  },
  {
    id: 'ebook-section-8-ngo',
    title: 'Section 8 Company Registration for NGOs',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-section-8-ngo.svg',
    description: 'Section 8 Company registration for NGOs covers eligibility, required documents, and incorporation under the Companies Act. It also includes key compliances and benefits such as tax exemptions and recognized charitable status.',
    rating: 4.8,
    students: 1120,
    author: 'NGO & Charitable Trust Cell',
    updatedDate: '2025',
    language: 'English',
    features: ['License Under Section 8', '12A & 80G Tax Exemption Guide', 'FCRA Compliance Roadmap'],
    driveLink: 'https://drive.google.com/file/d/1rOjADiz13N4vDc0F23Dyods8rsoVWGaJ/view?usp=drive_link',
    content: [
      { title: 'NGO Incorporation', items: ['Drafting Objects & Charitable Intent', 'RD License Application', 'MOA/AOA Section 8 Format'] },
      { title: 'Income Tax Exemptions', items: ['Form 10A / 10AB for 12A Registration', '80G Donor Tax Benefit Certificate', 'CSR Funding Eligibility'] }
    ]
  },
  {
    id: 'ebook-msme-udyam',
    title: 'MSME Udyam Registration Step-by-Step',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-msme-udyam.svg',
    description: 'MSME Udyam Registration covers the simple step-by-step online process using Aadhaar and PAN for business recognition. It provides benefits like government schemes, subsidies, and easier access to loans.',
    rating: 4.9,
    students: 3400,
    author: 'SME Advisory Council',
    updatedDate: '2025',
    language: 'English',
    features: ['Zero-Error Portal Walkthrough', 'Subsidy & Loan Matrix', 'TReDS Bill Discounting Access'],
    driveLink: 'https://drive.google.com/file/d/1sMqTm7Nsql-X4fA6ku-i2uINKxhcoRTZ/view?usp=drive_link',
    content: [
      { title: 'Online Registration', items: ['Aadhaar OTP Validation', 'PAN & ITR Data Fetching', 'NIC Code Classification'] },
      { title: 'MSME Benefits', items: ['Collateral-Free CGTMSE Loans', '45-Day Payment Rule (Sec 43B(h))', 'Govt Tender Preferences'] }
    ]
  },
  {
    id: 'ebook-gst-registration',
    title: 'GST Registration',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-gst-registration.svg',
    description: 'GST Registration involves obtaining a unique GSTIN by submitting PAN, Aadhaar, business details, and required documents on the GST portal. It enables legal tax collection, input tax credit benefits, and compliance with indirect tax laws.',
    rating: 4.9,
    students: 2950,
    author: 'GST Advisory Cell',
    updatedDate: '2025',
    language: 'English',
    features: ['REG-01 Application Walkthrough', 'Geo-Coding & Proof of Business Address', 'Aadhaar Biometric Authentication'],
    driveLink: 'https://drive.google.com/file/d/1YbcETdE7yYghWTkKVFMdAcUc6opWsHzx/view?usp=drive_link',
    content: [
      { title: 'Eligibility & Thresholds', items: ['₹40L Goods / ₹20L Services limits', 'Compulsory Registration Scenarios', 'Composition vs Regular'] },
      { title: 'Filing REG-01', items: ['Principal Place of Business', 'Authorized Signatory Verification', 'Handling SCN & Clarifications'] }
    ]
  },
  {
    id: 'ebook-gst-nil-filing',
    title: 'GST Nil Return Filing',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-gst-nil-filing.svg',
    description: 'GST Nil Return Filing involves submitting GSTR-1 and GSTR-3B even when there are no sales or purchases during the period. It ensures compliance, avoids penalties, and keeps your GST registration active.',
    rating: 4.8,
    students: 2100,
    author: 'Compliance Team SN',
    updatedDate: '2025',
    language: 'English',
    features: ['SMS Nil Filing Method', 'Portal 1-Click Nil Return', 'Penalty Avoidance Rules'],
    driveLink: 'https://drive.google.com/file/d/1XdGHGablfW7VHcdhSyvX4DnKlLMCPum8/view?usp=drive_link',
    content: [
      { title: 'Nil Filing Essentials', items: ['Conditions for qualifying for Nil Return', 'GSTR-3B Nil Filing on Portal', 'SMS Nil Filing using 14409'] },
      { title: 'Avoiding Penalties', items: ['Late fees calculation (₹20/day)', 'Impact of Non-Filing on E-Way Bill', 'Registration Cancellation Risks'] }
    ]
  },
  {
    id: 'ebook-gstr1-filing',
    title: 'How to File GSTR-1',
    type: 'E-Book',
    price: 299,
    originalPrice: 999,
    image: '/images/ebooks/ebook-gstr1-filing.svg',
    description: 'Filing GSTR-1 involves reporting all outward supplies (sales) on the GST portal by entering invoice details, debit/credit notes, and summary data. Timely filing ensures compliance and enables buyers to claim input tax credit.',
    rating: 4.9,
    students: 3180,
    author: 'Tax Automation Cell',
    updatedDate: '2025',
    language: 'English',
    features: ['Table 4 to Table 13 Line-by-Line Guide', 'B2B vs B2CS vs B2CL Reporting', 'HSN Summary & Document Issued Table'],
    driveLink: 'https://drive.google.com/file/d/1RSoFMTkLzRoXNwp503kAiXBL8WVfdH9_/view?usp=drive_link',
    content: [
      { title: 'Outward Supplies Reporting', items: ['B2B Invoices entry with GSTIN validation', 'Credit & Debit Notes (CDN)', 'Export & Zero-Rated Supplies'] },
      { title: 'Reconciliation & Submission', items: ['HSN Summary validation', 'GSTR-1 to GSTR-3B Auto-population', 'EVC & DSC Electronic Verification'] }
    ]
  },
  {
    id: '1',
    title: 'Complete GST Practitioner Guide 2025',
    type: 'E-Book',
    price: 499,
    originalPrice: 1999,
    image: '/images/courses/course-gst-guide.svg',
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
    image: '/images/courses/course-income-tax.svg',
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
    image: '/images/courses/course-startup-legal.svg',
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
    image: '/images/courses/course-company-inc.svg',
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
    image: '/images/courses/course-msme-benefits.svg',
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
    image: '/images/courses/course-tally-prime.svg',
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
    image: '/images/courses/course-tax-internship.svg',
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
    image: '/images/courses/course-web-dev.svg',
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