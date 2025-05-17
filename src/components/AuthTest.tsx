
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthProvider';
import { User } from '@supabase/supabase-js';

const AuthTest = () => {
  const { user, session } = useAuth();
  const [testResults, setTestResults] = useState<{
    name: string;
    success: boolean;
    message: string;
  }[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (name: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, { name, success, message }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };
  
  const testGetSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        addResult('Get Session', false, `Error: ${error.message}`);
        return;
      }
      
      if (data.session) {
        addResult('Get Session', true, `Session found. User ID: ${data.session.user.id}`);
      } else {
        addResult('Get Session', false, 'No session found. User is not authenticated.');
      }
    } catch (error) {
      addResult('Get Session', false, `Exception: ${(error as Error).message}`);
    }
  };

  const testUserContext = () => {
    if (user) {
      addResult('Auth Context', true, `User context is available. Email: ${user.email}`);
    } else {
      addResult('Auth Context', false, 'User context is not available.');
    }

    if (session) {
      addResult('Session Context', true, `Session context is available. Expires at: ${new Date(session.expires_at! * 1000).toLocaleString()}`);
    } else {
      addResult('Session Context', false, 'Session context is not available.');
    }
  };

  const testSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        addResult('Sign Out', false, `Error: ${error.message}`);
      } else {
        addResult('Sign Out', true, 'Successfully signed out');
      }
    } catch (error) {
      addResult('Sign Out', false, `Exception: ${(error as Error).message}`);
    }
  };

  const testSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (error) {
        addResult('Sign In', false, `Error: ${error.message}`);
      } else if (data.user) {
        addResult('Sign In', true, `Successfully signed in as ${data.user.email}`);
      }
    } catch (error) {
      addResult('Sign In', false, `Exception: ${(error as Error).message}`);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    clearResults();
    
    // Test Auth Context
    testUserContext();
    
    // Test Session
    await testGetSession();

    setLoading(false);
  };

  useEffect(() => {
    // Console log auth state for debugging
    console.log('[AuthTest] Current user:', user);
    console.log('[AuthTest] Current session:', session);
  }, [user, session]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Auth Tests</CardTitle>
        <CardDescription>Test your authentication implementation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button onClick={runAllTests} disabled={loading}>
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button onClick={testGetSession} variant="outline">
            Test getSession()
          </Button>
          <Button onClick={testUserContext} variant="outline">
            Test Auth Context
          </Button>
          <Button onClick={testSignOut} variant="outline">
            Test Sign Out
          </Button>
          <Button onClick={testSignIn} variant="outline" className="bg-primary text-white hover:bg-primary/90">
            Test Sign In (test@example.com)
          </Button>
          <Button onClick={clearResults} variant="ghost">
            Clear Results
          </Button>
        </div>
        
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Test Results</h3>
            {testResults.map((result, index) => (
              <Alert key={index} variant={result.success ? "default" : "destructive"}>
                <AlertTitle>{result.name}: {result.success ? "✅ Success" : "❌ Failed"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-medium">Current Authentication State</h3>
          <div className="mt-2 p-4 bg-gray-50 rounded-md">
            <p><strong>User Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
            {user && (
              <>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTest;
