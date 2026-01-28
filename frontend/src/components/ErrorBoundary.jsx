import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full border-l-4 border-red-500">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong.</h1>
                        <p className="text-gray-600 mb-6">The application encountered an unexpected error.</p>

                        {this.state.error && (
                            <div className="bg-red-50 p-4 rounded-lg overflow-auto max-h-60 mb-4">
                                <p className="font-mono text-sm text-red-700 font-bold mb-2">{this.state.error.toString()}</p>
                                <pre className="font-mono text-xs text-red-600 whitespace-pre-wrap">
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </div>
                        )}

                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
