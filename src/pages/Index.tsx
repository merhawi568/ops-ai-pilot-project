
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { SummaryStatusPanel } from '@/components/SummaryStatusPanel';
import { NextBestActionPanel } from '@/components/NextBestActionPanel';
import { ApplicationDetailPanel } from '@/components/ApplicationDetailPanel';
import { VoiceChatAssistant } from '@/components/VoiceChatAssistant';
import { SystemInsightsModal } from '@/components/SystemInsightsModal';
import { OpsMap } from '@/components/OpsMap';
import { AIAgentRecommendations } from '@/components/AIAgentRecommendations';
import { useApplicationStore } from '@/store/useApplicationStore';

const Index = () => {
  const { selectedApplication} = useApplicationStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IntelliOPS</h1>
              <p className="text-sm text-gray-600">Persona - Client Onboarding</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={` mx-auto px-6 py-6 transition-all duration-300 ${
        selectedApplication ? '' : ''
      }`}>
        {/* Summary Status */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6 w-full">
          {/* AI Agent Recommendations - Left Side */}
          <div className="lg:col-span-2 w-full">
            <AIAgentRecommendations />
          </div>

          {/* Next Best Action - Right Side */}
          <div className="lg:col-span-4 w-full">
            <NextBestActionPanel />
          </div>
          <div className="lg:col-span-1 w-full">
            <SummaryStatusPanel />
          </div>
         </div>
      </main>

      {/* Side Panel */}
      {selectedApplication && (
        <ApplicationDetailPanel application={selectedApplication} />
      )}

      {/* Voice Chat Assistant */}
      <VoiceChatAssistant />

    </div>
  );
};

export default Index;
