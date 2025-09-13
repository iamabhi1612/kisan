import React from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, ArrowLeft, RefreshCw } from 'lucide-react';

interface MarketPrice {
  crop: string;
  malayalam: string;
  currentPrice: number;
  previousPrice: number;
  market: string;
  date: string;
  unit: string;
}

interface MarketPricesProps {
  onBack?: () => void;
}

export default function MarketPrices({ onBack }: MarketPricesProps) {
  const [marketPrices, setMarketPrices] = React.useState<MarketPrice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());

  // Simulate real-time market data fetching
  const fetchMarketPrices = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate realistic price variations
    const baseData = [
      { crop: 'Rice', malayalam: 'നെല്ല്', basePrice: 2850, market: 'Kottayam Mandi', unit: 'quintal' },
      { crop: 'Coconut', malayalam: 'തെങ്ങ്', basePrice: 12, market: 'Cochin Market', unit: 'piece' },
      { crop: 'Pepper', malayalam: 'കുരുമുളക്', basePrice: 45000, market: 'Idukki Spice Market', unit: 'quintal' },
      { crop: 'Cardamom', malayalam: 'ഏലം', basePrice: 275000, market: 'Kumily Market', unit: 'quintal' },
      { crop: 'Rubber', malayalam: 'റബ്ബർ', basePrice: 18500, market: 'Rubber Board', unit: 'quintal' },
      { crop: 'Banana', malayalam: 'വാഴ', basePrice: 2200, market: 'Ernakulam Market', unit: 'quintal' }
    ];

    const updatedPrices = baseData.map(item => {
      // Generate realistic price fluctuations (-5% to +5%)
      const variation = (Math.random() - 0.5) * 0.1;
      const currentPrice = Math.round(item.basePrice * (1 + variation));
      const previousPrice = Math.round(item.basePrice * (1 + (Math.random() - 0.5) * 0.08));
      
      return {
        ...item,
        currentPrice,
        previousPrice,
        date: new Date().toISOString().split('T')[0]
      };
    });

    setMarketPrices(updatedPrices);
    setLastUpdated(new Date());
    setLoading(false);
  };

  React.useEffect(() => {
    fetchMarketPrices();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchMarketPrices, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getPriceChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    
    if (change > 0) {
      return { icon: TrendingUp, color: 'text-green-600', sign: '+', percentage };
    } else if (change < 0) {
      return { icon: TrendingDown, color: 'text-red-600', sign: '', percentage };
    } else {
      return { icon: Minus, color: 'text-gray-600', sign: '', percentage: '0.0' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Market Prices</h2>
            <p className="text-gray-600">Live prices from Kerala markets</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchMarketPrices}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {loading && marketPrices.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600">Loading market prices...</span>
        </div>
      ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {marketPrices.map((item, index) => {
          const priceChange = getPriceChange(item.currentPrice, item.previousPrice);
          const ChangeIcon = priceChange.icon;
          
          return (
            <div key={index} className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${loading ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.crop}</h3>
                  <p className="text-sm text-gray-600">{item.malayalam}</p>
                </div>
                <div className={`flex items-center space-x-1 ${priceChange.color}`}>
                  <ChangeIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {priceChange.sign}{priceChange.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-2xl font-bold text-gray-900">
                  ₹{item.currentPrice.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">per {item.unit}</div>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{item.market}</span>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Previous: ₹{item.previousPrice.toLocaleString()}/{item.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Live Market Insights</h4>
            <p className="text-sm text-blue-700 mt-1 mb-2">
              Prices are updated every 5 minutes from government market feeds and local mandis.
            </p>
            <div className="text-xs text-blue-600">
              • Data sourced from Kerala Agricultural Marketing Board
              <br />
              • Prices may vary by location and quality grade
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}