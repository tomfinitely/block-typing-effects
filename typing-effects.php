<?php
/**
 * Plugin Name:       Typing Effects
 * Description:       Create engaging typing animations with typewriter, Matrix-style, and hybrid effects.
 * Version:           0.2.0
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Author:            WordPress Telex
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       typing-effects
 *
 * @package TypingEffects
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function typing_effects_typing_effects_block_init() {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'typing_effects_typing_effects_block_init' );
	