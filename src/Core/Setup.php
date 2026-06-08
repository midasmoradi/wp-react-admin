<?php
/**
 * Plugin setup.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

namespace WPReactAdmin\Core;

use WPReactAdmin\Contracts\HookableInterface;

final class Setup implements HookableInterface {

	public function register(): void {
		add_action( 'init', [ $this, 'load_textdomain' ] );
	}

	public function load_textdomain(): void {
		load_plugin_textdomain(
			'wp-react-admin',
			false,
			dirname( WP_RA_BASENAME ) . '/languages'
		);
	}
}
