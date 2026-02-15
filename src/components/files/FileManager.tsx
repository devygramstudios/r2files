
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, RefreshCw, Grid, List as ListIcon, Loader2 } from 'lucide-react'
import FileGrid from './FileGrid'
import UploadArea from './UploadArea'
import FilePreview from './FilePreview'

export type FileItem = {
    key: string
    lastModified: string
    size: number
    url: string
}

export default function FileManager() {
    const [files, setFiles] = useState<FileItem[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const fetchFiles = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/files/list')
            const data = await res.json()
            if (data.files) {
                setFiles(data.files)
            }
        } catch (error) {
            console.error('Failed to fetch files:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    // Drag and drop handlers for the entire area
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        // Upload logic will be handled by UploadArea, but we can detect drop here if needed
    }, [])

    return (
        <div
            className="flex-1 p-6 relative h-[calc(100vh-4rem)] overflow-y-auto"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-200">Files</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchFiles}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="h-6 w-[1px] bg-slate-800 mx-1"></div>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        <ListIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <UploadArea
                onUploadComplete={fetchFiles}
                isDraggingGlobal={isDragging}
            />

            {loading && files.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <FileGrid
                    files={files}
                    viewMode={viewMode}
                    onPreview={setPreviewFile}
                    onDelete={fetchFiles}
                />
            )}

            <AnimatePresence>
                {previewFile && (
                    <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
                )}
            </AnimatePresence>
        </div>
    )
}
