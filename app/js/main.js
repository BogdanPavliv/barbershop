"use strict"
/* ================= Libs start ========================= */

;(function () {
  var canUseWebP = function () {
    var elem = document.createElement("canvas");

    if (!!(elem.getContext && elem.getContext("2d"))) {
      // was able or not to get WebP representation
      return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
    }

    // very old browser like IE 8, canvas not supported
    return false;
  };

  var isWebpSupported = canUseWebP();

  if (isWebpSupported === false) {
    var lazyItems = document.querySelectorAll("[data-src-replace-webp]");

    for (var i = 0; i < lazyItems.length; i += 1) {
      var item = lazyItems[i];

      var dataSrcReplaceWebp = item.getAttribute("data-src-replace-webp");
      if (dataSrcReplaceWebp !== null) {
        item.setAttribute("data-src", dataSrcReplaceWebp);
      }
    }
  }

  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
  });
})();

/* ================= Libs end ========================= */

/* ================= Slider swiper start ========================= */

const swiperForward = new Swiper(".swiper-forward", {
  effect: "fade",
  pagination: {
    el: ".swiper-pagination-forward",
  },
  autoplay: {
    delay: 1000,
    disableOnInteraction: false,
  },
});

const swiperBack = new Swiper(".swiper-back", {
  effect: "fade",
  pagination: {
    el: ".swiper-pagination-back",
  },
  autoplay: {
    delay: 1000,
    disableOnInteraction: false,
  },
});

window.addEventListener("load", function () {
  swiperForward.update();
  swiperBack.update();
});

/* ================= Slider swiper end ========================= */

/* ================= Tabs start ========================= */

document.querySelectorAll(".swiper__tabs-triggers-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const id = e.target.getAttribute("href").replace("#", "");

    document.querySelectorAll(".swiper__tabs-triggers-item").forEach((child) =>
        child.classList.remove("swiper__tabs-triggers-item--active")
      );
    document.querySelectorAll(".swiper__tabs-content-item").forEach((child) =>
        child.classList.remove("swiper__tabs-content-item--active")
      );

    item.classList.add("swiper__tabs-triggers-item--active");
    document.getElementById(id).classList.add("swiper__tabs-content-item--active");

    // Оновлюємо Swiper після зміни активного слайдера
    swiperForward.update();
    swiperBack.update();

    // Оновлюємо Swiper після зміни активного слайдера вручну
    setTimeout(() => {
      swiperForward.update();
      swiperBack.update();
    }, 500); // Додаткова затримка, можливо, знадобиться
  });
});

document.querySelector(".swiper__tabs-triggers-item").click();

/* ================= Tabs end ========================= */

/* ================= Mobile nav button start ========================= */

const navBtn = document.querySelector('.menu__btn');
const nav = document.querySelector('.mobile-nav');
const navOverlay = document.querySelector('.mobile-nav-overlay');
const menuIcon = document.querySelector('.nav-icon');

function mobileNav() {

  navBtn.addEventListener('click', function () {
		nav.classList.toggle('mobile-nav--open');
    navOverlay.classList.toggle('mobile-nav-overlay--open');
		menuIcon.classList.toggle('nav-icon--active');
		document.body.classList.toggle('no-scroll');
	});

  navOverlay.addEventListener('click', function(e) {
    if (!e.target.closest('.mobile-nav')) {
      nav.classList.remove('mobile-nav--open');
      navOverlay.classList.remove('mobile-nav-overlay--open');
	  	menuIcon.classList.remove('nav-icon--active');
		  document.body.classList.remove('no-scroll');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.which === 27) {
        nav.classList.remove('mobile-nav--open');
        navOverlay.classList.remove('mobile-nav-overlay--open');
        menuIcon.classList.remove('nav-icon--active');
        document.body.classList.remove('no-scroll');
    }
  });
}

mobileNav();


/* ================= Mobile nav button start ========================= */


/* ================= Scroll on click start ========================= */

const menuLinks = document.querySelectorAll(".menu__list-link[data-goto]");
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset; 

            if (menuIcon.classList.contains('nav-icon--active')) {
                document.body.classList.remove('no-scroll');
                menuIcon.classList.remove('nav-icon--active');
                nav.classList.remove('mobile-nav--open');
                navOverlay.classList.remove('mobile-nav-overlay--open');
            }

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }
}

/* ================= Scroll on click end ========================= */

/* ================= Placeholers start ========================= */

let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
	if (inputs.length > 0) {
		for (let index = 0; index < inputs.length; index++) {
			const input = inputs[index];
			const input_g_value = input.getAttribute('data-value');
			input_placeholder_add(input);
			if (input.value != '' && input.value != input_g_value) {
				input_focus_add(input);
			}
			input.addEventListener('focus', function (e) {
				if (input.value == input_g_value) {
					input_focus_add(input);
					input.value = '';
				}
			});
			input.addEventListener('blur', function (e) {
				if (input.value == '') {
					input.value = input_g_value;
					input_focus_remove(input);
				}
			});
		}
	}
}
function input_placeholder_add(input) {
	const input_g_value = input.getAttribute('data-value');
	if (input.value == '' && input_g_value != '') {
		input.value = input_g_value;
	}
}
function input_focus_add(input) {
	input.classList.add('_focus');
	input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
	input.classList.remove('_focus');
	input.parentElement.classList.remove('_focus');
}

/* ================= Placeholers end ========================= */

/* ================= Form validation start ========================= */

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    form.addEventListener("submit", formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        let formData = new FormData(form);

        if (error === 0) {
          form.classList.add('_sending');
          let response = await fetch('sendmail.php', {
              method: 'POST',
              body: formData
          });
          if(response.ok){
             let result = await response.json();
             alert(result.message);
             form.reset();
             form.classList.remove('_sending');
          } else {
             alert("Помилка");
             form.classList.remove('_sending');
          }
      } else {
          alert(`Заповніть обов'язкові поля`);
      }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('_phone')) {
                if (phoneTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else {
               if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add("_error");
    }

    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove("_error");
    }
    // Функція тесту номера телефону
    function phoneTest(input) {
        return !/^0\d{9}$/.test(input.value);
    }

});

/* ================= Form validation end ========================= */

new WOW().init();