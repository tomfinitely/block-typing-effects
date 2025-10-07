/**
 * Typing Effects Frontend JavaScript
 */

// Global observer instance for lazy loading support
let globalObserver = null;

document.addEventListener('DOMContentLoaded', function() {
	initializeAllTypingEffects();
});

// Function to initialize all typing effects on the page
function initializeAllTypingEffects() {
	const typingBlocks = document.querySelectorAll('.wp-block-telex-block-typing-effects:not([data-typing-initialized])');
	
	if (typingBlocks.length > 0) {
		// Mark blocks as initialized to prevent duplicate initialization
		typingBlocks.forEach(block => {
			block.setAttribute('data-typing-initialized', 'true');
		});
		
		// Initialize scroll-triggered animations
		initializeScrollTriggeredAnimations(typingBlocks);
	}
}

// Expose function globally for lazy loading compatibility
window.initializeTypingEffects = initializeAllTypingEffects;

function initializeScrollTriggeredAnimations(typingBlocks) {
	// Check if Intersection Observer is supported
	if ('IntersectionObserver' in window) {
		// Create or reuse intersection observer
		if (!globalObserver) {
			globalObserver = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						// Block is now visible, start the animation
						initializeTypingEffect(entry.target);
						// Stop observing this block since animation only runs once
						globalObserver.unobserve(entry.target);
					}
				});
			}, {
				// Start animation when block is 25% visible
				threshold: 0.25,
				// Add some margin to start animation slightly before fully in view
				rootMargin: '50px 0px -50px 0px'
			});
		}

		// Start observing all typing effect blocks
		typingBlocks.forEach(block => {
			globalObserver.observe(block);
		});
	} else {
		// Fallback for browsers without Intersection Observer support
		// Start all animations immediately
		console.warn('IntersectionObserver not supported, starting all typing effects immediately');
		typingBlocks.forEach(block => {
			initializeTypingEffect(block);
		});
	}
}

function initializeTypingEffect(block) {
	const contentContainer = block.querySelector('.typing-content');
	const cursor = block.querySelector('.typing-cursor');
	const config = JSON.parse(block.dataset.config || '{}');
	
	if (!contentContainer) return;

	// Get all text content from inner elements
	const textElements = contentContainer.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, code');
	if (textElements.length === 0) return;

	const {
		effect = 'typewriter',
		typingSpeed = 100,
		shuffleSpeed = 50,
		startDelay = 500,
		showCursor = true,
		cursorChar = '>'
	} = config;

	// Store original content
	const originalElements = Array.from(textElements).map(el => ({
		element: el,
		originalHTML: el.innerHTML,
		originalText: el.textContent || el.innerText || ''
	}));

	// Clear content initially and mark as ready
	originalElements.forEach(({ element }) => {
		element.innerHTML = '';
	});

	// Ensure cursor is hidden initially
	if (cursor) {
		cursor.style.display = 'none';
	}

	// Mark block as ready to animate
	block.classList.add('typing-ready');

	// Start the animation immediately since we're now in view
	setTimeout(() => {
		block.classList.add('typing-active');
		
		// Show cursor if enabled (only for hybrid effect)
		if (showCursor && cursor && effect === 'hybrid') {
			cursor.style.display = 'inline-block';
			// Position cursor at the beginning of the first element
			if (originalElements.length > 0) {
				insertCursorIntoText(originalElements[0].element, cursor, cursorChar, cursorChar);
			}
		} else if (cursor) {
			// Hide cursor for typewriter and matrix effects
			cursor.style.display = 'none';
		}

		// Start the appropriate effect
		switch (effect) {
			case 'typewriter':
				startTypewriterEffect(originalElements, typingSpeed, onComplete);
				break;
			case 'matrix':
				startMatrixEffect(originalElements, typingSpeed, shuffleSpeed, onComplete);
				break;
			case 'hybrid':
				startHybridEffect(originalElements, typingSpeed, shuffleSpeed, cursorChar, onComplete);
				break;
		}
	}, startDelay);

	function onComplete() {
		block.classList.remove('typing-active');
		block.classList.add('typing-complete');
		// Always hide cursor when animation completes
		if (cursor) {
			cursor.style.display = 'none';
		}
	}
}

function insertCursorIntoText(element, cursor, textWithCursor, cursorChar = '>') {
	if (!cursor) return;
	
	// Clear the element
	element.innerHTML = '';
	
	// Split text at cursor position
	const cursorIndex = textWithCursor.indexOf(cursorChar);
	let beforeCursor = '';
	let afterCursor = '';
	
	if (cursorIndex >= 0) {
		beforeCursor = textWithCursor.substring(0, cursorIndex);
		afterCursor = textWithCursor.substring(cursorIndex + 1);
	} else {
		// If no cursor marker, cursor goes at the end
		beforeCursor = textWithCursor;
	}
	
	// Create text nodes
	if (beforeCursor) {
		element.appendChild(document.createTextNode(beforeCursor));
	}
	
	// Insert cursor
	const cursorClone = cursor.cloneNode(true);
	cursorClone.style.display = 'inline';
	cursorClone.style.position = 'static';
	cursorClone.style.left = 'auto';
	cursorClone.style.top = 'auto';
	cursorClone.style.transform = 'none';
	element.appendChild(cursorClone);
	
	// Add remaining text
	if (afterCursor) {
		element.appendChild(document.createTextNode(afterCursor));
	}
}

function startTypewriterEffect(elements, speed, callback) {
	let currentElementIndex = 0;
	let currentCharIndex = 0;
	
	function typeChar() {
		if (currentElementIndex >= elements.length) {
			callback();
			return;
		}

		const currentElement = elements[currentElementIndex];
		const text = currentElement.originalText;

		if (currentCharIndex < text.length) {
			// Add the character directly
			currentElement.element.textContent += text.charAt(currentCharIndex);
			currentCharIndex++;
			setTimeout(typeChar, speed);
		} else {
			// Move to next element
			currentElementIndex++;
			currentCharIndex = 0;
			setTimeout(typeChar, speed * 2); // Slight pause between elements
		}
	}
	
	typeChar();
}

function startMatrixEffect(elements, typingSpeed, shuffleSpeed, callback) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
	let currentElementIndex = 0;
	let currentCharIndex = 0;
	
	function revealChar() {
		if (currentElementIndex >= elements.length) {
			callback();
			return;
		}

		const currentElement = elements[currentElementIndex];
		const text = currentElement.originalText;

		if (currentCharIndex >= text.length) {
			// Move to next element
			currentElementIndex++;
			currentCharIndex = 0;
			setTimeout(revealChar, typingSpeed * 2);
			return;
		}
		
		const targetChar = text.charAt(currentCharIndex);
		let shuffleCount = 0;
		const maxShuffles = Math.floor(Math.random() * 10) + 5;
		
		function shuffle() {
			if (shuffleCount < maxShuffles && targetChar !== ' ') {
				const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
				const currentText = currentElement.element.textContent;
				currentElement.element.textContent = currentText.substring(0, currentCharIndex) + randomChar;
				shuffleCount++;
				setTimeout(shuffle, shuffleSpeed);
			} else {
				const currentText = currentElement.element.textContent;
				currentElement.element.textContent = currentText.substring(0, currentCharIndex) + targetChar;
				currentCharIndex++;
				setTimeout(revealChar, typingSpeed);
			}
		}
		
		if (targetChar === ' ') {
			// Add space directly
			currentElement.element.textContent += ' ';
			currentCharIndex++;
			setTimeout(revealChar, typingSpeed / 2);
		} else {
			shuffle();
		}
	}
	
	revealChar();
}

function startHybridEffect(elements, typingSpeed, shuffleSpeed, cursorChar, callback) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let currentElementIndex = 0;
	let currentCharIndex = 0;
	const block = elements[0].element.closest('.wp-block-telex-block-typing-effects');
	const cursor = block.querySelector('.typing-cursor');
	
	function typeWithShuffle() {
		if (currentElementIndex >= elements.length) {
			callback();
			return;
		}

		const currentElement = elements[currentElementIndex];
		const text = currentElement.originalText;

		if (currentCharIndex >= text.length) {
			// Move to next element
			currentElementIndex++;
			currentCharIndex = 0;
			setTimeout(typeWithShuffle, typingSpeed * 2);
			return;
		}
		
		const targetChar = text.charAt(currentCharIndex);
		
		if (targetChar === ' ') {
			// Get current text and add space with cursor
			const currentText = text.substring(0, currentCharIndex + 1);
			const textWithCursor = currentText + cursorChar;
			insertCursorIntoText(currentElement.element, cursor, textWithCursor, cursorChar);
			currentCharIndex++;
			setTimeout(typeWithShuffle, typingSpeed / 2);
			return;
		}
		
		// Shuffle phase
		let shuffleCount = 0;
		const maxShuffles = Math.floor(Math.random() * 5) + 2;
		
		function shuffle() {
			if (shuffleCount < maxShuffles) {
				const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
				const currentText = text.substring(0, currentCharIndex);
				const textWithShuffle = currentText + randomChar + cursorChar;
				insertCursorIntoText(currentElement.element, cursor, textWithShuffle, cursorChar);
				
				setTimeout(() => {
					const textWithCursor = currentText + cursorChar;
					insertCursorIntoText(currentElement.element, cursor, textWithCursor, cursorChar);
					shuffleCount++;
					setTimeout(shuffle, shuffleSpeed);
				}, shuffleSpeed);
			} else {
				// Add the target character with cursor
				const currentText = text.substring(0, currentCharIndex + 1);
				const textWithCursor = currentText + cursorChar;
				insertCursorIntoText(currentElement.element, cursor, textWithCursor, cursorChar);
				currentCharIndex++;
				setTimeout(typeWithShuffle, typingSpeed);
			}
		}
		
		shuffle();
	}
	
	typeWithShuffle();
}