// polyfills for IE11
if (!Array.from) {
    Array.from = (function() {
        var toStr = Object.prototype.toString;
        var isCallable = function(fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function(value) {
            var number = Number(value);
            if (isNaN(number)) {
                return 0;
            }
            if (number === 0 || !isFinite(number)) {
                return number;
            }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function(value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        return function from(arrayLike /*, mapFn, thisArg */ ) {
            var C = this;
            var items = Object(arrayLike);
            if (arrayLike == null) {
                throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }
            var len = toLength(items.length);
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);
            var k = 0;
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            A.length = len;
            return A;
        };
    }());
}
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (len === 0) {
                return false;
            }
            var n = fromIndex | 0;
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }
            while (k < len) {
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                k++;
            }
            return false;
        }
    });
}
if ('NodeList' in window && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}
if (!Element.prototype.closest) {
    Element.prototype.closest = function(css) {
        var node = this;
        while (node) {
            if (node.matches(css)) return node;
            else node = node.parentElement;
        }
        return null;
    };
}
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector;
}

// custom function addEvent
function addEvent(parent, evt, selector, handler) {
    parent.addEventListener(evt, function(event) {
        if (event.target.matches(selector + ', ' + selector + ' *')) {
            handler.apply(event.target.closest(selector), arguments);
        }
    }, false);
}

// scrollbar width
function getScrollBarWidth() {
    let inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    let outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    let w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
};

let appObj = function() {
    let thisApp = this,
        isInit = false,
        isLoad = false,
        swiperGalleryArr,
        sidebar,
        myDropzone = [];

    this.init = function() {
        if (thisApp.isInit) {
            return;
        }

        thisApp.swiperGalleryArr = new Map();

        thisApp.customAlert();
        thisApp.mapInit();
        thisApp.initModal();
        if (document.querySelectorAll('.accordeon-wr').length) {
            document.querySelectorAll('.accordeon-wr').forEach(function(accordeonBlock) {
                thisApp.accordeonInit(accordeonBlock);
            });
        }
        thisApp.arrowTop();
        if (document.querySelectorAll('.counter').length) {
            document.querySelectorAll('.counter').forEach(function(counter) {
                thisApp.countersInit(counter);
            });
        }
        if (document.querySelectorAll('.dropdown').length) {
            document.querySelectorAll('.dropdown').forEach(function(dropdown) {
                thisApp.dropdownInit(dropdown);
            });
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.dropdown')) {
                    document.querySelectorAll('.dropdown').forEach(function(dropdown) {
                        dropdown.querySelector('.dropdown-content').style.height = '0';
                        dropdown.classList.remove('is-open');
                    });
                }
            });
        }
        if (document.querySelectorAll('input[type="phone"]').length) {
            document.querySelectorAll('input[type="phone"]').forEach(function(phone) {
                thisApp.phoneMaskInit(phone);
            });
        }
        if (document.querySelectorAll('.field_date').length) {
            document.querySelectorAll('.field_date').forEach(function(date) {
                thisApp.dateMaskInit(date);
            });
        }
        if (document.querySelectorAll('select').length) {
            document.querySelectorAll('select').forEach(function(select) {
                thisApp.customSelectInit(select);
            });
        }
        if (document.querySelectorAll('.field-wr').length) {
            document.querySelectorAll('.field-wr .field').forEach(function(input) {
                thisApp.fieldLabelInit(input);
            });
        }
        if (document.querySelectorAll('.dropzone').length) {
            Dropzone.autoDiscover = false;
            document.querySelectorAll('.dropzone').forEach(function(fileField) {
                thisApp.customFileFieldInit(fileField);
            });
        }
        if (document.querySelectorAll('.hamburger').length) {
            document.querySelectorAll('.hamburger').forEach(function(hamburger) {
                thisApp.hamburgerInit(hamburger);
            });
        }
        if (document.querySelectorAll('.range-slider').length) {
            document.querySelectorAll('.range-slider').forEach(function(range) {
                thisApp.rangeSliderInit(range);
            });
        }
        if (document.querySelectorAll('.js-scrollbar').length) {
            document.querySelectorAll('.js-scrollbar').forEach(function(scrollbar) {
                thisApp.customScrollbarInit(scrollbar);
            });
        }
        if (document.querySelectorAll('.tabs').length) {
            document.querySelectorAll('.tabs').forEach(function(tab) {
                thisApp.tabsInit(tab);
            });
        }
        if (document.querySelectorAll('.swiper-container').length) {
            document.querySelectorAll('.swiper-container').forEach(function(carousel) {
                thisApp.carouselInit(carousel);
            });
        }
        if (document.querySelectorAll('.tooltip').length) {
            document.querySelectorAll('.tooltip').forEach(function(tooltip) {
                thisApp.customTooltipInit(tooltip);
            });
            document.onclick = function(e) {
                if (!e.target.closest('.tooltip-content')) {
                    document.querySelectorAll('.tooltip').forEach(function(tooltip) {
                        tooltip.classList.remove('is-open');
                    });
                }
            };
        }
        thisApp.isInit = true;
    };
    this.load = function() {
        if (thisApp.isLoad) {
            return;
        }
        window.addEventListener('load', function() {
            thisApp.stickySidebarInit();
            thisApp.isLoad = true;
        });
    };

    // custom alert
    this.customAlert = function() {
        addEvent(document, 'click', '.alert #closeButton', function() {
            let alert = document.querySelector('.alert');
            document.body.removeChild(alert);
        });
    };
    this.showCustomAlert = function(title, text, buttonOkText) {
        let alert = document.createElement('div');
        alert.classList.add('alert');
        let alertContent = '<div class="alert-title">' + title + '</div><div class="alert-text">' + text + '</div><div class="alert-buttons"><button class="button button_primary" type="button">' + buttonOkText + '</button><button class="button button_secondary" id="closeButton" type="button">Отмена</button></div>';
        alert.innerHTML = alertContent;
        document.body.appendChild(alert);
    };

    // map
    this.mapInit = function() {
        let map = document.querySelectorAll('.js-map'),
            myMap;
        if (map.length) {
            map.forEach(function(element) {
                let mapid = element.getAttribute('data-id'),
                    zoom = element.getAttribute('data-zoom'),
                    pinLat = parseFloat(element.getAttribute('data-lat')),
                    pinLong = parseFloat(element.getAttribute('data-long')),
                    centerlat = parseFloat(element.getAttribute('data-center-lat')),
                    centerLong = parseFloat(element.getAttribute('data-center-long')),
                    map = element;

                ymaps.ready(function() {
                    init(map, mapid, zoom, pinLat, pinLong, centerlat, centerLong);
                });
            });

            function init(map, mapid, zoom, pinLat, pinLong, centerlat, centerLong) {
                myMap = new ymaps.Map(map, {
                        center: [centerlat, centerLong],
                        zoom: zoom,
                        controls: [],
                    }),
                    objectManager = new ymaps.ObjectManager();
                myMap.geoObjects.add(objectManager);
                myMap.behaviors.disable('scrollZoom');
                myMap.controls.add('zoomControl');

                let dataUrl = mapid + '.json';

                let xhr = new XMLHttpRequest();
                xhr.open('GET', dataUrl);
                xhr.send(null);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            objectManager.add(xhr.response);
                        }
                    }
                };
            }
        }
    };

    // modal windows
    this.initModal = function() {
        addEvent(document, 'click', '[data-modal]', function() {
            let modalId = this.getAttribute('data-modal'),
                currentModal = document.querySelector('#' + modalId);
            if (this.classList.contains('js-close-parent')) {
                thisApp.hideModal(this.closest('.modal-wr'));
            }
            thisApp.showModal(currentModal);
        });
        addEvent(document, 'click', '.modal-close', function(e) {
            thisApp.hideModal(this.closest('.modal-wr'));
        });
        addEvent(document, 'click', '.modal-wr.is-open', function(e) {
            if (!e.target.closest('.modal')) {
                thisApp.hideModal(this);
            }
        });
        window.addEventListener('resize', function() {
            let openModals = document.querySelectorAll('.modal-wr.is-open');
            if (openModals.length) {
                openModals.forEach(function(openModal) {
                    thisApp.setModalContentHeight(openModal);
                });
            }
        });
    };
    this.showModal = function(modal) {
        let scrollBarWidth = getScrollBarWidth();
        modal.classList.add('is-open');
        if (document.querySelectorAll('.modal-wr.is-open').length) {
            let maxZIndex = 1000;
            document.querySelectorAll('.modal-wr.is-open').forEach(function(el) {
                if (parseInt(el.style.zIndex) > maxZIndex) {
                    maxZIndex = parseInt(el.style.zIndex);
                }
            });
            modal.style.zIndex = maxZIndex + 1;
        }
        thisApp.setModalContentHeight(modal);
        document.querySelector('body').style.overflow = 'hidden';
        document.querySelector('body').style.paddingRight = scrollBarWidth + 'px';
    };
    this.hideModal = function(modal) {
        modal.classList.remove('is-open');
        modal.style.zIndex = null;
        if (document.querySelectorAll('.modal-wr.is-open').length < 1) {
            document.querySelector('body').style.overflow = null;
            document.querySelector('body').style.paddingRight = null;
        }
    };
    this.setModalContentHeight = function(modal) {
        let modalBlock = modal.querySelector('.modal');
        if (modalBlock.querySelectorAll('.modal-content').length) {
            let titleHeight,
                modalBlockPadding,
                modalBlockMargin,
                contentHeight;
            let computedStyle = getComputedStyle(modalBlock);
            modalBlockPadding = parseInt(computedStyle.paddingTop) + parseInt(computedStyle.paddingBottom);
            if (modalBlock.querySelector('.modal-title')) {
                titleHeight = modalBlock.querySelector('.modal-title').offsetHeight
            } else {
                titleHeight = 0;
            }
            modalBlockMargin = 40;
            contentHeight = 'calc(100vh - ' + (titleHeight + modalBlockPadding + modalBlockMargin) + 'px)';
            modalBlock.querySelector('.modal-content').style.maxHeight = contentHeight;
        }
    };

    // swiper carousels
    this.carouselInit = function(carousel) {
        if (!carousel.closest('.gallery-group')) {
            let carouselLength,
                carouselLengthS;
            carousel.getAttribute('data-l') === 'auto' ? carouselLength = carousel.getAttribute('data-l') : carouselLength = parseInt(carousel.getAttribute('data-l'));
            carousel.getAttribute('data-l-s') === 'auto' ? carouselLengthS = carousel.getAttribute('data-l-s') : carouselLengthS = parseInt(carousel.getAttribute('data-l-s'));

            let carouselMargin = parseInt(carousel.getAttribute('data-m')),
                carouselMarginS = parseInt(carousel.getAttribute('data-m-s')),
                carouselPagination = carousel.getAttribute('data-pagination');

            let paginationVal = {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            };
            let swiperGallery = new Swiper(carousel, {
                loop: false,
                slidesPerView: carouselLength,
                spaceBetween: carouselMargin,
                watchOverflow: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: carouselPagination ? paginationVal : false,
                breakpoints: {
                    767: {
                        slidesPerView: carouselLengthS,
                        spaceBetween: carouselMarginS,
                    }
                }
            });
            thisApp.swiperGalleryArr.set(carousel, swiperGallery);
        } else {
            if (document.querySelector('.gallery-group').offsetWidth > 0) {
                let galleryThumbs = new Swiper(document.querySelector('.gallery-thumbs'), {
                    slidesPerView: 4,
                    spaceBetween: 10,
                    freeMode: true,
                    watchOverflow: true,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true,
                });
                thisApp.swiperGalleryArr.set(carousel, galleryThumbs);
                let galleryMain = new Swiper(document.querySelectorAll('.gallery-top'), {
                    loop: false,
                    watchOverflow: true,
                    simulateTouch: false,
                    allowTouchMove: false,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction',
                        formatFractionCurrent: function(number) {
                            if (number < 10) {
                                return '0' + number
                            } else {
                                return number
                            }
                        },
                        formatFractionTotal: function(number) {
                            if (number < 10) {
                                return '0' + number
                            } else {
                                return number
                            }
                        },
                    },
                    thumbs: {
                        swiper: galleryThumbs,
                    },
                });
                thisApp.swiperGalleryArr.set(carousel, galleryMain);
            }
        }
    };
    this.carouselUpdate = function(carousel) {
        thisApp.swiperGalleryArr.get(carousel).update();
    };

    // accordeon
    this.accordeonInit = function(accordeonBlock) {
        let accordeons = accordeonBlock.querySelectorAll('.accordeon');
        accordeons.forEach(function(accordeon) {
            if (accordeon.classList.contains('is-open')) {
                accordeon.querySelector('.accordeon-content').style.height = 'auto';
            }
            accordeon.querySelector('.accordeon-headline').onclick = function() {
                if (!accordeon.classList.contains('is-open')) {
                    let accordeonHeight = accordeon.querySelector('.accordeon-content').scrollHeight;
                    accordeonBlock.querySelectorAll('.accordeon').forEach(function(el) {
                        let accordeonHeight = el.querySelector('.accordeon-content').offsetHeight;
                        el.querySelector('.accordeon-content').style.height = accordeonHeight + 'px';
                        setTimeout(function() {
                            el.querySelector('.accordeon-content').style.height = '0';
                        }, 1);
                        el.classList.remove('is-open');
                    });
                    setTimeout(function() {
                        accordeon.querySelector('.accordeon-content').style.height = accordeonHeight + 'px';
                    }, 2);
                    accordeon.classList.add('is-open');
                    setTimeout(function() {
                        accordeon.querySelector('.accordeon-content').style.height = 'auto';
                    }, 200);
                } else {
                    let accordeonHeight = accordeon.querySelector('.accordeon-content').offsetHeight;
                    accordeon.querySelector('.accordeon-content').style.height = accordeonHeight + 'px';
                    setTimeout(function() {
                        accordeon.querySelector('.accordeon-content').style.height = '0';
                    }, 1);
                    accordeon.classList.remove('is-open');
                }
            };
        });

    };
    this.accordeonUpdate = function(accordeon) {
        if (accordeon.classList.contains('is-open')) {
            accordeon.querySelector('.accordeon-content').style.height = 'auto';
            let accordeonHeight = accordeon.querySelector('.accordeon-content').clientHeight;
            accordeon.querySelector('.accordeon-content').style.height = accordeonHeight + 'px';
        }
    };


    // scroll to the top of page
    this.arrowTop = function() {
        let arrowTop = document.querySelector('.arrow-top');
        if (arrowTop) {
            window.addEventListener('scroll', trackScroll);
            arrowTop.addEventListener('click', backToTop);

            function trackScroll() {
                let scrolled = window.pageYOffset;
                let pageHeight = document.documentElement.clientHeight;

                if (scrolled > pageHeight) {
                    arrowTop.classList.add('is-visible');
                } else {
                    arrowTop.classList.remove('is-visible');
                }
            }

            function backToTop() {
                if (window.pageYOffset > 0) {
                    window.scrollBy(0, -20);
                    setTimeout(backToTop, 0);
                }
            }
        }
    };

    // counter
    this.countersInit = function(counter) {
        let productBtns = counter.querySelectorAll('.counter__button'),
            productInput = counter.querySelector('.counter__val'),
            plusBtn = counter.querySelector('.counter__button[data-type="plus"]'),
            minusBtn = counter.querySelector('.counter__button[data-type="minus"]');
        if (productInput.value < 2) {
            minusBtn.disabled = true;
        } else if (productInput.value > 998) {
            plusBtn.disabled = true;
        }
        productInput.addEventListener('input', function() {
            if (productInput.value < 2) {
                minusBtn.disabled = true;
            } else if (productInput.value > 998) {
                plusBtn.disabled = true;
            } else {
                minusBtn.disabled = false;
                plusBtn.disabled = false;
            }
        });
        productBtns.forEach(function(button) {
            button.onclick = function(e) {
                e.preventDefault();
                let value = parseInt(productInput.value);
                if (this.getAttribute('data-type') === 'minus') {
                    if (plusBtn.disabled === true) {
                        plusBtn.disabled = false;
                    }
                    if (value > 1) {
                        if (value === 2) {
                            minusBtn.disabled = true;
                        }
                        value = value - 1;
                    } else {
                        value = 1;
                    }
                } else if (this.getAttribute('data-type') === 'plus') {
                    if (minusBtn.disabled === true) {
                        minusBtn.disabled = false;
                    }
                    if (value < 999) {
                        if (value === 998) {
                            plusBtn.disabled = true;
                        }
                        value = value + 1;
                    } else {
                        value = 999;
                    }
                }
                productInput.value = value;
            }
        });
    };

    // dropdowns
    this.dropdownInit = function(dropdown) {
        if (dropdown.classList.contains('is-open')) {
            dropdown.querySelector('.dropdown-content').style.height = 'auto';
        }
        dropdown.querySelector('.dropdown-headline').onclick = function() {
            if (!dropdown.classList.contains('is-open')) {
                let dropdownHeight = dropdown.querySelector('.dropdown-content').scrollHeight;
                dropdown.querySelector('.dropdown-content').style.height = dropdownHeight + 'px';
                dropdown.classList.add('is-open');
                setTimeout(function() {
                    dropdown.querySelector('.dropdown-content').style.height = 'auto';
                }, 200);
            } else {
                let dropdownHeight = dropdown.querySelector('.dropdown-content').offsetHeight;
                dropdown.querySelector('.dropdown-content').style.height = dropdownHeight + 'px';
                setTimeout(function() {
                    dropdown.querySelector('.dropdown-content').style.height = '0';
                }, 1);
                dropdown.classList.remove('is-open');
            }
        };
    };
    this.dropdownUpdate = function(dropdown) {
        if (dropdown.classList.contains('is-open')) {
            dropdown.querySelector('.dropdown-content').style.height = 'auto';
            let dropdownHeight = dropdown.querySelector('.dropdown-content').clientHeight;
            dropdown.querySelector('.dropdown-content').style.height = dropdownHeight + 'px';
        }
    };

    // --- form --- //

    // phone mask
    this.phoneMaskInit = function(el) {
        let mask = IMask(el, {
            mask: '+{7} (000) 000-00-00'
        });
    };

    // date mask
    this.dateMaskInit = function(el) {
        let mask = IMask(el, {
            mask: Date,
        });
    };

    // custom select
    this.customSelectInit = function(el) {
        let placeholder = el.getAttribute('data-placeholder');
        new SlimSelect({
            select: el,
            showSearch: false,
            placeholder: placeholder
        });
    };

    // field not empty
    this.fieldLabelInit = function(input) {
        if (input.value !== '') {
            input.classList.add('not-empty');
        } else {
            input.classList.remove('not-empty');
        }
        input.addEventListener('blur', function() {
            if (input.value !== '') {
                input.classList.add('not-empty');
            } else {
                input.classList.remove('not-empty');
            }
        });
    };

    // custom field file
    this.customFileFieldInit = function(fileField) {
        let fileFieldText = fileField.parentNode.querySelector('.file-field__text'),
            fileFieldId = fileField.getAttribute('id'),
            fileFieldMaxLength = fileField.getAttribute('data-maxlength'),
            fileFieldFileType = fileField.getAttribute('data-filetype'),
            fileFieldMaxFileSize = fileField.getAttribute('data-maxfilesize');

        myDropzone[fileFieldId] = new Dropzone("#" + fileFieldId, {
            url: '/file/post',
            maxFiles: parseInt(fileFieldMaxLength),
            maxFilesize: parseInt(fileFieldMaxFileSize),
            previewTemplate: '<div class="dz-preview dz-file-preview">\n' +
                '<div class="dz-filename"><span data-dz-name></span></div>\n' +
                '<div class="dz-remove"><span data-dz-remove>x</span></div>\n' +
                '</div>',
            init: function() {
                this.on('addedfile', function(file) {
                    if (this.files.length) {
                        for (let i = 0; i < this.files.length - 1; i++) {
                            if (this.files[i].name === file.name && this.files[i].size === file.size) {
                                this.removeFile(file);
                            }
                        }
                    }
                    fileFieldText.style.display = 'none';
                    let maxSymbol;
                    if (parseInt(fileFieldMaxLength) > 2) {
                        maxSymbol = 10;
                    } else {
                        maxSymbol = 20;
                    }
                    fileField.querySelectorAll('[data-dz-name]').forEach(function(el) {
                        let filename = el.innerHTML;
                        if (filename.length > maxSymbol) {
                            filename = filename.substring(0, maxSymbol) + '... ' + filename.slice(-4);
                            el.innerHTML = filename;
                        }
                    })
                });
                this.on('maxfilesreached', function(file) {
                    fileField.parentNode.classList.add('is-disabled')
                });
                this.on('maxfilesexceeded', function(file) {
                    this.removeFile(file);
                });
                this.on('removedfile', function() {
                    if (this.files.length === 0) {
                        fileFieldText.style.display = 'block'
                    }
                    if (this.files.length < fileFieldMaxLength) {
                        fileField.parentNode.classList.remove('is-disabled')
                    }
                });
            },
            renameFile: function(file) {
                file.name = new Date().getTime() + '_' + file.name;
            },
            acceptedFiles: fileFieldFileType,
        });
    };

    // form validation
    this.formValidationInit = function(formId) {
        new window.JustValidate(formId, {
            rules: {
                checkbox: {
                    required: true
                },
                file: {
                    required: true
                },
                date: {
                    required: true
                },
                radio: {
                    required: true
                },
                phone: {
                    required: true,
                    strength: {
                        custom: '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$'
                    }
                },
                city: {
                    required: true
                },
                myField: {
                    required: true,
                    strength: {
                        custom: '^123$'
                    }
                }
            },
            messages: {
                required: 'Обязательное поле',
                checkbox: {
                    required: 'Обязательное поле'
                },
                date: {
                    required: 'Обязательное поле'
                },
                file: {
                    required: 'Обязательное поле'
                },
                radio: {
                    required: 'Обязательное поле'
                },
                email: {
                    required: 'Обязательное поле',
                    email: 'Введен некорректный e-mail',
                },
                phone: {
                    required: 'Обязательное поле',
                    strength: 'Некорректный формат',
                },
                city: {
                    required: 'Обязательное поле'
                },
                myField: {
                    required: 'Обязательное поле',
                    strength: 'Введите 123',
                },
            },
            submitHandler: function(form, values, ajax) {
                ajax({
                    url: 'https://just-validate-api.herokuapp.com/submit',
                    method: 'POST',
                    data: values,
                    async: true,
                    callback: function(response) {
                        alert('AJAX submit successful! \nResponse from server:' + response)
                    },
                    error: function(response) {
                        alert('AJAX submit error! \nResponse from server:' + response)
                    }
                });
            }
        });
    }

    // ---- //

    // hamburger
    this.hamburgerInit = function(hamburger) {
        hamburger.onclick = function() {
            if (this.classList.contains('is-active')) {
                this.classList.remove('is-active');
            } else {
                this.classList.add('is-active');
            }
        }
    };

    // range slider
    this.rangeSliderInit = function(range) {
        let minVal = parseInt(range.getAttribute('data-min')),
            maxVal = parseInt(range.getAttribute('data-max')),
            startVal = parseInt(range.getAttribute('data-val').split(',')[0]),
            finalVal = parseInt(range.getAttribute('data-val').split(',')[1]),
            step = parseInt(range.getAttribute('data-step'));
        noUiSlider.create(range, {
            start: [startVal, finalVal],
            step: step,
            connect: true,
            range: {
                'min': minVal,
                'max': maxVal
            }
        });
        let inputFrom = range.parentElement.querySelector('.mod-from input'),
            inputTo = range.parentElement.querySelector('.mod-to input');
        range.noUiSlider.on('update', function(values, handle) {
            let value = values[handle];
            if (handle) {
                inputTo.value = parseInt(value);
                if (!inputFrom.value) {
                    inputFrom.value = parseInt(inputFrom.placeholder);
                }
            } else {
                inputFrom.value = parseInt(value);
                if (!inputTo.value) {
                    inputTo.value = parseInt(inputTo.placeholder);
                }
            }
        });
        inputFrom.addEventListener('change', function() {
            range.noUiSlider.set([this.value, null]);
        });
        inputTo.addEventListener('change', function() {
            range.noUiSlider.set([null, this.value]);
        });
    };

    // custom scrollbar
    this.customScrollbarInit = function(scrollbar) {
        new SimpleBar(scrollbar, {
            autoHide: false
        });
    };

    // tabs
    this.tabsInit = function(tab) {
        let tabHeadlineItems = tab.querySelectorAll('.tabs-headline__item'),
            tabContentItems = tab.querySelectorAll('.tabs-content__item'),
            tabIndex = Array.from(tabHeadlineItems).indexOf(tab.querySelector('.tabs-headline__item.is-active'));
        tabContentItems[tabIndex].style.display = 'block';
        tabHeadlineItems.forEach(function(el) {
            el.onclick = function() {
                tabHeadlineItems.forEach(function(headlineItem) {
                    headlineItem.classList.remove('is-active');
                });
                this.classList.add('is-active');
                let tabIndex = Array.from(tabHeadlineItems).indexOf(this);
                tabContentItems.forEach(function(contentItem) {
                    contentItem.style.display = 'none';
                });
                tabContentItems[tabIndex].style.display = 'block';
            }
        });
    };

    // tooltip
    this.customTooltipInit = function(tooltip) {
        tooltip.querySelector('.tooltip-trigger').onclick = function(e) {
            e.stopPropagation();
            document.querySelectorAll('.tooltip').forEach(function(el) {
                el.classList.remove('is-open');
            });
            tooltip.classList.add('is-open');
        };
        tooltip.querySelector('.tooltip-content__close').onclick = function(e) {
            e.stopPropagation();
            tooltip.classList.remove('is-open');
        }
    };

    // sticky block
    this.stickySidebarInit = function() {
        if (document.querySelector('.sticky-block')) {
            sidebar = new StickySidebar('#sidebar', {
                containerSelector: '#main-content',
                innerWrapperSelector: '.sticky-block',
                topSpacing: 20,
                bottomSpacing: 20
            });
        }
    };
    this.stickySidebarDestroy = function() {
        if (sidebar != undefined) {
            sidebar.destroy();
        }
    };
};

let app = new appObj();
app.init();
app.load();

// adding of custom alert
addEvent(document, 'click', '#alertTrigger', function() {
    app.showCustomAlert('Заголовок сообщения', 'Основной текст сообщения. Вопрос или предупреждение.', 'Ответ');
});

// form validation
let formId = '#form1',
    validatedForm = document.querySelector(formId);
if (validatedForm) {
    app.formValidationInit(formId);
}

// datepicker https://github.com/qodesmith/datepicker
let startLearningDate = datepicker('#learningStart', {
    startDay: 1,
    customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    customMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    overlayPlaceholder: 'Введите год',
    overlayButton: 'OK',
    formatter: function(input, date, instance) {
        input.value = date.toLocaleDateString("ru-RU")
    },
    id: 1
});
let endLearningDate = datepicker('#learningEnd', {
    startDay: 1,
    customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    customMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    overlayPlaceholder: 'Введите год',
    overlayButton: 'OK',
    formatter: function(input, date, instance) {
        input.value = date.toLocaleDateString("ru-RU")
    },
    id: 1
});
let birthdayDate = datepicker('#birthday', {
    startDay: 1,
    customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    customMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    overlayPlaceholder: 'Введите год',
    overlayButton: 'OK',
    formatter: function(input, date, instance) {
        input.value = date.toLocaleDateString("ru-RU")
    },
    id: 2
});