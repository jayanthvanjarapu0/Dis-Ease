import { motion } from "motion/react";
import { AlertTriangle, ArrowLeft, ClipboardCheck, Pill, ShieldPlus, Stethoscope } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

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

const Results = () => {
  const [searchParams] = useSearchParams();
  const symptoms = searchParams.get("symptoms")?.trim() || "Your symptoms";
  const symptomList = symptoms
    .split(/,| and /i)
    .map((symptom) => symptom.trim())
    .filter(Boolean);
  const hasHeadache = symptomList.some((symptom) => symptom.toLowerCase().includes("headache"));
  const hasBloodVomiting = symptomList.some((symptom) => /blood|vomit|vomiting|vomtings|throwing up/i.test(symptom)) &&
    /blood/i.test(symptoms) &&
    /vomit|vomiting|vomtings|throwing up/i.test(symptoms);
  const medications = hasHeadache
    ? headacheMedications
    : hasBloodVomiting
      ? bloodVomitingMedications
    : ["Medication suggestions appear here for supported symptoms. For now, use a licensed clinician or pharmacist for treatment choices."];
  const precautions = hasHeadache
    ? headachePrecautions
    : hasBloodVomiting
      ? bloodVomitingPrecautions
    : ["Seek urgent care if symptoms are severe, sudden, worsening, or affecting breathing, consciousness, movement, speech, or heavy bleeding."];
  const urgencyMessage = hasBloodVomiting
    ? "Vomiting blood can signal internal bleeding. Please seek emergency care now rather than trying home treatment."
    : "If symptoms are severe, sudden, worsening, or include chest pain, breathing trouble, fainting, confusion, or heavy bleeding, seek emergency care now.";

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <motion.section
        className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 pt-16"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <Button asChild variant="ghost" className="mb-8 rounded-pill">
            <Link to="/">
              <ArrowLeft className="size-4" />
              New check
            </Link>
          </Button>
          <div className="inline-flex items-center gap-2 rounded-pill border border-border bg-hero-shell px-4 py-2 text-sm font-medium text-hero-slate shadow-email">
            <ClipboardCheck className="size-4 text-hero-tint" />
            First-pass symptom checkout
          </div>
          <h1 className="mt-5 max-w-[900px] font-geist text-[46px] font-medium leading-none tracking-[-0.04em] md:text-[76px]">
            Summary for <span className="font-instrument italic tracking-normal">{symptoms}</span>
          </h1>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <section className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email">
            <div className="mb-5 flex items-center gap-3 text-hero-slate">
              <Stethoscope className="size-5 text-hero-tint" />
              <h2 className="font-geist text-xl font-medium text-foreground">Reported symptoms</h2>
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
              <h2 className="font-geist text-xl font-medium text-foreground">Urgency check</h2>
            </div>
            <p className="text-sm leading-6 text-hero-slate/80">
              {urgencyMessage}
            </p>
          </section>
        </motion.div>

        <motion.section
          className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3 text-hero-slate">
                <Pill className="size-5 text-hero-tint" />
                <h2 className="font-geist text-xl font-medium text-foreground">Medication options</h2>
              </div>
              <ul className="grid gap-3 text-sm leading-6 text-hero-slate/80">
                {medications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3 text-hero-slate">
                <ShieldPlus className="size-5 text-accent" />
                <h2 className="font-geist text-xl font-medium text-foreground">Precautions</h2>
              </div>
              <ul className="grid gap-3 text-sm leading-6 text-hero-slate/80">
                {precautions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="rounded-[8px] border border-border bg-hero-shell p-6 shadow-email"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mb-4 font-geist text-xl font-medium text-foreground">Suggested next steps</h2>
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