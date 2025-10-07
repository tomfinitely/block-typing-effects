<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$effect = $attributes['effect'] ?? 'typewriter';
$typing_speed = $attributes['typingSpeed'] ?? 100;
$shuffle_speed = $attributes['shuffleSpeed'] ?? 50;
$start_delay = $attributes['startDelay'] ?? 500;
$show_cursor = $attributes['showCursor'] ?? true;
$cursor_char = $attributes['cursorChar'] ?? '>';

$config = wp_json_encode( array(
	'effect' => $effect,
	'typingSpeed' => $typing_speed,
	'shuffleSpeed' => $shuffle_speed,
	'startDelay' => $start_delay,
	'showCursor' => $show_cursor,
	'cursorChar' => $cursor_char,
) );

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'effect-' . $effect,
	'data-config' => $config,
) );
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="typing-content">
		<?php echo $content; ?>
	</div>
	<?php if ( $show_cursor && $effect === 'hybrid' ) : ?>
		<span class="typing-cursor"><?php echo esc_html( $cursor_char ); ?></span>
	<?php endif; ?>
</div>