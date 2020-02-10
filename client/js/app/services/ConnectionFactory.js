const ConnectionFactory = (function() {

    const stores = ['negociacoes'];
    const version = 5;
    const dbName = "aluraframe";
    
    let connection = null;
    let closeConnection = null;

    return class ConnectionFactory {

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

        static _createStores(conn) {
            stores.forEach(store => {
                console.log(store, conn);
                if (conn.contains(dbName))
                    conn.deleteObjectStore(dbName);

                conn.createObjectStore(dbName, {
                    keyPath: `_${Math.random().toString(36).substr(2, 9)}`,
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
})();