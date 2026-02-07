'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RealtimeStats } from '@/types';

interface LiveVisitorsProps {
    stats: RealtimeStats | null;
}

export default function LiveVisitors({ stats }: LiveVisitorsProps) {
    const visitors = stats?.active_visitor_ids || [];
    // Use environment variable or default
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    Live Visitors
                </CardTitle>
                <CardDescription>
                    {visitors.length === 0
                        ? "Waiting for visitors..."
                        : `${visitors.length} currently active on your site`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {visitors.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                        {visitors.map((visitorId) => (
                            <div key={visitorId} className="flex flex-col items-center group relative">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors cursor-help bg-muted/20">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`${apiUrl}/api/avatars/${visitorId}`}
                                        alt={`Visitor ${visitorId}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 border">
                                    ID: {visitorId.length > 8 ? visitorId.substring(0, 8) + '...' : visitorId}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/5">
                        <div className="text-center">
                            <div className="text-3xl mb-2">👀</div>
                            <p className="text-sm">No active visitors</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
