'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BadgeSetupProps {
    domainId: string;
}

export default function BadgeSetup({ domainId }: BadgeSetupProps) {
    const [copiedMd, setCopiedMd] = useState(false);
    const [copiedHtml, setCopiedHtml] = useState(false);

    // Use environment variable or default to localhost, ensuring no trailing slash
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');
    const badgeUrl = `${apiUrl}/api/badges/${domainId}/live.svg`;

    // Markdown and HTML snippets
    const markdownCode = `[![Live Visitors](${badgeUrl})](https://krakens.io)`;
    const htmlCode = `<a href="https://krakens.io"><img src="${badgeUrl}" alt="Live Visitors" /></a>`;

    const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Public Status Badge</CardTitle>
                        <CardDescription>Show off your live visitor count on your GitHub README or website.</CardDescription>
                    </div>
                    <div className="bg-muted/20 p-2 rounded-lg border">
                        <img src={badgeUrl} alt="Live Visitors" className="h-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Markdown (GitHub)</Label>
                    <div className="flex gap-2">
                        <Input readOnly value={markdownCode} className="font-mono text-xs bg-muted" />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(markdownCode, setCopiedMd)}
                        >
                            {copiedMd ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>HTML (Website)</Label>
                    <div className="flex gap-2">
                        <Input readOnly value={htmlCode} className="font-mono text-xs bg-muted" />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(htmlCode, setCopiedHtml)}
                        >
                            {copiedHtml ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
