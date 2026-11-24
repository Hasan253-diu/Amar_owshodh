import { DashboardView } from "@/components/DashboardView";
import {
  generateDueRemindersAction,
  getTodayIntakeLogsAction,
  getDashboardStatsAction,
} from "@/app/actions/intake";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await generateDueRemindersAction();

  const [statsRes, logsRes] = await Promise.all([
    getDashboardStatsAction(),
    getTodayIntakeLogsAction(),
  ]);

  const stats = statsRes.data || {
    totalActiveMedicines: 0,
    todayRemindersCount: 0,
    takenCount: 0,
    skippedCount: 0,
    pendingCount: 0,
    intakePercentage: 0,
  };

  const todayLogs = logsRes.data || [];

  return <DashboardView stats={stats} todayLogs={todayLogs} />;
}
