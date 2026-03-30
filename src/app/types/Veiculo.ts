type Veiculo = {
    ano: number,
    cadManPeriodica: boolean,
    cilindrada: number,
    placa: string,
    gastoManutencao: number | null,
    kmAtual: number,
    manFreioDianteiro: number | null,
    manFreioTraseiro: number | null,
    marca: string,
    modelo: string,
    proxRevKm: number | null,
    proxTrocaOleoKm: number | null,
    revisaoKm: number | null,
    revisaoMes: number | null,
    tipoVeiculo: 'carro' | 'moto',
    trocaOleoKm: number | null,
    trocaOleoMeses: number | null,
    ultimaRevisaoKm: number | null,
    ultimaTrocaOleoKm: number | null,
    ultimoComb: 'Gasolina' | 'Etanol' | 'Diesel' | undefined,
    ultimoKm: number | null
}

export default Veiculo