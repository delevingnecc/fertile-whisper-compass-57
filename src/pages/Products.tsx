
import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Filter } from 'lucide-react';

const Products = () => {
  const productCategories = [
    "All",
    "Supplements",
    "Skincare",
    "Tracking Tools",
    "Wellness"
  ];
  
  const products = [
    {
      id: 1,
      name: "Hormone Balance Multi",
      category: "Supplements",
      rating: 4.7,
      reviewCount: 218,
      price: 45.99,
      image: "/products/vitamins.png",
      description: "Complete multivitamin formulated specifically for hormone balance and fertility support.",
      tags: ["Hormone Support", "Bestseller"]
    },
    {
      id: 2,
      name: "Clean Face Moisturizer",
      category: "Skincare",
      rating: 4.8,
      reviewCount: 156,
      price: 32.00,
      image: "/products/moisturizer.png",
      description: "Non-toxic, fragrance-free moisturizer safe for hormone-sensitive skin.",
      tags: ["Non-Toxic", "Fragrance Free"]
    },
    {
      id: 3,
      name: "Advanced Cycle Tracker",
      category: "Tracking Tools",
      rating: 4.9,
      reviewCount: 327,
      price: 129.99,
      image: "/products/tracker.png",
      description: "Wearable device for accurate temperature tracking and cycle predictions.",
      tags: ["Smart Device", "New"]
    },
    {
      id: 4,
      name: "Relaxation Tea Blend",
      category: "Wellness",
      rating: 4.6,
      reviewCount: 89,
      price: 18.50,
      image: "/products/tea.png",
      description: "Herbal blend designed to reduce stress and support hormone balance.",
      tags: ["Caffeine Free", "Organic"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Recommended Products" />
      
      <div className="flex-1 pt-16 pb-20">
        <div className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Personalized Recommendations</h2>
            <p className="text-sm text-gray-600">Products selected for your fertility journey</p>
          </div>
          
          <div className="mb-6 overflow-x-auto scrollbar-hidden">
            <Tabs defaultValue="All">
              <TabsList className="flex space-x-2 pb-2 overflow-x-auto">
                {productCategories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="px-4 py-1 whitespace-nowrap"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {productCategories.map((category) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium">
                      {category === "All" ? "All Products" : category}
                    </span>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Filter className="h-3 w-3" />
                      <span>Filter</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-5">
                    {products
                      .filter(product => category === "All" || product.category === category)
                      .map(product => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="flex">
                            <div className="w-1/3 bg-gray-100 flex items-center justify-center">
                              <div className="h-24 w-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                                {product.name.charAt(0)}
                              </div>
                            </div>
                            <div className="w-2/3">
                              <CardHeader className="p-3 pb-1">
                                <div className="flex flex-wrap gap-1 mb-1">
                                  {product.tags.map((tag, idx) => (
                                    <Badge 
                                      key={idx} 
                                      variant={tag === "Bestseller" || tag === "New" ? "default" : "outline"}
                                      className={`text-[10px] ${tag === "Bestseller" ? "bg-accent text-accent-foreground" : ""}`}
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <CardTitle className="text-sm font-medium">{product.name}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-3 pt-0 pb-1">
                                <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                                <div className="flex items-center mt-2 text-xs">
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="ml-1 font-medium">{product.rating}</span>
                                  </div>
                                  <span className="mx-1 text-gray-400">•</span>
                                  <span className="text-gray-500">{product.reviewCount} reviews</span>
                                </div>
                              </CardContent>
                              <CardFooter className="p-3 pt-1 flex justify-between items-center">
                                <div className="font-semibold">${product.price}</div>
                                <Button size="sm">View Details</Button>
                              </CardFooter>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <Card className="bg-primary-50 border-primary-100 mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-primary-800 mb-2">Why These Products?</h3>
              <p className="text-sm text-gray-700">
                These recommendations are personalized based on your fertility goals, symptoms, and preferences.
                We only suggest non-toxic, high-quality products.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Products;
