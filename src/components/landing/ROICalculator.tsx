'use client';

import { useState, useMemo } from 'react';
import { DollarSign, Clock, TrendingUp, ArrowRight } from 'lucide-react';

export default function ROICalculator() {
  const [dealsPerMonth, setDealsPerMonth] = useState(50);
  const [avgDealSize, setAvgDealSize] = useState(25000);
  const [hoursPerDeal, setHoursPerDeal] = useState(4);

  const calculations = useMemo(() => {
    const automatedTimePerDeal = 0.25;
    const hoursSavedPerDeal = hoursPerDeal - automatedTimePerDeal;
    const hoursSavedMonthly = Math.round(dealsPerMonth * hoursSavedPerDeal);
    
    const hourlyRate = 35;
    const yearlySavings = Math.round(hoursSavedMonthly * 12 * hourlyRate);
    
    const additionalDeals = Math.round(dealsPerMonth * 0.74);

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

  const getSliderProgress = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <DollarSign className="w-4 h-4 text-green-500" />
            ROI Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Calculate Your Savings
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            See exactly how much time and money automation saves your MCA business
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-8">Your Current Operations</h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-600 text-sm font-medium">Deals Funded Per Month</label>
                  <span className="text-xl font-bold text-gray-900">{dealsPerMonth}</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-800 rounded-full"
                      style={{ width: `${getSliderProgress(dealsPerMonth, 10, 200)}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={dealsPerMonth}
                    onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                    style={{ margin: 0 }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow-md pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${getSliderProgress(dealsPerMonth, 10, 200)}% - 10px)` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>10</span>
                  <span>200</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-600 text-sm font-medium">Average Deal Size</label>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(avgDealSize)}</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-800 rounded-full"
                      style={{ width: `${getSliderProgress(avgDealSize, 5000, 100000)}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="1000"
                    value={avgDealSize}
                    onChange={(e) => setAvgDealSize(Number(e.target.value))}
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                    style={{ margin: 0 }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow-md pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${getSliderProgress(avgDealSize, 5000, 100000)}% - 10px)` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>$5k</span>
                  <span>$100k</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-gray-600 text-sm font-medium">Hours Spent Per Deal (Manual)</label>
                  <span className="text-xl font-bold text-gray-900">{hoursPerDeal}h</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-800 rounded-full"
                      style={{ width: `${getSliderProgress(hoursPerDeal, 1, 8)}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={hoursPerDeal}
                    onChange={(e) => setHoursPerDeal(Number(e.target.value))}
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                    style={{ margin: 0 }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow-md pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${getSliderProgress(hoursPerDeal, 1, 8)}% - 10px)` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>1h</span>
                  <span>8h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100/80 rounded-2xl p-6 border border-green-200/60">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-green-100 border border-green-200 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-green-700/80 text-sm font-medium">Hours Saved Monthly</span>
              </div>
              <p className="text-4xl font-bold text-green-600 ml-[52px]">{calculations.hoursSavedMonthly}h</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/80 rounded-2xl p-6 border border-purple-200/60">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-purple-100 border border-purple-200 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-purple-700/80 text-sm font-medium">Yearly Savings</span>
              </div>
              <p className="text-4xl font-bold text-purple-600 ml-[52px]">{formatCurrency(calculations.yearlySavings)}</p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-violet-100/80 rounded-2xl p-6 border border-violet-200/60">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-violet-100 border border-violet-200 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                </div>
                <span className="text-violet-700/80 text-sm font-medium">Additional Deal Capacity</span>
              </div>
              <p className="text-4xl font-bold text-violet-600 ml-[52px]">+{calculations.additionalDeals} deals/mo</p>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-400 text-sm mb-2">Processing time per deal</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-gray-400 line-through">{hoursPerDeal}h manual</span>
                <ArrowRight className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-semibold">{calculations.automatedTime} automated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
