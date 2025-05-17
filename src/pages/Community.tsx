
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, Bookmark, PenSquare } from 'lucide-react';

const Community = () => {
  const navigate = useNavigate();
  
  const topicGroups = [
    {
      category: "Popular Topics",
      topics: [
        { id: 1, name: "Period Support", icon: "🩸", postCount: 153 },
        { id: 2, name: "Egg Freezing", icon: "❄️", postCount: 87 },
        { id: 3, name: "PCOS", icon: "🔬", postCount: 124 },
        { id: 4, name: "Endometriosis", icon: "🌱", postCount: 96 },
      ]
    },
    {
      category: "Local Groups",
      topics: [
        { id: 5, name: "Boston", icon: "🏙️", postCount: 53 },
        { id: 6, name: "NYC", icon: "🗽", postCount: 137 },
        { id: 7, name: "San Francisco", icon: "🌉", postCount: 85 },
        { id: 8, name: "Los Angeles", icon: "🏝️", postCount: 72 },
      ]
    }
  ];
  
  const discussionPosts = [
    {
      id: 1,
      author: "Michelle S.",
      avatar: "/avatars/michelle.png",
      title: "Has anyone tried seed cycling for hormone balance?",
      content: "I've been reading about seed cycling to help with hormone balance throughout my cycle. Has anyone tried this and seen improvements?",
      likes: 24,
      comments: 13,
      timeAgo: "2h ago"
    },
    {
      id: 2,
      author: "Anonymous",
      title: "Dealing with endometriosis pain",
      content: "I was recently diagnosed with endometriosis and I'm struggling with the pain. What remedies have helped you the most?",
      likes: 36,
      comments: 21,
      timeAgo: "6h ago"
    },
    {
      id: 3,
      author: "Janice T.",
      avatar: "/avatars/janice.png",
      title: "IVF journey - 2nd round starting",
      content: "Starting my second round of IVF next week. Anyone else in the same boat? Looking for support and tips.",
      likes: 42,
      comments: 17,
      timeAgo: "1d ago"
    }
  ];
  
  const expertTalks = [
    {
      id: 1,
      expert: "Dr. Sarah Johnson",
      title: "Understanding Your Cycle",
      specialty: "Reproductive Endocrinologist",
      date: "May 22, 2023",
      image: "/experts/dr-sarah.png"
    },
    {
      id: 2,
      expert: "Dr. Michael Chen",
      title: "Nutrition and Fertility",
      specialty: "Nutritionist",
      date: "May 18, 2023",
      image: "/experts/dr-michael.png"
    }
  ];

  const handleNewPost = () => {
    navigate('/community/new-post');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Community" />
      
      <div className="flex-1 pt-16 pb-20">
        <div className="px-4 py-6">
          <Tabs defaultValue="discussions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="experts">Expert Talks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="discussions" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Discussions</h3>
                <Button variant="outline" size="sm" onClick={handleNewPost}>
                  <PenSquare className="h-4 w-4 mr-2" /> New Post
                </Button>
              </div>
              
              {discussionPosts.map(post => (
                <Card key={post.id} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          {post.avatar ? (
                            <AvatarImage src={post.avatar} alt={post.author} />
                          ) : null}
                          <AvatarFallback className="bg-primary-100 text-primary-700">
                            {post.author === "Anonymous" ? "A" : post.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-sm font-medium">{post.author}</CardTitle>
                          <CardDescription className="text-xs">{post.timeAgo}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <h4 className="font-medium mb-1">{post.title}</h4>
                    <p className="text-sm text-gray-700">{post.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Button variant="ghost" size="sm" className="text-xs p-1">
                        <ThumbsUp className="h-3 w-3 mr-1" /> {post.likes}
                      </Button>
                      <span className="mx-2">•</span>
                      <Button variant="ghost" size="sm" className="text-xs p-1">
                        <MessageSquare className="h-3 w-3 mr-1" /> {post.comments}
                      </Button>
                    </div>
                    <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                      View Discussion
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="topics">
              {topicGroups.map((group, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-medium mb-3">{group.category}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {group.topics.map(topic => (
                      <Card key={topic.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center">
                          <div className="text-2xl mr-3">{topic.icon}</div>
                          <div>
                            <h4 className="font-medium text-sm">{topic.name}</h4>
                            <p className="text-xs text-gray-500">{topic.postCount} posts</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="experts">
              <h3 className="text-lg font-medium mb-3">Upcoming Expert Talks</h3>
              {expertTalks.map(talk => (
                <Card key={talk.id} className="mb-4">
                  <div className="flex">
                    <div className="w-1/3 bg-gray-100 rounded-l-lg">
                      <div className="h-full flex items-center justify-center p-2">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium text-primary">
                          {talk.expert.split(" ").map(name => name[0]).join("")}
                        </div>
                      </div>
                    </div>
                    <div className="w-2/3 p-4">
                      <h4 className="font-medium text-primary">{talk.title}</h4>
                      <p className="text-sm mb-1">{talk.expert}</p>
                      <p className="text-xs text-gray-500 mb-2">{talk.specialty}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">
                          {talk.date}
                        </span>
                        <Button size="sm" variant="outline">Register</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Community;
