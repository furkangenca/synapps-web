"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { fetchColumns } from "@/lib/api"
import { Task, Column } from "@/types/index"
import { GanttChart } from "@/components/gantt/gantt-chart"

interface GanttChartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boardId: number
}

export function GanttChartDialog({ open, onOpenChange, boardId }: GanttChartDialogProps) {
  const [columns, setColumns] = useState<Column[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadColumns = async () => {
      if (!open) return

      try {
        const columnsData = await fetchColumns(boardId)
        setColumns(columnsData)
      } catch (error) {
        toast({
          title: "Hata",
          description: "Gantt şeması yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadColumns()
  }, [boardId, open, toast])

  // Tüm görevleri tek bir dizide topla
  const allTasks = columns.reduce((tasks: (Task & { columnTitle?: string })[], column) => {
    const tasksWithColumnTitle = (column.tasks || []).map(task => ({
      ...task,
      columnTitle: column.title
    }))
    return [...tasks, ...tasksWithColumnTitle]
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] bg-[#2d2d2d] border-gray-700 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle>Gantt Şeması</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <GanttChart tasks={allTasks} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 