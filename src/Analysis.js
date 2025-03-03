import React, { useState } from 'react';
import PortfolioInsights from './PortfolioInsights';
import './Analysis.css';

const Analysis = ({ portfolioAnalysis }) => {
  const [showRecommendations, setShowRecommendations] = useState(true);
  
  if (!portfolioAnalysis) return null;
  
  // Extract portfolio metrics for AI analysis
  const { 
    totalValue, 
    sectorAllocation, 
    riskBreakdown, 
    stocks 
  } = portfolioAnalysis;

  const totalInvested = parseFloat(totalValue.replace(',', ''));
  const sectors = sectorAllocation.map(s => ({ name: s.name, percentage: s.value }));
  const risks = riskBreakdown.map(r => ({ level: r.name, percentage: r.value }));
  
  // Generate more intelligent stock recommendations based on portfolio composition
  const generateSmartRecommendations = () => {
    const recommendations = [];
    
    // Check sector underrepresentation
    const techSector = sectors.find(s => s.name === 'Technology');
    const techPercentage = techSector ? techSector.percentage : 0;
    
    const healthcareSector = sectors.find(s => s.name === 'Healthcare');
    const healthcarePercentage = healthcareSector ? healthcareSector.percentage : 0;
    
    const energySector = sectors.find(s => s.name === 'Energy');
    const energyPercentage = energySector ? energySector.percentage : 0;
    
    const financeSector = sectors.find(s => s.name === 'Finance');
    const financePercentage = financeSector ? financeSector.percentage : 0;

    // Analyze portfolio risk level
    const highRisk = risks.find(r => r.level === 'High');
    const highRiskPercentage = highRisk ? highRisk.percentage : 0;
    
    const lowRisk = risks.find(r => r.level === 'Low');
    const lowRiskPercentage = lowRisk ? lowRisk.percentage : 0;

    // Dividend analysis
    const dividendStocks = stocks.filter(s => 
      parseFloat(s.dividendYield) > 0.5
    );
    const dividendPercentage = (dividendStocks.length / stocks.length) * 100;

    // Industry-specific recommendations with quantitative data
    if (techPercentage < 15) {
      recommendations.push({
        type: "sector",
        sector: "Technology",
        message: "Your technology exposure is only " + techPercentage.toFixed(1) + "%, significantly below the S&P 500 average of 29.5%",
        suggestion: "Consider allocating 8-12% of your portfolio (approximately $" + ((totalInvested * 0.1).toFixed(0)) + ") to high-growth tech leaders",
        stocks: [
          {
            ticker: "MSFT",
            name: "Microsoft",
            rationale: "Cloud growth (Azure revenue +27% YoY) and AI integration positioning it for 15-18% earnings growth",
            metrics: "Forward P/E: 32.4x, 5-year avg. revenue CAGR: 15.8%, Beta: 0.92"
          },
          {
            ticker: "NVDA",
            name: "NVIDIA",
            rationale: "AI chip demand driving 278% revenue growth with data center segment outperforming expectations",
            metrics: "Gross margin: 71.2%, Market share in AI GPUs: 85%, YoY growth: 126%"
          },
          {
            ticker: "CRM",
            name: "Salesforce",
            rationale: "Enterprise cloud leadership with expanding AI integration and 93% subscription-based revenue",
            metrics: "Operating margin: 17.3%, Customer retention: 92%, AI-powered growth projection: 21%"
          }
        ]
      });
    }

    if (healthcarePercentage < 10) {
      recommendations.push({
        type: "sector",
        sector: "Healthcare",
        message: "Healthcare stocks make up only " + healthcarePercentage.toFixed(1) + "% of your portfolio, below the recommended 12-15% for balanced exposure",
        suggestion: "Add approximately $" + ((totalInvested * 0.08).toFixed(0)) + " in healthcare to improve sector diversification",
        stocks: [
          {
            ticker: "UNH",
            name: "UnitedHealth Group",
            rationale: "Medicare Advantage enrollment growth of 9.2% and Optum Health revenue up 11.3% year-over-year",
            metrics: "Dividend yield: 1.35%, Forward P/E: 19.2x, 10-year dividend CAGR: 17.8%"
          },
          {
            ticker: "ABBV",
            name: "AbbVie",
            rationale: "Strong immunology portfolio offsetting Humira patent cliff with Skyrizi/Rinvoq growth of 46.7%",
            metrics: "Dividend yield: 3.7%, Payout ratio: 41.2%, R&D as % of revenue: 13.9%"
          },
          {
            ticker: "ISRG",
            name: "Intuitive Surgical",
            rationale: "Robotic surgery leader with 15% procedure growth and 88% recurring revenue model",
            metrics: "Installed base: 8,600+ systems, Market share: 79%, Cash per share: $37.42"
          }
        ]
      });
    }

    if (energyPercentage < 5) {
      recommendations.push({
        type: "sector",
        sector: "Energy",
        message: "Energy allocation at " + energyPercentage.toFixed(1) + "% is below the S&P 500 weight of 3.9%, missing potential dividend income",
        suggestion: "Allocate approximately $" + ((totalInvested * 0.04).toFixed(0)) + " to create a balanced energy exposure",
        stocks: [
          {
            ticker: "XOM",
            name: "Exxon Mobil",
            rationale: "Strong cash flow ($55.4B TTM) with 43 years of dividend increases and significant Permian Basin production growth of 11%",
            metrics: "Dividend yield: 3.4%, FCF yield: 7.8%, P/B ratio: 1.9x"
          },
          {
            ticker: "CVX",
            name: "Chevron",
            rationale: "36-year dividend increase streak with $11.5B stock buyback program and 3.5% production growth",
            metrics: "Dividend yield: 4.1%, Debt-to-equity: 0.15, Production cost per barrel: $11.73"
          },
          {
            ticker: "NEE",
            name: "NextEra Energy",
            rationale: "Largest renewable energy producer with 24.3% ROE and regulated utility business providing stability",
            metrics: "Dividend yield: 2.7%, Dividend growth rate: 10.3%, Renewable capacity: 34 GW"
          }
        ]
      });
    }

    if (financePercentage < 10) {
      recommendations.push({
        type: "sector",
        sector: "Finance",
        message: "Financial services make up only " + financePercentage.toFixed(1) + "% of your holdings, below the market average of 12.8%",
        suggestion: "Add approximately $" + ((totalInvested * 0.07).toFixed(0)) + " in financial stocks for better sector balance",
        stocks: [
          {
            ticker: "JPM",
            name: "JPMorgan Chase",
            rationale: "Industry-leading 19.2% ROTCE with strong net interest income growth of 11.2% and robust capital ratios",
            metrics: "CET1 ratio: 15.1%, Efficiency ratio: 57%, Loan growth: 4.6% YoY"
          },
          {
            ticker: "BLK",
            name: "BlackRock",
            rationale: "World's largest asset manager with $10.1T AUM and growing ETF market share of 32.3%",
            metrics: "Dividend yield: 2.5%, Operating margin: 35.6%, Revenue per employee: $1.14M"
          },
          {
            ticker: "V",
            name: "Visa",
            rationale: "Payment network dominance with 53% market share and 20.3% cross-border volume growth",
            metrics: "Operating margin: 66.9%, ROE: 46.8%, 5-year revenue CAGR: 10.2%"
          }
        ]
      });
    }

    // Risk profile recommendations
    if (highRiskPercentage > 65) {
      recommendations.push({
        type: "risk",
        level: "High Risk",
        message: "Your portfolio shows " + highRiskPercentage.toFixed(1) + "% allocation to high-risk assets, suggesting potential volatility concerns",
        suggestion: "Consider reducing high-risk exposure by $" + ((totalInvested * 0.2).toFixed(0)) + " by adding these defensive stocks:",
        stocks: [
          {
            ticker: "PG",
            name: "Procter & Gamble",
            rationale: "Consumer staples leader with 67 years of dividend increases and 50% of sales from must-have products",
            metrics: "Beta: 0.42, Dividend yield: 2.4%, Organic sales growth: 5.1%"
          },
          {
            ticker: "JNJ",
            name: "Johnson & Johnson",
            rationale: "Healthcare stalwart with 61-year dividend increase streak and 70% of revenue from #1 or #2 market position products",
            metrics: "Beta: 0.54, Dividend yield: 3.0%, R&D as % of sales: 14.6%"
          },
          {
            ticker: "KO",
            name: "Coca-Cola",
            rationale: "Beverage giant with 61 consecutive years of dividend increases and 61% international revenue diversification",
            metrics: "Beta: 0.58, Dividend yield: 2.9%, FCF conversion rate: 108%"
          }
        ]
      });
    } else if (lowRiskPercentage > 70) {
      recommendations.push({
        type: "risk",
        level: "Low Risk",
        message: "Your portfolio is very conservative with " + lowRiskPercentage.toFixed(1) + "% in low-risk assets, potentially limiting growth",
        suggestion: "Consider reallocating $" + ((totalInvested * 0.15).toFixed(0)) + " to these growth opportunities:",
        stocks: [
          {
            ticker: "AMZN",
            name: "Amazon",
            rationale: "AWS growth of 13% YoY with expanding margins and 25.3% e-commerce market share in North America",
            metrics: "FCF growth: 74% YoY, AWS operating margin: 31.2%, Prime subscriber retention: 93%"
          },
          {
            ticker: "AVGO",
            name: "Broadcom",
            rationale: "Semiconductor and infrastructure software leader with 48% gross margins and significant AI-driven growth",
            metrics: "5-year revenue CAGR: 15.3%, R&D as % of revenue: 18.7%, Dividend growth: 14% 5-year CAGR"
          },
          {
            ticker: "LLY",
            name: "Eli Lilly",
            rationale: "Pharmaceutical innovator with blockbuster GLP-1 drugs driving projected 22% revenue growth",
            metrics: "New product revenue: 39% of total, Pipeline valuation: $257B, R&D productivity ratio: 3.8x"
          }
        ]
      });
    }

    // Dividend strategy recommendations
    if (dividendPercentage < 30) {
      recommendations.push({
        type: "dividend",
        message: "Only " + dividendPercentage.toFixed(1) + "% of your holdings pay meaningful dividends, limiting passive income potential",
        suggestion: "Allocate approximately $" + ((totalInvested * 0.12).toFixed(0)) + " to these dividend growers:",
        stocks: [
          {
            ticker: "HD",
            name: "Home Depot",
            rationale: "Home improvement leader with 36.5% market share and 14-year dividend growth streak",
            metrics: "Dividend yield: 2.4%, 5-year dividend CAGR: 15.2%, Payout ratio: 52.8%"
          },
          {
            ticker: "MSFT",
            name: "Microsoft",
            rationale: "Tech giant with 21 consecutive years of dividend growth and $9.7B quarterly FCF generation",
            metrics: "Dividend yield: 0.73%, 10-year dividend CAGR: 10.3%, Cash to debt ratio: 1.87"
          },
          {
            ticker: "TXN",
            name: "Texas Instruments",
            rationale: "Semiconductor firm with 19 years of dividend increases and 35% of revenue from industrial applications",
            metrics: "Dividend yield: 2.9%, Payout ratio: 62%, FCF margin: 29.7%"
          }
        ]
      });
    }

    return recommendations;
  };

  const aiRecommendations = generateSmartRecommendations();
  
  return (
    <div className="analysis-container">
<div 
  className="analysis-header"
  onClick={() => setShowRecommendations(!showRecommendations)}
>
  <span 
    className="analysis-header-icon" 
    style={{ 
      transform: showRecommendations ? 'rotate(90deg)' : 'none'
    }}
  >
    &#9654;
  </span>
  AI-Powered Investment Recommendations
</div>
      
      {showRecommendations && (
        <div className="recommendation-grid">
          {aiRecommendations.map((rec, index) => (
            <div key={index} className="recommendation-card">
              <div className={`recommendation-header ${rec.type}`}>
                {rec.type === 'sector' ? `${rec.sector} Sector` : 
                 rec.type === 'risk' ? `${rec.level} Profile` : 
                 'Dividend Strategy'}
              </div>
              
              <div className="recommendation-message">{rec.message}</div>
              <div className="recommendation-suggestion">{rec.suggestion}</div>
              
              <div className="stocks-grid">
                {rec.stocks.map((stock, stockIndex) => (
                  <div key={stockIndex} className="stock-card">
                    <div className="stock-header">
                      <div className="stock-ticker">{stock.ticker}</div>
                      <div className="stock-name">{stock.name}</div>
                    </div>
                    
                    <div className="stock-rationale">
                      {stock.rationale}
                    </div>
                    
                    <div className="stock-metrics">
                      {stock.metrics}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analysis;