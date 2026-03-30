type Manutencao = {
    dataCadastro: string,
    descricaoManutencao: string
    kmManutencao: number,
    ladoManutencao: string,
    tipoManutencao: string,
    tipoManutecaoVal: 'REVISAO' | 'TROLEO' | 'PNEUS' | 'MANMOTOR' | 'MANFREIO' | 'LATARIA',
    valorManutencao: number,
    veiculo: string,
    veiculoId: string
}