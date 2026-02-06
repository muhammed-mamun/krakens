'use client';

import { useState, useEffect } from 'react';
import { getDomains, createDomain, deleteDomain } from '@/lib/api';
import type { Domain } from '@/types';
import { Card } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import Alert from '@/components/ui/Alert';

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      const { data } = await getDomains();
      setDomains(data || []);
    } catch (error) {
      console.error('Failed to load domains:', error);
      setDomains([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate domain format (allow localhost for testing)
    const domainRegex = /^([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}|localhost)$/;
    if (!domainRegex.test(newDomain)) {
      setError('Please enter a valid domain name (e.g., example.com or localhost)');
      return;
    }

    try {
      await createDomain(newDomain);
      setNewDomain('');
      setShowModal(false);
      setSuccess(`Domain "${newDomain}" added successfully!`);
      loadDomains();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create domain');
    }
  };

  const handleDelete = async (id: string, domainName: string) => {
    if (!confirm(`Are you sure you want to delete "${domainName}"? This action cannot be undone.`)) return;

    try {
      await deleteDomain(id);
      setSuccess(`Domain "${domainName}" deleted successfully`);
      loadDomains();
    } catch (error) {
      console.error('Failed to delete domain:', error);
      setError('Failed to delete domain');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading domains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Domains</h1>
          <p className="text-muted-foreground">Manage the websites you&apos;re tracking</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Add Domain
        </button>
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

      {/* Info Card */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">What are domains?</h3>
            <p className="text-sm text-muted-foreground">
              Domains are the websites you want to track. Add your website domain here, then generate an API key to start collecting analytics data.
            </p>
          </div>
        </div>
      </Card>

      {/* Domains Grid */}
      {domains.length === 0 ? (
        <EmptyState
          icon="🌐"
          title="No domains yet"
          description="Add your first domain to start tracking website analytics. You'll need to add a domain before you can generate API keys."
          action={{
            label: '+ Add Your First Domain',
            onClick: () => setShowModal(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <Card key={domain.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{domain.domain}</h3>
                    {domain.verified && (
                      <span className="text-success" title="Verified">✓</span>
                    )}
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      domain.verified
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {domain.verified ? '✓ Verified' : '⏳ Pending Verification'}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(domain.id, domain.domain)}
                  className="text-error hover:text-error/80 p-2"
                  title="Delete domain"
                >
                  🗑️
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <div className="flex justify-between">
                  <span>Rate Limit:</span>
                  <span className="font-medium text-foreground">{domain.settings.rate_limit}/min</span>
                </div>
                <div className="flex justify-between">
                  <span>IP Anonymization:</span>
                  <span className="font-medium text-foreground">
                    {domain.settings.anonymize_ip ? '✅ On' : '❌ Off'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Timezone:</span>
                  <span className="font-medium text-foreground">{domain.settings.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session Timeout:</span>
                  <span className="font-medium text-foreground">{domain.settings.session_timeout}s</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Added {new Date(domain.created_at).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Domain Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Domain</h2>
            <form onSubmit={handleCreate}>
              {error && (
                <Alert type="error" message={error} />
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Domain Name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your domain without http:// or https:// (e.g., example.com or localhost)
                </p>
              </div>
              
              <Card className="p-3 mb-4 bg-primary/5 border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <strong>Next steps:</strong> After adding your domain, generate an API key and install the tracking code on your website.
                </p>
              </Card>

              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary flex-1">
                  Add Domain
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
    </div>
  );
}
