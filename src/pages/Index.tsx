
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { SummaryStatusPanel } from '@/components/SummaryStatusPanel';
import { NextBestActionPanel } from '@/components/NextBestActionPanel';
import { ApplicationDetailPanel } from '@/components/ApplicationDetailPanel';
import { VoiceChatAssistant } from '@/components/VoiceChatAssistant';
import { SystemInsightsModal } from '@/components/SystemInsightsModal';
import { AIAgentRecommendations } from '@/components/AIAgentRecommendations';
import { useApplicationStore } from '@/store/useApplicationStore';

const Index = () => {
  const { selectedApplication } = useApplicationStore();
  const [showSystemInsights, setShowSystemInsights] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Operations Platform</h1>
              <p className="text-sm text-gray-600">AI-Powered Client Onboarding Dashboard</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowSystemInsights(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              System Insights
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-6 py-6 transition-all duration-300 ${
        selectedApplication ? 'ml-96' : ''
      }`}>
        {/* Summary Status */}
        <SummaryStatusPanel />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* AI Agent Recommendations - Left Side */}
          <div className="lg:col-span-1">
            <AIAgentRecommendations />
          </div>
          
          {/* Next Best Action - Right Side */}
          <div className="lg:col-span-2">
            <NextBestActionPanel />
          </div>
        </div>
      </main>

      {/* Side Panel */}
      {selectedApplication && (
        <ApplicationDetailPanel application={selectedApplication} />
      )}

      {/* Voice Chat Assistant */}
      <VoiceChatAssistant />

      {/* System Insights Modal */}
      <SystemInsightsModal 
        isOpen={showSystemInsights} 
        onClose={() => setShowSystemInsights(false)} 
      />
    </div>
  );
};

export default Index;
