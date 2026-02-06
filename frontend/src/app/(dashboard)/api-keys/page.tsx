'use client';

import { useState, useEffect } from 'react';
import { getAPIKeys, createAPIKey, revokeAPIKey, getDomains } from '@/lib/api';
import type { APIKey, Domain } from '@/types';
import { Card } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import Alert from '@/components/ui/Alert';

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [keysRes, domainsRes] = await Promise.all([getAPIKeys(), getDomains()]);
      setApiKeys(keysRes.data || []);
      setDomains(domainsRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setApiKeys([]);
      setDomains([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedDomains.length === 0) {
      setError('Please select at least one domain');
      return;
    }

    try {
      const { data } = await createAPIKey(selectedDomains);
      setNewlyCreatedKey(data.key);
      setSelectedDomains([]);
      setShowModal(false);
      setSuccess('API key generated successfully! Make sure to copy it now - you won\'t be able to see it again.');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create API key');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Websites using this key will stop tracking.')) return;

    try {
      await revokeAPIKey(id);
      setSuccess('API key revoked successfully');
      loadData();
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      setError('Failed to revoke API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const getInstallCode = (apiKey: string) => {
    const scriptUrl = process.env.NEXT_PUBLIC_FRONTEND_URL 
      ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/krakens.js`
      : `${window.location.origin}/krakens.js`;
    
    return `<!-- Krakens Analytics -->
<script src="${scriptUrl}"></script>
<script>
  Krakens.init('${apiKey}');
</script>`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">API Keys</h1>
          <p className="text-muted-foreground">Manage authentication keys for tracking</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowInstallModal(true)} className="btn btn-secondary">
            📖 Installation Guide
          </button>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn btn-primary"
            disabled={domains.length === 0}
          >
            + Generate API Key
          </button>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* No Domains Warning */}
      {domains.length === 0 && (
        <Alert
          type="warning"
          title="No domains found"
          message="You need to add a domain before you can generate API keys. Go to the Domains page to add one."
        />
      )}

      {/* Info Card */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">🔑</span>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">What are API keys?</h3>
            <p className="text-sm text-muted-foreground">
              API keys authenticate tracking requests from your website. Generate a key, add it to your website&apos;s code, and start collecting analytics data. Keep your keys secure!
            </p>
          </div>
        </div>
      </Card>

      {/* Newly Created Key Display */}
      {newlyCreatedKey && (
        <Card className="p-6 bg-success/5 border-2 border-success/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">✅ API Key Created!</h3>
              <p className="text-sm text-muted-foreground">
                Copy this key now - you won&apos;t be able to see it again for security reasons.
              </p>
            </div>
            <button
              onClick={() => setNewlyCreatedKey('')}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          <Card className="p-4 mb-4 bg-card">
            <code className="text-sm font-mono break-all">{newlyCreatedKey}</code>
          </Card>
          <div className="flex space-x-3">
            <button
              onClick={() => copyToClipboard(newlyCreatedKey)}
              className="btn btn-primary"
            >
              📋 Copy Key
            </button>
            <button
              onClick={() => {
                copyToClipboard(getInstallCode(newlyCreatedKey));
              }}
              className="btn btn-secondary"
            >
              📋 Copy Installation Code
            </button>
          </div>
        </Card>
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <EmptyState
          icon="🔑"
          title="No API keys yet"
          description="Generate your first API key to start tracking analytics on your website. You'll need to add a domain first."
          action={domains.length > 0 ? {
            label: '+ Generate Your First API Key',
            onClick: () => setShowModal(true),
          } : undefined}
        />
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <Card key={key.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <code className="bg-muted px-4 py-2 rounded-lg text-sm font-mono flex-1 break-all">
                      {key.key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(key.key)}
                      className="text-primary hover:text-primary/80 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Created:</span> {new Date(key.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Domains:</span> {key.domain_ids.length}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{' '}
                      <span className={key.revoked ? 'text-error' : 'text-success'}>
                        {key.revoked ? '❌ Revoked' : '✅ Active'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setNewlyCreatedKey(key.key);
                    }}
                    className="btn btn-secondary text-sm"
                  >
                    📖 View Code
                  </button>
                  <button
                    onClick={() => handleRevoke(key.id)}
                    className="text-error hover:text-error/80 px-3 py-2 rounded-lg hover:bg-error/10 transition-colors"
                    disabled={key.revoked}
                  >
                    {key.revoked ? 'Revoked' : '🗑️ Revoke'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Generate API Key Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Generate API Key</h2>
            <form onSubmit={handleCreate}>
              {error && (
                <Alert type="error" message={error} />
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select Domains
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                  {domains.map((domain) => (
                    <label key={domain.id} className="flex items-center p-2 hover:bg-muted/50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDomains.includes(domain.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDomains([...selectedDomains, domain.id]);
                          } else {
                            setSelectedDomains(selectedDomains.filter((id) => id !== domain.id));
                          }
                        }}
                        className="mr-3 h-4 w-4 text-primary focus:ring-primary border-border rounded"
                      />
                      <span className="text-sm flex-1">{domain.domain}</span>
                      {domain.verified && <span className="text-success text-xs">✓</span>}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Select which domains this API key can track
                </p>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary flex-1">
                  Generate Key
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Installation Guide Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Installation Guide</h2>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Step 1: Generate API Key</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Click &quot;Generate API Key&quot; above and select your domain(s).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Step 2: Add Tracking Code</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Add this code to your website&apos;s <code className="bg-muted px-1 rounded">&lt;head&gt;</code> section:
                </p>
                <Card className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                  <pre className="text-sm"><code>{`<!-- Krakens Analytics -->
<script src="${process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin}/krakens.js"></script>
<script>
  Krakens.init('YOUR_API_KEY_HERE');
</script>`}</code></pre>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Step 3: Verify Installation</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Visit your website and check the dashboard - you should see real-time visitors appear within seconds!
                </p>
              </div>

              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>The tracking script is less than 5KB and won&apos;t slow down your site</li>
                  <li>It automatically tracks page views and navigation</li>
                  <li>Works with single-page applications (React, Vue, etc.)</li>
                  <li>Respects user privacy with IP anonymization</li>
                </ul>
              </Card>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowInstallModal(false)}
                className="btn btn-primary w-full"
              >
                Got it!
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
