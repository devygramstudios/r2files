
'use client'

import { Search, Bell, Settings, LogOut } from 'lucide-react'

export default function Header({ userEmail }: { userEmail: string | undefined }) {
    return (
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search files, folders..."
                        className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
                <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-200">{userEmail?.split('@')[0]}</p>
                        <p className="text-xs text-slate-500">Free Plan</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                        {userEmail?.[0].toUpperCase()}
                    </div>

                    <form action="/auth/signout" method="post">
                        <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Sign Out">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </header>
    )
}
