"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Users, Settings, BarChart2 } from "lucide-react"
import { BoardFilter } from "@/components/board/board-filter"
import { BoardMembersDialog } from "@/components/board/board-members-dialog"
import { BoardSettingsDialog } from "@/components/board/board-settings-dialog"
import { GanttChartDialog } from "@/components/board/gantt-chart-dialog"

interface BoardHeaderProps {
  board: { // Daha spesifik bir type tanımı gerekebilir
    id: number; // id'nin number olduğunu varsayalım
    name: string;
    description?: string; // description'ı optional yapalım
    // Diğer board özellikleri
  };
  onBoardUpdated: (updatedBoard: any) => void; // Daha spesifik bir type tanımı gerekebilir
}

export function BoardHeader({ board, onBoardUpdated }: BoardHeaderProps) {
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isGanttDialogOpen, setIsGanttDialogOpen] = useState(false)

  return (
    <div className="flex items-center px-4 py-2 border-b border-gray-700">
      <div className="flex items-center">
        <h1 className="text-xl font-medium text-white">{board?.name}</h1>
      </div>

      <div className="ml-auto flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={() => setIsGanttDialogOpen(true)}
        >
          <BarChart2 className="h-4 w-4 mr-1" />
          <span>Gantt Şeması</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={() => setIsMembersDialogOpen(true)}
        >
          <Users className="h-4 w-4 mr-1" />
          <span>Üyeler</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
          onClick={() => setIsSettingsDialogOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <BoardMembersDialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen} boardId={board?.id} />

      <BoardSettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
        board={board}
        onBoardUpdated={onBoardUpdated}
      />

      <GanttChartDialog
        open={isGanttDialogOpen}
        onOpenChange={setIsGanttDialogOpen}
        boardId={board?.id}
      />
    </div>
  )
}
