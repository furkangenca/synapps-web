"use client"

import { useState, useEffect } from "react"
import { TaskCard } from "@/components/task/task-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateTaskDialog } from "@/components/task/create-task-dialog"
import { TaskDetailDialog } from "@/components/task/task-detail-dialog"
import { Draggable } from "@hello-pangea/dnd"
import { useToast } from "@/components/ui/use-toast"
import { Task, Column, BoardMember } from "@/types/index"

interface ColumnListProps {
  column: Column
  members: BoardMember[]
  onTaskAdded: (columnId: number, newTask: Task) => void
}

export function ColumnList({ column, members = [], onTaskAdded }: ColumnListProps) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(column.tasks || [])
  const { toast } = useToast()

  const handleAddTask = () => {
    setIsCreateTaskOpen(true)
  }

  const handleTaskCreated = async (newTask: Task) => {
    setIsCreateTaskOpen(false)
    setTasks([...tasks, newTask])
    onTaskAdded(column.id, newTask)
    toast({
      title: "Başarılı",
      description: "Görev başarıyla oluşturuldu.",
    })
  }

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId)
    setIsTaskDetailOpen(true)
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map((task: Task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const handleTaskDeleted = (taskId: number) => {
    setTasks(tasks.filter((task: Task) => task.id !== taskId))
  }

  useEffect(() => {
    if (column.tasks) {
      setTasks(column.tasks.filter(task => task != null));
    }
  }, [column.tasks])

  return (
    <div className="space-y-2">
      {tasks.map((task, index) => {
        if (!task || typeof task.id !== 'number') {
          console.warn('Geçersiz task:', task);
          return null;
        }

        const assignedMember = members.find((member: BoardMember) => member.user_id === task.assigned_user_id);
        const taskWithAssignee = {
          ...task,
          assignee: assignedMember ? { name: assignedMember.user?.name || "" } : undefined,
        };

        return (
          <Draggable key={task.id} draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                onClick={() => handleTaskClick(task.id)}
              >
                <TaskCard task={taskWithAssignee} />
              </div>
            )}
          </Draggable>
        );
      })}

      {tasks.length === 0 && (
        <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-gray-600 p-2 text-center text-sm text-gray-400">
          Bu sütunda görev bulunmuyor
        </div>
      )}

      <Button
        variant="ghost"
        className="w-full justify-center text-gray-400 hover:text-white hover:bg-gray-600/50"
        onClick={handleAddTask}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        <span>Görev Ekle</span>
      </Button>

      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        columnId={column.id}
        boardId={column.board_id}
        onTaskCreated={handleTaskCreated}
      />

      {selectedTaskId && (
        <TaskDetailDialog
          open={isTaskDetailOpen}
          onOpenChange={setIsTaskDetailOpen}
          taskId={selectedTaskId}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </div>
  )
}
