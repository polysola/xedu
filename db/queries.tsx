import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
  userSubscription,
} from "./schema";
import { eq } from "drizzle-orm";
// Truy vấn cơ sở dữ liệu:

// db.query.userProgress.findFirst: Thực hiện truy vấn để lấy bản ghi đầu tiên từ bảng userProgress.
// Điều kiện lọc (where):

// where: eq(userProgress.userId, userId): Điều kiện lọc để tìm bản ghi có userId khớp với giá trị userId của người dùng hiện tại. eq là hàm so sánh bằng (equals).
// Bao gồm thông tin liên quan (with):

// with: { activeCourse: true }: Chỉ định rằng kết quả truy vấn nên bao gồm thông tin từ bảng courses liên quan đến khóa ngoại activeCourseId. Điều này cho phép bạn truy xuất thông tin khóa học tương ứng với mỗi tiến trình học tập của người dùng.

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),

    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  });

  return data;
});

// Hàm getUnits xác thực người dùng, lấy tiến trình học tập, truy vấn cơ sở dữ liệu để lấy thông tin về các đơn vị học tập và bài học liên quan, sau đó tính toán trạng thái hoàn thành của từng bài học dựa trên tiến trình thử thách của người dùng. Kết quả được trả về là một danh sách các đơn vị học tập với thông tin trạng thái hoàn thành của các bài học.

export const getUnits = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  //   Truy vấn các đơn vị học tập (units) theo thứ tự (order).
  // Lọc theo courseId tương ứng với activeCourseId của người dùng.
  // Bao gồm các bài học (lessons) và các thử thách (challenges) liên quan, theo thứ tự (order).
  // Bao gồm tiến trình thử thách (challengeProgress) của người dùng hiện tại (userId).
  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  //   Duyệt qua từng đơn vị học tập (unit).
  // Duyệt qua từng bài học (lesson) trong đơn vị học tập.
  // Nếu bài học không có thử thách, đánh dấu là chưa hoàn thành (completed: false).
  // Nếu tất cả các thử thách đều hoàn thành, đánh dấu bài học là hoàn thành (completed: true).

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false };
      }

      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });

      return { ...lesson, completed: allCompletedChallenges };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

// Xác thực người dùng: Lấy userId thông qua hàm auth.
// Lấy tiến trình của người dùng: Lấy thông tin tiến trình học hiện tại của người dùng thông qua hàm getUserProgress.
// Kiểm tra điều kiện: Nếu không có userId hoặc activeCourseId trong tiến trình học của người dùng, trả về null.
// Truy vấn cơ sở dữ liệu: Lấy danh sách các đơn vị học (units) và các bài học (lessons) trong khóa học hiện tại mà người dùng đang học, sắp xếp theo thứ tự.
// Tìm bài học chưa hoàn thành: Duyệt qua các bài học để tìm bài học đầu tiên mà người dùng chưa hoàn thành (dựa trên tiến trình các thử thách trong bài học đó).
// Trả về kết quả: Trả về bài học chưa hoàn thành đầu tiên (firstUncompletedLesson) và ID của bài học đó (firstUncompletedLesson?.id).

export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some(
            (progress) => progress.completed === false
          )
        );
      });
    });

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

// Hàm getLesson có chức năng lấy thông tin chi tiết về một bài học cụ thể bao gồm các thử thách và tiến trình của người dùng trong các thử thách đó. Nó sử dụng cơ chế cache để lưu trữ kết quả, giúp tối ưu hóa hiệu suất. Nếu không có userId hoặc lessonId, hoặc không có dữ liệu bài học, hàm sẽ trả về null.

export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) {
    return null;
  }

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) {
    return null;
  }

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

// Hàm getLessonPercentage có chức năng tính toán và trả về phần trăm hoàn thành của các thử thách trong bài học hiện tại của người dùng. Nó sử dụng cơ chế cache để lưu trữ kết quả, giúp tối ưu hóa hiệu suất. Nếu không có bài học hiện tại hoặc thông tin về bài học, hàm sẽ trả về 0. Nếu có, hàm sẽ tính toán phần trăm hoàn thành dựa trên số lượng thử thách đã hoàn thành so với tổng số thử thách trong bài học.

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    return 0;
  }

  const completedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed
  );
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  );

  return percentage;
});

const DAY_IN_MS = 86_400_000;
export const getUserSubscription = cache(async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!data) return null;

  const isActive =
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return {
    ...data,
    isActive: !!isActive,
  };
});

export const getTopTenUsers = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
    },
  });

  return data;
});
