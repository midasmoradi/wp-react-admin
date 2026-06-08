/**
 * Posts per month bar chart (pure CSS/React — no external chart lib)
 */
import { __ } from '@wordpress/i18n';

export default function AnalyticsChart( { data } ) {
	const max = Math.max( ...data.values, 1 );

	return (
		<div className="wpra-chart">
			<h3 className="wpra-panel__title">{ __( 'Posts Published', 'wp-react-admin' ) }</h3>
			<div className="wpra-chart__bars" role="img" aria-label={ __( 'Posts per month chart', 'wp-react-admin' ) }>
				{ data.labels.map( ( label, i ) => (
					<div key={ label } className="wpra-chart__bar-group">
						<div
							className="wpra-chart__bar"
							style={ { height: `${ ( data.values[ i ] / max ) * 100 }%` } }
							title={ `${ label }: ${ data.values[ i ] }` }
						>
							<span className="wpra-chart__bar-value">{ data.values[ i ] }</span>
						</div>
						<span className="wpra-chart__label">{ label }</span>
					</div>
				) ) }
			</div>
		</div>
	);
}
