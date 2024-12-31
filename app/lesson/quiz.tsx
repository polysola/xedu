"use client";

import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";

import Confetti from "react-confetti";
import { Footer } from "./footer";
import {
  reduceHearts,
  upsertChallengeProgress,
} from "@/actions/challenge-progress";
import { toast } from "sonner";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  //   Mỗi đối tượng trong mảng này có kiểu là kết hợp (&) giữa kiểu dữ liệu được suy ra từ challenges.$inferSelect và một đối tượng khác có hai thuộc tính:
  // completed: boolean: Xác định liệu thử thách đã được hoàn thành hay chưa.
  // challengeOptions: (typeof challengeOptions.$inferSelect)[]: Một mảng các tùy chọn của thử thách, với kiểu dữ liệu được suy ra từ challengeOptions.$inferSelect.
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
};
const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  // để chạy một hàm khi component được mount lần đầu tiên, tương tự như việc sử dụng useEffect với mảng phụ thuộc rỗng [].
  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });
  const { width, height } = useWindowSize();
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [pending, startTransition] = useTransition();
  const [hearts, setHearts] = useState(initialHearts);
  const [lessonId] = useState(initialLessonId);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges, setChallenges] = useState(initialLessonChallenges);

  const router = useRouter();
  // Đoạn code này khởi tạo state activeIndex để lưu trữ chỉ mục của thử thách chưa hoàn thành đầu tiên trong danh sách challenges. Nếu tất cả các thử thách đã hoàn thành, activeIndex sẽ được đặt là 0. Điều này giúp xác định thử thách hiện tại cần hiển thị hoặc xử lý trong ứng dụng của bạn.
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const [selectedOption, setSelectedOption] = useState<number | undefined>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
  //Viết hàm khi nhận id của thằng con truyền ra
  const onSelect = (id: number) => {
    if (status !== "none") {
      return;
    }
    setSelectedOption(id);
  };

  const onNext = () => {
    setActiveIndex((prevIndex) => prevIndex + 1);
  };

  const onContinue = () => {
    if (!selectedOption) {
      return;
    }
    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    //Tìm đáp án đúng trong mảng options option.correct = true
    const correctOption = options.find((option) => option.correct);

    if (!correctOption) {
      return;
    }
    if (correctOption && selectedOption === correctOption.id) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              console.error("Not enough hearts");
              return;
            }

            correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // This is a practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              console.error("Not enough hearts");
              openHeartsModal();
              return;
            }

            incorrectControls.play();
            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };
  const challenge = challenges[activeIndex];
  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={50}
            width={50}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }
  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  const options = challenge?.challengeOptions ?? [];
  console.log({ options });
  console.log({ selectedOption });

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />

      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                //ông truyền cho cha 1 hàm onSelect
                onSelect={onSelect}
                status={status}
                //sau khi lấy được id từ thằng con truyền ra thì sẽ gửi lại cho thằng con để xử lý
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};

export default Quiz;
