import React, { useState, useEffect } from 'react';
import { IPCREditor } from './components/IPCREditor';
import { PMTDashboard } from './components/PMTDashboard';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { IPCRData, EmployeeCategory, Role, IPCRStatus, User } from './types';
import { Icons } from './components/ui/Icons';

// Mock Initial Data (Template)
const INITIAL_DATA: IPCRData = {
  id: 'ipcr-1',
  userId: '1',
  periodStart: 'January 1, 2026',
  periodEnd: 'June 30, 2026',
  category: EmployeeCategory.OFFICE_STAFF, // Default, updated on load
  hasDesignation: false,
  status: IPCRStatus.DRAFT,
  coreFunctions: [
    {
       id: 'c1', kra: 'Records Management', target: 'Digitize 100% of new files within 24 hours', 
       accomplishment: 'Digitized 98% of files', sdg: ['9. Industry/Innovation'],
       q: 5, e: 4, t: 5, remarks: 'Scanner malfunction on June 15', 
       isFixedVolume: false, period: 'Jan-Jun', evidence: [] 
    }
  ],
  strategicFunctions: [],
  supportFunctions: [],
  otherFunctions: [],
  comments: '',
  supervisorName: 'Dir. Maria Santos',
  supervisorPosition: 'Director, HRMO',
  approverName: 'VP Roberto Garcia',
  approverPosition: 'VP for Administration'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [data, setData] = useState<IPCRData>(INITIAL_DATA);
  const [userRole, setUserRole] = useState<Role>(Role.EMPLOYEE);
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');

  // Reset view when role changes to ensure correct dashboard is shown
  useEffect(() => {
    setView('dashboard');
  }, [userRole]);

  const handleLogin = () => {
    // Mock Google Login Response
    const mockUser: User = {
        id: 'user-google-123',
        name: 'Juan Dela Cruz',
        email: 'juan.delacruz@gmail.com',
        role: Role.EMPLOYEE,
        position: '',
        office: '',
        avatar: 'https://ui-avatars.com/api/?name=Juan+Dela+Cruz&background=0D8ABC&color=fff'
    };
    setUser(mockUser);
    setShowOnboarding(true); // Always show onboarding for demo purposes
  };

  const handleOnboardingComplete = (details: { category: EmployeeCategory; position: string; office: string }) => {
    if (!user) return;
    
    // Update User Profile
    const updatedUser = { ...user, ...details };
    setUser(updatedUser);
    
    // Update IPCR Template with user details
    setData(prev => ({
        ...prev,
        category: details.category
    }));

    setShowOnboarding(false);
    
    // Mock Notification
    setTimeout(() => {
        alert(`📧 Notification Sent: Welcome email sent to ${updatedUser.email}. Updates will be sent here.`);
    }, 500);
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit your IPCR for review?")) {
      setData({ ...data, status: IPCRStatus.SUBMITTED });
      alert(`IPCR Submitted! Notification sent to Supervisor and ${user?.email}`);
      setView('dashboard');
    }
  };

  const handleApprove = () => {
    setData({ ...data, status: IPCRStatus.APPROVED });
    alert(`IPCR Approved! Notification sent to ${user?.email}`);
  };

  const renderContent = () => {
    if (view === 'editor') {
      return (
        <IPCREditor 
          data={data} 
          onChange={setData} 
          userRole={userRole}
          currentUser={user}
          readOnly={data.status === IPCRStatus.APPROVED || data.status === IPCRStatus.ARCHIVED}
        />
      );
    }

    // ROLE-BASED DASHBOARD VIEWS
    
    // 1. PMT View
    if (userRole === Role.PMT) {
      return <PMTDashboard />;
    }

    // 2. Employee, Supervisor, VP Views
    return (
      <div className="max-w-6xl mx-auto space-y-8">
         {/* Welcome Banner */}
         <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
            <div>
               <h2 className="text-3xl font-extrabold text-white drop-shadow-md tracking-tight">
                 {userRole === Role.EMPLOYEE ? 'My Performance' : 'Performance Overview'}
               </h2>
               <p className="text-blue-100 font-medium opacity-90">
                 {userRole === Role.EMPLOYEE 
                   ? 'Manage your IPCR submissions and track your progress.' 
                   : 'Manage your own IPCR and review subordinate submissions.'}
               </p>
            </div>
            
            {userRole === Role.EMPLOYEE && (
              <button 
                onClick={() => { setData({...INITIAL_DATA, id: Math.random().toString(), category: user?.category || EmployeeCategory.OFFICE_STAFF}); setView('editor'); }} 
                className="glass hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg border border-white/20"
              >
                <Icons.Plus size={18}/> Create New IPCR
              </button>
            )}
         </div>

         {/* PENDING APPROVALS SECTION (Supervisor / VP Only) */}
         {(userRole === Role.IMMEDIATE_SUPERVISOR || userRole === Role.VP) && (
            <div className="glass-card rounded-xl overflow-hidden shadow-lg border-l-4 border-l-orange-500">
               <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-white/40">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Icons.AlertCircle size={20} className="text-orange-500"/> Pending Approvals
                  </h3>
                  <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold">1 Pending</span>
               </div>
               <div className="p-0">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50/50 text-slate-600 font-bold">
                       <tr>
                         <th className="p-4">Employee</th>
                         <th className="p-4">Role</th>
                         <th className="p-4">Period</th>
                         <th className="p-4">Status</th>
                         <th className="p-4">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100/50">
                        {/* Mock Pending Item */}
                        <tr className="hover:bg-white/40 transition-colors">
                           <td className="p-4 font-bold text-slate-700 flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">JD</div>
                             Jane Doe
                           </td>
                           <td className="p-4 text-slate-600">Admin Aide I</td>
                           <td className="p-4 text-slate-600">Jan - Jun 2026</td>
                           <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">Submitted</span></td>
                           <td className="p-4">
                             <button 
                               onClick={() => {
                                 // Mock loading submitted data
                                 alert("Opening Jane Doe's IPCR for review...");
                                 setView('editor');
                               }} 
                               className="text-blue-600 hover:text-blue-800 font-bold hover:underline flex items-center gap-1"
                             >
                               Review <Icons.ArrowRight size={14}/>
                             </button>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* MY IPCRS SECTION */}
         <div className="glass-card rounded-xl overflow-hidden shadow-lg">
            <div className="p-6 border-b border-gray-100/50 bg-white/40">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Icons.FileText size={20} className="text-blue-600"/> My IPCRs
              </h3>
            </div>
            <table className="w-full text-left text-sm">
               <thead className="bg-white/40 border-b border-white/20">
                 <tr>
                   <th className="p-4 font-bold text-slate-900">Period</th>
                   <th className="p-4 font-bold text-slate-900">Category</th>
                   <th className="p-4 font-bold text-slate-900">Status</th>
                   <th className="p-4 font-bold text-slate-900">Last Updated</th>
                   <th className="p-4 font-bold text-slate-900">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-200/50">
                 <tr className="hover:bg-white/30 transition-colors">
                   <td className="p-4 font-medium text-slate-800">{data.periodStart} - {data.periodEnd}</td>
                   <td className="p-4 font-medium text-slate-800">{data.category.replace(/_/g, ' ')}</td>
                   <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border shadow-sm ${
                        data.status === 'DRAFT' ? 'bg-gray-100/80 text-gray-700 border-gray-200' : 
                        data.status === 'APPROVED' ? 'bg-green-100/80 text-green-800 border-green-200' : 
                        'bg-blue-100/80 text-blue-800 border-blue-200'
                      }`}>{data.status}</span>
                   </td>
                   <td className="p-4 text-slate-600 font-medium">Just now</td>
                   <td className="p-4">
                      <button onClick={() => setView('editor')} className="text-blue-700 font-bold hover:text-blue-900 hover:underline flex items-center gap-1">
                        <Icons.Eye size={16} /> {data.status === 'DRAFT' ? 'Edit' : 'View'}
                      </button>
                   </td>
                 </tr>
                 {/* Fake history */}
                 <tr className="hover:bg-white/30 transition-colors opacity-70">
                   <td className="p-4 font-medium text-slate-800">July 1, 2025 - Dec 31, 2025</td>
                   <td className="p-4 font-medium text-slate-800">OFFICE STAFF</td>
                   <td className="p-4"><span className="bg-green-100/80 text-green-800 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">ARCHIVED</span></td>
                   <td className="p-4 text-slate-600 font-medium">Jan 15, 2026</td>
                   <td className="p-4"><button className="text-slate-400 font-semibold cursor-not-allowed">Locked</button></td>
                 </tr>
               </tbody>
            </table>
            {/* Empty State / No IPCRs */}
            {userRole === Role.EMPLOYEE && data.status !== 'DRAFT' && (
              <div className="p-8 text-center text-slate-500">
                <p>You don't have any active IPCR drafts.</p>
                <button onClick={() => { setData({...INITIAL_DATA, id: Math.random().toString(), category: user?.category || EmployeeCategory.OFFICE_STAFF}); setView('editor'); }} className="mt-2 text-blue-600 font-bold hover:underline">Create One Now</button>
              </div>
            )}
         </div>
      </div>
    );
  };

  // Auth Guard
  if (!user) return <LoginScreen onLogin={handleLogin} />;
  if (showOnboarding) return <OnboardingScreen onComplete={handleOnboardingComplete} userEmail={user.email} />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 glass-dark text-white flex-shrink-0 print:hidden flex flex-col justify-between shadow-2xl z-20">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
             <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-[10px] font-extrabold shadow-lg ring-2 ring-white/10">ParSU</div>
             <div>
                <h1 className="font-bold tracking-tight text-lg text-white/95">IPCR System</h1>
                <p className="text-[11px] text-blue-200 font-medium">Performance Management</p>
             </div>
          </div>
          
          <div className="p-4">
            {/* User Profile Snippet */}
            <div className="mb-6 bg-white/10 backdrop-blur-md p-3 rounded-xl flex items-center gap-3 border border-white/5 shadow-inner">
               <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full bg-slate-500 border-2 border-white/20" />
               <div className="overflow-hidden">
                 <p className="text-sm font-bold truncate text-white">{user.name}</p>
                 <p className="text-[10px] text-blue-200 truncate">{user.email}</p>
                 <span className="inline-block mt-1 px-1.5 py-0.5 bg-white/20 rounded text-[9px] font-bold uppercase tracking-wider">
                   {userRole.replace('_', ' ')}
                 </span>
               </div>
            </div>

            <div className="mb-6">
              <label className="text-[10px] uppercase text-blue-300 font-bold block mb-2 tracking-wider">Simulate Role View</label>
              <div className="relative">
                <select 
                  value={userRole} 
                  onChange={(e) => {
                    const newRole = e.target.value as Role;
                    setUserRole(newRole);
                  }}
                  className="w-full bg-slate-800/50 text-white text-sm p-2.5 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                >
                  <option value={Role.EMPLOYEE} className="bg-slate-800">Employee</option>
                  <option value={Role.IMMEDIATE_SUPERVISOR} className="bg-slate-800">Supervisor</option>
                  <option value={Role.VP} className="bg-slate-800">Vice President</option>
                  <option value={Role.PMT} className="bg-slate-800">PMT Admin</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <Icons.ArrowRight size={14} className="text-white/50 rotate-90" />
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setView('dashboard')}
                className={`flex items-center w-full p-3 rounded-xl text-sm font-medium transition-all duration-200 ${view === 'dashboard' ? 'bg-blue-600/90 shadow-lg text-white border border-blue-400/30' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}
              >
                {userRole === Role.PMT ? (
                  <>
                    <Icons.LayoutDashboard size={18} className="mr-3" /> Analytics
                  </>
                ) : (
                  <>
                    <Icons.FileText size={18} className="mr-3" /> Dashboard
                  </>
                )}
              </button>
              
              <button className="flex items-center w-full p-3 rounded-xl text-sm font-medium hover:bg-white/10 text-slate-400 hover:text-white transition-all opacity-60 cursor-not-allowed">
                <Icons.Bell size={18} className="mr-3" /> Notifications
              </button>
            </nav>
          </div>
        </div>
        
        <div className="p-4 border-t border-white/10 bg-white/5">
           <button onClick={handleLogout} className="flex items-center w-full p-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors">
             <Icons.LogOut size={16} className="mr-3" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Top Header */}
        <header className="glass sticky top-0 z-10 border-b border-white/30 h-16 flex items-center justify-between px-8 print:hidden shadow-sm">
           <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm border ${
                 data.status === 'DRAFT' ? 'bg-gray-100 text-gray-700 border-gray-300' : 
                 data.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-300' : 
                 'bg-blue-100 text-blue-800 border-blue-300'
              }`}>
                 {userRole === Role.PMT ? 'ADMIN ANALYTICS' : data.status}
              </span>
              <span className="text-xs text-slate-700 font-medium ml-2 flex items-center gap-1.5 bg-white/40 px-2 py-1 rounded-md">
                 <Icons.Mail size={12} className="text-blue-600" /> Notifications ON
              </span>
           </div>
           <div className="flex items-center gap-3">
              {view === 'editor' && (
                <button onClick={handlePrint} className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-black bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-gray-200">
                  <Icons.Download size={16} /> PDF
                </button>
              )}
              
              {view === 'editor' && (
                <>
                  <button onClick={() => alert("Draft Saved")} className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-black bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-gray-200">
                    <Icons.Save size={16} /> Save
                  </button>
                  
                  {userRole === Role.EMPLOYEE && data.status === 'DRAFT' && (
                    <button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-md">
                      <Icons.Send size={16} /> Submit
                    </button>
                  )}

                  {userRole === Role.IMMEDIATE_SUPERVISOR && data.status === 'SUBMITTED' && (
                    <button onClick={() => setData({...data, status: IPCRStatus.REVIEWED})} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-md">
                      <Icons.CheckCircle size={16} /> Endorse
                    </button>
                  )}
                  
                  {userRole === Role.VP && data.status === 'REVIEWED' && (
                     <button onClick={handleApprove} className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-md">
                       <Icons.CheckCircle size={16} /> Approve
                     </button>
                  )}
                </>
              )}
           </div>
        </header>

        {/* Dynamic View */}
        <div className="p-8 print:p-0 min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;