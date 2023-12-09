class ClientManager {
    constructor() {
        this.clients = [];
    }

    addClient(client) {
        this.clients.push(client);
    }

    removeClient(client) {
        const index = this.clients.indexOf(client);
        if (index !== -1) {
            this.clients.splice(index, 1);
        }
    }

    getClient(index) {
        return this.clients[index];
    }

    getAllClients() {
        return this.clients;
    }

}

module.exports = ClientManager;