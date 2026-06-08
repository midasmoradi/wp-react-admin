<?php
/**
 * PSR-4 fallback autoloader.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

spl_autoload_register(
	static function ( string $class ): void {
		$prefix   = 'WPReactAdmin\\';
		$base_dir = __DIR__ . '/';

		if ( strncmp( $prefix, $class, strlen( $prefix ) ) !== 0 ) {
			return;
		}

		$relative = substr( $class, strlen( $prefix ) );
		$file     = $base_dir . str_replace( '\\', '/', $relative ) . '.php';

		if ( file_exists( $file ) ) {
			require $file;
		}
	}
);
