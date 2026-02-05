'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export default function ROICalculator() {
  const [dealsPerMonth, setDealsPerMonth] = useState(50);
  const [avgDealSize, setAvgDealSize] = useState(25000);
  const [hoursPerDeal, setHoursPerDeal] = useState(4);

  const calculations = useMemo(() => {
    const automatedTimePerDeal = 0.25;
    const hoursSavedPerDeal = hoursPerDeal - automatedTimePerDeal;
    const hoursSavedMonthly = Math.round(dealsPerMonth * hoursSavedPerDeal);
    
    const hourlyRate = 50;
    const yearlySavings = Math.round(hoursSavedMonthly * 12 * hourlyRate);
    
    const hoursPerMonth = 160;
    const manualCapacity = Math.floor(hoursPerMonth / hoursPerDeal);
    const automatedCapacity = Math.floor(hoursPerMonth / automatedTimePerDeal);
    const additionalDeals = Math.min(automatedCapacity - manualCapacity, Math.round(dealsPerMonth * 0.75));

    return {
      hoursSavedMonthly,
      yearlySavings,
      additionalDeals,
      automatedTime: '15 min',
    };
  }, [dealsPerMonth, avgDealSize, hoursPerDeal]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2Mmgtdjh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            ROI Calculator
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Calculate Your Savings
          </h2>
          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto">
            See exactly how much time and money automation saves your MCA business
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 p-6 md:p-10 backdrop-blur-xl shadow-2xl shadow-black/20"
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                Your Current Operations
              </h3>
              
              <div className="space-y-8">
                <div className="group">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-slate-300 font-medium">Deals Funded Per Month</label>
                    <span className="text-2xl font-bold text-white tabular-nums">{dealsPerMonth}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={dealsPerMonth}
                      onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer 
                        [&::-webkit-slider-thumb]:appearance-none 
                        [&::-webkit-slider-thumb]:w-5 
                        [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:bg-gradient-to-r 
                        [&::-webkit-slider-thumb]:from-cyan-400 
                        [&::-webkit-slider-thumb]:to-blue-500 
                        [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-cyan-500/30
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110"
                    />
                    <div 
                      className="absolute top-0 left-0 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full pointer-events-none"
                      style={{ width: `${((dealsPerMonth - 10) / (200 - 10)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>10</span>
                    <span>200</span>
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-slate-300 font-medium">Average Deal Size</label>
                    <span className="text-2xl font-bold text-white tabular-nums">{formatCurrency(avgDealSize)}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="1000"
                      value={avgDealSize}
                      onChange={(e) => setAvgDealSize(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer 
                        [&::-webkit-slider-thumb]:appearance-none 
                        [&::-webkit-slider-thumb]:w-5 
                        [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:bg-gradient-to-r 
                        [&::-webkit-slider-thumb]:from-violet-400 
                        [&::-webkit-slider-thumb]:to-purple-500 
                        [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-violet-500/30
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110"
                    />
                    <div 
                      className="absolute top-0 left-0 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full pointer-events-none"
                      style={{ width: `${((avgDealSize - 5000) / (100000 - 5000)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>$5k</span>
                    <span>$100k</span>
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-slate-300 font-medium">Hours Spent Per Deal (Manual)</label>
                    <span className="text-2xl font-bold text-white tabular-nums">{hoursPerDeal}h</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="0.5"
                      value={hoursPerDeal}
                      onChange={(e) => setHoursPerDeal(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer 
                        [&::-webkit-slider-thumb]:appearance-none 
                        [&::-webkit-slider-thumb]:w-5 
                        [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:bg-gradient-to-r 
                        [&::-webkit-slider-thumb]:from-amber-400 
                        [&::-webkit-slider-thumb]:to-orange-500 
                        [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-amber-500/30
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110"
                    />
                    <div 
                      className="absolute top-0 left-0 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full pointer-events-none"
                      style={{ width: `${((hoursPerDeal - 1) / (8 - 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>1h</span>
                    <span>8h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <motion.div 
                key={calculations.hoursSavedMonthly}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-emerald-300 font-medium">Hours Saved Monthly</span>
                  </div>
                  <p className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tabular-nums">
                    {calculations.hoursSavedMonthly}h
                  </p>
                </div>
              </motion.div>

              <motion.div 
                key={calculations.yearlySavings}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-violet-300 font-medium">Yearly Savings</span>
                  </div>
                  <p className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent tabular-nums">
                    {formatCurrency(calculations.yearlySavings)}
                  </p>
                </div>
              </motion.div>

              <motion.div 
                key={calculations.additionalDeals}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-300 font-medium">Additional Deal Capacity</span>
                  </div>
                  <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tabular-nums">
                    +{calculations.additionalDeals} deals/mo
                  </p>
                </div>
              </motion.div>

              <div className="relative mt-6">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/50 to-slate-700/50 rounded-xl" />
                <div className="relative text-center py-5 px-4 border border-slate-600/30 rounded-xl backdrop-blur-sm">
                  <p className="text-slate-400 text-sm mb-3">Processing time per deal</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-slate-500 line-through text-lg">{hoursPerDeal}h manual</span>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold text-xl">{calculations.automatedTime} automated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
