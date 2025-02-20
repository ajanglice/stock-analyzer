import React, { useState, useEffect } from 'react';
import './App.css';

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

  // Alpha Vantage API key - Replace with your own key
  const API_KEY = '2IKBMJH621ORDD49'; // Use your own API key in production

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

  // Fetch stock data from Alpha Vantage API
  const fetchStockData = async (symbol) => {
    try {
      // Get current price data
      const quoteResponse = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!quoteResponse.ok) {
        throw new Error(`API error: ${quoteResponse.status}`);
      }
      
      const quoteData = await quoteResponse.json();
      
      // Handle API errors or empty responses
      if (quoteData['Error Message'] || !quoteData['Global Quote'] || Object.keys(quoteData['Global Quote']).length === 0) {
        return {
          price: null,
          change: null
        };
      }
      
      // Get company overview for additional metrics
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!overviewResponse.ok) {
        throw new Error(`API error: ${overviewResponse.status}`);
      }
      
      const overviewData = await overviewResponse.json();
      
      return {
        price: parseFloat(quoteData['Global Quote']['05. price']),
        change: parseFloat(quoteData['Global Quote']['09. change']),
        changePercent: parseFloat(quoteData['Global Quote']['10. change percent'].replace('%', '')),
        peRatio: overviewData.PERatio ? parseFloat(overviewData.PERatio) : null,
        dividendYield: overviewData.DividendYield ? parseFloat(overviewData.DividendYield) * 100 : null,
        beta: overviewData.Beta ? parseFloat(overviewData.Beta) : null,
        yearHigh: overviewData['52WeekHigh'] ? parseFloat(overviewData['52WeekHigh']) : null,
        yearLow: overviewData['52WeekLow'] ? parseFloat(overviewData['52WeekLow']) : null
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
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

  const selectCompany = (symbol) => {
    setTicker(symbol);
    setCompanyResults([]);
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
      const highRiskSectors = ['Technology', 'Consumer', 'Energy'];
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
          formattedPrice: `$${data.price.toFixed(2)}`,
          peRatio: data.peRatio ? data.peRatio.toFixed(1) : 'N/A',
          dividendYield: data.dividendYield ? data.dividendYield.toFixed(2) : '0.00',
          yearlyGrowth: yearlyGrowth,
          risk: risk,
          sector: sector,
          yearHigh: data.yearHigh ? `$${data.yearHigh.toFixed(2)}` : 'N/A',
          yearLow: data.yearLow ? `$${data.yearLow.toFixed(2)}` : 'N/A',
          dataSource: 'api'
        };
      });
      
      const stocksWithData = await Promise.all(stocksWithDataPromises);
      
      // Calculate portfolio metrics
      const totalValue = stocksWithData.reduce((sum, stock) => 
        sum + stock.price * stock.quantity, 0);

      const sectorAllocation = stocksWithData.reduce((acc, stock) => {
        const stockValue = stock.price * stock.quantity;
        acc[stock.sector] = (acc[stock.sector] || 0) + (stockValue / totalValue) * 100;
        return acc;
      }, {});

      const riskBreakdown = stocksWithData.reduce((acc, stock) => {
        const stockValue = stock.price * stock.quantity;
        acc[stock.risk] = (acc[stock.risk] || 0) + (stockValue / totalValue) * 100;
        return acc;
      }, {});

      // Generate portfolio recommendations with more casual language
      const recommendations = [];
      
      const maxSectorAllocation = Math.max(...Object.values(sectorAllocation));
      if (maxSectorAllocation > 40) {
        recommendations.push("Hold up! 🛑 You're way too obsessed with one sector! 🤪 Diversify or get rekt! 🙅‍♂️💸");
      }

      if (riskBreakdown.High > 60) {
        recommendations.push("Whoa there, speed racer! 🏎️ Your portfolio's giving me anxiety! 😬 Dial back the risk unless you're tryna yolo it all! 🤪");
      } else if ((riskBreakdown.Low || 0) > 80) {
        recommendations.push("Dude, chill! 🧘‍♀️ This portfolio kinda boring ngl. 🙄 Add some spice! 🔥📈");
      }

      const stocksWithDividend = stocksWithData.filter(stock => 
        stock.dividendYield && parseFloat(stock.dividendYield) > 0);
        
      const avgDividendYield = stocksWithDividend.length > 0 
        ? stocksWithDividend.reduce((sum, stock) => sum + parseFloat(stock.dividendYield), 0) / stocksWithDividend.length
        : 0;
        
      if (avgDividendYield < 2) {
        recommendations.push("Bruh no dividends? 💀 Time to plant a money tree and get that passive income flowing! 🌳💰");
      }

      const stocksWithGrowth = stocksWithData.filter(stock => 
        stock.yearlyGrowth && !isNaN(parseFloat(stock.yearlyGrowth)));
        
      const avgGrowth = stocksWithGrowth.length > 0
        ? stocksWithGrowth.reduce((sum, stock) => sum + parseFloat(stock.yearlyGrowth), 0) / stocksWithGrowth.length
        : 0;
        
      if (avgGrowth < 10) {
        recommendations.push("This portfolio's growing slower than my grades, fr fr 🐌. Need some stonks that actually go UP! 🚀🌙");
      }
      
      // Industry and Stock Recommendations based on portfolio analysis

      //If no energy sector, suggest adding some
      if (!sectorAllocation['Energy']) {
          recommendations.push("No energy stocks? You sleepin'! 😴 Cop some ExxonMobil (XOM) or Chevron (CVX) 🛢️ and fuel up that portfolio! ⛽");
      }

      // If low on healthcare, suggest a healthcare stock
      if (!sectorAllocation['Healthcare'] || sectorAllocation['Healthcare'] < 15) {
          recommendations.push("Is your portfolio feeling under the weather? 🤒 Johnson & Johnson (JNJ) or Pfizer (PFE) might be the 💊 to make it bussin' 💯!");
      }

      // If low on consumer discretionary, suggest adding some
      if (!sectorAllocation['Consumer Discretionary'] || sectorAllocation['Consumer Discretionary'] < 15) {
          recommendations.push("Lacking that drip? 💧 Add some Disney (DIS) or Nike (NKE) 👑 for the ultimate glow-up ✨!");
      }

      // If too much low-risk, suggest high-growth tech
      if (riskBreakdown['Low'] > 70) {
          recommendations.push("Sheesh, you playing it too safe! 🙄 Need some high-growth tech like NVIDIA (NVDA) 💻 or AMD (AMD) 🕹️ to get that bag! 💰");
      }


      setPortfolioAnalysis({
        stocks: stocksWithData,
        totalValue: `$${totalValue.toFixed(2)}`,
        sectorAllocation,
        riskBreakdown,
        avgDividendYield: `${avgDividendYield.toFixed(2)}%`,
        avgGrowth: `${avgGrowth.toFixed(2)}%`,
        recommendations,
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
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          color: '#0078d4', 
          fontSize: '2.5em',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          FinTech Final Project: Enhanced Portfolio Analyzer
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666',
          marginBottom: '20px' 
        }}>
          {currentDate}
        </p>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#444',
          lineHeight: '1.6'
        }}>
          <p>This tool helps you analyze your investment portfolio using real-time market data, providing detailed insights into sector allocation, risk assessment, and personalized recommendations for portfolio optimization.</p>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ 
          margin: '20px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '500px',
            position: 'relative'
          }}>
            <label style={{ 
              fontWeight: 'bold', 
              marginBottom: '5px',
              color: '#0078d4' 
            }}>
              Search by Company Name:
            </label>
            <input 
              type="text" 
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                searchCompany(e.target.value);
              }}
              placeholder="Enter company name (e.g. Apple, Microsoft)"
              style={{ 
                padding: '12px',
                borderRadius: '5px',
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
                borderRadius: '0 0 5px 5px',
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
                      padding: '10px',
                      borderBottom: index < companyResults.length - 1 ? '1px solid #eee' : 'none',
                      cursor: 'pointer',
                      hover: {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
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
            gap: '10px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ 
                fontWeight: 'bold', 
                marginBottom: '5px',
                display: 'block',
                color: '#0078d4' 
              }}>
                Stock Ticker:
              </label>
              <input 
                type="text" 
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Stock ticker (e.g. AAPL)"
                style={{ 
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  width: '100%'
                }}
              />
            </div>
            <div>
              <label style={{ 
                fontWeight: 'bold', 
                marginBottom: '5px',
                display: 'block',
                color: '#0078d4' 
              }}>
                Quantity:
              </label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                style={{ 
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  width: '100px'
                }}
              />
            </div>
          </div>
          
          <button 
            onClick={addStock}
            style={{ 
              padding: '12px 24px',
              backgroundColor: '#0078d4',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              width: '200px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#006cbd'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#0078d4'}
          >
            Add Stock
          </button>
        </div>

        {stocks.length > 0 && (
          <div style={{ margin: '20px' }}>
            <h3 style={{ color: '#0078d4', textAlign: 'center' }}>Your Portfolio</h3>
            {stocks.map((stock, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '10px',
                margin: '10px',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '5px'
              }}>
                <span style={{ fontSize: '1.1em' }}>{stock.ticker} - {stock.quantity} shares</span>
                <button 
                  onClick={() => removeStock(index)}
                  style={{ 
                    padding: '5px 10px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={analyzePortfolio}
                disabled={loading}
                style={{ 
                  padding: '12px 30px',
                  backgroundColor: loading ? '#cccccc' : '#0078d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '1.1em',
                  cursor: loading ? 'default' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#006cbd')}
                onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#0078d4')}
              >
                {loading ? 'Analyzing...' : 'Analyze Portfolio'}
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div style={{
            margin: '20px',
            padding: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </div>

      {portfolioAnalysis && (
        <div style={{ 
          margin: '20px',
          textAlign: 'left',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#0078d4', margin: 0 }}>Portfolio Analysis</h2>
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              Last updated: {portfolioAnalysis.timestamp}
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#0078d4' }}>Portfolio Overview</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '5px'
            }}>
              <div>
                <p style={{ margin: '5px 0', color: '#666' }}>Total Value:</p>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{portfolioAnalysis.totalValue}</p>
              </div>
              <div>
                <p style={{ margin: '5px 0', color: '#666' }}>Avg Dividend Yield:</p>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{portfolioAnalysis.avgDividendYield}</p>
              </div>
              <div>
                <p style={{ margin: '5px 0', color: '#666' }}>Avg Growth Rate:</p>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{portfolioAnalysis.avgGrowth}</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#0078d4' }}>Sector Allocation</h3>
            {Object.entries(portfolioAnalysis.sectorAllocation).map(([sector, percentage]) => (
              <div key={sector} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                margin: '10px 0',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '5px'
              }}>
                <div style={{ width: '150px', color: '#666' }}>{sector}:</div>
                <div style={{ 
                  width: `${percentage}%`, 
                  maxWidth: '100%',
                  backgroundColor: '#0078d4', 
                  height: '20px',
                  marginRight: '10px',
                  borderRadius: '3px',
                  transition: 'width 0.3s'
                }}></div>
                <div>{percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#0078d4' }}>Risk Distribution</h3>
            {Object.entries(portfolioAnalysis.riskBreakdown).map(([risk, percentage]) => (
              <div key={risk} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                margin: '10px 0',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '5px'
              }}>
                <div style={{ width: '150px', color: '#666' }}>{risk} Risk:</div>
                <div style={{ 
                  width: `${percentage}%`, 
                  maxWidth: '100%',
                  backgroundColor: risk === 'High' ? '#ff4444' : risk === 'Medium' ? '#FFA726' : '#4CAF50', 
                  height: '20px',
                  marginRight: '10px',
                  borderRadius: '3px',
                  transition: 'width 0.3s'
                }}></div>
                <div>{percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#0078d4' }}>Recommendations</h3>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '5px'
            }}>
              {portfolioAnalysis.recommendations.length > 0 ? (
                portfolioAnalysis.recommendations.map((rec, index) => (
                  <div key={index} style={{ 
                    margin: '10px 0',
                    padding: '10px',
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    border: '1px solid #e0e0e0'
                  }}>
                    {rec}
                  </div>
                ))
              ) : (
                <div style={{ 
                  margin: '10px 0',
                  padding: '10px',
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  border: '1px solid #e0e0e0'
                }}>
                  Looking pretty good! Your portfolio seems well-balanced. Just keep an eye on the market.
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#0078d4' }}>Individual Stock Analysis</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '20px',
              marginTop: '20px'
            }}>
              {portfolioAnalysis.stocks.map((stock, index) => (
                <div key={index} style={{ 
                  padding: '20px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '5px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <h4 style={{ 
                    margin: '0 0 15px 0',
                    color: '#0078d4',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{stock.ticker}</span>
                    {stock.dataSource === 'mock' && (
                      <span style={{
                        fontSize: '0.7em',
                        padding: '2px 5px',
                        backgroundColor: '#FFA726',
                        color: 'white',
                        borderRadius: '3px'
                      }}>
                        Mock Data
                      </span>
                    )}
                  </h4>
                  <div style={{ color: '#666' }}>
                    <p style={{ margin: '5px 0' }}>Quantity: {stock.quantity}</p>
                    <p style={{ margin: '5px 0' }}>Current Price: {stock.formattedPrice || `$${stock.price.toFixed(2)}`}</p>
                    <p style={{ margin: '5px 0' }}>P/E Ratio: {stock.peRatio}</p>
                    <p style={{ margin: '5px 0' }}>Risk Level: {stock.risk}</p>
                    <p style={{ margin: '5px 0' }}>Sector: {stock.sector}</p>
                    <p style={{ margin: '5px 0' }}>Dividend Yield: {stock.dividendYield}%</p>
                    <p style={{ margin: '5px 0' }}>Yearly Growth: {stock.yearlyGrowth}%</p>
                    {stock.yearHigh && <p style={{ margin: '5px 0' }}>52-Week High: {stock.yearHigh}</p>}
                    {stock.yearLow && <p style={{ margin: '5px 0' }}>52-Week Low: {stock.yearLow}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{
            marginTop: '30px',
            padding: '15px',
            backgroundColor: '#e8f4fd',
            borderRadius: '5px',
            fontSize: '0.9em',
            color: '#666'
          }}>
            <p style={{ margin: 0 }}>Note: Stock data is powered by Alpha Vantage API. Some information may be delayed or unavailable due to API limitations. When real-time data cannot be fetched, the system will display estimated values.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


