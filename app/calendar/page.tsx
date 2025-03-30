import { DashboardLayout } from "@/components/dashboard-layout"
import { CalendarView } from "@/components/calendar-view"

export default function CalendarPage() {
  return (
    <DashboardLayout>
      <div className="w-auto">
        <CalendarView />
      </div>
    </DashboardLayout>
  )
}

