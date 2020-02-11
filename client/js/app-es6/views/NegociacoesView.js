import { DateHelper } from '../helpers/DateHelper';
import { View } from './View';
import { currentInstance } from '../controllers/NegociacaoController';

export class NegociacoesView extends View {

    constructor(elemento) {
        super(elemento);

        elemento.addEventListener('click', function(event) {
            if(event.target.nodeName === "TH")
                currentInstance().ordena(event.target.textContent.toLowerCase());
        });
    }

    template(modelo) {

        return `
            <table class = "table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>QUANTIDADE</th>
                        <th>VALOR</th>
                        <th>VOLUME</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                        modelo.negociacoes.map(negociacao =>
                            `
                                <tr>
                                    <td>${DateHelper.dataParaTexto(negociacao.data)}</td>
                                    <td>${negociacao.quantidade}</td>
                                    <td>${negociacao.valor}</td>
                                    <td>${negociacao.volume}</td>
                                </tr>
                            `
                        ).join('')
                    }
                </tbody>
                <tfoot>
                    <td colspan="3"></td>
                    <td>
                        ${modelo.negociacoes.reduce((total, negociacao) => total + negociacao.volume, 0.0)}
                    </td>
                </tfoot>
            </table>
        `;
    }
}