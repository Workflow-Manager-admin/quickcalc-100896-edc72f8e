import React from 'react';
import './App.css';
import QuickCalcMain from './QuickCalcMain';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>QuickCalc</button>
          </div>
        </div>
      </nav>
      <main>
        <div className="container" style={{marginTop: 90, marginBottom: 40}}>
          <QuickCalcMain />
        </div>
      </main>
    </div>
  );
}

export default App;