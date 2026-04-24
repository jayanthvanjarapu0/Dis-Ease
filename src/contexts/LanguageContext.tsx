import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "en" | "hi";

const STORAGE_KEY = "disease-language";

const translations = {
  en: {
    "nav.home": "Home",
    "nav.history": "History",
    "nav.profile": "Profile",
    "nav.signOut": "Sign out",
    "nav.signIn": "Sign in",
    "auth.signInTitle": "Welcome back",
    "auth.signInSubtitle": "Sign in to continue your health journey",
    "auth.signUpTitle": "Create account",
    "auth.signUpSubtitle": "Set up your profile to get personalized guidance",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full name",
    "auth.age": "Age",
    "auth.gender": "Gender",
    "auth.bloodGroup": "Blood group",
    "auth.signIn": "Sign in",
    "auth.signUp": "Sign up",
    "auth.googleSignIn": "Continue with Google",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.or": "or",
    "auth.male": "Male",
    "auth.female": "Female",
    "auth.other": "Other",
    "disclaimer.title": "Important medical disclaimer",
    "disclaimer.body":
      "This app is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified doctor.",
    "disclaimer.accept": "I Understand",
    "home.tagline": "Dis-Ease AI-supported health guidance",
    "home.title1": "Dis-Ease",
    "home.title2": "care guidance",
    "home.title3": "for your symptoms",
    "home.subtitle":
      "Explore possible conditions, understand urgency, and prepare safer next steps before speaking with a licensed clinician.",
    "home.searchPlaceholder": "Search your symptoms",
    "home.startCheck": "Start Check",
    "home.reviews": "1,020+ Reviews",
    "home.footer": "Not a replacement for professional medical advice, diagnosis, treatment, or emergency care.",
    "results.newCheck": "New check",
    "results.firstPass": "First-pass symptom checkout",
    "results.summaryFor": "Summary for",
    "results.reportedSymptoms": "Reported symptoms",
    "results.urgencyCheck": "Urgency check",
    "results.followUp": "What else are you going through?",
    "results.submit": "Submit",
    "results.medications": "Medication options",
    "results.causes": "Possible causes",
    "results.precautions": "Precautions",
    "results.tabletTimings": "Tablet timings",
    "results.hospitals": "Local hospitals near me",
    "results.useLocation": "Use my location",
    "results.callEmergency": "Call emergency",
    "results.openMap": "Open map",
    "results.findingHospitals": "Finding hospitals",
    "results.nextSteps": "Suggested next steps",
    "results.downloadReport": "Download Report",
    "results.severity": "Severity",
    "results.predicted": "Predicted condition",
    "history.title": "Health history",
    "history.subtitle": "Your past symptom searches and predicted conditions.",
    "history.empty": "No searches yet. Start a new symptom check from the home page.",
    "history.delete": "Delete",
    "history.symptoms": "Symptoms",
    "history.date": "Date",
    "history.condition": "Predicted condition",
    "common.loading": "Loading...",
    "common.cancel": "Cancel",
    "severity.low": "Low",
    "severity.moderate": "Moderate",
    "severity.high": "High",
    "severity.emergency": "Emergency",
  },
  hi: {
    "nav.home": "होम",
    "nav.history": "इतिहास",
    "nav.profile": "प्रोफ़ाइल",
    "nav.signOut": "साइन आउट",
    "nav.signIn": "साइन इन",
    "auth.signInTitle": "वापस स्वागत है",
    "auth.signInSubtitle": "अपनी स्वास्थ्य यात्रा जारी रखने के लिए साइन इन करें",
    "auth.signUpTitle": "खाता बनाएँ",
    "auth.signUpSubtitle": "व्यक्तिगत मार्गदर्शन के लिए अपनी प्रोफ़ाइल सेट करें",
    "auth.email": "ईमेल",
    "auth.password": "पासवर्ड",
    "auth.name": "पूरा नाम",
    "auth.age": "उम्र",
    "auth.gender": "लिंग",
    "auth.bloodGroup": "रक्त समूह",
    "auth.signIn": "साइन इन",
    "auth.signUp": "साइन अप",
    "auth.googleSignIn": "Google के साथ जारी रखें",
    "auth.noAccount": "खाता नहीं है?",
    "auth.hasAccount": "पहले से खाता है?",
    "auth.or": "या",
    "auth.male": "पुरुष",
    "auth.female": "महिला",
    "auth.other": "अन्य",
    "disclaimer.title": "महत्वपूर्ण चिकित्सा अस्वीकरण",
    "disclaimer.body":
      "यह ऐप केवल सूचनात्मक उद्देश्यों के लिए है और पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है। हमेशा एक योग्य डॉक्टर से परामर्श करें।",
    "disclaimer.accept": "मैं समझता हूँ",
    "home.tagline": "Dis-Ease AI-समर्थित स्वास्थ्य मार्गदर्शन",
    "home.title1": "Dis-Ease",
    "home.title2": "देखभाल मार्गदर्शन",
    "home.title3": "आपके लक्षणों के लिए",
    "home.subtitle":
      "संभावित स्थितियों का पता लगाएँ, तात्कालिकता को समझें और एक लाइसेंस प्राप्त चिकित्सक से बात करने से पहले सुरक्षित अगले कदमों की तैयारी करें।",
    "home.searchPlaceholder": "अपने लक्षण खोजें",
    "home.startCheck": "जाँच शुरू करें",
    "home.reviews": "1,020+ समीक्षाएँ",
    "home.footer": "यह पेशेवर चिकित्सा सलाह, निदान, उपचार या आपातकालीन देखभाल का विकल्प नहीं है।",
    "results.newCheck": "नई जाँच",
    "results.firstPass": "प्राथमिक लक्षण जाँच",
    "results.summaryFor": "सारांश",
    "results.reportedSymptoms": "रिपोर्ट किए गए लक्षण",
    "results.urgencyCheck": "तात्कालिकता जाँच",
    "results.followUp": "आप और क्या अनुभव कर रहे हैं?",
    "results.submit": "जमा करें",
    "results.medications": "दवा विकल्प",
    "results.causes": "संभावित कारण",
    "results.precautions": "सावधानियाँ",
    "results.tabletTimings": "टैबलेट समय",
    "results.hospitals": "मेरे पास के अस्पताल",
    "results.useLocation": "मेरा स्थान उपयोग करें",
    "results.callEmergency": "आपातकालीन कॉल",
    "results.openMap": "मानचित्र खोलें",
    "results.findingHospitals": "अस्पताल खोज रहे हैं",
    "results.nextSteps": "सुझाए गए अगले कदम",
    "results.downloadReport": "रिपोर्ट डाउनलोड करें",
    "results.severity": "गंभीरता",
    "results.predicted": "अनुमानित स्थिति",
    "history.title": "स्वास्थ्य इतिहास",
    "history.subtitle": "आपकी पिछली लक्षण खोजें और अनुमानित स्थितियाँ।",
    "history.empty": "अभी तक कोई खोज नहीं। होम पेज से नई लक्षण जाँच शुरू करें।",
    "history.delete": "हटाएँ",
    "history.symptoms": "लक्षण",
    "history.date": "तारीख",
    "history.condition": "अनुमानित स्थिति",
    "common.loading": "लोड हो रहा है...",
    "common.cancel": "रद्द करें",
    "severity.low": "कम",
    "severity.moderate": "मध्यम",
    "severity.high": "उच्च",
    "severity.emergency": "आपातकाल",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem(STORAGE_KEY) as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const toggleLanguage = () => setLanguageState(language === "en" ? "hi" : "en");
  const t = (key: TranslationKey) => translations[language][key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};