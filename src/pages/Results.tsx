import { motion } from "motion/react";
import { AlertTriangle, ArrowLeft, Baby, ClipboardCheck, Download, MapPin, Phone, Pill, ShieldPlus, Stethoscope } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { analyzeSymptoms } from "@/lib/symptomAnalysis";
import { generateMedicalReport } from "@/lib/pdfReport";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const headacheMedications = [
  "Paracetamol/acetaminophen for mild to moderate headache, following the package dose limits.",
  "Ibuprofen or naproxen may help tension-type headaches if safe for you to take.",
  "Oral rehydration, water, and rest can help when headache is linked to dehydration or fatigue.",
];

const headachePrecautions = [
  "Avoid taking multiple pain relievers together unless a clinician says it is safe.",
  "Do not use ibuprofen/naproxen with stomach ulcers, kidney disease, blood thinners, or late pregnancy unless advised.",
  "Seek urgent care for sudden worst-ever headache, fever with stiff neck, weakness, confusion, vision loss, head injury, or repeated vomiting.",
];

const headacheTabletTimings = [
  "Paracetamol: usually after food, every 6–8 hours only if needed; do not exceed the package daily limit.",
  "Ibuprofen: only after food, usually every 8 hours if safe for you; avoid on an empty stomach.",
  "Do not combine pain tablets without advice from a doctor or pharmacist.",
];

const bloodVomitingMedications = [
  "Vomiting blood is an emergency symptom — do not self-medicate at home.",
  "Avoid aspirin, ibuprofen, naproxen, alcohol, and blood-thinning medicines unless an emergency clinician tells you otherwise.",
  "Do not take anything by mouth if bleeding is ongoing, vomiting continues, or you feel faint; call emergency services or go to the ER now.",
];

const bloodVomitingPrecautions = [
  "Sit upright or lie on your side to reduce choking risk while waiting for help.",
  "Seek emergency care immediately, especially with black stools, dizziness, weakness, severe belly pain, chest pain, or large amounts of blood.",
  "Bring a list of medications, alcohol use, ulcers/liver disease history, and any blood thinners to the hospital.",
];

const bloodVomitingTabletTimings = [
  "Do not take tablets at home for blood vomiting unless an emergency clinician tells you to.",
  "Call 108 or go to the nearest emergency department immediately.",
];

const symptomMedicationGuides = [
  {
    match: /headache|migraine/i,
    intro: "For headache, these options may help if your checklist has no danger signs and the medicine is safe for you.",
    causes: [
      "Common causes include stress, poor sleep, dehydration, eye strain, sinus issues, or migraine.",
      "More serious causes are possible if headache is sudden, severe, after injury, or comes with fever, weakness, confusion, or vision changes.",
    ],
    medications: headacheMedications,
    precautions: headachePrecautions,
    tabletTimings: headacheTabletTimings,
  },
  {
    match: /blood.*vomit|vomit.*blood|vomiting blood|vomtings blood/i,
    intro: "For blood vomiting, avoid home medication and get emergency help immediately.",
    causes: [
      "Possible causes include stomach ulcer bleeding, severe gastritis, liver-related vein bleeding, a tear after forceful vomiting, or blood-thinning medicines.",
      "Because the cause can be internal bleeding, this needs emergency evaluation now.",
    ],
    medications: bloodVomitingMedications,
    precautions: bloodVomitingPrecautions,
    tabletTimings: bloodVomitingTabletTimings,
  },
  {
    match: /dizziness|vertigo|faint/i,
    intro: "For dizziness, focus first on hydration, rest, and checking for warning signs before taking tablets.",
    causes: [
      "Common causes include dehydration, skipped meals, low blood pressure, anemia, inner ear problems, anxiety, or medication side effects.",
      "Urgent causes are possible if dizziness comes with chest pain, fainting, one-sided weakness, severe headache, or breathing trouble.",
    ],
    medications: [
      "Oral rehydration solution or fluids may help dizziness linked to dehydration.",
      "Eat a light snack if dizziness may be related to skipped meals or low sugar.",
      "Do not take anti-vertigo tablets unless a doctor or pharmacist confirms they are safe for you.",
    ],
    precautions: [
      "Sit or lie down until dizziness settles, and avoid driving or standing suddenly.",
      "Seek urgent care for chest pain, fainting, one-sided weakness, severe headache, confusion, or breathing trouble.",
      "Check blood pressure or blood sugar if you have hypertension or diabetes.",
    ],
    tabletTimings: [
      "ORS/fluids: take small frequent sips over 1–2 hours if dehydration is possible.",
      "Any dizziness tablet: use only as prescribed or advised by a licensed pharmacist.",
      "If dizziness repeats or worsens, get a clinician review instead of repeating medicines.",
    ],
  },
  {
    match: /fever|temperature/i,
    intro: "For fever, these options may reduce temperature while you monitor for serious symptoms.",
    causes: [
      "Common causes include viral infection, flu, throat infection, stomach infection, urinary infection, or heat illness.",
      "Persistent high fever, rash, stiff neck, confusion, breathing trouble, or dehydration can suggest a serious infection.",
    ],
    medications: [
      "Paracetamol/acetaminophen may reduce fever, following the package dose limits.",
      "Oral fluids or ORS help prevent dehydration during fever.",
      "Avoid antibiotics unless prescribed after a clinician review.",
    ],
    precautions: [
      "Seek urgent care for stiff neck, confusion, rash, breathing trouble, dehydration, or very high fever.",
      "Do not combine multiple fever medicines without medical advice.",
      "Use tepid sponging and light clothing; avoid ice baths.",
    ],
    tabletTimings: [
      "Paracetamol: usually every 6–8 hours only if needed; do not exceed the package daily limit.",
      "ORS/fluids: frequent small sips through the day.",
      "If fever lasts more than 2–3 days or worsens, book a clinician review.",
    ],
  },
  {
    match: /cough|cold|sore throat/i,
    intro: "For cough or cold symptoms, treatment depends on whether it is dry cough, phlegm, allergy, or infection.",
    causes: [
      "Common causes include viral cold, allergy, throat irritation, asthma, acid reflux, or chest infection.",
      "Cough with blood, chest pain, shortness of breath, wheezing, or high fever needs medical review quickly.",
    ],
    medications: [
      "Warm fluids, honey for adults, and saline gargles may ease throat irritation.",
      "A pharmacist can suggest a cough syrup based on dry cough or phlegm cough.",
      "Avoid antibiotics unless prescribed by a clinician.",
    ],
    precautions: [
      "Seek urgent care for shortness of breath, chest pain, wheezing, coughing blood, or high fever.",
      "Avoid sedating cough syrups before driving or work that needs alertness.",
      "Wear a mask and rest if fever or contagious symptoms are present.",
    ],
    tabletTimings: [
      "Cough syrup/tablets: follow the label timing exactly or pharmacist advice.",
      "Paracetamol for fever/body pain: usually every 6–8 hours only if needed within label limits.",
      "Do not take multiple cold medicines together if they contain the same ingredient.",
    ],
  },
  {
    match: /stomach|abdominal|diarrhea|loose motion/i,
    intro: "For stomach symptoms, hydration and food safety are usually more important than tablets at first.",
    causes: [
      "Common causes include indigestion, food poisoning, viral stomach infection, acidity, gas, constipation, or food intolerance.",
      "Severe pain, blood in stool, repeated vomiting, high fever, pregnancy, or dehydration can point to a more serious cause.",
    ],
    medications: [
      "ORS is preferred for loose motions or vomiting-related dehydration.",
      "Eat light foods and avoid oily, spicy, or heavy meals until symptoms settle.",
      "Do not self-start antibiotics or strong anti-diarrhea tablets without clinician advice.",
    ],
    precautions: [
      "Seek urgent care for severe belly pain, blood in stool, repeated vomiting, high fever, or dehydration.",
      "Avoid painkillers like ibuprofen/naproxen if you have stomach pain or acidity unless advised.",
      "Pregnancy, elderly age, or severe weakness needs earlier medical review.",
    ],
    tabletTimings: [
      "ORS: small frequent sips after each loose motion or vomiting episode.",
      "Antacid/anti-nausea tablets: only as advised by a pharmacist or clinician.",
      "If symptoms continue beyond 24–48 hours or worsen, get medical care.",
    ],
  },
];

const defaultTabletTimings = [
  "For common over-the-counter medicines, follow the label timing exactly or ask a licensed pharmacist.",
  "Take tablets after food when the label says so, and avoid repeating doses early.",
  "If symptoms are severe or worsening, do not delay care for medication timing.",
];

const defaultFollowUps = ["Fever", "Severe pain", "Weakness or fainting", "Trouble breathing", "Repeated vomiting", "Symptoms getting worse"];

type AgeBand = "infant" | "child" | "teen" | "adult" | "middle" | "senior";

const getAgeBand = (age: number): AgeBand => {
  if (age < 2) return "infant";
  if (age < 12) return "child";
  if (age < 18) return "teen";
  if (age < 40) return "adult";
  if (age < 60) return "middle";
  return "senior";
};

const ageBandLabel: Record<AgeBand, string> = {
  infant: "Infant (under 2)",
  child: "Child (2–11)",
  teen: "Teen (12–17)",
  adult: "Adult (18–39)",
  middle: "Middle age (40–59)",
  senior: "Senior (60+)",
};

const ageBandTips: Record<AgeBand, string[]> = {
  infant: [
    "Infants can become seriously ill quickly — fever, poor feeding, lethargy, or fewer wet diapers needs same-day medical review.",
    "Avoid giving aspirin or adult-strength painkillers; only use medicines dosed by weight on pediatric advice.",
    "Watch breathing rate, skin color, and alertness — these change faster than temperature in babies.",
  ],
  child: [
    "Children can dehydrate quickly — offer small frequent sips of water or ORS during fever, vomiting, or loose motions.",
    "Use weight-based pediatric dosing (e.g., paracetamol syrup) and never give aspirin during viral illness.",
    "Persistent fever over 3 days, rash, breathing trouble, or refusing fluids needs a clinician review.",
  ],
  teen: [
    "Teens often under-report symptoms — note duration, severity, and any school/sports impact for the clinician.",
    "Consider menstrual cycle, mental-health stressors, and sleep when interpreting fatigue, headache, or stomach pain.",
    "Avoid sharing prescription medicines; doses for teens may differ from adult formulations.",
  ],
  adult: [
    "Track symptom onset, triggers, and any medication taken — this helps the clinician narrow the cause faster.",
    "Lifestyle factors (sleep, hydration, stress, screen time) often amplify common symptoms; address these alongside treatment.",
    "Do not self-start antibiotics or steroids; most adult viral illnesses settle with supportive care.",
  ],
  middle: [
    "After 40, watch closely for cardiac and metabolic warning signs — chest discomfort, breathlessness, or sudden weakness needs urgent review.",
    "Check existing conditions (BP, sugar, cholesterol, thyroid) and current medications for interactions before adding new tablets.",
    "Persistent symptoms beyond a week, unintentional weight changes, or new lumps deserve a clinician visit, not home treatment.",
  ],
  senior: [
    "Older adults can have atypical presentations — confusion, falls, or appetite loss may be the first sign of infection or dehydration.",
    "Many medicines need dose adjustment for kidney/liver function; confirm with a clinician or pharmacist before starting anything new.",
    "Seek same-day care for fever, breathlessness, chest pain, sudden weakness, persistent vomiting, or any change in alertness.",
  ],
};

const symptomFollowUps = [
  {
    match: /headache|migraine/i,
    items: ["Fever or stiff neck", "Blurred vision", "Vomiting", "Weakness or numbness", "Head injury", "Worst headache suddenly"],
  },
  {
    match: /blood.*vomit|vomit.*blood|vomiting|vomtings|throwing up/i,
    items: ["Dizziness or fainting", "Black or tar-like stools", "Severe stomach pain", "Chest pain or trouble breathing", "Large amount of blood", "Repeated vomiting"],
  },
  {
    match: /dizziness|vertigo|faint/i,
    items: ["Chest pain", "Trouble breathing", "Severe headache", "One-sided weakness", "Palpitations", "Vomiting or dehydration"],
  },
  {
    match: /fever|temperature/i,
    items: ["Stiff neck", "Rash", "Breathing trouble", "Severe dehydration", "Confusion", "Fever above 103°F / 39.4°C"],
  },
  {
    match: /cough|cold|sore throat/i,
    items: ["Shortness of breath", "Chest pain", "High fever", "Wheezing", "Blood in cough", "Symptoms over 7 days"],
  },
  {
    match: /stomach|abdominal|diarrhea|loose motion/i,
    items: ["Severe belly pain", "Blood in stool", "Repeated vomiting", "Signs of dehydration", "High fever", "Pregnancy"],
  },
];

const Results = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { profile, user } = useAuth();
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "ready" | "denied" | "unsupported">("idle");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedFollowUps, setSelectedFollowUps] = useState<string[]>([]);
  const [showMedicationOptions, setShowMedicationOptions] = useState(false);
  const symptoms = searchParams.get("symptoms")?.trim() || "Your symptoms";
  const ageParam = searchParams.get("age");
  const ageNumber = ageParam ? Number.parseInt(ageParam, 10) : NaN;
  const hasAge = Number.isFinite(ageNumber) && ageNumber >= 0 && ageNumber <= 120;
  const ageBand = hasAge ? getAgeBand(ageNumber) : null;
  const ageTips = ageBand ? ageBandTips[ageBand] : [];
  const analysis = useMemo(() => analyzeSymptoms(symptoms), [symptoms]);
  const symptomList = symptoms
    .split(/,| and /i)
    .map((symptom) => symptom.trim())
    .filter(Boolean);
  const hasBloodVomiting = symptomList.some((symptom) => /blood|vomit|vomiting|vomtings|throwing up/i.test(symptom)) &&
    /blood/i.test(symptoms) &&
    /vomit|vomiting|vomtings|throwing up/i.test(symptoms);
  const medicationGuide = symptomMedicationGuides.find((group) => group.match.test(symptoms));
  const medications = medicationGuide?.medications ?? [
    `Medication suggestions for ${symptoms} should be confirmed by a licensed doctor or pharmacist before use.`,
    "Use simple supportive care like rest, fluids, and monitoring unless a clinician recommends a specific tablet.",
    "Avoid antibiotics, steroids, or strong painkillers without a prescription.",
  ];
  const possibleCauses = medicationGuide?.causes ?? [
    `Possible causes of ${symptoms} can vary from mild issues like dehydration, infection, strain, or digestion problems to conditions that need medical care.`,
    "A clinician can confirm the exact cause based on duration, severity, age, medical history, and examination.",
  ];
  const precautions = medicationGuide?.precautions ?? ["Seek urgent care if symptoms are severe, sudden, worsening, or affecting breathing, consciousness, movement, speech, or heavy bleeding."];
  const tabletTimings = medicationGuide?.tabletTimings ?? defaultTabletTimings;
  const medicationIntro = medicationGuide?.intro ?? `For ${symptoms}, medication choices depend on cause, age, allergies, and existing health conditions.`;
  const urgencyMessage = hasBloodVomiting
    ? "Vomiting blood can signal internal bleeding. Please seek emergency care now rather than trying home treatment."
    : "If symptoms are severe, sudden, worsening, or include chest pain, breathing trouble, fainting, confusion, or heavy bleeding, seek emergency care now.";
  const followUpSymptoms = symptomFollowUps.find((group) => group.match.test(symptoms))?.items ?? defaultFollowUps;
  const hospitalMapsUrl = useMemo(() => {
    if (!coordinates) return "https://www.google.com/maps/search/hospitals";

    return `https://www.google.com/maps/search/hospitals/@${coordinates.latitude},${coordinates.longitude},14z`;
  }, [coordinates]);

  const toggleFollowUp = (item: string) => {
    setSelectedFollowUps((current) => current.includes(item) ? current.filter((symptom) => symptom !== item) : [...current, item]);
  };

  useEffect(() => {
    setSelectedFollowUps([]);
    setShowMedicationOptions(false);
  }, [symptoms]);

  // Save to history once per symptom load
  useEffect(() => {
    if (!user || !symptoms || symptoms === "Your symptoms") return;
    supabase.from("symptom_searches").insert({
      user_id: user.id,
      symptoms,
      predicted_disease: analysis.predictedDisease,
      severity: analysis.severity,
    }).then(({ error }) => { if (error) console.error("history save failed", error); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, symptoms]);

  const handleDownloadReport = () => {
    generateMedicalReport({
      profile,
      symptoms,
      predictedDisease: analysis.predictedDisease,
      severity: analysis.severity,
      precautions,
      medications,
      disclaimer:
        "This app is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified doctor.",
    });
  };

  const requestNearbyHospitals = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCoordinates(nextCoordinates);
        setLocationStatus("ready");
        window.open(`https://www.google.com/maps/search/hospitals/@${nextCoordinates.latitude},${nextCoordinates.longitude},14z`, "_blank", "noreferrer");
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <motion.section
        className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 pt-16"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="ghost" className="rounded-pill">
              <Link to="/">
                <ArrowLeft className="size-4" />
                {t("results.newCheck")}
              </Link>
            </Button>
            <Button onClick={handleDownloadReport} className="rounded-pill" variant="default">
              <Download className="size-4" />
              {t("results.downloadReport")}
            </Button>
          </div>
          <div className="inline-flex items-center gap-2 rounded-pill border border-border bg-hero-shell px-4 py-2 text-sm font-medium text-hero-slate shadow-email">
            <ClipboardCheck className="size-4 text-hero-tint" />
            {t("results.firstPass")}
          </div>
          <h1 className="mt-5 max-w-[900px] font-geist text-[46px] font-medium leading-none tracking-[-0.04em] md:text-[76px]">
            {t("results.summaryFor")} <span className="font-instrument italic tracking-normal">{symptoms}</span>
          </h1>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-pill border border-border bg-hero-shell px-4 py-1.5 text-hero-slate">
              {t("results.predicted")}: <span className="font-medium text-foreground">{analysis.predictedDisease}</span>
            </span>
            <span className="rounded-pill border border-border bg-hero-shell px-4 py-1.5 text-hero-slate">
              {t("results.severity")}: <span className="font-medium text-accent">{analysis.severity}</span>
            </span>
            {hasAge && (
              <span className="rounded-pill border border-border bg-hero-shell px-4 py-1.5 text-hero-slate">
                {t("auth.age")}: <span className="font-medium text-foreground">{ageNumber}</span>
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <section className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email">
            <div className="mb-5 flex items-center gap-3 text-hero-slate">
              <Stethoscope className="size-5 text-hero-tint" />
              <h2 className="font-geist text-xl font-medium text-foreground">{t("results.reportedSymptoms")}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {symptomList.map((symptom) => (
                <span key={symptom} className="rounded-pill border border-border bg-background/70 px-4 py-2 text-sm text-hero-slate">
                  {symptom}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email">
            <div className="mb-4 flex items-center gap-3 text-hero-slate">
              <AlertTriangle className="size-5 text-accent" />
              <h2 className="font-geist text-xl font-medium text-foreground">{t("results.urgencyCheck")}</h2>
            </div>
            <p className="text-sm leading-6 text-hero-slate/80">
              {urgencyMessage}
            </p>
          </section>
        </motion.div>

        {hasAge && ageBand && (
          <motion.section
            className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 flex flex-wrap items-center gap-3 text-hero-slate">
              <Baby className="size-5 text-hero-tint" />
              <h2 className="font-geist text-xl font-medium text-foreground">{t("results.ageTips")}</h2>
              <span className="rounded-pill border border-border bg-background/70 px-3 py-1 text-xs text-hero-slate">
                {ageBandLabel[ageBand]}
              </span>
            </div>
            <ul className="grid gap-3 text-sm leading-6 text-hero-slate/80 md:grid-cols-3">
              {ageTips.map((tip) => (
                <li key={tip} className="rounded-[8px] border border-border bg-background/70 p-4">
                  {tip}
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        <motion.section
          className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 flex items-center gap-3 text-hero-slate">
            <ClipboardCheck className="size-5 text-hero-tint" />
            <h2 className="font-geist text-xl font-medium text-foreground">{t("results.followUp")}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {followUpSymptoms.map((item) => (
              <label
                key={item}
                className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[8px] border border-border bg-background/70 px-4 py-3 text-sm text-hero-slate transition-colors hover:bg-background"
              >
                <Checkbox checked={selectedFollowUps.includes(item)} onCheckedChange={() => toggleFollowUp(item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>
          {selectedFollowUps.length > 0 && (
            <p className="mt-4 text-sm leading-6 text-accent">
              These additional symptoms may need urgent attention. Please call 108 or go to the nearest emergency department if they are severe or worsening.
            </p>
          )}
          <Button className="mt-5 rounded-pill" onClick={() => setShowMedicationOptions(true)}>
            {t("results.submit")}
          </Button>
        </motion.section>

        {showMedicationOptions && (
          <motion.section
            className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-3 text-hero-slate">
                  <Pill className="size-5 text-hero-tint" />
                  <h2 className="font-geist text-xl font-medium text-foreground">{t("results.medications")}</h2>
                </div>
                <p className="mb-4 text-sm leading-6 text-hero-slate/80">
                  {medicationIntro}
                </p>
                <div className="mb-5 rounded-[8px] border border-border bg-background/70 p-4">
                  <h3 className="mb-3 font-geist text-base font-medium text-foreground">{t("results.causes")}</h3>
                  <ul className="grid gap-2 text-sm leading-6 text-hero-slate/80">
                    {possibleCauses.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <ul className="grid gap-3 text-sm leading-6 text-hero-slate/80">
                  {medications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {selectedFollowUps.length === 0 && (
                  <div className="mt-5 rounded-[8px] border border-border bg-background/70 p-4">
                    <h3 className="mb-3 font-geist text-base font-medium text-foreground">{t("results.tabletTimings")}</h3>
                    <ul className="grid gap-2 text-sm leading-6 text-hero-slate/80">
                      {tabletTimings.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3 text-hero-slate">
                  <ShieldPlus className="size-5 text-accent" />
                  <h2 className="font-geist text-xl font-medium text-foreground">{t("results.precautions")}</h2>
                </div>
                <ul className="grid gap-3 text-sm leading-6 text-hero-slate/80">
                  {precautions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section
          className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3 text-hero-slate">
                <MapPin className="size-5 text-hero-tint" />
                <h2 className="font-geist text-xl font-medium text-foreground">{t("results.hospitals")}</h2>
              </div>
              <p className="max-w-[720px] text-sm leading-6 text-hero-slate/80">
                Allow location access to open hospitals around your current position, not a generic map search.
              </p>
              {locationStatus === "denied" && (
                <p className="mt-2 max-w-[720px] text-sm leading-6 text-accent">
                  Location permission was blocked. Enable it in your browser settings or call emergency services now.
                </p>
              )}
              {locationStatus === "unsupported" && (
                <p className="mt-2 max-w-[720px] text-sm leading-6 text-accent">
                  This browser does not support location sharing. Call emergency services if this is urgent.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="rounded-pill" onClick={requestNearbyHospitals} disabled={locationStatus === "loading"}>
                <MapPin className="size-4" />
                {locationStatus === "loading" ? t("results.findingHospitals") : t("results.useLocation")}
              </Button>
              {locationStatus === "ready" && (
                <Button asChild variant="outline" className="rounded-pill">
                  <a href={hospitalMapsUrl} target="_blank" rel="noreferrer">
                    <MapPin className="size-4" />
                    {t("results.openMap")}
                  </a>
                </Button>
              )}
              <Button asChild variant={locationStatus === "ready" ? "ghost" : "outline"} className="rounded-pill">
                <a href="tel:108">
                  <Phone className="size-4" />
                  {t("results.callEmergency")}
                </a>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 text-sm leading-6 text-hero-slate/80 md:grid-cols-3">
            <p>
              {coordinates
                ? `Map search is centered at ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}.`
                : "Your exact location is only requested when you tap the location button."}
            </p>
            <p>Do not drive yourself if you feel faint, confused, weak, or are actively bleeding/vomiting.</p>
            <p>Bring your ID, medication list, allergies, and the symptom summary from this check.</p>
          </div>
        </motion.section>

        <motion.section
          className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mb-4 font-geist text-xl font-medium text-foreground">{t("results.nextSteps")}</h2>
          <ul className="grid gap-3 text-sm leading-6 text-hero-slate/80 md:grid-cols-3">
            <li>Track when symptoms started, intensity, triggers, and any medications taken.</li>
            <li>Book a licensed clinician review for diagnosis and personalized treatment.</li>
            <li>Avoid self-prescribing antibiotics, steroids, or controlled medication.</li>
          </ul>
        </motion.section>
      </motion.section>
    </main>
  );
};

export default Results;