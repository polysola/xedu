"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type Props = {
  label: string;
  iconSrc: string;
  href: string;
};
Button;
export const SideBarItem = ({ label, iconSrc, href }: Props) => {
  const pathName = usePathname();
  const active = pathName === href;
  return (
    <Button
      className="justify-start h-[52px]"
      asChild
      variant={active ? "sidebarOutline" : "sidebar"}
    >
      <Link href={href}>
        <Image
          src={iconSrc}
          height={32}
          width={32}
          alt={label}
          className="mr-5"
        />
        {label}
      </Link>
    </Button>
  );
};
