<?php
/**
 * Plugin Name:       WP React Admin
 * Plugin URI:        https://github.com/midasmoradi/wp-react-admin
 * Description:       Custom WordPress admin dashboard built with React — analytics widgets, REST API integration, and modern Gutenberg-era components.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Midas Moradi
 * Author URI:        https://github.com/midasmoradi
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-react-admin
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WP_RA_VERSION', '1.0.0' );
define( 'WP_RA_FILE', __FILE__ );
define( 'WP_RA_DIR', plugin_dir_path( __FILE__ ) );
define( 'WP_RA_URL', plugin_dir_url( __FILE__ ) );
define( 'WP_RA_BASENAME', plugin_basename( __FILE__ ) );

$autoloader = WP_RA_DIR . 'vendor/autoload.php';

if ( file_exists( $autoloader ) ) {
	require_once $autoloader;
} else {
	require_once WP_RA_DIR . 'src/autoload.php';
}

add_action(
	'plugins_loaded',
	static function (): void {
		( new WPReactAdmin\App() )->boot();
	}
);

register_activation_hook(
	__FILE__,
	static function (): void {
		( new WPReactAdmin\Options\PluginOptions() )->ensure_defaults();
	}
);
