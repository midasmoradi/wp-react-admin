<?php
/**
 * Registers React admin dashboard page.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

namespace WPReactAdmin\Admin;

use WPReactAdmin\Contracts\HookableInterface;
use WPReactAdmin\Options\PluginOptions;

final class DashboardRegistrar implements HookableInterface {

	public function register(): void {
		add_action( 'admin_menu', [ $this, 'add_menu' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	public function add_menu(): void {
		$options = new PluginOptions();

		add_menu_page(
			esc_html__( 'React Dashboard', 'wp-react-admin' ),
			esc_html__( 'React Dashboard', 'wp-react-admin' ),
			'edit_posts',
			'wp-react-admin',
			[ $this, 'render_mount_point' ],
			'dashicons-chart-area',
			3
		);
	}

	public function render_mount_point(): void {
		?>
		<div class="wrap">
			<div id="wp-react-admin-root" class="wp-react-admin-root"></div>
		</div>
		<?php
	}

	public function enqueue_assets( string $hook ): void {
		if ( 'toplevel_page_wp-react-admin' !== $hook ) {
			return;
		}

		$asset_file = WP_RA_DIR . 'build/index.asset.php';
		$asset      = file_exists( $asset_file )
			? require $asset_file
			: [
				'dependencies' => [ 'wp-element', 'wp-components', 'wp-api-fetch', 'wp-i18n' ],
				'version'      => WP_RA_VERSION,
			];

		wp_enqueue_style(
			'wp-react-admin',
			WP_RA_URL . 'build/index.css',
			[ 'wp-components' ],
			$asset['version']
		);

		wp_enqueue_script(
			'wp-react-admin',
			WP_RA_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		$options = ( new PluginOptions() )->get_all();

		wp_localize_script(
			'wp-react-admin',
			'wpReactAdmin',
			[
				'nonce'    => wp_create_nonce( 'wp_rest' ),
				'restUrl'  => esc_url_raw( rest_url() ),
				'adminUrl' => admin_url(),
				'siteUrl'  => home_url(),
				'user'     => [
					'id'    => get_current_user_id(),
					'name'  => wp_get_current_user()->display_name,
					'email' => wp_get_current_user()->user_email,
				],
				'settings' => $options,
				'i18n'     => [
					'dashboard' => __( 'React Dashboard', 'wp-react-admin' ),
					'loading'   => __( 'Loading dashboard...', 'wp-react-admin' ),
					'error'     => __( 'Failed to load dashboard data.', 'wp-react-admin' ),
				],
			]
		);

		wp_set_script_translations( 'wp-react-admin', 'wp-react-admin', WP_RA_DIR . 'languages' );
	}
}
