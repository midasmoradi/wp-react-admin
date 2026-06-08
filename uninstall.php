<?php
/**
 * Uninstall handler.
 *
 * @package WPReactAdmin
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'wp_ra_settings' );
