
import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = () => {
  // Mock data for charts
  const cycleData = [
    { day: 'May 1', temp: 97.3, symptoms: 2 },
    { day: 'May 2', temp: 97.2, symptoms: 1 },
    { day: 'May 3', temp: 97.5, symptoms: 1 },
    { day: 'May 4', temp: 97.6, symptoms: 0 },
    { day: 'May 5', temp: 97.8, symptoms: 0 },
    { day: 'May 6', temp: 97.9, symptoms: 0 },
    { day: 'May 7', temp: 98.0, symptoms: 1 },
    { day: 'May 8', temp: 98.2, symptoms: 2 },
    { day: 'May 9', temp: 98.0, symptoms: 3 },
    { day: 'May 10', temp: 97.9, symptoms: 2 },
    { day: 'May 11', temp: 97.8, symptoms: 1 },
    { day: 'May 12', temp: 97.7, symptoms: 1 },
    { day: 'May 13', temp: 97.5, symptoms: 0 },
    { day: 'May 14', temp: 97.4, symptoms: 0 },
  ];
  
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
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Your Journey" />
      
      <div className="flex-1 pt-16 pb-20">
        <div className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Hello, Sarah</h2>
            <p className="text-sm text-gray-600">Cycle Day 14 • May 18, 2023</p>
          </div>
          
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-primary-50 pb-2">
              <CardTitle className="text-base text-primary-800">Cycle Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-4">
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cycleData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <XAxis dataKey="day" tick={false} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'temp' ? 'Temperature' : 'Symptoms']}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#7F56D9" 
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="symptoms" 
                      stroke="#F9DA72" 
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 text-xs text-gray-500 mt-2">
                <div className="flex items-center">
                  <span className="block w-3 h-3 rounded-full bg-primary mr-1"></span>
                  Temperature
                </div>
                <div className="flex items-center">
                  <span className="block w-3 h-3 rounded-full bg-accent mr-1"></span>
                  Symptoms
                </div>
              </div>
            </CardContent>
          </Card>
          
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
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Progress;
