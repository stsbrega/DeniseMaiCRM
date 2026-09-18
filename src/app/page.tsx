import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center space-y-8">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Welcome to <span className="text-blue-600">Denise Mai CRM</span>
        </h1>
        <p className="text-xl text-gray-600">
          Your single pane of glass for lead management, automation, and client communication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Lead Management</h3>
          <p className="text-sm text-gray-500 mb-4">Synchronize your Lofty leads and track them through your pipeline.</p>
          <Link href="/leads" className="text-blue-600 text-sm font-medium hover:underline">
            Go to Leads →
          </Link>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4 mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">AI Automation</h3>
          <p className="text-sm text-gray-500 mb-4">Generate personalized follow-up drafts using built-in AI intelligence.</p>
          <span className="text-gray-400 text-sm italic">Coming soon...</span>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Documents</h3>
          <p className="text-sm text-gray-500 mb-4">Securely store and organize lead documents in one central place.</p>
          <span className="text-gray-400 text-sm italic">Coming soon...</span>
        </div>
      </div>
    </div>
  );
}
