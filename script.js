const botao = document.getElementById('botaoCalcular')
const resultado = document.getElementById('resultado')
 botao.addEventListener('click', calcularValorFinal)
function calcularValorFinal() {
  
    const distancia = document.getElementById('distancia').value;
    const precoDiesel = document.getElementById('precoDiesel').value;
    const consumo = document.getElementById('consumo').value;
    
    
    //Convertendo as respsotaasssssasas em numerosssss
    const distanciaNum = parseFloat(distancia);
    const precoDieselNum = parseFloat(precoDiesel);
    const consumoNum = parseFloat(consumo);

    //Variaveis fixas
    const valorPorKm = 6.00;
    const percentualMotorista = 0.70;

    // Calculo do Custo do Frete para o cliente
    const custoFrete = distanciaNum * valorPorKm;

    // Calculo do Custo do diesel
    const custoDiesel = (distanciaNum / consumoNum) * precoDieselNum;

    // Calculo do Lucro Bruto
    const lucroBruto = custoFrete - custoDiesel;

    // Calculo do valor a ser pago ao motorista
    const valorMotorista = lucroBruto * percentualMotorista;

    // Calculo do Lucro Para empresa
    const lucroEmpresa = lucroBruto - valorMotorista;

    //log de resultados
    resultado.innerHTML = `
    Resultados dos Calculos
    Calculo do Frete Para o Cliente: R$ ${custoFrete}
    Custo Do Diesel: R$ ${custoDiesel}
    Valor a ser pago ao Motorista: R$ ${valorMotorista}
    Lucro da Empresa: R$ ${lucroEmpresa}`
    
    

}