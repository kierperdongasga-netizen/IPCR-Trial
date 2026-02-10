import React, { useState } from 'react';
import { Icons } from './ui/Icons';
import { EmployeeCategory } from '../types';

// Mock Data Generators
const OFFICES = ['Office of the President', 'Admin Services', 'College of Arts & Sciences', 'College of Education', 'Finance'];
const PERIODS = ['Jan - Jun 2026', 'Jul - Dec 2025', 'Jan - Jun 2025'];

const MOCK_STATS = {
  totalEmployees: 142,
  submissionRate: 87,
  avgRating: 4.2,
  pendingReviews: 12
};

const DEPT_PERFORMANCE = [
  { name: 'Office of the President', submitted: 15, total: 15, avg: 4.5 },
  { name: 'Admin Services', submitted: 40, total: 45, avg: 3.8 },
  { name: 'College of Arts & Sciences', submitted: 28, total: 32, avg: 4.1 },
  { name: 'College of Education', submitted: 25, total: 30, avg: 4.3 },
  { name: 'Finance', submitted: 18, total: 20, avg: 3.9 },
];

const RATING_DISTRIBUTION = [
  { label: 'Outstanding', count: 25, color: 'bg-green-500' },
  { label: 'Very Satisfactory', count: 80, color: 'bg-blue-500' },
  { label: 'Satisfactory', count: 30, color: 'bg-yellow-500' },
  { label: 'Unsatisfactory', count: 5, color: 'bg-orange-500' },
  { label: 'Poor', count: 2, color: 'bg-red-500' },
];

const CATEGORY_BREAKDOWN = [
  { label: 'Director / Unit Head', count: 15 },
  { label: 'Office Staff', count: 110 },
  { label: 'Drivers', count: 17 },
];

export const PMTDashboard: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState(PERIODS[0]);
  const [filterOffice, setFilterOffice] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-white drop-shadow-md tracking-tight">PMT Analytics</h2>
          <p className="text-blue-100 font-medium opacity-90">Performance Management Team - Compliance & Ratings Overview</p>
        </div>
        <button className="glass hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg border border-white/20">
          <Icons.Download size={18} /> Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-5 rounded-xl shadow-lg flex gap-4 flex-wrap items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wide">Rating Period</label>
          <div className="relative">
            <select 
              value={filterPeriod} 
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm p-2.5 text-slate-800 font-medium outline-none appearance-none cursor-pointer hover:bg-white/80 transition-colors"
            >
              {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <Icons.ArrowRight className="absolute right-3 top-3 text-slate-400 rotate-90 pointer-events-none" size={14}/>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wide">Department / Office</label>
          <div className="relative">
            <select 
              value={filterOffice} 
              onChange={(e) => setFilterOffice(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm p-2.5 text-slate-800 font-medium outline-none appearance-none cursor-pointer hover:bg-white/80 transition-colors"
            >
              <option value="All">All Departments</option>
              {OFFICES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <Icons.ArrowRight className="absolute right-3 top-3 text-slate-400 rotate-90 pointer-events-none" size={14}/>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-slate-600 mb-1.5 block uppercase tracking-wide">Employee Category</label>
          <div className="relative">
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm p-2.5 text-slate-800 font-medium outline-none appearance-none cursor-pointer hover:bg-white/80 transition-colors"
            >
              <option value="All">All Categories</option>
              <option value={EmployeeCategory.DIRECTOR_UNIT_HEAD}>Director / Unit Head</option>
              <option value={EmployeeCategory.OFFICE_STAFF}>Office Staff</option>
              <option value={EmployeeCategory.DRIVER}>Driver</option>
            </select>
             <Icons.ArrowRight className="absolute right-3 top-3 text-slate-400 rotate-90 pointer-events-none" size={14}/>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-xl shadow-lg border-l-4 border-l-blue-500 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between">
             <div className="text-slate-500 text-xs font-extrabold uppercase tracking-wider">Total Target</div>
             <div className="bg-blue-100 p-2 rounded-lg">
                <Icons.Users size={20} className="text-blue-600"/>
             </div>
          </div>
          <div className="text-4xl font-extrabold mt-4 text-slate-800">{MOCK_STATS.totalEmployees}</div>
          <div className="text-xs text-slate-500 mt-2 font-medium">Eligible Employees</div>
        </div>
        <div className="glass-card p-6 rounded-xl shadow-lg border-l-4 border-l-green-500 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between">
             <div className="text-slate-500 text-xs font-extrabold uppercase tracking-wider">Completion</div>
             <div className="bg-green-100 p-2 rounded-lg">
                <Icons.CheckCircle size={20} className="text-green-600"/>
             </div>
          </div>
          <div className="text-4xl font-extrabold mt-4 text-slate-800">{MOCK_STATS.submissionRate}%</div>
          <div className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1">
             <span className="bg-green-100 px-1 rounded">↑ 2%</span> from last period
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl shadow-lg border-l-4 border-l-purple-500 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between">
             <div className="text-slate-500 text-xs font-extrabold uppercase tracking-wider">Inst. Average</div>
             <div className="bg-purple-100 p-2 rounded-lg">
               <Icons.BarChart3 size={20} className="text-purple-600"/>
             </div>
          </div>
          <div className="text-4xl font-extrabold mt-4 text-slate-800">{MOCK_STATS.avgRating}</div>
          <div className="text-xs text-purple-600 mt-2 font-bold bg-purple-50 inline-block px-2 py-0.5 rounded">Very Satisfactory</div>
        </div>
        <div className="glass-card p-6 rounded-xl shadow-lg border-l-4 border-l-orange-500 hover:-translate-y-1 transition-transform duration-300">
           <div className="flex items-center justify-between">
             <div className="text-slate-500 text-xs font-extrabold uppercase tracking-wider">Pending</div>
             <div className="bg-orange-100 p-2 rounded-lg">
               <Icons.AlertCircle size={20} className="text-orange-600"/>
             </div>
          </div>
          <div className="text-4xl font-extrabold mt-4 text-slate-800">{MOCK_STATS.pendingReviews}</div>
          <div className="text-xs text-orange-600 mt-2 font-bold">Need immediate action</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance Table */}
        <div className="lg:col-span-2 glass-card rounded-xl shadow-lg p-6">
          <h3 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2 text-lg">
            <Icons.FileText size={20} className="text-blue-600" /> Completion by Department
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/40 text-slate-600 font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3 rounded-tl-lg">Department</th>
                  <th className="py-3 px-3 text-center">Submitted</th>
                  <th className="py-3 px-3 text-center w-1/3">Progress</th>
                  <th className="py-3 px-3 text-center rounded-tr-lg">Avg Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DEPT_PERFORMANCE.map((dept, i) => {
                  const percentage = Math.round((dept.submitted / dept.total) * 100);
                  return (
                    <tr key={i} className="hover:bg-white/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800">{dept.name}</td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">{dept.submitted} / {dept.total}</td>
                      <td className="py-3 px-3 align-middle">
                        <div className="w-full bg-gray-200/60 rounded-full h-3 shadow-inner">
                          <div className={`h-3 rounded-full shadow-sm ${percentage === 100 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block text-right font-bold">{percentage}%</span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900 bg-white/20 rounded-lg">{dept.avg}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rating Distribution & Category */}
        <div className="space-y-6">
          {/* Adjectival Ratings */}
          <div className="glass-card rounded-xl shadow-lg p-6">
            <h3 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2 text-lg">
              <Icons.BarChart3 size={20} className="text-purple-600" /> Rating Distribution
            </h3>
            <div className="space-y-4">
              {RATING_DISTRIBUTION.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-700">{item.label}</span>
                    <span className="text-slate-500 font-medium">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 shadow-inner">
                    <div className={`h-2.5 rounded-full shadow-sm ${item.color}`} style={{ width: `${(item.count / 142) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card rounded-xl shadow-lg p-6">
            <h3 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2 text-lg">
              <Icons.PieChart size={20} className="text-orange-600" /> Employee Categories
            </h3>
            <div className="space-y-3">
              {CATEGORY_BREAKDOWN.map((cat) => (
                <div key={cat.label} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 hover:bg-white/30 p-2 rounded-lg transition-colors">
                   <span className="text-sm text-slate-700 font-medium">{cat.label}</span>
                   <span className="text-sm font-bold bg-white/60 px-2.5 py-1 rounded-md text-slate-800 shadow-sm">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};