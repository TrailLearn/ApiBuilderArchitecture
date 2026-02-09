import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const { t } = useTranslation("sidebar");
  const [open, setOpen] = useState(false);
  const closeSheet = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost">{t("menu")}</Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>{t(`title`)}</SheetTitle>
          <SheetDescription>{t(`desc`)}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col space-y-2 mt-4">
          <Button variant="ghost" className="justify-start" onClick={closeSheet} asChild>
            <Link to="/">{t("home")}</Link>
          </Button>
          {/* Les futurs liens (Mes Bourses, Admin, etc.) seront ajoutés ici */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;