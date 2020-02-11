const stores = ['negociacoes'];
const version = 8;
const dbName = "aluraframe";

let connection = null;
let closeConnection = null;

export class ConnectionFactory {

    constructor() {
        throw new Error('Não é possível criar instâncias de connection factory');
    }
    
    static getConnection() {
        return new Promise((resolve, reject) => {
            let openRequest = window.indexedDB.open(dbName, version);

            openRequest.onupgradeneeded = e => {
                ConnectionFactory._createStores(e.target.result);
            };

            openRequest.onsuccess = e => {

                if(!connection) {
                    connection = e.target.result;
                    closeConnection = connection.close.bind(connection);
                    connection.close = function() {
                        throw new Error('Você não pode fechar diretamente a conexão');
                    }
                }
                
                resolve(connection);
            };

            openRequest.onerror = e => {
                reject(e.target.error.name);
            };
        });
    }

    static _createStores(connection) {

        stores.forEach(store => {

            if (connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store);
            connection.createObjectStore(store, {
                autoIncrement: true
            });
        });
    }

    static closeConnection() {
        if(connection) {
            closeConnection();
            connection = null;
        }
    }

}
