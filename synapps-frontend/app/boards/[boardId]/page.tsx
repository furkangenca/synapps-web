"use client"

import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { PlusCircle, UserPlus, Users, MoreHorizontal } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { ColumnList } from "@/components/column/column-list"
import { CreateColumnDialog } from "@/components/column/create-column-dialog"
import { fetchBoard, fetchColumns, updateTask, updateColumnPosition, fetchBoardMembers, requestBoardMembership } from "@/lib/api"
import { useAuth } from "@/components/auth/auth-provider"
import { BoardHeader } from "@/components/board/board-header"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { use } from "react"
import { EditColumnDialog } from "@/components/column/edit-column-dialog"
import { Task, Column, Board, BoardMember } from "@/types/index"

interface PageProps {
  params: Promise<{
    boardId: string
  }>
}

export default function BoardPage({ params }: PageProps) {
  const { boardId } = use(params)
  const [board, setBoard] = useState<Board | null>(null)
  const [columns, setColumns] = useState<Column[]>([])
  const [members, setMembers] = useState<BoardMember[]>([])
  const [filteredColumns, setFilteredColumns] = useState<Column[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [editingColumn, setEditingColumn] = useState<Column | null>(null)

  useEffect(() => {
    const loadBoardData = async () => {
      try {
        const [boardData, columnsData] = await Promise.all([
          fetchBoard(Number(boardId)), 
          fetchColumns(Number(boardId))
        ])

        setBoard(boardData)
        setColumns(columnsData)
        setFilteredColumns(columnsData)
        
        const membersData = await fetchBoardMembers(Number(boardId))
        setMembers(membersData)
      } catch (error: any) {
        toast({
          title: "Hata",
          description: error.message || "Pano bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadBoardData()
  }, [boardId, toast])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    console.log("Drag end triggered. Type:", type, "draggableId:", draggableId, "source:", source, "destination:", destination);

    if (type === "column") {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      
      // Tüm sütunların pozisyonunu güncelle
      const updatedColumns = newColumns.map((col, idx) => ({ ...col, position: idx }));
      setColumns(updatedColumns);
      setFilteredColumns(updatedColumns);
      
      // Sütunları sırayla güncelle
      for (const col of updatedColumns) {
        try {
          await updateColumnPosition(String(col.id), col.position);
        } catch (error) {
          console.error("Column position update error:", error);
        }
      }
    } else if (type === "task") {
      const sourceColIdx = columns.findIndex(col => String(col.id) === source.droppableId);
      const destColIdx = columns.findIndex(col => String(col.id) === destination.droppableId);
      if (sourceColIdx === -1 || destColIdx === -1) return;

      const sourceCol = columns[sourceColIdx];
      const destCol = columns[destColIdx];

      console.log("Source column:", sourceCol.title, "tasks before splice:", sourceCol.tasks);

      // Geçersiz (null veya undefined) görevleri filtrele ve Task tipinde olduklarından emin ol
      const sourceTasks = Array.from(sourceCol.tasks || []).filter((task): task is Task => task != null && typeof task.id === 'number');

      console.log("Source tasks after filtering:", sourceTasks);
      console.log("Splicing at index:", source.index);

      // Splice işlemi sırasında hata olabilir, try-catch ekleyelim
      let movedTask: Task | undefined;
      try {
         [movedTask] = sourceTasks.splice(source.index, 1);
      } catch (e) {
         console.error("Error during splice:", e);
         return;
      }
     
      console.log("Moved task after splice:", movedTask);
      console.log("Source tasks after splice:", sourceTasks);

      // Görev ID kontrolü - movedTask undefined ise veya id'si yoksa dur
      if (!movedTask || typeof movedTask.id !== 'number') {
        console.error(`Invalid or missing task ID:`, movedTask);
        return;
      }

      if (sourceCol.id === destCol.id) {
        // Aynı sütun içinde sıralama değişti
        sourceTasks.splice(destination.index, 0, movedTask);
        const updatedTasks = sourceTasks.map((task, idx) => ({ ...task, position: idx }));
        const updatedColumns = columns.map((col, idx) =>
          idx === sourceColIdx ? { ...col, tasks: updatedTasks } : col
        );
        setColumns(updatedColumns);
        setFilteredColumns(updatedColumns);
        
        // Görevleri sırayla güncelle
        for (const task of updatedTasks) {
           // Güncelleme öncesi ID kontrolü
          if (typeof task.id !== 'number') continue;
          try {
            await updateTask(task.id, { position: task.position, column_id: task.column_id });
          } catch (error) {
            console.error("Task position update error:", error);
          }
        }
      } else {
        // Farklı sütuna taşındı
        // Geçersiz (null veya undefined) görevleri filtrele ve Task tipinde olduklarından emin ol
        const destTasks = Array.from(destCol.tasks || []).filter((task): task is Task => task != null && typeof task.id === 'number');
        
        console.log("Destination column:", destCol.title, "tasks before adding moved task:", destTasks);
        console.log("Adding moved task at index:", destination.index);

        // Taşınan görevi hedef listeye ekle (yeni column_id ile)
        destTasks.splice(destination.index, 0, { ...movedTask, column_id: destCol.id });

        console.log("Destination tasks after adding moved task:", destTasks);
        
        const updatedSourceTasks = sourceTasks.map((task, idx) => ({ ...task, position: idx }));
        const updatedDestTasks = destTasks.map((task, idx) => ({ ...task, position: idx }));
        
        const updatedColumns = columns.map((col, idx) => {
          if (idx === sourceColIdx) return { ...col, tasks: updatedSourceTasks };
          if (idx === destColIdx) return { ...col, tasks: updatedDestTasks };
          return col;
        });
        
        setColumns(updatedColumns);
        setFilteredColumns(updatedColumns);
        
        // Görevleri sırayla güncelle
        for (const task of updatedSourceTasks) {
          // Güncelleme öncesi ID kontrolü
           if (typeof task.id !== 'number') continue;
          try {
            await updateTask(task.id, { position: task.position, column_id: task.column_id });
          } catch (error) {
            console.error("Task position update error:", error);
          }
        }
        
        for (const task of updatedDestTasks) {
           // Güncelleme öncesi ID kontrolü
          if (typeof task.id !== 'number') continue;
          try {
            await updateTask(task.id, { position: task.position, column_id: task.column_id });
          } catch (error) {
            console.error("Task position update error:", error);
          }
        }
      }
    }
  };

  const handleColumnCreated = async (newColumn: Column) => {
    setColumns((prevColumns) => [...prevColumns, newColumn]);
    setFilteredColumns((prevFilteredColumns) => [...prevFilteredColumns, newColumn]);
    setIsCreateColumnOpen(false);
  };

  const handleBoardUpdated = (updatedBoard: Board) => {
    setBoard(updatedBoard)
  }

  const handleColumnUpdated = (updatedColumn: Column) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === updatedColumn.id ? { ...col, ...updatedColumn } : col
      )
    );
    setFilteredColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === updatedColumn.id ? { ...col, ...updatedColumn } : col
      )
    );
    setEditingColumn((prev) =>
      prev && prev.id === updatedColumn.id ? { ...prev, ...updatedColumn } : prev
    );
  };

  const handleColumnDeleted = (columnId: number) => {
    setColumns((prevColumns) => prevColumns.filter((col: Column) => col.id !== columnId))
    setFilteredColumns((prevFilteredColumns) => prevFilteredColumns.filter((col: Column) => col.id !== columnId))
  }

  // Belirli bir sütuna görev eklendiğinde ana state'i güncelle
  const handleTaskAddedToColumn = (columnId: number, newTask: Task) => {
    setColumns((prevColumns) =>
      prevColumns.map((col: Column) =>
        col.id === columnId ? { ...col, tasks: [...(col.tasks || []), newTask] } : col
      )
    );
    // Filtrelenmiş sütunları da güncelle, eğer o sütun filtrelenmişler arasındaysa
    setFilteredColumns((prevFilteredColumns) =>
      prevFilteredColumns.map((col: Column) =>
         col.id === columnId ? { ...col, tasks: [...(col.tasks || []), newTask] } : col
      )
    );
  };

  if (isLoading) {
    return (
      <div className="h-full w-full bg-[#2d2d2d] p-4">
        <div className="h-8 w-64 bg-gray-700 animate-pulse rounded mb-8"></div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 w-80 flex-shrink-0 rounded-lg bg-gray-700 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-[#2d2d2d] flex flex-col">
      {/* Board header - Fixed olarak sabitlendi */}
      {/* Top degeri, layout header yüksekliği kadar ayarlanmali (örneğin 64px = top-16) */}
      {/* Left ve right degerleri sidebar genişliği ve sagdaki bosluga göre ayarlanmali */}
      {/* w-full yerine left/right 0 veya sidebar genişliği kadar olabilir */}
      <div className="fixed top-16 left-0 right-0 z-20 bg-[#2d2d2d] border-b border-gray-700"> {/* Örnek top-16 kullanildi, z-index layout headerdan düşük, icerikten yüksek */} 
         {/* BoardHeader icindeki padding ve margin de dikkate alinmali */}
         {board && (
           <BoardHeader board={board} onBoardUpdated={handleBoardUpdated} />
         )}
      </div>

      {/* Sütunlarin kaydirilabilir alani */}
      {/* Toplam sabit başliklarin yüksekliği kadar üstten boşluk verilmeli */} 
      {/* Layout header ~64px (pt-16), Board header ~64px. Toplam ~128px (pt-32) gibi */}
      <div className="flex-1 pt-28 p-4 overflow-x-auto overflow-y-hidden"> {/* Örnek pt-32 kullanildi, ihtiyaca gore ayarlanmali */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable 
            droppableId="columns" 
            direction="horizontal" 
            type="column" 
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div className="flex h-full" ref={provided.innerRef} {...provided.droppableProps}>
                {columns.map((column, index) => (
                  <Draggable key={column.id} draggableId={column.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`w-80 flex-shrink-0 ${snapshot.isDragging ? "opacity-70" : ""}`}
                      >
                        <div className="flex items-center justify-between bg-[#333333] border border-[#4a4a4a] p-2">
                          <h3 className="font-medium text-white">
                            {column.title}
                            {column.tasks?.length > 0 && (
                              <span className="ml-2 text-gray-400 text-sm">{column.tasks.length}</span>
                            )}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#404040]"
                            onClick={() => setEditingColumn(column)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <Droppable 
                          droppableId={column.id.toString()} 
                          type="task" 
                          isDropDisabled={false}
                          isCombineEnabled={false}
                          ignoreContainerClipping={false}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[calc(100vh-200px)] bg-[#3a3a3a] border border-[#4a4a4a] p-3 ${
                                snapshot.isDraggingOver ? "bg-[#404040] border-[#5a5a5a]" : ""
                              }`}
                            >
                              <ColumnList 
                                column={column} 
                                members={members as BoardMember[]} 
                                onTaskAdded={handleTaskAddedToColumn}
                              />
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {/* Add new column button */}
                <div className="w-80 flex-shrink-0 ml-4">
                  <Button
                    variant="ghost"
                    className="w-full h-10 flex items-center justify-center bg-[#3a3a3a] border border-[#4a4a4a] text-gray-400 hover:text-white hover:bg-[#404040] hover:border-[#5a5a5a]"
                    onClick={() => setIsCreateColumnOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    <span>Yeni Sütun Ekle</span>
                  </Button>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <CreateColumnDialog
        open={isCreateColumnOpen}
        onOpenChange={setIsCreateColumnOpen}
        boardId={boardId}
        onColumnCreated={handleColumnCreated}
      />

      {editingColumn && (
        <EditColumnDialog
          open={!!editingColumn}
          onOpenChange={(open) => {
            if (!open) setEditingColumn(null);
          }}
          column={editingColumn}
          onColumnUpdated={handleColumnUpdated}
          onColumnDeleted={handleColumnDeleted}
        />
      )}
    </div>
  )
}