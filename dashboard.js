import React, { useState, useEffect } from 'react';
import { Line, Bar, LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import * as math from 'mathjs';

const TobackMicrohedgingDashboard = () => {
  // State for period selection
  const [activePeriod, setActivePeriod] = useState('all');
  
  // State for hedging scenario
  const [hedgingScenario, setHedgingScenario] = useState('normal');
  
  // Business parameters state
  const [params, setParams] = useState({
    numSMEs: 50,
    avgConsumption: 100000, // kWh
    premiumPercentage: 1.0, // 1%
    hedgingPercentage: 95, // 95% hedging coverage
    annualCarryCost: 5.0, // 5% annual carry cost
    savingsCommissionPercent: 5.0, // 5% commission on savings
    riskFreeRate: 0.03, // 3%
    timeToMaturity: 1, // 1 year
  });
  
  // Historical gas prices
  const allHistoricalGasPrices = [
    // 2019
    { date: "2019-01-01", price: 19.850 },
    { date: "2019-02-01", price: 17.815 },
    { date: "2019-03-01", price: 14.215 },
    { date: "2019-04-01", price: 14.390 },
    { date: "2019-05-01", price: 11.205 },
    { date: "2019-06-01", price: 10.115 },
    { date: "2019-07-01", price: 11.000 },
    { date: "2019-08-01", price: 12.795 },
    { date: "2019-09-01", price: 16.390 },
    { date: "2019-10-01", price: 16.135 },
    { date: "2019-11-01", price: 16.330 },
    { date: "2019-12-01", price: 12.050 },
    
    // 2020
    { date: "2020-01-01", price: 9.755 },
    { date: "2020-02-01", price: 8.875 },
    { date: "2020-03-01", price: 6.900 },
    { date: "2020-04-01", price: 6.220 },
    { date: "2020-05-01", price: 4.385 },
    { date: "2020-06-01", price: 6.165 },
    { date: "2020-07-01", price: 6.025 },
    { date: "2020-08-01", price: 11.240 },
    { date: "2020-09-01", price: 13.285 },
    { date: "2020-10-01", price: 14.060 },
    { date: "2020-11-01", price: 15.140 },
    { date: "2020-12-01", price: 19.125 },
    
    // 2021
    { date: "2021-01-01", price: 19.820 },
    { date: "2021-02-01", price: 15.695 },
    { date: "2021-03-01", price: 18.995 },
    { date: "2021-04-01", price: 23.285 },
    { date: "2021-05-01", price: 24.930 },
    { date: "2021-06-01", price: 34.620 },
    { date: "2021-07-01", price: 40.755 },
    { date: "2021-08-01", price: 50.340 },
    { date: "2021-09-01", price: 97.775 },
    { date: "2021-10-01", price: 64.865 },
    { date: "2021-11-01", price: 92.515 },
    { date: "2021-12-01", price: 70.345 },
    
    // 2022
    { date: "2022-01-01", price: 84.670 },
    { date: "2022-02-01", price: 98.595 },
    { date: "2022-03-01", price: 125.905 },
    { date: "2022-04-01", price: 99.450 },
    { date: "2022-05-01", price: 94.005 },
    { date: "2022-06-01", price: 144.515 },
    { date: "2022-07-01", price: 190.915 },
    { date: "2022-08-01", price: 239.905 },
    { date: "2022-09-01", price: 188.800 },
    { date: "2022-10-01", price: 123.350 },
    { date: "2022-11-01", price: 146.395 },
    { date: "2022-12-01", price: 76.315 },
    
    // 2023
    { date: "2023-01-01", price: 57.350 },
    { date: "2023-02-01", price: 46.665 },
    { date: "2023-03-01", price: 47.845 },
    { date: "2023-04-01", price: 38.540 },
    { date: "2023-05-01", price: 26.850 },
    { date: "2023-06-01", price: 37.103 },
    { date: "2023-07-01", price: 28.365 },
    { date: "2023-08-01", price: 35.030 },
    { date: "2023-09-01", price: 41.859 },
    { date: "2023-10-01", price: 48.005 },
    { date: "2023-11-01", price: 42.090 },
    { date: "2023-12-01", price: 32.350 },
    
    // 2024
    { date: "2024-01-01", price: 30.235 },
    { date: "2024-02-01", price: 24.865 },
    { date: "2024-03-01", price: 27.340 },
    { date: "2024-04-01", price: 29.120 },
    { date: "2024-05-01", price: 34.223 },
    { date: "2024-06-01", price: 34.480 },
    { date: "2024-07-01", price: 35.870 },
    { date: "2024-08-01", price: 39.825 },
    { date: "2024-09-01", price: 39.044 },
    { date: "2024-10-01", price: 40.588 },
    { date: "2024-11-01", price: 47.811 },
    { date: "2024-12-01", price: 48.889 }
  ];
  
  // Sort data by year for selection
  const dataByYear = {
    '2019': allHistoricalGasPrices.slice(0, 12),
    '2020': allHistoricalGasPrices.slice(12, 24),
    '2021': allHistoricalGasPrices.slice(24, 36),
    '2022': allHistoricalGasPrices.slice(36, 48),
    '2023': allHistoricalGasPrices.slice(48, 60),
    '2024': allHistoricalGasPrices.slice(60, 72),
    '2023-2024': allHistoricalGasPrices.slice(48, 72),
    'all': allHistoricalGasPrices
  };
  
  // Selected historical prices
  const [activeHistoricalPrices, setActiveHistoricalPrices] = useState(allHistoricalGasPrices);
  
  // Simulation results
  const [simulationResults, setSimulationResults] = useState({
    totalRevenue: 0,
    monthlyPremium: 0,
    profitMargin: 0,
    optionsCost: 0,
    initialInvestment: 0,
    hedgingPnL: 0,
    totalSavings: 0,
    avgSavingsPerSME: 0,
    monthlySavings: 0,
    percentSavings: 0,
    totalProfit: 0,
    totalClientValue: 0,
    savingsCommission: 0,
    totalEcosystemValue: 0,
    chartData: [],
    savingsData: []
  });
  
  // [enhancedStrategyData] will be generated from actual historical prices
  const [enhancedStrategyData, setEnhancedStrategyData] = useState([]);
  
  // Enhanced hedging statistics
  const [hedgingStats, setHedgingStats] = useState({
    stdDevStandard: 0,
    stdDevEnhanced: 0,
    volatilityReduction: 0,
    peakReduction: 0
  });
  
  // Create enhanced hedging data from actual historical prices
  useEffect(() => {
    if (activeHistoricalPrices.length === 0) return;
    
    // Generate strategy data from historical prices using the models from new_hedging.js
    const generatedData = activeHistoricalPrices.map(item => {
      const spotPrice = item.price;
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      
      // Calculate standard market price (with standard markup)
      const marketMarkup = 0.15; // 15% markup
      const marketFixedCost = 5; // €5/MWh fixed cost
      const standardPrice = spotPrice * (1 + marketMarkup) + marketFixedCost;
      
      // Calculate enhanced price based on the selected scenario, following the model in new_hedging.js
      let enhancedPrice;
      if (hedgingScenario === 'normal') {
        // Normal scenario: Standard hedging as in the original model
        enhancedPrice = calculateSMECost(spotPrice);
      } else {
        // Advanced protection: Enhanced hedging that better handles extreme prices
        // This follows the pattern in new_hedging.js where prices were capped
        if (spotPrice > 80) {
          // Apply stronger dampening on very high prices
          enhancedPrice = Math.min(60, standardPrice * 0.85);
        } else if (spotPrice > 50) {
          // Apply moderate dampening on high prices
          enhancedPrice = Math.min(spotPrice * 0.7 + 15, standardPrice * 0.9);
        } else if (spotPrice < 15) {
          // Apply floor on very low prices
          enhancedPrice = Math.min(32, standardPrice * 0.95);
        } else {
          // For normal range, use standard calculation
          enhancedPrice = calculateSMECost(spotPrice);
        }
      }
      
      // Ensure our price is always competitive with market price
      enhancedPrice = Math.min(enhancedPrice, standardPrice * 0.98);
      
      return {
        month,
        date: item.date,
        spotPrice,
        standardPrice,
        enhancedPrice
      };
    });
    
    setEnhancedStrategyData(generatedData);
    
    // Calculate statistics from the generated data
    const standardPrices = generatedData.map(d => d.standardPrice);
    const enhancedPrices = generatedData.map(d => d.enhancedPrice);
    
    const stdDevStandard = calculateStandardDeviation(standardPrices);
    const stdDevEnhanced = calculateStandardDeviation(enhancedPrices);
    
    const maxStandard = Math.max(...standardPrices);
    const maxEnhanced = Math.max(...enhancedPrices);
    
    const volatilityReduction = ((stdDevStandard - stdDevEnhanced) / stdDevStandard * 100);
    const peakReduction = ((maxStandard - maxEnhanced) / maxStandard * 100);
    
    setHedgingStats({
      stdDevStandard,
      stdDevEnhanced,
      volatilityReduction,
      peakReduction
    });
  }, [activeHistoricalPrices, hedgingScenario]);
  
  // Update active historical prices when period changes
  useEffect(() => {
    setActiveHistoricalPrices(dataByYear[activePeriod] || allHistoricalGasPrices);
  }, [activePeriod]);
  
  // Run simulation when parameters or active prices change
  useEffect(() => {
    runSimulation();
  }, [params, activeHistoricalPrices, hedgingScenario]);
  
  // Format numbers for display
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 2,
    }).format(num);
  };
  
  // Format currency for display
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(num);
  };
  
  // Calculate standard deviation
  const calculateStandardDeviation = (values) => {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  };
  
  // Black-Scholes model functions
  const normalCDF = (x) => {
    return (1 + math.erf(x / Math.sqrt(2))) / 2;
  };
  
  const callOptionPrice = (spotPrice, strikePrice, timeToMaturity, riskFreeRate, volatility) => {
    if (timeToMaturity <= 0) return Math.max(0, spotPrice - strikePrice);
    
    const d1 = (Math.log(spotPrice / strikePrice) + (riskFreeRate + volatility * volatility / 2) * timeToMaturity) / (volatility * Math.sqrt(timeToMaturity));
    const d2 = d1 - volatility * Math.sqrt(timeToMaturity);
    
    const nd1 = normalCDF(d1);
    const nd2 = normalCDF(d2);
    
    return spotPrice * nd1 - strikePrice * Math.exp(-riskFreeRate * timeToMaturity) * nd2;
  };
  
  const putOptionPrice = (spotPrice, strikePrice, timeToMaturity, riskFreeRate, volatility) => {
    if (timeToMaturity <= 0) return Math.max(0, strikePrice - spotPrice);
    
    const call = callOptionPrice(spotPrice, strikePrice, timeToMaturity, riskFreeRate, volatility);
    return call + strikePrice * Math.exp(-riskFreeRate * timeToMaturity) - spotPrice;
  };
  
  // Calculate SME cost with alpha=0.65 and beta=20 €/MWh fixed
  // Ensuring the cost is competitive with market prices
  const calculateSMECost = (futurePrice) => {
    const alpha = 0.65;
    const beta = 20;
    
    // Calculate standard market price (for comparison)
    const marketMarkup = 0.15; // 15% markup
    const marketFixedCost = 5; // €5/MWh fixed cost
    const standardMarketPrice = futurePrice * (1 + marketMarkup) + marketFixedCost;
    
    // Calculate our base price
    const basePrice = alpha * futurePrice + beta;
    
    // Ensure our price is never higher than market price
    return Math.min(basePrice, standardMarketPrice * 0.98); // 2% below market price at minimum
  };
  
  // Enhanced hedging function for the improved strategy
  const calculateEnhancedHedgingPnL = (
    historicalPrices,
    contractPrice,
    consumption,
    timeToMaturity,
    riskFreeRate,
    volatility,
    hedgingPercentage,
    annualCarryCost
  ) => {
    // For enhanced hedging, we implement the multi-level strategy described in new_hedging.js
    const baseHedgingPercentage = hedgingScenario === 'normal' ? 50 : 50;
    const shockHedgingPercentage = hedgingScenario === 'normal' ? 0 : 30;
    
    // Apply the base hedging percentage to consumption
    const baseHedgedConsumption = consumption * (baseHedgingPercentage / 100);
    
    // Apply shock hedging (additional) only in extreme scenario
    const shockHedgedConsumption = consumption * (shockHedgingPercentage / 100);
    
    // Define barriers for barrier options
    const upperBarrier = 70; // Upper barrier at 70€
    const lowerBarrier = 20; // Lower barrier at 20€
    
    // Calculate initial option costs for base strategy
    const baseStrikePrice = contractPrice;
    const initialCallPrice = callOptionPrice(
      contractPrice,
      baseStrikePrice,
      timeToMaturity,
      riskFreeRate,
      volatility
    );
    
    const initialPutPrice = putOptionPrice(
      contractPrice,
      baseStrikePrice,
      timeToMaturity,
      riskFreeRate,
      volatility
    );
    
    // Calculate initial costs for barrier options (simplified model - in reality barrier options are more complex)
    // We assume barrier options cost 60% of regular options as they are more targeted
    const barrierOptionMultiplier = 0.6;
    const initialBarrierCallPrice = initialCallPrice * barrierOptionMultiplier;
    const initialBarrierPutPrice = initialPutPrice * barrierOptionMultiplier;
    
    // Total option costs
    const baseOptionsCost = (initialCallPrice + initialPutPrice) * baseHedgedConsumption;
    const shockOptionsCost = (initialBarrierCallPrice + initialBarrierPutPrice) * shockHedgedConsumption;
    const totalOptionsCost = baseOptionsCost + shockOptionsCost;
    
    // Array for monthly mark-to-market data
    const monthlyData = [];
    
    // Calculate monthly mark-to-market values
    for (let i = 0; i < historicalPrices.length; i++) {
      const currentPrice = historicalPrices[i];
      const monthsElapsed = i;
      const remainingMonths = Math.max(0, 12 - monthsElapsed);
      const remainingTime = remainingMonths / 12;
      
      // Base strategy MtM calculations
      const baseSwapMtM = (contractPrice - currentPrice) * baseHedgedConsumption;
      
      // Calculate base options MtM
      let baseOptionsMtM = 0;
      
      if (remainingTime <= 0) {
        // At expiry, use intrinsic value
        const callPayoff = Math.max(0, currentPrice - baseStrikePrice) * baseHedgedConsumption;
        const putPayoff = Math.max(0, baseStrikePrice - currentPrice) * baseHedgedConsumption;
        baseOptionsMtM = callPayoff + putPayoff - baseOptionsCost;
      } else {
        // Before expiry, use Black-Scholes valuation
        const currentCallPrice = callOptionPrice(
          currentPrice,
          baseStrikePrice,
          remainingTime,
          riskFreeRate,
          volatility
        );
        
        const currentPutPrice = putOptionPrice(
          currentPrice,
          baseStrikePrice,
          remainingTime,
          riskFreeRate,
          volatility
        );
        
        baseOptionsMtM = (currentCallPrice + currentPutPrice) * baseHedgedConsumption - baseOptionsCost;
      }
      
      // Shock strategy calculations - only active if price exceeds barriers
      let shockSwapMtM = 0;
      let shockOptionsMtM = 0;
      
      if (hedgingScenario === 'extreme') {
        // Progressive coverage based on price levels
        let dynamicHedgingMultiplier = 1.0;
        
        if (currentPrice > 90) dynamicHedgingMultiplier = 1.4; // 70% coverage
        else if (currentPrice > 60) dynamicHedgingMultiplier = 1.2; // 50% coverage
        else if (currentPrice > 40) dynamicHedgingMultiplier = 1.0; // 30% coverage
        
        // Barrier option logic - only active within price ranges
        const isAboveUpperBarrier = currentPrice > upperBarrier;
        const isBelowLowerBarrier = currentPrice < lowerBarrier;
        
        if (isAboveUpperBarrier) {
          // Upper barrier protection
          shockSwapMtM = (upperBarrier - currentPrice) * shockHedgedConsumption * dynamicHedgingMultiplier;
          
          // Simplified barrier option payout
          if (remainingTime <= 0) {
            shockOptionsMtM = Math.max(0, currentPrice - upperBarrier) * shockHedgedConsumption * dynamicHedgingMultiplier - shockOptionsCost;
          } else {
            const barrierAdjustment = 1 - Math.exp(-0.5 * Math.pow((currentPrice - upperBarrier)/upperBarrier, 2));
            shockOptionsMtM = barrierAdjustment * shockHedgedConsumption * currentPrice * 0.2 - shockOptionsCost;
          }
        } else if (isBelowLowerBarrier) {
          // Lower barrier protection
          shockSwapMtM = (lowerBarrier - currentPrice) * shockHedgedConsumption;
          
          // Simplified barrier option payout
          if (remainingTime <= 0) {
            shockOptionsMtM = Math.max(0, lowerBarrier - currentPrice) * shockHedgedConsumption - shockOptionsCost;
          } else {
            const barrierAdjustment = 1 - Math.exp(-0.5 * Math.pow((lowerBarrier - currentPrice)/lowerBarrier, 2));
            shockOptionsMtM = barrierAdjustment * shockHedgedConsumption * currentPrice * 0.2 - shockOptionsCost;
          }
        } else {
          // Between barriers - options have time value but no intrinsic value
          shockOptionsMtM = -shockOptionsCost * (1 - (remainingTime / timeToMaturity));
        }
      }
      
      // Calculate cumulative carry cost
      const baseCarryCost = i > 0 ? baseOptionsCost * (annualCarryCost * (i / 12)) : 0;
      const shockCarryCost = i > 0 ? shockOptionsCost * (annualCarryCost * (i / 12)) : 0;
      const totalCarryCost = baseCarryCost + shockCarryCost;
      
      // Total mark-to-market value
      const totalMtM = baseSwapMtM + baseOptionsMtM + shockSwapMtM + shockOptionsMtM - totalCarryCost;
      
      monthlyData.push({
        baseSwapMtM,
        baseOptionsMtM,
        shockSwapMtM,
        shockOptionsMtM,
        totalCarryCost,
        totalMtM
      });
    }
    
    // Calculate monthly P&L (changes in MtM value)
    const pnlSeries = [];
    const pnlComponents = [];
    
    for (let i = 1; i < monthlyData.length; i++) {
      const current = monthlyData[i];
      const previous = monthlyData[i-1];
      
      // Monthly MtM changes = monthly P&L
      const baseSwapPnL = current.baseSwapMtM - previous.baseSwapMtM;
      const baseOptionPnL = current.baseOptionsMtM - previous.baseOptionsMtM;
      const shockSwapPnL = current.shockSwapMtM - previous.shockSwapMtM;
      const shockOptionPnL = current.shockOptionsMtM - previous.shockOptionsMtM;
      const carryPnL = previous.totalCarryCost - current.totalCarryCost; // Sign inverted as it's a cost
      
      const swapPayoff = baseSwapPnL + shockSwapPnL;
      const optionPayoff = baseOptionPnL + shockOptionPnL;
      const netPnL = swapPayoff + optionPayoff + carryPnL;
      
      pnlSeries.push(netPnL);
      pnlComponents.push({
        swapPayoff,
        optionPayoff,
        carryPnL,
        netPnL
      });
    }
    
    return {
      pnlSeries,
      pnlComponents,
      monthlyData,
      optionPrices: {
        call: initialCallPrice,
        put: initialPutPrice,
        barrierCall: initialBarrierCallPrice,
        barrierPut: initialBarrierPutPrice
      },
      totalCost: totalOptionsCost
    };
  };
  
  // Calculate cumulative savings compared to standard market prices
  const calculateCumulativeSavings = (historicalPrices, avgConsumptionMWh, numSMEs, savingsCommissionPercent) => {
    // Standard market markup (15% above spot price + 5€/MWh fixed costs)
    const marketMarkup = 0.15;
    const marketFixedCost = 5;
    
    const savings = [];
    let cumulativeSaving = 0;
    let cumulativeCommission = 0;
    
    for (let i = 0; i < historicalPrices.length; i++) {
      const spotPrice = historicalPrices[i];
      
      // Standard market price with markup
      const standardMarketPrice = spotPrice * (1 + marketMarkup) + marketFixedCost;
      
      // Our price with the microhedging model
      let ourPrice;
      if (hedgingScenario === 'normal') {
        ourPrice = calculateSMECost(spotPrice);
      } else {
        // In extreme scenario, use the enhanced hedging price ceiling
        if (spotPrice > 70) {
          ourPrice = Math.min(60, standardMarketPrice * 0.95); // Price ceiling with enhanced hedging, but always below market
        } else if (spotPrice < 20) {
          ourPrice = Math.min(32, standardMarketPrice * 0.95); // Price floor with enhanced hedging, but always below market
        } else {
          ourPrice = calculateSMECost(spotPrice);
        }
      }
      
      // Ensure our price is never higher than the market price (at least 2% discount)
      ourPrice = Math.min(ourPrice, standardMarketPrice * 0.98);
      
      // Calculate monthly savings: (market price - our price) * total consumption
      // Ensure savings are never negative
      const priceDifference = Math.max(0, standardMarketPrice - ourPrice);
      const monthlySaving = priceDifference * avgConsumptionMWh * numSMEs; // No need to divide by 1000 as avgConsumptionMWh is already in MWh
      
      // Calculate commission on savings (only if positive)
      let monthlyCommission = 0;
      if (monthlySaving > 0) {
        monthlyCommission = monthlySaving * (savingsCommissionPercent / 100);
      }
      
      cumulativeSaving += monthlySaving;
      cumulativeCommission += monthlyCommission;
      
      savings.push({
        monthSaving: monthlySaving,
        cumulativeSaving: cumulativeSaving,
        monthlyCommission: monthlyCommission,
        cumulativeCommission: cumulativeCommission,
        marketPrice: standardMarketPrice,
        ourPrice: ourPrice,
        date: new Date(activeHistoricalPrices[i].date)
      });
    }
    
    return savings;
  };
  
  // Run simulation with current parameters
  const runSimulation = () => {
    const historicalPrices = activeHistoricalPrices.map(item => item.price);
    const historicalDates = activeHistoricalPrices.map(item => item.date);
    
    // Calculate volatility
    const volatility = calculateStandardDeviation(historicalPrices.map((price, i, arr) => {
      if (i === 0) return 0;
      return Math.log(price / arr[i-1]);
    })) * Math.sqrt(12); // Annualize monthly volatility
    
    // Initial contract price (first price in historical data)
    const contractPrice = historicalPrices[0];
    
    // Calculate SME costs
    const smeCosts = historicalPrices.map(price => calculateSMECost(price));
    
    // Convert consumption from kWh to MWh
    const avgConsumptionMWh = params.avgConsumption / 1000;
    const totalConsumptionMWh = params.numSMEs * avgConsumptionMWh;
    
    // Calculate hedging P&L with enhanced implementation
    const hedgingResult = calculateEnhancedHedgingPnL(
      historicalPrices,
      contractPrice,
      totalConsumptionMWh,
      params.timeToMaturity,
      params.riskFreeRate,
      volatility,
      params.hedgingPercentage,
      params.annualCarryCost / 100
    );
    
    // Use monthly data from hedging implementation
    const monthlyData = hedgingResult.monthlyData;
    const hedgingPnL = hedgingResult.pnlSeries;
    const hedgingComponents = hedgingResult.pnlComponents;
    const optionPrices = hedgingResult.optionPrices;
    
    // Calculate savings for SMEs including commission
    const savingsData = calculateCumulativeSavings(
      historicalPrices,
      avgConsumptionMWh,
      params.numSMEs,
      params.savingsCommissionPercent
    );
    
    // Extract monthly savings commissions
    const monthlySavingsCommission = savingsData.map(item => item.monthlyCommission);
    const totalSavingsCommission = savingsData.length > 0 ? savingsData[savingsData.length - 1].cumulativeCommission : 0;
    
    // Calculate business model P&L with enhanced implementation, including savings commission
    const businessPnL = [];
    const premiumRevenueByMonth = [];
    const commissionRevenueByMonth = [];
    
    for (let i = 1; i < historicalPrices.length; i++) {
      const futurePrice = historicalPrices[i];
      let smeCost;
      
      // Apply enhanced pricing in extreme scenario
      if (hedgingScenario === 'extreme' && futurePrice > 70) {
        smeCost = 60; // Price ceiling
      } else if (hedgingScenario === 'extreme' && futurePrice < 20) {
        smeCost = 32; // Price floor
      } else {
        smeCost = calculateSMECost(futurePrice);
      }
      
      const totalEnergyValue = smeCost * totalConsumptionMWh;
      const premium = totalEnergyValue * (params.premiumPercentage / 100);
      premiumRevenueByMonth.push(premium);
      
      // Use hedging P&L from calculation
      const hedgingMonthlyPnL = i > 1 ? hedgingPnL[i-2] : 0;
      
      // Add savings commission (only for months with available data)
      const savingsCommission = i <= monthlySavingsCommission.length ? monthlySavingsCommission[i-1] : 0;
      commissionRevenueByMonth.push(savingsCommission);
      
      const monthlyPnL = premium + hedgingMonthlyPnL + savingsCommission;
      businessPnL.push(monthlyPnL);
    }
    
    // Calculate cumulative P&L
    const cumulativeBusinessPnL = [];
    let runningBusinessTotal = 0;
    for (const pnl of businessPnL) {
      runningBusinessTotal += pnl;
      cumulativeBusinessPnL.push(runningBusinessTotal);
    }
    
    // Calculate initial investment (option cost)
    const initialInvestment = hedgingResult.totalCost;
    
    // Calculate profit margin
    const profitMargin = cumulativeBusinessPnL.length > 0
      ? (cumulativeBusinessPnL[cumulativeBusinessPnL.length - 1] / initialInvestment) * 100
      : 0;
    
    // Prepare data for charts
    const chartData = historicalDates.slice(1).map((date, i) => {
      const mtmIndex = i + 1;
      return {
        date,
        gasPrice: historicalPrices[mtmIndex],
        smeCost: smeCosts[mtmIndex],
        hedgingMtM: monthlyData[mtmIndex]?.totalMtM || 0,
        hedgingPnL: hedgingPnL[i] || 0,
        businessPnL: businessPnL[i] || 0,
        cumulativeBusinessPnL: cumulativeBusinessPnL[i] || 0,
        swapPayoff: hedgingComponents[i]?.swapPayoff || 0,
        optionPayoff: hedgingComponents[i]?.optionPayoff || 0,
        carryCost: hedgingComponents[i]?.carryPnL || 0,
        premiumRevenue: premiumRevenueByMonth[i] || 0,
        commissionRevenue: commissionRevenueByMonth[i] || 0
      };
    });
    
    // Calculate average monthly premium
    const avgMonthlyPremium = premiumRevenueByMonth.reduce((sum, premium) => sum + premium, 0) / premiumRevenueByMonth.length;
    
    // Calculate total and average savings
    const totalSavings = savingsData.length > 0 ? savingsData[savingsData.length - 1].cumulativeSaving : 0;
    const avgSavingsPerSME = totalSavings / params.numSMEs;
    const avgMonthlySavings = totalSavings / savingsData.length;
    
    // Calculate average percentage savings
    let avgPercentSavings = 0;
    if (savingsData.length > 0) {
      avgPercentSavings = savingsData.reduce((sum, item) => {
        return sum + ((item.marketPrice - item.ourPrice) / item.marketPrice) * 100;
      }, 0) / savingsData.length;
    }
    
    // Calculate total ecosystem values
    const totalProfit = runningBusinessTotal;
    const totalClientValue = totalSavings - totalSavingsCommission; // Actual value for clients is savings minus commission
    const totalEcosystemValue = totalProfit + totalClientValue;
    
    // Update simulation results
    setSimulationResults({
      totalRevenue: runningBusinessTotal,
      monthlyPremium: avgMonthlyPremium,
      profitMargin: profitMargin,
      optionsCost: optionPrices.call + optionPrices.put,
      initialInvestment: initialInvestment,
      hedgingPnL: monthlyData[monthlyData.length - 1]?.totalMtM || 0,
      totalSavings: totalSavings,
      avgSavingsPerSME: avgSavingsPerSME,
      monthlySavings: avgMonthlySavings,
      percentSavings: avgPercentSavings,
      totalProfit: totalProfit,
      totalClientValue: totalClientValue,
      savingsCommission: totalSavingsCommission,
      totalEcosystemValue: totalEcosystemValue,
      chartData: chartData,
      savingsData: savingsData
    });
  };
  
  // Handler for period selection
  const handlePeriodChange = (period) => {
    setActivePeriod(period);
  };
  
  // Handler for parameter changes
  const handleParamChange = (param, value) => {
    setParams(prevParams => ({
      ...prevParams,
      [param]: value
    }));
  };
  
  // Format dates for charts
  const getFormattedDates = (data) => {
    return data.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2, 2)}`;
    });
  };
  
  // Format dates for savings chart
  const getFormattedSavingsDates = (data) => {
    return data.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2, 2)}`;
    });
  };
  
  return (
    <div className="bg-gray-100 font-sans">
      <div className="container mx-auto p-6">
        <header className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-blue-600">Toback Microhedging Business Model</h1>
          <p className="text-gray-600 mt-2">
            Business simulation dashboard with historical data (2019-2024)
          </p>
          <p className="text-blue-600 font-semibold mt-2">
            Current period: {activePeriod === 'all' ? 'All Years (2019-2024)' : activePeriod}
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Business Parameters</h2>
            
            {/* Period selector */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Simulation Period:</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handlePeriodChange('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activePeriod === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  All Years
                </button>
                <button 
                  onClick={() => handlePeriodChange('2019')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activePeriod === '2019' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  2019
                </button>
                <button 
                  onClick={() => handlePeriodChange('2020')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activePeriod === '2020' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  2020
                </button>
                <button 
                  onClick={() => handlePeriodChange('2021')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activePeriod === '2021' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  2021
                </button>
                <button 
                  onClick={() => handlePeriodChange('2022')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activePeriod === '2022' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  2022
                </button>
                <button 
                  onClick={() => handlePeriodChange('2023')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activePeriod === '2023' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  2023
                </button>
                <button 
                  onClick={() => handlePeriodChange('2024')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activePeriod === '2024' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  2024
                </button>
                <button 
                  onClick={() => handlePeriodChange('2023-2024')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activePeriod === '2023-2024' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  2023-2024
                </button>
              </div>
            </div>
            
            {/* Enhanced Hedging Strategy Selector */}
            <div className="mb-6 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800 mb-2">Enhanced Hedging Strategy</h3>
              <div className="flex gap-4 mb-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="normal-scenario" 
                    name="scenario" 
                    checked={hedgingScenario === 'normal'} 
                    onChange={() => setHedgingScenario('normal')}
                    className="mr-2"
                  />
                  <label htmlFor="normal-scenario">Base Protection</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="extreme-scenario" 
                    name="scenario" 
                    checked={hedgingScenario === 'extreme'} 
                    onChange={() => setHedgingScenario('extreme')}
                    className="mr-2"
                  />
                  <label htmlFor="extreme-scenario">Advanced Protection</label>
                </div>
              </div>
              <div className="text-xs text-blue-700">
                Analysis based on actual historical data with different protection levels
              </div>
            </div>
            
            {/* Parameter sliders */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">
                  Number of SMEs: <span className="font-semibold">{formatNumber(params.numSMEs)}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={params.numSMEs}
                  onChange={(e) => handleParamChange('numSMEs', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">
                  Average Consumption (kWh): <span className="font-semibold">{formatNumber(params.avgConsumption)}</span>
                </label>
                <input
                  type="range"
                  min="50000"
                  max="500000"
                  step="10000"
                  value={params.avgConsumption}
                  onChange={(e) => handleParamChange('avgConsumption', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">
                  Premium Percentage: <span className="font-semibold">{formatNumber(params.premiumPercentage)}%</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={params.premiumPercentage}
                  onChange={(e) => handleParamChange('premiumPercentage', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">
                  Hedging Coverage: <span className="font-semibold">{formatNumber(params.hedgingPercentage)}%</span>
                </label>
                <input
                  type="range"
                  min="25"
                  max="100"
                  step="5"
                  value={params.hedgingPercentage}
                  onChange={(e) => handleParamChange('hedgingPercentage', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">
                  Annual Carry Cost: <span className="font-semibold">{formatNumber(params.annualCarryCost)}%</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={params.annualCarryCost}
                  onChange={(e) => handleParamChange('annualCarryCost', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              {/* Savings Commission slider */}
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-sm font-semibold mb-2 text-blue-700">Additional Revenue Streams</h3>
                <div>
                  <label className="block mb-1 font-medium">
                    Savings Commission: <span className="font-semibold">{formatNumber(params.savingsCommissionPercent)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={params.savingsCommissionPercent}
                    onChange={(e) => handleParamChange('savingsCommissionPercent', Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Commission percentage on actual savings generated for SMEs</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Business Performance</h2>
            
            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="text-2xl font-bold">{formatCurrency(simulationResults.totalRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">Total revenue for the period</p>
              </div>
              
              <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Monthly Premium</h3>
                <p className="text-2xl font-bold">{formatCurrency(simulationResults.monthlyPremium)}</p>
                <p className="text-xs text-gray-500 mt-1">Average monthly premium</p>
              </div>
              
              <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Profit Margin</h3>
                <p className={`text-2xl font-bold ${simulationResults.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatNumber(simulationResults.profitMargin)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Overall profit margin</p>
              </div>
            </div>
            
            {/* Enhanced Hedging Strategy Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Enhanced Hedging Strategy</h3>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>Strategy:</div>
                  <div className="font-semibold">Multi-level with barrier options</div>
                  
                  <div>Volatility reduction:</div>
                  <div className="font-semibold text-green-600">{formatNumber(hedgingStats.volatilityReduction)}%</div>
                  
                  <div>Peak price reduction:</div>
                  <div className="font-semibold text-green-600">{formatNumber(hedgingStats.peakReduction)}%</div>
                  
                  <div>Protection level:</div>
                  <div className="font-semibold">
                    {hedgingScenario === 'normal' ? 'Standard' : 'Enhanced'}
                  </div>
                </div>
                
                <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                  <div>Options Cost: {formatCurrency(simulationResults.optionsCost)} per MWh</div>
                  <div>Initial Investment: {formatCurrency(simulationResults.initialInvestment)}</div>
                  <div>Hedging P&L: 
                    <span className={simulationResults.hedgingPnL >= 0 ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                      {formatCurrency(simulationResults.hedgingPnL)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-green-50">
                <h3 className="text-sm font-medium text-green-800 mb-2">Savings Generated for SMEs</h3>
                <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                  <div>Total Savings: 
                    <span className="text-lg font-semibold text-green-600 ml-1">
                      {formatCurrency(simulationResults.totalSavings)}
                    </span>
                  </div>
                  <div>Average Savings per SME: 
                    <span className="text-lg font-semibold text-green-600 ml-1">
                      {formatCurrency(simulationResults.avgSavingsPerSME)}
                    </span>
                  </div>
                  <div>Average Monthly Savings: 
                    <span className="font-semibold ml-1">
                      {formatCurrency(simulationResults.monthlySavings)}
                    </span>
                  </div>
                  <div>Average Savings %: 
                    <span className="font-semibold ml-1">
                      {formatNumber(simulationResults.percentSavings)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Summary metrics */}
            <div className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Profit & Savings - Summary</h3>
              <div className="mt-2 text-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-3 bg-blue-50">
                  <h4 className="font-bold text-blue-800">Business Profit</h4>
                  <p className="text-2xl font-bold">{formatCurrency(simulationResults.totalProfit)}</p>
                  <p className="text-xs text-gray-600 mt-1">Net profit after hedging costs</p>
                </div>
                <div className="border rounded-lg p-3 bg-green-50">
                  <h4 className="font-bold text-green-800">SMEs Value Generated</h4>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(simulationResults.totalClientValue)}</p>
                  <p className="text-xs text-gray-600 mt-1">Total savings for all clients</p>
                </div>
                <div className="border rounded-lg p-3 bg-yellow-50">
                  <h4 className="font-bold text-yellow-800">Savings Commission</h4>
                  <p className="text-2xl font-bold text-yellow-700">{formatCurrency(simulationResults.savingsCommission)}</p>
                  <p className="text-xs text-gray-600 mt-1">Commission earned on savings</p>
                </div>
                <div className="border rounded-lg p-3 bg-purple-50">
                  <h4 className="font-bold text-purple-800">Total Value Generated</h4>
                  <p className="text-2xl font-bold text-purple-700">{formatCurrency(simulationResults.totalEcosystemValue)}</p>
                  <p className="text-xs text-gray-600 mt-1">Total ecosystem value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts section */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Enhanced Hedging Strategy chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Enhanced Hedging Strategy Performance</h2>
            <div className="flex mb-4">
              <div className="flex-1 text-sm bg-blue-50 p-2 rounded mr-2">
                <span className="font-semibold">Analysis based on selected historical data</span>
                <p className="text-xs text-gray-600">
                  {hedgingScenario === 'normal' ? 
                    'Base Protection: optimized hedging for normal market conditions' : 
                    'Advanced Protection: increased coverage against extreme price shocks (with additional costs)'}
                </p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enhancedStrategyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={item => {
                      const date = new Date(item.date);
                      return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2, 2)}`;
                    }} 
                    tick={{fontSize: 12}}
                  />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip 
                    formatter={(value, name) => {
                      return [`€${value.toFixed(2)}`, name];
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="spotPrice" 
                    name="Gas spot price" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="standardPrice" 
                    name="Standard market price" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="enhancedPrice" 
                    name="Price with enhanced strategy" 
                    stroke="#10B981" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Revenue Streams Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Revenue Streams Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simulationResults.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={item => {
                    const date = new Date(item.date);
                    return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2, 2)}`;
                  }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="premiumRevenue" name="Premium Revenue" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="commissionRevenue" name="Savings Commission" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="hedgingPnL" name="Hedging P&L" stackId="a" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Hedging Components */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Hedging Strategy Components</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simulationResults.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={item => {
                    const date = new Date(item.date);
                    return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2, 2)}`;
                  }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="swapPayoff" name="Gas Swap Payoff" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="optionPayoff" name="Options Payoff" stackId="a" fill="#6366F1" />
                  <Bar dataKey="carryCost" name="Carry Cost" stackId="a" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Cumulative Performance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Cumulative Business Performance</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationResults.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={item => {
                    const date = new Date(item.date);
                    return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2, 2)}`;
                  }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeBusinessPnL" 
                    name="Cumulative Business P&L" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    fill="#e3f2fd"
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hedgingMtM" 
                    name="Hedging Mark-to-Market" 
                    stroke="#6366F1" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Monthly P&L */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Monthly P&L Analysis</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simulationResults.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={item => {
                    const date = new Date(item.date);
                    return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2, 2)}`;
                  }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="businessPnL" name="Monthly Business P&L" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Savings chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Savings Generated for SMEs</h2>
            <div className="flex mb-4">
              <div className="flex-1 text-sm bg-gray-100 p-2 rounded mr-2">
                <span className="font-semibold">Standard Market vs Our Model Prices</span>
                <p className="text-xs text-gray-600">Comparison between standard market price and our microhedged price</p>
              </div>
              <div className="flex-1 text-sm bg-gray-100 p-2 rounded">
                <span className="font-semibold">Generated Savings</span>
                <p className="text-xs text-gray-600">Cumulative savings for all SMEs in the selected period</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={simulationResults.savingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={item => {
                    const date = new Date(item.date);
                    return `${date.getMonth()+1}/${date.getFullYear().toString().substr(2, 2)}`;
                  }} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="marketPrice" 
                    name="Standard Market Price (€/MWh)" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="ourPrice" 
                    name="Our Price (€/MWh)" 
                    stroke="#10B981" 
                    strokeWidth={2}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="cumulativeSaving" 
                    name="Cumulative Savings (€)" 
                    fill="#6366F1" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>Toback Microhedging Business Model Dashboard © 2025</p>
          <p className="mt-1">Using historical gas prices from January 2019 to December 2024</p>
        </footer>
      </div>
    </div>
  );
};

export default TobackMicrohedgingDashboard;
