<?php
/**
 * Analytics REST API.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

namespace WPReactAdmin\Api;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WPReactAdmin\Contracts\HookableInterface;
use WPReactAdmin\Options\PluginOptions;
use WPReactAdmin\Security\SecurityManager;

final class AnalyticsRestController implements HookableInterface {

	private const NAMESPACE = 'wpra/v1';

	public function register(): void {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	public function register_routes(): void {
		register_rest_route( self::NAMESPACE, '/analytics/overview', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ $this, 'get_overview' ],
			'permission_callback' => [ SecurityManager::class, 'can_view_dashboard' ],
		] );

		register_rest_route( self::NAMESPACE, '/analytics/posts-chart', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ $this, 'get_posts_chart' ],
			'permission_callback' => [ SecurityManager::class, 'can_view_dashboard' ],
			'args'                => [
				'months' => [
					'default'           => 6,
					'sanitize_callback' => 'absint',
				],
			],
		] );

		register_rest_route( self::NAMESPACE, '/analytics/activity', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ $this, 'get_activity' ],
			'permission_callback' => [ SecurityManager::class, 'can_view_dashboard' ],
		] );

		register_rest_route( self::NAMESPACE, '/analytics/content-breakdown', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ $this, 'get_content_breakdown' ],
			'permission_callback' => [ SecurityManager::class, 'can_view_dashboard' ],
		] );
	}

	public function get_overview( WP_REST_Request $request ): WP_REST_Response {
		$counts = wp_count_posts( 'post' );
		$pages  = wp_count_posts( 'page' );

		$data = [
			'posts'    => [
				'publish' => (int) ( $counts->publish ?? 0 ),
				'draft'   => (int) ( $counts->draft ?? 0 ),
				'total'   => (int) ( $counts->publish ?? 0 ) + (int) ( $counts->draft ?? 0 ),
			],
			'pages'    => [
				'publish' => (int) ( $pages->publish ?? 0 ),
				'total'   => (int) ( $pages->publish ?? 0 ) + (int) ( $pages->draft ?? 0 ),
			],
			'users'    => count_users()['total_users'] ?? 0,
			'comments' => [
				'approved' => (int) wp_count_comments()->approved,
				'pending'  => (int) wp_count_comments()->moderated,
				'total'    => (int) wp_count_comments()->total_comments,
			],
			'media'    => (int) ( wp_count_posts( 'attachment' )->inherit ?? 0 ),
			'site'     => [
				'name'    => get_bloginfo( 'name' ),
				'url'     => home_url(),
				'version' => get_bloginfo( 'version' ),
			],
		];

		return new WP_REST_Response( $data, 200 );
	}

	public function get_posts_chart( WP_REST_Request $request ): WP_REST_Response {
		$months = max( 3, min( 12, (int) $request->get_param( 'months' ) ) );
		$labels = [];
		$values = [];

		for ( $i = $months - 1; $i >= 0; $i-- ) {
			$start = gmdate( 'Y-m-01', strtotime( "-{$i} months" ) );
			$end   = gmdate( 'Y-m-t', strtotime( $start ) );

			$query = new \WP_Query( [
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'date_query'     => [
					[
						'after'     => $start,
						'before'    => $end,
						'inclusive' => true,
					],
				],
				'posts_per_page' => -1,
				'fields'         => 'ids',
			] );

			$labels[] = gmdate( 'M Y', strtotime( $start ) );
			$values[] = $query->found_posts;
		}

		return new WP_REST_Response( [
			'labels' => $labels,
			'values' => $values,
		], 200 );
	}

	public function get_activity( WP_REST_Request $request ): WP_REST_Response {
		$posts = get_posts( [
			'numberposts' => 8,
			'post_status' => [ 'publish', 'draft', 'pending' ],
			'orderby'     => 'modified',
			'order'       => 'DESC',
		] );

		$comments = get_comments( [
			'number' => 5,
			'status' => 'approve',
		] );

		$activity = [];

		foreach ( $posts as $post ) {
			$activity[] = [
				'type'      => 'post',
				'id'        => $post->ID,
				'title'     => get_the_title( $post ),
				'status'    => $post->post_status,
				'date'      => get_the_modified_date( 'c', $post ),
				'edit_link' => get_edit_post_link( $post->ID, 'raw' ),
			];
		}

		foreach ( $comments as $comment ) {
			$activity[] = [
				'type'   => 'comment',
				'id'     => (int) $comment->comment_ID,
				'title'  => wp_trim_words( $comment->comment_content, 12 ),
				'author' => $comment->comment_author,
				'date'   => mysql_to_rfc3339( $comment->comment_date ),
			];
		}

		usort( $activity, static fn( $a, $b ) => strtotime( $b['date'] ) <=> strtotime( $a['date'] ) );

		return new WP_REST_Response( array_slice( $activity, 0, 10 ), 200 );
	}

	public function get_content_breakdown( WP_REST_Request $request ): WP_REST_Response {
		$post_types = get_post_types( [ 'public' => true ], 'objects' );
		$breakdown  = [];

		foreach ( $post_types as $type ) {
			if ( 'attachment' === $type->name ) {
				continue;
			}

			$counts = wp_count_posts( $type->name );

			$breakdown[] = [
				'type'  => $type->name,
				'label' => $type->labels->name,
				'count' => (int) ( $counts->publish ?? 0 ),
			];
		}

		return new WP_REST_Response( $breakdown, 200 );
	}
}
