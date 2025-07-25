import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, DollarSign } from 'lucide-react';
import { useCurrency, currencies } from '../components/utils/dd_currency';
import { showToast } from '../components/common/ErrorBoundary';

export default function CurrencySettings() {
  const navigate = useNavigate();
  const { currentCurrency, setCurrency } = useCurrency();

  const handleCurrencyChange = async (currencyCode) => {
    await setCurrency(currencyCode);
    showToast(`Currency changed to ${currencies[currencyCode].name}`, 'success');
  };

  const currencyList = Object.entries(currencies).map(([code, info]) => ({
    code,
    ...info
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Currency</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="bg-white rounded-xl shadow-sm">
          {currencyList.map((currency, index) => (
            <div key={currency.code}>
              <button
                onClick={() => handleCurrencyChange(currency.code)}
                className={`w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors ${
                  currentCurrency === currency.code ? 'bg-red-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">{currency.symbol}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{currency.name}</p>
                    <p className="text-sm text-gray-600">{currency.code}</p>
                  </div>
                </div>
                {currentCurrency === currency.code && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
              {index < currencyList.length - 1 && <div className="border-b border-gray-100 mx-4" />}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Currency Conversion</h3>
              <p className="text-blue-700 text-sm">
                Prices are converted using current exchange rates. Final charges may vary slightly based on your payment method's conversion rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}