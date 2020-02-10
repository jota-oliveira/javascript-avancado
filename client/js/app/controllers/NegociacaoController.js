class NegociacaoController {
    
    constructor() {
        let $ = document.querySelector.bind(document);
        this._ordemAtual = '';
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia', 'ordena', 'inverte'
        );
  
        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto',
        );

        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .then(negociacoes => negociacoes.forEach(
                negociacao => this._listaNegociacoes.adiciona(negociacao)))
            .catch(error => this._mensagem.texto = error);
    }

    adiciona(event) {
        event.preventDefault();

        ConnectionFactory
            .getConnection()
            .then(connection => {
                const negociacao = this._criaNegociacao();

                new NegociacaoDao(connection)
                    .adiciona(negociacao)
                    .then(() => {
                        this._listaNegociacoes.adiciona(negociacao);
                        this._mensagem.texto = "Negociação cadastrada com sucesso";
                        this._limpaFormulario();
                    })
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }

    _limpaFormulario() {
        this._inputData.value = "";
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;

        this._inputData.focus();
    }

    apaga() {
        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._listaNegociacoes.esvazia();
                this._mensagem.texto = "Lista de negociações apagadas com sucesso";
            })
            .catch = error => this._mensagem.texto = error;
    }

    importaNegociacoes() {
        let service = new NegociacaoService();

        service.obterNegociacoes()
            .then(negociacoes => 
                negociacoes.filter(negociacao => 
                    !this._listaNegociacoes.negociacoes.some(negociacaoExistente =>
                        JSON.stringify(negociacaoExistente) === JSON.stringify(negociacao))
                )
            )
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = "Negociações do período importadas"
            }))
            .catch(error => this._mensagem.texto = error);
    }

    ordena(coluna) {
        if (this._ordemAtual === coluna) {
            this._listaNegociacoes.inverteOrdem();
        }

        this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        this._ordemAtual = coluna;
    }

    /* Estados de requisição da biblioteca XMLHttpRequest 
        0 - Requisição não iniciada
        1 - Conexão com o servidor estabelecida
        2 - Requisição recebida
        3 - Processando requisição
        4 - Requisição concluída
    */
}