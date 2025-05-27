"use client"

import { useEffect, useRef, useState } from "react"
import type { Task } from "@/types/index"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface GanttChartProps {
  tasks: Task[]
}

export function GanttChart({ tasks }: GanttChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date()
  })

  useEffect(() => {
    if (!chartRef.current || tasks.length === 0) return

    // Tüm görevlerin başlangıç ve bitiş tarihlerini bul
    const allDates = tasks.flatMap(task => {
      const dates: Date[] = []
      if (task.start_date) dates.push(new Date(task.start_date))
      if (task.end_date) dates.push(new Date(task.end_date))
      return dates
    }).filter(date => !isNaN(date.getTime()))

    if (allDates.length === 0) return

    // En erken ve en geç tarihleri bul
    const startDate = new Date(Math.min(...allDates.map(date => date.getTime())))
    const endDate = new Date(Math.max(...allDates.map(date => date.getTime())))

    // Başlangıç tarihinden 7 gün öncesi ve bitiş tarihinden 7 gün sonrası
    startDate.setDate(startDate.getDate() - 7)
    endDate.setDate(endDate.getDate() + 7)

    setDateRange({ start: startDate, end: endDate })

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const dayWidth = 45

    if (chartRef.current) {
      chartRef.current.style.width = `${totalDays * dayWidth + 200}px`
    }
  }, [tasks])

  const getTaskColor = (task: Task) => {
    if (task.status === "completed") return "from-emerald-400 to-emerald-500"
    if (task.status === "in_progress") return "from-blue-400 to-blue-500"
    if (task.status === "pending") return "from-amber-400 to-amber-500"
    return "from-gray-400 to-gray-500"
  }

  const getTaskProgress = (task: Task) => {
    if (task.status === "completed") return 100
    if (task.status === "in_progress") return 65
    if (task.status === "pending") return 0
    return 0
  }

  return (
    <div className="overflow-x-auto">
      {/* Tarih başlıkları */}
      <div className="sticky top-0 z-10 bg-[#3a3a3a] border-b border-gray-600">
        <div className="flex">
          <div className="w-[200px] p-3 border-r border-gray-600">
            <span className="font-semibold text-gray-200">Görev Adı</span>
          </div>
          <div className="flex-1 flex relative">
            {/* Grid çizgileri */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) }).map((_, index) => (
                <div key={index} className="w-[45px] border-r border-gray-700/50" />
              ))}
            </div>

            {/* Tarih başlıkları */}
            {Array.from({ length: Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) }).map((_, index) => {
              const date = new Date(dateRange.start)
              date.setDate(dateRange.start.getDate() + index)
              const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
              const isWeekend = date.getDay() === 0 || date.getDay() === 6

              return (
                <div
                  key={index}
                  className={cn(
                    "w-[45px] p-2 text-center relative z-10 transition-colors",
                    isToday && "bg-blue-500/20",
                    isWeekend && "bg-gray-800/30",
                  )}
                >
                  <div className={cn("text-xs font-medium", isToday ? "text-blue-300" : "text-gray-400")}>
                    {format(date, "MMM", { locale: tr })}
                  </div>
                  <div className={cn("text-sm font-semibold", isToday ? "text-blue-200" : "text-gray-300")}>
                    {format(date, "d", { locale: tr })}
                  </div>
                  {isToday && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  )}
                </div>
              )
            })}

            {/* Bugün çizgisi */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-30 opacity-80"
              style={{ left: `${getTodayPosition()}px` }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Görev çubukları */}
      <div ref={chartRef} className="relative">
        {/* Grid çizgileri */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) }).map((_, index) => (
            <div
              key={index}
              className="w-[45px] border-r border-gray-700/30"
              style={{ marginLeft: index === 0 ? "200px" : "0" }}
            />
          ))}
        </div>

        {tasks.map((task, taskIndex) => (
          <div
            key={task.id}
            className={cn(
              "flex items-center transition-all duration-200 border-b border-gray-700/30 hover:bg-gray-700/20",
              taskIndex % 2 === 0 ? "bg-transparent" : "bg-gray-800/20",
            )}
            style={{ height: "50px" }}
          >
            <div className="w-[200px] p-3 border-r border-gray-600">
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    task.status === "completed" && "bg-emerald-400",
                    task.status === "in_progress" && "bg-blue-400",
                    task.status === "pending" && "bg-amber-400",
                  )}
                ></div>
                <div className="text-sm font-medium text-gray-200 truncate">{task.title}</div>
              </div>
            </div>

            <div className="flex-1 relative h-full flex items-center">
              {task.start_date && task.end_date && (
                <div
                  className={cn(
                    "relative group cursor-pointer transition-all duration-300 hover:scale-105",
                    hoveredTask === String(task.id) && "z-10",
                  )}
                  style={{
                    left: `${calculatePosition(task.start_date)}px`,
                    width: `${calculateWidth(task.start_date, task.end_date)}px`,
                  }}
                  onMouseEnter={() => setHoveredTask(String(task.id))}
                  onMouseLeave={() => setHoveredTask(null)}
                >
                  {/* Görev çubuğu */}
                  <div
                    className={cn(
                      "h-7 rounded-md shadow-lg bg-gradient-to-r transition-all duration-300 border border-white/10",
                      getTaskColor(task),
                      "hover:shadow-xl hover:shadow-blue-500/20 hover:border-white/20",
                    )}
                  >
                    {/* Progress bar */}
                    <div
                      className="h-full bg-white/25 rounded-md transition-all duration-500"
                      style={{ width: `${getTaskProgress(task)}%` }}
                    ></div>

                    {/* Görev metni */}
                    <div className="absolute inset-0 flex items-center px-2">
                      <span className="text-xs font-medium text-white truncate drop-shadow-sm">{task.title}</span>
                    </div>

                    {/* Parlama efekti */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Tooltip */}
                  {hoveredTask === String(task.id) && (
                    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-600 text-white p-3 rounded-lg shadow-2xl z-50 min-w-[220px]">
                      <div className="text-sm font-semibold text-white">{task.title}</div>
                      <div className="text-xs text-gray-300 mt-1">
                        {format(new Date(task.start_date), "dd MMM yyyy", { locale: tr })} -{" "}
                        {format(new Date(task.end_date), "dd MMM yyyy", { locale: tr })}
                      </div>
                      {task.assignee && (
                        <div className="text-xs text-gray-300 capitalize mt-1">
                          Atanan Kişi: {task.assignee}
                        </div>
                      )}
                      {task.importance && (
                        <div className="text-xs text-gray-300 capitalize mt-1">
                          Önem: {task.importance}
                        </div>
                      )}
                      {task.columnTitle && (
                        <div className="text-xs text-gray-300 capitalize mt-1">
                          Sütun: {task.columnTitle}
                        </div>
                      )}
                      {/* Tooltip ok */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Yardımcı fonksiyonlar
function calculatePosition(startDate: string): number {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - 7)

  const taskStart = new Date(startDate)
  const diffDays = Math.ceil((taskStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays * 45
}

function calculateWidth(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(diffDays * 45, 45)
}

function getTodayPosition(): number {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - 7)

  const diffDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return 200 + diffDays * 45 + 22.5
}
