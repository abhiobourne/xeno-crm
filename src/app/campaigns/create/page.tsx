import React from 'react';
import { RuleBuilder } from '@/app/components/RuleBuilder';
import { v4 as uuidv4 } from 'uuid';
import { RuleGroup, Campaign } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function CreateCampaign() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [rules, setRules] = React.useState<RuleGroup>({
    id: uuidv4(),
    combinator: 'AND',
    rules: [],
  });
  const [audienceSize, setAudienceSize] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const previewAudience = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rules }),
      });
      const data = await response.json();
      setAudienceSize(data.size);
    } catch (error) {
      console.error('Failed to preview audience:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          message,
          rules,
          audienceSize: audienceSize || 0,
        }),
      });
      
      if (response.ok) {
        router.push('/campaigns');
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Campaign</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter campaign name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Message Template
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Hi {name}, here's your personalized message!"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Audience Rules
          </label>
          <RuleBuilder value={rules} onChange={setRules} />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={previewAudience}
            disabled={loading || rules.rules.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Preview Audience
          </button>
          {audienceSize !== null && (
            <span className="text-sm">
              Estimated audience size: {audienceSize} users
            </span>
          )}
        </div>

        <button
          onClick={createCampaign}
          disabled={loading || !name || !message || rules.rules.length === 0}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Create Campaign
        </button>
      </div>
    </div>
  );
} 