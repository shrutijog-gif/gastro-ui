export interface Department {
    id: string;
    name: string;
}

export interface Brand {
    id: string;
    departmentId: string;
    name: string;
}

export interface DocumentType {
    id: string;
    brandId: string;
    name: string;
}

export interface Document {
    id: string;
    version: string;
    date: string;
    title: string;
    description: string;
    category: string;
    type: string;
    department: string;
    documentTypeId: string;
}

export const departments: Department[] = [
    { id: 'ops', name: 'Operations' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'finance', name: 'Finance' },
    { id: 'tech', name: 'Technology' },
];

export const brands: Brand[] = [
    // Operations
    { id: 'ops-bb', departmentId: 'ops', name: 'Burger Boutique' },
    { id: 'ops-wr', departmentId: 'ops', name: 'White Robata' },
    { id: 'ops-lc', departmentId: 'ops', name: 'Lazy Cat' },
    { id: 'ops-ofk', departmentId: 'ops', name: 'OFK' },
    // Kitchen
    { id: 'kit-bb', departmentId: 'kitchen', name: 'Burger Boutique' },
    { id: 'kit-wr', departmentId: 'kitchen', name: 'White Robata' },
    { id: 'kit-lc', departmentId: 'kitchen', name: 'Lazy Cat' },
    { id: 'kit-ofk', departmentId: 'kitchen', name: 'OFK' },
    // Finance
    { id: 'fin-corp', departmentId: 'finance', name: 'Corporate' },
    // Technology
    { id: 'tech-corp', departmentId: 'tech', name: 'Corporate' },
];

export const documentTypes: DocumentType[] = [
    // Ops - White Robata
    { id: 'ops-wr-sops', brandId: 'ops-wr', name: 'Standard Operating Procedures' },
    { id: 'ops-wr-guidelines', brandId: 'ops-wr', name: 'Brand Guest Experience' },
    // Ops - BB
    { id: 'ops-bb-guidelines', brandId: 'ops-bb', name: 'Brand Guide' },
    { id: 'ops-bb-agreements', brandId: 'ops-bb', name: 'Business Agreements' },
    { id: 'ops-bb-amc', brandId: 'ops-bb', name: 'AMC' },
    { id: 'ops-bb-checklists', brandId: 'ops-bb', name: 'Checklists' },
    { id: 'ops-bb-nda', brandId: 'ops-bb', name: 'NDA' },
    { id: 'ops-bb-permits', brandId: 'ops-bb', name: 'Permits' },
    { id: 'ops-bb-licence', brandId: 'ops-bb', name: 'Trade Licence' },
    { id: 'ops-bb-training', brandId: 'ops-bb', name: 'Training Materials' },
    // Kitchen - BB
    { id: 'kit-bb-guidelines', brandId: 'kit-bb', name: 'Checklists' },
    // Finance - Corp
    { id: 'fin-corp-sops', brandId: 'fin-corp', name: 'Business Agreements' },
    // Tech - Corp
    { id: 'tech-corp-policies', brandId: 'tech-corp', name: 'Company Policies' },
];

export const documents: Document[] = [
    {
        id: 'DOC-2026-000090',
        version: 'Ver 1.0',
        date: 'Feb 28, 2026',
        title: 'BB Brand Guide SOP1',
        description: 'BB SOP1',
        category: 'Brand Guidelines',
        type: 'Brand Guide',
        department: 'Operations',
        documentTypeId: 'ops-bb-guidelines',
    },
    {
        id: 'DOC-2026-000032',
        version: 'Ver 4.0',
        date: 'Feb 28, 2026',
        title: 'White Robata RECEIVING_ORDERS',
        description: 'Automated Test Document via Fixture - Approved Rule Matching',
        category: 'Brand Guidelines',
        type: 'Brand Guest Experience',
        department: 'Operations',
        documentTypeId: 'ops-wr-guidelines',
    },
    {
        id: 'DOC-2026-000058',
        version: 'Ver 2.0',
        date: 'Feb 28, 2026',
        title: 'BB SECTION SET UP GUIDE',
        description: 'Automated Test Document for brandmgr2',
        category: 'Brand Guidelines',
        type: 'Checklists',
        department: 'Kitchen',
        documentTypeId: 'kit-bb-guidelines',
    },
    {
        id: 'DOC-2026-000088',
        version: 'Ver 1.0',
        date: 'Feb 27, 2026',
        title: 'SOP Recipe_Updates_CC_03',
        description: 'SOP Recipe_Updates_CC_03',
        category: 'Corporate Governance',
        type: 'Business Agreements',
        department: 'Finance',
        documentTypeId: 'fin-corp-sops',
    },
    {
        id: 'DOC-2026-000086',
        version: 'Ver 1.0',
        date: 'Feb 27, 2026',
        title: 'PPM-Managing Wastage of food items at restaurants_CC16',
        description: 'PPM-Managing Wastage of food items at restaurants_CC16',
        category: 'Corporate Governance',
        type: 'Business Agreements',
        department: 'Finance',
        documentTypeId: 'fin-corp-sops',
    },
    {
        id: 'DOC-2026-000012',
        version: 'Ver 1.2',
        date: 'Feb 15, 2026',
        title: 'IT Asset Management Policy',
        description: 'Guidelines for managing IT hardware and software',
        category: 'IT Policies',
        type: 'Company Policies',
        department: 'Technology',
        documentTypeId: 'tech-corp-policies',
    },
];
