import { useState, useEffect } from "react";
import { getGmailStatus, getGmailAuthUrl } from "../../api/gmail";

interface GmailStatus {
    configured: boolean;
    email?: string;
    expiry?: string;
    updated_at?: string;
}

const GmailIntegration = () => {
    const [status, setStatus] = useState<GmailStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getGmailStatus();
                setStatus(data);
            } catch (err: any) {
                setError(err.response?.data?.detail || "Failed to fetch Gmail status");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const handleConnect = async () => {
        setIsConnecting(true);
        setError(null);
        try {
            const data = await getGmailAuthUrl();
            window.location.href = data.authorization_url;
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to start Gmail authorization");
            setIsConnecting(false);
        }
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-gray-500">Loading Gmail status...</div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gmail Integration</h3>

            <div className="space-y-3 mb-6">
                {/* Connection status */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    {status?.configured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Connected
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Not connected
                        </span>
                    )}
                </div>

                {/* Sender email */}
                {status?.email && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Sender email:</span>
                        <span className="text-sm text-gray-900">{status.email}</span>
                    </div>
                )}

                {/* Last authorized */}
                {status?.updated_at && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Last authorized:</span>
                        <span className="text-sm text-gray-900">{formatDate(status.updated_at)}</span>
                    </div>
                )}
            </div>

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <button
                type="button"
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isConnecting
                    ? "Redirecting..."
                    : status?.configured
                        ? "Reconnect Gmail"
                        : "Connect Gmail"}
            </button>
        </div>
    );
};

export default GmailIntegration;
