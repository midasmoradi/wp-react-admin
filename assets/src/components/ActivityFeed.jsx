/**
 * Recent activity feed widget
 */
import { __ } from '@wordpress/i18n';

export default function ActivityFeed( { items } ) {
	if ( ! items?.length ) {
		return (
			<div className="wpra-activity">
				<h3 className="wpra-panel__title">{ __( 'Recent Activity', 'wp-react-admin' ) }</h3>
				<p className="wpra-empty">{ __( 'No recent activity.', 'wp-react-admin' ) }</p>
			</div>
		);
	}

	return (
		<div className="wpra-activity">
			<h3 className="wpra-panel__title">{ __( 'Recent Activity', 'wp-react-admin' ) }</h3>
			<ul className="wpra-activity__list">
				{ items.map( ( item ) => (
					<li key={ `${ item.type }-${ item.id }` } className="wpra-activity__item">
						<span className={ `wpra-activity__icon wpra-activity__icon--${ item.type }` }>
							{ item.type === 'post' ? '📝' : '💬' }
						</span>
						<div className="wpra-activity__content">
							{ item.edit_link ? (
								<a href={ item.edit_link } className="wpra-activity__title">{ item.title }</a>
							) : (
								<span className="wpra-activity__title">{ item.title }</span>
							) }
							<time className="wpra-activity__time">
								{ new Date( item.date ).toLocaleDateString() }
							</time>
						</div>
					</li>
				) ) }
			</ul>
		</div>
	);
}
