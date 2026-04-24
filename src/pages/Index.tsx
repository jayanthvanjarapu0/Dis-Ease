import { motion } from "motion/react";
import { ShieldCheck, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const videoUrl =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
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
            AI-supported health guidance
          </div>
          <h1 className="mx-auto max-w-[980px] font-geist text-[52px] font-medium leading-[0.95] tracking-[-0.04em] text-foreground md:text-[80px]">
            Simple <span className="font-instrument text-[66px] italic leading-none tracking-normal md:text-[100px]">care guidance</span> for your symptoms
          </h1>
        </motion.div>

        <motion.p
          className="max-w-[554px] font-geist text-[18px] leading-8 text-hero-slate/80"
          variants={fadeUp}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          Explore possible conditions, understand urgency, and prepare safer next steps before speaking with a licensed clinician.
        </motion.p>

        <motion.div
          className="flex w-full max-w-[620px] flex-col items-center gap-4"
          variants={fadeUp}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <form className="flex w-full flex-col gap-3 rounded-pill border border-border bg-hero-shell p-2 shadow-email transition-transform duration-300 hover:-translate-y-1 sm:flex-row">
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="min-h-12 flex-1 rounded-pill bg-transparent px-5 font-geist text-[15px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="button" variant="gloss" size="hero">
              <Sparkles className="size-4" />
              Create Free Account
            </Button>
          </form>

          <div className="flex items-center gap-3 rounded-pill border border-border bg-background/70 px-4 py-2 text-sm font-medium text-hero-slate backdrop-blur-md">
            <div className="flex -space-x-1 text-accent" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
            <span>1,020+ Reviews</span>
          </div>

          <p className="max-w-[520px] text-xs leading-5 text-muted-foreground">
            Not a replacement for professional medical advice, diagnosis, treatment, or emergency care.
          </p>
        </motion.div>
      </motion.section>
    </main>
  );
};

export default Index;
