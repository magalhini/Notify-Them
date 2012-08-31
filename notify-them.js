(function (exports, doc) {

    function Notifications(options) {
        this.placeholder = options ? options.placeholder : doc.body;
        this.duration = options ? options.duration : 5000;
        this.fadeDuration = options ? options.fadeDuration : 700;
    }

    Notifications.prototype = {
        constructor: Notifications,

        build: function (type) {
            var template = doc.createElement('div'),
                klass = type ? (type === 'error' || type === 'success' ? type : 'default') : 'default';

            template.setAttribute('class', 'notification');
            template.classList.add(type);
            return template;
        },

        show: function (msg, type) {
            if (this.element) {
                this.hide(false); // another one has popped, remove the current one instantly
            }

            this.element = this.build(type);
            this.element.innerHTML = msg;
            doc.body.appendChild(this.element);

            // Auto-hide after the desired duration
            this.notifyTimer = setTimeout(function () {
                this.hide(true);
            }.bind(this), this.duration);

            this.element.style.display = 'block';
            this.element.classList.add('open');
            this._addEvents();
        },

        hide: function (fade) {
            // Clear previous auto-hide timer
            if (this.notifyTimer) {
                clearTimeout(this.notifyTimer);
                this.notifyTimer = null;
            }

            // Clear previous fade in/out timer
            if (this.fadeTimer) {
                clearTimeout(this.fadeTimer);
                this.fadeTimer = null;
            }

            this.element.classList.remove('open');

            // Fade out or remove instantly
            if (fade) {
                this.element.classList.add('close');

                this.fadeTimer = setTimeout(function () {
                    doc.body.removeChild(this.element);
                    this.element = null;
                }.bind(this), this.fadeDuration);
            } else {
                doc.body.removeChild(this.element);
                this.element = null;
            }
        },

        // Click event to remove the element
        _addEvents: function () {
            this.element.addEventListener('click', function (e) {
                this.hide(true);
            }.bind(this));
        },

        // Fade in the element
        fadeIn: function (duration) {
            var interval = (duration / 100),
                opac = (100 / duration) * 1000;

            if (this.timer) {
                clearTimeout(this.timer);
            }

            this.element.style.display = 'block';

            this.fadeTimer = setTimeout(function () {
                var calc = this.element.style.opacity * 1000 + opac;
                this.element.style.opacity = (calc / 1000);

                if (this.element.style.opacity < 1) {
                    this.fadeIn(duration);
                }
            }.bind(this), interval);
        }
    };

    exports.notifications = function (options) {
        return new Notifications(options);
    };

}((typeof exports === 'object' && exports || this), document));

var x = notifications();
x.show('hello', 'success');
setTimeout(function(){x.show('second world', 'error');}, 5000);