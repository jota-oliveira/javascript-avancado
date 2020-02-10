'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = function () {
    function View(elemento) {
        _classCallCheck(this, View);

        this._elemento = elemento;
    }

    _createClass(View, [{
        key: 'template',
        value: function template() {
            throw new Error('O método template precisa ser implementado em todas as classes que extendem de view');
        }
    }, {
        key: 'update',
        value: function update(modelo) {
            this._elemento.innerHTML = this.template(modelo);
        }
    }]);

    return View;
}();
//# sourceMappingURL=View.js.map