<?php
/**
 * Application bootstrap.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

namespace WPReactAdmin;

use WPReactAdmin\Admin\DashboardRegistrar;
use WPReactAdmin\Api\AnalyticsRestController;
use WPReactAdmin\Api\PostsRestController;
use WPReactAdmin\Container\Container;
use WPReactAdmin\Core\Setup;
use WPReactAdmin\Options\PluginOptions;
use WPReactAdmin\Security\SecurityManager;

final class App {

	private Container $container;

	public function __construct() {
		$this->container = new Container();
		$this->register_bindings();
	}

	public function boot(): void {
		$this->container->get( Setup::class )->register();
		$this->container->get( SecurityManager::class )->register();
		$this->container->get( PluginOptions::class )->register();
		$this->container->get( DashboardRegistrar::class )->register();
		$this->container->get( AnalyticsRestController::class )->register();
		$this->container->get( PostsRestController::class )->register();
	}

	private function register_bindings(): void {
		$this->container->singleton( Container::class, fn() => $this->container );
		$this->container->singleton( Setup::class );
		$this->container->singleton( SecurityManager::class );
		$this->container->singleton( PluginOptions::class );
		$this->container->singleton( DashboardRegistrar::class );
		$this->container->singleton( AnalyticsRestController::class );
		$this->container->singleton( PostsRestController::class );
	}
}
