type Abastecimento = {
    combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | undefined,
    data: string,
    idVeiculo: string,
    kmAntigo: number,
    kmAtual: number,
    media: number,
    observacao: string,
    placa: string,
    qdtAbastecida: number,
    seAditivado: boolean,
    seTanqueCheio: boolean,
    valorLitro: number
}

export default Abastecimento