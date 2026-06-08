/**
 * Content type breakdown widget
 */
import { __ } from '@wordpress/i18n';

const COLORS = [ '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444' ];

export default function ContentBreakdown( { data } ) {
	const total = data?.reduce( ( sum, item ) => sum + item.count, 0 ) || 1;

	return (
		<div className="wpra-breakdown">
			<h3 className="wpra-panel__title">{ __( 'Content Breakdown', 'wp-react-admin' ) }</h3>
			<ul className="wpra-breakdown__list">
				{ data?.map( ( item, i ) => (
					<li key={ item.type } className="wpra-breakdown__item">
						<div className="wpra-breakdown__header">
							<span>{ item.label }</span>
							<strong>{ item.count }</strong>
						</div>
						<div className="wpra-breakdown__track">
							<div
								className="wpra-breakdown__fill"
								style={ {
									width: `${ ( item.count / total ) * 100 }%`,
									background: COLORS[ i % COLORS.length ],
								} }
							/>
						</div>
					</li>
				) ) }
			</ul>
		</div>
	);
}
