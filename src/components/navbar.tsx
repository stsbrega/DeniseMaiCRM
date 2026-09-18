import React from 'react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Denise Mai CRM
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/leads" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Leads
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Tasks
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Documents
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Welcome, Denise</span>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
            DM
          </div>
        </div>
      </div>
    </nav>
  );
}
