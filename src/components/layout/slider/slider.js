/*
Документація по роботі у шаблоні: 
Документація слайдера: https://swiperjs.com/
Сніппет(HTML): swiper
*/

// Підключаємо слайдер Swiper з node_modules
// При необхідності підключаємо додаткові модулі слайдера, вказуючи їх у {} через кому
// Приклад: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { isMobile } from '@js/common/functions.js';
/*
Основні модулі слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Детальніше дивись https://swiperjs.com/
*/

// Стилі Swiper
// Підключення базових стилів
import './slider.scss';
// Повний набір стилів з node_modules
// import 'swiper/css/bundle';

function isMobileDevice() {
	return window.innerWidth <= 767.998;
}

let swiperInstance = null;

// Ініціалізація слайдерів
function initSliders() {
	if (document.querySelector('.reviews__slider')) {
		if (!isMobileDevice()) {
			return;
		}

		// Якщо слайдер вже ініціалізований, не створюємо новий
		if (swiperInstance) {
			return;
		}

		swiperInstance = new Swiper('.swiper', {
			modules: [Navigation, Pagination, Autoplay],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 30,
			autoHeight: true,
			speed: 800,
			enabled: isMobileDevice(),

			//touchRatio: 0,
			//simulateTouch: false,
			// loop: true,
			//preloadImages: false,
			//lazy: true,

			// Ефекти
			effect: 'fade',
			autoplay: {
				delay: 8000,
				disableOnInteraction: false,
			},

			// Пагінація
			pagination: {
				el: '.swiper__pagination',
				type: 'bullets',
				clickable: false,
				dynamicBullets: false,
			},

			// Скроллбар
			/*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

			// Кнопки "вліво/вправо"
			navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next',
			},
			// Брейкпоінти - вимикаємо слайдер на екранах більше 768px
			breakpoints: {
				768: {
					enabled: false,
				},
			},
			// Події
			on: {
				init: function (swiper) {
					const allSlides = document.querySelector('.swiper__all-fraction');
					const allSlidesItems = document.querySelectorAll('.item-review');
					allSlides.innerHTML =
						allSlidesItems.length < 10 ? `0${allSlidesItems.length}` : allSlidesItems.length;

					updatePaginationPosition(swiper);
					resetBulletAnimation();
				},
				slideChange: function (swiper) {
					const currentSlide = document.querySelector('.swiper__current-fraction');
					currentSlide.innerHTML =
						swiper.realIndex + 1 < 10 ? `0${swiper.realIndex + 1}` : swiper.realIndex + 1;

					updatePaginationPosition(swiper);
					resetBulletAnimation();
				},
			},
		});
	}
}

function updatePaginationPosition(swiper) {
	const pagination = document.querySelector('.swiper__pagination');
	if (pagination) {
		const activeIndex = swiper.activeIndex;
		const translateX = -activeIndex * 100;
		pagination.style.transform = `translateX(${translateX}%) translateY(10%)`;
	}
}

function resetBulletAnimation() {
	const activeBullet = document.querySelector('.swiper-pagination-bullet-active');

	if (activeBullet) {
		activeBullet.classList.add('bullet-animation-reset');

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setTimeout(() => {
					activeBullet.classList.remove('bullet-animation-reset');
				}, 10);
			});
		});
	}
}

// function handleResize() {
// 	if (swiperInstance) {
// 		if (isMobileDevice()) {
// 			swiperInstance.enable();
// 		} else {
// 			swiperInstance.disable();
// 		}
// 	} else if (isMobileDevice() && document.querySelector('.reviews__slider')) {
// 		// Якщо слайдер не ініціалізований, але тепер мобільний пристрій
// 		initSliders();
// 	}
// }

// let resizeTimer;
// window.addEventListener('resize', () => {
// 	clearTimeout(resizeTimer);
// 	resizeTimer = setTimeout(handleResize, 250);
// });

document.querySelector('[data-fls-slider]') ? window.addEventListener('load', initSliders) : null;
