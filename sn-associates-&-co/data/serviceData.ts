import { ProfessionalService } from '../types';

export const fallbackServices: ProfessionalService[] = [
    {
        id: 'fb-1',
        name: "Proprietorship Registration",
        category: "Business Entity Incorporation & Registration",
        description: "Simple business structure for individual owners.",
        applicableClients: ["Individuals"],
        fees: "Custom",
        status: "Active",
        resources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'fb-2',
        name: "Private Limited Company Registration",
        category: "Business Entity Incorporation & Registration",
        description: "Corporate structure ideal for startups and funding.",
        applicableClients: ["Startups", "Businesses"],
        fees: "Custom",
        status: "Active",
        resources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'fb-3',
        name: "GST Registration & Amendments",
        category: "Post-Incorporation & Business Registrations",
        description: "Statutory indirect tax registration and updates.",
        applicableClients: ["Businesses", "Startups"],
        fees: "Custom",
        status: "Active",
        resources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'fb-4',
        name: "Income Tax Advisory & ITR Filing",
        category: "Tax & Legal Compliance Services",
        description: "Strategic planning and return filing.",
        applicableClients: ["Individuals", "Businesses"],
        fees: "Custom",
        status: "Active",
        resources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'fb-5',
        name: "Virtual CFO Services",
        category: "Outsourcing, Accounting & CFO Services",
        description: "High-level strategic financial leadership.",
        applicableClients: ["Businesses", "Startups"],
        fees: "Custom",
        status: "Active",
        resources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'fb-6',
        name: "Website Design & Development",
        category: "Digital, Technology & Growth Services",
        description: "High-performance professional websites.",
        applicableClients: ["Startups", "Businesses"],
        fees: "Custom",
        status: "Active",
        resources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'fb-7',
        name: "GST Master Course (Practical)",
        category: "SNAC Academy: Professional Training",
        description: "Live portal training for practitioners.",
        applicableClients: ["Individuals"],
        fees: "Custom",
        status: "Active",
        resources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
