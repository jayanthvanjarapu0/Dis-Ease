import { Link, useNavigate } from "react-router-dom";
import { Globe, History, LogOut, Moon, Stethoscope, Sun, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-instrument text-xl italic text-foreground">
          <Stethoscope className="size-5 text-accent" />
          Dis-Ease
        </Link>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-9 gap-1.5 px-2 text-xs font-medium"
            aria-label="Toggle language"
          >
            <Globe className="size-4" />
            {language === "en" ? "EN" : "हि"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Account menu">
                  <UserIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/history")} className="gap-2">
                  <History className="size-4" />
                  {t("nav.history")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2">
                  <LogOut className="size-4" />
                  {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/auth")} className="h-9 rounded-pill">
              {t("nav.signIn")}
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};