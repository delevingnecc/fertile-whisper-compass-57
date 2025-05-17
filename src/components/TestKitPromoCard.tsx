
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TestKitPromoCard = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const { toast } = useToast();

  const handlePurchase = () => {
    setIsPurchasing(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      setIsPurchasing(false);
      setIsPurchased(true);
      
      toast({
        title: "Purchase Successful!",
        description: "Your test kit will be shipped within 2 business days.",
        variant: "default", // Changed from "success" to "default"
      });
    }, 1500);
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-primary/20 shadow-md mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-primary-700 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          At-Home Fertility Test Kit
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 bg-primary/10 rounded-lg flex items-center justify-center">
            <Package className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 mb-1">Complete Fertility Screening</h3>
            <p className="text-sm text-gray-600 mb-2">
              Get comprehensive insights about your fertility with our clinically validated test kit.
            </p>
            <div className="flex items-center">
              <span className="font-semibold text-primary-700">$189</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handlePurchase}
          disabled={isPurchasing || isPurchased}
          className="w-full"
        >
          {isPurchasing ? 'Processing...' : isPurchased ? 'Purchased' : 'Start Your Journey Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestKitPromoCard;
