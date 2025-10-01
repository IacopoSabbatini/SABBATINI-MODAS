// JavaScript específico para a página de relatórios

// Variáveis globais
let charts = {};
let reportHistory = [];
let currentFilters = {
    period: 'month',
    startDate: '',
    endDate: ''
};

// Dados simulados para os gráficos
const mockData = {
    sales: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500]
    },
    products: {
        labels: ['Vestidos', 'Camisetas', 'Conjuntos', 'Acessórios', 'Calças'],
        data: [35, 25, 20, 12, 8]
    },
    revenue: {
        labels: ['Vestidos', 'Conjuntos', 'Camisetas', 'Acessórios'],
        data: [15000, 12000, 8000, 5000]
    },
    payment: {
        labels: ['PIX', 'Cartão', 'Dinheiro'],
        data: [45, 35, 20]
    }
};

// Inicialização da página de relatórios
document.addEventListener('DOMContentLoaded', function() {
    initializeReportsPage();
});

// Função principal de inicialização
function initializeReportsPage() {
    initializeFilters();
    initializeQuickReports();
    initializeModal();
    initializeCharts();
    loadReportHistory();
    setDefaultDates();
}

// Definir datas padrão
function setDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) {
        startDateInput.value = firstDay.toISOString().split('T')[0];
    }
    
    if (endDateInput) {
        endDateInput.value = today.toISOString().split('T')[0];
    }
}

// Inicializar filtros
function initializeFilters() {
    const periodFilter = document.getElementById('periodFilter');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (periodFilter) {
        periodFilter.addEventListener('change', function() {
            currentFilters.period = this.value;
            updateDateInputs();
            applyFilters();
        });
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (startDateInput) {
        startDateInput.addEventListener('change', function() {
            currentFilters.startDate = this.value;
        });
    }
    
    if (endDateInput) {
        endDateInput.addEventListener('change', function() {
            currentFilters.endDate = this.value;
        });
    }
}

// Atualizar campos de data baseado no período selecionado
function updateDateInputs() {
    const period = currentFilters.period;
    const today = new Date();
    let startDate, endDate;
    
    switch (period) {
        case 'today':
            startDate = endDate = today;
            break;
        case 'week':
            startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
            endDate = today;
            break;
        case 'month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
            break;
        case 'quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            startDate = new Date(today.getFullYear(), quarter * 3, 1);
            endDate = today;
            break;
        case 'year':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = today;
            break;
        default:
            return; // Para 'custom', não alterar as datas
    }
    
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) {
        startDateInput.value = startDate.toISOString().split('T')[0];
        currentFilters.startDate = startDateInput.value;
    }
    
    if (endDateInput) {
        endDateInput.value = endDate.toISOString().split('T')[0];
        currentFilters.endDate = endDateInput.value;
    }
}

// Aplicar filtros
function applyFilters() {
    // Atualizar gráficos com novos dados
    updateCharts();
    AppUtils.showToast('Filtros aplicados aos relatórios', 'success');
}

// Inicializar relatórios rápidos
function initializeQuickReports() {
    const reportCards = document.querySelectorAll('.report-card');
    
    reportCards.forEach(card => {
        const generateBtn = card.querySelector('.btn');
        const reportType = card.dataset.report;
        
        if (generateBtn) {
            generateBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                generateQuickReport(reportType);
            });
        }
        
        card.addEventListener('click', function() {
            openGenerateReportModal(reportType);
        });
    });
}

// Gerar relatório rápido
function generateQuickReport(reportType) {
    const reportNames = {
        'sales': 'Relatório de Vendas',
        'products': 'Relatório de Produtos',
        'financial': 'Relatório Financeiro',
        'customers': 'Relatório de Clientes'
    };
    
    const reportName = reportNames[reportType] || 'Relatório';
    
    AppUtils.showToast(`Gerando ${reportName}...`, 'info');
    
    // Simular geração do relatório
    setTimeout(() => {
        const newReport = {
            id: reportHistory.length + 1,
            name: reportName,
            type: reportType,
            period: `${currentFilters.startDate} - ${currentFilters.endDate}`,
            generatedAt: new Date().toLocaleString('pt-BR'),
            size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
            status: 'success'
        };
        
        reportHistory.unshift(newReport);
        updateReportHistoryTable();
        AppUtils.showToast(`${reportName} gerado com sucesso!`, 'success');
    }, 2000);
}

// Inicializar modal
function initializeModal() {
    const modal = document.getElementById('generateReportModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const generateBtn = document.getElementById('generateBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');
    
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => openGenerateReportModal());
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeGenerateReportModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeGenerateReportModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeGenerateReportModal();
            }
        });
    }
    
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerateReport);
    }
    
    // Definir datas padrão no modal
    setModalDefaultDates();
}

// Definir datas padrão no modal
function setModalDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const reportStartDate = document.getElementById('reportStartDate');
    const reportEndDate = document.getElementById('reportEndDate');
    
    if (reportStartDate) {
        reportStartDate.value = firstDay.toISOString().split('T')[0];
    }
    
    if (reportEndDate) {
        reportEndDate.value = today.toISOString().split('T')[0];
    }
}

// Abrir modal de gerar relatório
function openGenerateReportModal(reportType = '') {
    const modal = document.getElementById('generateReportModal');
    const reportTypeSelect = document.getElementById('reportType');
    
    if (reportType && reportTypeSelect) {
        reportTypeSelect.value = reportType;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de gerar relatório
function closeGenerateReportModal() {
    const modal = document.getElementById('generateReportModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpar formulário
    document.getElementById('generateReportForm').reset();
    setModalDefaultDates();
}

// Gerar relatório personalizado
function handleGenerateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const format = document.querySelector('input[name="format"]:checked').value;
    const includeCharts = document.getElementById('includeCharts').checked;
    const includeDetails = document.getElementById('includeDetails').checked;
    const groupByCategory = document.getElementById('groupByCategory').checked;
    const notes = document.getElementById('reportNotes').value;
    
    if (!reportType || !startDate || !endDate) {
        AppUtils.showToast('Preencha todos os campos obrigatórios', 'warning');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        AppUtils.showToast('A data inicial deve ser anterior à data final', 'warning');
        return;
    }
    
    const reportNames = {
        'sales': 'Relatório de Vendas',
        'products': 'Relatório de Produtos',
        'financial': 'Relatório Financeiro',
        'customers': 'Relatório de Clientes',
        'inventory': 'Relatório de Estoque',
        'custom': 'Relatório Personalizado'
    };
    
    const reportName = reportNames[reportType] || 'Relatório';
    
    AppUtils.showToast(`Gerando ${reportName}...`, 'info');
    
    // Simular geração do relatório
    setTimeout(() => {
        const newReport = {
            id: reportHistory.length + 1,
            name: reportName,
            type: reportType,
            period: `${startDate} - ${endDate}`,
            generatedAt: new Date().toLocaleString('pt-BR'),
            size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            status: 'success',
            format: format.toUpperCase(),
            options: {
                includeCharts,
                includeDetails,
                groupByCategory
            },
            notes
        };
        
        reportHistory.unshift(newReport);
        updateReportHistoryTable();
        closeGenerateReportModal();
        AppUtils.showToast(`${reportName} gerado com sucesso!`, 'success');
    }, 3000);
}

// Inicializar gráficos
function initializeCharts() {
    createSalesChart();
    createProductsChart();
    createRevenueChart();
    createPaymentChart();
}

// Criar gráfico de vendas
function createSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    charts.sales = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.sales.labels,
            datasets: [{
                label: 'Vendas (R$)',
                data: mockData.sales.data,
                borderColor: 'rgb(74, 109, 167)',
                backgroundColor: 'rgba(74, 109, 167, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

// Criar gráfico de produtos
function createProductsChart() {
    const ctx = document.getElementById('productsChart');
    if (!ctx) return;
    
    charts.products = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: mockData.products.labels,
            datasets: [{
                data: mockData.products.data,
                backgroundColor: [
                    'rgb(74, 109, 167)',
                    'rgb(242, 112, 89)',
                    'rgb(46, 204, 113)',
                    'rgb(243, 156, 18)',
                    'rgb(155, 89, 182)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Criar gráfico de receita
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    charts.revenue = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: mockData.revenue.labels,
            datasets: [{
                label: 'Receita (R$)',
                data: mockData.revenue.data,
                backgroundColor: [
                    'rgba(74, 109, 167, 0.8)',
                    'rgba(242, 112, 89, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(243, 156, 18, 0.8)'
                ],
                borderColor: [
                    'rgb(74, 109, 167)',
                    'rgb(242, 112, 89)',
                    'rgb(46, 204, 113)',
                    'rgb(243, 156, 18)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

// Criar gráfico de formas de pagamento
function createPaymentChart() {
    const ctx = document.getElementById('paymentChart');
    if (!ctx) return;
    
    charts.payment = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: mockData.payment.labels,
            datasets: [{
                data: mockData.payment.data,
                backgroundColor: [
                    'rgb(242, 112, 89)',
                    'rgb(74, 109, 167)',
                    'rgb(46, 204, 113)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Atualizar gráficos
function updateCharts() {
    // Simular atualização dos dados dos gráficos
    Object.keys(charts).forEach(chartKey => {
        if (charts[chartKey]) {
            // Aqui seria feita a atualização real dos dados
            charts[chartKey].update();
        }
    });
}

// Carregar histórico de relatórios
function loadReportHistory() {
    reportHistory = [
        {
            id: 1,
            name: 'Relatório de Vendas',
            type: 'sales',
            period: '01/07/2025 - 30/07/2025',
            generatedAt: '30/07/2025 15:30',
            size: '2.3 MB',
            status: 'success'
        },
        {
            id: 2,
            name: 'Relatório de Produtos',
            type: 'products',
            period: '01/07/2025 - 30/07/2025',
            generatedAt: '30/07/2025 14:15',
            size: '1.8 MB',
            status: 'success'
        },
        {
            id: 3,
            name: 'Relatório Financeiro',
            type: 'financial',
            period: '01/07/2025 - 30/07/2025',
            generatedAt: '30/07/2025 13:45',
            size: '3.1 MB',
            status: 'warning'
        }
    ];
    
    updateReportHistoryTable();
}

// Atualizar tabela do histórico
function updateReportHistoryTable() {
    const tbody = document.getElementById('reportsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    reportHistory.forEach(report => {
        const row = createReportHistoryRow(report);
        tbody.appendChild(row);
    });
}

// Criar linha do histórico
function createReportHistoryRow(report) {
    const row = document.createElement('tr');
    
    const iconClass = getReportIconClass(report.type);
    const statusClass = getStatusClass(report.status);
    const statusText = getStatusText(report.status);
    
    row.innerHTML = `
        <td>
            <div class="report-info">
                <i class="${iconClass}"></i>
                <span>${report.name}</span>
            </div>
        </td>
        <td>${report.period}</td>
        <td>${report.generatedAt}</td>
        <td>${report.size}</td>
        <td>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </td>
        <td>
            ${report.status === 'success' ? `
                <button class="btn btn-icon btn-primary" title="Baixar" onclick="downloadReport(${report.id})">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-icon btn-secondary" title="Visualizar" onclick="viewReport(${report.id})">
                    <i class="fas fa-eye"></i>
                </button>
            ` : ''}
            ${report.status === 'warning' ? `
                <button class="btn btn-icon btn-secondary" title="Cancelar" onclick="cancelReport(${report.id})">
                    <i class="fas fa-times"></i>
                </button>
            ` : ''}
            <button class="btn btn-icon btn-danger" title="Excluir" onclick="deleteReport(${report.id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Obter classe do ícone do relatório
function getReportIconClass(type) {
    const classes = {
        'sales': 'fas fa-chart-line text-primary',
        'products': 'fas fa-tshirt text-secondary',
        'financial': 'fas fa-dollar-sign text-success',
        'customers': 'fas fa-users text-info',
        'inventory': 'fas fa-boxes text-warning',
        'custom': 'fas fa-file-alt text-dark'
    };
    return classes[type] || 'fas fa-file-alt text-dark';
}

// Obter classe do status
function getStatusClass(status) {
    const classes = {
        'success': 'success',
        'warning': 'warning',
        'error': 'danger'
    };
    return classes[status] || 'success';
}

// Obter texto do status
function getStatusText(status) {
    const texts = {
        'success': 'Concluído',
        'warning': 'Processando',
        'error': 'Erro'
    };
    return texts[status] || 'Concluído';
}

// Baixar relatório
function downloadReport(reportId) {
    const report = reportHistory.find(r => r.id === reportId);
    if (report) {
        AppUtils.showToast(`Baixando ${report.name}...`, 'info');
        // Aqui seria implementado o download real
    }
}

// Visualizar relatório
function viewReport(reportId) {
    const report = reportHistory.find(r => r.id === reportId);
    if (report) {
        AppUtils.showToast(`Abrindo ${report.name}...`, 'info');
        // Aqui seria implementada a visualização
    }
}

// Cancelar relatório
function cancelReport(reportId) {
    const report = reportHistory.find(r => r.id === reportId);
    if (report) {
        report.status = 'error';
        updateReportHistoryTable();
        AppUtils.showToast(`${report.name} cancelado`, 'warning');
    }
}

// Excluir relatório
function deleteReport(reportId) {
    const report = reportHistory.find(r => r.id === reportId);
    if (report && confirm(`Deseja realmente excluir o ${report.name}?`)) {
        reportHistory = reportHistory.filter(r => r.id !== reportId);
        updateReportHistoryTable();
        AppUtils.showToast(`${report.name} excluído`, 'success');
    }
}

// Exportar funções para uso global
window.ReportsPage = {
    downloadReport,
    viewReport,
    cancelReport,
    deleteReport
};

// Tornar funções disponíveis globalmente para uso inline
window.downloadReport = downloadReport;
window.viewReport = viewReport;
window.cancelReport = cancelReport;
window.deleteReport = deleteReport;

