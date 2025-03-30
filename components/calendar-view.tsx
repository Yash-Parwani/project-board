"use client"

import { useState } from "react"
import { addDays, format, isSameDay, startOfMonth, startOfWeek } from "date-fns"
import { motion } from "framer-motion"
import { CalendarIcon, ChevronLeft, ChevronRight, Filter } from "lucide-react"

import { type Priority, type Task, tasks } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TaskDetail } from "@/components/task-detail"
import { TaskForm } from "@/components/task-form"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  // Filter tasks based on priority
  const filteredTasks = tasks.filter(
    (task) => (priorityFilter === "all" || task.priority === priorityFilter) && task.dueDate,
  )

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return filteredTasks.filter((task) => {
      if (!task.dueDate) return false
      return isSameDay(new Date(task.dueDate), date)
    })
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    const monthStart = startOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)

    for (let i = 0; i < 35; i++) {
      const day = addDays(startDate, i)
      days.push(day)
    }

    return days
  }

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  // Get day name
  const getDayName = (date: Date) => {
    return format(date, "EEE")
  }

  // Get priority color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-green-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "high":
        return "bg-orange-500 text-white"
      case "critical":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="container flex h-screen  w-[75vw] flex-col">
      <div className="flex flex-col px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage your tasks in a calendar view</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>
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
          <Button onClick={() => setIsTaskFormOpen(true)}>Add Task</Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-2">
        <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(newDate.getMonth() - 1)
              setCurrentDate(newDate)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setMonth(newDate.getMonth() + 1)
              setCurrentDate(newDate)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-7 gap-2 p-4 h-full overflow-auto">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {generateCalendarDays().map((day, index) => {
          const tasksForDay = getTasksForDate(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isToday = isSameDay(day, new Date())

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className={cn(
                "h-full rounded-md border p-2 overflow-auto",
                isCurrentMonth ? "bg-card" : "bg-muted/50",
                isToday && "ring-2 ring-primary",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-sm",
                    isToday && "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
                <span className="text-xs text-muted-foreground">{getDayName(day)}</span>
              </div>

              <div className="mt-2 space-y-1">
                {tasksForDay.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={cn("calendar-event cursor-pointer truncate", getPriorityColor(task.priority))}
                    onClick={() => handleTaskClick(task)}
                  >
                    {task.title}
                  </div>
                ))}

                {tasksForDay.length > 3 && (
                  <div className="text-center text-xs text-muted-foreground">+{tasksForDay.length - 3} more</div>
                )}
              </div>
            </motion.div>
          )
        })}
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

