class View {

    constructor(elemento) {
        this._elemento = elemento;
    }

    template() {
        throw new Error('O método template precisa ser implementado em todas as classes que extendem de view');
    }

    update(modelo) {
        this._elemento.innerHTML = this.template(modelo);
    }
}