
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Available tags for the community
const availableTags = [
  { id: 'egg-freezing', label: 'Egg Freezing' },
  { id: 'fertility', label: 'Fertility' },
  { id: 'period-pain', label: 'Period Pain' },
  { id: 'pcos', label: 'PCOS' },
  { id: 'endometriosis', label: 'Endometriosis' },
  { id: 'ivf', label: 'IVF' },
  { id: 'pregnancy', label: 'Pregnancy' },
  { id: 'menopause', label: 'Menopause' },
  { id: 'hormone-balance', label: 'Hormone Balance' },
  { id: 'mental-health', label: 'Mental Health' }
];

// Form validation schema
const formSchema = z.object({
  question: z
    .string()
    .min(5, { message: 'Question must be at least 5 characters.' })
    .max(100, { message: 'Question cannot exceed 100 characters.' }),
  content: z
    .string()
    .min(10, { message: 'Please share a bit more about your thoughts or journey.' })
    .max(2000, { message: 'Content cannot exceed 2000 characters.' }),
  tags: z.array(z.string()).min(1, { message: 'Please select at least one topic.' }),
  isAnonymous: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const NewCommunityPost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tagInput, setTagInput] = useState<string>('');
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      content: '',
      tags: [],
      isAnonymous: false,
    },
  });
  
  const selectedTags = form.watch('tags');

  // Filter available tags based on input
  const filteredTags = availableTags.filter(
    tag => tag.label.toLowerCase().includes(tagInput.toLowerCase()) && 
    !selectedTags.includes(tag.id)
  );
  
  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    const currentTags = form.getValues('tags');
    if (!currentTags.includes(tagId)) {
      form.setValue('tags', [...currentTags, tagId], { shouldValidate: true });
    }
    setTagInput('');
  };
  
  // Handle tag removal
  const handleTagRemove = (tagId: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', 
      currentTags.filter(id => id !== tagId),
      { shouldValidate: true }
    );
  };
  
  // Get tag label by ID
  const getTagLabel = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId);
    return tag ? tag.label : tagId;
  };
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    
    // Here you would normally send this data to your backend
    
    // Show success message
    toast({
      title: "Post created",
      description: "Your post has been shared with the community.",
    });
    
    // Navigate back to community page
    navigate('/community');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="New Post" hasBackButton />
      
      <div className="flex-1 pt-16 pb-20 px-4">
        <div className="max-w-md mx-auto py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Question Field */}
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Question</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ask your question here..." 
                        className="h-12 text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tags Field */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Topic/Tags</Label>
                
                {/* Selected Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map(tagId => (
                    <div 
                      key={tagId}
                      className="bg-primary-light text-primary px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                    >
                      {getTagLabel(tagId)}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tagId)}
                        className="text-primary hover:bg-primary-lighter rounded-full p-0.5"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Tag Input */}
                <div className="relative">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Type to search topics..."
                    className="h-12 text-base"
                  />
                  
                  {/* Tag Suggestions Dropdown */}
                  {tagInput.length > 0 && filteredTags.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {filteredTags.map((tag) => (
                        <div
                          key={tag.id}
                          onClick={() => handleTagSelect(tag.id)}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                          {tag.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {form.formState.errors.tags && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {form.formState.errors.tags.message}
                  </p>
                )}
                
                {/* Tag Examples */}
                <div className="text-xs text-muted-foreground mt-1">
                  Examples: Egg Freezing, Fertility, Period Pain
                </div>
              </div>
              
              {/* Content Field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Share your thoughts or journey</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell your story or ask for advice..." 
                        className="min-h-[150px] text-base resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Anonymous Toggle */}
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Post anonymously</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Your name and profile picture won't be visible
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Submit Button */}
              <Button type="submit" className="w-full h-12 text-base font-medium">
                Share Post
              </Button>
            </form>
          </Form>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default NewCommunityPost;
