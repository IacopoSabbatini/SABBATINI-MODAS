// JavaScript específico para a página de caixa

// Variáveis globais
let transactions = [];
let filteredTransactions = [];
let currentPage = 1;
let transactionsPerPage = 10;
let currentFilters = {
    period: 'today',
    type: '',
    category: '',
    search: ''
};

// Estado do caixa
let cashStatus = {
    isOpen: true,
    openingBalance: 500.00,
    totalIncome: 2450.00,
    totalExpense: 150.00,
    currentBalance: 2800.00,
    openTime: '08:00'
};

// Dados simulados das transações
const mockTransactions = [
    {
        id: 1,
        date: '2025-07-30 14:30',
        type: 'entrada',
        description: 'Venda #001 - Maria Silva',
        category: 'vendas',
        amount: 389.80,
        balance: 2800.00,
        user: 'Admin',
        notes: 'Venda realizada via PIX'
    },
    {
        id: 2,
        date: '2025-07-30 13:15',
        type: 'entrada',
        description: 'Venda #002 - João Santos',
        category: 'vendas',
        amount: 159.90,
        balance: 2410.20,
        user: 'Admin',
        notes: 'Venda realizada via cartão'
    },
    {
        id: 3,
        date: '2025-07-30 12:00',
        type: 'saida',
        description: 'Compra de material de escritório',
        category: 'despesas',
        amount: 85.50,
        balance: 2250.30,
        user: 'Admin',
        notes: 'Compra de canetas, papel e grampeador'
    },
    {
        id: 4,
        date: '2025-07-30 10:30',
        type: 'sangria',
        description: 'Sangria para banco',
        category: 'outros',
        amount: 1000.00,
        balance: 2335.80,
        user: 'Admin',
        notes: 'Depósito no Banco do Brasil'
    },
    {
        id: 5,
        date: '2025-07-30 08:00',
        type: 'abertura',
        description: 'Abertura do caixa',
        category: 'outros',
        amount: 500.00,
        balance: 500.00,
        user: 'Admin',
        notes: 'Abertura do caixa para o dia'
    }
];

// Inicialização da página de caixa
document.addEventListener('DOMContentLoaded', function() {
    initializeCashPage();
});

// Função principal de inicialização
function initializeCashPage() {
    loadTransactions();
    initializeFilters();
    initializeSearch();
    initializeModal();
    initializeCashActions();
    renderTransactionsTable();
    updateCashDisplay();
}

// Carregar transações
function loadTransactions() {
    transactions = [...mockTransactions];
    filteredTransactions = [...transactions];
}

// Atualizar display do caixa
function updateCashDisplay() {
    document.getElementById('openingBalance').textContent = AppUtils.formatCurrency(cashStatus.openingBalance);
    document.getElementById('totalIncome').textContent = AppUtils.formatCurrency(cashStatus.totalIncome);
    document.getElementById('totalExpense').textContent = AppUtils.formatCurrency(cashStatus.totalExpense);
    document.getElementById('currentBalance').textContent = AppUtils.formatCurrency(cashStatus.currentBalance);
    
    // Atualizar status do caixa
    const statusElement = document.querySelector('.cash-status');
    if (statusElement) {
        statusElement.textContent = cashStatus.isOpen ? 'Caixa Aberto' : 'Caixa Fechado';
        statusElement.className = `cash-status ${cashStatus.isOpen ? 'open' : 'closed'}`;
    }
}

// Inicializar filtros
function initializeFilters() {
    const periodFilter = document.getElementById('periodFilter');
    const typeFilter = document.getElementById('typeFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (periodFilter) {
        periodFilter.addEventListener('change', function() {
            currentFilters.period = this.value;
            applyFilters();
        });
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            currentFilters.type = this.value;
            applyFilters();
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyFilters();
        });
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Inicializar busca
function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        const debouncedSearch = AppUtils.debounce((query) => {
            currentFilters.search = query;
            applyFilters();
        }, 300);
        
        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });
    }
}

// Aplicar filtros
function applyFilters() {
    filteredTransactions = transactions.filter(transaction => {
        // Filtro por tipo
        if (currentFilters.type && transaction.type !== currentFilters.type) {
            return false;
        }
        
        // Filtro por categoria
        if (currentFilters.category && transaction.category !== currentFilters.category) {
            return false;
        }
        
        // Filtro por busca
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            if (!transaction.description.toLowerCase().includes(searchTerm) &&
                !transaction.user.toLowerCase().includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Resetar para primeira página
    currentPage = 1;
    
    // Renderizar transações filtradas
    renderTransactionsTable();
}

// Limpar filtros
function clearFilters() {
    currentFilters = {
        period: 'today',
        type: '',
        category: '',
        search: ''
    };
    
    // Resetar elementos do formulário
    document.getElementById('periodFilter').value = 'today';
    document.getElementById('typeFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.querySelector('.search-box input').value = '';
    
    applyFilters();
    AppUtils.showToast('Filtros limpos', 'info');
}

// Renderizar tabela de transações
function renderTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;
    
    // Calcular transações da página atual
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    const transactionsToShow = filteredTransactions.slice(startIndex, endIndex);
    
    if (transactionsToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div style="padding: 2rem; color: var(--gray);">
                        <i class="fas fa-search fa-2x" style="margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>Nenhuma movimentação encontrada</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    transactionsToShow.forEach(transaction => {
        const row = createTransactionRow(transaction);
        tbody.appendChild(row);
    });
}

// Criar linha da tabela de transações
function createTransactionRow(transaction) {
    const row = document.createElement('tr');
    
    const typeClass = getTypeClass(transaction.type);
    const typeText = getTypeText(transaction.type);
    const amountClass = getAmountClass(transaction.type);
    const amountPrefix = getAmountPrefix(transaction.type);
    
    row.innerHTML = `
        <td>${formatDateTime(transaction.date)}</td>
        <td>
            <span class="type-badge ${typeClass}">${typeText}</span>
        </td>
        <td>${transaction.description}</td>
        <td>${getCategoryText(transaction.category)}</td>
        <td class="amount ${amountClass}">${amountPrefix}${AppUtils.formatCurrency(transaction.amount)}</td>
        <td>${AppUtils.formatCurrency(transaction.balance)}</td>
        <td>${transaction.user}</td>
        <td>
            <button class="btn btn-icon btn-primary" title="Ver Detalhes" onclick="viewTransaction(${transaction.id})">
                <i class="fas fa-eye"></i>
            </button>
            ${transaction.type !== 'abertura' && transaction.type !== 'sangria' ? `
                <button class="btn btn-icon btn-warning" title="Editar" onclick="editTransaction(${transaction.id})">
                    <i class="fas fa-edit"></i>
                </button>
            ` : ''}
        </td>
    `;
    
    return row;
}

// Obter classe do tipo
function getTypeClass(type) {
    const classes = {
        'entrada': 'income',
        'saida': 'expense',
        'sangria': 'sangria',
        'abertura': 'opening'
    };
    return classes[type] || 'income';
}

// Obter texto do tipo
function getTypeText(type) {
    const texts = {
        'entrada': 'Entrada',
        'saida': 'Saída',
        'sangria': 'Sangria',
        'abertura': 'Abertura'
    };
    return texts[type] || 'Entrada';
}

// Obter classe do valor
function getAmountClass(type) {
    const classes = {
        'entrada': 'positive',
        'saida': 'negative',
        'sangria': 'negative',
        'abertura': 'neutral'
    };
    return classes[type] || 'positive';
}

// Obter prefixo do valor
function getAmountPrefix(type) {
    const prefixes = {
        'entrada': '+',
        'saida': '-',
        'sangria': '-',
        'abertura': ''
    };
    return prefixes[type] || '+';
}

// Obter texto da categoria
function getCategoryText(category) {
    const texts = {
        'vendas': 'Vendas',
        'despesas': 'Despesas',
        'suprimento': 'Suprimento',
        'outros': 'Outros'
    };
    return texts[category] || 'Outros';
}

// Formatar data e hora
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Inicializar modal
function initializeModal() {
    const modal = document.getElementById('transactionModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveTransactionBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTransactionModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeTransactionModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeTransactionModal();
            }
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSaveTransaction);
    }
    
    // Definir data/hora atual por padrão
    const dateTimeInput = document.getElementById('transactionDateTime');
    if (dateTimeInput) {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dateTimeInput.value = localDateTime;
    }
}

// Inicializar ações do caixa
function initializeCashActions() {
    const openCashBtn = document.getElementById('openCashBtn');
    const closeCashBtn = document.getElementById('closeCashBtn');
    const addIncomeBtn = document.getElementById('addIncomeBtn');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const transferBtn = document.getElementById('transferBtn');
    const sangriaCaixaBtn = document.getElementById('sangriaCaixaBtn');
    
    if (openCashBtn) {
        openCashBtn.addEventListener('click', openCash);
    }
    
    if (closeCashBtn) {
        closeCashBtn.addEventListener('click', closeCash);
    }
    
    if (addIncomeBtn) {
        addIncomeBtn.addEventListener('click', () => openTransactionModal('entrada'));
    }
    
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => openTransactionModal('saida'));
    }
    
    if (transferBtn) {
        transferBtn.addEventListener('click', handleTransfer);
    }
    
    if (sangriaCaixaBtn) {
        sangriaCaixaBtn.addEventListener('click', () => openTransactionModal('sangria'));
    }
}

// Abrir caixa
function openCash() {
    if (cashStatus.isOpen) {
        AppUtils.showToast('O caixa já está aberto', 'warning');
        return;
    }
    
    const openingAmount = prompt('Digite o valor de abertura do caixa:', '500.00');
    if (openingAmount && !isNaN(parseFloat(openingAmount))) {
        cashStatus.isOpen = true;
        cashStatus.openingBalance = parseFloat(openingAmount);
        cashStatus.currentBalance = parseFloat(openingAmount);
        cashStatus.openTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        // Adicionar transação de abertura
        const newTransaction = {
            id: transactions.length + 1,
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            type: 'abertura',
            description: 'Abertura do caixa',
            category: 'outros',
            amount: parseFloat(openingAmount),
            balance: parseFloat(openingAmount),
            user: 'Admin',
            notes: 'Abertura do caixa para o dia'
        };
        
        transactions.unshift(newTransaction);
        applyFilters();
        updateCashDisplay();
        
        AppUtils.showToast('Caixa aberto com sucesso!', 'success');
    }
}

// Fechar caixa
function closeCash() {
    if (!cashStatus.isOpen) {
        AppUtils.showToast('O caixa já está fechado', 'warning');
        return;
    }
    
    const confirmClose = confirm(`Deseja realmente fechar o caixa?\n\nSaldo atual: ${AppUtils.formatCurrency(cashStatus.currentBalance)}`);
    if (confirmClose) {
        cashStatus.isOpen = false;
        updateCashDisplay();
        AppUtils.showToast('Caixa fechado com sucesso!', 'success');
    }
}

// Abrir modal de transação
function openTransactionModal(type = '') {
    if (!cashStatus.isOpen && type !== 'abertura') {
        AppUtils.showToast('O caixa deve estar aberto para realizar movimentações', 'warning');
        return;
    }
    
    const modal = document.getElementById('transactionModal');
    const modalTitle = document.getElementById('modalTitle');
    const typeSelect = document.getElementById('transactionType');
    
    // Configurar título e tipo
    if (type) {
        modalTitle.textContent = `Nova ${getTypeText(type)}`;
        typeSelect.value = type;
        typeSelect.disabled = true;
    } else {
        modalTitle.textContent = 'Nova Movimentação';
        typeSelect.disabled = false;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de transação
function closeTransactionModal() {
    const modal = document.getElementById('transactionModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpar formulário
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionType').disabled = false;
    
    // Redefinir data/hora atual
    const dateTimeInput = document.getElementById('transactionDateTime');
    if (dateTimeInput) {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dateTimeInput.value = localDateTime;
    }
}

// Salvar transação
function handleSaveTransaction() {
    const type = document.getElementById('transactionType').value;
    const category = document.getElementById('transactionCategory').value;
    const description = document.getElementById('transactionDescription').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const dateTime = document.getElementById('transactionDateTime').value;
    const notes = document.getElementById('transactionNotes').value;
    
    if (!type || !category || !description || !amount || !dateTime) {
        AppUtils.showToast('Preencha todos os campos obrigatórios', 'warning');
        return;
    }
    
    if (amount <= 0) {
        AppUtils.showToast('O valor deve ser maior que zero', 'warning');
        return;
    }
    
    // Calcular novo saldo
    let newBalance = cashStatus.currentBalance;
    if (type === 'entrada') {
        newBalance += amount;
        cashStatus.totalIncome += amount;
    } else if (type === 'saida' || type === 'sangria') {
        newBalance -= amount;
        cashStatus.totalExpense += amount;
    }
    
    // Verificar se há saldo suficiente para saídas
    if ((type === 'saida' || type === 'sangria') && newBalance < 0) {
        AppUtils.showToast('Saldo insuficiente para esta operação', 'error');
        return;
    }
    
    // Criar nova transação
    const newTransaction = {
        id: transactions.length + 1,
        date: dateTime.replace('T', ' '),
        type: type,
        description: description,
        category: category,
        amount: amount,
        balance: newBalance,
        user: 'Admin',
        notes: notes
    };
    
    // Atualizar saldo atual
    cashStatus.currentBalance = newBalance;
    
    // Adicionar transação
    transactions.unshift(newTransaction);
    applyFilters();
    updateCashDisplay();
    closeTransactionModal();
    
    AppUtils.showToast(`${getTypeText(type)} registrada com sucesso!`, 'success');
}

// Transferência
function handleTransfer() {
    AppUtils.showToast('Funcionalidade de transferência em desenvolvimento', 'info');
}

// Visualizar transação
function viewTransaction(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
        const details = `
Detalhes da Movimentação #${transaction.id}

Data/Hora: ${formatDateTime(transaction.date)}
Tipo: ${getTypeText(transaction.type)}
Descrição: ${transaction.description}
Categoria: ${getCategoryText(transaction.category)}
Valor: ${getAmountPrefix(transaction.type)}${AppUtils.formatCurrency(transaction.amount)}
Saldo após: ${AppUtils.formatCurrency(transaction.balance)}
Usuário: ${transaction.user}
Observações: ${transaction.notes || 'Nenhuma observação'}
        `;
        
        alert(details);
    }
}

// Editar transação
function editTransaction(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
        AppUtils.showToast(`Editando movimentação #${transactionId}`, 'info');
        // Aqui seria implementada a edição
    }
}

// Exportar funções para uso global
window.CashPage = {
    viewTransaction,
    editTransaction,
    openTransactionModal
};

// Tornar funções disponíveis globalmente para uso inline
window.viewTransaction = viewTransaction;
window.editTransaction = editTransaction;

