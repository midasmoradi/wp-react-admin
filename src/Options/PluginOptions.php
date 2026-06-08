<?php
/**
 * Plugin options.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

namespace WPReactAdmin\Options;

use WPReactAdmin\Contracts\HookableInterface;

final class PluginOptions implements HookableInterface {

	public const OPTION_NAME = 'wp_ra_settings';

	/** @var array<string, mixed> */
	private array $defaults = [
		'dashboard_title'    => 'React Dashboard',
		'show_posts_chart'   => true,
		'show_users_stat'    => true,
		'show_activity_feed' => true,
		'chart_months'       => 6,
	];

	public function register(): void {
		add_action( 'admin_init', [ $this, 'register_settings' ] );
	}

	public function register_settings(): void {
		register_setting( 'wp_ra_settings_group', self::OPTION_NAME, [
			'type'              => 'array',
			'sanitize_callback' => [ $this, 'sanitize' ],
			'default'           => $this->defaults,
		] );
	}

	/** @param array<string, mixed> $input */
	public function sanitize( array $input ): array {
		$output = $this->get_all();

		if ( isset( $input['dashboard_title'] ) ) {
			$output['dashboard_title'] = sanitize_text_field( (string) $input['dashboard_title'] );
		}

		$output['show_posts_chart']   = ! empty( $input['show_posts_chart'] );
		$output['show_users_stat']    = ! empty( $input['show_users_stat'] );
		$output['show_activity_feed'] = ! empty( $input['show_activity_feed'] );
		$output['chart_months']       = isset( $input['chart_months'] )
			? max( 3, min( 12, absint( $input['chart_months'] ) ) )
			: 6;

		return $output;
	}

	public function get( string $key, mixed $default = null ): mixed {
		$options = $this->get_all();

		return $options[ $key ] ?? ( $default ?? ( $this->defaults[ $key ] ?? null ) );
	}

	/** @return array<string, mixed> */
	public function get_all(): array {
		$stored = get_option( self::OPTION_NAME, [] );

		return array_merge( $this->defaults, is_array( $stored ) ? $stored : [] );
	}

	public function ensure_defaults(): void {
		if ( false === get_option( self::OPTION_NAME, false ) ) {
			add_option( self::OPTION_NAME, $this->defaults );
		}
	}
}
