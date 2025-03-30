"use client"

import { useState } from "react"
import { addDays, format, isSameDay } from "date-fns"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react"

import { type Priority, type Task, tasks } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskDetail } from "@/components/task-detail"
import { TaskForm } from "@/components/task-form"

export function GanttView() {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  // Number of days to display
  const daysToShow = 14

  // Generate dates for the Gantt chart
  const generateDates = () => {
    const dates = []
    for (let i = 0; i < daysToShow; i++) {
      dates.push(addDays(startDate, i))
    }
    return dates
  }

  // Filter tasks based on priority and due date
  const filteredTasks = tasks.filter(
    (task) => (priorityFilter === "all" || task.priority === priorityFilter) && task.dueDate,
  )

  // Sort tasks by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  // Get task position and width in the Gantt chart
  const getTaskPosition = (task: Task) => {
    if (!task.dueDate) return { left: 0, width: 0 }

    const dates = generateDates()
    const dueDate = new Date(task.dueDate)

    // Find the index of the due date in the dates array
    const dueDateIndex = dates.findIndex((date) => isSameDay(date, dueDate))

    if (dueDateIndex === -1) {
      // Task due date is not in the visible range
      return { left: 0, width: 0 }
    }

    // Calculate the width based on estimated hours
    // 1 day = 100% width, so we'll use a fraction of that
    const width = task.estimatedHours ? Math.min(task.estimatedHours / 8, 3) * 100 : 100

    return {
      left: `${dueDateIndex * 100}%`,
      width: `${width}%`,
    }
  }

  // Get priority color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex h-full w-[75vw] flex-col space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gantt Chart</h1>
          <p className="text-muted-foreground">Visualize tasks over time with dependencies</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setStartDate(addDays(startDate, -daysToShow))
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setStartDate(addDays(startDate, daysToShow))
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
                  <span className={cn(priorityFilter === "all" && "font-medium")}>All</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
                  <span className={cn("flex items-center gap-2", priorityFilter === "low" && "font-medium")}>
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Low
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
                  <span className={cn("flex items-center gap-2", priorityFilter === "medium" && "font-medium")}>
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    Medium
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
                  <span className={cn("flex items-center gap-2", priorityFilter === "high" && "font-medium")}>
                    <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                    High
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("critical")}>
                  <span className={cn("flex items-center gap-2", priorityFilter === "critical" && "font-medium")}>
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Critical
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setIsTaskFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      <div className="rounded-md border w-full">
        {/* Header */}
        <div className="grid grid-cols-[200px_1fr] border-b w-full">
          <div className="border-r p-2 font-medium">Task</div>
          <div className="grid grid-cols-14 border-b w-full">
            {generateDates().map((date, index) => (
              <div
                key={index}
                className={cn("p-2 text-center text-xs font-medium", isSameDay(date, new Date()) && "bg-primary/10")}
              >
                <div>{format(date, "EEE")}</div>
                <div>{format(date, "MMM d")}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="max-h-[calc(100vh-300px)] overflow-auto">
          {sortedTasks.map((task) => {
            const { left, width } = getTaskPosition(task)

            // Skip tasks that are not in the visible range
            if (width === 0) return null

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-[200px_1fr] border-b hover:bg-muted/50"
              >
                <div className="border-r p-2">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {task.status === "todo" && "To Do"}
                    {task.status === "in-progress" && "In Progress"}
                    {task.status === "review" && "Review"}
                    {task.status === "completed" && "Completed"}
                  </div>
                </div>
                <div className="relative p-2">
                  <div
                    className={cn("gantt-bar absolute cursor-pointer", getPriorityColor(task.priority))}
                    style={{
                      left,
                      width,
                    }}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="px-2 text-xs text-white">{task.title}</div>
                  </div>

                  {/* Draw dependencies */}
                  {task.dependsOn.map((depId) => {
                    const depTask = tasks.find((t) => t.id === depId)
                    if (!depTask || !depTask.dueDate) return null

                    const depPosition = getTaskPosition(depTask)
                    if (depPosition.width === 0) return null

                    return (
                      <div
                        key={`${task.id}-${depId}`}
                        className="gantt-dependency absolute border-l-2 border-t-2"
                        style={{
                          left: depPosition.left,
                          width: `calc(${left} - ${depPosition.left})`,
                          height: "20px",
                          top: "-10px",
                        }}
                      />
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail task={selectedTask} isOpen={isTaskDetailOpen} onClose={() => setIsTaskDetailOpen(false)} />
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={(newTask) => {
          // Add new task logic would go here
          setIsTaskFormOpen(false)
        }}
      />
    </div>
  )
}

