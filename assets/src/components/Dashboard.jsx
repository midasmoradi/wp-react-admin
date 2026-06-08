/**
 * Main dashboard layout
 */
import { useState, useEffect } from '@wordpress/element';
import { Spinner, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import StatCard from './StatCard';
import AnalyticsChart from './AnalyticsChart';
import ActivityFeed from './ActivityFeed';
import RecentPosts from './RecentPosts';
import ContentBreakdown from './ContentBreakdown';
import {
	fetchOverview,
	fetchPostsChart,
	fetchActivity,
	fetchContentBreakdown,
	fetchRecentPosts,
} from '../api/client';

export default function Dashboard() {
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ overview, setOverview ] = useState( null );
	const [ chart, setChart ] = useState( null );
	const [ activity, setActivity ] = useState( [] );
	const [ breakdown, setBreakdown ] = useState( [] );
	const [ recentPosts, setRecentPosts ] = useState( [] );

	const settings = window.wpReactAdmin?.settings || {};
	const user = window.wpReactAdmin?.user || {};

	useEffect( () => {
		const months = settings.chart_months || 6;

		Promise.all( [
			fetchOverview(),
			settings.show_posts_chart !== false ? fetchPostsChart( months ) : Promise.resolve( null ),
			settings.show_activity_feed !== false ? fetchActivity() : Promise.resolve( [] ),
			fetchContentBreakdown(),
			fetchRecentPosts( 5 ),
		] )
			.then( ( [ ov, ch, act, br, posts ] ) => {
				setOverview( ov );
				setChart( ch );
				setActivity( act );
				setBreakdown( br );
				setRecentPosts( posts );
			} )
			.catch( () => setError( window.wpReactAdmin?.i18n?.error || 'Error' ) )
			.finally( () => setLoading( false ) );
	}, [] );

	if ( loading ) {
		return (
			<div className="wpra-loading">
				<Spinner />
				<p>{ window.wpReactAdmin?.i18n?.loading }</p>
			</div>
		);
	}

	if ( error ) {
		return <Notice status="error" isDismissible={ false }>{ error }</Notice>;
	}

	return (
		<div className="wpra-dashboard">
			<header className="wpra-header">
				<div>
					<h1 className="wpra-header__title">
						{ settings.dashboard_title || __( 'React Dashboard', 'wp-react-admin' ) }
					</h1>
					<p className="wpra-header__subtitle">
						{ overview?.site?.name } — { __( 'Powered by React & WP REST API', 'wp-react-admin' ) }
					</p>
				</div>
				<div className="wpra-header__user">
					<span className="wpra-header__avatar">{ user.name?.charAt( 0 ) || 'A' }</span>
					<div>
						<strong>{ user.name }</strong>
						<small>WP { overview?.site?.version }</small>
					</div>
				</div>
			</header>

			<div className="wpra-stats-grid">
				<StatCard
					label={ __( 'Published Posts', 'wp-react-admin' ) }
					value={ overview?.posts?.publish }
					trend={ `${ overview?.posts?.draft } drafts` }
					color="indigo"
				/>
				<StatCard
					label={ __( 'Pages', 'wp-react-admin' ) }
					value={ overview?.pages?.publish }
					color="violet"
				/>
				{ settings.show_users_stat !== false && (
					<StatCard
						label={ __( 'Users', 'wp-react-admin' ) }
						value={ overview?.users }
						color="cyan"
					/>
				) }
				<StatCard
					label={ __( 'Comments', 'wp-react-admin' ) }
					value={ overview?.comments?.approved }
					trend={ `${ overview?.comments?.pending } pending` }
					color="emerald"
				/>
				<StatCard
					label={ __( 'Media Files', 'wp-react-admin' ) }
					value={ overview?.media }
					color="amber"
				/>
			</div>

			<div className="wpra-main-grid">
				{ chart && settings.show_posts_chart !== false && (
					<div className="wpra-panel wpra-panel--wide">
						<AnalyticsChart data={ chart } />
					</div>
				) }

				<div className="wpra-panel">
					<ContentBreakdown data={ breakdown } />
				</div>

				{ settings.show_activity_feed !== false && (
					<div className="wpra-panel">
						<ActivityFeed items={ activity } />
					</div>
				) }

				<div className="wpra-panel wpra-panel--wide">
					<RecentPosts posts={ recentPosts } />
				</div>
			</div>
		</div>
	);
}
