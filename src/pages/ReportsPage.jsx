import React, { useState, useEffect } from 'react';
import { PhoneCall, Calendar, Briefcase, Download, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ReportsPage = () => {
  const { cardBg, border, text, textSecondary } = useTheme();
  const [activeTab, setActiveTab] = useState('LEADS');

  const [leads, setLeads] = useState([]);
  const [applications, setApplications] = useState([]);

  /* ================= FETCH LEADS ================= */
  useEffect(() => {
    fetch('http://localhost:8181/api/leads')
      .then(res => res.json())
      .then(data => setLeads(Array.isArray(data) ? data : []))
      .catch(err => console.error('Leads error:', err));
  }, []);

  /* ================= FETCH CAREERS ================= */
 useEffect(() => {
  fetch('http://localhost:8181/api/careers')
    .then(res => res.json())
    .then(data => {
      const sortedData = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn))
        : [];
      setApplications(sortedData);
    });
}, []);

  const downloadResume = async (id, name) => {
    const res = await fetch(`http://localhost:8181/api/careers/${id}/resume`);

    if (!res.ok) {
      alert("Resume not available");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const deleteLead = async (id) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await fetch(`http://localhost:8181/api/leads/${id}`, { method: 'DELETE' });
        setLeads(leads.filter(lead => lead.id !== id));
      } catch (err) {
        console.error('Delete lead error:', err);
      }
    }
  };

 const deleteApplication = async (id) => {
  const res = await fetch(`http://localhost:8181/api/careers/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    setApplications(prev => prev.filter(app => app.id !== id));
  } else {
    alert("Delete failed");
  }
};


  const getStatusStyle = (status) =>
    status === 'CONTACTED' || status === 'HIRED'
      ? 'bg-green-900/20 text-green-500 border-green-900/50'
      : 'bg-red-900/20 text-red-500 border-red-900/50';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className={`text-xl sm:text-2xl font-black ${text}`}>
          {activeTab === 'LEADS' ? 'CALLBACK' : 'CAREER'} <span className="text-red-600">MANAGEMENT</span>
        </h1>

        <div className={`flex p-1 rounded-xl ${cardBg} ${border} w-full sm:w-auto`}>
          <button onClick={() => setActiveTab('LEADS')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 text-[10px] font-black rounded-lg ${activeTab === 'LEADS' ? 'bg-red-600 text-white' : 'text-gray-500'}`}>
            <PhoneCall size={14}/> <span className="hidden sm:inline">REQUESTS</span>
          </button>

          <button onClick={() => setActiveTab('CAREERS')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 text-[10px] font-black rounded-lg ${activeTab === 'CAREERS' ? 'bg-red-600 text-white' : 'text-gray-500'}`}>
            <Briefcase size={14}/> <span className="hidden sm:inline">CAREERS</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">

        {activeTab === 'LEADS' && leads.map(lead => (
          <div key={lead.id} className={`p-4 sm:p-6 rounded-3xl ${cardBg} ${border}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className={`font-bold text-lg sm:text-base ${text}`}>{lead.name}</h3>
                <p className={`text-sm ${textSecondary} mt-1`}>{lead.phone}</p>
                <p className={`italic ${textSecondary} text-sm mt-2`}>"{lead.details}"</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => window.open(`tel:${lead.phone}`, '_self')}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex-1 sm:flex-none justify-center"
                >
                  <PhoneCall size={14}/> Call
                </button>
                <button 
                  onClick={() => deleteLead(lead.id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors justify-center"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'CAREERS' && applications.map(app => (
          <div key={app.id} className={`p-4 sm:p-6 rounded-3xl ${cardBg} ${border}`}>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className={`font-bold text-lg sm:text-base ${text}`}>{app.name}</h3>
                <p className={`text-sm ${textSecondary} mt-1`}>{app.appliedOn}</p>
                <p className={`italic ${textSecondary} text-sm mt-2`}>"{app.description}"</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => downloadResume(app.id, app.name)}
                  className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors flex-1 sm:flex-none justify-center"
                >
                  <Download size={14}/> Download Resume
                </button>
               <button
  onClick={() => deleteApplication(app.id)}
  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors justify-center"
>
 <Trash2 size={14}/>
</button>

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ReportsPage;