import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sliders,
  DollarSign,
  ShieldCheck,
  Zap,
  Flame,
  Award,
} from 'lucide-react';
import { SchoolProfile, CashAdvance, Transaction } from '../types';
import { formatPHP } from '../utils/taxCalculator';

interface QuarterlyMooeProjectionProps {
  school: SchoolProfile;
  cashAdvance: CashAdvance;
  transactions: Transaction[];
  onOpenNewTransaction?: () => void;
}

export const QuarterlyMooeProjection: React.FC<QuarterlyMooeProjectionProps> = ({
  school,
  cashAdvance,
  transactions,
  onOpenNewTransaction,
}) => {
  // Quarter selector (defaults to Q4: Oct, Nov, Dec)
  const [selectedQuarter, setSelectedQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q4');
  const [scenario, setScenario] = useState<'baseline' | 'austerity' | 'surge'>('baseline');
  const [quarterlyAllotment, setQuarterlyAllotment] = useState<number>(
    school.annualMooeAllocation ? school.annualMooeAllocation / 4 : 225000
  );

  // Current active month's total disbursed gross
  const currentDisbursedGross = transactions.reduce((sum, tx) => sum + tx.grossAmount, 0);

  // Quarter months definition
  const quarterMonthsMap = {
    Q1: ['January', 'February', 'March'],
    Q2: ['April', 'May', 'June'],
    Q3: ['July', 'August', 'September'],
    Q4: ['October', 'November', 'December'],
  };

  const months = quarterMonthsMap[selectedQuarter];

  // Calculate historical average spending
  // Current month actual is currentDisbursedGross
  // We use realistic historical priors or baseline cash advance
  const currentMonthActual = currentDisbursedGross;
  const historicalMonthlyAverage = Math.max(currentMonthActual, cashAdvance.amountGranted || 75000);

  // Scenario multipliers
  const multiplier = scenario === 'austerity' ? 0.85 : scenario === 'surge' ? 1.2 : 1.0;
  const projectedFutureMonthlyBurn = Math.round(historicalMonthlyAverage * multiplier);

  // Compute projection points for each month in the quarter
  // Month 1: October (Current Actual)
  // Month 2: November (Projected)
  // Month 3: December (Projected)
  const projectionData = useMemo(() => {
    // Starting balance at beginning of quarter
    const startingFund = quarterlyAllotment;

    // Month 1
    const m1Spend = currentMonthActual;
    const m1Remaining = Math.max(0, startingFund - m1Spend);

    // Month 2
    const m2Spend = projectedFutureMonthlyBurn;
    const m2Remaining = Math.max(0, m1Remaining - m2Spend);

    // Month 3
    const m3Spend = projectedFutureMonthlyBurn;
    const m3Remaining = Math.max(0, m2Remaining - m3Spend);

    return [
      {
        month: `${months[0]} (Actual)`,
        shortMonth: months[0].slice(0, 3),
        allotment: startingFund,
        monthlySpending: m1Spend,
        projectedRemaining: m1Remaining,
        safeThreshold: quarterlyAllotment * 0.15, // 15% emergency reserve
        isProjected: false,
      },
      {
        month: `${months[1]} (Projected)`,
        shortMonth: months[1].slice(0, 3),
        allotment: startingFund,
        monthlySpending: m2Spend,
        projectedRemaining: m2Remaining,
        safeThreshold: quarterlyAllotment * 0.15,
        isProjected: true,
      },
      {
        month: `${months[2]} (Projected)`,
        shortMonth: months[2].slice(0, 3),
        allotment: startingFund,
        monthlySpending: m3Spend,
        projectedRemaining: m3Remaining,
        safeThreshold: quarterlyAllotment * 0.15,
        isProjected: true,
      },
    ];
  }, [quarterlyAllotment, currentMonthActual, projectedFutureMonthlyBurn, months]);

  const endOfQuarterRemaining = projectionData[2].projectedRemaining;
  const isDeficitRisk = endOfQuarterRemaining <= quarterlyAllotment * 0.05;
  const totalQuarterSpend = projectionData.reduce((acc, curr) => acc + curr.monthlySpending, 0);
  const burnRatePerDay = Math.round(projectedFutureMonthlyBurn / 30);
  const remainingDaysRunway =
    burnRatePerDay > 0
      ? Math.round(
          (quarterlyAllotment - currentMonthActual) / (projectedFutureMonthlyBurn / 30)
        )
      : 90;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <div className="font-bold text-emerald-400 border-b border-slate-700 pb-1 flex items-center justify-between gap-4">
            <span>{data.month}</span>
            {data.isProjected ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                Forecasted
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Audited Actual
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Monthly Burn / Spend:</span>
            <span className="font-mono font-bold text-slate-100">
              {formatPHP(data.monthlySpending)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Projected Remaining MOOE:</span>
            <span className="font-mono font-bold text-emerald-400">
              {formatPHP(data.projectedRemaining)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
            <span>Safe Reserve Threshold:</span>
            <span className="font-mono text-slate-300">{formatPHP(data.safeThreshold)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 transition-all duration-300 hover:shadow-md">
      {/* Header with Title & Scenario Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-100 text-emerald-800 uppercase">
              Financial Intelligence · Recharts
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">
              {selectedQuarter} Forecast ({months.join(' - ')})
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Quarterly MOOE Spending &amp; Runway Projection</span>
            <span className="text-xs font-normal text-slate-500">
              (Historical Average Burn: {formatPHP(historicalMonthlyAverage)}/mo)
            </span>
          </h2>
        </div>

        {/* Controls: Quarter & Scenario Selection */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Quarter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setSelectedQuarter(q)}
                className={`cursor-pointer px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedQuarter === q
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Scenario Selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setScenario('baseline')}
              className={`cursor-pointer px-2.5 py-1 rounded-md font-medium transition-all ${
                scenario === 'baseline'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Based on actual monthly burn rate"
            >
              Baseline
            </button>
            <button
              type="button"
              onClick={() => setScenario('austerity')}
              className={`cursor-pointer px-2.5 py-1 rounded-md font-medium transition-all ${
                scenario === 'austerity'
                  ? 'bg-white text-emerald-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Austerity: -15% monthly burn"
            >
              Austerity (-15%)
            </button>
            <button
              type="button"
              onClick={() => setScenario('surge')}
              className={`cursor-pointer px-2.5 py-1 rounded-md font-medium transition-all ${
                scenario === 'surge'
                  ? 'bg-white text-amber-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Year-End Repairs & Closing Surge (+20%)"
            >
              Surge (+20%)
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Quarterly Fund Allocation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Quarterly MOOE Allotment</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {formatPHP(quarterlyAllotment)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Annual: {formatPHP(school.annualMooeAllocation || 900000)} (₱75k/mo)
          </div>
        </div>

        {/* Metric 2: Estimated Daily Burn Rate */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Projected Monthly Burn Velocity</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {formatPHP(projectedFutureMonthlyBurn)}
            <span className="text-xs text-slate-500 font-normal"> / mo</span>
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">
            ~ {formatPHP(burnRatePerDay)} / day operating velocity
          </div>
        </div>

        {/* Metric 3: Quarter-End Projected Balance */}
        <div
          className={`p-4 rounded-xl border ${
            isDeficitRisk
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold">Projected Balance at Quarter End</span>
            {isDeficitRisk ? (
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            )}
          </div>
          <div className="text-xl font-bold font-mono">
            {formatPHP(endOfQuarterRemaining)}
          </div>
          <div className="text-[11px] font-medium mt-0.5">
            {isDeficitRisk
              ? '⚠️ High depletion risk — adopt austerity measures'
              : `✓ Safe runway of ~${remainingDaysRunway} calendar days`}
          </div>
        </div>
      </div>

      {/* Main Recharts Line Graph Area */}
      <div className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={projectionData}
              margin={{ top: 15, right: 25, left: 20, bottom: 10 }}
            >
              <defs>
                <linearGradient id="remainingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="shortMonth"
                stroke="#64748b"
                tick={{ fontSize: 12, fontWeight: 600 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `₱${(val / 1000).toFixed(0)}k`}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
              />

              {/* Safe Emergency Reserve Threshold (15% of allotment) */}
              <ReferenceLine
                y={quarterlyAllotment * 0.15}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: 'Safe Reserve (15%)',
                  position: 'insideBottomRight',
                  fill: '#d97706',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              {/* Area under Remaining MOOE Balance */}
              <Area
                type="monotone"
                dataKey="projectedRemaining"
                name="Remaining MOOE Balance"
                stroke="#059669"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#remainingGrad)"
                dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: '#059669' }}
                activeDot={{ r: 7, stroke: '#047857', strokeWidth: 3 }}
              />

              {/* Monthly Spending Line */}
              <Line
                type="monotone"
                dataKey="monthlySpending"
                name="Monthly Spend / Burn"
                stroke="#2563eb"
                strokeWidth={2.5}
                strokeDasharray={scenario !== 'baseline' ? '5 5' : undefined}
                dot={{ r: 4, strokeWidth: 2, fill: '#ffffff', stroke: '#2563eb' }}
                activeDot={{ r: 6, stroke: '#1d4ed8' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advisory Note & System Developer Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Projections dynamically calibrate from actual disbursements in your Cash Disbursement Register (GAM Appendix 43).
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-md text-[11px]">
          <Award className="w-3.5 h-3.5 text-emerald-700" />
          <span>Architected by JASPER S. CAMPADO (AO-II &amp; System Developer)</span>
        </div>
      </div>
    </div>
  );
};
