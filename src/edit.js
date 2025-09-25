/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ToggleControl, TextControl } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { 
		effect, 
		typingSpeed, 
		shuffleSpeed, 
		startDelay, 
		showCursor, 
		cursorChar 
	} = attributes;

	const blockProps = useBlockProps( {
		className: `typing-effects-block effect-${effect}`
	} );

	const effectOptions = [
		{ label: __( 'Typewriter', 'typing-effects' ), value: 'typewriter' },
		{ label: __( 'Matrix Shuffle', 'typing-effects' ), value: 'matrix' },
		{ label: __( 'Hybrid (Both)', 'typing-effects' ), value: 'hybrid' },
	];

	const ALLOWED_BLOCKS = [
		'core/paragraph',
		'core/heading',
		'core/list',
		'core/quote',
		'core/code',
		'core/preformatted',
		'core/verse'
	];

	const TEMPLATE = [
		['core/paragraph', {
			placeholder: __( 'Enter text that will animate with typing effects...', 'typing-effects' )
		}]
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Animation Settings', 'typing-effects' ) }>
					<SelectControl
						label={ __( 'Effect Type', 'typing-effects' ) }
						value={ effect }
						options={ effectOptions }
						onChange={ ( value ) => setAttributes( { effect: value } ) }
					/>
					
					<RangeControl
						label={ __( 'Typing Speed (ms)', 'typing-effects' ) }
						value={ typingSpeed }
						onChange={ ( value ) => setAttributes( { typingSpeed: value } ) }
						min={ 1 }
						max={ 500 }
						step={ 1 }
						help={ __( 'Lower values = faster typing. Minimum 1ms for ultra-fast effects.', 'typing-effects' ) }
					/>

					{ ( effect === 'matrix' || effect === 'hybrid' ) && (
						<RangeControl
							label={ __( 'Shuffle Speed (ms)', 'typing-effects' ) }
							value={ shuffleSpeed }
							onChange={ ( value ) => setAttributes( { shuffleSpeed: value } ) }
							min={ 1 }
							max={ 200 }
							step={ 1 }
							help={ __( 'Speed of character shuffling before revealing final character.', 'typing-effects' ) }
						/>
					) }

					<RangeControl
						label={ __( 'Start Delay (ms)', 'typing-effects' ) }
						value={ startDelay }
						onChange={ ( value ) => setAttributes( { startDelay: value } ) }
						min={ 0 }
						max={ 2000 }
						step={ 100 }
					/>

					<ToggleControl
						label={ __( 'Show Cursor', 'typing-effects' ) }
						checked={ showCursor }
						onChange={ ( value ) => setAttributes( { showCursor: value } ) }
					/>

					{ showCursor && (
						<TextControl
							label={ __( 'Cursor Character', 'typing-effects' ) }
							value={ cursorChar }
							onChange={ ( value ) => setAttributes( { cursorChar: value } ) }
							placeholder="|"
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="typing-effects-editor">
					<div className="effect-indicator">
						<span className="effect-badge">{ effectOptions.find( opt => opt.value === effect )?.label }</span>
						<span className="speed-indicator">{ typingSpeed }ms</span>
					</div>
					<div className="typing-content-wrapper">
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
							templateInsertUpdatesSelection={ false }
						/>
						{ showCursor && (
							<span className="typing-cursor-preview">{ cursorChar }</span>
						) }
					</div>
				</div>
			</div>
		</>
	);
}