import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Scale, 
  Briefcase, 
  ChevronRight, 
  CheckCircle2,
  Phone,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Data Structure matching the screenshots provided
interface ServiceItemDetail {
  name: string;
  description: string;
}

interface ServiceGroup {
  groupTitle?: string;
  items: ServiceItemDetail[];
}

interface ServiceCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  content: ServiceGroup[];
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'incorporation',
    title: 'Business Entity Incorporations',
    icon: Building2,
    description: 'Start your business journey with the right legal structure.',
    content: [
      {
        groupTitle: 'For Indian Owners',
        items: [
          { name: 'Proprietory Concern', description: 'The simplest form of business entity owned and run by one individual. Ideal for small businesses with minimal compliance requirements.' },
          { name: 'Partnership Firms', description: 'A business structure for two or more partners to share profits and liabilities. Governed by the Partnership Act, 1932.' },
          { name: 'Limited Liability Partnership (LLP)', description: 'Combines the flexibility of a partnership with the limited liability status of a company. Partners are not responsible for each other\'s misconduct.' },
          { name: 'Private Limited Company', description: 'The most popular entity for startups and growing businesses. Offers separate legal identity, limited liability, and ease of raising funds.' },
          { name: 'One Person Company (OPC)', description: 'A hybrid structure allowing a single entrepreneur to operate as a corporate entity with limited liability protection.' },
          { name: 'Trust, Society, Section 8 Company', description: 'Structures for non-profit organizations, NGOs, and charitable institutions dedicated to promoting art, science, commerce, or social welfare.' }
        ]
      },
      {
        groupTitle: 'For Foreign Owners',
        items: [
          { name: 'Subsidiary Company', description: 'Incorporation of an Indian company where the majority of shares are held by a foreign parent company.' },
          { name: 'Branch & Liaison Office', description: 'Setup for foreign companies to explore the Indian market or promote their business without conducting direct commercial activities.' },
          { name: 'Wholly Owned Subsidiary', description: 'An entity where 100% of the shares are owned by the foreign parent company, allowing full control over Indian operations.' }
        ]
      }
    ]
  },
  {
    id: 'registration',
    title: 'Post Incorporation Registration',
    icon: FileText,
    description: 'Essential registrations to make your business compliant and operational.',
    content: [
      {
        items: [
          { name: 'PAN & TAN Application', description: 'Mandatory Permanent Account Number (PAN) and Tax Deduction Account Number (TAN) for business tax compliance.' },
          { name: 'GST Registration', description: 'Required for businesses with turnover above the threshold (20L/40L) or those involved in interstate trade.' },
          { name: 'Shop & Establishment Registration', description: 'State-specific mandatory license for any commercial establishment, office, or shop.' },
          { name: 'Provident Fund (PF) Registration', description: 'Social security registration for employees, mandatory for establishments with 20 or more employees.' },
          { name: 'Employee State Insurance (ESI) Registration', description: 'Medical and insurance benefits for employees earning below a certain salary threshold.' },
          { name: 'Startup India Registration', description: 'Government recognition for startups to avail tax holidays, self-certification, and easier compliance.' },
          { name: 'Trade License', description: 'Authorization from the municipal corporation to carry out specific trade activities at a premises.' },
          { name: 'Food License (FSSAI)', description: 'Mandatory license/registration for any business involved in the manufacturing, processing, or selling of food products.' },
          { name: 'Factory License', description: 'Approval required under the Factories Act for manufacturing units to ensure safety and health standards.' },
          { name: 'Pollution Board License', description: 'Consent to Establish/Operate from the State Pollution Control Board for specific industries.' },
          { name: 'MSME (Udyam) Registration', description: 'Registration for Micro, Small, and Medium Enterprises to avail government schemes, subsidies, and loan benefits.' },
          { name: 'Professional Tax (PT) Registration', description: 'State-levied tax registration required for employers and professionals.' },
          { name: 'STPI Registration', description: 'Software Technology Parks of India registration for IT/ITeS companies to avail export incentives.' },
          { name: 'Import & Export Code (IEC)', description: 'A 10-digit code required for any business involved in importing or exporting goods.' }
        ]
      }
    ]
  },
  {
    id: 'compliance',
    title: 'Tax & Legal Compliance',
    icon: Scale,
    description: 'End-to-end support for Income Tax, GST, Company Law, and Labour Laws.',
    content: [
      {
        groupTitle: 'Income Tax',
        items: [
          { name: 'Income Tax Advisory & Filing', description: 'Expert planning and filing of Income Tax Returns (ITR) for individuals and corporates.' },
          { name: 'Representation & Appeal', description: 'Legal representation before tax authorities for scrutiny, notices, and appeals.' },
          { name: 'Income Tax Audit', description: 'Mandatory audit for businesses and professionals exceeding specified turnover limits.' },
          { name: 'E-TDS Filing', description: 'Quarterly filing of Tax Deducted at Source (TDS) returns.' },
          { name: 'Lower TDS Deduction Certificate', description: 'Application under Section 197 to request a lower or nil TDS deduction rate.' },
          { name: 'Tax Residency Certificate', description: 'Certificate required to claim benefits under Double Taxation Avoidance Agreements (DTAA).' },
          { name: 'Transfer Pricing Consultation', description: 'Advisory on pricing transactions between related parties to ensure arm\'s length pricing.' }
        ]
      },
      {
        groupTitle: 'GST',
        items: [
          { name: 'GST Advisory & Return Filing', description: 'Monthly/Quarterly filing of GSTR-1, GSTR-3B, and Annual Returns (GSTR-9).' },
          { name: 'Representation & Appeal', description: 'Handling GST notices, scrutiny assessments, and appeals.' },
          { name: 'GST Refund', description: 'Processing refunds for exporters and cases of inverted duty structure.' },
          { name: 'GST Audit', description: 'Reconciliation and audit services as per GST regulations.' }
        ]
      },
      {
        groupTitle: 'Company Law',
        items: [
          { name: 'Company Secretarial Work', description: 'Maintenance of statutory registers, minutes, and drafting of resolutions.' },
          { name: 'ROC Annual Return Filing', description: 'Filing of AOC-4 and MGT-7 forms with the Registrar of Companies.' },
          { name: 'ESOP & RSU Compliance', description: 'Structuring and compliance for Employee Stock Option Plans.' },
          { name: 'Allotment & Transfer of Shares', description: 'Legal procedure for issuing new shares or transferring existing ones.' }
        ]
      },
      {
        groupTitle: 'Foreign Investment',
        items: [
          { name: 'FDI Compliance Advisory', description: 'Guidance on Foreign Direct Investment norms and routes in India.' },
          { name: 'FDI Filings with RBI', description: 'Filing of FC-GPR and FC-TRS forms on the FIRMS portal.' },
          { name: 'Share Transfer & RBI Filings', description: 'Compliance for transfer of shares between residents and non-residents.' }
        ]
      },
      {
        groupTitle: 'Labour Laws',
        items: [
          { name: 'Labour Law Compliance Advisory', description: 'Consultation on adherence to state and central labour regulations.' },
          { name: 'PF & ESI Compliance', description: 'Monthly return filing and challan generation for PF and ESI.' },
          { name: 'Gratuity Law Compliance', description: 'Management of gratuity funds and actuarial valuation support.' },
          { name: 'Factories Act Compliance', description: 'Adherence to safety, health, and welfare provisions for factory workers.' }
        ]
      }
    ]
  },
  {
    id: 'outsourcing',
    title: 'Outsourcing & CFO Services',
    icon: Briefcase,
    description: 'Expert financial management and operational support for growing businesses.',
    content: [
      {
        items: [
          { name: 'CFO Services', description: 'Virtual CFO services for financial strategy, budgeting, and cash flow management.' },
          { name: 'Outsourced Accounting Services', description: 'End-to-end bookkeeping and accounting on Tally/QuickBooks/Zoho.' },
          { name: 'Payroll Services & Labour Law Compliance', description: 'Processing monthly payroll, generating payslips, and handling tax deductions.' },
          { name: 'Project Reports & CMA Data for Bank Loans', description: 'Preparation of detailed project reports and Credit Monitoring Arrangement data for loan applications.' },
          { name: 'Business Valuation Services', description: 'Valuation of business for funding, mergers, or regulatory purposes.' },
          { name: 'Business Due Diligence', description: 'Financial and legal due diligence for investors and buyers.' },
          { name: 'Registered Valuer under Companies Act', description: 'Valuation services by IBBI registered valuers for various asset classes.' }
        ]
      }
    ]
  }
];

const Services: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('incorporation');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Find the currently active category data
  const currentCategory = serviceCategories.find(c => c.id === activeCategory) || serviceCategories[0];

  const toggleItem = (itemName: string) => {
    if (expandedItem === itemName) {
      setExpandedItem(null);
    } else {
      setExpandedItem(itemName);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Comprehensive financial, legal, and compliance solutions tailored for Startups, SMEs, and Enterprises.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-8 min-h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          
          {/* Sidebar (Category List) */}
          <div className="md:w-1/3 lg:w-1/4 bg-slate-50 border-r border-slate-200">
            <div className="p-6 border-b border-slate-200 bg-white">
              <h3 className="font-bold text-slate-900 text-lg">Service Categories</h3>
              <p className="text-xs text-slate-500 mt-1">Hover or click to view</p>
            </div>
            <div className="flex flex-col">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  className={`flex items-center gap-4 p-5 text-left transition-all duration-200 border-l-4 outline-none ${
                    activeCategory === category.id
                      ? 'bg-white border-blue-600 text-blue-700 shadow-sm z-10'
                      : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  onMouseEnter={() => {
                     setActiveCategory(category.id);
                     setExpandedItem(null); // Reset expanded item when changing category
                  }}
                  onClick={() => {
                     setActiveCategory(category.id);
                     setExpandedItem(null);
                  }}
                >
                  <category.icon size={24} className={activeCategory === category.id ? 'text-blue-600' : 'text-slate-400'} />
                  <span className="font-medium text-sm md:text-base">{category.title}</span>
                  {activeCategory === category.id && (
                    <ChevronRight size={16} className="ml-auto text-blue-600" />
                  )}
                </button>
              ))}
            </div>
            
            {/* Quick Contact Box in Sidebar */}
            <div className="p-6 mt-auto hidden md:block">
              <div className="bg-blue-600 rounded-xl p-6 text-white text-center">
                <Phone size={24} className="mx-auto mb-3 opacity-80" />
                <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                <p className="text-blue-100 text-sm mb-2">Talk to an expert today.</p>
                <p className="text-white font-bold text-lg mb-4">+91 7406581456</p>
                <Link to="/contact" className="inline-block bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-50 transition">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:w-2/3 lg:w-3/4 p-6 md:p-10 flex flex-col">
            <div className="mb-8 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 text-blue-600 mb-2">
                <currentCategory.icon size={32} />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{currentCategory.title}</h2>
              </div>
              <p className="text-slate-500 text-lg">{currentCategory.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 animate-fadeIn">
              {currentCategory.content.map((group, idx) => (
                <div key={idx} className="space-y-4">
                  {group.groupTitle && (
                    <h3 className="font-bold text-lg text-slate-900 border-l-4 border-blue-500 pl-3">
                      {group.groupTitle}
                    </h3>
                  )}
                  <div className="space-y-2">
                    {group.items.map((item, i) => {
                      const isExpanded = expandedItem === item.name;
                      return (
                        <div 
                           key={i} 
                           className={`group/item border rounded-lg transition-all duration-200 ${
                              isExpanded ? 'border-blue-200 bg-blue-50/50' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                           }`}
                        >
                          <button
                            onClick={() => toggleItem(item.name)}
                            className="w-full flex items-start gap-3 p-3 text-left"
                          >
                            <div className={`mt-0.5 transition-colors ${isExpanded ? 'text-blue-600' : 'text-slate-400 group-hover/item:text-blue-500'}`}>
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                            <span className={`font-medium transition-colors ${isExpanded ? 'text-blue-700' : 'text-slate-700 group-hover/item:text-slate-900'}`}>
                               {item.name}
                            </span>
                          </button>
                          
                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="px-3 pb-4 pl-9 animate-fadeIn">
                               <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                  {item.description}
                               </p>
                               <Link 
                                 to={`/contact?service=${encodeURIComponent(item.name)}`}
                                 className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide"
                               >
                                 Get Quote <ArrowRight size={12} />
                               </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-10">
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition border border-blue-200 hover:border-blue-600 px-6 py-3 rounded-lg"
              >
                Get a Quote for {currentCategory.title} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile View Accordion (Visible only on small screens) */}
        <div className="md:hidden mt-8 space-y-4">
            <p className="text-center text-sm text-slate-500 italic mb-4">Tap on a category below to view details</p>
            {serviceCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => setActiveCategory(activeCategory === category.id ? '' : category.id)}
                  className={`w-full flex items-center justify-between p-5 text-left font-bold ${activeCategory === category.id ? 'bg-blue-50 text-blue-700' : 'text-slate-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <category.icon size={20} />
                    {category.title}
                  </div>
                  <ChevronDown size={20} className={`transition-transform ${activeCategory === category.id ? 'rotate-180' : ''}`} />
                </button>
                
                {activeCategory === category.id && (
                   <div className="p-5 border-t border-slate-100">
                     <div className="grid gap-8">
                        {category.content.map((group, idx) => (
                          <div key={idx}>
                            {group.groupTitle && (
                              <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">{group.groupTitle}</h4>
                            )}
                            <div className="space-y-2">
                              {group.items.map((item, i) => (
                                <div key={i} className="border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                                   <p className="font-medium text-slate-700 text-sm mb-1">{item.name}</p>
                                   <p className="text-xs text-slate-500">{item.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                     </div>
                     <div className="mt-6 pt-4 border-t border-slate-100">
                       <Link to="/contact" className="inline-flex items-center gap-2 text-blue-600 font-bold">
                         Enquire Now <ArrowRight size={14} />
                       </Link>
                     </div>
                   </div>
                )}
              </div>
            ))}
        </div>
      </div>
      
      {/* Consultation CTA */}
      <div className="bg-slate-100 py-16">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Not finding what you're looking for?</h2>
            <p className="text-slate-600 mb-8">We offer custom compliance and financial solutions tailored to your specific industry needs.</p>
            <Link to="/book-consultation" className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition">
              Schedule a Free Consultation
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;