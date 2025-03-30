"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Filter, GanttChart, LayoutDashboard, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const actions = [
    { icon: Plus, label: "New Task", action: () => console.log("New Task") },
    { icon: LayoutDashboard, label: "Board", action: () => console.log("Board") },
    { icon: Calendar, label: "Calendar", action: () => console.log("Calendar") },
    { icon: GanttChart, label: "Gantt", action: () => console.log("Gantt") },
    { icon: Filter, label: "Filter", action: () => console.log("Filter") },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-2 flex flex-col-reverse items-end space-y-2 space-y-reverse"
          >
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="mb-2 flex items-center"
              >
                <span className="mr-2 rounded-md bg-background px-2 py-1 text-sm shadow-lg">{action.label}</span>
                <Button size="icon" className="h-10 w-10 rounded-full shadow-lg" onClick={action.action}>
                  <action.icon className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          className={cn("h-14 w-14 rounded-full shadow-lg", isOpen && "bg-primary/90")}
          onClick={toggleOpen}
        >
          <Plus className={cn("h-6 w-6 transition-transform", isOpen && "rotate-45")} />
        </Button>
      </motion.div>
    </div>
  )
}

