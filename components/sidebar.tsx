import { cn } from "@/lib/utils";

import Image from "next/image";

import Link from "next/link";
import { SideBarItem } from "./sidebar-item";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";

type Props = {
  className?: string;
};
export const SiderBar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        " flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/logo.png" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
          XRP Edu
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SideBarItem label="Learn" href="/learn" iconSrc="/learn.svg" />
        <SideBarItem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SideBarItem label="quests" href="/quests" iconSrc="/quests.svg" />
        <SideBarItem label="shop" href="/shop" iconSrc="/shop.svg" />
        <SideBarItem
          label="redeempoint"
          href="/redeempoint"
          iconSrc="/re.png"
        />
      </div>
      <div className="p-4 flex items-center flex-col">
   <div className="flex gap-x-2 mb-3 ">  
          <Link href="https://t.me/XRPEdu_Portal"> <Image
            src="/tg.png"
            alt="tg"
            height={36}
            width={36}
          /></Link>
          <Link href="https://x.com/XRP_Edu">
          <Image
            src="/x.png"
            alt="tg"
            height={36}
            width={36}
          />
          </Link>
          </div>
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton showName />
        </ClerkLoaded>
      </div>
    </div>
  );
};
