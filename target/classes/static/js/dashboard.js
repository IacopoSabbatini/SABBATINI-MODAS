// JavaScript específico para o dashboard

// Variáveis globais do dashboard
let salesChart = null;
let dashboardData = {
    stats: {
        dailySales: 12450.00,
        productsSold: 89,
        activeClients: 156,
        lowStock: 12
    },
    salesData: [
        { day: 'Seg', sales: 1200 },
        { day: 'Ter', sales: 1800 },
        { day: 'Qua', sales: 1500 },
        { day: 'Qui', sales: 2200 },
        { day: 'Sex', sales: 2800 },
        { day: 'Sáb', sales: 3200 },
        { day: 'Dom', sales: 1900 }
    ],
    topProducts: [
        { name: 'Vestido Elegante Verde', sales: 23, price: 189.90, image: 'images/produtos/produto1.jpg' },
        { name: 'Conjunto Alfaiataria', sales: 18, price: 299.90, image: 'images/produtos/produto2.jpg' },
        { name: 'Conjunto Casual Elegante', sales: 15, price: 159.90, image: 'images/produtos/produto3.jpg' },
        { name: 'Camiseta Premium Branca', sales: 12, price: 79.90, image: 'images/produtos/produto4.jpg' }
    ],
    recentActivity: [
        { type: 'sale', message: 'Nova venda realizada', time: '5 minutos', icon: 'fas fa-shopping-cart', color: 'success' },
        { type: 'product', message: 'Produto adicionado', time: '15 minutos', icon: 'fas fa-plus', color: 'info' },
        { type: 'stock', message: 'Estoque baixo detectado', time: '1 hora', icon: 'fas fa-exclamation-triangle', color: 'warning' },
        { type: 'client', message: 'Novo cliente cadastrado', time: '2 horas', icon: 'fas fa-user-plus', color: 'primary' }
    ],
    cashStatus: {
        initialBalance: 500.00,
        income: 2450.00,
        expenses: 150.00,
        currentBalance: 2800.00
    }
};

// Inicialização do dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// Função principal de inicialização do dashboard
function initializeDashboard() {
    initializeStatsCards();
    initializeSalesChart();
    initializeTopProducts();
    initializeRecentActivity();
    initializeCashStatus();
    initializeDashboardActions();
    startRealTimeUpdates();
}

// Inicializar cards de estatísticas
function initializeStatsCards() {
    updateStatsCards();
    
    // Adicionar animação de contagem
    const statValues = document.querySelectorAll('.stat-content h3');
    statValues.forEach(element => {
        animateCounter(element);
    });
}

// Atualizar cards de estatísticas
function updateStatsCards() {
    const stats = dashboardData.stats;
    
    // Atualizar valores
    const statElements = document.querySelectorAll('.stat-card');
    if (statElements.length >= 4) {
        statElements[0].querySelector('h3').textContent = AppUtils.formatCurrency(stats.dailySales);
        statElements[1].querySelector('h3').textContent = stats.productsSold;
        statElements[2].querySelector('h3').textContent = stats.activeClients;
        statElements[3].querySelector('h3').textContent = stats.lowStock;
    }
}

// Animação de contador
function animateCounter(element) {
    const target = parseFloat(element.textContent.replace(/[^\d.-]/g, ''));
    const increment = target / 50;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.textContent.includes('R$')) {
            element.textContent = AppUtils.formatCurrency(current);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Inicializar gráfico de vendas
function initializeSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Configuração do gráfico
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dashboardData.salesData.map(item => item.day),
            datasets: [{
                label: 'Vendas (R$)',
                data: dashboardData.salesData.map(item => item.sales),
                borderColor: '#4a6da7',
                backgroundColor: 'rgba(74, 109, 167, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f27059',
                pointBorderColor: '#f27059',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#4a6da7',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Vendas: ' + AppUtils.formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return AppUtils.formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Inicializar produtos mais vendidos
function initializeTopProducts() {
    const container = document.querySelector('.product-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    dashboardData.topProducts.forEach((product, index) => {
        const productElement = createProductElement(product, index);
        container.appendChild(productElement);
    });
}

// Criar elemento de produto
function createProductElement(product, index) {
    const element = document.createElement('div');
    element.className = 'product-item';
    element.style.animationDelay = `${index * 0.1}s`;
    
    element.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h4>${product.name}</h4>
            <p>${product.sales} vendas</p>
        </div>
        <div class="product-price">
            <span>${AppUtils.formatCurrency(product.price)}</span>
        </div>
    `;
    
    // Adicionar evento de clique
    element.addEventListener('click', () => {
        AppUtils.showToast(`Visualizando produto: ${product.name}`, 'info');
    });
    
    return element;
}

// Inicializar atividade recente
function initializeRecentActivity() {
    const container = document.querySelector('.activity-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    dashboardData.recentActivity.forEach((activity, index) => {
        const activityElement = createActivityElement(activity, index);
        container.appendChild(activityElement);
    });
}

// Criar elemento de atividade
function createActivityElement(activity, index) {
    const element = document.createElement('div');
    element.className = 'activity-item';
    element.style.animationDelay = `${index * 0.1}s`;
    
    element.innerHTML = `
        <div class="activity-icon bg-${activity.color}">
            <i class="${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <p><strong>${activity.message}</strong></p>
            <span class="activity-time">há ${activity.time}</span>
        </div>
    `;
    
    return element;
}

// Inicializar status do caixa
function initializeCashStatus() {
    const cashStatus = dashboardData.cashStatus;
    
    // Atualizar valores
    const cashItems = document.querySelectorAll('.cash-item');
    if (cashItems.length >= 4) {
        cashItems[0].querySelector('.cash-value').textContent = AppUtils.formatCurrency(cashStatus.initialBalance);
        cashItems[1].querySelector('.cash-value').textContent = AppUtils.formatCurrency(cashStatus.income);
        cashItems[2].querySelector('.cash-value').textContent = AppUtils.formatCurrency(cashStatus.expenses);
        cashItems[3].querySelector('.cash-value').textContent = AppUtils.formatCurrency(cashStatus.currentBalance);
    }
    
    // Adicionar eventos aos botões
    const entryBtn = document.querySelector('.cash-actions .btn-success');
    const exitBtn = document.querySelector('.cash-actions .btn-danger');
    
    if (entryBtn) {
        entryBtn.addEventListener('click', () => handleCashEntry());
    }
    
    if (exitBtn) {
        exitBtn.addEventListener('click', () => handleCashExit());
    }
}

// Lidar com entrada de caixa
function handleCashEntry() {
    const amount = prompt('Digite o valor da entrada:');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        dashboardData.cashStatus.income += parseFloat(amount);
        dashboardData.cashStatus.currentBalance += parseFloat(amount);
        updateCashDisplay();
        AppUtils.showToast(`Entrada de ${AppUtils.formatCurrency(parseFloat(amount))} registrada`, 'success');
    }
}

// Lidar com saída de caixa
function handleCashExit() {
    const amount = prompt('Digite o valor da saída:');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        if (parseFloat(amount) <= dashboardData.cashStatus.currentBalance) {
            dashboardData.cashStatus.expenses += parseFloat(amount);
            dashboardData.cashStatus.currentBalance -= parseFloat(amount);
            updateCashDisplay();
            AppUtils.showToast(`Saída de ${AppUtils.formatCurrency(parseFloat(amount))} registrada`, 'success');
        } else {
            AppUtils.showToast('Saldo insuficiente', 'error');
        }
    }
}

// Atualizar display do caixa
function updateCashDisplay() {
    const cashStatus = dashboardData.cashStatus;
    const cashItems = document.querySelectorAll('.cash-item');
    
    if (cashItems.length >= 4) {
        cashItems[1].querySelector('.cash-value').textContent = AppUtils.formatCurrency(cashStatus.income);
        cashItems[2].querySelector('.cash-value').textContent = AppUtils.formatCurrency(cashStatus.expenses);
        cashItems[3].querySelector('.cash-value').textContent = AppUtils.formatCurrency(cashStatus.currentBalance);
    }
}

// Inicializar ações do dashboard
function initializeDashboardActions() {
    // Botão de exportar
    const exportBtn = document.querySelector('.card-actions .btn-outline-primary');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            AppUtils.showToast('Exportando relatório...', 'info');
            // Simular exportação
            setTimeout(() => {
                AppUtils.showToast('Relatório exportado com sucesso!', 'success');
            }, 2000);
        });
    }
    
    // Botão de refresh
    const refreshBtn = document.querySelector('.card-header .btn-outline-primary i.fa-refresh');
    if (refreshBtn) {
        refreshBtn.parentElement.addEventListener('click', () => {
            refreshDashboardData();
        });
    }
}

// Atualizar dados do dashboard
function refreshDashboardData() {
    AppUtils.showToast('Atualizando dados...', 'info');
    
    // Simular carregamento
    setTimeout(() => {
        // Simular novos dados
        dashboardData.stats.dailySales += Math.random() * 1000;
        dashboardData.stats.productsSold += Math.floor(Math.random() * 10);
        dashboardData.stats.activeClients += Math.floor(Math.random() * 5);
        
        // Atualizar interface
        updateStatsCards();
        
        // Adicionar nova atividade
        const newActivity = {
            type: 'update',
            message: 'Dados atualizados',
            time: '0 minutos',
            icon: 'fas fa-sync',
            color: 'info'
        };
        
        dashboardData.recentActivity.unshift(newActivity);
        dashboardData.recentActivity = dashboardData.recentActivity.slice(0, 4);
        
        initializeRecentActivity();
        
        AppUtils.showToast('Dados atualizados com sucesso!', 'success');
    }, 1500);
}

// Iniciar atualizações em tempo real
function startRealTimeUpdates() {
    // Atualizar a cada 30 segundos
    setInterval(() => {
        updateRealTimeData();
    }, 30000);
}

// Atualizar dados em tempo real
function updateRealTimeData() {
    // Simular pequenas mudanças nos dados
    const randomChange = Math.random() * 100;
    dashboardData.stats.dailySales += randomChange;
    
    // Atualizar apenas o card de vendas
    const salesCard = document.querySelector('.stat-card:first-child h3');
    if (salesCard) {
        salesCard.textContent = AppUtils.formatCurrency(dashboardData.stats.dailySales);
    }
    
    // Atualizar gráfico com novos dados
    if (salesChart) {
        const lastValue = dashboardData.salesData[dashboardData.salesData.length - 1].sales;
        const newValue = lastValue + (Math.random() * 200 - 100);
        
        dashboardData.salesData.push({
            day: 'Hoje',
            sales: Math.max(0, newValue)
        });
        
        // Manter apenas os últimos 7 dias
        if (dashboardData.salesData.length > 7) {
            dashboardData.salesData.shift();
        }
        
        salesChart.data.labels = dashboardData.salesData.map(item => item.day);
        salesChart.data.datasets[0].data = dashboardData.salesData.map(item => item.sales);
        salesChart.update('none');
    }
}

// Função para simular notificações push
function simulateNotifications() {
    const notifications = [
        { message: 'Nova venda de R$ 189,90', type: 'success' },
        { message: 'Estoque do produto XYZ está baixo', type: 'warning' },
        { message: 'Novo cliente cadastrado', type: 'info' },
        { message: 'Meta diária atingida!', type: 'success' }
    ];
    
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% de chance
            const notification = notifications[Math.floor(Math.random() * notifications.length)];
            AppUtils.showToast(notification.message, notification.type);
            
            // Atualizar badge de notificação
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                const current = parseInt(badge.textContent) || 0;
                badge.textContent = current + 1;
            }
        }
    }, 60000); // A cada minuto
}

// Iniciar simulação de notificações
setTimeout(simulateNotifications, 5000);

// Exportar funções para uso global
window.Dashboard = {
    refreshDashboardData,
    updateStatsCards,
    handleCashEntry,
    handleCashExit
};

