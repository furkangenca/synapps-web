"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { updateColumn, deleteColumn } from "@/lib/api"
import { Trash } from "lucide-react"

interface EditColumnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  column: {
    id: number
    title: string
  }
  onColumnUpdated: (updatedColumn: any) => void
  onColumnDeleted: (columnId: number) => void
}

export function EditColumnDialog({ open, onOpenChange, column, onColumnUpdated, onColumnDeleted }: EditColumnDialogProps) {
  const [title, setTitle] = useState(column.title)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setTitle(column.title)
  }, [column])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Hata",
        description: "Sütun başlığı boş olamaz.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const updatedColumn = await updateColumn(column.id, { title })
      const fullUpdatedColumn = { ...column, ...updatedColumn }
      onColumnUpdated(fullUpdatedColumn)
      setTimeout(() => onOpenChange(false), 0)
      toast({
        title: "Başarılı",
        description: "Sütun başarıyla güncellendi.",
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Sütun güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Bu sütunu silmek istediğinizden emin misiniz?")) {
      return
    }

    setIsSubmitting(true)

    try {
      await deleteColumn(column.id)
      onColumnDeleted(column.id)
      onOpenChange(false)
      toast({
        title: "Başarılı",
        description: "Sütun başarıyla silindi.",
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Sütun silinirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#2d2d2d] border-gray-700 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Sütunu Düzenle</DialogTitle>
            <DialogDescription className="text-gray-400">Sütun bilgilerini güncelleyin veya sütunu silin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-white">Sütun Başlığı</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Yapılacaklar, Devam Edenler, Tamamlananlar"
                className="bg-[#3a3a3a] border-gray-700 text-white placeholder:text-gray-500"
                required
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="sm:mr-auto"
            >
              <Trash className="mr-2 h-4 w-4" />
              {isSubmitting ? "Siliniyor..." : "Sütunu Sil"}
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent text-white border-gray-600 hover:bg-gray-700 hover:text-white">
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#3a3a3a] text-white hover:bg-[#404040]">
                {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 