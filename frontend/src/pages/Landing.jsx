import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckSquare, FiPieChart, FiSearch, FiSliders, FiBell } from 'react-icons/fi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="h-20 max-w-7xl mx-auto w-full px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-premium">
            <FiCheckSquare className="w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-slate-900">
            TaskFlow <span className="text-indigo-650">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-soft"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 pt-16 pb-24 flex flex-col items-center justify-center text-center relative">
        {/* Glow Decorator */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
          Simplify Your Workflow
        </span>
        
        <h2 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-slate-900 mt-6 tracking-tight max-w-4xl leading-tight">
          Supercharge Your Productivity with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">TaskFlow AI</span>
        </h2>
        
        <p className="text-lg text-slate-500 mt-6 max-w-2xl leading-relaxed">
          A sleek, modern, full-stack task management platform built to help you plan, organize, prioritize, and track your daily workflows with real-time stats.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all duration-200 shadow-premium group text-base"
          >
            Get Started Free
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="bg-white text-slate-700 font-semibold px-8 py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-soft text-base"
          >
            Live Demo
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          <div className="bg-white/60 backdrop-blur border border-slate-200/60 p-8 rounded-3xl shadow-soft text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-indigo-50 border border-indigo-100 w-fit rounded-2xl mb-6">
              <FiPieChart className="w-6 h-6 text-indigo-650" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-slate-900">Dashboard Metrics</h3>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Analyze your project rates and status divisions directly with real-time interactive stat cards.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur border border-slate-200/60 p-8 rounded-3xl shadow-soft text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-amber-50 border border-amber-100 w-fit rounded-2xl mb-6">
              <FiSearch className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-slate-900">Smart Filter & Search</h3>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Find files instantly using query parameters for priorities, categories, due dates, and completion status.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur border border-slate-200/60 p-8 rounded-3xl shadow-soft text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-rose-50 border border-rose-100 w-fit rounded-2xl mb-6">
              <FiBell className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-slate-900">Due Reminders</h3>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Never miss a deadline. Receive notifications for due and overdue tasks right on your workspace.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/80 py-8 px-6 text-center text-xs text-slate-400 mt-auto">
        &copy; {new Date().getFullYear()} TaskFlow AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
