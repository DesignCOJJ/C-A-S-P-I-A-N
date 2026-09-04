import React, { useState, useRef } from 'react'
import { UploadCloud, FileText, Check } from 'lucide-react'

interface DropZoneProps {
  onFileContent: (content: string, filename: string) => void
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileContent }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [loadedFile, setLoadedFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setLoadedFile(file.name)
      onFileContent(result, file.name)
    }
    reader.readAsText(file)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative cursor-pointer transition-all duration-200 border-4 border-dashed p-4 flex flex-col items-center justify-center text-center ${
        isDragging
          ? 'border-indigo-400 bg-indigo-950/40 shadow-[0_0_25px_rgba(99,102,241,0.5)] scale-[1.01]'
          : 'border-slate-700 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0])
          }
        }}
        accept=".txt,.md,.json,.js,.ts,.tsx,.py,.html,.css"
        className="hidden"
      />

      <div className="flex items-center gap-3">
        <div
          className={`p-2 border-2 border-black transition-colors ${
            isDragging ? 'bg-indigo-400 text-slate-950' : 'bg-slate-800 text-slate-300'
          }`}
        >
          {loadedFile ? <Check size={20} className="text-emerald-400" /> : <UploadCloud size={20} />}
        </div>
        <div className="text-left font-mono">
          <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">
            {loadedFile ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <FileText size={14} /> Attached: {loadedFile}
              </span>
            ) : (
              'Drag & Drop context file or click to browse'
            )}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Supports .txt, .md, .json, code files (Auto-injected into context)
          </p>
        </div>
      </div>
    </div>
  )
}
