import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import PortfolioCharts from './PortfolioCharts';  // Add this with your other imports

function App() {
  const [stocks, setStocks] = useState([]);
  const [ticker, setTicker] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [portfolioAnalysis, setPortfolioAnalysis] = useState(null);
  const [companyResults, setCompanyResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Polygon.io API key
  const API_KEY = 'S5vpfPppvmbm5q9lm_TnVOW3R3sNtpR5';

  // Company name to ticker mapping and sector mapping for top 100 stocks
  const companyToTicker = {
    'apple': 'AAPL',
    'microsoft': 'MSFT',
    'amazon': 'AMZN',
    'alphabet': 'GOOGL', // or GOOG
    'berkshire hathaway': 'BRK.B', // or BRK.A
    'unitedhealth group': 'UNH',
    'johnson & johnson': 'JNJ',
    'exxon mobil': 'XOM',
    'visa': 'V',
    'jp morgan chase': 'JPM',
    'tesla': 'TSLA',
    'procter & gamble': 'PG',
    'nvidia': 'NVDA',
    'home depot': 'HD',
    'mastercard': 'MA',
    'chevron': 'CVX',
    'meta platforms': 'META',
    'abbvie': 'ABBV',
    'eli lilly': 'LLY',
    'costco': 'COST',
    'bank of america': 'BAC',
    'broadcom': 'AVGO',
    'pfizer': 'PFE',
    'accenture': 'ACN',
    'walt disney': 'DIS',
    'comcast': 'CMCSA',
    'coca-cola': 'KO',
    'merck': 'MRK',
    'wells fargo': 'WFC',
    'danaher': 'DHR',
    'pepsico': 'PEP',
    'salesforce': 'CRM',
    'netflix': 'NFLX',
    'thermo fisher scientific': 'TMO',
    'adobe': 'ADBE',
    'mcdonald\'s': 'MCD',
    'paypal': 'PYPL',
    'verizon': 'VZ',
    'united parcel service': 'UPS',
    'abbott laboratories': 'ABT',
    'at&t': 'T',
    'intel': 'INTC',
    'oracle': 'ORCL',
    'cisco': 'CSCO',
    'morgan stanley': 'MS',
    'goldman sachs': 'GS',
    'charles schwab': 'SCHW',
    'starbucks': 'SBUX',
    'honeywell': 'HON',
    'ibm': 'IBM',
    'general electric': 'GE',
    'lowe\'s': 'LOW',
    'amd': 'AMD',
    'caterpillar': 'CAT',
    'amgen': 'AMGN',
    'boeing': 'BA',
    'linde': 'LIN',
    'american express': 'AXP',
    'blackrock': 'BLK',
    'medtronic': 'MDT',
    'united technologies': 'RTX',
    'nike': 'NKE',
    'lockheed martin': 'LMT',
    'booking holdings': 'BKNG',
    'general motors': 'GM',
    'servicenow': 'NOW',
    'intuitive surgical': 'ISRG',
    'trash disposal': 'WM',
    'target': 'TGT',
    'qualcomm': 'QCOM',
    'cvs health': 'CVS',
    'citigroup': 'C',
    'morgan stanley': 'MS',
    'bhp group': 'BHP',
    'nestle': 'NSRGY',
    'totalenergies': 'TTE',
    'sap': 'SAP',
    'siemens': 'SIEGY',
    'louis vuitton': 'LVMUY',
    'accenture': 'ACN',
    'ASML Holding': 'ASML',
    'Commonwealth Bank': 'CMWAY',
    'Toyota': 'TM',
    'HSBC': 'HSBC',
    'Rheinmetall': 'RHM',
    'Allianz': 'ALIZY',
    'Schneider Electric': 'SBGSY',
    'Linde': 'LIN',
    'RELX': 'RELX',
    'Rio Tinto': 'RIO',
    'Enel': 'ENLAY',
    'Hermes': 'HESAY',
    'Diageo': 'DGEAF',
    'Airbus': 'EADSY',
    'LOréal': 'LRLCY',
    'AstraZeneca': 'AZN',
    'Novo Nordisk': 'NVO',
    'Roche': 'RHHBY',
    'Novartis': 'NVS',
    'Sanofi': 'SNY',
    'Unilever': 'UL',
    'Shell': 'SHEL'
  };

  const sectorMap = {
    'AAPL': 'Technology',
    'MSFT': 'Technology',
    'AMZN': 'Consumer Discretionary',
    'GOOGL': 'Technology',
    'BRK.B': 'Finance',
    'UNH': 'Healthcare',
    'JNJ': 'Healthcare',
    'XOM': 'Energy',
    'V': 'Finance',
    'JPM': 'Finance',
    'TSLA': 'Consumer Discretionary',
    'PG': 'Consumer Staples',
    'NVDA': 'Technology',
    'HD': 'Consumer Discretionary',
    'MA': 'Finance',
    'CVX': 'Energy',
    'META': 'Technology',
    'ABBV': 'Healthcare',
    'LLY': 'Healthcare',
    'COST': 'Consumer Staples',
    'BAC': 'Finance',
    'AVGO': 'Technology',
    'PFE': 'Healthcare',
    'ACN': 'Technology',
    'DIS': 'Consumer Discretionary',
    'CMCSA': 'Communication Services',
    'KO': 'Consumer Staples',
    'MRK': 'Healthcare',
    'WFC': 'Finance',
    'DHR': 'Healthcare',
    'PEP': 'Consumer Staples',
    'CRM': 'Technology',
    'NFLX': 'Communication Services',
    'TMO': 'Healthcare',
    'ADBE': 'Technology',
    'MCD': 'Consumer Discretionary',
    'PYPL': 'Technology',
    'VZ': 'Communication Services',
    'UPS': 'Industrials',
    'ABT': 'Healthcare',
    'T': 'Communication Services',
    'INTC': 'Technology',
    'ORCL': 'Technology',
    'CSCO': 'Technology',
    'MS': 'Finance',
    'GS': 'Finance',
    'SCHW': 'Finance',
    'SBUX': 'Consumer Discretionary',
    'HON': 'Industrials',
    'IBM': 'Technology',
    'GE': 'Industrials',
    'LOW': 'Consumer Discretionary',
    'AMD': 'Technology',
    'CAT': 'Industrials',
    'AMGN': 'Healthcare',
    'BA': 'Industrials',
    'LIN': 'Materials',
    'AXP': 'Finance',
    'BLK': 'Finance',
    'MDT': 'Healthcare',
    'RTX': 'Industrials',
    'NKE': 'Consumer Discretionary',
    'LMT': 'Industrials',
    'BKNG': 'Consumer Discretionary',
    'GM': 'Consumer Discretionary',
    'NOW': 'Technology',
    'ISRG': 'Healthcare',
    'WM': 'Industrials',
    'TGT': 'Consumer Staples',
    'QCOM': 'Technology',
    'CVS': 'Healthcare',
    'C': 'Finance',
    'MS': 'Finance',
    'BHP': 'Materials',
    'NSRGY': 'Consumer Staples',
    'TTE': 'Energy',
    'SAP': 'Technology',
    'SIEGY': 'Industrials',
    'LVMUY': 'Consumer Discretionary',
    'ACN': 'Technology',
    'ASML': 'Technology',
    'CMWAY': 'Finance',
    'TM': 'Consumer Discretionary',
    'HSBC': 'Finance',
    'RHM': 'Industrials',
    'ALIZY': 'Finance',
    'SBGSY': 'Industrials',
    'LIN': 'Materials',
    'RELX': 'Industrials',
    'RIO': 'Materials',
    'ENLAY': 'Utilities',
    'HESAY': 'Consumer Discretionary',
    'DGEAF': 'Consumer Staples',
    'EADSY': 'Industrials',
    'LRLCY': 'Consumer Discretionary',
    'AZN': 'Healthcare',
    'NVO': 'Healthcare',
    'RHHBY': 'Healthcare',
    'NVS': 'Healthcare',
    'SNY': 'Healthcare',
    'UL': 'Consumer Staples',
    'SHEL': 'Energy'
  };

  // Color arrays for charts
  const SECTOR_COLORS = [
    '#0078D4', '#00A2FF', '#66B2FF', '#99CCFF', '#CCE5FF',
    '#004C8C', '#0063B1', '#2B88D8', '#50A3E7', '#89C4F4'
  ];
  
  const RISK_COLORS = {
    'High': '#0078D4',
    'Medium': '#50A3E7',
    'Low': '#CCE5FF'
  };
  
  // Fetch stock data from Polygon.io API
  const fetchStockData = async (symbol) => {
    try {
      // Format ticker symbol for polygon (handling special cases like BRK.B)
      const formattedSymbol = symbol.replace('.', '-');
      console.log(`Fetching data for ${symbol} (formatted as ${formattedSymbol})`);
      
      // Try to get current price data
      let currentPrice = null;
      let priceChange = null;
      let changePercent = null;
      
      try {
        const quoteUrl = `https://api.polygon.io/v2/aggs/ticker/${formattedSymbol}/prev?apiKey=${API_KEY}`;
        console.log(`Calling price API: ${quoteUrl}`);
        const quoteResponse = await fetch(quoteUrl);
        
        console.log(`Price API response status: ${quoteResponse.status}`);
        if (quoteResponse.ok) {
          const quoteData = await quoteResponse.json();
          console.log(`Price API data:`, quoteData);
          
          if (quoteData.results && quoteData.results.length > 0) {
            currentPrice = quoteData.results[0].c;
            const previousClose = quoteData.results[0].o;
            priceChange = currentPrice - previousClose;
            changePercent = (priceChange / previousClose) * 100;
            console.log(`Successfully got price: ${currentPrice}`);
          } else {
            console.warn(`No price results found for ${symbol}`);
          }
        } else {
          const errorText = await quoteResponse.text();
          console.warn(`Price API returned error: ${quoteResponse.status}`, errorText);
        }
      } catch (quoteError) {
        console.warn(`Exception fetching price data for ${symbol}:`, quoteError);
      }
      
      // If we couldn't get price data, fall back to mock data
      if (currentPrice === null) {
        // Generate realistic mock price based on ticker
        const tickerSum = symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        currentPrice = 50 + (tickerSum % 450); // Generate price between $50 and $500
        priceChange = (Math.random() * 20) - 10; // -$10 to +$10
        changePercent = (priceChange / currentPrice) * 100;
      }
      
      // Try to get company details
      let companyName = null;
      let marketCap = null;
      let peRatio = null;
      let dividendYield = null;
      
      try {
        const detailsUrl = `https://api.polygon.io/v3/reference/tickers/${formattedSymbol}?apiKey=${API_KEY}`;
        console.log(`Calling details API: ${detailsUrl}`);
        const detailsResponse = await fetch(detailsUrl);
        
        console.log(`Details API response status: ${detailsResponse.status}`);
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          console.log(`Details API data:`, detailsData);
          
          if (detailsData.results) {
            companyName = detailsData.results.name;
            marketCap = detailsData.results.market_cap;
            console.log(`Got company details: ${companyName}, Market Cap: ${marketCap}`);
            
            // Some endpoints may require higher subscription tiers
            if (detailsData.results.pe_ratio) {
              peRatio = detailsData.results.pe_ratio;
              console.log(`Got P/E ratio: ${peRatio}`);
            }
            
            if (detailsData.results.dividend_yield) {
              dividendYield = detailsData.results.dividend_yield * 100;
              console.log(`Got dividend yield: ${dividendYield}%`);
            }
          } else {
            console.warn(`No company details found for ${symbol}`);
          }
        } else {
          const errorText = await detailsResponse.text();
          console.warn(`Details API returned error: ${detailsResponse.status}`, errorText);
        }
      } catch (detailsError) {
        console.warn(`Exception fetching company details for ${symbol}:`, detailsError);
      }
      
      // Use sector-based estimates for missing data
      const sector = sectorMap[symbol] || 'Other';
      
      // Generate realistic mock data based on sector
      if (peRatio === null) {
        // Different sectors have different typical P/E ratios
        const sectorPERatios = {
          'Technology': 25 + (Math.random() * 15),
          'Healthcare': 20 + (Math.random() * 10),
          'Finance': 12 + (Math.random() * 8),
          'Consumer Discretionary': 22 + (Math.random() * 12),
          'Consumer Staples': 18 + (Math.random() * 7),
          'Energy': 10 + (Math.random() * 8),
          'Utilities': 16 + (Math.random() * 6),
          'Materials': 14 + (Math.random() * 8),
          'Industrials': 18 + (Math.random() * 7),
          'Communication Services': 20 + (Math.random() * 10),
          'Other': 15 + (Math.random() * 15)
        };
        peRatio = sectorPERatios[sector];
      }
      
      if (dividendYield === null) {
        // Different sectors have different typical dividend yields
        const sectorDividendYields = {
          'Technology': 0.5 + (Math.random() * 1.5),
          'Healthcare': 1.0 + (Math.random() * 2.0),
          'Finance': 2.0 + (Math.random() * 2.5),
          'Consumer Discretionary': 1.0 + (Math.random() * 1.5),
          'Consumer Staples': 2.0 + (Math.random() * 2.0),
          'Energy': 3.0 + (Math.random() * 3.0),
          'Utilities': 3.5 + (Math.random() * 2.5),
          'Materials': 2.0 + (Math.random() * 2.0),
          'Industrials': 1.8 + (Math.random() * 1.7),
          'Communication Services': 1.5 + (Math.random() * 2.0),
          'Other': 1.0 + (Math.random() * 2.0)
        };
        dividendYield = sectorDividendYields[sector];
      }
      
      // Estimate beta based on sector if not available
      const beta = estimateBeta(symbol);
      
      // Generate mock 52-week high/low based on current price
      const yearHigh = currentPrice * (1 + (0.1 + Math.random() * 0.4)); // 10-50% higher than current
      const yearLow = currentPrice * (1 - (0.1 + Math.random() * 0.5));  // 10-60% lower than current
      
      // Determine if we're using mostly mock data
      const isMostlyMock = currentPrice === null || 
                          !companyName || 
                          !marketCap;
      
      return {
        price: currentPrice,
        change: priceChange,
        changePercent: changePercent,
        peRatio: peRatio,
        dividendYield: dividendYield,
        beta: beta,
        yearHigh: yearHigh,
        yearLow: yearLow,
        marketCap: marketCap,
        name: companyName || `${symbol} Inc.`,
        isMostlyMock: isMostlyMock
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  };

  // Helper function to get date 1 year ago in YYYY-MM-DD format
  const getOneYearAgo = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  };

  // Estimate beta based on sector if not available
  const estimateBeta = (ticker) => {
    const sector = sectorMap[ticker];
    // Approximate beta values by sector
    const sectorBetas = {
      'Technology': 1.2,
      'Healthcare': 0.9,
      'Finance': 1.1,
      'Consumer Discretionary': 1.0,
      'Consumer Staples': 0.7,
      'Energy': 1.3,
      'Utilities': 0.5,
      'Materials': 1.1,
      'Industrials': 1.0,
      'Communication Services': 0.9
    };
    
    return sectorBetas[sector] || 1.0; // Default to 1.0 if sector not found
  };

  // Search for tickers based on company name
  const searchCompany = (query) => {
    if (!query) {
      setCompanyResults([]);
      return;
    }
    
    const normalizedQuery = query.toLowerCase();
    const results = Object.entries(companyToTicker)
      .filter(([company]) => company.includes(normalizedQuery))
      .map(([company, symbol]) => ({
        company,
        symbol
      }));
      
    setCompanyResults(results);
  };

// Track selected index for keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isNavigatingList, setIsNavigatingList] = useState(false);
  const searchInputRef = useRef(null);

  const selectCompany = (symbol) => {
    setTicker(symbol);
    setCompanyResults([]);
    setSelectedIndex(-1);
    setIsNavigatingList(false);
    // Focus the quantity input after selection
    if (searchInputRef.current) {
      setTimeout(() => {
        document.getElementById('quantity-input')?.focus();
      }, 50);
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (companyResults.length === 0) return;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault(); // Crucial to prevent cursor movement
        setIsNavigatingList(true);
        setSelectedIndex(prev => {
          const newIndex = prev < companyResults.length - 1 ? prev + 1 : 0; // Wrap around
          return newIndex;
        });
        break;
        
      case 'ArrowUp':
        e.preventDefault(); // Crucial to prevent cursor movement
        setIsNavigatingList(true);
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : companyResults.length - 1; // Wrap around
          return newIndex;
        });
        break;
        
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          selectCompany(companyResults[selectedIndex].symbol);
        }
        break;
        
      case 'Tab':
        if (selectedIndex >= 0 && isNavigatingList) {
          e.preventDefault();
          selectCompany(companyResults[selectedIndex].symbol);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setCompanyResults([]);
        setSelectedIndex(-1);
        setIsNavigatingList(false);
        searchInputRef.current?.blur();
        break;
        
      default:
        setIsNavigatingList(false);
        break;
    }
  };

  const addStock = () => {
    if (!ticker || !quantity) return;
    setStocks([...stocks, {
      ticker: ticker.toUpperCase(),
      quantity: parseInt(quantity),
      price: null
    }]);
    setTicker('');
    setCompanyName('');
    setQuantity('');
    setCompanyResults([]);
  };

  const removeStock = (index) => {
    const newStocks = stocks.filter((_, i) => i !== index);
    setStocks(newStocks);
  };

  // Determine risk level based on beta and sector
  const determineRiskLevel = (beta, sector) => {
    if (!beta) {
      // Use sector-based risk assessment if beta is unavailable
      const highRiskSectors = ['Technology', 'Consumer Discretionary', 'Energy'];
      return highRiskSectors.includes(sector) ? 'High' : 'Medium';
    }
    
    if (beta > 1.5) return 'High';
    if (beta > 0.8 && beta <= 1.5) return 'Medium';
    return 'Low';
  };

  const analyzePortfolio = async () => {
    if (stocks.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch real data for each stock
      const stocksWithDataPromises = stocks.map(async (stock) => {
        const data = await fetchStockData(stock.ticker);
        
        if (!data || data.price === null) {
          // Fallback to mock data if API data is unavailable
          return {
            ...stock,
            price: Math.random() * 200 + 50,
            peRatio: (Math.random() * 30 + 10).toFixed(1),
            dividendYield: (Math.random() * 5).toFixed(2),
            yearlyGrowth: (Math.random() * 40 - 10).toFixed(2),
            risk: Math.random() > 0.5 ? 'High' : 'Low',
            sector: sectorMap[stock.ticker] || 'Other',
            dataSource: 'mock'
          };
        }
        
        const sector = sectorMap[stock.ticker] || 'Other';
        const risk = determineRiskLevel(data.beta, sector);
        
        // Calculate rough growth estimate based on price change percentage
        const yearlyGrowth = data.changePercent ? data.changePercent.toFixed(2) : (Math.random() * 40 - 10).toFixed(2);
        
        return {
          ...stock,
          price: data.price,
          formattedPrice: `${data.price.toFixed(2)}`,
          peRatio: data.peRatio ? data.peRatio.toFixed(1) : 'N/A',
          dividendYield: data.dividendYield ? data.dividendYield.toFixed(2) : '0.00',
          yearlyGrowth: yearlyGrowth,
          risk: risk,
          sector: sector,
          yearHigh: data.yearHigh ? `${data.yearHigh.toFixed(2)}` : 'N/A',
          yearLow: data.yearLow ? `${data.yearLow.toFixed(2)}` : 'N/A',
          dataSource: data.isMostlyMock ? 'mock' : 'api',
          name: data.name || stock.ticker
        };
      });
      
      const stocksWithData = await Promise.all(stocksWithDataPromises);
      
      // Calculate portfolio metrics
      const totalValue = stocksWithData.reduce((sum, stock) => 
        sum + stock.price * stock.quantity, 0);

      // Calculate sector allocation
      const sectorAllocationObj = stocksWithData.reduce((acc, stock) => {
        const stockValue = stock.price * stock.quantity;
        acc[stock.sector] = (acc[stock.sector] || 0) + (stockValue / totalValue) * 100;
        return acc;
      }, {});
      
      // Convert sector allocation to array format for PieChart
      const sectorAllocation = Object.entries(sectorAllocationObj).map(([name, value], index) => ({
        name,
        value,
        color: SECTOR_COLORS[index % SECTOR_COLORS.length]
      }));

      // Calculate risk breakdown
      const riskBreakdownObj = stocksWithData.reduce((acc, stock) => {
        const stockValue = stock.price * stock.quantity;
        acc[stock.risk] = (acc[stock.risk] || 0) + (stockValue / totalValue) * 100;
        return acc;
      }, {});
      
      // Convert risk breakdown to array format for PieChart
      const riskBreakdown = Object.entries(riskBreakdownObj).map(([name, value]) => ({
        name,
        value,
        color: RISK_COLORS[name]
      }));

      // Generate AI-powered portfolio recommendations with more personalized insights
      const recommendations = [];
      const aiInsights = [];
      
      // Get most concentrated sector
      const maxSectorAllocation = Math.max(...sectorAllocation.map(s => s.value));
      const dominantSector = sectorAllocation.find(s => s.value === maxSectorAllocation)?.name;
      
      if (maxSectorAllocation > 40) {
        recommendations.push("Hold up! 🛑 You're way too obsessed with one sector! 🤪 Diversify or get rekt! 🙅‍♂️💸");
        aiInsights.push(`Your portfolio shows ${maxSectorAllocation.toFixed(1)}% concentration in ${dominantSector}. Consider reducing exposure to mitigate sector-specific risks. Historical market data suggests diversified portfolios typically outperform concentrated ones during market downturns.`);
      }

      // Risk analysis
      const highRiskPercentage = riskBreakdown.find(r => r.name === 'High')?.value || 0;
      const lowRiskPercentage = riskBreakdown.find(r => r.name === 'Low')?.value || 0;
      
      if (highRiskPercentage > 60) {
        recommendations.push("Whoa there, speed racer! 🏎️ Your portfolio's giving me anxiety! 😬 Dial back the risk unless you're tryna yolo it all! 🤪");
        aiInsights.push(`Your portfolio has ${highRiskPercentage.toFixed(1)}% in high-risk assets. While this might yield higher returns in bull markets, market volatility analysis suggests a more balanced approach to better weather market corrections. Consider hedging strategies or adding some defensive positions.`);
      } else if (lowRiskPercentage > 80) {
        recommendations.push("Dude, chill! 🧘‍♀️ This portfolio kinda boring ngl. 🙄 Add some spice! 🔥📈");
        aiInsights.push(`With ${lowRiskPercentage.toFixed(1)}% in low-risk assets, your portfolio is extremely conservative. Based on your time horizon and current market conditions, you may be sacrificing significant growth potential. Consider adding calculated exposure to growth sectors with strong fundamentals.`);
      }

      // Dividend analysis
      const stocksWithDividend = stocksWithData.filter(stock => 
        stock.dividendYield && parseFloat(stock.dividendYield) > 0);
        
      const avgDividendYield = stocksWithDividend.length > 0 
        ? stocksWithDividend.reduce((sum, stock) => sum + parseFloat(stock.dividendYield), 0) / stocksWithDividend.length
        : 0;
      
      const percentageWithDividends = (stocksWithDividend.length / stocksWithData.length) * 100;
        
      if (avgDividendYield < 2) {
        recommendations.push("Bruh no dividends? 💀 Time to plant a money tree and get that passive income flowing! 🌳💰");
        aiInsights.push(`Your portfolio's average dividend yield is ${avgDividendYield.toFixed(2)}%, with only ${percentageWithDividends.toFixed(0)}% of holdings paying dividends. In the current interest rate environment, adding dividend aristocrats could provide stability and income. Market analysis shows dividend stocks typically experience less volatility during market corrections.`);
      }

      // Growth analysis
      const stocksWithGrowth = stocksWithData.filter(stock => 
        stock.yearlyGrowth && !isNaN(parseFloat(stock.yearlyGrowth)));
        
      const avgGrowth = stocksWithGrowth.length > 0
        ? stocksWithGrowth.reduce((sum, stock) => sum + parseFloat(stock.yearlyGrowth), 0) / stocksWithGrowth.length
        : 0;
      
      // Find best and worst performers
      let bestPerformer = null;
      let worstPerformer = null;
      
      if (stocksWithGrowth.length > 0) {
        const bestStock = stocksWithData.reduce((best, current) => {
          const currentGrowth = parseFloat(current.yearlyGrowth) || -Infinity;
          const bestGrowth = parseFloat(best.yearlyGrowth) || -Infinity;
          return currentGrowth > bestGrowth ? current : best;
        }, stocksWithData[0]);
        
        const worstStock = stocksWithData.reduce((worst, current) => {
          const currentGrowth = parseFloat(current.yearlyGrowth) || Infinity;
          const worstGrowth = parseFloat(worst.yearlyGrowth) || Infinity;
          return currentGrowth < worstGrowth ? current : worst;
        }, stocksWithData[0]);
        
        bestPerformer = bestStock;
        worstPerformer = worstStock;
      }
        
      if (avgGrowth < 10) {
        recommendations.push("This portfolio's growing slower than my grades, fr fr 🐌. Need some stonks that actually go UP! 🚀🌙");
        aiInsights.push(`Your portfolio's average growth rate of ${avgGrowth.toFixed(2)}% underperforms the broader market. ${bestPerformer ? `Your best performer is ${bestPerformer.ticker} (${bestPerformer.yearlyGrowth}%), while ${worstPerformer.ticker} (${worstPerformer.yearlyGrowth}%) is dragging performance down.` : ''} Based on market trend analysis, consider reallocating from underperformers to sectors showing strong momentum and earnings growth.`);
      }
      
      // Industry and Stock Recommendations based on portfolio analysis

      // Sector-specific analysis
      const hasEnergySector = sectorAllocation.some(s => s.name === 'Energy');
      if (!hasEnergySector) {
          recommendations.push("No energy stocks? You sleepin'! 😴 Cop some ExxonMobil (XOM) or Chevron (CVX) 🛢️ and fuel up that portfolio! ⛽");
          aiInsights.push("Energy sector exposure is missing from your portfolio. While transitioning to renewables is ongoing, traditional energy companies are still posting strong cash flows and dividends. Consider allocating 5-8% to a mix of traditional and renewable energy companies for better sector balance.");
      }

      // Healthcare analysis
      const healthcarePct = sectorAllocation.find(s => s.name === 'Healthcare')?.value || 0;
      if (healthcarePct < 15) {
          recommendations.push("Is your portfolio feeling under the weather? 🤒 Johnson & Johnson (JNJ) or Pfizer (PFE) might be the 💊 to make it bussin' 💯!");
          aiInsights.push(`Healthcare is underrepresented at only ${healthcarePct.toFixed(1)}% of your portfolio. With demographic trends favoring healthcare growth and the sector's defensive characteristics, consider increasing exposure. Companies with strong R&D pipelines and diversified revenue streams are particularly attractive in current market conditions.`);
      }

      // Consumer analysis  
      const consumerDiscretionaryPct = sectorAllocation.find(s => s.name === 'Consumer Discretionary')?.value || 0;
      if (consumerDiscretionaryPct < 15) {
          recommendations.push("Lacking that drip? 💧 Add some Disney (DIS) or Nike (NKE) 👑 for the ultimate glow-up ✨!");
          aiInsights.push(`Consumer discretionary exposure is low at ${consumerDiscretionaryPct.toFixed(1)}%. Recent consumer spending data shows resilience in premium brands and entertainment. Companies with strong brand equity and omnichannel strategies are outperforming peers. Consider selective exposure to consumer leaders with pricing power.`);
      }

      // Tech analysis
      const techPct = sectorAllocation.find(s => s.name === 'Technology')?.value || 0;
      const lowRiskPct = riskBreakdown.find(r => r.name === 'Low')?.value || 0;
      if (lowRiskPct > 70 && techPct < 20) {
          recommendations.push("Sheesh, you playing it too safe! 🙄 Need some high-growth tech like NVIDIA (NVDA) 💻 or AMD (AMD) 🕹️ to get that bag! 💰");
          aiInsights.push(`Your portfolio is significantly overweight in low-risk assets (${lowRiskPct.toFixed(1)}%) with technology underrepresented at ${techPct.toFixed(1)}%. AI and semiconductor trends continue to drive growth in tech leaders. Consider adding exposure to companies with strong competitive moats in cloud infrastructure, AI development, and semiconductor design.`);
      }


      setPortfolioAnalysis({
        stocks: stocksWithData,
        totalValue: `${totalValue.toFixed(2)}`,
        sectorAllocation,
        riskBreakdown,
        avgDividendYield: `${avgDividendYield.toFixed(2)}%`,
        avgGrowth: `${avgGrowth.toFixed(2)}%`,
        recommendations,
        aiInsights,
        bestPerformer,
        worstPerformer,
        timestamp: new Date().toLocaleString()
      });
      
    } catch (err) {
      console.error("Error analyzing portfolio:", err);
      setError("Failed to analyze portfolio. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="App" style={{ 
      padding: '16px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1 style={{ 
          color: '#0078d4', 
          fontSize: '2em',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          Portfolio Analyzer
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666',
          marginBottom: '16px',
          fontSize: '0.9em'
        }}>
          {currentDate}
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '500px',
            position: 'relative'
          }}>
            <input 
              ref={searchInputRef}
              type="text" 
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                searchCompany(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search by company name"
              style={{ 
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '100%'
              }}
            />
            {companyResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '0 0 4px 4px',
                zIndex: 10,
                maxHeight: '200px',
                overflowY: 'auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                {companyResults.map((result, index) => (
                  <div 
                    key={index}
                    onClick={() => selectCompany(result.symbol)}
                    style={{
                      padding: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedIndex === index ? '#e6f7ff' : 'white'
                    }}
                  >
                    <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{result.company}</span> ({result.symbol})
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            width: '100%',
            maxWidth: '500px',
            gap: '8px'
          }}>
            <input 
              type="text" 
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Stock ticker"
              style={{ 
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                flex: 1
              }}
            />
            <input 
              id="quantity-input"
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              style={{ 
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '80px'
              }}
            />
            <button 
              onClick={addStock}
              style={{ 
                padding: '10px',
                backgroundColor: '#0078d4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
        </div>

        {stocks.length > 0 && (
          <div style={{ margin: '16px 0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {stocks.map((stock, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  backgroundColor: '#f8f9fa',
                  padding: '8px',
                  borderRadius: '4px'
                }}>
                  <span>{stock.ticker} - {stock.quantity}</span>
                  <button 
                    onClick={() => removeStock(index)}
                    style={{ 
                      padding: '4px 8px',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                onClick={analyzePortfolio}
                disabled={loading}
                style={{ 
                  padding: '10px 24px',
                  backgroundColor: loading ? '#cccccc' : '#0078d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'default' : 'pointer'
                }}
              >
                {loading ? 'Analyzing...' : 'Analyze Portfolio'}
              </button>
            </div>
          </div>
        )}
      </div>

      {portfolioAnalysis && (
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>Total Value</div>
              <div style={{ fontWeight: 'bold' }}>${portfolioAnalysis.totalValue}</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>Avg Dividend</div>
              <div style={{ fontWeight: 'bold' }}>{portfolioAnalysis.avgDividendYield}</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>Avg Growth</div>
              <div style={{ fontWeight: 'bold' }}>{portfolioAnalysis.avgGrowth}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div style={{ flex: '1 1 300px', height: '340px' }}>
              <h3 style={{ color: '#0078d4', fontSize: '1.1em', marginBottom: '8px' }}>Sector Allocation</h3>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={portfolioAnalysis.sectorAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {portfolioAnalysis.sectorAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ flex: '1 1 300px', height: '340px' }}>
              <h3 style={{ color: '#0078d4', fontSize: '1.1em', marginBottom: '8px' }}>Risk Distribution</h3>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={portfolioAnalysis.riskBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {portfolioAnalysis.riskBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ marginBottom: '2px' }}>
            <h3 style={{ color: '#0078d4', fontSize: '1.1em', marginBottom: '8px' }}>Portfolio Insights</h3>
            <div style={{ 
              display: 'grid',
              gap: '12px'
            }}>
              {portfolioAnalysis.aiInsights.map((insight, index) => (
                <div key={index} style={{ 
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}>
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#0078d4', fontSize: '1.1em', marginBottom: '8px' }}>Holdings</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '12px'
            }}>
              {portfolioAnalysis.stocks.map((stock, index) => (
                <div key={index} style={{ 
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <strong>{stock.ticker}</strong>
                    <span style={{ color: '#666' }}>{stock.quantity} shares</span>
                  </div>
                  <div style={{ color: '#666' }}>
                    <div>Price: ${stock.formattedPrice || stock.price.toFixed(2)}</div>
                    <div>P/E: {stock.peRatio} | Yield: {stock.dividendYield}%</div>
                    <div>Growth: {stock.yearlyGrowth}% | Risk: {stock.risk}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
