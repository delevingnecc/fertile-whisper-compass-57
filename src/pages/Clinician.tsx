
import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, Calendar } from 'lucide-react';

const Clinician = () => {
  const clinicians = [
    {
      id: 1,
      name: "Dr. Emily Roberts",
      specialty: "Reproductive Endocrinologist",
      location: "Boston, MA",
      distance: "2.3 miles away",
      rating: 4.9,
      reviewCount: 124,
      image: "/clinicians/doctor1.png",
      insurance: ["Blue Cross", "Cigna", "Aetna"],
      nextAvailable: "May 25"
    },
    {
      id: 2,
      name: "Dr. David Wilson",
      specialty: "Fertility Specialist",
      location: "Boston, MA",
      distance: "3.7 miles away",
      rating: 4.7,
      reviewCount: 98,
      image: "/clinicians/doctor2.png",
      insurance: ["United Healthcare", "Harvard Pilgrim"],
      nextAvailable: "May 28"
    },
    {
      id: 3,
      name: "Dr. Lisa Chen",
      specialty: "OB/GYN, Fertility Focus",
      location: "Cambridge, MA",
      distance: "5.1 miles away",
      rating: 4.8,
      reviewCount: 156,
      image: "/clinicians/doctor3.png",
      insurance: ["Blue Cross", "Medicare", "Tufts"],
      nextAvailable: "May 23"
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Clinician Access" />
      
      <div className="flex-1 pt-16 pb-20">
        <div className="px-4 py-6">
          <div className="relative mb-6">
            <Input 
              placeholder="Search by specialty, name, or location..." 
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="bg-primary-50 p-4 rounded-lg mb-6 border border-primary-100">
            <h3 className="font-semibold text-primary-800 mb-2">Premium Clinician Review</h3>
            <p className="text-sm text-gray-700 mb-3">Get a personalized 30-minute consultation with a fertility specialist who will review your AI-generated health profile.</p>
            <Button className="w-full bg-primary hover:bg-primary-700">Learn More</Button>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Recommended Specialists</h2>
          
          {clinicians.map(clinician => (
            <Card key={clinician.id} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex">
                  <Avatar className="h-12 w-12 mr-4">
                    {clinician.image ? (
                      <AvatarImage src={clinician.image} alt={clinician.name} />
                    ) : null}
                    <AvatarFallback>{clinician.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-semibold">{clinician.name}</CardTitle>
                    <CardDescription className="text-sm">{clinician.specialty}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="py-2">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{clinician.location} • <span className="text-xs">{clinician.distance}</span></span>
                </div>
                
                <div className="flex items-center text-sm mb-3">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium mr-1">{clinician.rating}</span>
                  <span className="text-gray-500 text-xs">({clinician.reviewCount} reviews)</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {clinician.insurance.map((ins, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                      {ins}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 flex justify-between items-center">
                <div className="flex items-center text-xs">
                  <Calendar className="h-3 w-3 mr-1 text-primary" />
                  <span>Next available: {clinician.nextAvailable}</span>
                </div>
                <Button size="sm">Book Consultation</Button>
              </CardFooter>
            </Card>
          ))}
          
          <div className="text-center mt-6">
            <Button variant="outline" className="w-full">View All Specialists</Button>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Clinician;
