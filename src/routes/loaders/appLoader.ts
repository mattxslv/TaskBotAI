/**
 * @copyright 2025 mattxslv
 * @license Apache-2.0
 * @description Loader function for the app
 */

import { databases, Query } from "@/lib/appwrite";
import { startOfToday, startOfTomorrow } from "date-fns";
import { redirect } from "react-router";
import { getUserId } from "@/lib/utils";

const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

import type { LoaderFunction } from "react-router";
import type { Models } from "appwrite";

type TaskCounts = {
  inboxTasks: number;
  todayTasks: number;
  upcomingTasks: number;
  completedTasks: number;
};

export type AppLoaderData = {
  projects: Models.DocumentList<Models.Document>;
  taskCounts: TaskCounts;
};

const getProjects = async (userId: string) => {
  return await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    "6837f2a1001ee5f32120",
    [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(100)
    ]
  );
};

const getTaskCounts = async (userId: string): Promise<TaskCounts> => {
  let inboxTasks = 0;
  let todayTasks = 0;
  let upcomingTasks = 0;
  let completedTasks = 0;

  // Inbox: tasks with no project, not completed
  const { total: totalInboxTasks } = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    "6837f2da00305897d8ea",
    [
      Query.isNull("project"),
      Query.equal("completed", "false"),
      Query.equal("userId", userId),
      Query.limit(1)
    ]
  );
  inboxTasks = totalInboxTasks;

  // Today: due today, not completed
  const { total: totalTodayTasks } = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    "6837f2da00305897d8ea",
    [
      Query.and([
        Query.greaterThanEqual("due_date", startOfToday().toISOString()),
        Query.lessThan("due_date", startOfTomorrow().toISOString())
      ]),
      Query.equal("completed", "false"),
      Query.equal("userId", userId),
      Query.limit(1)
    ]
  );
  todayTasks = totalTodayTasks;

  // Upcoming: due after today, not completed
  const { total: totalUpcomingTasks } = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    "6837f2da00305897d8ea",
    [
      Query.greaterThan("due_date", startOfTomorrow().toISOString()),
      Query.equal("completed", "false"),
      Query.equal("userId", userId),
      Query.limit(1)
    ]
  );
  upcomingTasks = totalUpcomingTasks;

  // Completed: completed === "true"
  const { total: totalCompletedTasks } = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    "6837f2da00305897d8ea",
    [
      Query.equal("completed", "true"),
      Query.equal("userId", userId),
      Query.limit(1)
    ]
  );
  completedTasks = totalCompletedTasks;

  return { inboxTasks, todayTasks, upcomingTasks, completedTasks };
};

const appLoader: LoaderFunction = async () => {
  try {
    const userId = getUserId();

    if (!userId) {
      return redirect("/login");
    }

    const projects = await getProjects(userId);
    const taskCounts = await getTaskCounts(userId);

    return { projects, taskCounts };
  } catch (error) {
    console.error("Loader error:", error);

    // Use Response to leverage React Router's data API errorElement
    throw new Response("Error loading app data", {
      status: 500,
      statusText: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export default appLoader;
