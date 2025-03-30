import { DashboardLayout } from "@/components/dashboard-layout"
import { ProjectBoard } from "@/components/project-board"

export default function Home() {
  return (
    <DashboardLayout>
      <ProjectBoard />
    </DashboardLayout>
  )
}

