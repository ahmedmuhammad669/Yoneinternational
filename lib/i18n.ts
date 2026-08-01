import { cookies, headers } from "next/headers";
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

export const localeCookie = "yone_locale";

export const locales = [
  "en",
  "en-US",
  "ar",
  "de",
  "it",
  "zh-CN",
  "ja",
  "ko",
] as const;

export type Locale = (typeof locales)[number];
export type Translate = (value: string) => string;

export const localeOptions: ReadonlyArray<{
  code: Locale;
  label: string;
  shortLabel: string;
  dir: "ltr" | "rtl";
}> = [
  { code: "en", label: "English", shortLabel: "EN", dir: "ltr" },
  { code: "en-US", label: "American English", shortLabel: "US", dir: "ltr" },
  { code: "ar", label: "العربية", shortLabel: "AR", dir: "rtl" },
  { code: "de", label: "Deutsch", shortLabel: "DE", dir: "ltr" },
  { code: "it", label: "Italiano", shortLabel: "IT", dir: "ltr" },
  { code: "zh-CN", label: "简体中文", shortLabel: "中文", dir: "ltr" },
  { code: "ja", label: "日本語", shortLabel: "日本語", dir: "ltr" },
  { code: "ko", label: "한국어", shortLabel: "한국어", dir: "ltr" },
];

const translations: Partial<Record<Locale, Record<string, string>>> = {
  "en-US": {
    "Private labelling": "Private labeling",
    "Your label. Your packaging. Your market requirements.":
      "Your label. Your packaging. Your market requirements.",
    "Agree shipping details before international fulfilment.":
      "Agree shipping details before international fulfillment.",
    "Start an RFQ": "Start a quote request",
    "Build your RFQ": "Build your quote request",
  },
  ar: {
    "Skip to content": "انتقل إلى المحتوى",
    "Home": "الرئيسية",
    "Company": "الشركة",
    "Products": "المنتجات",
    "Manufacturing": "التصنيع",
    "Quality": "الجودة",
    "Quality & compliance": "الجودة والامتثال",
    "Blog / News": "المدونة والأخبار",
    "Gallery": "معرض الصور",
    "Careers": "الوظائف",
    "Contact": "اتصل بنا",
    "Search": "بحث",
    "Catalog": "الكتالوج",
    "Product Catalog": "كتالوج المنتجات",
    "WhatsApp": "واتساب",
    "Request a Quote": "اطلب عرض سعر",
    "Language": "اللغة",
    "Apply": "تطبيق",
    "Precision instrument manufacturing · Sialkot, Pakistan":
      "تصنيع الأدوات الدقيقة · سيالكوت، باكستان",
    "Precision Surgical, Dental & Beauty Instruments from Sialkot, Pakistan.":
      "أدوات جراحية وطب أسنان وتجميل دقيقة من سيالكوت، باكستان.",
    "Yone International supports professional and international buyers with focused manufacturing, clear communication and configurable supply options.":
      "تدعم Yone International المشترين المحترفين والدوليين بتصنيع متخصص وتواصل واضح وخيارات توريد قابلة للتخصيص.",
    "Sialkot, Pakistan · Export-oriented manufacturing":
      "سيالكوت، باكستان · تصنيع موجه للتصدير",
    "View Products": "عرض المنتجات",
    "Download Catalog": "تنزيل الكتالوج",
    "View Product Catalog": "عرض كتالوج المنتجات",
    "Multi-product RFQs welcome · No buyer account required":
      "نرحب بطلبات أسعار متعددة المنتجات · لا يلزم حساب للمشتري",
    "Buyer documentation": "وثائق المشتري",
    "Product-specific compliance files shared on request":
      "تُشارك ملفات الامتثال الخاصة بالمنتج عند الطلب",
    "Company facts": "حقائق عن الشركة",
    "40 years": "40 عامًا",
    "Manufacturing expertise*": "خبرة في التصنيع*",
    "Pakistan-based production": "إنتاج في باكستان",
    "3 core ranges": "3 مجموعات أساسية",
    "Dental · Beauty · Surgical": "أسنان · تجميل · جراحة",
    "One RFQ": "طلب سعر واحد",
    "Multiple products & quantities": "منتجات وكميات متعددة",
    "Product range": "مجموعة المنتجات",
    "Built around professional requirements.": "مصممة لتلبية المتطلبات المهنية.",
    "Browse administrator-managed categories, then add the products and quantities you need to one quotation request.":
      "تصفح الفئات التي تديرها الإدارة، ثم أضف المنتجات والكميات المطلوبة إلى طلب سعر واحد.",
    "Explore category": "استكشف الفئة",
    "Featured products": "منتجات مميزة",
    "Approved instrument records.": "سجلات أدوات معتمدة.",
    "View all products →": "عرض كل المنتجات ←",
    "Flexible supply": "توريد مرن",
    "Your label. Your packaging. Your market requirements.":
      "علامتك. تغليفك. متطلبات سوقك.",
    "From early samples to configured packaging and international dispatch, the enquiry process is designed to capture the details procurement teams need.":
      "من العينات الأولية إلى التغليف المخصص والشحن الدولي، صُممت عملية الاستفسار لجمع التفاصيل التي تحتاجها فرق المشتريات.",
    "Review manufacturing capabilities": "راجع قدرات التصنيع",
    "Private labelling": "وضع العلامة الخاصة",
    "Pre-order samples": "عينات قبل الطلب",
    "Custom packaging": "تغليف مخصص",
    "International shipping": "شحن دولي",
    "From requirement to dispatch": "من المتطلبات إلى الشحن",
    "A clear B2B enquiry process.": "عملية استفسار واضحة للشركات.",
    "Define": "تحديد",
    "Review": "مراجعة",
    "Configure": "تخصيص",
    "Dispatch": "شحن",
    "Verify the documentation that applies to your exact order.":
      "تحقق من الوثائق التي تنطبق على طلبك المحدد.",
    "Leadership": "القيادة",
    "A message from Muhammad Mutahar ACCA.": "رسالة من محمد مطهر ACCA.",
    "Read the CEO message": "اقرأ رسالة الرئيس التنفيذي",
    "Start a conversation": "ابدأ محادثة",
    "Tell us what you need to source.": "أخبرنا بما تريد توريده.",
    "Build your RFQ": "أنشئ طلب عرض السعر",
    "Chat on WhatsApp": "تحدث عبر واتساب",
    "Precision instruments, clearly specified.": "أدوات دقيقة بمواصفات واضحة.",
    "Manufacturing dental, beauty and surgical instruments for professional buyers from Sialkot, Pakistan.":
      "نصنع أدوات طب الأسنان والتجميل والجراحة للمشترين المحترفين من سيالكوت، باكستان.",
    "Start an RFQ": "ابدأ طلب سعر",
    "All categories": "جميع الفئات",
    "Download catalog": "تنزيل الكتالوج",
    "Our company": "شركتنا",
    "CEO message": "رسالة الرئيس التنفيذي",
    "HTML sitemap": "خريطة الموقع",
    "All rights reserved.": "جميع الحقوق محفوظة.",
    "Privacy": "الخصوصية",
    "Terms": "الشروط",
    "Cookie preferences": "تفضيلات ملفات تعريف الارتباط",
    "Product disclaimer": "إخلاء مسؤولية المنتج",
    "Find the instrument range you need.": "اعثر على مجموعة الأدوات التي تحتاجها.",
    "Search by product name, SKU or keyword": "ابحث باسم المنتج أو الرمز أو الكلمة المفتاحية",
    "Search products": "بحث المنتجات",
    "Browse category →": "تصفح الفئة ←",
    "View details →": "عرض التفاصيل ←",
    "Add to RFQ": "أضف إلى طلب السعر",
    "Let’s discuss your requirement.": "لنناقش متطلباتك.",
    "Contact enquiry": "استفسار اتصال",
    "Required fields are marked with an asterisk.": "الحقول المطلوبة مميزة بعلامة النجمة.",
    "Full name *": "الاسم الكامل *",
    "Business email *": "البريد الإلكتروني للعمل *",
    "Phone / WhatsApp": "الهاتف / واتساب",
    "Country": "الدولة",
    "Subject": "الموضوع",
    "Message *": "الرسالة *",
    "Send enquiry": "إرسال الاستفسار",
    "Sending…": "جارٍ الإرسال…",
    "Sialkot, Pakistan": "سيالكوت، باكستان",
    "Export-oriented manufacturing": "تصنيع موجه للتصدير",
    "Precision manufacturing support from Sialkot.": "دعم تصنيع دقيق من سيالكوت.",
    "Configured around the buyer’s requirement.": "مصمم وفق متطلبات المشتري.",
    "Verify what applies to the product and market.": "تحقق مما ينطبق على المنتج والسوق.",
    "Approved insights, not automated noise.": "محتوى معتمد، لا أخبار آلية.",
    "Authentic images, published with context.": "صور أصلية منشورة مع سياق واضح.",
    "Build precision with us.": "اصنع الدقة معنا.",
    "Use a direct channel for a quick conversation, or send a structured enquiry with the information needed for review.":
      "استخدم قناة مباشرة لمحادثة سريعة، أو أرسل استفسارًا منظمًا بالمعلومات اللازمة للمراجعة.",
    "One enquiry. Multiple requirements.": "استفسار واحد. متطلبات متعددة.",
    "No account is required. Submitting an RFQ records an enquiry, not an order, and does not promise price, availability, MOQ or delivery timing.":
      "لا يلزم حساب. إرسال طلب السعر يسجل استفسارًا وليس طلب شراء، ولا يضمن السعر أو التوفر أو الحد الأدنى أو موعد التسليم.",
    "Your RFQ basket": "سلة طلب السعر",
    "Help us understand the order.": "ساعدنا على فهم الطلب.",
    "Buyer details": "بيانات المشتري",
    "Company name *": "اسم الشركة *",
    "Country *": "الدولة *",
    "Target market": "السوق المستهدف",
    "Product requirements": "متطلبات المنتج",
    "You can list several products and quantities.": "يمكنك إدراج عدة منتجات وكميات.",
    "Products, SKUs or instrument references *": "المنتجات أو الرموز أو مراجع الأدوات *",
    "Add project requirements": "أضف متطلبات المشروع",
    "Required standard / certification": "المعيار / الشهادة المطلوبة",
    "Desired delivery date": "تاريخ التسليم المطلوب",
    "Private-label requirements": "متطلبات العلامة الخاصة",
    "Packaging preference": "تفضيلات التغليف",
    "Reference file": "ملف مرجعي",
    "Submit Quote Request": "إرسال طلب السعر",
    "Submitting RFQ…": "جارٍ إرسال طلب السعر…",
  },
  de: {
    "Skip to content": "Zum Inhalt springen",
    "Home": "Startseite",
    "Company": "Unternehmen",
    "Products": "Produkte",
    "Manufacturing": "Fertigung",
    "Quality": "Qualität",
    "Quality & compliance": "Qualität & Compliance",
    "Blog / News": "Blog / Neuigkeiten",
    "Gallery": "Galerie",
    "Careers": "Karriere",
    "Contact": "Kontakt",
    "Search": "Suche",
    "Catalog": "Katalog",
    "Product Catalog": "Produktkatalog",
    "WhatsApp": "WhatsApp",
    "Request a Quote": "Angebot anfordern",
    "Language": "Sprache",
    "Apply": "Übernehmen",
    "Precision instrument manufacturing · Sialkot, Pakistan":
      "Präzisionsinstrumente aus Sialkot, Pakistan",
    "Precision Surgical, Dental & Beauty Instruments from Sialkot, Pakistan.":
      "Präzise chirurgische, zahnmedizinische und Beauty-Instrumente aus Sialkot, Pakistan.",
    "Yone International supports professional and international buyers with focused manufacturing, clear communication and configurable supply options.":
      "Yone International unterstützt professionelle und internationale Käufer mit spezialisierter Fertigung, klarer Kommunikation und flexiblen Lieferoptionen.",
    "Sialkot, Pakistan · Export-oriented manufacturing":
      "Sialkot, Pakistan · Exportorientierte Fertigung",
    "View Products": "Produkte ansehen",
    "Download Catalog": "Katalog herunterladen",
    "View Product Catalog": "Produktkatalog ansehen",
    "Multi-product RFQs welcome · No buyer account required":
      "Anfragen für mehrere Produkte willkommen · Kein Käuferkonto erforderlich",
    "Buyer documentation": "Käuferdokumentation",
    "Product-specific compliance files shared on request":
      "Produktspezifische Compliance-Unterlagen auf Anfrage",
    "Company facts": "Unternehmensdaten",
    "40 years": "40 Jahre",
    "Manufacturing expertise*": "Fertigungserfahrung*",
    "Pakistan-based production": "Produktion in Pakistan",
    "3 core ranges": "3 Kernsortimente",
    "Dental · Beauty · Surgical": "Dental · Beauty · Chirurgie",
    "One RFQ": "Eine Anfrage",
    "Multiple products & quantities": "Mehrere Produkte und Mengen",
    "Product range": "Produktsortiment",
    "Built around professional requirements.": "Für professionelle Anforderungen entwickelt.",
    "Explore category": "Kategorie entdecken",
    "Featured products": "Ausgewählte Produkte",
    "Approved instrument records.": "Freigegebene Instrumentendaten.",
    "View all products →": "Alle Produkte ansehen →",
    "Flexible supply": "Flexible Lieferung",
    "Your label. Your packaging. Your market requirements.":
      "Ihre Marke. Ihre Verpackung. Ihre Marktanforderungen.",
    "Review manufacturing capabilities": "Fertigungsmöglichkeiten ansehen",
    "Private labelling": "Private Label",
    "Pre-order samples": "Muster vor Bestellung",
    "Custom packaging": "Individuelle Verpackung",
    "International shipping": "Internationaler Versand",
    "From requirement to dispatch": "Von der Anforderung bis zum Versand",
    "A clear B2B enquiry process.": "Ein klarer B2B-Anfrageprozess.",
    "Define": "Definieren",
    "Review": "Prüfen",
    "Configure": "Konfigurieren",
    "Dispatch": "Versenden",
    "Verify the documentation that applies to your exact order.":
      "Prüfen Sie die Unterlagen für Ihre konkrete Bestellung.",
    "Leadership": "Unternehmensleitung",
    "A message from Muhammad Mutahar ACCA.": "Eine Nachricht von Muhammad Mutahar ACCA.",
    "Read the CEO message": "CEO-Nachricht lesen",
    "Start a conversation": "Gespräch beginnen",
    "Tell us what you need to source.": "Sagen Sie uns, was Sie beschaffen möchten.",
    "Build your RFQ": "Anfrage erstellen",
    "Chat on WhatsApp": "Über WhatsApp chatten",
    "Precision instruments, clearly specified.": "Präzisionsinstrumente, klar spezifiziert.",
    "Start an RFQ": "Anfrage starten",
    "All categories": "Alle Kategorien",
    "Download catalog": "Katalog herunterladen",
    "Our company": "Unser Unternehmen",
    "CEO message": "CEO-Nachricht",
    "HTML sitemap": "HTML-Sitemap",
    "All rights reserved.": "Alle Rechte vorbehalten.",
    "Privacy": "Datenschutz",
    "Terms": "Nutzungsbedingungen",
    "Cookie preferences": "Cookie-Einstellungen",
    "Product disclaimer": "Produkthinweis",
    "Find the instrument range you need.": "Finden Sie das passende Instrumentensortiment.",
    "Search by product name, SKU or keyword": "Nach Produktname, SKU oder Stichwort suchen",
    "Search products": "Produkte suchen",
    "Browse category →": "Kategorie durchsuchen →",
    "View details →": "Details ansehen →",
    "Add to RFQ": "Zur Anfrage hinzufügen",
    "Let’s discuss your requirement.": "Lassen Sie uns Ihre Anforderungen besprechen.",
    "Contact enquiry": "Kontaktanfrage",
    "Required fields are marked with an asterisk.": "Pflichtfelder sind mit einem Sternchen markiert.",
    "Full name *": "Vollständiger Name *",
    "Business email *": "Geschäftliche E-Mail *",
    "Phone / WhatsApp": "Telefon / WhatsApp",
    "Country": "Land",
    "Subject": "Betreff",
    "Message *": "Nachricht *",
    "Send enquiry": "Anfrage senden",
    "Sending…": "Wird gesendet…",
    "Sialkot, Pakistan": "Sialkot, Pakistan",
    "Export-oriented manufacturing": "Exportorientierte Fertigung",
    "Precision manufacturing support from Sialkot.": "Präzise Fertigungsunterstützung aus Sialkot.",
    "Configured around the buyer’s requirement.": "Auf die Anforderungen des Käufers abgestimmt.",
    "Verify what applies to the product and market.": "Prüfen Sie, was für Produkt und Markt gilt.",
    "Approved insights, not automated noise.": "Geprüfte Einblicke statt automatisierter Meldungen.",
    "Authentic images, published with context.": "Authentische Bilder mit klarem Kontext.",
    "Build precision with us.": "Gestalten Sie Präzision mit uns.",
    "Use a direct channel for a quick conversation, or send a structured enquiry with the information needed for review.":
      "Nutzen Sie einen direkten Kanal oder senden Sie eine strukturierte Anfrage mit den erforderlichen Angaben.",
    "One enquiry. Multiple requirements.": "Eine Anfrage. Mehrere Anforderungen.",
    "No account is required. Submitting an RFQ records an enquiry, not an order, and does not promise price, availability, MOQ or delivery timing.":
      "Kein Konto erforderlich. Eine Anfrage ist keine Bestellung und garantiert weder Preis, Verfügbarkeit, Mindestmenge noch Liefertermin.",
    "Your RFQ basket": "Ihre Anfrage",
    "Help us understand the order.": "Helfen Sie uns, die Bestellung zu verstehen.",
    "Buyer details": "Käuferdaten",
    "Company name *": "Firmenname *",
    "Country *": "Land *",
    "Target market": "Zielmarkt",
    "Product requirements": "Produktanforderungen",
    "You can list several products and quantities.": "Sie können mehrere Produkte und Mengen angeben.",
    "Products, SKUs or instrument references *": "Produkte, SKUs oder Instrumentreferenzen *",
    "Add project requirements": "Projektanforderungen hinzufügen",
    "Required standard / certification": "Erforderlicher Standard / Zertifizierung",
    "Desired delivery date": "Gewünschtes Lieferdatum",
    "Private-label requirements": "Private-Label-Anforderungen",
    "Packaging preference": "Verpackungswunsch",
    "Reference file": "Referenzdatei",
    "Submit Quote Request": "Angebotsanfrage senden",
    "Submitting RFQ…": "Anfrage wird gesendet…",
  },
  it: {
    "Skip to content": "Vai al contenuto",
    "Home": "Home",
    "Company": "Azienda",
    "Products": "Prodotti",
    "Manufacturing": "Produzione",
    "Quality": "Qualità",
    "Quality & compliance": "Qualità e conformità",
    "Blog / News": "Blog / Notizie",
    "Gallery": "Galleria",
    "Careers": "Lavora con noi",
    "Contact": "Contatti",
    "Search": "Cerca",
    "Catalog": "Catalogo",
    "Product Catalog": "Catalogo prodotti",
    "WhatsApp": "WhatsApp",
    "Request a Quote": "Richiedi un preventivo",
    "Language": "Lingua",
    "Apply": "Applica",
    "Precision instrument manufacturing · Sialkot, Pakistan":
      "Produzione di strumenti di precisione · Sialkot, Pakistan",
    "Precision Surgical, Dental & Beauty Instruments from Sialkot, Pakistan.":
      "Strumenti chirurgici, dentali ed estetici di precisione da Sialkot, Pakistan.",
    "Yone International supports professional and international buyers with focused manufacturing, clear communication and configurable supply options.":
      "Yone International supporta acquirenti professionali e internazionali con produzione specializzata, comunicazione chiara e forniture configurabili.",
    "Sialkot, Pakistan · Export-oriented manufacturing":
      "Sialkot, Pakistan · Produzione orientata all’esportazione",
    "View Products": "Vedi prodotti",
    "Download Catalog": "Scarica catalogo",
    "View Product Catalog": "Vedi catalogo prodotti",
    "Multi-product RFQs welcome · No buyer account required":
      "Richieste per più prodotti benvenute · Nessun account necessario",
    "Buyer documentation": "Documentazione per l’acquirente",
    "Product-specific compliance files shared on request":
      "Documenti di conformità specifici disponibili su richiesta",
    "Company facts": "Dati aziendali",
    "40 years": "40 anni",
    "Manufacturing expertise*": "Esperienza produttiva*",
    "Pakistan-based production": "Produzione in Pakistan",
    "3 core ranges": "3 gamme principali",
    "Dental · Beauty · Surgical": "Dentale · Estetica · Chirurgica",
    "One RFQ": "Un’unica richiesta",
    "Multiple products & quantities": "Più prodotti e quantità",
    "Product range": "Gamma prodotti",
    "Built around professional requirements.": "Progettata per esigenze professionali.",
    "Explore category": "Esplora categoria",
    "Featured products": "Prodotti in evidenza",
    "Approved instrument records.": "Schede strumenti approvate.",
    "View all products →": "Vedi tutti i prodotti →",
    "Flexible supply": "Fornitura flessibile",
    "Your label. Your packaging. Your market requirements.":
      "Il tuo marchio. Il tuo packaging. Le esigenze del tuo mercato.",
    "Review manufacturing capabilities": "Scopri le capacità produttive",
    "Private labelling": "Marchio privato",
    "Pre-order samples": "Campioni pre-ordine",
    "Custom packaging": "Packaging personalizzato",
    "International shipping": "Spedizione internazionale",
    "From requirement to dispatch": "Dalla richiesta alla spedizione",
    "A clear B2B enquiry process.": "Un processo B2B chiaro.",
    "Define": "Definizione",
    "Review": "Verifica",
    "Configure": "Configurazione",
    "Dispatch": "Spedizione",
    "Verify the documentation that applies to your exact order.":
      "Verifica la documentazione applicabile al tuo ordine.",
    "Leadership": "Leadership",
    "A message from Muhammad Mutahar ACCA.": "Un messaggio di Muhammad Mutahar ACCA.",
    "Read the CEO message": "Leggi il messaggio del CEO",
    "Start a conversation": "Inizia una conversazione",
    "Tell us what you need to source.": "Dicci cosa devi acquistare.",
    "Build your RFQ": "Crea la richiesta",
    "Chat on WhatsApp": "Chatta su WhatsApp",
    "Precision instruments, clearly specified.": "Strumenti di precisione, specifiche chiare.",
    "Start an RFQ": "Avvia una richiesta",
    "All categories": "Tutte le categorie",
    "Download catalog": "Scarica catalogo",
    "Our company": "La nostra azienda",
    "CEO message": "Messaggio del CEO",
    "HTML sitemap": "Mappa del sito",
    "All rights reserved.": "Tutti i diritti riservati.",
    "Privacy": "Privacy",
    "Terms": "Termini d’uso",
    "Cookie preferences": "Preferenze cookie",
    "Product disclaimer": "Avvertenza sui prodotti",
    "Find the instrument range you need.": "Trova la gamma di strumenti che ti serve.",
    "Search by product name, SKU or keyword": "Cerca per nome, SKU o parola chiave",
    "Search products": "Cerca prodotti",
    "Browse category →": "Sfoglia categoria →",
    "View details →": "Vedi dettagli →",
    "Add to RFQ": "Aggiungi alla richiesta",
    "Let’s discuss your requirement.": "Parliamo delle tue esigenze.",
    "Contact enquiry": "Richiesta di contatto",
    "Required fields are marked with an asterisk.": "I campi obbligatori sono contrassegnati da un asterisco.",
    "Full name *": "Nome completo *",
    "Business email *": "Email aziendale *",
    "Phone / WhatsApp": "Telefono / WhatsApp",
    "Country": "Paese",
    "Subject": "Oggetto",
    "Message *": "Messaggio *",
    "Send enquiry": "Invia richiesta",
    "Sending…": "Invio in corso…",
    "Sialkot, Pakistan": "Sialkot, Pakistan",
    "Export-oriented manufacturing": "Produzione orientata all’esportazione",
    "Precision manufacturing support from Sialkot.": "Supporto produttivo di precisione da Sialkot.",
    "Configured around the buyer’s requirement.": "Configurato sulle esigenze dell’acquirente.",
    "Verify what applies to the product and market.": "Verifica ciò che si applica al prodotto e al mercato.",
    "Approved insights, not automated noise.": "Approfondimenti approvati, non notizie automatiche.",
    "Authentic images, published with context.": "Immagini autentiche pubblicate con contesto.",
    "Build precision with us.": "Costruisci precisione con noi.",
    "Use a direct channel for a quick conversation, or send a structured enquiry with the information needed for review.":
      "Usa un canale diretto oppure invia una richiesta strutturata con le informazioni necessarie.",
    "One enquiry. Multiple requirements.": "Una richiesta. Più esigenze.",
    "No account is required. Submitting an RFQ records an enquiry, not an order, and does not promise price, availability, MOQ or delivery timing.":
      "Non serve un account. La richiesta non è un ordine e non garantisce prezzo, disponibilità, MOQ o tempi di consegna.",
    "Your RFQ basket": "La tua richiesta",
    "Help us understand the order.": "Aiutaci a comprendere l’ordine.",
    "Buyer details": "Dati dell’acquirente",
    "Company name *": "Nome azienda *",
    "Country *": "Paese *",
    "Target market": "Mercato di destinazione",
    "Product requirements": "Requisiti dei prodotti",
    "You can list several products and quantities.": "Puoi indicare più prodotti e quantità.",
    "Products, SKUs or instrument references *": "Prodotti, SKU o riferimenti degli strumenti *",
    "Add project requirements": "Aggiungi requisiti del progetto",
    "Required standard / certification": "Standard / certificazione richiesta",
    "Desired delivery date": "Data di consegna desiderata",
    "Private-label requirements": "Requisiti di marchio privato",
    "Packaging preference": "Preferenza di confezionamento",
    "Reference file": "File di riferimento",
    "Submit Quote Request": "Invia richiesta di preventivo",
    "Submitting RFQ…": "Invio richiesta…",
  },
  "zh-CN": {
    "Skip to content": "跳到主要内容",
    "Home": "首页",
    "Company": "公司",
    "Products": "产品",
    "Manufacturing": "制造能力",
    "Quality": "质量",
    "Quality & compliance": "质量与合规",
    "Blog / News": "博客 / 新闻",
    "Gallery": "图片库",
    "Careers": "招聘",
    "Contact": "联系我们",
    "Search": "搜索",
    "Catalog": "目录",
    "Product Catalog": "产品目录",
    "WhatsApp": "WhatsApp",
    "Request a Quote": "索取报价",
    "Language": "语言",
    "Apply": "应用",
    "Precision instrument manufacturing · Sialkot, Pakistan":
      "精密器械制造 · 巴基斯坦锡亚尔科特",
    "Precision Surgical, Dental & Beauty Instruments from Sialkot, Pakistan.":
      "来自巴基斯坦锡亚尔科特的精密外科、牙科与美容器械。",
    "Yone International supports professional and international buyers with focused manufacturing, clear communication and configurable supply options.":
      "Yone International 以专业制造、清晰沟通和灵活供应方案服务全球专业买家。",
    "Sialkot, Pakistan · Export-oriented manufacturing":
      "巴基斯坦锡亚尔科特 · 出口导向型制造",
    "View Products": "查看产品",
    "Download Catalog": "下载目录",
    "View Product Catalog": "查看产品目录",
    "Multi-product RFQs welcome · No buyer account required":
      "支持多产品询价 · 无需买家账户",
    "Buyer documentation": "买家文件",
    "Product-specific compliance files shared on request":
      "可按要求提供产品专属合规文件",
    "Company facts": "公司信息",
    "40 years": "40 年",
    "Manufacturing expertise*": "制造经验*",
    "Pakistan-based production": "巴基斯坦生产",
    "3 core ranges": "三大核心系列",
    "Dental · Beauty · Surgical": "牙科 · 美容 · 外科",
    "One RFQ": "一份询价",
    "Multiple products & quantities": "多个产品与数量",
    "Product range": "产品系列",
    "Built around professional requirements.": "围绕专业需求打造。",
    "Explore category": "浏览类别",
    "Featured products": "精选产品",
    "Approved instrument records.": "已审核器械信息。",
    "View all products →": "查看全部产品 →",
    "Flexible supply": "灵活供应",
    "Your label. Your packaging. Your market requirements.":
      "您的品牌、您的包装、您的市场要求。",
    "Review manufacturing capabilities": "查看制造能力",
    "Private labelling": "自有品牌",
    "Pre-order samples": "订单前样品",
    "Custom packaging": "定制包装",
    "International shipping": "国际运输",
    "From requirement to dispatch": "从需求到发货",
    "A clear B2B enquiry process.": "清晰的 B2B 询价流程。",
    "Define": "定义需求",
    "Review": "审核",
    "Configure": "配置",
    "Dispatch": "发货",
    "Verify the documentation that applies to your exact order.":
      "核实适用于您具体订单的文件。",
    "Leadership": "管理层",
    "A message from Muhammad Mutahar ACCA.": "Muhammad Mutahar ACCA 致辞。",
    "Read the CEO message": "阅读 CEO 致辞",
    "Start a conversation": "开始沟通",
    "Tell us what you need to source.": "告诉我们您的采购需求。",
    "Build your RFQ": "创建询价单",
    "Chat on WhatsApp": "通过 WhatsApp 沟通",
    "Precision instruments, clearly specified.": "精密器械，规格清晰。",
    "Start an RFQ": "开始询价",
    "All categories": "全部类别",
    "Download catalog": "下载目录",
    "Our company": "公司介绍",
    "CEO message": "CEO 致辞",
    "HTML sitemap": "网站地图",
    "All rights reserved.": "保留所有权利。",
    "Privacy": "隐私政策",
    "Terms": "使用条款",
    "Cookie preferences": "Cookie 偏好",
    "Product disclaimer": "产品免责声明",
    "Find the instrument range you need.": "查找您需要的器械系列。",
    "Search by product name, SKU or keyword": "按产品名称、SKU 或关键词搜索",
    "Search products": "搜索产品",
    "Browse category →": "浏览类别 →",
    "View details →": "查看详情 →",
    "Add to RFQ": "加入询价单",
    "Let’s discuss your requirement.": "让我们讨论您的需求。",
    "Contact enquiry": "联系咨询",
    "Required fields are marked with an asterisk.": "必填字段标有星号。",
    "Full name *": "姓名 *",
    "Business email *": "商务邮箱 *",
    "Phone / WhatsApp": "电话 / WhatsApp",
    "Country": "国家",
    "Subject": "主题",
    "Message *": "留言 *",
    "Send enquiry": "发送咨询",
    "Sending…": "正在发送…",
    "Sialkot, Pakistan": "巴基斯坦锡亚尔科特",
    "Export-oriented manufacturing": "出口导向型制造",
    "Precision manufacturing support from Sialkot.": "来自锡亚尔科特的精密制造支持。",
    "Configured around the buyer’s requirement.": "围绕买家需求进行配置。",
    "Verify what applies to the product and market.": "核实适用于产品与市场的要求。",
    "Approved insights, not automated noise.": "经审核的内容，而非自动生成的资讯。",
    "Authentic images, published with context.": "真实图片，并附清晰说明。",
    "Build precision with us.": "与我们共同打造精密品质。",
    "Use a direct channel for a quick conversation, or send a structured enquiry with the information needed for review.":
      "您可以直接联系我们，或提交包含审核所需信息的结构化咨询。",
    "One enquiry. Multiple requirements.": "一份询价，多项需求。",
    "No account is required. Submitting an RFQ records an enquiry, not an order, and does not promise price, availability, MOQ or delivery timing.":
      "无需账户。提交询价并非下单，也不承诺价格、库存、最低订购量或交期。",
    "Your RFQ basket": "您的询价单",
    "Help us understand the order.": "帮助我们了解您的订单。",
    "Buyer details": "买家信息",
    "Company name *": "公司名称 *",
    "Country *": "国家 *",
    "Target market": "目标市场",
    "Product requirements": "产品需求",
    "You can list several products and quantities.": "您可以填写多个产品及数量。",
    "Products, SKUs or instrument references *": "产品、SKU 或器械编号 *",
    "Add project requirements": "添加项目要求",
    "Required standard / certification": "所需标准 / 认证",
    "Desired delivery date": "期望交付日期",
    "Private-label requirements": "自有品牌要求",
    "Packaging preference": "包装偏好",
    "Reference file": "参考文件",
    "Submit Quote Request": "提交报价请求",
    "Submitting RFQ…": "正在提交询价…",
  },
  ja: {
    "Skip to content": "本文へ移動",
    "Home": "ホーム",
    "Company": "会社情報",
    "Products": "製品",
    "Manufacturing": "製造",
    "Quality": "品質",
    "Quality & compliance": "品質・コンプライアンス",
    "Blog / News": "ブログ / ニュース",
    "Gallery": "ギャラリー",
    "Careers": "採用情報",
    "Contact": "お問い合わせ",
    "Search": "検索",
    "Catalog": "カタログ",
    "Product Catalog": "製品カタログ",
    "WhatsApp": "WhatsApp",
    "Request a Quote": "見積もりを依頼",
    "Language": "言語",
    "Apply": "適用",
    "Precision instrument manufacturing · Sialkot, Pakistan":
      "精密器具製造 · パキスタン・シアールコート",
    "Precision Surgical, Dental & Beauty Instruments from Sialkot, Pakistan.":
      "パキスタン・シアールコート発の精密な外科・歯科・美容器具。",
    "Yone International supports professional and international buyers with focused manufacturing, clear communication and configurable supply options.":
      "Yone International は、専門的な製造、明確なコミュニケーション、柔軟な供給方法で海外のプロバイヤーを支援します。",
    "Sialkot, Pakistan · Export-oriented manufacturing":
      "パキスタン・シアールコート · 輸出向け製造",
    "View Products": "製品を見る",
    "Download Catalog": "カタログをダウンロード",
    "View Product Catalog": "製品カタログを見る",
    "Multi-product RFQs welcome · No buyer account required":
      "複数製品の見積依頼に対応 · アカウント登録不要",
    "Buyer documentation": "購入者向け資料",
    "Product-specific compliance files shared on request":
      "製品別コンプライアンス資料はご要望に応じて提供",
    "Company facts": "会社概要",
    "40 years": "40年",
    "Manufacturing expertise*": "製造経験*",
    "Pakistan-based production": "パキスタンで生産",
    "3 core ranges": "3つの主要分野",
    "Dental · Beauty · Surgical": "歯科 · 美容 · 外科",
    "One RFQ": "1件の見積依頼",
    "Multiple products & quantities": "複数の製品と数量",
    "Product range": "製品ライン",
    "Built around professional requirements.": "プロの要件に合わせた製品。",
    "Explore category": "カテゴリーを見る",
    "Featured products": "注目製品",
    "Approved instrument records.": "承認済み器具情報。",
    "View all products →": "すべての製品を見る →",
    "Flexible supply": "柔軟な供給",
    "Your label. Your packaging. Your market requirements.":
      "お客様のブランド、包装、市場要件に対応。",
    "Review manufacturing capabilities": "製造能力を見る",
    "Private labelling": "プライベートラベル",
    "Pre-order samples": "注文前サンプル",
    "Custom packaging": "カスタム包装",
    "International shipping": "国際配送",
    "From requirement to dispatch": "要件確認から発送まで",
    "A clear B2B enquiry process.": "明確なB2Bお問い合わせプロセス。",
    "Define": "要件定義",
    "Review": "確認",
    "Configure": "仕様調整",
    "Dispatch": "発送",
    "Verify the documentation that applies to your exact order.":
      "ご注文に適用される文書をご確認ください。",
    "Leadership": "経営陣",
    "A message from Muhammad Mutahar ACCA.": "Muhammad Mutahar ACCA からのメッセージ。",
    "Read the CEO message": "CEOメッセージを読む",
    "Start a conversation": "お問い合わせを始める",
    "Tell us what you need to source.": "調達したい製品をお知らせください。",
    "Build your RFQ": "見積依頼を作成",
    "Chat on WhatsApp": "WhatsAppで相談",
    "Precision instruments, clearly specified.": "明確な仕様の精密器具。",
    "Start an RFQ": "見積依頼を開始",
    "All categories": "すべてのカテゴリー",
    "Download catalog": "カタログをダウンロード",
    "Our company": "会社案内",
    "CEO message": "CEOメッセージ",
    "HTML sitemap": "サイトマップ",
    "All rights reserved.": "無断転載を禁じます。",
    "Privacy": "プライバシー",
    "Terms": "利用規約",
    "Cookie preferences": "Cookie設定",
    "Product disclaimer": "製品免責事項",
    "Find the instrument range you need.": "必要な器具ラインをお探しください。",
    "Search by product name, SKU or keyword": "製品名、SKU、キーワードで検索",
    "Search products": "製品を検索",
    "Browse category →": "カテゴリーを見る →",
    "View details →": "詳細を見る →",
    "Add to RFQ": "見積依頼に追加",
    "Let’s discuss your requirement.": "ご要望をお聞かせください。",
    "Contact enquiry": "お問い合わせ",
    "Required fields are marked with an asterisk.": "必須項目にはアスタリスクが付いています。",
    "Full name *": "お名前 *",
    "Business email *": "会社メール *",
    "Phone / WhatsApp": "電話 / WhatsApp",
    "Country": "国",
    "Subject": "件名",
    "Message *": "メッセージ *",
    "Send enquiry": "問い合わせを送信",
    "Sending…": "送信中…",
    "Sialkot, Pakistan": "パキスタン・シアールコート",
    "Export-oriented manufacturing": "輸出向け製造",
    "Precision manufacturing support from Sialkot.": "シアールコートから精密製造をサポート。",
    "Configured around the buyer’s requirement.": "購入者の要件に合わせて構成。",
    "Verify what applies to the product and market.": "製品と市場に適用される要件をご確認ください。",
    "Approved insights, not automated noise.": "審査済みの情報のみを掲載。",
    "Authentic images, published with context.": "背景情報を添えた実際の写真。",
    "Build precision with us.": "私たちと精密なものづくりを。",
    "Use a direct channel for a quick conversation, or send a structured enquiry with the information needed for review.":
      "直接ご相談いただくか、確認に必要な情報を含むお問い合わせを送信してください。",
    "One enquiry. Multiple requirements.": "1件の問い合わせで、複数の要件に対応。",
    "No account is required. Submitting an RFQ records an enquiry, not an order, and does not promise price, availability, MOQ or delivery timing.":
      "アカウントは不要です。見積依頼は注文ではなく、価格、在庫、最小数量、納期を保証するものではありません。",
    "Your RFQ basket": "見積依頼リスト",
    "Help us understand the order.": "ご注文内容をお知らせください。",
    "Buyer details": "購入者情報",
    "Company name *": "会社名 *",
    "Country *": "国 *",
    "Target market": "対象市場",
    "Product requirements": "製品要件",
    "You can list several products and quantities.": "複数の製品と数量を記載できます。",
    "Products, SKUs or instrument references *": "製品、SKU、器具参照番号 *",
    "Add project requirements": "プロジェクト要件を追加",
    "Required standard / certification": "必要な規格 / 認証",
    "Desired delivery date": "希望納期",
    "Private-label requirements": "プライベートラベル要件",
    "Packaging preference": "包装の希望",
    "Reference file": "参考ファイル",
    "Submit Quote Request": "見積依頼を送信",
    "Submitting RFQ…": "見積依頼を送信中…",
  },
  ko: {
    "Skip to content": "본문으로 이동",
    "Home": "홈",
    "Company": "회사 소개",
    "Products": "제품",
    "Manufacturing": "제조",
    "Quality": "품질",
    "Quality & compliance": "품질 및 규정 준수",
    "Blog / News": "블로그 / 뉴스",
    "Gallery": "갤러리",
    "Careers": "채용",
    "Contact": "문의",
    "Search": "검색",
    "Catalog": "카탈로그",
    "Product Catalog": "제품 카탈로그",
    "WhatsApp": "WhatsApp",
    "Request a Quote": "견적 요청",
    "Language": "언어",
    "Apply": "적용",
    "Precision instrument manufacturing · Sialkot, Pakistan":
      "정밀 기구 제조 · 파키스탄 시알코트",
    "Precision Surgical, Dental & Beauty Instruments from Sialkot, Pakistan.":
      "파키스탄 시알코트에서 생산하는 정밀 수술·치과·미용 기구.",
    "Yone International supports professional and international buyers with focused manufacturing, clear communication and configurable supply options.":
      "Yone International은 전문 제조, 명확한 소통, 유연한 공급 옵션으로 해외 전문 구매자를 지원합니다.",
    "Sialkot, Pakistan · Export-oriented manufacturing":
      "파키스탄 시알코트 · 수출 중심 제조",
    "View Products": "제품 보기",
    "Download Catalog": "카탈로그 다운로드",
    "View Product Catalog": "제품 카탈로그 보기",
    "Multi-product RFQs welcome · No buyer account required":
      "여러 제품 견적 요청 가능 · 구매자 계정 불필요",
    "Buyer documentation": "구매자 문서",
    "Product-specific compliance files shared on request":
      "요청 시 제품별 규정 준수 문서 제공",
    "Company facts": "회사 정보",
    "40 years": "40년",
    "Manufacturing expertise*": "제조 경험*",
    "Pakistan-based production": "파키스탄 생산",
    "3 core ranges": "3개 핵심 제품군",
    "Dental · Beauty · Surgical": "치과 · 미용 · 수술",
    "One RFQ": "하나의 견적 요청",
    "Multiple products & quantities": "여러 제품과 수량",
    "Product range": "제품군",
    "Built around professional requirements.": "전문 요구사항을 중심으로 설계.",
    "Explore category": "카테고리 보기",
    "Featured products": "주요 제품",
    "Approved instrument records.": "승인된 기구 정보.",
    "View all products →": "모든 제품 보기 →",
    "Flexible supply": "유연한 공급",
    "Your label. Your packaging. Your market requirements.":
      "귀사의 브랜드, 포장, 시장 요구사항.",
    "Review manufacturing capabilities": "제조 역량 보기",
    "Private labelling": "프라이빗 라벨",
    "Pre-order samples": "주문 전 샘플",
    "Custom packaging": "맞춤 포장",
    "International shipping": "국제 배송",
    "From requirement to dispatch": "요구사항부터 발송까지",
    "A clear B2B enquiry process.": "명확한 B2B 문의 절차.",
    "Define": "요구 정의",
    "Review": "검토",
    "Configure": "구성",
    "Dispatch": "발송",
    "Verify the documentation that applies to your exact order.":
      "귀하의 주문에 적용되는 문서를 확인하세요.",
    "Leadership": "경영진",
    "A message from Muhammad Mutahar ACCA.": "Muhammad Mutahar ACCA의 메시지.",
    "Read the CEO message": "CEO 메시지 읽기",
    "Start a conversation": "상담 시작",
    "Tell us what you need to source.": "필요한 조달 품목을 알려주세요.",
    "Build your RFQ": "견적 요청 작성",
    "Chat on WhatsApp": "WhatsApp 상담",
    "Precision instruments, clearly specified.": "명확한 사양의 정밀 기구.",
    "Start an RFQ": "견적 요청 시작",
    "All categories": "모든 카테고리",
    "Download catalog": "카탈로그 다운로드",
    "Our company": "회사 소개",
    "CEO message": "CEO 메시지",
    "HTML sitemap": "사이트맵",
    "All rights reserved.": "모든 권리 보유.",
    "Privacy": "개인정보처리방침",
    "Terms": "이용약관",
    "Cookie preferences": "쿠키 설정",
    "Product disclaimer": "제품 고지사항",
    "Find the instrument range you need.": "필요한 기구 제품군을 찾아보세요.",
    "Search by product name, SKU or keyword": "제품명, SKU 또는 키워드로 검색",
    "Search products": "제품 검색",
    "Browse category →": "카테고리 보기 →",
    "View details →": "상세 보기 →",
    "Add to RFQ": "견적 요청에 추가",
    "Let’s discuss your requirement.": "요구사항을 상담해 보세요.",
    "Contact enquiry": "문의하기",
    "Required fields are marked with an asterisk.": "필수 항목은 별표로 표시됩니다.",
    "Full name *": "성명 *",
    "Business email *": "회사 이메일 *",
    "Phone / WhatsApp": "전화 / WhatsApp",
    "Country": "국가",
    "Subject": "제목",
    "Message *": "메시지 *",
    "Send enquiry": "문의 보내기",
    "Sending…": "전송 중…",
    "Sialkot, Pakistan": "파키스탄 시알코트",
    "Export-oriented manufacturing": "수출 중심 제조",
    "Precision manufacturing support from Sialkot.": "시알코트의 정밀 제조 지원.",
    "Configured around the buyer’s requirement.": "구매자 요구사항에 맞춘 구성.",
    "Verify what applies to the product and market.": "제품과 시장에 적용되는 요건을 확인하세요.",
    "Approved insights, not automated noise.": "검토된 정보만 제공.",
    "Authentic images, published with context.": "설명과 함께 제공되는 실제 이미지.",
    "Build precision with us.": "정밀한 제조를 함께하세요.",
    "Use a direct channel for a quick conversation, or send a structured enquiry with the information needed for review.":
      "빠른 상담을 위해 직접 연락하거나 검토에 필요한 정보를 포함한 문의를 보내세요.",
    "One enquiry. Multiple requirements.": "하나의 문의, 여러 요구사항.",
    "No account is required. Submitting an RFQ records an enquiry, not an order, and does not promise price, availability, MOQ or delivery timing.":
      "계정이 필요하지 않습니다. 견적 요청은 주문이 아니며 가격, 재고, 최소수량 또는 납기를 보장하지 않습니다.",
    "Your RFQ basket": "견적 요청 목록",
    "Help us understand the order.": "주문 내용을 알려주세요.",
    "Buyer details": "구매자 정보",
    "Company name *": "회사명 *",
    "Country *": "국가 *",
    "Target market": "대상 시장",
    "Product requirements": "제품 요구사항",
    "You can list several products and quantities.": "여러 제품과 수량을 입력할 수 있습니다.",
    "Products, SKUs or instrument references *": "제품, SKU 또는 기구 참조번호 *",
    "Add project requirements": "프로젝트 요구사항 추가",
    "Required standard / certification": "필요 표준 / 인증",
    "Desired delivery date": "희망 납품일",
    "Private-label requirements": "프라이빗 라벨 요구사항",
    "Packaging preference": "포장 선호사항",
    "Reference file": "참고 파일",
    "Submit Quote Request": "견적 요청 제출",
    "Submitting RFQ…": "견적 요청 제출 중…",
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function localeDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function localePath(locale: Locale, path: string) {
  if (!path.startsWith("/") || path.startsWith("/api/") || path.startsWith("/admin")) {
    return path;
  }
  const prefix: Record<Locale, string> = {
    en: "",
    "en-US": "/us",
    ar: "/ar",
    de: "/de",
    it: "/it",
    "zh-CN": "/zh",
    ja: "/ja",
    ko: "/ko",
  };
  const knownPrefixes = Object.values(prefix).filter(Boolean);
  if (
    knownPrefixes.some(
      (candidate) => path === candidate || path.startsWith(`${candidate}/`),
    )
  ) {
    return path;
  }
  const cleanPath = path === "/" ? "" : path;
  return `${prefix[locale]}${cleanPath}` || "/";
}

export function switchLocalePath(locale: Locale, currentPath: string) {
  const knownPrefixes = ["/us", "/ar", "/de", "/it", "/zh", "/ja", "/ko"];
  const activePrefix = knownPrefixes.find(
    (candidate) =>
      currentPath === candidate || currentPath.startsWith(`${candidate}/`),
  );
  const unprefixedPath = activePrefix
    ? currentPath.slice(activePrefix.length) || "/"
    : currentPath;
  return localePath(locale, unprefixedPath);
}

export function translator(locale: Locale): Translate {
  const dictionary = translations[locale] || {};
  return (value: string) => {
    const leading = value.match(/^\s*/)?.[0] || "";
    const trailing = value.match(/\s*$/)?.[0] || "";
    const normalized = value.trim().replace(/\s+/g, " ");
    if (!normalized) return value;
    return `${leading}${dictionary[normalized] || normalized}${trailing}`;
  };
}

export async function getI18n() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const requested = headerStore.get("x-yone-locale");
  const stored = cookieStore.get(localeCookie)?.value;
  const locale: Locale = isLocale(requested)
    ? requested
    : isLocale(stored)
      ? stored
      : "en";
  return {
    locale,
    dir: localeDirection(locale),
    t: translator(locale),
    currentPath: headerStore.get("x-yone-public-path") || "/",
  };
}

const translatedStringProps = new Set([
  "alt",
  "aria-label",
  "description",
  "eyebrow",
  "label",
  "pending",
  "placeholder",
  "title",
]);

function localizeStructuredValue(
  value: unknown,
  t: Translate,
  locale: Locale,
): unknown {
  if (typeof value === "string") return t(value);
  if (Array.isArray(value)) {
    return value.map((item) => localizeStructuredValue(item, t, locale));
  }
  if (value && typeof value === "object" && !isValidElement(value)) {
    const record = value as Record<string, unknown>;
    const next: Record<string, unknown> = { ...record };
    for (const key of ["label", "title", "description", "eyebrow"]) {
      if (typeof record[key] === "string") next[key] = t(record[key]);
    }
    if (typeof record.href === "string") {
      next.href = localePath(locale, record.href);
    }
    return next;
  }
  return value;
}

export function localizeReactNode(
  node: ReactNode,
  t: Translate,
  locale: Locale = "en",
): ReactNode {
  if (typeof node === "string") return t(node);
  if (Array.isArray(node)) {
    return node.map((child) => localizeReactNode(child, t, locale));
  }
  if (!isValidElement(node)) return node;

  const element = node as ReactElement<Record<string, unknown>>;
  const props = element.props;
  const nextProps: Record<string, unknown> = {};

  if ("children" in props) {
    nextProps.children = localizeReactNode(props.children as ReactNode, t, locale);
  }

  for (const [key, value] of Object.entries(props)) {
    if (translatedStringProps.has(key) && typeof value === "string") {
      nextProps[key] = t(value);
    } else if (key === "breadcrumbs" || key === "items") {
      nextProps[key] = localizeStructuredValue(value, t, locale);
    } else if (key === "href" && typeof value === "string") {
      nextProps[key] = localePath(locale, value);
    }
  }

  return cloneElement(element, nextProps);
}
