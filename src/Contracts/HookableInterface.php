<?php
/**
 * Hookable contract.
 *
 * @package WPReactAdmin
 */

declare(strict_types=1);

namespace WPReactAdmin\Contracts;

interface HookableInterface {
	public function register(): void;
}
