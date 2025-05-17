import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestKitPromoCard from '@/components/TestKitPromoCard';
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
  ReferenceLine
} from 'recharts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  Thermometer,
  HeartPulse,
  Bed,
  Gauge,
  Check,
  Upload,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Progress = () => {
  // State for modal displays
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("prepare");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [testResultImage, setTestResultImage] = useState<string | null>(null);

  // State to track the current carousel slide index
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);

  // Set up callback for when the carousel changes slide
  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  // Mock data for dashboard cards
  const cycleData = [
    { day: 1, temp: 97.3, estrogen: 25, progesterone: 5, fertile: false },
    { day: 2, temp: 97.2, estrogen: 30, progesterone: 5, fertile: false },
    { day: 3, temp: 97.1, estrogen: 35, progesterone: 5, fertile: false },
    { day: 4, temp: 97.0, estrogen: 40, progesterone: 5, fertile: false },
    { day: 5, temp: 97.3, estrogen: 45, progesterone: 5, fertile: false },
    { day: 6, temp: 97.4, estrogen: 55, progesterone: 5, fertile: false },
    { day: 7, temp: 97.6, estrogen: 65, progesterone: 5, fertile: false },
    { day: 8, temp: 97.8, estrogen: 75, progesterone: 5, fertile: true },
    { day: 9, temp: 98.0, estrogen: 85, progesterone: 5, fertile: true },
    { day: 10, temp: 98.1, estrogen: 90, progesterone: 5, fertile: true },
    { day: 11, temp: 98.3, estrogen: 95, progesterone: 5, fertile: true },
    { day: 12, temp: 98.4, estrogen: 85, progesterone: 10, fertile: true },
    { day: 13, temp: 98.6, estrogen: 75, progesterone: 15, fertile: false },
    { day: 14, temp: 98.6, estrogen: 60, progesterone: 25, fertile: false },
    { day: 15, temp: 98.5, estrogen: 50, progesterone: 40, fertile: false },
    { day: 16, temp: 98.5, estrogen: 45, progesterone: 50, fertile: false },
    { day: 17, temp: 98.4, estrogen: 40, progesterone: 60, fertile: false },
    { day: 18, temp: 98.3, estrogen: 35, progesterone: 55, fertile: false },
    { day: 19, temp: 98.2, estrogen: 30, progesterone: 50, fertile: false },
    { day: 20, temp: 98.1, estrogen: 25, progesterone: 45, fertile: false },
  ];

  // Current cycle day (mock)
  const currentCycleDay = 11;

  // Heart Rate Variability data
  const hrvData = [
    { day: 'May 12', hrv: 45 },
    { day: 'May 13', hrv: 42 },
    { day: 'May 14', hrv: 48 },
    { day: 'May 15', hrv: 51 },
    { day: 'May 16', hrv: 47 },
    { day: 'May 17', hrv: 53 },
    { day: 'May 18', hrv: 58 },
  ];

  // Temperature data
  const tempData = [
    { day: 'May 12', deviation: -0.1 },
    { day: 'May 13', deviation: -0.2 },
    { day: 'May 14', deviation: 0 },
    { day: 'May 15', deviation: 0.1 },
    { day: 'May 16', deviation: 0.3 },
    { day: 'May 17', deviation: 0.4 },
    { day: 'May 18', deviation: 0.4 },
  ];

  // Sleep data
  const sleepData = [
    { day: 'May 12', deep: 1.2, rem: 1.5 },
    { day: 'May 13', deep: 1.0, rem: 1.3 },
    { day: 'May 14', deep: 1.4, rem: 1.8 },
    { day: 'May 15', deep: 1.3, rem: 1.6 },
    { day: 'May 16', deep: 1.1, rem: 1.4 },
    { day: 'May 17', deep: 1.5, rem: 1.7 },
    { day: 'May 18', deep: 1.3, rem: 1.6 },
  ];

  // Readiness score
  const readinessScore = 82;
  const readinessHistory = [
    { day: 'May 12', score: 75 },
    { day: 'May 13', score: 72 },
    { day: 'May 14', score: 78 },
    { day: 'May 15', score: 81 },
    { day: 'May 16', score: 77 },
    { day: 'May 17', score: 80 },
    { day: 'May 18', score: 82 },
  ];

  // Existing data from the original component
  const insightCards = [
    {
      title: "Cycle Regularity",
      score: "Good",
      description: "Your cycles have been consistent over the last 3 months.",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Luteal Phase",
      score: "Moderate",
      description: "Your luteal phase has varied between 11-13 days.",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "PMS Symptoms",
      score: "Improved",
      description: "Your reported PMS symptoms have decreased by 30%.",
      color: "bg-blue-100 text-blue-800",
    }
  ];

  const milestones = [
    {
      title: "Consistent Tracking",
      description: "You've tracked your cycle for 3 consecutive months",
      completed: true,
      date: "Apr 15, 2023"
    },
    {
      title: "Symptom Journal",
      description: "You've logged symptoms for 30 days",
      completed: true,
      date: "Apr 28, 2023"
    },
    {
      title: "Fertility Knowledge",
      description: "Complete 5 fertility education modules",
      completed: false,
      progress: "3/5"
    }
  ];

  const formatCycleDay = (day: number) => {
    const suffix = ['th', 'st', 'nd', 'rd'];
    const value = day % 100;
    return day + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
  };

  // Chart slide titles for navigation
  const slideData = [
    { title: "Cycle Insights", icon: null },
    { title: "Heart Rate Variability", icon: HeartPulse },
    { title: "Skin Temperature", icon: Thermometer },
    { title: "Sleep Quality", icon: Bed },
    { title: "Readiness Score", icon: Gauge }
  ];

  // Pricing plans data
  const pricingPlans = [
    {
      id: "discovery",
      name: "Discovery",
      price: 79,
      originalPrice: 99,
      description: "Basic hormone screening with personalized insights",
      features: [
        "Cortisol level testing",
        "Thyroid screening (TSH)",
        "Basic nutrient panel",
        "Digital results within 5 days",
        "Basic recommendations"
      ],
      recommended: false
    },
    {
      id: "prepare",
      name: "Prepare",
      price: 129,
      originalPrice: 169,
      description: "Comprehensive hormone and fertility assessment",
      features: [
        "Full hormone panel",
        "Thyroid complete panel",
        "Comprehensive nutrient testing",
        "Digital results within 3 days",
        "Detailed health recommendations",
        "15-min consultation with specialist"
      ],
      recommended: true
    },
    {
      id: "launch",
      name: "Launch",
      price: 199,
      originalPrice: 249,
      description: "Advanced testing with personalized treatment plan",
      features: [
        "Complete hormone profile",
        "Thyroid & adrenal function",
        "Advanced nutrient & metabolic panel",
        "Digital results within 2 days",
        "Customized treatment plan",
        "30-min consultation with specialist",
        "3 months follow-up support"
      ],
      recommended: false
    }
  ];

  // Mock credit card processing function
  const processPayment = () => {
    // Simulate a payment processing delay
    setTimeout(() => {
      setShowCheckoutDialog(false);
      setHasPurchased(true);
    }, 1500);
  };

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTestResultImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setShowUploadDialog(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header title="Your Journey" />

      <div className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-full">
          <div className="p-4 pb-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1">Hello, Sarah</h2>
              <p className="text-sm text-gray-300">Cycle Day {currentCycleDay} • May 18, 2023</p>
            </div>

            {/* Test Kit Promotional Card */}
            <TestKitPromoCard />

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent>
                {/* Cycle Insights Card */}
                <CarouselItem className="sm:basis-4/5 lg:basis-3/5">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-primary-300 flex items-center gap-2">
                        Cycle Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-[140px]">
                        <ChartContainer
                          config={{
                            temp: {
                              label: "Temperature",
                              color: '#7F56D9'
                            },
                            estrogen: {
                              label: "Estrogen",
                              color: '#F9DA72'
                            },
                            progesterone: {
                              label: "Progesterone",
                              color: '#53389E'
                            },
                          }}
                          className="w-full h-full"
                        >
                          <LineChart
                            data={cycleData.filter(d => d.day >= currentCycleDay - 7 && d.day <= currentCycleDay + 7)}
                            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                          >
                            <XAxis
                              dataKey="day"
                              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                            />
                            <Line
                              type="monotone"
                              dataKey="temp"
                              stroke="var(--color-temp)"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4, fill: '#7F56D9' }}
                            />
                            <Line
                              type="monotone"
                              dataKey="estrogen"
                              stroke="var(--color-estrogen)"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4, fill: '#F9DA72' }}
                            />
                            <Line
                              type="monotone"
                              dataKey="progesterone"
                              stroke="var(--color-progesterone)"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4, fill: '#53389E' }}
                            />
                            <ReferenceLine
                              x={currentCycleDay}
                              stroke="rgba(255,255,255,0.4)"
                              strokeDasharray="3 3"
                            />
                          </LineChart>
                        </ChartContainer>
                      </div>
                      <p className="mt-3 text-sm text-accent-300 font-medium">
                        You are in your estimated fertile window
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                {/* Heart Rate Variability Card */}
                <CarouselItem className="sm:basis-4/5 lg:basis-3/5">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-primary-300 flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" />
                        Heart Rate Variability
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-[140px]">
                        <ChartContainer
                          config={{
                            hrv: {
                              label: "HRV",
                              color: '#F9DA72'
                            }
                          }}
                          className="w-full h-full"
                        >
                          <LineChart
                            data={hrvData}
                            margin={{ top: 15, right: 5, left: 0, bottom: 5 }}
                          >
                            <XAxis
                              dataKey="day"
                              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                            />
                            <Line
                              type="monotone"
                              dataKey="hrv"
                              stroke="var(--color-hrv)"
                              strokeWidth={2}
                              dot={{ fill: '#F9DA72', r: 3 }}
                              activeDot={{ r: 5, fill: '#F9DA72' }}
                            />
                          </LineChart>
                        </ChartContainer>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-sm text-accent-300 font-medium">Your HRV is recovering well today</p>
                        <span className="text-lg font-bold">{hrvData[hrvData.length - 1].hrv} ms</span>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>

                {/* Temperature Card */}
                <CarouselItem className="sm:basis-4/5 lg:basis-3/5">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-primary-300 flex items-center gap-2">
                        <Thermometer className="h-4 w-4" />
                        Skin Temperature
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-[140px]">
                        <ChartContainer
                          config={{
                            deviation: {
                              label: "Temperature Deviation",
                              color: '#7F56D9'
                            }
                          }}
                          className="w-full h-full"
                        >
                          <BarChart
                            data={tempData}
                            margin={{ top: 15, right: 5, left: 0, bottom: 5 }}
                          >
                            <XAxis
                              dataKey="day"
                              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis hide domain={[-0.3, 0.5]} />
                            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                            />
                            <Bar
                              dataKey="deviation"
                              fill="#7F56D9"
                              radius={[4, 4, 0, 0]}
                              barSize={16}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                      <p className="mt-3 text-sm text-accent-300 font-medium">
                        Ovulatory shift detected
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                {/* Sleep Quality Card */}
                <CarouselItem className="sm:basis-4/5 lg:basis-3/5">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-primary-300 flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        Sleep Quality
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-[140px]">
                        <ChartContainer
                          config={{
                            deep: {
                              label: "Deep Sleep",
                              color: '#7F56D9'
                            },
                            rem: {
                              label: "REM Sleep",
                              color: '#F9DA72'
                            }
                          }}
                          className="w-full h-full"
                        >
                          <BarChart
                            data={sleepData}
                            margin={{ top: 15, right: 5, left: 0, bottom: 5 }}
                            barGap={2}
                          >
                            <XAxis
                              dataKey="day"
                              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis hide domain={[0, 3]} />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                            />
                            <Bar
                              dataKey="deep"
                              fill="#7F56D9"
                              radius={[4, 4, 0, 0]}
                              barSize={10}
                            />
                            <Bar
                              dataKey="rem"
                              fill="#F9DA72"
                              radius={[4, 4, 0, 0]}
                              barSize={10}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                      <p className="mt-3 text-sm text-accent-300 font-medium">
                        You're getting consistent deep sleep
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                {/* Readiness Score Card */}
                <CarouselItem className="sm:basis-4/5 lg:basis-3/5">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-primary-300 flex items-center gap-2">
                        <Gauge className="h-4 w-4" />
                        Readiness Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl font-bold">{readinessScore}</div>
                        <div className="w-1/2">
                          <ProgressBar value={readinessScore} className="h-3 bg-gray-700" />
                        </div>
                      </div>
                      <div className="h-[90px]">
                        <ChartContainer
                          config={{
                            score: {
                              label: "Score",
                              color: '#F9DA72'
                            }
                          }}
                          className="w-full h-full"
                        >
                          <LineChart
                            data={readinessHistory}
                            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                          >
                            <XAxis
                              dataKey="day"
                              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="var(--color-score)"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4, fill: '#F9DA72' }}
                            />
                          </LineChart>
                        </ChartContainer>
                      </div>
                      <p className="mt-2 text-sm text-accent-300 font-medium">
                        Your body is ready to recover today
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>

              <div className="flex justify-center mt-4 items-center gap-2">
                <CarouselPrevious className="static translate-y-0 ml-0 bg-white/20 hover:bg-white/30" />
                <div className="flex gap-1">
                  {slideData.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-8 rounded-full cursor-pointer transition-colors ${currentSlide === index ? "bg-primary-400" : "bg-gray-600"
                        }`}
                      onClick={() => api?.scrollTo(index)}
                    />
                  ))}
                </div>
                <CarouselNext className="static translate-y-0 mr-0 bg-white/20 hover:bg-white/30" />
              </div>
            </Carousel>
          </div>

          {/* Original Content - Tabs */}
          <div className="px-4 py-6 bg-white text-gray-900 rounded-t-3xl mt-4">
            <Tabs defaultValue="insights" className="mb-6">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-4">
                {insightCards.map((card, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{card.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${card.color}`}>
                          {card.score}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{card.description}</p>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">View Full Analysis</Button>
              </TabsContent>

              <TabsContent value="milestones">
                {milestones.map((milestone, index) => (
                  <Card key={index} className={`mb-3 ${milestone.completed ? 'border-green-200' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0 ${milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                          {milestone.completed ? '✓' : '○'}
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{milestone.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">{milestone.description}</p>
                          {milestone.completed ? (
                            <p className="text-xs text-gray-500">Completed on {milestone.date}</p>
                          ) : (
                            <p className="text-xs text-primary-600">In progress: {milestone.progress}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="history">
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">Your cycle history will appear here</p>
                  <Button>Start Tracking</Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Test Kit Promotional Card or Upload Result Card */}
            {!hasPurchased ? (
              <Card className="bg-gradient-to-br from-primary-100 to-primary-50 border-primary-200 mb-4 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className="bg-primary-200 p-4 flex items-center justify-center">
                      <img
                        src="/test-kit-icon.svg"
                        alt="Test Kit"
                        className="h-16 w-16"
                        onError={(e) => {
                          // Fallback in case the image doesn't exist
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%237F56D9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M8 6l6 6M8 12l6-6'/%3e%3ccircle cx='12' cy='12' r='10'/%3e%3c/svg%3e";
                        }}
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-primary-800">Complete Health Screening</h3>
                        <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">New</span>
                      </div>
                      <p className="text-sm text-primary-700 mb-3">Our at-home test kit analyzes hormonal balance, nutrient levels, and fertility markers for personalized health insights.</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-primary-800">$189</span>
                          <span className="text-xs text-gray-500 line-through ml-2">$249</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-600 ml-1">(124)</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowPlanDialog(true)}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                      >
                        Start Your Journey Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {testResultImage ? (
                      <div className="bg-white p-2 rounded-lg border border-green-200">
                        <img
                          src={testResultImage}
                          alt="Test Results"
                          className="h-16 w-16 object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="bg-green-200 h-14 w-14 rounded-full flex items-center justify-center">
                        <Upload className="h-6 w-6 text-green-700" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800 mb-1">
                        {testResultImage ? "Test Results Uploaded" : "Upload Your Test Results"}
                      </h3>
                      <p className="text-sm text-green-700 mb-3">
                        {testResultImage
                          ? "Our team is analyzing your sample. You'll receive personalized insights within 48 hours."
                          : "Your test kit has been shipped! Once you complete your test, upload the results to receive personalized insights."}
                      </p>
                      {!testResultImage && (
                        <Button
                          onClick={() => setShowUploadDialog(true)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          Upload Results
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-primary-50 border-primary-100">
              <CardContent className="p-4">
                <h3 className="font-semibold text-primary-800 mb-2">Did you know?</h3>
                <p className="text-sm text-gray-700 mb-4">Tracking your basal body temperature can help identify your most fertile days.</p>
                <Button variant="link" className="p-0 h-auto text-primary-700">Learn more about fertility tracking →</Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      <BottomNavigation />

      {/* Pricing Plans Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Choose Your Health Screening Plan</DialogTitle>
            <DialogDescription>
              Select the plan that best fits your health needs and goals
            </DialogDescription>
          </DialogHeader>

          <div className="px-6">
            <div className="flex space-x-2 mb-6">
              {pricingPlans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`py-1 px-4 rounded-full text-sm ${selectedPlan === plan.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {plan.name}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="max-h-[60vh]">
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pricingPlans.map(plan => (
                  <Card
                    key={plan.id}
                    className={`relative ${selectedPlan === plan.id
                      ? 'border-primary ring-2 ring-primary ring-opacity-50'
                      : 'border-gray-200'
                      }`}
                  >
                    {plan.recommended && (
                      <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                        <Badge className="bg-primary text-white mx-auto block w-max">Recommended</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex justify-between items-baseline">
                        <span>{plan.name}</span>
                        <div className="text-right">
                          <span className="text-lg">${plan.price}</span>
                          {plan.originalPrice && (
                            <span className="text-xs text-gray-500 line-through ml-1">${plan.originalPrice}</span>
                          )}
                        </div>
                      </CardTitle>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full mt-4 ${selectedPlan === plan.id ? 'bg-primary' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        onClick={() => {
                          setSelectedPlan(plan.id);
                          setShowPlanDialog(false);
                          setShowCheckoutDialog(true);
                        }}
                      >
                        Choose This Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Secure Checkout
            </DialogTitle>
            <DialogDescription>
              Enter your payment details to complete your order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">
                    {pricingPlans.find(p => p.id === selectedPlan)?.name} Plan
                  </h4>
                  <span className="text-sm text-gray-500">Health screening kit</span>
                </div>
                <span className="font-bold">
                  ${pricingPlans.find(p => p.id === selectedPlan)?.price}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="First Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Last Name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input id="zip" placeholder="12345" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ShieldCheck className="h-4 w-4" />
              <span>Your payment info is secure and encrypted</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCheckoutDialog(false);
                setShowPlanDialog(true);
              }}
            >
              Back
            </Button>
            <Button onClick={processPayment}>
              Complete Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Results Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Test Results</DialogTitle>
            <DialogDescription>
              Please upload a clear photo of your test kit results
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-4">Drag and drop your image here or click to browse</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="result-upload"
              />
              <Button asChild>
                <label htmlFor="result-upload">Select Image</label>
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, or HEIC. Maximum file size: 10MB
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button disabled>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Progress;
