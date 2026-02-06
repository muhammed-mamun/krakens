'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Step {
  id: number;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  route?: string;
}

interface GettingStartedProps {
  hasDomains: boolean;
  hasAPIKeys: boolean;
  hasTrackedEvents: boolean;
}

export default function GettingStarted({ hasDomains, hasAPIKeys, hasTrackedEvents }: GettingStartedProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const steps: Step[] = [
    {
      id: 1,
      title: 'Add Your First Domain',
      description: 'Register the website you want to track analytics for',
      action: 'Add Domain',
      completed: hasDomains,
      route: '/domains',
    },
    {
      id: 2,
      title: 'Generate API Key',
      description: 'Create an API key to authenticate tracking requests',
      action: 'Generate Key',
      completed: hasAPIKeys,
      route: '/api-keys',
    },
    {
      id: 3,
      title: 'Install Tracking Code',
      description: 'Add the tracking script to your website',
      action: 'View Instructions',
      completed: hasTrackedEvents,
      route: '/api-keys',
    },
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const allCompleted = completedSteps === steps.length;

  if (dismissed || allCompleted) return null;

  return (
    <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            🚀 Getting Started with Herodotus
          </h3>
          <p className="text-sm text-gray-600">
            Complete these steps to start tracking your website analytics
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span className="font-medium">{completedSteps} of {steps.length} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center justify-between p-4 rounded-lg ${
              step.completed
                ? 'bg-green-50 border border-green-200'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.completed ? '✓' : step.id}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
            {!step.completed && (
              <button
                onClick={() => step.route && router.push(step.route)}
                className="btn btn-primary text-sm"
              >
                {step.action}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
