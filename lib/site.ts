export const siteConfig = {
  name: "Yone International",
  tagline: "Precision Instruments. Trusted Craftsmanship.",
  email: "yoneinternational@gmail.com",
  phoneDisplay: "+92 344 8416718",
  phoneHref: "tel:+923448416718",
  whatsappDisplay: "+92 344 8416718",
  whatsappHref: "https://wa.me/923448416718",
  address: "Head Marala Road, Machi Khokhar, Sialkot, Pakistan",
  instagram: "https://www.instagram.com/yoneinternational/",
  linkedin: "https://www.linkedin.com/company/yoneinternational/",
  facebook: "https://www.facebook.com/share/1EfGmSE4T1/",
  twitter: "https://x.com/yoneintl",
  catalog:
    "https://drive.google.com/drive/folders/1PhtEZyIS4sVxh_dYCHurykNlnI6Lgrbz?usp=drive_link",
  currentSite: "https://yoneinternational.netlify.app",
} as const;

export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Company" },
  { href: "/products", label: "Products" },
  { href: "/manufacturing", label: "Manufacturing" },
  { href: "/quality", label: "Quality" },
  { href: "/blog", label: "Blog / News" },
  { href: "/gallery", label: "Gallery" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;

export const capabilities = [
  "Private labelling",
  "Pre-order samples",
  "Custom packaging",
  "International shipping",
] as const;

export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || siteConfig.currentSite;
