class NegociacaoService {
    obterNegociacoesDaSemana(cb) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'negociacoes/semana');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    return cb('As negociações não puderam ser importadas', null);
                }

                return cb(null, JSON.parse(xhr.responseText)
                    .map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
            }
        };

        xhr.send();
    }
}