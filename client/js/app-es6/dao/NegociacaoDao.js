import {Negociacao} from '../models/Negociacao';

export class NegociacaoDao {

    constructor(connection) {
        this._connection = connection;
        this._store = 'negociacoes';
    }

    listaTodos() {
        return new Promise((resolve, reject) => {
            let cursor = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .openCursor();
            
            const negociacoes = [];

            cursor.onsuccess = e => {
                let atual = e.target.result;

                if(!atual) {
                    resolve(negociacoes);
                    return;
                }

                let dado = atual.value;
                negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                atual.continue();
            };

            cursor.onerror = (e) => {
                console.error(e.target.error);
                reject('Não foi possível listar as negociações');
            };
        });
    }

    adiciona(negociacao) {
        return new Promise((resolve, reject) => {
            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .add(negociacao);

            request
                .onsuccess = e => (resolve());
            
            request
                .onerror = e => (reject(e.target.error.name));
        });
    }

    apagaTodos() {
        return new Promise((resolve, reject) => {
            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .clear();
            
            request.onsuccess = e => resolve('Negociações removidas com sucesso');

            request.onerror = e => reject('Houve um problema ao remover negociações');
        });
    }
}