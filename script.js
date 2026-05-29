// Elementos do formulário
const botao = document.getElementById('botaoCalcular');
const form = document.getElementById('freteForm');

// Elementos de exibição de resultados
const resultadoVazio = document.getElementById('resultadoVazio');
const resultadoReal = document.getElementById('resultadoReal');
const resultadosPainel = document.getElementById('resultadosPainel');

// Elementos dos valores
const resCustoFrete = document.getElementById('resCustoFrete');
const resCustoDiesel = document.getElementById('resCustoDiesel');
const resValorMotorista = document.getElementById('resValorMotorista');
const resLucroEmpresa = document.getElementById('resLucroEmpresa');

// Elementos da barra de distribuição gráfica
const barDiesel = document.getElementById('barDiesel');
const barMotorista = document.getElementById('barMotorista');
const barEmpresa = document.getElementById('barEmpresa');

// Elementos das porcentagens da legenda
const pctDiesel = document.getElementById('pctDiesel');
const pctMotorista = document.getElementById('pctMotorista');
const pctEmpresa = document.getElementById('pctEmpresa');

// Evento de clique para calcular
botao.addEventListener('click', calcularValorFinal);

// Atalho: calcular também ao pressionar Enter dentro de qualquer input
form.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        calcularValorFinal();
    }
});

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function calcularValorFinal() {
    // Validação básica do formulário antes do cálculo
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const distancia = document.getElementById('distancia').value;
    const precoDiesel = document.getElementById('precoDiesel').value;
    const consumo = document.getElementById('consumo').value;
    
    // Convertendo as respostas em números reais
    const distanciaNum = parseFloat(distancia);
    const precoDieselNum = parseFloat(precoDiesel);
    const consumoNum = parseFloat(consumo);

    // Variaveis fixas do modelo de negócios
    const valorPorKm = 6.00;
    const percentualMotorista = 0.70;

    // 1. Cálculo do Custo do Frete cobrado do cliente
    const custoFrete = distanciaNum * valorPorKm;

    // 2. Cálculo do Custo do diesel gasto na viagem
    const custoDiesel = (distanciaNum / consumoNum) * precoDieselNum;

    // 3. Cálculo do Lucro Bruto
    const lucroBruto = custoFrete - custoDiesel;

    // 4. Cálculo do valor pago ao motorista (70% do lucro bruto)
    const valorMotorista = lucroBruto > 0 ? lucroBruto * percentualMotorista : 0;

    // 5. Cálculo do Lucro para a empresa (30% do lucro bruto)
    const lucroEmpresa = lucroBruto > 0 ? lucroBruto - valorMotorista : lucroBruto;

    // Exibir painel de resultados com animação
    resultadoVazio.classList.add('hidden');
    resultadoReal.classList.remove('hidden');

    // Preencher valores formatados com moeda brasileira (R$)
    resCustoFrete.textContent = formatarMoeda(custoFrete);
    resCustoDiesel.textContent = formatarMoeda(custoDiesel);
    resValorMotorista.textContent = formatarMoeda(valorMotorista);
    resLucroEmpresa.textContent = formatarMoeda(lucroEmpresa);

    // Ajustar cores ou estilos se houver prejuízo (diesel mais caro que o frete)
    const subCardEmpresa = document.querySelector('.card-empresa');
    if (lucroBruto < 0) {
        subCardEmpresa.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        subCardEmpresa.style.background = 'rgba(239, 68, 68, 0.05)';
        resLucroEmpresa.style.color = '#ef4444';
    } else {
        subCardEmpresa.style.borderColor = '';
        subCardEmpresa.style.background = '';
        resLucroEmpresa.style.color = '';
    }

    // Calcular porcentagens da distribuição em relação ao total pago pelo cliente
    let pctDieselVal = 0;
    let pctMotoristaVal = 0;
    let pctEmpresaVal = 0;

    if (custoFrete > 0) {
        if (lucroBruto > 0) {
            pctDieselVal = (custoDiesel / custoFrete) * 100;
            pctMotoristaVal = (valorMotorista / custoFrete) * 100;
            pctEmpresaVal = (lucroEmpresa / custoFrete) * 100;
        } else {
            // Se der prejuízo, o Diesel consumiu 100% ou mais da receita
            pctDieselVal = 100;
            pctMotoristaVal = 0;
            pctEmpresaVal = 0;
        }
    }

    // Atualizar textos de porcentagem na legenda
    pctDiesel.textContent = `${pctDieselVal.toFixed(1)}%`;
    pctMotorista.textContent = `${pctMotoristaVal.toFixed(1)}%`;
    pctEmpresa.textContent = `${pctEmpresaVal.toFixed(1)}%`;

    // Atualizar larguras das barras gráficas (com timeout para forçar animação suave de transição)
    setTimeout(() => {
        barDiesel.style.width = `${pctDieselVal}%`;
        barMotorista.style.width = `${pctMotoristaVal}%`;
        barEmpresa.style.width = `${pctEmpresaVal}%`;
    }, 50);

    // Rolar a página suavemente até o resultado em telas menores (mobile)
    if (window.innerWidth < 768) {
        resultadosPainel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}