import React, { useState } from 'react';
import { PhoneCall, Mail, Calendar, MessageSquare, CheckCircle2, Clock, Search, Filter, Briefcase, FileText, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ReportsPage = () => {
  const { cardBg, border, text, textSecondary } = useTheme();
  const [activeTab, setActiveTab] = useState('LEADS'); // 'LEADS' or 'CAREERS'

  // User "Request a Call Back" data
  const leads = [
    { id: 1, name: "Rahul Mehra", phone: "+91 98765 43210", email: "rahul@example.com", date: "2025-12-24", details: "I need a high-end PC for 4K video editing.", status: "PENDING" },
  ];

  // User "Careers" form data
  const applications = [
    { id: 1, name: "Aryan Sharma", email: "aryan@hr.com", phone: "+91 88776 55443", description: "Expert in PC hardware assembly and liquid cooling.", status: "NEW", appliedOn: "2025-12-23" },
  ];

  const getStatusStyle = (status) => {
    if (status === 'CONTACTED' || status === 'HIRED') return 'bg-green-900/20 text-green-500 border-green-900/50';
    return 'bg-red-900/20 text-red-500 border-red-900/50';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-black uppercase tracking-tighter ${text}`}>
            {activeTab === 'LEADS' ? 'CALLBACK' : 'CAREER'} <span className="text-red-600">MANAGEMENT</span>
          </h1>
          <p className={`text-sm ${textSecondary}`}>Review incoming user {activeTab.toLowerCase()} submissions</p>
        </div>
        
        <div className={`flex p-1 rounded-xl ${cardBg} ${border}`}>
          <button 
            onClick={() => setActiveTab('LEADS')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'LEADS' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            <PhoneCall size={14}/> REQUESTS
          </button>
          <button 
            onClick={() => setActiveTab('CAREERS')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'CAREERS' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            <Briefcase size={14}/> Careers
          </button>
        </div>
      </div>

      {/* Conditional Rendering of Content */}
      <div className="space-y-4">
        {activeTab === 'LEADS' ? (
          // Call Back Requests List
          leads.map((lead) => (
            <div key={lead.id} className={`p-6 rounded-3xl hover:border-red-600/30 transition-all ${cardBg} ${border}`}>
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-lg font-bold ${text}`}>{lead.name}</h3>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${getStatusStyle(lead.status)}`}>{lead.status}</span>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs ${textSecondary}`}>
                    <span className="flex items-center gap-2"><PhoneCall size={14} className="text-red-600"/> {lead.phone}</span>
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-red-600"/> {lead.date}</span>
                  </div>
                </div>
                <div className={`flex-1 p-4 rounded-2xl italic text-xs ${cardBg} ${border} ${textSecondary}`}>
                  "{lead.details}"
                </div>
                <button className="bg-red-600 text-white text-[10px] font-bold py-2 px-6 rounded-xl uppercase self-center">Contacted</button>
              </div>
            </div>
          ))
        ) : (
          // Career Applications List
          applications.map((app) => (
            <div key={app.id} className={`p-6 rounded-3xl hover:border-blue-600/30 transition-all ${cardBg} ${border}`}>
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex gap-4 min-w-[250px]">
                  <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center font-black">{app.name.charAt(0)}</div>
                  <div>
                    <h3 className={`font-bold ${text}`}>{app.name}</h3>
                    <p className={`text-[10px] uppercase font-mono ${textSecondary}`}>{app.appliedOn}</p>
                  </div>
                </div>
                <div className={`flex-1 p-4 rounded-2xl ${cardBg} ${border}`}>
                  <span className="text-[9px] font-black text-red-600 uppercase mb-1 block">Description</span>
                  <p className={`text-xs italic ${textSecondary}`}>"{app.description}"</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '#';
                      link.download = `${app.name}_Resume.pdf`;
                      link.click();
                    }}
                    title="Download Resume" 
                    className="p-3 bg-[#121417] text-gray-400 hover:text-white rounded-xl border border-gray-800 hover:bg-gray-800 transition"
                  >
                    <Download size={18}/>
                  </button>
                  <button className="bg-blue-600 text-white text-[10px] font-bold py-3 px-6 rounded-xl uppercase">Shortlist</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsPage;