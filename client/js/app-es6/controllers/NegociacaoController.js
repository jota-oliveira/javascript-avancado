import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {Mensagem} from '../models/Mensagem';
import {NegociacoesView} from '../views/NegociacoesView';
import {MensagemView} from '../views/MensagemView';
import {NegociacaoService} from '../services/NegociacaoService';
import {DateHelper} from '../helpers/DateHelper';
import {Bind} from '../helpers/Bind';
import {Negociacao} from '../models/Negociacao';

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
        
        this._service = new NegociacaoService();

        this._init();
    }

    _init() {
        this._service
            .lista()
            .then(negociacoes => 
                negociacoes.forEach(negociacao =>
                    this._listaNegociacoes.adiciona(negociacao)))
            .catch(error => this._mensagem.texto = error);

        setInterval(() => {
            this.importaNegociacoes();
        }, 5000);
    }

    adiciona(event) {
        event.preventDefault();

        const negociacao = this._criaNegociacao();

        this._service
            .cadastrar(negociacao)
            .then((mensagem) => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = mensagem;
                this._limpaFormulario();
            })
            .catch(error => this._mensagem.texto = erro);
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
        new NegociacaoService()
            .apaga()
            .then(mensagem => {
                this._listaNegociacoes.esvazia();
                this._mensagem.texto = mensagem;
            })
            .catch = error => this._mensagem.texto = error;    
    }

    importaNegociacoes() {
        this._service
            .importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._service
                    .cadastrar(negociacao)
                    .then(() => {
                        this._listaNegociacoes.adiciona(negociacao)
                        this._mensagem.texto = "Negociações do período importadas"
                    })
                    .catch(error => this._mensagem.texto = error);
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

let negociacaoController = new NegociacaoController();

export function currentInstance() {
    return negociacaoController;
}