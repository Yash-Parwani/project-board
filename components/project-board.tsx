"use client"

import type React from "react"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Filter, ListFilter, Plus, Search, SlidersHorizontal } from "lucide-react"

import { type Board, type Priority, type Status, type Task, initialBoard, tasks } from "@/lib/data"
import { cn, formatDate } from "@/lib/utils"
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
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "@/components/task-card"
import { TaskDetail } from "@/components/task-detail"
import { TaskForm } from "@/components/task-form"

export function ProjectBoard() {
  const [board, setBoard] = useState<Board>(initialBoard)
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null)

  // Filter tasks based on search query and priority filter
  const getFilteredTasks = (columnId: Status) => {
    return (
      board.columns
        .find((col) => col.id === columnId)
        ?.taskIds.map((taskId) => tasks.find((task) => task.id === taskId))
        .filter((task) => {
          if (!task) return false

          const matchesSearch =
            searchQuery === "" ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())

          const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

          return matchesSearch && matchesPriority
        }) || []
    )
  }

  // Handle task click to open task detail
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  // Handle drag start
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, columnId: Status) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, columnId: Status) => {
    e.preventDefault()

    if (!draggedTask) return

    // Find the task
    const task = tasks.find((t) => t.id === draggedTask)
    if (!task) return

    // Update task status
    task.status = columnId

    // Update board state
    const newBoard = { ...board }

    // Remove task from its current column
    newBoard.columns = newBoard.columns.map((col) => ({
      ...col,
      taskIds: col.taskIds.filter((id) => id !== draggedTask),
    }))

    // Add task to the new column
    newBoard.columns = newBoard.columns.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          taskIds: [...col.taskIds, draggedTask],
        }
      }
      return col
    })

    setBoard(newBoard)
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    // Remove task from tasks array
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1)
    }

    // Remove task from board
    const updatedBoard = { ...board }
    updatedBoard.columns = updatedBoard.columns.map(col => ({
      ...col,
      taskIds: col.taskIds.filter(id => id !== taskId)
    }))
    setBoard(updatedBoard)

    // Close task detail modal and clear selected task
    setSelectedTask(null)
    setIsTaskDetailOpen(false)
  }

  return (
    <div className="flex h-full flex-col my-2">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Board</h1>
          <p className="text-muted-foreground">Manage your tasks and track progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="w-full pl-8 md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
          <Button variant="outline" size="icon" onClick={() => setFocusMode(!focusMode)}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsTaskFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="board" className="flex-1 flex flex-col h-full">
        <TabsList className="w-full justify-start border-b">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 p-6">
            {board.columns.map((column) => (
              <div
                key={column.id}
                className={cn(
                  "flex flex-col rounded-lg border bg-card",
                  dragOverColumn === column.id && "ring-2 ring-primary",
                )}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={cn("p-3 text-card-foreground", `column-${column.id}`)}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{column.title}</h3>
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                      {getFilteredTasks(column.id).length}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 p-3">
                  <AnimatePresence>
                    {getFilteredTasks(column.id).map(
                      (task) =>
                        task && (
                          <motion.div
                            key={task.id}
                            layoutId={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className={cn("cursor-pointer", draggedTask === task.id && "opacity-50")}
                            draggable
                            onDragStart={() => handleDragStart(task.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleTaskClick(task)}
                          >
                            <TaskCard task={task} focusMode={focusMode} />
                          </motion.div>
                        ),
                    )}
                  </AnimatePresence>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-center rounded-md border border-dashed p-2 text-muted-foreground"
                    onClick={() => setIsTaskFormOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="flex-1 overflow-auto">
          <div className="w-full rounded-md border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-4">Task</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-3">Due Date</div>
              <div className="col-span-1">Actions</div>
            </div>
            <div className="divide-y">
              {tasks
                .filter((task) => {
                  const matchesSearch =
                    searchQuery === "" ||
                    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchQuery.toLowerCase())

                  const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

                  return matchesSearch && matchesPriority
                })
                .map((task) => (
                  <div
                    key={task.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="col-span-4 flex items-center">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">{task.description}</div>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          task.status === "todo" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                          task.status === "in-progress" &&
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                          task.status === "review" &&
                            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
                          task.status === "completed" &&
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                        )}
                      >
                        {task.status === "todo" && "To Do"}
                        {task.status === "in-progress" && "In Progress"}
                        {task.status === "review" && "Review"}
                        {task.status === "completed" && "Completed"}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          task.priority === "low" &&
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                          task.priority === "medium" &&
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                          task.priority === "high" &&
                            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
                          task.priority === "critical" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                        )}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center">
                      {task.dueDate ? (
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(task.dueDate)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No due date</span>
                      )}
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="icon">
                        <ListFilter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail 
          task={selectedTask} 
          isOpen={isTaskDetailOpen} 
          onClose={() => setIsTaskDetailOpen(false)}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={(newTask) => {
          // Generate a unique ID for the new task
          const taskId = `task-${Date.now()}`
          
          // Create the complete task object
          const completeTask = {
            ...newTask,
            id: taskId,
            createdById: "user-1", // Current user ID
            createdAt: new Date().toISOString(),
            actualHours: null,
            comments: [],
            attachments: [],
            dependsOn: [],
            isPinned: false,
            isTemplate: false
          }
          
          // Add the task to the tasks array
          tasks.push(completeTask)
          
          // Update the board state
          const updatedBoard = { ...board }
          const column = updatedBoard.columns.find(col => col.id === newTask.status)
          if (column) {
            column.taskIds.push(taskId)
          }
          setBoard(updatedBoard)
          
          setIsTaskFormOpen(false)
        }}
      />
    </div>
  )
}

