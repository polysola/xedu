import MobileHeader from "@/components/mobile-header";
import { SiderBar } from "@/components/sidebar";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <MobileHeader />
      <SiderBar className="hidden lg:flex" />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className=" mx-auto pt-6 h-full max-w-[1056px]">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
