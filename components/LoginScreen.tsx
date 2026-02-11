import React from 'react';

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-2xl max-w-md w-full text-center border-t-4 border-t-blue-600">
        <div className="mb-6 flex justify-center">
           <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white/50">
             ParSU
           </div>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">Welcome to ParSU IPCR</h1>
        <p className="text-slate-700 mb-8 font-medium text-base">Performance Commitment and Review System for Non-Teaching Personnel</p>
        
        <button 
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-slate-800 font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg border border-gray-200 group"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 group-hover:scale-110 transition-transform" alt="Google" />
          <span className="text-lg">Sign in with Google</span>
        </button>
        
        <div className="mt-8 border-t border-slate-200/60 pt-6">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            By signing in, you agree to allow the system to access your basic profile information.
            Important updates and IPCR notifications will be sent to your connected Gmail account.
          </p>
        </div>
      </div>
    </div>
  );
};