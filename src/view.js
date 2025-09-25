/**
 * Typing Effects Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
	const typingBlocks = document.querySelectorAll('.wp-block-telex-block-typing-effects');
	
	typingBlocks.forEach(initializeTypingEffect);
});

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
		showCursor = true
	} = config;

	// Store original content
	const originalElements = Array.from(textElements).map(el => ({
		element: el,
		originalHTML: el.innerHTML,
		originalText: el.textContent || el.innerText || ''
	}));

	// Clear content initially
	originalElements.forEach(({ element }) => {
		element.innerHTML = '';
	});

	block.classList.add('typing-active');

	// Show cursor if enabled
	if (showCursor && cursor) {
		cursor.style.display = 'inline-block';
	}

	setTimeout(() => {
		switch (effect) {
			case 'typewriter':
				startTypewriterEffect(originalElements, typingSpeed, onComplete);
				break;
			case 'matrix':
				startMatrixEffect(originalElements, typingSpeed, shuffleSpeed, onComplete);
				break;
			case 'hybrid':
				startHybridEffect(originalElements, typingSpeed, shuffleSpeed, onComplete);
				break;
		}
	}, startDelay);

	function onComplete() {
		block.classList.remove('typing-active');
		block.classList.add('typing-complete');
		if (cursor && showCursor) {
			cursor.style.display = 'none';
		}
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
			currentElement.element.textContent += ' ';
			currentCharIndex++;
			setTimeout(revealChar, typingSpeed / 2);
		} else {
			shuffle();
		}
	}
	
	revealChar();
}

function startHybridEffect(elements, typingSpeed, shuffleSpeed, callback) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let currentElementIndex = 0;
	let currentCharIndex = 0;
	
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
			currentElement.element.textContent += ' ';
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
				const currentText = currentElement.element.textContent;
				currentElement.element.textContent = currentText + randomChar;
				
				setTimeout(() => {
					currentElement.element.textContent = currentText;
					shuffleCount++;
					setTimeout(shuffle, shuffleSpeed);
				}, shuffleSpeed);
			} else {
				// Reveal the actual character
				currentElement.element.textContent += targetChar;
				currentCharIndex++;
				setTimeout(typeWithShuffle, typingSpeed);
			}
		}
		
		shuffle();
	}
	
	typeWithShuffle();
}