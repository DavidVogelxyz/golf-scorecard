import React, { useState } from 'react';
import './App.css';

interface Hole {
  number: number;
  par: number;
  playerScore: number;
  notes: string;
}

function App() {
  const [holes, setHoles] = useState<Hole[]>(() => {
    // Initialize with 18 holes, default par of 4
    return Array.from({ length: 18 }, (_, index) => ({
      number: index + 1,
      par: 4,
      playerScore: 0,
      notes: ''
    }));
  });

  const [courseNotes, setCourseNotes] = useState('');

  const updateHole = (holeNumber: number, field: 'par' | 'playerScore' | 'notes', value: number | string) => {
    setHoles(prevHoles => 
      prevHoles.map(hole => 
        hole.number === holeNumber 
          ? { ...hole, [field]: field === 'playerScore' ? Math.max(0, value as number) : value }
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

  // --- Export Logic ---
  const getExportFilename = (ext: string) => {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `golf-scorecard-${y}${m}${d}.${ext}`;
  };

  const handleExportCSV = () => {
    let csv = 'Hole,Par,Score,Notes\n';
    holes.forEach(hole => {
      // Escape notes for CSV
      const notes = '"' + (hole.notes || '').replace(/"/g, '""') + '"';
      csv += `${hole.number},${hole.par},${hole.playerScore},${notes}\n`;
    });
    csv += `\nCourse Notes:,"${(courseNotes || '').replace(/"/g, '""')}"\n`;
    downloadFile(csv, getExportFilename('csv'), 'text/csv');
  };

  const handleExportJSON = () => {
    const data = {
      holes: holes.map(hole => ({
        number: hole.number,
        par: hole.par,
        playerScore: hole.playerScore,
        notes: hole.notes
      })),
      courseNotes
    };
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, getExportFilename('json'), 'application/json');
  };

  const handleExportTXT = () => {
    let txt = 'Golf Scorecard\n';
    txt += '-----------------------------\n';
    holes.forEach(hole => {
      txt += `Hole ${hole.number}: Par ${hole.par}, Score ${hole.playerScore}\n`;
      if (hole.notes) txt += `  Notes: ${hole.notes}\n`;
    });
    txt += '\nCourse Notes:\n';
    txt += courseNotes ? courseNotes + '\n' : '';
    downloadFile(txt, getExportFilename('txt'), 'text/plain');
  };

  function downloadFile(data: string, filename: string, mime: string) {
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏌️‍♂️ Golf Scorecard</h1>
        <p>Track your game with real-time calculations</p>
      </header>

      <div className="export-section">
        <button className="export-btn" onClick={handleExportCSV}>Export CSV</button>
        <button className="export-btn" onClick={handleExportJSON}>Export JSON</button>
        <button className="export-btn" onClick={handleExportTXT}>Export TXT</button>
      </div>
      
      <div className="scorecard-wrapper">
        <div className="scorecard">
          <div className="scorecard-header">
            <div className="header-cell">Hole</div>
            <div className="header-cell">Par</div>
            <div className="header-cell">Score</div>
            <div className="header-cell">+/-</div>
            <div className="header-cell">Notes</div>
          </div>
          
          <div className="holes-container">
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
                    value={hole.playerScore === 0 ? '' : hole.playerScore}
                    onChange={(e) => updateHole(hole.number, 'playerScore', parseInt(e.target.value) || 0)}
                    className="score-input"
                    placeholder="0"
                  />
                </div>
                <div className={`difference ${hole.playerScore > 0 ? (hole.playerScore > hole.par ? 'over-par' : hole.playerScore < hole.par ? 'under-par' : 'even') : ''}`}>
                  {getDifference(hole.par, hole.playerScore)}
                </div>
                <div className="notes-input">
                  <textarea
                    value={hole.notes}
                    onChange={(e) => updateHole(hole.number, 'notes', e.target.value)}
                    className="notes-textarea"
                    placeholder="Add notes..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="totals-row">
            <div className="total-label">TOTALS</div>
            <div className="total-par">{getTotalPar()}</div>
            <div className="total-score">{getTotalPlayerScore()}</div>
            <div className={`total-difference ${(() => {
              const playedHoles = holes.filter(hole => hole.playerScore > 0);
              if (playedHoles.length === 0) return '';
              const totalPar = playedHoles.reduce((sum, hole) => sum + hole.par, 0);
              const totalPlayer = playedHoles.reduce((sum, hole) => sum + hole.playerScore, 0);
              return totalPlayer > totalPar ? 'over-par' : totalPlayer < totalPar ? 'under-par' : 'even';
            })()}`}>
              {getTotalDifference()}
            </div>
            <div className="course-notes">
              <textarea
                value={courseNotes}
                onChange={(e) => setCourseNotes(e.target.value)}
                className="course-notes-textarea"
                placeholder="Course notes..."
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
