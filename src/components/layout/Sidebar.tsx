
'use client'

import { HardDrive, FolderOpen, Clock, Star, Trash2, Cloud } from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform md:translate-x-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">CloudSpace</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 text-slate-100 bg-slate-800 rounded-lg">
                    <HardDrive className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">My Drive</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg transition-colors">
                    <FolderOpen className="w-5 h-5" />
                    <span>Shared with me</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg transition-colors">
                    <Clock className="w-5 h-5" />
                    <span>Recent</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg transition-colors">
                    <Star className="w-5 h-5" />
                    <span>Starred</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                    <span>Trash</span>
                </button>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Cloud className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-slate-300">Storage</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
                        <div className="bg-blue-500 h-1.5 rounded-full w-[45%]"></div>
                    </div>
                    <p className="text-xs text-slate-400">4.5 GB of 10 GB used</p>
                    <button className="w-full mt-3 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 py-1.5 rounded-lg transition-all">
                        Buy Storage
                    </button>
                </div>
            </div>
        </aside>
    )
}
