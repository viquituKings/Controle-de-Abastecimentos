type Abastecimento = {
    combustivel: 'Gasolina' | 'Etanol' | 'Diesel',
    data: string,
    kmAntigo: number,
    kmAtual: number,
    media: number,
    placa: string,
    qdtAbastecida: number,
    seAditivado: boolean,
    seTanqueCheio: boolean,
    valorLitro: number
}

export default Abastecimento