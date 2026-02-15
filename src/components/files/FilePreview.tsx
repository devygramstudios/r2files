
'use client'

import { motion } from 'framer-motion'
import { X, Download, ExternalLink } from 'lucide-react'
import { type FileItem } from './FileManager'

export default function FilePreview({ file, onClose }: { file: FileItem | null, onClose: () => void }) {
    if (!file) return null

    const isImage = file.key.match(/\.(jpg|jpeg|png|gif|webp)$/i)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h3 className="text-lg font-medium text-slate-200 truncate pr-4">
                        {file.key.split('-').slice(1).join('-') || file.key}
                    </h3>
                    <div className="flex items-center gap-2">
                        <a href={file.url} download target="_blank" rel="noreferrer" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <Download className="w-5 h-5" />
                        </a>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-black/50 flex items-center justify-center p-4 overflow-auto min-h-[300px]">
                    {isImage ? (
                        <img src={file.url} alt={file.key} className="max-w-full max-h-[70vh] rounded-lg shadow-lg" />
                    ) : (
                        <div className="text-center">
                            <p className="text-slate-400 mb-4">Preview not available for this file type</p>
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Open in new tab <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-900 border-t border-slate-800 text-sm text-slate-500 flex justify-between">
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                    <span>{new Date(file.lastModified).toLocaleString()}</span>
                </div>
            </motion.div>
        </div>
    )
}
