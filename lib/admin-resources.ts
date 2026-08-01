export type AdminField = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "textarea" | "email" | "number" | "select";
  options?: Array<{ value: string; label: string }>;
};

export type AdminResource = {
  label: string;
  table: string;
  prefix: string;
  ownerOnly?: boolean;
  fields: AdminField[];
  listSql: string;
  createSql: string;
  createValues: string[];
  lifecycle?: boolean;
};

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const adminResources: Record<string, AdminResource> = {
  categories: {
    label: "Categories & subcategories",
    table: "categories",
    prefix: "cat",
    lifecycle: true,
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug" },
      { name: "parent_id", label: "Parent category ID" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Display order", type: "number" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
    listSql: "SELECT id,name,slug,status,parent_id AS detail,updated_at AS updatedAt FROM categories WHERE deleted_at IS NULL ORDER BY sort_order,name LIMIT 200",
    createSql: "INSERT INTO categories(id,parent_id,name,slug,description,sort_order,status,published_at,created_by,updated_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
    createValues: ["id","parent_id","name","slug","description","sort_order","status","published_at","actor","actor","now","now"],
  },
  products: {
    label: "Products",
    table: "products",
    prefix: "prd",
    lifecycle: true,
    fields: [
      { name: "name", label: "Product name", required: true },
      { name: "slug", label: "Slug" },
      { name: "sku", label: "SKU / model" },
      { name: "category_id", label: "Category ID", required: true },
      { name: "primary_media_id", label: "Primary public image ID" },
      { name: "short_description", label: "Short factual line", type: "textarea" },
      { name: "overview", label: "Overview", type: "textarea" },
      { name: "features", label: "Verified features", type: "textarea" },
      { name: "applications", label: "Applications", type: "textarea" },
      { name: "intended_use", label: "Intended use", type: "textarea" },
      { name: "packaging", label: "Packaging", type: "textarea" },
      { name: "customization", label: "Customization", type: "textarea" },
      { name: "disclaimer", label: "Regulatory disclaimer", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
    listSql: "SELECT p.id,p.name,p.slug,p.status,c.name AS detail,p.updated_at AS updatedAt FROM products p JOIN categories c ON c.id=p.category_id WHERE p.deleted_at IS NULL ORDER BY p.updated_at DESC LIMIT 200",
    createSql: "INSERT INTO products(id,category_id,name,slug,sku,short_description,overview,features,applications,intended_use,packaging,customization,disclaimer,featured,sort_order,status,published_at,created_by,updated_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,0,0,?,?,?,?,?,?)",
    createValues: ["id","category_id","name","slug","sku","short_description","overview","features","applications","intended_use","packaging","customization","disclaimer","status","published_at","actor","actor","now","now"],
  },
  blog: {
    label: "Blog / news",
    table: "blog_posts",
    prefix: "post",
    lifecycle: true,
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "slug", label: "Slug" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "body", label: "Article body", type: "textarea" },
      { name: "sources", label: "Sources", type: "textarea" },
      { name: "hero_media_id", label: "Hero image ID" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
    listSql: "SELECT id,title AS name,slug,status,excerpt AS detail,updated_at AS updatedAt FROM blog_posts WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 200",
    createSql: "INSERT INTO blog_posts(id,author_id,category_id,hero_media_id,title,slug,excerpt,body,sources,updated_date,status,published_at,created_by,updated_by,created_at,updated_at) VALUES(?,NULL,NULL,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    createValues: ["id","hero_media_id","title","slug","excerpt","body","sources","now","status","published_at","actor","actor","now","now"],
  },
  gallery: {
    label: "Gallery albums",
    table: "gallery_albums",
    prefix: "alb",
    lifecycle: true,
    fields: [
      { name: "name", label: "Album name", required: true },
      { name: "slug", label: "Slug" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "media_id", label: "Album image ID" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
    listSql: "SELECT id,name,slug,status,description AS detail,updated_at AS updatedAt FROM gallery_albums WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 200",
    createSql: "INSERT INTO gallery_albums(id,name,slug,description,event_date,status,published_at,created_by,updated_by,created_at,updated_at) VALUES(?,?,?,?,NULL,?,?,?,?,?,?)",
    createValues: ["id","name","slug","description","status","published_at","actor","actor","now","now"],
  },
  careers: {
    label: "Careers",
    table: "jobs",
    prefix: "job",
    lifecycle: true,
    fields: [
      { name: "title", label: "Job title", required: true },
      { name: "slug", label: "Slug" },
      { name: "department", label: "Department" },
      { name: "location", label: "Location" },
      { name: "employment_type", label: "Employment type" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "requirements", label: "Requirements", type: "textarea" },
      { name: "application_instructions", label: "Application instructions", type: "textarea" },
      { name: "closing_date", label: "Closing date (Unix timestamp)", type: "number" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
    listSql: "SELECT id,title AS name,slug,status,location AS detail,updated_at AS updatedAt FROM jobs WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 200",
    createSql: "INSERT INTO jobs(id,title,slug,department,location,employment_type,description,requirements,application_instructions,closing_date,status,published_at,created_by,updated_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    createValues: ["id","title","slug","department","location","employment_type","description","requirements","application_instructions","closing_date","status","published_at","actor","actor","now","now"],
  },
  testimonials: {
    label: "Verified testimonials",
    table: "verified_testimonials",
    prefix: "tst",
    ownerOnly: true,
    lifecycle: true,
    fields: [
      { name: "customer_name", label: "Customer name", required: true },
      { name: "role_company", label: "Role / company" },
      { name: "country", label: "Country" },
      { name: "review_text", label: "Review text", required: true, type: "textarea" },
      { name: "permission_status", label: "Permission status", type: "select", options: [{value:"pending",label:"Pending"},{value:"approved",label:"Approved"}] },
      { name: "verification_status", label: "Verification status", type: "select", options: [{value:"pending",label:"Pending"},{value:"verified",label:"Verified"}] },
      { name: "media_id", label: "Approved logo / photo ID" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
    listSql: "SELECT id,customer_name AS name,'' AS slug,status,role_company AS detail,updated_at AS updatedAt FROM verified_testimonials WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 200",
    createSql: "INSERT INTO verified_testimonials(id,customer_name,role_company,country,review_text,review_date,permission_status,verification_status,media_id,status,published_at,created_by,updated_by,created_at,updated_at) VALUES(?,?,?,?,?,NULL,?,?,?,?,?,?,?,?,?)",
    createValues: ["id","customer_name","role_company","country","review_text","permission_status","verification_status","media_id","status","published_at","actor","actor","now","now"],
  },
  certifications: {
    label: "Certifications",
    table: "certifications",
    prefix: "cert",
    ownerOnly: true,
    lifecycle: true,
    fields: [
      { name: "name", label: "Certification name", required: true },
      { name: "issuer", label: "Issuer" },
      { name: "scope", label: "Scope", type: "textarea" },
      { name: "certificate_number", label: "Certificate number" },
      { name: "evidence_media_id", label: "Private evidence media ID" },
      { name: "verified", label: "Evidence verified", type: "select", options: [{value:"0",label:"No"},{value:"1",label:"Yes"}] },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
    listSql: "SELECT id,name,'' AS slug,status,issuer AS detail,updated_at AS updatedAt FROM certifications WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 200",
    createSql: "INSERT INTO certifications(id,name,issuer,scope,certificate_number,valid_from,valid_until,evidence_media_id,verified,status,published_at,created_by,updated_by,created_at,updated_at) VALUES(?,?,?,?,?,NULL,NULL,?,?,?,?,?,?,?,?)",
    createValues: ["id","name","issuer","scope","certificate_number","evidence_media_id","verified","status","published_at","actor","actor","now","now"],
  },
  seo: {
    label: "SEO metadata",
    table: "seo_metadata",
    prefix: "seo",
    lifecycle: true,
    fields: [
      { name: "page_path", label: "Page path", required: true },
      { name: "title", label: "Page title", required: true },
      { name: "description", label: "Meta description", required: true, type: "textarea" },
      { name: "og_title", label: "Social title" },
      { name: "og_description", label: "Social description", type: "textarea" },
      { name: "og_media_id", label: "Social image ID" },
      { name: "noindex", label: "Noindex", type: "select", options: [{value:"0",label:"Indexable"},{value:"1",label:"Noindex"}] },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
    listSql: "SELECT id,title AS name,page_path AS slug,status,description AS detail,updated_at AS updatedAt FROM seo_metadata WHERE deleted_at IS NULL ORDER BY page_path LIMIT 250",
    createSql: "INSERT INTO seo_metadata(id,page_path,title,description,og_title,og_description,og_media_id,noindex,status,published_at,created_by,updated_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    createValues: ["id","page_path","title","description","og_title","og_description","og_media_id","noindex","status","published_at","actor","actor","now","now"],
  },
};

export const adminNav = [
  ["overview", "Dashboard"],
  ["products", "Products"],
  ["categories", "Categories"],
  ["blog", "Blog / news"],
  ["gallery", "Gallery"],
  ["careers", "Careers"],
  ["media", "Media"],
  ["rfqs", "RFQs"],
  ["contacts", "Contact enquiries"],
  ["applications", "Applications"],
  ["testimonials", "Testimonials"],
  ["certifications", "Certifications"],
  ["seo", "SEO metadata"],
  ["analytics", "Analytics"],
  ["settings", "Settings"],
  ["retention", "Retention"],
  ["redirects", "Redirects"],
  ["users", "Users"],
  ["audit", "Audit log"],
] as const;
