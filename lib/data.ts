// Mock data for the project management board

export type User = {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
}

export type Priority = "low" | "medium" | "high" | "critical"

export type Status = "todo" | "in-progress" | "review" | "completed"

export type SubTask = {
  id: string
  title: string
  completed: boolean
}

export type Comment = {
  id: string
  userId: string
  content: string
  createdAt: string
}

export type Attachment = {
  id: string
  name: string
  url: string
  type: "image" | "document" | "video" | "other"
  size: number // in bytes
}

export type Task = {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  assigneeId: string | null
  createdById: string
  createdAt: string
  dueDate: string | null
  estimatedHours: number | null
  actualHours: number | null
  tags: string[]
  subtasks: SubTask[]
  comments: Comment[]
  attachments: Attachment[]
  dependsOn: string[] // IDs of tasks this task depends on
  isRecurring: boolean
  recurringPattern?: "daily" | "weekly" | "monthly" | "custom"
  isPinned: boolean
  isTemplate: boolean
}

export type Column = {
  id: Status
  title: string
  color: string
  taskIds: string[]
}

export type Board = {
  columns: Column[]
}

// Mock users
export const users: User[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Project Manager",
    department: "Engineering",
  },
  {
    id: "user-2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "UX Designer",
    department: "Design",
  },
  {
    id: "user-3",
    name: "Michael Brown",
    email: "michael@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Frontend Developer",
    department: "Engineering",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Backend Developer",
    department: "Engineering",
  },
  {
    id: "user-5",
    name: "David Wilson",
    email: "david@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "QA Engineer",
    department: "Quality Assurance",
  },
]

// Mock tasks
export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Design new dashboard layout",
    description: "Create wireframes and mockups for the new dashboard layout",
    status: "todo",
    priority: "high",
    assigneeId: "user-2",
    createdById: "user-1",
    createdAt: "2023-03-15T10:00:00Z",
    dueDate: "2023-03-22T18:00:00Z",
    estimatedHours: 8,
    actualHours: null,
    tags: ["design", "ui", "dashboard"],
    subtasks: [
      { id: "subtask-1-1", title: "Research dashboard layouts", completed: true },
      { id: "subtask-1-2", title: "Create wireframes", completed: false },
      { id: "subtask-1-3", title: "Design mockups", completed: false },
    ],
    comments: [
      {
        id: "comment-1-1",
        userId: "user-1",
        content: "Let's focus on simplicity and usability",
        createdAt: "2023-03-15T14:30:00Z",
      },
    ],
    attachments: [
      {
        id: "attachment-1-1",
        name: "dashboard-inspiration.jpg",
        url: "/placeholder.svg?height=200&width=300",
        type: "image",
        size: 1024000,
      },
    ],
    dependsOn: [],
    isRecurring: false,
    isPinned: true,
    isTemplate: false,
  },
  {
    id: "task-2",
    title: "Implement authentication system",
    description: "Set up user authentication with JWT and role-based access control",
    status: "in-progress",
    priority: "critical",
    assigneeId: "user-4",
    createdById: "user-1",
    createdAt: "2023-03-14T09:00:00Z",
    dueDate: "2023-03-21T18:00:00Z",
    estimatedHours: 16,
    actualHours: 8,
    tags: ["backend", "security", "authentication"],
    subtasks: [
      { id: "subtask-2-1", title: "Set up JWT authentication", completed: true },
      { id: "subtask-2-2", title: "Implement role-based access control", completed: false },
      { id: "subtask-2-3", title: "Write tests for authentication", completed: false },
    ],
    comments: [
      {
        id: "comment-2-1",
        userId: "user-4",
        content: "I've started implementing the JWT authentication",
        createdAt: "2023-03-16T11:20:00Z",
      },
    ],
    attachments: [],
    dependsOn: [],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
  {
    id: "task-3",
    title: "Create responsive UI components",
    description: "Develop reusable UI components that work across all device sizes",
    status: "in-progress",
    priority: "high",
    assigneeId: "user-3",
    createdById: "user-1",
    createdAt: "2023-03-13T14:00:00Z",
    dueDate: "2023-03-20T18:00:00Z",
    estimatedHours: 24,
    actualHours: 16,
    tags: ["frontend", "ui", "responsive"],
    subtasks: [
      { id: "subtask-3-1", title: "Design component system", completed: true },
      { id: "subtask-3-2", title: "Implement base components", completed: true },
      { id: "subtask-3-3", title: "Create complex components", completed: false },
      { id: "subtask-3-4", title: "Test on different devices", completed: false },
    ],
    comments: [],
    attachments: [],
    dependsOn: ["task-1"],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
  {
    id: "task-4",
    title: "Write API documentation",
    description: "Create comprehensive documentation for all API endpoints",
    status: "todo",
    priority: "medium",
    assigneeId: "user-4",
    createdById: "user-1",
    createdAt: "2023-03-16T09:30:00Z",
    dueDate: "2023-03-23T18:00:00Z",
    estimatedHours: 12,
    actualHours: null,
    tags: ["documentation", "api"],
    subtasks: [
      { id: "subtask-4-1", title: "Document authentication endpoints", completed: false },
      { id: "subtask-4-2", title: "Document user endpoints", completed: false },
      { id: "subtask-4-3", title: "Document project endpoints", completed: false },
    ],
    comments: [],
    attachments: [],
    dependsOn: ["task-2"],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
  {
    id: "task-5",
    title: "Conduct usability testing",
    description: "Organize and conduct usability testing sessions with real users",
    status: "todo",
    priority: "medium",
    assigneeId: "user-2",
    createdById: "user-1",
    createdAt: "2023-03-17T11:00:00Z",
    dueDate: "2023-03-27T18:00:00Z",
    estimatedHours: 16,
    actualHours: null,
    tags: ["testing", "ux", "research"],
    subtasks: [
      { id: "subtask-5-1", title: "Prepare test scenarios", completed: false },
      { id: "subtask-5-2", title: "Recruit test participants", completed: false },
      { id: "subtask-5-3", title: "Conduct testing sessions", completed: false },
      { id: "subtask-5-4", title: "Analyze results", completed: false },
    ],
    comments: [],
    attachments: [],
    dependsOn: ["task-1", "task-3"],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
  {
    id: "task-6",
    title: "Optimize database queries",
    description: "Identify and optimize slow database queries to improve performance",
    status: "review",
    priority: "high",
    assigneeId: "user-4",
    createdById: "user-1",
    createdAt: "2023-03-12T10:00:00Z",
    dueDate: "2023-03-19T18:00:00Z",
    estimatedHours: 8,
    actualHours: 10,
    tags: ["backend", "performance", "database"],
    subtasks: [
      { id: "subtask-6-1", title: "Identify slow queries", completed: true },
      { id: "subtask-6-2", title: "Optimize query structure", completed: true },
      { id: "subtask-6-3", title: "Add appropriate indexes", completed: true },
      { id: "subtask-6-4", title: "Measure performance improvements", completed: true },
    ],
    comments: [
      {
        id: "comment-6-1",
        userId: "user-4",
        content: "I've optimized the main queries. Performance improved by 40%.",
        createdAt: "2023-03-18T15:45:00Z",
      },
    ],
    attachments: [],
    dependsOn: [],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
  {
    id: "task-7",
    title: "Fix cross-browser compatibility issues",
    description: "Address UI issues in different browsers, especially Safari and IE11",
    status: "completed",
    priority: "high",
    assigneeId: "user-3",
    createdById: "user-1",
    createdAt: "2023-03-10T09:00:00Z",
    dueDate: "2023-03-17T18:00:00Z",
    estimatedHours: 12,
    actualHours: 14,
    tags: ["frontend", "bug", "compatibility"],
    subtasks: [
      { id: "subtask-7-1", title: "Identify issues in Safari", completed: true },
      { id: "subtask-7-2", title: "Fix Safari-specific bugs", completed: true },
      { id: "subtask-7-3", title: "Identify issues in IE11", completed: true },
      { id: "subtask-7-4", title: "Fix IE11-specific bugs", completed: true },
    ],
    comments: [
      {
        id: "comment-7-1",
        userId: "user-3",
        content: "All major cross-browser issues have been fixed.",
        createdAt: "2023-03-17T16:30:00Z",
      },
    ],
    attachments: [],
    dependsOn: [],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
  {
    id: "task-8",
    title: "Weekly team meeting",
    description: "Regular team sync to discuss progress and blockers",
    status: "todo",
    priority: "medium",
    assigneeId: "user-1",
    createdById: "user-1",
    createdAt: "2023-03-15T08:00:00Z",
    dueDate: "2023-03-22T15:00:00Z",
    estimatedHours: 1,
    actualHours: null,
    tags: ["meeting", "team"],
    subtasks: [
      { id: "subtask-8-1", title: "Prepare agenda", completed: false },
      { id: "subtask-8-2", title: "Send calendar invites", completed: true },
      { id: "subtask-8-3", title: "Take meeting notes", completed: false },
    ],
    comments: [],
    attachments: [],
    dependsOn: [],
    isRecurring: true,
    recurringPattern: "weekly",
    isPinned: true,
    isTemplate: false,
  },
  {
    id: "task-9",
    title: "Create onboarding tutorial",
    description: "Design and implement an interactive onboarding tutorial for new users",
    status: "todo",
    priority: "low",
    assigneeId: "user-2",
    createdById: "user-1",
    createdAt: "2023-03-18T11:00:00Z",
    dueDate: "2023-03-30T18:00:00Z",
    estimatedHours: 20,
    actualHours: null,
    tags: ["design", "ux", "onboarding"],
    subtasks: [
      { id: "subtask-9-1", title: "Design tutorial flow", completed: false },
      { id: "subtask-9-2", title: "Create tutorial content", completed: false },
      { id: "subtask-9-3", title: "Implement tutorial UI", completed: false },
      { id: "subtask-9-4", title: "Test with new users", completed: false },
    ],
    comments: [],
    attachments: [],
    dependsOn: ["task-3"],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
  {
    id: "task-10",
    title: "Set up CI/CD pipeline",
    description: "Configure continuous integration and deployment pipeline",
    status: "completed",
    priority: "critical",
    assigneeId: "user-3",
    createdById: "user-1",
    createdAt: "2023-03-08T10:00:00Z",
    dueDate: "2023-03-15T18:00:00Z",
    estimatedHours: 16,
    actualHours: 12,
    tags: ["devops", "automation"],
    subtasks: [
      { id: "subtask-10-1", title: "Set up GitHub Actions", completed: true },
      { id: "subtask-10-2", title: "Configure test automation", completed: true },
      { id: "subtask-10-3", title: "Set up staging deployment", completed: true },
      { id: "subtask-10-4", title: "Set up production deployment", completed: true },
    ],
    comments: [
      {
        id: "comment-10-1",
        userId: "user-3",
        content: "CI/CD pipeline is now fully operational.",
        createdAt: "2023-03-15T14:00:00Z",
      },
    ],
    attachments: [],
    dependsOn: [],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
  {
    id: "task-11",
    title: "Implement dark mode",
    description: "Add dark mode support to the application",
    status: "review",
    priority: "medium",
    assigneeId: "user-3",
    createdById: "user-1",
    createdAt: "2023-03-14T13:00:00Z",
    dueDate: "2023-03-21T18:00:00Z",
    estimatedHours: 12,
    actualHours: 10,
    tags: ["frontend", "ui", "accessibility"],
    subtasks: [
      { id: "subtask-11-1", title: "Create dark color palette", completed: true },
      { id: "subtask-11-2", title: "Implement theme switching", completed: true },
      { id: "subtask-11-3", title: "Test across all components", completed: true },
    ],
    comments: [],
    attachments: [],
    dependsOn: ["task-3"],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
  {
    id: "task-12",
    title: "Implement file upload functionality",
    description: "Add the ability for users to upload and manage files",
    status: "in-progress",
    priority: "high",
    assigneeId: "user-4",
    createdById: "user-1",
    createdAt: "2023-03-15T09:00:00Z",
    dueDate: "2023-03-22T18:00:00Z",
    estimatedHours: 16,
    actualHours: 8,
    tags: ["backend", "feature", "storage"],
    subtasks: [
      { id: "subtask-12-1", title: "Design file storage architecture", completed: true },
      { id: "subtask-12-2", title: "Implement file upload API", completed: true },
      { id: "subtask-12-3", title: "Create file management UI", completed: false },
      { id: "subtask-12-4", title: "Implement file permissions", completed: false },
    ],
    comments: [],
    attachments: [],
    dependsOn: [],
    isRecurring: false,
    isPinned: false,
    isTemplate: false,
  },
]

// Initial board state
export const initialBoard: Board = {
  columns: [
    {
      id: "todo",
      title: "To Do",
      color: "blue",
      taskIds: tasks.filter((task) => task.status === "todo").map((task) => task.id),
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "yellow",
      taskIds: tasks.filter((task) => task.status === "in-progress").map((task) => task.id),
    },
    {
      id: "review",
      title: "Review",
      color: "purple",
      taskIds: tasks.filter((task) => task.status === "review").map((task) => task.id),
    },
    {
      id: "completed",
      title: "Completed",
      color: "green",
      taskIds: tasks.filter((task) => task.status === "completed").map((task) => task.id),
    },
  ],
}

// Analytics data
export const analyticsData = {
  tasksByStatus: [
    { name: "To Do", value: tasks.filter((task) => task.status === "todo").length },
    { name: "In Progress", value: tasks.filter((task) => task.status === "in-progress").length },
    { name: "Review", value: tasks.filter((task) => task.status === "review").length },
    { name: "Completed", value: tasks.filter((task) => task.status === "completed").length },
  ],
  tasksByPriority: [
    { name: "Low", value: tasks.filter((task) => task.priority === "low").length },
    { name: "Medium", value: tasks.filter((task) => task.priority === "medium").length },
    { name: "High", value: tasks.filter((task) => task.priority === "high").length },
    { name: "Critical", value: tasks.filter((task) => task.priority === "critical").length },
  ],
  tasksByAssignee: users.map((user) => ({
    name: user.name,
    value: tasks.filter((task) => task.assigneeId === user.id).length,
  })),
  completionTrend: [
    { name: "Week 1", completed: 3, created: 5 },
    { name: "Week 2", completed: 5, created: 4 },
    { name: "Week 3", completed: 4, created: 6 },
    { name: "Week 4", completed: 7, created: 3 },
  ],
  timeEstimationAccuracy: [
    { name: "Task 1", estimated: 8, actual: 7 },
    { name: "Task 2", estimated: 16, actual: 14 },
    { name: "Task 3", estimated: 24, actual: 28 },
    { name: "Task 4", estimated: 12, actual: 10 },
    { name: "Task 5", estimated: 16, actual: 18 },
  ],
}

// Function to get user by ID
export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

// Function to get task by ID
export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id)
}

// Function to get tasks by assignee
export function getTasksByAssignee(userId: string): Task[] {
  return tasks.filter((task) => task.assigneeId === userId)
}

// Function to get tasks by status
export function getTasksByStatus(status: Status): Task[] {
  return tasks.filter((task) => task.status === status)
}

// Function to get tasks by priority
export function getTasksByPriority(priority: Priority): Task[] {
  return tasks.filter((task) => task.priority === priority)
}

// Function to get pinned tasks
export function getPinnedTasks(): Task[] {
  return tasks.filter((task) => task.isPinned)
}

// Function to get tasks due soon (within 3 days)
export function getTasksDueSoon(): Task[] {
  const now = new Date()
  const threeDaysLater = new Date(now)
  threeDaysLater.setDate(now.getDate() + 3)

  return tasks.filter((task) => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    return dueDate >= now && dueDate <= threeDaysLater
  })
}

// Function to get overdue tasks
export function getOverdueTasks(): Task[] {
  const now = new Date()

  return tasks.filter((task) => {
    if (!task.dueDate || task.status === "completed") return false
    const dueDate = new Date(task.dueDate)
    return dueDate < now
  })
}

// Function to calculate task completion percentage
export function getTaskCompletionPercentage(task: Task): number {
  if (task.subtasks.length === 0) return 0
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  return Math.round((completedSubtasks / task.subtasks.length) * 100)
}

// Function to get task dependencies
export function getTaskDependencies(taskId: string): Task[] {
  const task = getTaskById(taskId)
  if (!task) return []

  return task.dependsOn.map((depId) => getTaskById(depId)).filter(Boolean) as Task[]
}

// Function to get dependent tasks
export function getDependentTasks(taskId: string): Task[] {
  return tasks.filter((task) => task.dependsOn.includes(taskId))
}

