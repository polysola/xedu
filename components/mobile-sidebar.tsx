import { Menu } from "lucide-react";
import { SiderBar } from "./sidebar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export const MobileSideBar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent className="p-0 z-[100]" side='left'>
        <SiderBar />
      </SheetContent>
    </Sheet>
  );
};
