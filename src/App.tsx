import React, { useState } from 'react';
import './App.css';

interface Hole {
  number: number;
  par: number;
  playerScore: number;
}

function App() {
  const [holes, setHoles] = useState<Hole[]>(() => {
    // Initialize with 18 holes, default par of 4
    return Array.from({ length: 18 }, (_, index) => ({
      number: index + 1,
      par: 4,
      playerScore: 0
    }));
  });

  const updateHole = (holeNumber: number, field: 'par' | 'playerScore', value: number) => {
    setHoles(prevHoles => 
      prevHoles.map(hole => 
        hole.number === holeNumber 
          ? { ...hole, [field]: Math.max(0, value) }
          : hole
      )
    );
  };

  const getDifference = (par: number, playerScore: number) => {
    if (playerScore === 0) return '-';
    const diff = playerScore - par;
    if (diff === 0) return 'E';
    if (diff > 0) return `+${diff}`;
    return diff.toString();
  };

  const getTotalPar = () => holes.reduce((sum, hole) => sum + hole.par, 0);
  const getTotalPlayerScore = () => holes.reduce((sum, hole) => sum + hole.playerScore, 0);
  const getTotalDifference = () => {
    // Only calculate difference for holes where player has entered a score
    const playedHoles = holes.filter(hole => hole.playerScore > 0);
    if (playedHoles.length === 0) return '-';
    
    const totalPar = playedHoles.reduce((sum, hole) => sum + hole.par, 0);
    const totalPlayer = playedHoles.reduce((sum, hole) => sum + hole.playerScore, 0);
    const diff = totalPlayer - totalPar;
    if (diff === 0) return 'E';
    if (diff > 0) return `+${diff}`;
    return diff.toString();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏌️‍♂️ Golf Scorecard</h1>
        <p>Track your game with real-time calculations</p>
      </header>
      
      <div className="scorecard-container">
        <div className="scorecard">
          <div className="scorecard-header">
            <div className="header-cell">Hole</div>
            <div className="header-cell">Par</div>
            <div className="header-cell">Score</div>
            <div className="header-cell">+/-</div>
          </div>
          
          {holes.map(hole => (
            <div key={hole.number} className="hole-row">
              <div className="hole-number">{hole.number}</div>
              <div className="par-input">
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={hole.par}
                  onChange={(e) => updateHole(hole.number, 'par', parseInt(e.target.value) || 0)}
                  className="score-input"
                />
              </div>
              <div className="score-input">
                <input
                  type="number"
                  min="0"
                  value={hole.playerScore}
                  onChange={(e) => updateHole(hole.number, 'playerScore', parseInt(e.target.value) || 0)}
                  className="score-input"
                  placeholder="0"
                />
              </div>
              <div className={`difference ${hole.playerScore > 0 ? (hole.playerScore > hole.par ? 'over-par' : hole.playerScore < hole.par ? 'under-par' : 'even') : ''}`}>
                {getDifference(hole.par, hole.playerScore)}
              </div>
            </div>
          ))}
          
          <div className="totals-row">
            <div className="total-label">TOTALS</div>
            <div className="total-par">{getTotalPar()}</div>
            <div className="total-score">{getTotalPlayerScore()}</div>
            <div className={`total-difference ${getTotalPlayerScore() > 0 ? (getTotalPlayerScore() > getTotalPar() ? 'over-par' : getTotalPlayerScore() < getTotalPar() ? 'under-par' : 'even') : ''}`}>
              {getTotalDifference()}
            </div>
          </div>
        </div>
        
        <div className="stats-panel">
          <div className="stat-card">
            <h3>Course Par</h3>
            <div className="stat-value">{getTotalPar()}</div>
          </div>
          <div className="stat-card">
            <h3>Your Score</h3>
            <div className="stat-value">{getTotalPlayerScore()}</div>
          </div>
          <div className="stat-card">
            <h3>Performance</h3>
            <div className={`stat-value ${(() => {
              const playedHoles = holes.filter(hole => hole.playerScore > 0);
              if (playedHoles.length === 0) return '';
              const totalPar = playedHoles.reduce((sum, hole) => sum + hole.par, 0);
              const totalPlayer = playedHoles.reduce((sum, hole) => sum + hole.playerScore, 0);
              return totalPlayer > totalPar ? 'over-par' : totalPlayer < totalPar ? 'under-par' : 'even';
            })()}`}>
              {getTotalDifference()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
