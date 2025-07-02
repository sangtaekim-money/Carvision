import React, { createContext, useState, useContext } from "react";

// Translation data
const translations = {
  en: {
    carDetails: "{{make}} {{model}} ({{year}})",
    viewDetails: "View Details",
    home: "Home",
    boutique: "Boutique",
    search: "Search",
    contact: "Contact",
    help: "Help",
    bmwNeueKlasse: "The Future of Driving: BMW Neue Klasse",
    kiaK8: "Experience the Elegance of the Kia K8",
    lexus: "Luxury and Comfort: Discover Lexus",
    newModels: "Innovation at Its Best: Explore Our New Models",
    shopNow: "Shop Now",
    goBack: "Go Back",
    searchPlaceholder: "Search for cars...",
    availableCars: "Available Cars",
    noCarsAvailable: "No cars available",
    exploreCategories: "Explore Categories",
    sedan: "Sedan",
    suv: "SUV",
    bus: "Bus",
    truck: "Truck",
    convertible: "Convertible",
    electric: "Electric",
    contactOwner: "Contact the Owner",
    whatsapp: "WhatsApp",
    kakaoTalk: "KakaoTalk",
    telephone: "Telephone",
    howToBuy: "How to Buy",
    browseAndSearch: "Browse and Search",
    browseAndSearchDescription:
      "Explore a wide range of cars and use our search tools to find the perfect car that suits your needs and budget.",
    chooseAndDecide: "Choose and Decide",
    chooseAndDecideDescription:
      "Compare your favorite cars, check their details, and make an informed decision about the car you want to buy.",
    contactAndDeal: "Contact and Deal",
    contactAndDealDescription:
      "Reach out to the seller directly, discuss the details, and finalize the deal. We don’t handle payments—talk directly with the seller.",
    listings: "Listings",
    helpCenter: "Help Center",
    helpIntro: "Welcome to the KoreaCar Help Center. How can we assist you?",
    faq: "Frequently Asked Questions",
    faqSearch: "How do I search for cars?",
    faqSearchAnswer:
      "Easily type any car you want in the search bar, or browse through categories to find your desired car.",
    faqBuying: "What is the process for buying a car?",
    faqBuyingAnswer: "Please visit our detailed guide on the buying process:",
    buyingGuideLink: "Buying Process Guide",
    faqSupport: "How can I contact customer support?",
    faqSupportAnswer: "You can contact customer support by visiting our",
    contactPageLink: "Contact Page",
    contactSupport: "Contact Support",
    contactSupportIntro:
      "If you need further assistance, feel free to reach out to us via:",
    email: "Email",
    phone: "Phone",
    guides: "Guides",
    guidesIntro: "Check out our step-by-step guides to help you:",
    guideSearch: "How to search for cars",
    guidePlatform: "How to use the KoreaCar platform",
    guideContact: "How to contact sellers",
    contactUs: "Contact Us",
    contactIntro: "We are here to assist you. Feel free to reach out to us!",
    getInTouch: "Get in Touch",
    aboutUs: "About Us",
    aboutUsDescription:
      "At KoreaCar, we are dedicated to providing the best car services and support. Whether you're looking for your dream car or need assistance with your current one, we are just a message away. Your satisfaction is our priority!",
    footerSearchDescription: "Find your dream car with our advanced search tools.",
    footerContactDescription: "Have questions? Reach out to us anytime.",
    footerAboutDescription: "Learn more about our mission to connect buyers and sellers.",
    policy: "Policy",
    footerPolicyDescription: "Read our policies and terms of use for a safe experience.",
    allRightsReserved: "All rights reserved.",
  },

  ko: {
    carDetails: "{{make}} {{model}} ({{year}})",
    viewDetails: "자세히 보기",
    home: "홈",
    boutique: "부티크",
    search: "검색",
    contact: "연락처",
    help: "도움말",
    bmwNeueKlasse: "운전의 미래: BMW Neue Klasse",
    kiaK8: "기아 K8의 우아함을 경험하세요",
    lexus: "럭셔리와 편안함: 렉서스를 발견하세요",
    newModels: "최고의 혁신: 새로운 모델을 탐험하세요",
    shopNow: "지금 쇼핑하기",
    goBack: "뒤로 가기",
    searchPlaceholder: "차량 검색...",
    availableCars: "사용 가능한 차량",
    noCarsAvailable: "사용 가능한 차량이 없습니다",
    exploreCategories: "카테고리 탐색",
    sedan: "세단",
    suv: "SUV",
    bus: "버스",
    truck: "트럭",
    convertible: "컨버터블",
    electric: "전기차",
    contactOwner: "소유자에게 연락하기",
    whatsapp: "WhatsApp",
    kakaoTalk: "카카오톡",
    telephone: "전화",
    howToBuy: "구매 방법",
    browseAndSearch: "검색 및 탐색",
    browseAndSearchDescription:
      "다양한 차량을 탐색하고 검색 도구를 사용하여 필요와 예산에 맞는 완벽한 차량을 찾아보세요.",
    chooseAndDecide: "선택 및 결정",
    chooseAndDecideDescription:
      "선호하는 차량을 비교하고 세부 정보를 확인하여 구매할 차량에 대해 신중한 결정을 내리세요.",
    contactAndDeal: "연락 및 거래",
    contactAndDealDescription:
      "판매자에게 직접 연락하여 세부 사항을 논의하고 거래를 완료하세요. 결제는 처리하지 않으니 판매자와 직접 대화하세요.",
    listings: "목록",
    helpCenter: "도움말 센터",
    helpIntro: "KoreaCar 도움말 센터에 오신 것을 환영합니다. 무엇을 도와드릴까요?",
    faq: "자주 묻는 질문",
    faqSearch: "차량을 검색하려면 어떻게 해야 하나요?",
    faqSearchAnswer:
      "검색창에 원하는 차량을 입력하거나 카테고리를 탐색하여 원하는 차량을 찾으세요.",
    faqBuying: "차량 구매 절차는 어떻게 되나요?",
    faqBuyingAnswer: "구매 절차에 대한 자세한 가이드를 방문하세요:",
    buyingGuideLink: "구매 절차 가이드",
    faqSupport: "고객 지원에 어떻게 연락할 수 있나요?",
    faqSupportAnswer: "고객 지원에 연락하려면 다음을 방문하세요:",
    contactPageLink: "연락처 페이지",
    contactSupport: "지원 연락처",
    contactSupportIntro:
      "추가 도움이 필요하면 다음을 통해 저희에게 연락하세요:",
    email: "이메일",
    phone: "전화",
    guides: "가이드",
    guidesIntro: "도움이 되는 단계별 가이드를 확인하세요:",
    guideSearch: "차량 검색 방법",
    guidePlatform: "KoreaCar 플랫폼 사용 방법",
    guideContact: "판매자에게 연락하는 방법",
    contactUs: "문의하기",
    contactIntro: "저희는 항상 도와드릴 준비가 되어 있습니다. 언제든지 연락주세요!",
    getInTouch: "연락하기",
    aboutUs: "회사 소개",
    aboutUsDescription:
      "KoreaCar는 최고의 차량 서비스와 지원을 제공하기 위해 최선을 다하고 있습니다. 꿈의 차를 찾고 계시거나 현재 차량에 대한 지원이 필요하시면 언제든지 메시지를 보내주세요. 고객님의 만족이 저희의 최우선입니다!",
    footerSearchDescription: "고급 검색 도구로 꿈의 차를 찾아보세요.",
    footerContactDescription: "질문이 있으신가요? 언제든지 문의하세요.",
    footerAboutDescription: "구매자와 판매자를 연결하는 우리의 사명을 알아보세요.",
    policy: "정책",
    footerPolicyDescription: "안전한 경험을 위해 정책 및 이용 약관을 읽어보세요.",
    allRightsReserved: "모든 권리 보유.",
  },

  ar: {
    carDetails: "{{make}} {{model}} ({{year}})",
    viewDetails: "عرض التفاصيل",
    home: "الرئيسية",
    boutique: "المتجر",
    search: "بحث",
    contact: "اتصل بنا",
    help: "مساعدة",
    bmwNeueKlasse: "مستقبل القيادة: BMW Neue Klasse",
    kiaK8: "اختبر أناقة كيا K8",
    lexus: "الفخامة والراحة: اكتشف لكزس",
    newModels: "الابتكار في أفضل حالاته: استكشف موديلاتنا الجديدة",
    shopNow: "تسوق الآن",
    goBack: "العودة",
    searchPlaceholder: "ابحث عن السيارات...",
    availableCars: "السيارات المتاحة",
    noCarsAvailable: "لا توجد سيارات متاحة",
    exploreCategories: "استكشاف الفئات",
    sedan: "سيدان",
    suv: "دفع رباعي",
    bus: "حافلة",
    truck: "شاحنة",
    convertible: "قابل للتحويل",
    electric: "كهربائي",
    contactOwner: "اتصل بالمالك",
    whatsapp: "واتساب",
    kakaoTalk: "كاكاو توك",
    telephone: "هاتف",
    howToBuy: "كيفية الشراء",
    browseAndSearch: "تصفح وابحث",
    browseAndSearchDescription:
      "استكشف مجموعة واسعة من السيارات واستخدم أدوات البحث لدينا للعثور على السيارة المثالية التي تناسب احتياجاتك وميزانيتك.",
    chooseAndDecide: "اختر وقرر",
    chooseAndDecideDescription:
      "قارن بين سياراتك المفضلة، تحقق من تفاصيلها، واتخذ قرارًا مستنيرًا بشأن السيارة التي تريد شراؤها.",
    contactAndDeal: "تواصل واتفق",
    contactAndDealDescription:
      "تواصل مباشرة مع البائع، ناقش التفاصيل، وأكمل الصفقة. نحن لا نتعامل مع المدفوعات—تحدث مباشرة مع البائع.",
    listings: "القوائم",
    helpCenter: "مركز المساعدة",
    helpIntro: "مرحبًا بكم في مركز مساعدة KoreaCar. كيف يمكننا مساعدتك؟",
    faq: "الأسئلة الشائعة",
    faqSearch: "كيف أبحث عن السيارات؟",
    faqSearchAnswer:
      "يمكنك كتابة السيارة التي تريدها في شريط البحث أو تصفح الفئات للعثور على السيارة المطلوبة.",
    faqBuying: "ما هي عملية شراء السيارة؟",
    faqBuyingAnswer: "يرجى زيارة دليلنا التفصيلي حول عملية الشراء:",
    buyingGuideLink: "دليل عملية الشراء",
    faqSupport: "كيف يمكنني الاتصال بدعم العملاء؟",
    faqSupportAnswer: "يمكنك الاتصال بدعم العملاء من خلال زيارة:",
    contactPageLink: "صفحة الاتصال",
    contactSupport: "اتصل بالدعم",
    contactSupportIntro:
      "إذا كنت بحاجة إلى مزيد من المساعدة، فلا تتردد في التواصل معنا عبر:",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    guides: "الأدلة",
    guidesIntro: "اطلع على أدلتنا خطوة بخطوة لمساعدتك:",
    guideSearch: "كيفية البحث عن السيارات",
    guidePlatform: "كيفية استخدام منصة KoreaCar",
    guideContact: "كيفية الاتصال بالبائعين",
    contactUs: "اتصل بنا",
    contactIntro: "نحن هنا لمساعدتك. لا تتردد في التواصل معنا!",
    getInTouch: "تواصل معنا",
    aboutUs: "معلومات عنا",
    aboutUsDescription:
      "في KoreaCar، نحن ملتزمون بتقديم أفضل خدمات السيارات والدعم. سواء كنت تبحث عن سيارتك المثالية أو تحتاج إلى مساعدة بسيارتك الحالية، نحن على بعد رسالة فقط. رضاك هو أولويتنا!",
    footerSearchDescription: "ابحث عن سيارتك المثالية باستخدام أدوات البحث المتقدمة لدينا.",
    footerContactDescription: "لديك أسئلة؟ تواصل معنا في أي وقت.",
    footerAboutDescription: "تعرف على مهمتنا في ربط المشترين والبائعين.",
    policy: "السياسة",
    footerPolicyDescription: "اقرأ سياساتنا وشروط الاستخدام لتجربة آمنة.",
    allRightsReserved: "جميع الحقوق محفوظة.",
  },
};



// Create context
const TranslationContext = createContext();

// Translation provider
export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default language is English

  const translate = (key, params = {}) => {
    const template = translations[language][key] || key;
    return template.replace(/{{(.*?)}}/g, (_, param) => params[param] || "");
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use translation
export const useTranslation = () => useContext(TranslationContext);