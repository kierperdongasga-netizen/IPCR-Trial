import React, { useState } from 'react';
import { EmployeeCategory } from '../types';
import { Icons } from './ui/Icons';

interface Props {
  onComplete: (details: { category: EmployeeCategory; position: string; office: string }) => void;
  userEmail: string;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete, userEmail }) => {
  const [category, setCategory] = useState<EmployeeCategory>(EmployeeCategory.OFFICE_STAFF);
  const [position, setPosition] = useState('');
  const [office, setOffice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (position && office) {
      onComplete({ category, position, office });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Icons.Users size={20} className="text-blue-200" /> Complete your Profile
          </h2>
          <p className="text-blue-100 text-sm mt-1 font-medium opacity-90">Logged in as {userEmail}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 p-4 rounded-xl text-sm text-blue-900 shadow-sm">
            <strong>Action Required:</strong> Please select your personnel category to strictly follow the ParSU IPCR Guidelines for weight allocation.
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">Select Personnel Category</label>
            <div className="space-y-3">
              <label className={`flex items-start p-3 border rounded-xl cursor-pointer hover:bg-white/80 transition-all duration-200 ${category === EmployeeCategory.DIRECTOR_UNIT_HEAD ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-md' : 'border-gray-200 bg-white/40'}`}>
                <input type="radio" name="category" className="mt-1 accent-blue-600" checked={category === EmployeeCategory.DIRECTOR_UNIT_HEAD} onChange={() => setCategory(EmployeeCategory.DIRECTOR_UNIT_HEAD)} />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-slate-900">Director / Unit Head</span>
                  <span className="block text-xs text-slate-700 mt-1 font-medium">Weights: Core (60%), Strategic (30%), Other (10%)</span>
                </div>
              </label>
              
              <label className={`flex items-start p-3 border rounded-xl cursor-pointer hover:bg-white/80 transition-all duration-200 ${category === EmployeeCategory.OFFICE_STAFF ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-md' : 'border-gray-200 bg-white/40'}`}>
                <input type="radio" name="category" className="mt-1 accent-blue-600" checked={category === EmployeeCategory.OFFICE_STAFF} onChange={() => setCategory(EmployeeCategory.OFFICE_STAFF)} />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-slate-900">Office / Unit Staff</span>
                  <span className="block text-xs text-slate-700 mt-1 font-medium">Weights: Core (50%), Strategic (20%), Support (20%), Other (10%)</span>
                </div>
              </label>

              <label className={`flex items-start p-3 border rounded-xl cursor-pointer hover:bg-white/80 transition-all duration-200 ${category === EmployeeCategory.DRIVER ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-md' : 'border-gray-200 bg-white/40'}`}>
                <input type="radio" name="category" className="mt-1 accent-blue-600" checked={category === EmployeeCategory.DRIVER} onChange={() => setCategory(EmployeeCategory.DRIVER)} />
                <div className="ml-3">
                  <span className="block text-sm font-bold text-slate-900">University Driver</span>
                  <span className="block text-xs text-slate-700 mt-1 font-medium">Weights: Core (50%), Support (10%), Other (20%), Passenger (20%)</span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Position / Designation</label>
              <input 
                type="text" required
                className="w-full bg-white/70 border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 font-medium"
                placeholder="e.g. Admin Officer I"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Office / Unit</label>
              <input 
                type="text" required
                className="w-full bg-white/70 border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 font-medium"
                placeholder="e.g. HRMO"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-bold hover:shadow-lg hover:opacity-90 transition-all flex justify-center items-center gap-2 shadow-md transform active:scale-[0.99]">
            Save & Continue to Dashboard <Icons.ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};