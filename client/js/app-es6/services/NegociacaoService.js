import { HttpService } from './HttpService';
import { ConnectionFactory } from './ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {Negociacao} from '../models/Negociacao';

export class NegociacaoService {

    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoesDaSemana() {
        return new Promise((resolve, reject) => {
            this._http
                .get('negociacoes/semana')
                .then(negociacoes => {
                    resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                })
                .catch(error => {
                    console.error(error);
                    reject('Não foi possível obter as negociações da semana');
                })
        });
    }

    obterNegociacoesDaSemanaAnterior() {
        return new Promise((resolve, reject) => {
            this._http
                .get('negociacoes/anterior')
                .then(negociacoes => {
                    resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                })
                .catch(error => {
                    console.error(error);
                    reject('Não foi possível obter as negociações da semana anterior');
                })
        });
    }

    obterNegociacoesDaSemanaRetrasada() {
         return new Promise((resolve, reject) => {
             this._http
                 .get('negociacoes/retrasada')
                 .then(negociacoes => {
                     resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
                 })
                 .catch(error => {
                     console.error(error);
                     reject('Não foi possível obter as negociações da semana retrasada');
                 })
         });
    }

    obterNegociacoes() {
        return new Promise((resolve, reject) => {
           Promise.all([
                this.obterNegociacoesDaSemana(),
                this.obterNegociacoesDaSemanaAnterior(),
                this.obterNegociacoesDaSemanaRetrasada()
            ])
            .then(negociacoes => {
                resolve(negociacoes
                    .reduce((arrayAchatado, array) => arrayAchatado.concat(array), []));
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    cadastrar(negociacao) {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação cadastrada com sucesso!')
            .catch(error => { throw new Error(error) });
    }

    lista() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(error => {
                throw new Error('Não foi possível listar as negociações');
            })
    }

    apaga() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagadas com sucesso!')
            .catch(error => {
                throw new Error(error);
            })
    }

    importa(listaAtual) {
        return this.obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(negociacao =>
                    !listaAtual.some(negociacaoExistente =>
                        JSON.stringify(negociacaoExistente) === JSON.stringify(negociacao))
                )
            )
            .catch(error => {
                throw new Error('Não foi possível importar negociações');
            })
    }
}