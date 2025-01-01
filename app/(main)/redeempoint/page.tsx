// app/redeem/page.tsx
import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { ExchangeBox } from "@/components/exchange-box";
import { Sparkles } from "lucide-react";

const RedeemPoint = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <div className="relative">
            <Image 
              src="/points.svg" 
              alt="Exchange" 
              height={120} 
              width={120}
              className="animate-bounce-slow"
            />
            <Sparkles 
              className="absolute -top-2 -right-2 text-yellow-500 animate-pulse" 
              size={24}
            />
          </div>
          <h1 className="text-center font-bold text-neutral-800 text-3xl my-6 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Points Exchange Center
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-8 max-w-md">
            Transform your learning achievements into valuable coins. Every point counts!
          </p>
          <ExchangeBox points={userProgress.points} />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default RedeemPoint;