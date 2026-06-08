import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Guardai Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '32px',
          textAlign: 'center',
          background: '#0a0a0f',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
          <h2 style={{ color: '#ff3355', fontFamily: "'JetBrains Mono', monospace", marginBottom: '12px' }}>
            Aegis Reset
          </h2>
          <p style={{ color: '#8888aa', marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
            Guardai detected an internal issue and reset to a safe state.
            <br />No data was lost.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: '#00ff88',
              color: '#0a0a0f',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Return to Safe Mode
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

