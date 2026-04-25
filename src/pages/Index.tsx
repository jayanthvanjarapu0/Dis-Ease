import { motion } from "motion/react";
import { Search, ShieldCheck, Star } from "lucide-react";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const videoUrl =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSymptomSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const symptoms = String(formData.get("symptoms") || "").trim();
    const age = String(formData.get("age") || "").trim();

    if (symptoms) {
      const params = new URLSearchParams({ symptoms });
      if (age) params.set("age", age);
      navigate(`/results?${params.toString()}`);
    }
  };

  return (
    <main className="relative flex min-h-screen justify-center overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-[560px] overflow-hidden" aria-hidden="true">
        <video
          className="w-full h-full object-cover [transform:scaleY(-1)]"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />
      </div>

      <motion.section
        className="relative z-10 flex w-full max-w-[1200px] flex-col items-center gap-8 px-6 pb-20 pt-[290px] text-center"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.14, delayChildren: 0.08 }}
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-pill border border-border bg-hero-shell/80 px-4 py-2 text-sm font-medium text-hero-slate shadow-email backdrop-blur-md">
            <ShieldCheck className="size-4 text-hero-tint" />
            {t("home.tagline")}
          </div>
          <h1 className="mx-auto max-w-[980px] font-geist text-[52px] font-medium leading-[0.95] tracking-[-0.04em] text-foreground md:text-[80px]">
            <span className="block font-serif">{t("home.title1")}</span>
            <span className="block">
              <span className="font-instrument text-[66px] italic leading-none tracking-normal md:text-[100px]">{t("home.title2")}</span> {t("home.title3")}
            </span>
          </h1>
        </motion.div>

        <motion.p
          className="max-w-[554px] font-geist text-[18px] leading-8 text-hero-slate/80"
          variants={fadeUp}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("home.subtitle")}
        </motion.p>

        <motion.div
          className="flex w-full max-w-[620px] flex-col items-center gap-4"
          variants={fadeUp}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <form onSubmit={handleSymptomSubmit} className="flex w-full flex-col items-center gap-3">
            <div className="flex w-full items-center rounded-pill border border-border bg-hero-shell p-2 shadow-email transition-transform duration-300 hover:-translate-y-1">
              <label className="sr-only" htmlFor="symptoms">
                Search symptoms
              </label>
              <input
                id="symptoms"
                type="search"
                name="symptoms"
                placeholder={t("home.searchPlaceholder")}
                className="min-h-12 flex-1 rounded-pill bg-transparent px-5 font-geist text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex w-full items-center gap-3 rounded-pill border border-border bg-hero-shell p-2 shadow-email">
              <label htmlFor="age" className="pl-4 font-geist text-[14px] font-medium text-hero-slate">
                {t("auth.age")}
              </label>
              <input
                id="age"
                type="number"
                name="age"
                min={0}
                max={120}
                placeholder={t("home.agePlaceholder")}
                className="min-h-12 flex-1 rounded-pill bg-transparent px-3 font-geist text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button type="submit" variant="gloss" size="hero" className="mt-2">
              <Search className="size-4" />
              {t("home.startCheck")}
            </Button>
          </form>

          <div className="flex items-center gap-3 rounded-pill border border-border bg-background/70 px-4 py-2 text-sm font-medium text-hero-slate backdrop-blur-md">
            <div className="flex -space-x-1 text-accent" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
            <span>{t("home.reviews")}</span>
          </div>

          <p className="max-w-[520px] text-xs leading-5 text-muted-foreground">
            {t("home.footer")}
          </p>
        </motion.div>
      </motion.section>
    </main>
  );
};

export default Index;
