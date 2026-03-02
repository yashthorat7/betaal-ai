import ProgressRing from "@/components/dashboard/ProgressRing";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import AppBreakdown from "@/components/dashboard/AppBreakdown";
import RehabProgress from "@/components/dashboard/RehabProgress";
import DeviceList from "@/components/dashboard/DeviceList";
import HeatMap from "@/components/dashboard/HeatMap";
import { getUser } from "@/lib/dummy-data";

export const metadata = {
  title: "Dashboard — Betaal AI",
  description: "Monitor screen time and track progress in real-time.",
};

export default function DashboardPage() {
  const user = getUser();
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container-pro py-12 mb-20">
      <header className="flex flex-col md:flex-row justify-between items-end pb-12 border-b border-border gap-8 mb-16">
        <div>
           <h1 className="heading-lg italic">Welcome back, {user.name} 👋</h1>
           <span className="label-pro mt-4 inline-block font-black italic">{dateStr}</span>
        </div>
        <div className="flex gap-4">
           {['Settings', 'Sync Profile'].map(t => <button key={t} className={`btn-pro ${t==='Settings'?'btn-outline':'btn-solid'} py-2`}>{t}</button>)}
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <ProgressRing />
        <div className="lg:col-span-2"><WeeklyChart /></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <AppBreakdown />
        <DeviceList />
        <HeatMap />
      </div>

      <RehabProgress />
    </div>
  );
}
