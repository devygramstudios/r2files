
'use client'

import Sidebar from './Sidebar'
import Header from './Header'
import { useState } from 'react'

export default function DashboardLayout({ children, userEmail }: { children: React.ReactNode, userEmail: string | undefined }) {
    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 ease-in-out">
                <Header userEmail={userEmail} />
                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    )
}
