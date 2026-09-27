import { STATUSES } from '../constants';

export default function PipelineStrip({ stats, active, onSelect }) {
  const total = stats?.total ?? 0;
  const toggle = (status) => onSelect(active === status ? '' : status);

  return (
    <section className="pipeline" aria-label="Applications by status">
      <div className="pipeline-head">
        <h2>
          <span className="pipeline-number">{total}</span>{' '}
          {total === 1 ? 'application' : 'applications'}
        </h2>
        {active && (
          <button className="text-button" onClick={() => onSelect('')}>
            Show all
          </button>
        )}
      </div>

      <div className="pipeline-bar" role="group" aria-label="Filter by status">
        {total === 0 ? (
          <span className="pipeline-empty" />
        ) : (
          STATUSES.filter((s) => stats[s] > 0).map((s) => (
            <button
              key={s}
              className={`segment seg-${s.toLowerCase()}`}
              style={{ flexGrow: stats[s] }}
              aria-pressed={active === s}
              aria-label={`${s}: ${stats[s]}`}
              title={`${s}: ${stats[s]}`}
              onClick={() => toggle(s)}
            />
          ))
        )}
      </div>

      <ul className="pipeline-legend">
        {STATUSES.map((s) => (
          <li key={s}>
            <button
              className={`legend-item ${active === s ? 'is-active' : ''}`}
              aria-pressed={active === s}
              onClick={() => toggle(s)}
            >
              <span className={`dot seg-${s.toLowerCase()}`} />
              {s} <strong>{stats?.[s] ?? 0}</strong>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
