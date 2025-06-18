
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import BrowsePrompts from '@/pages/BrowsePrompts';
import MyPrompts from '@/pages/MyPrompts';
import CreatePrompt from '@/pages/CreatePrompt';
import PromptDetail from '@/pages/PromptDetail';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/prompts" element={<BrowsePrompts />} />
              <Route path="/prompts/:id" element={<PromptDetail />} />
              <Route path="/my-prompts" element={<MyPrompts />} />
              <Route path="/prompts/create" element={<CreatePrompt />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
