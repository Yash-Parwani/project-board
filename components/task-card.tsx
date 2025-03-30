"use client"
import { Calendar, CheckSquare, Clock, MessageSquare, Paperclip } from "lucide-react"

import { type Task, getUserById, getTaskCompletionPercentage } from "@/lib/data"
import { cn, formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TaskCardProps {
  task: Task
  focusMode?: boolean
}

export function TaskCard({ task, focusMode = false }: TaskCardProps) {
  const assignee = task.assigneeId ? getUserById(task.assigneeId) : null
  const completionPercentage = getTaskCompletionPercentage(task)

  // Check if task is due soon (within 48 hours)
  const isDueSoon = task.dueDate && new Date(task.dueDate).getTime() - new Date().getTime() < 48 * 60 * 60 * 1000

  // Check if task is overdue
  const isOverdue =
    task.dueDate && new Date(task.dueDate).getTime() < new Date().getTime() && task.status !== "completed"

  return (
    <Card
      className={cn(
        "task-card border shadow-sm",
        focusMode && (task.priority === "high" || task.priority === "critical" || isDueSoon) && "focus-mode",
        task.isPinned && "border-primary",
      )}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className={cn("px-2 py-0 text-xs font-normal", `priority-${task.priority}`)}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          {task.isRecurring && (
            <Badge variant="outline" className="ml-1 px-2 py-0 text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Recurring
            </Badge>
          )}
        </div>
        <h3 className="line-clamp-2 font-medium">{task.title}</h3>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>

        {task.subtasks.length > 0 && (
          <div className="mt-2">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-1" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-3 pt-0">
        <div className="flex items-center space-x-2">
          {assignee ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-6 w-6">
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          )}

          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <CheckSquare className="h-3 w-3" />
            <span>
              {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
            </span>
          </div>

          {task.comments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span>{task.comments.length}</span>
            </div>
          )}

          {task.attachments.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Paperclip className="h-3 w-3" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {task.dueDate && (
          <div
            className={cn(
              "flex items-center text-xs",
              isOverdue ? "text-destructive" : isDueSoon ? "text-orange-500" : "text-muted-foreground",
            )}
          >
            <Calendar className="mr-1 h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

