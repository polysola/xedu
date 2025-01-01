'use client';
// components/exchange-box.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Coins, ArrowRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ExchangeBoxProps {
  points: number;
}

export const ExchangeBox = ({ points }: ExchangeBoxProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const exchangeRate = 500; // 100 points = 1 coin
  const maxCoins = Math.floor(points / exchangeRate);

  const presetAmounts = [1, 5, 10, maxCoins];
  const progress = (points % exchangeRate) / exchangeRate * 100;

  const handleExchange = () => {
    if (points < exchangeRate) {
      toast.error("Not enough points", {
        description: `You need at least ${exchangeRate} points to exchange for 1 coin`
      });
      return;
    }
    setIsLoading(true);
    // Simulate exchange process
    setTimeout(() => {
      toast.success("Coming soon!", {
        description: `Exchanged ${selectedAmount || 1} coins`
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-[450px]">
      <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50 bg-white">
        <div className="p-6 space-y-6">
          {/* Points Balance Display */}
          <div className="relative overflow-hidden group">
            <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-purple-500 p-6 rounded-xl shadow-lg 
                          transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-500/20 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-white/90 text-sm font-medium">Available Balance</p>
                  <h2 className="text-3xl font-bold text-white mt-1">{points} Points</h2>
                </div>
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                  <Coins className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Progress to Next Coin */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-neutral-700">Progress to next coin</span>
              <span className="text-primary">{points % exchangeRate} / {exchangeRate}</span>
            </div>
            <Progress value={progress} className="h-2.5 bg-muted" />
          </div>

          {/* Quick Select Amounts */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700">Quick Select Amount</label>
            <div className="grid grid-cols-4 gap-3">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`p-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${selectedAmount === amount 
                      ? 'bg-primary text-white shadow-md hover:shadow-lg hover:bg-primary/90' 
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'}`}
                >
                  {amount} {amount === 1 ? 'Coin' : 'Coins'}
                </button>
              ))}
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-800">{exchangeRate}</span>
                <span className="text-neutral-500">Points</span>
              </div>
              <ArrowRight className="text-primary" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-800">???</span>
                <span className="text-neutral-500">Coin</span>
              </div>
            </div>
          </div>

          {/* Exchange Button */}
          <div>
          <Button
  disabled={points < exchangeRate || isLoading}
  className={`w-full h-14 text-lg font-medium transition-all duration-300 
    bg-gradient-to-r from-[#6A0DAD] via-[#8A2BE2] to-[#4B0082] 
    hover:shadow-[0px_0px_15px_5px_rgba(138,43,226,0.7)] 
    disabled:bg-gray-500 disabled:cursor-not-allowed
    rounded-xl relative overflow-hidden`}
  onClick={handleExchange}
>
  {isLoading ? (
    <div className="flex items-center justify-center gap-3">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span className="text-white">Processing...</span>
    </div>
  ) : (
    <div className="flex items-center justify-center gap-3">
      <div className="relative h-5 w-5">
        <div className="absolute inset-0 animate-ping rounded-full bg-white opacity-75"></div>
        <div className="absolute inset-0 bg-white rounded-full"></div>
      </div>
      <span className="text-white">
        Exchange {selectedAmount || 1} {selectedAmount === 1 ? 'Coin' : 'Coins'}
      </span>
    </div>
  )}
</Button>

          </div>
        </div>
      </Card>
    </div>
  );
};