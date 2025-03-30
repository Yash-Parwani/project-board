"use client"

import { useState } from "react"
import {
  AlertCircle,
  Calendar,
  CheckSquare,
  Clock,
  Edit,
  Link2,
  MessageSquare,
  Paperclip,
  Play,
  Plus,
  Square,
  Trash,
  User,
  X,
} from "lucide-react"

import {
  type Comment,
  type SubTask,
  type Task,
  getUserById,
  getTaskCompletionPercentage,
  getTaskDependencies,
} from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn, formatDate } from "@/lib/utils"

interface TaskDetailProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onDelete: (taskId: string) => void
}

export function TaskDetail({ task, isOpen, onClose, onDelete }: TaskDetailProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [newComment, setNewComment] = useState("")
  const [newSubtask, setNewSubtask] = useState("")
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)

  const assignee = task.assigneeId ? getUserById(task.assigneeId) : null
  const creator = getUserById(task.createdById)
  const dependencies = getTaskDependencies(task.id)
  const completionPercentage = getTaskCompletionPercentage(task)

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  // Toggle subtask completion
  const toggleSubtask = (subtask: SubTask) => {
    subtask.completed = !subtask.completed
    // In a real app, you would update the state and persist the changes
  }

  // Add new comment
  const addComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: "user-1", // Current user ID
      content: newComment,
      createdAt: new Date().toISOString(),
    }

    task.comments.push(comment)
    setNewComment("")
    // In a real app, you would update the state and persist the changes
  }

  // Add new subtask
  const addSubtask = () => {
    if (!newSubtask.trim()) return

    const subtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: newSubtask,
      completed: false,
    }

    task.subtasks.push(subtask)
    setNewSubtask("")
    // In a real app, you would update the state and persist the changes
  }

  // Toggle timer
  const toggleTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false)
      // In a real app, you would save the elapsed time
    } else {
      setIsTimerRunning(true)
      // Start the timer
      const interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)

      // Clean up on unmount or when timer stops
      return () => clearInterval(interval)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-auto p-0 sm:rounded-lg">
        <DialogHeader className="sticky top-0 z-10 bg-background p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`priority-${task.priority}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              {task.isRecurring && (
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  Recurring
                </Badge>
              )}
              <Badge
                variant="outline"
                className={`bg-${task.status === "todo" ? "blue" : task.status === "in-progress" ? "yellow" : task.status === "review" ? "purple" : "green"}-100`}
              >
                {task.status === "todo" && "To Do"}
                {task.status === "in-progress" && "In Progress"}
                {task.status === "review" && "Review"}
                {task.status === "completed" && "Completed"}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
          <DialogDescription className="pt-2">{task.description}</DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4">
          <Tabs defaultValue="details" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Assignee</h4>
                    <div className="flex items-center space-x-2">
                      {assignee ? (
                        <>
                          <Avatar>
                            <AvatarImage src={assignee.avatar} alt={assignee.name} />
                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{assignee.name}</p>
                            <p className="text-xs text-muted-foreground">{assignee.role}</p>
                          </div>
                        </>
                      ) : (
                        <Button variant="outline" size="sm">
                          <User className="mr-2 h-4 w-4" />
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Due Date</h4>
                    <div className="flex items-center space-x-2">
                      {task.dueDate ? (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDate(task.dueDate, true)}
                          </span>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Calendar className="mr-2 h-4 w-4" />
                          Set Due Date
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Time Tracking</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {task.estimatedHours && <span>Estimated: {task.estimatedHours} hours</span>}
                          {task.actualHours && <span className="ml-2">Actual: {task.actualHours} hours</span>}
                        </div>
                        <Button variant={isTimerRunning ? "destructive" : "default"} size="sm" onClick={toggleTimer}>
                          {isTimerRunning ? (
                            <>
                              <Square className="mr-2 h-4 w-4" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Start Timer
                            </>
                          )}
                        </Button>
                      </div>
                      {isTimerRunning && (
                        <div className="rounded-md bg-muted p-2 text-center font-mono text-lg">
                          {formatTime(timerSeconds)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Created By</h4>
                    <div className="flex items-center space-x-2">
                      {creator && (
                        <>
                          <Avatar>
                            <AvatarImage src={creator.avatar} alt={creator.name} />
                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{creator.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Created on {formatDate(task.createdAt)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Dependencies</h4>
                    {dependencies.length > 0 ? (
                      <ul className="space-y-2">
                        {dependencies.map((dep) => (
                          <li key={dep.id} className="flex items-center space-x-2 rounded-md border p-2">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{dep.title}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No dependencies</p>
                    )}
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Dependency
                    </Button>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Progress</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {task.subtasks.filter((st) => st.completed).length} of {task.subtasks.length} subtasks
                          completed
                        </span>
                        <span className="text-sm font-medium">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => {
                  onDelete(task.id)
                  onClose()
                }}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="subtasks" className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add a new subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                />
                <Button onClick={addSubtask}>Add</Button>
              </div>

              <div className="space-y-2">
                {task.subtasks.length > 0 ? (
                  task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center space-x-2 rounded-md border p-3">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleSubtask(subtask)}>
                        {subtask.completed ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </Button>
                      <span className={subtask.completed ? "text-muted-foreground line-through" : ""}>
                        {subtask.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No subtasks</h3>
                    <p className="text-sm text-muted-foreground">
                      Add subtasks to break down this task into smaller steps
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4 pt-4">
              <div className="flex items-start space-x-2">
                <Avatar className="mt-1">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
                  <AvatarFallback>YA</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={addComment}>Comment</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                {task.comments.length > 0 ? (
                  task.comments.map((comment) => {
                    const commentUser = getUserById(comment.userId)
                    return (
                      <div key={comment.id} className="flex space-x-2">
                        <Avatar className="mt-1">
                          <AvatarImage src={commentUser?.avatar} alt={commentUser?.name} />
                          <AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{commentUser?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No comments</h3>
                    <p className="text-sm text-muted-foreground">Start the conversation by adding a comment</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4 pt-4">
              <div className="flex items-center justify-center rounded-md border border-dashed p-4">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <Paperclip className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Drop files here or click to upload</p>
                    <p className="text-xs text-muted-foreground">Upload files related to this task</p>
                  </div>
                  <Button size="sm">Upload Files</Button>
                </div>
              </div>

              <div className="space-y-2">
                {task.attachments.length > 0 ? (
                  task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                    <Paperclip className="h-8 w-8 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No attachments</h3>
                    <p className="text-sm text-muted-foreground">Upload files to share with the team</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

