/**
 * Demo data for Bhumi Vikas Sahayak.
 * Note: These are representative demo entries referencing the Madhya Pradesh
 * Bhumi Vikas Niyam, 2012 (consolidated amendments up to 6 March 2025).
 * Clearly marked as demonstrative civic-tech guidance, not official legal certification.
 */

export const REGULATION_DISCLAIMER = {
  coverageDate: "6 March 2025",
  statuteName: "Madhya Pradesh Bhumi Vikas Niyam, 2012 (as amended)",
  notice: "Consolidated reference records extend through 6 March 2025. This tool provides assistive statutory lookup and does not constitute certified legal opinion or an official sanctioned building permit clearance."
};

export const SAMPLE_LOCATIONS = [
  { id: "bhopal", name: "Bhopal (Municipal Corporation)", zone: "Capital Planning Area", code: "BPL-01" },
  { id: "indore", name: "Indore (Municipal Corporation)", zone: "Indore Development Authority", code: "IND-02" },
  { id: "jabalpur", name: "Jabalpur (Municipal Corporation)", zone: "Jabalpur Municipal Area", code: "JBL-03" },
  { id: "gwalior", name: "Gwalior (Municipal Corporation)", zone: "Gwalior Special Area", code: "GWL-04" },
  { id: "ujjain", name: "Ujjain (Municipal Corporation)", zone: "Ujjain Development Area", code: "UJN-05" }
];

export const SUGGESTED_QUESTIONS = [
  {
    id: "q1",
    en: "What are the setback requirements for residential buildings?",
    hi: "आवासीय भवनों के लिए सेटबैक (खुले स्थान) की क्या आवश्यकताएं हैं?"
  },
  {
    id: "q2",
    en: "What is the permissible building height in Bhopal?",
    hi: "भोपाल में भवन की अनुमेय ऊंचाई कितनी है?"
  },
  {
    id: "q3",
    en: "What are the rules for commercial plot development?",
    hi: "व्यावसायिक भूखंड विकास के लिए क्या नियम हैं?"
  },
  {
    id: "q4",
    en: "Can I construct a basement in residential areas?",
    hi: "क्या आवासीय क्षेत्रों में बेसमेंट (तहखाना) का निर्माण किया जा सकता है?"
  }
];

export const DEMO_RESPONSES = {
  "setback": {
    question: "What are the setback requirements for residential buildings?",
    answer: "Under Rule 53 and Table 5 of the Madhya Pradesh Bhumi Vikas Niyam, 2012, mandatory open spaces (front, rear, and side setbacks) for residential plots depend on plot area and abutting road width. For medium residential plots (100–250 sq.m), a minimum front setback of 3.0 metres and a rear setback of 2.0 metres are generally mandated, with side setbacks varying based on detached or semi-detached configurations. On roads narrower than 9 metres, specific minimum setback offsets apply to preserve light and ventilation.",
    language: "en",
    status: "answered",
    sources: [
      {
        ruleNumber: "Rule 53, Table 5",
        title: "Minimum Open Spaces and Setback Standards for Residential Plots",
        sourceText: "Every residential plot shall maintain continuous open spaces along the periphery. The front setback shall be not less than 3.0 m for plots fronting roads up to 12 m width, ensuring unhindered access for emergency apparatus, natural ventilation, and daylight ingress.",
        pageStart: 48,
        pageEnd: 50,
        documentName: "MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf"
      },
      {
        ruleNumber: "Rule 54(2)",
        title: "Projections and Permissible Architectural Cantilevers",
        sourceText: "Chhajjas, weather-frames, and cornices may project into the required side or rear setback by not more than 0.60 metres at minimum vertical headroom clearance of 2.10 metres above ground level.",
        pageStart: 52,
        pageEnd: 53,
        documentName: "MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf"
      }
    ]
  },
  "height": {
    question: "What is the permissible building height in Bhopal?",
    answer: "Building height in Bhopal planning areas is regulated primarily under Rule 55 and the Bhopal Master Plan development controls. Permissible height is governed by the width of the abutting public road and the permissible Floor Area Ratio (FAR). For roads with a minimum width of 12 metres, residential structures up to 12.5–15 metres are standardly permissible. For high-rise buildings exceeding 15 metres, mandatory fire safety clearances, wider setbacks (minimum 4.5m to 6m), and wider approach roads (minimum 18m) apply under Rule 58 and National Building Code standards.",
    language: "en",
    status: "answered",
    sources: [
      {
        ruleNumber: "Rule 55(1)",
        title: "Maximum Height of Buildings Based on Abutting Road Width",
        sourceText: "No building shall exceed a height equal to 1.5 times the width of the abutting street plus front open space, subject to specific FAR maximums determined for the zone under the applicable Master Plan.",
        pageStart: 55,
        pageEnd: 56,
        documentName: "MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf"
      },
      {
        ruleNumber: "Rule 58",
        title: "High-Rise Building Sanction Protocols",
        sourceText: "Any structure exceeding 15 metres in vertical architectural height is classified as a multi-storey/high-rise building and requires explicit fire authority no-objection certificates and structural stability validation.",
        pageStart: 61,
        pageEnd: 63,
        documentName: "MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf"
      }
    ]
  },
  "commercial": {
    question: "What are the rules for commercial plot development?",
    answer: "Commercial plot developments are governed under Chapter IV and Rule 56 of the MP Bhumi Vikas Niyam. Key parameters include mandatory parking allocations (at least 1 Equivalent Car Space per 50 sq.m of commercial carpet area), mandatory 6.0m minimum front setbacks on primary commercial avenues, minimum internal corridor widths of 2.0 metres, and handicap-accessible ramps. Ground coverage is restricted to 40%–50% depending on plot sizing to ensure adequate vehicular turning circles and service loading bays.",
    language: "en",
    status: "answered",
    sources: [
      {
        ruleNumber: "Rule 56",
        title: "Commercial Use and Business Occupancy Requirements",
        sourceText: "Development of commercial plots requires dedicated loading/unloading bays detached from public vehicular circulation, with minimum setbacks of 6.0m on major arterial roads and stringent provisions for solid waste containment.",
        pageStart: 57,
        pageEnd: 59,
        documentName: "MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf"
      },
      {
        ruleNumber: "Rule 83, Schedule VII",
        title: "Off-Street Parking Standards for Commercial Complexes",
        sourceText: "Commercial complexes exceeding 200 sq.m built-up area shall provide off-street parking at the rate of not less than 1 ECS per 50 sq.m floor area, plus 25% additional parking space for two-wheelers.",
        pageStart: 94,
        pageEnd: 96,
        documentName: "MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf"
      }
    ]
  },
  "basement": {
    question: "Can I construct a basement in residential areas?",
    answer: "Yes, basements are permitted in residential developments subject to Rule 63 of the MP Bhumi Vikas Niyam, 2012. A residential basement can be used strictly for parking, air conditioning plant, storage of household non-combustibles, or domestic service machinery. It cannot be used for habitable rooms or sleeping quarters. The basement must not project beyond the building line (must respect all surface setbacks), the ceiling must rise at least 0.9m to 1.2m above surrounding ground level for ventilation, and adequate waterproofing and drainage against water-table seepage are mandatory.",
    language: "en",
    status: "answered",
    sources: [
      {
        ruleNumber: "Rule 63",
        title: "Construction and Permitted Uses of Basement",
        sourceText: "A basement shall be constructed within the prescribed building line and shall not encroach upon mandatory open spaces. It shall be used exclusively for parking, air-conditioning equipment, and non-combustible domestic storage. Habitable rooms or commercial retail in residential basements are prohibited.",
        pageStart: 72,
        pageEnd: 74,
        documentName: "MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf"
      }
    ]
  }
};

export const UI_TRANSLATIONS = {
  en: {
    appTitle: "Bhumi Vikas Sahayak",
    appSubtitle: "Madhya Pradesh Building Regulations",
    tagline: "Understand the rules before you build.",
    eyebrow: "BHOPAL · BUILDING REGULATIONS",
    introDescription: "Find applicable provisions in the supplied Madhya Pradesh building regulations, with rule references and source documents.",
    disclaimerBar: "Consolidated rules extend through 6 March 2025. Demo research environment.",
    inputPlaceholder: "Ask about setbacks, building height, plot requirements...",
    askButton: "Ask",
    askingButton: "Searching Rules...",
    suggestedHeading: "Suggested Questions",
    recentHeading: "Recent Inquiries",
    noRecent: "No recent inquiries yet in this session.",
    clearHistory: "Clear",
    sourcesLabel: "Rule Citations & Source Documentation",
    tabAnswer: "Answer",
    tabSourceDoc: "Source Document",
    tabMapLocation: "Location / Jurisdiction",
    saveQuestion: "Save",
    savedQuestion: "Saved",
    share: "Share",
    copiedToast: "Link copied to clipboard",
    openPdf: "Open Source Document",
    emptyAnswerTitle: "Select or ask a question to review regulations",
    emptyAnswerDesc: "Inquire about zoning, setbacks, Floor Area Ratio (FAR), height limits, or parking norms under the MP Bhumi Vikas Niyam, 2012.",
    demoNotice: "Demonstration Response — Generated using local reference extracts up to 6 March 2025.",
    pageRef: "Pages",
    insufficientEvidenceTitle: "No direct statutory match found in index",
    insufficientEvidenceDesc: "The provided query does not match explicit rules in the loaded MP Bhumi Vikas Niyam index. Please refine your search terms or verify with the local planning authority.",
    navHome: "Home",
    navAsk: "Ask a Question",
    navRegulations: "Building Regulations",
    navLocation: "Location",
    navRecent: "Recent Questions",
    navSaved: "Saved Documents",
    navAbout: "About",
    docPreviewTitle: "Madhya Pradesh Bhumi Vikas Niyam, 2012",
    docPreviewSubtitle: "Consolidated Gazette Amendments up to 6 March 2025",
    pdfStatusEmpty: "Direct PDF stream reader will connect to RAG backend",
    pdfStatusDesc: "Citations point to verified sections in the official Department of Urban Development and Housing notification.",
    locationNotice: "Jurisdiction and Master Plan Area",
    locationDesc: "Applicable Floor Area Ratio (FAR) and road width criteria vary between Municipal Corporations and Planning Authorities in Madhya Pradesh. Selecting your jurisdiction aligns local statutory tables."
  },
  hi: {
    appTitle: "भूमि विकास सहायक",
    appSubtitle: "मध्य प्रदेश भवन निर्माण एवं विकास नियम",
    tagline: "निर्माण से पहले नियमों को समझें।",
    eyebrow: "भोपाल · भवन निर्माण विनियम",
    introDescription: "मध्य प्रदेश भूमि विकास नियमों के लागू प्रावधान, नियम संख्या और संदर्भ दस्तावेजों सहित खोजें।",
    disclaimerBar: "समेकित नियम 6 मार्च 2025 तक अद्यतन हैं। प्रादर्श अनुसंधान परिवेश।",
    inputPlaceholder: "सेटबैक, भवन ऊंचाई, भूखंड आवश्यकता आदि के बारे में पूछें...",
    askButton: "पूछें",
    askingButton: "नियम खोजे जा रहे हैं...",
    suggestedHeading: "सुझाए गए प्रश्न",
    recentHeading: "हाल ही में पूछे गए प्रश्न",
    noRecent: "इस सत्र में अभी तक कोई प्रश्न नहीं पूछा गया है।",
    clearHistory: "हटाएं",
    sourcesLabel: "नियम संदर्भ और मूल स्रोत उद्धरण",
    tabAnswer: "उत्तर",
    tabSourceDoc: "मूल दस्तावेज",
    tabMapLocation: "स्थान / कार्यक्षेत्र",
    saveQuestion: "सहेजें",
    savedQuestion: "सहेजा गया",
    share: "साझा करें",
    copiedToast: "लिंक क्लिपबोर्ड पर कॉपी किया गया",
    openPdf: "मूल दस्तावेज देखें",
    emptyAnswerTitle: "नियमों की समीक्षा के लिए कोई प्रश्न चुनें या टाइप करें",
    emptyAnswerDesc: "म.प्र. भूमि विकास नियम, 2012 के तहत जोनिंग, सेटबैक, एफ.ए.आर., ऊंचाई सीमा या पार्किंग मानकों की जानकारी प्राप्त करें।",
    demoNotice: "डेमो प्रत्युत्तर — 6 मार्च 2025 तक के संदर्भ उद्धरणों पर आधारित।",
    pageRef: "पृष्ठ",
    insufficientEvidenceTitle: "अनुक्रमणिका में कोई सीधा नियम नहीं मिला",
    insufficientEvidenceDesc: "पूछा गया प्रश्न वर्तमान म.प्र. भूमि विकास नियमों की अनुक्रमणिका से मेल नहीं खाता। कृपया अन्य शब्दों का उपयोग करें या स्थानीय योजना प्राधिकरण से पुष्टि करें।",
    navHome: "मुख्य पृष्ठ",
    navAsk: "प्रश्न पूछें",
    navRegulations: "भवन निर्माण नियम",
    navLocation: "स्थान",
    navRecent: "हाल के प्रश्न",
    navSaved: "सहेजे गए दस्तावेज",
    navAbout: "परिचय",
    docPreviewTitle: "मध्य प्रदेश भूमि विकास नियम, 2012",
    docPreviewSubtitle: "6 मार्च 2025 तक समेकित राजपत्र संशोधन",
    pdfStatusEmpty: "सीधा पीडीएफ दर्शक आर.ए.जी. बैकएंड से जुड़ेगा",
    pdfStatusDesc: "उद्धरण नगरीय विकास एवं आवास विभाग की आधिकारिक अधिसूचना के सत्यापित अध्यायों को संदर्भित करते हैं।",
    locationNotice: "अधिकार क्षेत्र और मास्टर प्लान क्षेत्र",
    locationDesc: "मध्य प्रदेश में नगर निगमों और विकास प्राधिकरणों के अनुसार एफ.ए.आर. एवं मार्ग चौड़ाई के नियम लागू होते हैं।"
  }
};

export const REGULATIONS_OVERVIEW = [
  {
    chapter: "Chapter I",
    title: "Preliminary & Definitions",
    rules: "Rules 1 - 3",
    description: "Definitions of built-up area, carpet area, FAR, setback, road width, habitable room, high-rise building, and occupancy classifications."
  },
  {
    chapter: "Chapter II",
    title: "Building Permit & Sanctions",
    rules: "Rules 4 - 20",
    description: "Procedures for building permission applications, registered architect scrutiny, required drawings, scrutiny fees, and time limits for sanction."
  },
  {
    chapter: "Chapter III",
    title: "Site Requirements & Land Use",
    rules: "Rules 21 - 42",
    description: "Conformity to Master Plans, layout sanctions, access roads, public utilities, open spaces, and development around heritage or water bodies."
  },
  {
    chapter: "Chapter IV",
    title: "General Building Requirements & Setbacks",
    rules: "Rules 43 - 75",
    description: "Prescribed front, rear, and side setbacks, maximum permissible building height, FAR limits, basement criteria, light, and ventilation."
  },
  {
    chapter: "Chapter V",
    title: "Fire Protection & Structural Safety",
    rules: "Rules 76 - 98",
    description: "Fire safety installations, emergency exits, refuge areas, earthquake resistant design standards, and structural engineer certifications."
  },
  {
    chapter: "Chapter VI",
    title: "Special Occupancies & Sustainable Features",
    rules: "Rules 99 - 114",
    description: "Rainwater harvesting mandates, solar water heating systems, accessibility provisions for persons with disabilities, and green building norms."
  }
];
