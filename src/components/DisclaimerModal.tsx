import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

export const DisclaimerModal = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && profile && !profile.disclaimer_accepted) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [user, profile]);

  const handleAccept = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ disclaimer_accepted: true }).eq("id", user.id);
    await refreshProfile();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => { /* must accept */ }}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <ShieldAlert className="size-5 text-accent" />
            <DialogTitle className="font-geist">{t("disclaimer.title")}</DialogTitle>
          </div>
          <DialogDescription className="text-sm leading-6">{t("disclaimer.body")}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-2">
          <Button onClick={handleAccept} className="rounded-pill">{t("disclaimer.accept")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};