import React, { useState } from 'react';
import { IPCRData, Indicator, EmployeeCategory, Role, SDG_OPTIONS, User } from '../types';
import { calculateFinalRating, getAdjectivalRating, calculateIndicatorAverage, calculateSectionAverage } from '../lib/calculations';
import { Icons } from './ui/Icons';

interface Props {
  data: IPCRData;
  onChange: (data: IPCRData) => void;
  readOnly?: boolean;
  userRole: Role;
  currentUser: User | null;
}

const EmptyIndicator = (): Indicator => ({
  id: Math.random().toString(36).substr(2, 9),
  kra: '', target: '', accomplishment: '', sdg: [],
  q: null, e: null, t: null, remarks: '',
  isFixedVolume: false, period: 'Jan-Jun', evidence: []
});

export const IPCREditor: React.FC<Props> = ({ data, onChange, readOnly, userRole, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'summary'>('form');
  
  const updateIndicator = (section: keyof IPCRData, id: string, field: keyof Indicator, value: any) => {
    if (readOnly && userRole === Role.EMPLOYEE) return; // Basic protection
    
    // Permission: Only Supervisor can edit Q, E, T
    if (['q','e','t'].includes(field as string) && userRole === Role.EMPLOYEE) return;
    // Permission: Only Employee can edit Content (unless in draft, but simplified here)
    if (!['q','e','t','remarks'].includes(field as string) && userRole === Role.IMMEDIATE_SUPERVISOR) return;

    const list = data[section] as Indicator[];
    const newList = list.map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange({ ...data, [section]: newList });
  };

  const addRow = (section: keyof IPCRData) => {
    if (readOnly) return;
    const list = data[section] as Indicator[];
    onChange({ ...data, [section]: [...list, EmptyIndicator()] });
  };

  const handleFileUpload = (section: keyof IPCRData, id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFile = {
        id: Math.random().toString(),
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        type: 'Document'
      };
      
      const list = data[section] as Indicator[];
      const newList = list.map(item => {
        if (item.id === id) {
          return { ...item, evidence: [...item.evidence, newFile] };
        }
        return item;
      });
      onChange({ ...data, [section]: newList });
    }
  };

  const stats = calculateFinalRating(data);

  const renderTableSection = (title: string, sectionKey: 'coreFunctions' | 'strategicFunctions' | 'supportFunctions' | 'otherFunctions', weight: number) => {
    const indicators = data[sectionKey] as Indicator[];
    const avg = calculateSectionAverage(indicators);

    return (
      <div className="mb-8 glass-card rounded-xl overflow-hidden shadow-lg print:shadow-none print:border-black print:bg-white">
        <div className="bg-white/40 px-6 py-4 border-b border-white/20 flex justify-between items-center print:bg-gray-200">
          <div>
            <h3 className="font-extrabold text-slate-900 uppercase tracking-tight">{title}</h3>
            <span className="text-xs text-slate-600 font-semibold bg-white/40 px-2 py-0.5 rounded">Weight Allocation: {weight}%</span>
          </div>
          {!readOnly && (
             <button onClick={() => addRow(sectionKey)} className="flex items-center text-sm font-bold text-blue-700 hover:text-blue-900 bg-blue-50/50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition-all no-print">
               <Icons.Plus size={16} className="mr-1" /> Add Row
             </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/60 text-slate-800 font-bold border-b border-gray-200/50 print:bg-gray-100">
              <tr>
                <th className="p-3 border-r border-gray-200/50 w-1/4">Output / Success Indicators</th>
                <th className="p-3 border-r border-gray-200/50 w-1/6">Targets</th>
                <th className="p-3 border-r border-gray-200/50 w-1/6">Actual Accomplishments</th>
                <th className="p-3 border-r border-gray-200/50 w-24">Rating</th>
                <th className="p-3 w-1/6">Remarks & Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {indicators.map((ind) => {
                 const indAvg = calculateIndicatorAverage(ind);
                 return (
                  <tr key={ind.id} className="hover:bg-white/40 transition-colors group">
                    <td className="p-3 border-r border-gray-200/50 align-top">
                      <textarea 
                        className="w-full bg-white/40 resize-none outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 text-slate-800 font-medium placeholder-slate-400 transition-all focus:bg-white"
                        rows={4}
                        value={ind.kra}
                        placeholder="Enter KRA..."
                        onChange={(e) => updateIndicator(sectionKey, ind.id, 'kra', e.target.value)}
                        disabled={readOnly}
                      />
                      <div className="mt-2 no-print">
                        <label className="text-xs font-bold text-slate-500">SDGs:</label>
                        <select 
                          className="w-full text-xs mt-1 border border-gray-200 rounded p-1.5 bg-white/60 text-slate-800 font-medium"
                          onChange={(e) => updateIndicator(sectionKey, ind.id, 'sdg', [...ind.sdg, e.target.value])}
                          disabled={readOnly}
                        >
                          <option value="">+ Add SDG</option>
                          {SDG_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {ind.sdg.map(s => (
                            <span key={s} className="bg-green-100/90 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-green-200">{s}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 border-r border-gray-200/50 align-top">
                      <textarea 
                        className="w-full bg-white/40 resize-none outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 text-slate-800 font-medium placeholder-slate-400 transition-all focus:bg-white"
                        rows={4}
                        value={ind.target}
                        onChange={(e) => updateIndicator(sectionKey, ind.id, 'target', e.target.value)}
                        disabled={readOnly}
                      />
                    </td>
                    <td className="p-3 border-r border-gray-200/50 align-top">
                      <textarea 
                        className="w-full bg-white/40 resize-none outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 text-slate-800 font-medium placeholder-slate-400 transition-all focus:bg-white"
                        rows={4}
                        value={ind.accomplishment}
                        onChange={(e) => updateIndicator(sectionKey, ind.id, 'accomplishment', e.target.value)}
                        disabled={readOnly}
                      />
                    </td>
                    <td className="p-3 border-r border-gray-200/50 align-top bg-slate-50/30">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Q</label>
                          <input 
                            type="number" min="1" max="5"
                            className="w-full text-center border border-gray-300 rounded p-1 text-sm font-bold bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={ind.q || ''}
                            onChange={(e) => updateIndicator(sectionKey, ind.id, 'q', parseInt(e.target.value))}
                            disabled={userRole === Role.EMPLOYEE}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">E</label>
                          <input 
                            type="number" min="1" max="5"
                            className="w-full text-center border border-gray-300 rounded p-1 text-sm font-bold bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={ind.e || ''}
                            onChange={(e) => updateIndicator(sectionKey, ind.id, 'e', parseInt(e.target.value))}
                            disabled={userRole === Role.EMPLOYEE}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">T</label>
                          <input 
                            type="number" min="1" max="5"
                            className="w-full text-center border border-gray-300 rounded p-1 text-sm font-bold bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={ind.t || ''}
                            onChange={(e) => updateIndicator(sectionKey, ind.id, 't', parseInt(e.target.value))}
                            disabled={userRole === Role.EMPLOYEE}
                          />
                        </div>
                        <div className="flex flex-col justify-end">
                          <label className="text-[10px] text-blue-600 block font-extrabold uppercase">Ave</label>
                          <div className="text-center font-extrabold text-blue-700 bg-blue-50 rounded py-1 border border-blue-100 shadow-sm">{indAvg || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 align-top">
                      <textarea 
                        className="w-full bg-white/40 resize-none outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 text-xs text-slate-800 font-medium placeholder-slate-400 transition-all focus:bg-white"
                        rows={2}
                        placeholder="Remarks..."
                        value={ind.remarks}
                        onChange={(e) => updateIndicator(sectionKey, ind.id, 'remarks', e.target.value)}
                        disabled={readOnly && userRole !== Role.IMMEDIATE_SUPERVISOR}
                      />
                      <div className="mt-3 border-t border-gray-200/60 pt-2">
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-xs font-bold text-slate-600">Evidence</span>
                           <label className="cursor-pointer text-blue-600 hover:text-blue-800 no-print transition-colors p-1 rounded hover:bg-blue-50">
                              <Icons.Upload size={14} />
                              <input type="file" className="hidden" onChange={(e) => handleFileUpload(sectionKey, ind.id, e)} />
                           </label>
                         </div>
                         {ind.evidence.map(file => (
                           <div key={file.id} className="flex items-center text-[10px] font-medium text-slate-700 bg-white border border-gray-200 p-1.5 rounded mb-1 shadow-sm">
                             <Icons.FileText size={10} className="mr-1 text-blue-500" />
                             <span className="truncate max-w-[100px]">{file.fileName}</span>
                           </div>
                         ))}
                         {ind.evidence.length === 0 && <span className="text-[10px] text-red-400 italic font-medium px-1">No evidence attached</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {indicators.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-slate-400 font-medium italic bg-white/20">No indicators added yet. Click "Add Row" to start.</td></tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50/80 font-bold text-slate-800 border-t border-gray-200">
               <tr>
                 <td colSpan={3} className="p-3 text-right border-r border-gray-200/50 text-slate-600 uppercase text-xs tracking-wider">Section Average Rating:</td>
                 <td className="p-3 text-center border-r border-gray-200/50 text-lg text-blue-800">{avg}</td>
                 <td className=""></td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Info Block */}
      <div className="glass-card p-8 rounded-xl mb-8 print:shadow-none print:border-none print:bg-white">
        <div className="text-center mb-8 border-b border-gray-200/50 pb-6">
           <h1 className="font-extrabold text-2xl uppercase tracking-tight text-slate-900">Individual Performance Commitment and Review (IPCR)</h1>
           <p className="text-sm font-semibold text-slate-500 mt-2 tracking-wide uppercase">Partido State University - Non-Teaching Personnel</p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 text-sm mb-4">
           <div className="bg-white/40 p-4 rounded-lg border border-white/40 shadow-sm">
             <span className="block text-slate-500 text-xs font-bold uppercase mb-1">Ratee</span>
             <div className="font-bold text-lg text-slate-900">{currentUser ? currentUser.name : 'Unknown User'}</div>
             <div className="text-xs font-medium text-slate-600 mt-0.5">{currentUser?.position || 'Position Not Set'} - {currentUser?.office || 'Office Not Set'}</div>
           </div>
           <div className="space-y-4">
             <div className="bg-white/40 p-3 rounded-lg border border-white/40 shadow-sm flex justify-between items-center">
               <span className="block text-slate-500 text-xs font-bold uppercase">Rating Period</span>
               <div className="font-bold text-slate-900">{data.periodStart} to {data.periodEnd}</div>
             </div>
             <div className="bg-white/40 p-3 rounded-lg border border-white/40 shadow-sm flex justify-between items-center">
               <span className="block text-slate-500 text-xs font-bold uppercase">Category</span>
               <div className="font-bold text-slate-900">
                 {data.category.replace(/_/g, ' ')}
               </div>
             </div>
             <div>
                <label className="flex items-center cursor-pointer bg-white/40 p-3 rounded-lg border border-white/40 shadow-sm hover:bg-white/60 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={data.hasDesignation} 
                    onChange={(e) => onChange({...data, hasDesignation: e.target.checked})}
                    className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    disabled={readOnly}
                  />
                  <span className="text-sm font-bold text-slate-800">With Designation?</span>
                </label>
             </div>
           </div>
        </div>
      </div>

      {/* Main Form Sections */}
      {renderTableSection('Core Functions', 'coreFunctions', stats.weights.core)}
      {renderTableSection('Strategic Functions', 'strategicFunctions', stats.weights.strategic)}
      {renderTableSection('Support Functions', 'supportFunctions', stats.weights.support)}
      {renderTableSection('Other Functions', 'otherFunctions', stats.weights.other)}

      {/* Summary Section */}
      <div className="glass-card p-8 rounded-xl break-inside-avoid print:shadow-none print:bg-white">
        <h3 className="font-extrabold text-slate-900 uppercase mb-6 border-b border-gray-200/50 pb-3 flex items-center gap-2">
          <Icons.Calculator size={20} className="text-blue-600"/> Summary of Ratings
        </h3>
        <table className="w-full text-sm border-separate border-spacing-0 rounded-lg overflow-hidden border border-gray-200/50">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="border-b border-r border-gray-200/50 p-3 text-left font-bold text-slate-700">KRA</th>
              <th className="border-b border-r border-gray-200/50 p-3 text-right font-bold text-slate-700">Average Rating [A]</th>
              <th className="border-b border-r border-gray-200/50 p-3 text-right font-bold text-slate-700">Weight [B]</th>
              <th className="border-b p-3 text-right font-bold text-slate-700">Weighted Rating (AxB/100)</th>
            </tr>
          </thead>
          <tbody className="bg-white/60">
            <tr className="hover:bg-white/80">
              <td className="border-b border-r border-gray-200/50 p-3 font-medium text-slate-800">Core Functions</td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right text-slate-600">{stats.coreAvg}</td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right text-slate-600">{stats.weights.core}%</td>
              <td className="border-b p-3 text-right font-bold text-slate-900">{stats.coreWeighted.toFixed(2)}</td>
            </tr>
            <tr className="hover:bg-white/80">
              <td className="border-b border-r border-gray-200/50 p-3 font-medium text-slate-800">Strategic Functions</td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right text-slate-600">{stats.stratAvg}</td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right text-slate-600">{stats.weights.strategic}%</td>
              <td className="border-b p-3 text-right font-bold text-slate-900">{stats.stratWeighted.toFixed(2)}</td>
            </tr>
            <tr className="hover:bg-white/80">
              <td className="border-b border-r border-gray-200/50 p-3 font-medium text-slate-800">Support Functions</td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right text-slate-600">{stats.suppAvg}</td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right text-slate-600">{stats.weights.support}%</td>
              <td className="border-b p-3 text-right font-bold text-slate-900">{stats.suppWeighted.toFixed(2)}</td>
            </tr>
            <tr className="hover:bg-white/80">
              <td className="border-b border-r border-gray-200/50 p-3 font-medium text-slate-800">Other Functions</td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right text-slate-600">{stats.otherAvg}</td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right text-slate-600">{stats.weights.other}%</td>
              <td className="border-b p-3 text-right font-bold text-slate-900">{stats.otherWeighted.toFixed(2)}</td>
            </tr>
            
            <tr className="bg-blue-50/50 font-bold border-t-2 border-slate-300">
              <td className="border-b border-r border-gray-200/50 p-3 text-slate-900">FINAL RATING {data.hasDesignation && '(Base)'}</td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right"></td>
              <td className="border-b border-r border-gray-200/50 p-3 text-right">100%</td>
              <td className="border-b p-3 text-right text-lg text-blue-800">{stats.totalBase}</td>
            </tr>

            {data.hasDesignation && (
              <>
                 <tr className="bg-slate-50/30">
                    <td className="border-b border-r border-gray-200/50 p-3 text-slate-600 pl-8 italic">Base IPCR (70%)</td>
                    <td className="border-b border-r border-gray-200/50 p-3"></td>
                    <td className="border-b border-r border-gray-200/50 p-3"></td>
                    <td className="border-b p-3 text-right font-medium text-slate-700">{(stats.totalBase * 0.7).toFixed(2)}</td>
                 </tr>
                 <tr className="bg-slate-50/30">
                    <td className="border-b border-r border-gray-200/50 p-3 text-slate-600 pl-8 italic">Designation Rating (30%)</td>
                    <td className="border-b border-r border-gray-200/50 p-3 text-right text-slate-500">{stats.designationRating}</td>
                    <td className="border-b border-r border-gray-200/50 p-3"></td>
                    <td className="border-b p-3 text-right font-medium text-slate-700">{(stats.designationRating * 0.3).toFixed(2)}</td>
                 </tr>
                 <tr className="bg-indigo-50/50 font-extrabold border-t-2 border-indigo-200">
                    <td className="border-b border-r border-indigo-200/50 p-3 text-indigo-900">FINAL COMPOSITE RATING</td>
                    <td className="border-b border-r border-indigo-200/50 p-3"></td>
                    <td className="border-b border-r border-indigo-200/50 p-3"></td>
                    <td className="border-b p-3 text-right text-xl text-indigo-700">{stats.finalRating}</td>
                 </tr>
              </>
            )}

            <tr>
              <td className="p-4 font-bold text-right bg-yellow-50/50 text-slate-800" colSpan={3}>Adjectival Rating:</td>
              <td className="p-4 font-extrabold text-center bg-yellow-100/80 text-yellow-800 border-l border-yellow-200 shadow-inner tracking-wide uppercase">{getAdjectivalRating(stats.finalRating)}</td>
            </tr>
          </tbody>
        </table>

        {/* Signatories - Visual Only */}
        <div className="mt-12 grid grid-cols-3 gap-8 text-center text-sm break-inside-avoid">
           <div className="bg-white/30 p-4 rounded-lg border border-white/20">
             <p className="mb-8 font-bold text-slate-700 uppercase tracking-wide">Ratee</p>
             <div className="border-b-2 border-slate-400 mb-2 font-handwriting text-lg text-blue-900">{currentUser ? currentUser.name : '__________________'}</div>
             <p className="text-xs text-slate-500 font-semibold">Signature over Printed Name</p>
             <p className="text-xs text-slate-400 mt-1 font-medium">Date: {new Date().toLocaleDateString()}</p>
           </div>
           <div className="bg-white/30 p-4 rounded-lg border border-white/20">
             <p className="mb-8 font-bold text-slate-700 uppercase tracking-wide">Immediate Supervisor</p>
             <div className="border-b-2 border-slate-400 mb-2 font-handwriting text-lg text-blue-900">Dir. Maria Santos</div>
             <p className="text-xs text-slate-500 font-semibold">Signature over Printed Name</p>
             <p className="text-xs text-slate-400 mt-1 font-medium">Date: _____________</p>
           </div>
           <div className="bg-white/30 p-4 rounded-lg border border-white/20">
             <p className="mb-8 font-bold text-slate-700 uppercase tracking-wide">Approved By (VP/Pres)</p>
             <div className="border-b-2 border-slate-400 mb-2 font-handwriting text-lg text-blue-900">VP Roberto Garcia</div>
             <p className="text-xs text-slate-500 font-semibold">Signature over Printed Name</p>
             <p className="text-xs text-slate-400 mt-1 font-medium">Date: _____________</p>
           </div>
        </div>
      </div>
    </div>
  );
};