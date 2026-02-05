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

  const sliderStyles = {
    base: "w-full h-3 rounded-full appearance-none cursor-pointer bg-slate-800/80 focus:outline-none",
    thumb: `
      [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:w-6 
      [&::-webkit-slider-thumb]:h-6 
      [&::-webkit-slider-thumb]:rounded-full 
      [&::-webkit-slider-thumb]:cursor-pointer
      [&::-webkit-slider-thumb]:border-2
      [&::-webkit-slider-thumb]:border-white/20
      [&::-webkit-slider-thumb]:transition-all
      [&::-webkit-slider-thumb]:duration-150
      [&::-webkit-slider-thumb]:hover:scale-110
      [&::-moz-range-thumb]:w-6
      [&::-moz-range-thumb]:h-6
      [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-thumb]:border-2
      [&::-moz-range-thumb]:border-white/20
      [&::-moz-range-thumb]:cursor-pointer
    `,
  };

  return (
    <section 
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #0f172a 0%, #020617 50%, #0f172a 100%)',
        fontSmooth: 'always',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)',
        }}
      />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#34d399',
            }}
          >
            <Sparkles className="w-4 h-4" />
            ROI Calculator
          </div>
          <h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Calculate Your Savings
          </h2>
          <p 
            className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto font-light tracking-wide"
            style={{ color: '#94a3b8' }}
          >
            See exactly how much time and money automation saves your MCA business
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl p-8 md:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-10">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3 tracking-wide">
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                    boxShadow: '0 0 12px rgba(34, 211, 238, 0.5)',
                  }}
                />
                Your Current Operations
              </h3>
              
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <label className="text-slate-300 font-medium tracking-wide">Deals Funded Per Month</label>
                    <span 
                      className="text-3xl font-bold tracking-tight"
                      style={{ 
                        color: '#22d3ee',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {dealsPerMonth}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={dealsPerMonth}
                    onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                    className={`${sliderStyles.base} ${sliderStyles.thumb} [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-cyan-400 [&::-webkit-slider-thumb]:to-cyan-600 [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(34,211,238,0.5)] [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-cyan-400 [&::-moz-range-thumb]:to-cyan-600`}
                    style={{
                      background: `linear-gradient(to right, #22d3ee ${((dealsPerMonth - 10) / (200 - 10)) * 100}%, rgba(30, 41, 59, 0.8) ${((dealsPerMonth - 10) / (200 - 10)) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-3 font-medium">
                    <span>10</span>
                    <span>200</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-5">
                    <label className="text-slate-300 font-medium tracking-wide">Average Deal Size</label>
                    <span 
                      className="text-3xl font-bold tracking-tight"
                      style={{ 
                        color: '#a78bfa',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {formatCurrency(avgDealSize)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="1000"
                    value={avgDealSize}
                    onChange={(e) => setAvgDealSize(Number(e.target.value))}
                    className={`${sliderStyles.base} ${sliderStyles.thumb} [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-violet-400 [&::-webkit-slider-thumb]:to-violet-600 [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(167,139,250,0.5)] [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-violet-400 [&::-moz-range-thumb]:to-violet-600`}
                    style={{
                      background: `linear-gradient(to right, #a78bfa ${((avgDealSize - 5000) / (100000 - 5000)) * 100}%, rgba(30, 41, 59, 0.8) ${((avgDealSize - 5000) / (100000 - 5000)) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-3 font-medium">
                    <span>$5k</span>
                    <span>$100k</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-5">
                    <label className="text-slate-300 font-medium tracking-wide">Hours Spent Per Deal (Manual)</label>
                    <span 
                      className="text-3xl font-bold tracking-tight"
                      style={{ 
                        color: '#fbbf24',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {hoursPerDeal}h
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={hoursPerDeal}
                    onChange={(e) => setHoursPerDeal(Number(e.target.value))}
                    className={`${sliderStyles.base} ${sliderStyles.thumb} [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-amber-600 [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(251,191,36,0.5)] [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-amber-400 [&::-moz-range-thumb]:to-amber-600`}
                    style={{
                      background: `linear-gradient(to right, #fbbf24 ${((hoursPerDeal - 1) / (8 - 1)) * 100}%, rgba(30, 41, 59, 0.8) ${((hoursPerDeal - 1) / (8 - 1)) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-3 font-medium">
                    <span>1h</span>
                    <span>8h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <motion.div 
                key={calculations.hoursSavedMonthly}
                initial={{ scale: 0.98, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-7"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-emerald-300 font-medium text-lg tracking-wide">Hours Saved Monthly</span>
                </div>
                <p 
                  className="text-5xl sm:text-6xl font-bold tracking-tight"
                  style={{ 
                    background: 'linear-gradient(135deg, #34d399 0%, #22d3ee 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {calculations.hoursSavedMonthly}h
                </p>
              </motion.div>

              <motion.div 
                key={calculations.yearlySavings}
                initial={{ scale: 0.98, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-7"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-violet-300 font-medium text-lg tracking-wide">Yearly Savings</span>
                </div>
                <p 
                  className="text-5xl sm:text-6xl font-bold tracking-tight"
                  style={{ 
                    background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatCurrency(calculations.yearlySavings)}
                </p>
              </motion.div>

              <motion.div 
                key={calculations.additionalDeals}
                initial={{ scale: 0.98, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-7"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-blue-300 font-medium text-lg tracking-wide">Additional Deal Capacity</span>
                </div>
                <p 
                  className="text-5xl sm:text-6xl font-bold tracking-tight"
                  style={{ 
                    background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  +{calculations.additionalDeals} deals/mo
                </p>
              </motion.div>

              <div 
                className="rounded-xl py-6 px-6 text-center mt-6"
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(71, 85, 105, 0.2)',
                }}
              >
                <p className="text-slate-400 text-sm mb-4 tracking-wide">Processing time per deal</p>
                <div className="flex items-center justify-center gap-5 flex-wrap">
                  <span className="text-slate-500 line-through text-xl font-medium">{hoursPerDeal}h manual</span>
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                  <span 
                    className="text-xl font-bold"
                    style={{ color: '#34d399' }}
                  >
                    {calculations.automatedTime} automated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
