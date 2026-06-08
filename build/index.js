/**
 * WP React Admin — Compiled dashboard bundle
 * Built with @wordpress/element (externals: wp-element, wp-components, wp-api-fetch)
 */
( function () {
	'use strict';

	var el = wp.element.createElement;
	var useState = wp.element.useState;
	var useEffect = wp.element.useEffect;
	var Fragment = wp.element.Fragment;
	var Spinner = wp.components.Spinner;
	var Notice = wp.components.Notice;
	var apiFetch = wp.apiFetch;
	var config = window.wpReactAdmin || {};
	var settings = config.settings || {};
	var user = config.user || {};
	var BASE = '/wpra/v1';
	var COLORS = [ '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444' ];

	function fetchData( path ) {
		return apiFetch( { path: BASE + path } );
	}

	function StatCard( props ) {
		return el( 'div', { className: 'wpra-stat-card wpra-stat-card--' + ( props.color || 'indigo' ) },
			el( 'span', { className: 'wpra-stat-card__label' }, props.label ),
			el( 'span', { className: 'wpra-stat-card__value' }, props.value != null ? props.value : '—' ),
			props.trend ? el( 'span', { className: 'wpra-stat-card__trend' }, props.trend ) : null
		);
	}

	function AnalyticsChart( props ) {
		var data = props.data || { labels: [], values: [] };
		var max = Math.max.apply( null, data.values.concat( [ 1 ] ) );

		return el( 'div', { className: 'wpra-chart' },
			el( 'h3', { className: 'wpra-panel__title' }, 'Posts Published' ),
			el( 'div', { className: 'wpra-chart__bars' },
				data.labels.map( function ( label, i ) {
					return el( 'div', { key: label, className: 'wpra-chart__bar-group' },
						el( 'div', {
							className: 'wpra-chart__bar',
							style: { height: ( data.values[ i ] / max ) * 100 + '%' },
							title: label + ': ' + data.values[ i ],
						}, el( 'span', { className: 'wpra-chart__bar-value' }, data.values[ i ] ) ),
						el( 'span', { className: 'wpra-chart__label' }, label )
					);
				} )
			)
		);
	}

	function ActivityFeed( props ) {
		var items = props.items || [];

		if ( ! items.length ) {
			return el( 'div', { className: 'wpra-activity' },
				el( 'h3', { className: 'wpra-panel__title' }, 'Recent Activity' ),
				el( 'p', { className: 'wpra-empty' }, 'No recent activity.' )
			);
		}

		return el( 'div', { className: 'wpra-activity' },
			el( 'h3', { className: 'wpra-panel__title' }, 'Recent Activity' ),
			el( 'ul', { className: 'wpra-activity__list' },
				items.map( function ( item ) {
					return el( 'li', { key: item.type + '-' + item.id, className: 'wpra-activity__item' },
						el( 'span', { className: 'wpra-activity__icon' }, item.type === 'post' ? '📝' : '💬' ),
						el( 'div', { className: 'wpra-activity__content' },
							item.edit_link
								? el( 'a', { href: item.edit_link, className: 'wpra-activity__title' }, item.title )
								: el( 'span', { className: 'wpra-activity__title' }, item.title ),
							el( 'time', { className: 'wpra-activity__time' }, new Date( item.date ).toLocaleDateString() )
						)
					);
				} )
			)
		);
	}

	function ContentBreakdown( props ) {
		var data = props.data || [];
		var total = data.reduce( function ( s, item ) { return s + item.count; }, 0 ) || 1;

		return el( 'div', { className: 'wpra-breakdown' },
			el( 'h3', { className: 'wpra-panel__title' }, 'Content Breakdown' ),
			el( 'ul', { className: 'wpra-breakdown__list' },
				data.map( function ( item, i ) {
					return el( 'li', { key: item.type, className: 'wpra-breakdown__item' },
						el( 'div', { className: 'wpra-breakdown__header' },
							el( 'span', null, item.label ),
							el( 'strong', null, item.count )
						),
						el( 'div', { className: 'wpra-breakdown__track' },
							el( 'div', {
								className: 'wpra-breakdown__fill',
								style: {
									width: ( item.count / total ) * 100 + '%',
									background: COLORS[ i % COLORS.length ],
								},
							} )
						)
					);
				} )
			)
		);
	}

	function RecentPosts( props ) {
		var posts = props.posts || [];

		return el( 'div', { className: 'wpra-recent-posts' },
			el( 'h3', { className: 'wpra-panel__title' }, 'Recent Posts' ),
			! posts.length
				? el( 'p', { className: 'wpra-empty' }, 'No posts found.' )
				: el( 'table', { className: 'wpra-table' },
					el( 'thead', null,
						el( 'tr', null,
							el( 'th', null, 'Title' ),
							el( 'th', null, 'Author' ),
							el( 'th', null, 'Date' ),
							el( 'th', null, '' )
						)
					),
					el( 'tbody', null,
						posts.map( function ( post ) {
							return el( 'tr', { key: post.id },
								el( 'td', null,
									el( 'strong', null, post.title ),
									post.excerpt ? el( 'small', null, post.excerpt ) : null
								),
								el( 'td', null, post.author ),
								el( 'td', null, new Date( post.date ).toLocaleDateString() ),
								el( 'td', null, el( 'a', { href: post.edit_link, className: 'wpra-link' }, 'Edit' ) )
							);
						} )
					)
				)
		);
	}

	function Dashboard() {
		var _a = useState( true ), loading = _a[ 0 ], setLoading = _a[ 1 ];
		var _b = useState( null ), error = _b[ 0 ], setError = _b[ 1 ];
		var _c = useState( null ), overview = _c[ 0 ], setOverview = _c[ 1 ];
		var _d = useState( null ), chart = _d[ 0 ], setChart = _d[ 1 ];
		var _e = useState( [] ), activity = _e[ 0 ], setActivity = _e[ 1 ];
		var _f = useState( [] ), breakdown = _f[ 0 ], setBreakdown = _f[ 1 ];
		var _g = useState( [] ), recentPosts = _g[ 0 ], setRecentPosts = _g[ 1 ];

		useEffect( function () {
			var months = settings.chart_months || 6;
			var promises = [
				fetchData( '/analytics/overview' ),
				settings.show_posts_chart !== false ? fetchData( '/analytics/posts-chart?months=' + months ) : Promise.resolve( null ),
				settings.show_activity_feed !== false ? fetchData( '/analytics/activity' ) : Promise.resolve( [] ),
				fetchData( '/analytics/content-breakdown' ),
				fetchData( '/posts/recent?per_page=5' ),
			];

			Promise.all( promises )
				.then( function ( results ) {
					setOverview( results[ 0 ] );
					setChart( results[ 1 ] );
					setActivity( results[ 2 ] );
					setBreakdown( results[ 3 ] );
					setRecentPosts( results[ 4 ] );
				} )
				.catch( function () {
					setError( config.i18n?.error || 'Failed to load dashboard data.' );
				} )
				.finally( function () {
					setLoading( false );
				} );
		}, [] );

		if ( loading ) {
			return el( 'div', { className: 'wpra-loading' },
				el( Spinner, null ),
				el( 'p', null, config.i18n?.loading || 'Loading...' )
			);
		}

		if ( error ) {
			return el( Notice, { status: 'error', isDismissible: false }, error );
		}

		return el( 'div', { className: 'wpra-dashboard' },
			el( 'header', { className: 'wpra-header' },
				el( 'div', null,
					el( 'h1', { className: 'wpra-header__title' }, settings.dashboard_title || 'React Dashboard' ),
					el( 'p', { className: 'wpra-header__subtitle' },
						( overview?.site?.name || '' ) + ' — Powered by React & WP REST API'
					)
				),
				el( 'div', { className: 'wpra-header__user' },
					el( 'span', { className: 'wpra-header__avatar' }, ( user.name || 'A' ).charAt( 0 ) ),
					el( 'div', null,
						el( 'strong', null, user.name ),
						el( 'small', null, 'WP ' + ( overview?.site?.version || '' ) )
					)
				)
			),
			el( 'div', { className: 'wpra-stats-grid' },
				el( StatCard, { label: 'Published Posts', value: overview?.posts?.publish, trend: overview?.posts?.draft + ' drafts', color: 'indigo' } ),
				el( StatCard, { label: 'Pages', value: overview?.pages?.publish, color: 'violet' } ),
				settings.show_users_stat !== false ? el( StatCard, { label: 'Users', value: overview?.users, color: 'cyan' } ) : null,
				el( StatCard, { label: 'Comments', value: overview?.comments?.approved, trend: overview?.comments?.pending + ' pending', color: 'emerald' } ),
				el( StatCard, { label: 'Media Files', value: overview?.media, color: 'amber' } )
			),
			el( 'div', { className: 'wpra-main-grid' },
				chart && settings.show_posts_chart !== false
					? el( 'div', { className: 'wpra-panel wpra-panel--wide' }, el( AnalyticsChart, { data: chart } ) )
					: null,
				el( 'div', { className: 'wpra-panel' }, el( ContentBreakdown, { data: breakdown } ) ),
				settings.show_activity_feed !== false
					? el( 'div', { className: 'wpra-panel' }, el( ActivityFeed, { items: activity } ) )
					: null,
				el( 'div', { className: 'wpra-panel wpra-panel--wide' }, el( RecentPosts, { posts: recentPosts } ) )
			)
		);
	}

	var root = document.getElementById( 'wp-react-admin-root' );
	if ( root ) {
		wp.element.render( el( Dashboard, null ), root );
	}
} )();
