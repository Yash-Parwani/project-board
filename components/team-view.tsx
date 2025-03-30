"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Clock, Filter, MoreHorizontal, Plus, Search, XCircle } from "lucide-react"

import { type Priority, type Task, type User, getTasksByAssignee, users } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskDetail } from "@/components/task-detail"

export function TeamView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get tasks for a specific user
  const getUserTasks = (userId: string) => {
    return getTasksByAssignee(userId).filter((task) => priorityFilter === "all" || task.priority === priorityFilter)
  }

  // Calculate workload percentage
  const calculateWorkload = (userId: string) => {
    const userTasks = getTasksByAssignee(userId)
    if (userTasks.length === 0) return 0

    const inProgressTasks = userTasks.filter((task) => task.status === "in-progress" || task.status === "review").length

    return Math.min(Math.round((inProgressTasks / 5) * 100), 100) // Assuming 5 tasks is 100% workload
  }

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  // Get priority color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">Manage team members and workload</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search team members..."
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
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workload">
        <TabsList>
          <TabsTrigger value="workload">Workload</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
        </TabsList>

        <TabsContent value="workload" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => {
              const workload = calculateWorkload(user.id)
              const userTasks = getUserTasks(user.id)

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{user.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{user.role}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Assign Task</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Workload</span>
                          <span
                            className={cn(
                              "font-medium",
                              workload > 80 ? "text-red-500" : workload > 60 ? "text-orange-500" : "text-green-500",
                            )}
                          >
                            {workload}%
                          </span>
                        </div>
                        <Progress
                          value={workload}
                          className={cn(
                            workload > 80 ? "text-red-500" : workload > 60 ? "text-orange-500" : "text-green-500",
                          )}
                        />

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Active Tasks</span>
                            <span>{userTasks.length}</span>
                          </div>

                          {userTasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              className="flex cursor-pointer items-center justify-between rounded-md border p-2 hover:bg-muted/50"
                              onClick={() => handleTaskClick(task)}
                            >
                              <div className="flex items-center space-x-2">
                                {task.status === "completed" ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : task.status === "in-progress" ? (
                                  <Clock className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-sm">{task.title}</span>
                              </div>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </Badge>
                            </div>
                          ))}

                          {userTasks.length > 3 && (
                            <Button variant="ghost" className="w-full text-xs" onClick={() => setSelectedUser(user)}>
                              View all {userTasks.length} tasks
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="members">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-2">Workload</div>
              <div className="col-span-2">Tasks</div>
              <div className="col-span-1">Actions</div>
            </div>
            <div className="divide-y">
              {filteredUsers.map((user) => {
                const workload = calculateWorkload(user.id)
                const userTasks = getUserTasks(user.id)

                return (
                  <div key={user.id} className="grid grid-cols-12 gap-2 p-4 hover:bg-muted/50">
                    <div className="col-span-3 flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">{user.role}</div>
                    <div className="col-span-2 flex items-center">{user.department}</div>
                    <div className="col-span-2 flex items-center">
                      <div className="w-full space-y-1">
                        <Progress
                          value={workload}
                          className={cn(
                            workload > 80 ? "text-red-500" : workload > 60 ? "text-orange-500" : "text-green-500",
                          )}
                        />
                        <p className="text-xs text-muted-foreground">{workload}%</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <div className="flex space-x-1">
                        <Badge variant="outline">{userTasks.filter((t) => t.status === "todo").length} To Do</Badge>
                        <Badge variant="outline">
                          {userTasks.filter((t) => t.status === "in-progress").length} In Progress
                        </Badge>
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Assign Task</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail task={selectedTask} isOpen={isTaskDetailOpen} onClose={() => setIsTaskDetailOpen(false)} />
      )}
    </div>
  )
}

