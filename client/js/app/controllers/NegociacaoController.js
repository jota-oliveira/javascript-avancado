class NegociacaoController {
    
    constructor() {
        let $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona',
            'esvazia'
        );
  
        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto',
        );
    }

    adiciona(event) {
        event.preventDefault();

        this._listaNegociacoes.adiciona(this._criaNegociacao());
        this._mensagem.texto = "Negociação cadastrada com sucesso";
        this._limpaFormulario();
    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value
        );
    }

    _limpaFormulario() {
        this._inputData.value = "";
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;

        this._inputData.focus();
    }

    apaga() {
        this._listaNegociacoes.esvazia();
        this._mensagem.texto = "Lista de negociações apagadas com sucesso";
    }

    importaNegociacoes() {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'negociacoes/semana');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
                if(xhr.status !== 200) {
                    this._mensagem.texto = 'Não foi possível obter as negociações do servidor';
                    return;
                }

                JSON.parse(xhr.responseText)
                    .map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
                    .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                
                this._mensagem.texto = 'Negociações importadas com sucesso';
            }
        };

        xhr.send();
    }

    /* Estados de requisição da biblioteca XMLHttpRequest 
        0 - Requisição não iniciada
        1 - Conexão com o servidor estabelecida
        2 - Requisição recebida
        3 - Processando requisição
        4 - Requisição concluída
    */
}