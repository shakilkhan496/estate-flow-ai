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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <DollarSign className="w-4 h-4" />
            ROI Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Calculate Your Savings
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            See exactly how much time and money automation saves your MCA business
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-8">
              <h3 className="text-lg font-semibold text-gray-900">Your Current Operations</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-700 font-medium">Deals Funded Per Month</label>
                    <span className="text-xl font-bold text-gray-900">{dealsPerMonth}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={dealsPerMonth}
                    onChange={(e) => setDealsPerMonth(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>10</span>
                    <span>200</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-700 font-medium">Average Deal Size</label>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(avgDealSize)}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="1000"
                    value={avgDealSize}
                    onChange={(e) => setAvgDealSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>$5k</span>
                    <span>$100k</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-700 font-medium">Hours Spent Per Deal (Manual)</label>
                    <span className="text-xl font-bold text-gray-900">{hoursPerDeal}h</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={hoursPerDeal}
                    onChange={(e) => setHoursPerDeal(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>1h</span>
                    <span>8h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-green-700 font-medium">Hours Saved Monthly</span>
                </div>
                <p className="text-4xl font-bold text-green-600">{calculations.hoursSavedMonthly}h</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-purple-700 font-medium">Yearly Savings</span>
                </div>
                <p className="text-4xl font-bold text-purple-600">{formatCurrency(calculations.yearlySavings)}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-blue-700 font-medium">Additional Deal Capacity</span>
                </div>
                <p className="text-4xl font-bold text-blue-600">+{calculations.additionalDeals} deals/mo</p>
              </div>

              <div className="text-center pt-4 border-t border-gray-200 mt-4">
                <p className="text-gray-500 text-sm mb-2">Processing time per deal</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-gray-400 line-through">{hoursPerDeal}h manual</span>
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-semibold">{calculations.automatedTime} automated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
