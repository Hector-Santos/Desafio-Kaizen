type AppHeaderProps = {
  onRankingClick: () => void;
  onSaveClick: () => void;
};

export function AppHeader({ onRankingClick, onSaveClick }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <h1>Kaizen Clicker</h1>
        <p>
          Optimize your factory line, reduce defects, and climb the ranking.
        </p>
      </div>

      <div className="header-actions">
        <button className="button" type="button" onClick={onRankingClick}>
          Ranking
        </button>
        <button className="button primary" type="button" onClick={onSaveClick}>
          Save Score
        </button>
      </div>
    </header>
  );
}
