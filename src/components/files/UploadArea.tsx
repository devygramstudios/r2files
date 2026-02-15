
'use client'

import { useState, useCallback } from 'react'
import { Upload, X, File, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UploadAreaProps {
    onUploadComplete: () => void
    isDraggingGlobal: boolean
}

export default function UploadArea({ onUploadComplete, isDraggingGlobal }: UploadAreaProps) {
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files)
        }
    }

    const handleFiles = async (files: FileList) => {
        setUploading(true)
        const file = files[0] // Single file for simplicity, can loop for multiple

        try {
            console.log('Step 1: Requesting upload URL...')
            // 1. Get presigned URL
            const res = await fetch('/api/files/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(`API Error: ${errorData.error || res.statusText}`)
            }

            const { uploadUrl, key } = await res.json()

            if (!uploadUrl) throw new Error('Failed to get upload URL: Response missing uploadUrl')

            console.log('Step 2: Uploading to R2...', uploadUrl)

            // 2. Upload to R2
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                    // 'Access-Control-Allow-Origin': '*', // This header shouldn't be valid in request, but sometimes people add it mistake. Removed.
                },
            })

            if (!uploadRes.ok) {
                throw new Error(`R2 Upload Error: ${uploadRes.status} ${uploadRes.statusText}`)
            }

            console.log('Step 3: Upload complete, refreshing...')

            // 3. Refresh list
            onUploadComplete()
        } catch (error: any) {
            console.error('Upload failed:', error)
            alert(`Upload failed: ${error.message}. Check console for details.`)
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    return (
        <div className="mb-8">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out cursor-pointer
          ${dragActive || isDraggingGlobal ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <div className={`p-3 rounded-full bg-slate-800 transition-colors ${dragActive ? 'bg-blue-600' : ''}`}>
                        <Upload className={`w-6 h-6 text-slate-400 ${dragActive ? 'text-white' : ''}`} />
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                        <span className="text-blue-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>

                {uploading && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-sm font-medium text-blue-400">Uploading...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
