import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, History as HistoryIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchRow {
  id: string;
  symptoms: string;
  predicted_disease: string | null;
  severity: string | null;
  created_at: string;
}

const severityColor = (sev?: string | null) => {
  const s = (sev || "").toLowerCase();
  if (s === "emergency") return "bg-destructive text-destructive-foreground";
  if (s === "high") return "bg-orange-500 text-white";
  if (s === "moderate") return "bg-amber-500 text-white";
  return "bg-accent text-accent-foreground";
};

const History = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [rows, setRows] = useState<SearchRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("symptom_searches")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as SearchRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("symptom_searches").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setRows((cur) => cur.filter((r) => r.id !== id));
    toast.success("Deleted");
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <motion.section
        className="mx-auto flex w-full max-w-[900px] flex-col gap-6 pt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button asChild variant="ghost" className="self-start rounded-pill">
          <Link to="/"><ArrowLeft className="size-4" />{t("results.newCheck")}</Link>
        </Button>

        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-pill border border-border bg-hero-shell px-4 py-2 text-sm font-medium text-hero-slate shadow-email">
            <HistoryIcon className="size-4 text-accent" />
            {t("history.title")}
          </div>
          <h1 className="mt-3 font-geist text-4xl font-medium tracking-[-0.03em] md:text-5xl">{t("history.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("history.subtitle")}</p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : rows.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-border bg-hero-shell p-10 text-center text-sm text-muted-foreground">
            {t("history.empty")}
          </div>
        ) : (
          <ul className="grid gap-3">
            {rows.map((row) => (
              <li key={row.id} className="rounded-[8px] border border-border bg-hero-shell p-5 shadow-email">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(row.created_at).toLocaleString(language === "hi" ? "hi-IN" : "en-US")}
                      </span>
                      {row.severity && (
                        <Badge className={severityColor(row.severity)}>{row.severity}</Badge>
                      )}
                    </div>
                    <p className="mt-2 font-geist text-base text-foreground">{row.predicted_disease || "—"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t("history.symptoms")}: {row.symptoms}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-pill">
                      <Link to={`/results?symptoms=${encodeURIComponent(row.symptoms)}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(row.id)} aria-label={t("history.delete")}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>
    </main>
  );
};

export default History;