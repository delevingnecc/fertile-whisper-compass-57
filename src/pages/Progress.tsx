import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CarouselNext
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import {
  Thermometer,
  HeartPulse,
  Bed,
  Gauge
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Progress = () => {
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
    { day: 21, temp: 98.0, estrogen: 20, progesterone: 40, fertile: false },
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
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header title="Your Journey" />
      
      <div className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-full">
          {/* Swipeable Dashboard */}
          <div className="p-4 pb-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1">Hello, Sarah</h2>
              <p className="text-sm text-gray-300">Cycle Day {currentCycleDay} • May 18, 2023</p>
            </div>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
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
                              tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 10}}
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
                              tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 10}}
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
                        <span className="text-lg font-bold">{hrvData[hrvData.length-1].hrv} ms</span>
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
                              tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 10}}
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
                              tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 10}}
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
                          <Progress value={readinessScore} className="h-3 bg-gray-700" />
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
                              tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 10}}
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
              <div className="mt-2 flex justify-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <div 
                    key={index} 
                    className={`h-1 w-8 rounded-full ${index === 0 ? 'bg-primary-400' : 'bg-gray-600'}`}
                  />
                ))}
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
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 mr-3 flex-shrink-0 ${
                          milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
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
    </div>
  );
};

export default Progress;
