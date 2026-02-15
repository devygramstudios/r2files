
'use client'

import { FileIcon, ImageIcon, MoreVertical, Trash, Download, Share2, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { type FileItem } from './FileManager'

interface FileGridProps {
    files: FileItem[]
    viewMode: 'grid' | 'list'
    onPreview: (file: FileItem) => void
    onDelete: () => void
}

export default function FileGrid({ files, viewMode, onPreview, onDelete }: FileGridProps) {
    const handleDelete = async (key: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return

        try {
            await fetch(`/api/files/delete?key=${encodeURIComponent(key)}`, {
                method: 'DELETE',
            })
            onDelete()
        } catch (error) {
            console.error('Delete failed:', error)
        }
    }

    const handleShare = async (key: string) => {
        try {
            const res = await fetch(`/api/files/share?key=${encodeURIComponent(key)}`)
            const data = await res.json()
            if (data.url) {
                navigator.clipboard.writeText(data.url)
                alert('Sharable Link copied to clipboard!')
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (viewMode === 'list') {
        return (
            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-800/50 text-xs uppercase font-medium text-slate-300">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Size</th>
                            <th className="px-6 py-3">Last Modified</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {files.map((file) => (
                            <tr key={file.key} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                        {file.key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <ImageIcon className="w-4 h-4 text-purple-400" />
                                        ) : (
                                            <FileIcon className="w-4 h-4 text-blue-400" />
                                        )}
                                    </div>
                                    {file.key.split('-').slice(1).join('-')}
                                </td>
                                <td className="px-6 py-4">{(file.size / 1024).toFixed(1)} KB</td>
                                <td className="px-6 py-4">{formatDistanceToNow(new Date(file.lastModified), { addSuffix: true })}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => onPreview(file)} className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-blue-400" title="Preview">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleShare(file.key)} className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-green-400" title="Share">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(file.key)} className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-red-400" title="Delete">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map((file) => (
                <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={file.key}
                    className="group relative bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800 rounded-xl overflow-hidden transition-all duration-200"
                >
                    <div className="aspect-square bg-slate-900/50 flex items-center justify-center relative overflow-hidden">
                        {file.key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img src={file.url} alt={file.key} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                            <FileIcon className="w-12 h-12 text-slate-600 group-hover:text-blue-500 transition-colors" />
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                            <button onClick={() => onPreview(file)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(file.key)} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full text-white backdrop-blur-md transition-colors">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-3">
                        <p className="font-medium text-sm text-slate-200 truncate" title={file.key}>
                            {file.key.split('-').slice(1).join('-') || file.key}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation() // Prevent preview trigger if we clicked container
                                    handleShare(file.key)
                                }}
                                className="text-xs text-blue-400 hover:text-blue-300"
                            >
                                Share
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
