/**
 * Analytics stat card widget
 */
export default function StatCard( { label, value, trend, color = 'indigo' } ) {
	return (
		<div className={ `wpra-stat-card wpra-stat-card--${ color }` }>
			<span className="wpra-stat-card__label">{ label }</span>
			<span className="wpra-stat-card__value">{ value ?? '—' }</span>
			{ trend && <span className="wpra-stat-card__trend">{ trend }</span> }
		</div>
	);
}
