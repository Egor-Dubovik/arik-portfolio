// Detect when item-process elements are in the center of the screen
function initProcessItemsActive() {
	const processItems = document.querySelectorAll('.item-process');

	if (!processItems.length) return;

	function checkCenterPosition() {
		const viewportHeight = window.innerHeight;
		const viewportCenter = viewportHeight / 2;

		// Find currently active item
		let currentActiveIndex = -1;
		processItems.forEach((item, index) => {
			if (item.classList.contains('--active')) {
				currentActiveIndex = index;
			}
		});

		// Check if current active item is half hidden and activate next
		if (currentActiveIndex >= 0) {
			const currentActiveItem = processItems[currentActiveIndex];
			const rect = currentActiveItem.getBoundingClientRect();

			// Calculate visible portion of the item
			const visibleTop = Math.max(0, rect.top);
			const visibleBottom = Math.min(viewportHeight, rect.bottom);
			const visibleHeight = visibleBottom - visibleTop;
			const itemHeight = rect.height;
			const visibleRatio = visibleHeight / itemHeight;

			// If item is less than 50% visible (more than half hidden)
			if (visibleRatio < 0.5) {
				// Determine scroll direction
				const isScrollingDown =
					rect.top < 0 || (rect.top < viewportCenter && rect.bottom < viewportCenter);

				if (isScrollingDown && currentActiveIndex < processItems.length - 1) {
					// Scrolling down: activate next item
					currentActiveItem.classList.remove('--active');
					processItems[currentActiveIndex + 1].classList.add('--active');
					return;
				} else if (!isScrollingDown && currentActiveIndex > 0) {
					// Scrolling up: activate previous item
					currentActiveItem.classList.remove('--active');
					processItems[currentActiveIndex - 1].classList.add('--active');
					return;
				}
			}
		}

		// Find item closest to viewport center
		let closestItem = null;
		let closestDistance = Infinity;

		processItems.forEach(item => {
			const rect = item.getBoundingClientRect();
			const itemCenter = rect.top + rect.height / 2;
			const distanceFromCenter = Math.abs(itemCenter - viewportCenter);

			// Check if item is visible and within reasonable distance
			if (rect.bottom > 0 && rect.top < viewportHeight && distanceFromCenter < closestDistance) {
				closestDistance = distanceFromCenter;
				closestItem = item;
			}
		});

		// Remove all active classes
		processItems.forEach(item => {
			item.classList.remove('--active');
		});

		// Activate closest item if found
		if (closestItem) {
			closestItem.classList.add('--active');
		} else if (processItems.length > 0) {
			// Fallback: activate first visible item
			for (let item of processItems) {
				const rect = item.getBoundingClientRect();
				if (rect.bottom > 0 && rect.top < viewportHeight) {
					item.classList.add('--active');
					break;
				}
			}
		}
	}

	// Check on scroll and resize
	window.addEventListener('scroll', checkCenterPosition, { passive: true });
	window.addEventListener('resize', checkCenterPosition, { passive: true });

	// Initial check
	checkCenterPosition();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initProcessItemsActive);
} else {
	initProcessItemsActive();
}
