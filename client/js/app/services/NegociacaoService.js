'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacaoService = function () {
    function NegociacaoService() {
        _classCallCheck(this, NegociacaoService);

        this._http = new HttpService();
    }

    _createClass(NegociacaoService, [{
        key: 'obterNegociacoesDaSemana',
        value: function obterNegociacoesDaSemana() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this._http.get('negociacoes/semana').then(function (negociacoes) {
                    resolve(negociacoes.map(function (objeto) {
                        return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                    }));
                }).catch(function (error) {
                    console.error(error);
                    reject('Não foi possível obter as negociações da semana');
                });
            });
        }
    }, {
        key: 'obterNegociacoesDaSemanaAnterior',
        value: function obterNegociacoesDaSemanaAnterior() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2._http.get('negociacoes/anterior').then(function (negociacoes) {
                    resolve(negociacoes.map(function (objeto) {
                        return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                    }));
                }).catch(function (error) {
                    console.error(error);
                    reject('Não foi possível obter as negociações da semana anterior');
                });
            });
        }
    }, {
        key: 'obterNegociacoesDaSemanaRetrasada',
        value: function obterNegociacoesDaSemanaRetrasada() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3._http.get('negociacoes/retrasada').then(function (negociacoes) {
                    resolve(negociacoes.map(function (objeto) {
                        return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                    }));
                }).catch(function (error) {
                    console.error(error);
                    reject('Não foi possível obter as negociações da semana retrasada');
                });
            });
        }
    }, {
        key: 'obterNegociacoes',
        value: function obterNegociacoes() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                Promise.all([_this4.obterNegociacoesDaSemana(), _this4.obterNegociacoesDaSemanaAnterior(), _this4.obterNegociacoesDaSemanaRetrasada()]).then(function (negociacoes) {
                    resolve(negociacoes.reduce(function (arrayAchatado, array) {
                        return arrayAchatado.concat(array);
                    }, []));
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    }, {
        key: 'cadastrar',
        value: function cadastrar(negociacao) {
            return ConnectionFactory.getConnection().then(function (connection) {
                return new NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.adiciona(negociacao);
            }).then(function () {
                return 'Negociação cadastrada com sucesso!';
            }).catch(function (error) {
                throw new Error(error);
            });
        }
    }, {
        key: 'lista',
        value: function lista() {
            return ConnectionFactory.getConnection().then(function (connection) {
                return new NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.listaTodos();
            }).catch(function (error) {
                throw new Error('Não foi possível listar as negociações');
            });
        }
    }, {
        key: 'apaga',
        value: function apaga() {
            return ConnectionFactory.getConnection().then(function (connection) {
                return new NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.apagaTodos();
            }).then(function () {
                return 'Negociações apagadas com sucesso!';
            }).catch(function (error) {
                throw new Error(error);
            });
        }
    }, {
        key: 'importa',
        value: function importa(listaAtual) {
            return this.obterNegociacoes().then(function (negociacoes) {
                return negociacoes.filter(function (negociacao) {
                    return !listaAtual.some(function (negociacaoExistente) {
                        return JSON.stringify(negociacaoExistente) === JSON.stringify(negociacao);
                    });
                });
            }).catch(function (error) {
                throw new Error('Não foi possível importar negociações');
            });
        }
    }]);

    return NegociacaoService;
}();
//# sourceMappingURL=NegociacaoService.js.map