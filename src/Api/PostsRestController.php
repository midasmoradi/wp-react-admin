<?php
/**
 * Extended posts endpoint for React dashboard.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

namespace WPReactAdmin\Api;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WPReactAdmin\Contracts\HookableInterface;
use WPReactAdmin\Security\SecurityManager;

final class PostsRestController implements HookableInterface {

	private const NAMESPACE = 'wpra/v1';

	public function register(): void {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	public function register_routes(): void {
		register_rest_route( self::NAMESPACE, '/posts/recent', [
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => [ $this, 'get_recent' ],
			'permission_callback' => [ SecurityManager::class, 'can_view_dashboard' ],
			'args'                => [
				'per_page' => [
					'default'           => 5,
					'sanitize_callback' => 'absint',
				],
			],
		] );
	}

	public function get_recent( WP_REST_Request $request ): WP_REST_Response {
		$per_page = min( 20, max( 1, (int) $request->get_param( 'per_page' ) ) );

		$posts = get_posts( [
			'numberposts' => $per_page,
			'post_status' => 'publish',
		] );

		$items = array_map(
			static function ( \WP_Post $post ): array {
				return [
					'id'        => $post->ID,
					'title'     => get_the_title( $post ),
					'excerpt'   => wp_trim_words( get_the_excerpt( $post ), 20 ),
					'date'      => get_the_date( 'c', $post ),
					'author'    => get_the_author_meta( 'display_name', (int) $post->post_author ),
					'link'      => get_permalink( $post ),
					'edit_link' => get_edit_post_link( $post->ID, 'raw' ),
					'thumbnail' => get_the_post_thumbnail_url( $post, 'thumbnail' ) ?: null,
				];
			},
			$posts
		);

		return new WP_REST_Response( $items, 200 );
	}
}
