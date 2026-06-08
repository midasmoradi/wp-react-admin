<?php
/**
 * Security helpers.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

namespace WPReactAdmin\Security;

use WPReactAdmin\Contracts\HookableInterface;

final class SecurityManager implements HookableInterface {

	public function register(): void {
		add_filter( 'rest_pre_dispatch', [ $this, 'add_security_headers' ], 10, 3 );
	}

	/**
	 * @param mixed            $result  Response.
	 * @param \WP_REST_Server  $server  Server.
	 * @param \WP_REST_Request $request Request.
	 * @return mixed
	 */
	public function add_security_headers( $result, \WP_REST_Server $server, \WP_REST_Request $request ) {
		$route = $request->get_route();

		if ( is_string( $route ) && str_starts_with( $route, '/wpra/v1/' ) ) {
			header( 'X-Content-Type-Options: nosniff' );
		}

		return $result;
	}

	public static function can_view_dashboard(): bool {
		return current_user_can( 'edit_posts' );
	}

	public static function can_manage(): bool {
		return current_user_can( 'manage_options' );
	}
}
