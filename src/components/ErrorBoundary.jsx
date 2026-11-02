import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCode: 'ERR-' + Math.floor(100 + Math.random() * 900)
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      error,
      errorCode: 'ERR-' + (error?.name === 'TypeError' ? '204' : error?.name === 'ReferenceError' ? '305' : '400')
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Concave Realty Error Boundary caught an exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-[#051912]/95 border border-[#c59b4e]/30 rounded-2xl shadow-luxury my-6">
          <div className="max-w-lg text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#184535] border border-[#c59b4e] flex items-center justify-center text-[#dfbe79] shadow-gold-glow">
              <ShieldAlert className="w-8 h-8 text-[#dfbe79]" />
            </div>

            <div className="inline-block px-3 py-1 bg-[#09291f] border border-[#c59b4e]/50 rounded-full text-xs font-mono text-[#dfbe79] tracking-wider">
              PROTECTION ACTIVE • CODE: {this.state.errorCode}
            </div>

            <h3 className="font-serif text-2xl text-[#f7f6f2] font-semibold">
              Graceful Component Recovery
            </h3>
            
            <p className="text-sm text-gray-300 leading-relaxed">
              Concave Realty active fail-safe caught a minor interface event. The rest of the application remains completely secure and operational.
            </p>

            {this.state.error && (
              <div className="text-left bg-[#03130d] p-3 rounded-lg border border-red-500/20 text-xs font-mono text-red-300 overflow-x-auto max-h-28">
                <span className="text-yellow-400 font-bold">Trace [{this.state.errorCode}]:</span> {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-gradient text-[#051912] font-semibold text-sm rounded-lg hover:brightness-110 transition-all shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Component
              </button>
              <button
                onClick={() => { this.setState({ hasError: false }); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#09291f] text-gray-200 border border-[#c59b4e]/30 text-sm rounded-lg hover:border-[#c59b4e] transition-all"
              >
                <Home className="w-4 h-4 text-[#c59b4e]" />
                Resume View
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

