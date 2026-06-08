<?php
/**
 * DI container.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

namespace WPReactAdmin\Container;

use Closure;
use RuntimeException;

final class Container {

	/** @var array<string, Closure|object> */
	private array $bindings = [];

	/** @var array<string, object> */
	private array $instances = [];

	public function singleton( string $abstract, ?Closure $factory = null ): void {
		$this->bindings[ $abstract ] = $factory ?? fn() => new $abstract();
	}

	/** @param class-string $abstract */
	public function get( string $abstract ): object {
		if ( isset( $this->instances[ $abstract ] ) ) {
			return $this->instances[ $abstract ];
		}

		if ( ! isset( $this->bindings[ $abstract ] ) ) {
			if ( class_exists( $abstract ) ) {
				$this->bindings[ $abstract ] = fn() => new $abstract();
			} else {
				throw new RuntimeException( sprintf( 'Service [%s] not bound.', $abstract ) );
			}
		}

		$factory  = $this->bindings[ $abstract ];
		$instance = $factory instanceof Closure ? $factory( $this ) : $factory;

		$this->instances[ $abstract ] = $instance;

		return $instance;
	}
}
