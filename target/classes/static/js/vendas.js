// JavaScript específico para a página de vendas

// Variáveis globais
let sales = [];
let filteredSales = [];
let currentPage = 1;
let salesPerPage = 10;
let currentFilters = {
    period: 'today',
    status: '',
    payment: '',
    search: ''
};

// Dados simulados das vendas
const mockSales = [
    {
        id: '001',
        date: '2025-07-30 14:30',
        client: 'Maria Silva',
        products: 2,
        total: 389.80,
        payment: 'pix',
        status: 'concluida'
    },
    {
        id: '002',
        date: '2025-07-30 13:15',
        client: 'João Santos',
        products: 1,
        total: 159.90,
        payment: 'cartao',
        status: 'concluida'
    },
    {
        id: '003',
        date: '2025-07-30 12:45',
        client: 'Ana Costa',
        products: 3,
        total: 299.70,
        payment: 'dinheiro',
        status: 'pendente'
    },
    {
        id: '004',
        date: '2025-07-30 11:20',
        client: 'Carlos Oliveira',
        products: 1,
        total: 79.90,
        payment: 'pix',
        status: 'concluida'
    },
    {
        id: '005',
        date: '2025-07-30 10:30',
        client: 'Fernanda Lima',
        products: 2,
        total: 249.80,
        payment: 'cartao',
        status: 'cancelada'
    }
];

// Produtos disponíveis para venda
const availableProducts = [
    { id: 1, name: 'Vestido Elegante Verde', price: 189.90, stock: 15 },
    { id: 2, name: 'Conjunto Alfaiataria', price: 299.90, stock: 8 },
    { id: 3, name: 'Conjunto Casual Elegante', price: 159.90, stock: 12 },
    { id: 4, name: 'Camiseta Premium Branca', price: 79.90, stock: 25 },
    { id: 5, name: 'Combo Camisetas Masculinas', price: 149.90, stock: 3 }
];

// Carrinho de compras atual
let currentCart = [];

// Inicialização da página de vendas
document.addEventListener('DOMContentLoaded', function() {
    initializeSalesPage();
});

// Função principal de inicialização
function initializeSalesPage() {
    loadSales();
    initializeFilters();
    initializeSearch();
    initializeModal();
    initializeSaleActions();
    renderSalesTable();
}

// Carregar vendas
function loadSales() {
    sales = [...mockSales];
    filteredSales = [...sales];
}

// Inicializar filtros
function initializeFilters() {
    const periodFilter = document.getElementById('periodFilter');
    const statusFilter = document.getElementById('statusFilter');
    const paymentFilter = document.getElementById('paymentFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (periodFilter) {
        periodFilter.addEventListener('change', function() {
            currentFilters.period = this.value;
            applyFilters();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            applyFilters();
        });
    }
    
    if (paymentFilter) {
        paymentFilter.addEventListener('change', function() {
            currentFilters.payment = this.value;
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
    filteredSales = sales.filter(sale => {
        // Filtro por status
        if (currentFilters.status && sale.status !== currentFilters.status) {
            return false;
        }
        
        // Filtro por forma de pagamento
        if (currentFilters.payment && sale.payment !== currentFilters.payment) {
            return false;
        }
        
        // Filtro por busca
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            if (!sale.client.toLowerCase().includes(searchTerm) &&
                !sale.id.toLowerCase().includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Resetar para primeira página
    currentPage = 1;
    
    // Renderizar vendas filtradas
    renderSalesTable();
}

// Limpar filtros
function clearFilters() {
    currentFilters = {
        period: 'today',
        status: '',
        payment: '',
        search: ''
    };
    
    // Resetar elementos do formulário
    document.getElementById('periodFilter').value = 'today';
    document.getElementById('statusFilter').value = '';
    document.getElementById('paymentFilter').value = '';
    document.querySelector('.search-box input').value = '';
    
    applyFilters();
    AppUtils.showToast('Filtros limpos', 'info');
}

// Renderizar tabela de vendas
function renderSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;
    
    // Calcular vendas da página atual
    const startIndex = (currentPage - 1) * salesPerPage;
    const endIndex = startIndex + salesPerPage;
    const salesToShow = filteredSales.slice(startIndex, endIndex);
    
    if (salesToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div style="padding: 2rem; color: var(--gray);">
                        <i class="fas fa-search fa-2x" style="margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>Nenhuma venda encontrada</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    salesToShow.forEach(sale => {
        const row = createSaleRow(sale);
        tbody.appendChild(row);
    });
}

// Criar linha da tabela de vendas
function createSaleRow(sale) {
    const row = document.createElement('tr');
    
    const statusClass = getStatusClass(sale.status);
    const statusText = getStatusText(sale.status);
    const paymentClass = getPaymentClass(sale.payment);
    const paymentText = getPaymentText(sale.payment);
    
    row.innerHTML = `
        <td>#${sale.id}</td>
        <td>${formatDateTime(sale.date)}</td>
        <td>${sale.client}</td>
        <td>${sale.products} ${sale.products === 1 ? 'item' : 'itens'}</td>
        <td>${AppUtils.formatCurrency(sale.total)}</td>
        <td>
            <span class="payment-badge ${paymentClass}">${paymentText}</span>
        </td>
        <td>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </td>
        <td>
            <button class="btn btn-icon btn-primary" title="Ver Detalhes" onclick="viewSale('${sale.id}')">
                <i class="fas fa-eye"></i>
            </button>
            ${sale.status === 'concluida' ? `
                <button class="btn btn-icon btn-secondary" title="Imprimir" onclick="printSale('${sale.id}')">
                    <i class="fas fa-print"></i>
                </button>
            ` : ''}
            ${sale.status === 'pendente' ? `
                <button class="btn btn-icon btn-success" title="Finalizar" onclick="finalizeSale('${sale.id}')">
                    <i class="fas fa-check"></i>
                </button>
            ` : ''}
            ${sale.status === 'cancelada' ? `
                <button class="btn btn-icon btn-warning" title="Reativar" onclick="reactivateSale('${sale.id}')">
                    <i class="fas fa-redo"></i>
                </button>
            ` : ''}
        </td>
    `;
    
    return row;
}

// Obter classe do status
function getStatusClass(status) {
    const classes = {
        'concluida': 'success',
        'pendente': 'warning',
        'cancelada': 'danger'
    };
    return classes[status] || 'success';
}

// Obter texto do status
function getStatusText(status) {
    const texts = {
        'concluida': 'Concluída',
        'pendente': 'Pendente',
        'cancelada': 'Cancelada'
    };
    return texts[status] || 'Concluída';
}

// Obter classe do pagamento
function getPaymentClass(payment) {
    const classes = {
        'dinheiro': 'cash',
        'cartao': 'card',
        'pix': 'pix'
    };
    return classes[payment] || 'cash';
}

// Obter texto do pagamento
function getPaymentText(payment) {
    const texts = {
        'dinheiro': 'Dinheiro',
        'cartao': 'Cartão',
        'pix': 'PIX'
    };
    return texts[payment] || 'Dinheiro';
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
    const modal = document.getElementById('newSaleModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const newSaleBtn = document.getElementById('newSaleBtn');
    const saveSaleBtn = document.getElementById('saveSaleBtn');
    
    if (newSaleBtn) {
        newSaleBtn.addEventListener('click', openNewSaleModal);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNewSaleModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeNewSaleModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeNewSaleModal();
            }
        });
    }
    
    if (saveSaleBtn) {
        saveSaleBtn.addEventListener('click', handleSaveSale);
    }
    
    // Inicializar busca de produtos
    const productSearch = document.getElementById('productSearch');
    const addProductBtn = document.getElementById('addProductBtn');
    
    if (productSearch) {
        productSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addProductToCart();
            }
        });
    }
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', addProductToCart);
    }
    
    // Inicializar campo de desconto
    const discountInput = document.getElementById('discount');
    if (discountInput) {
        discountInput.addEventListener('input', updateSaleTotal);
    }
}

// Abrir modal de nova venda
function openNewSaleModal() {
    const modal = document.getElementById('newSaleModal');
    currentCart = [];
    updateCartDisplay();
    updateSaleTotal();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de nova venda
function closeNewSaleModal() {
    const modal = document.getElementById('newSaleModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpar formulário
    document.getElementById('newSaleForm').reset();
    currentCart = [];
    updateCartDisplay();
    updateSaleTotal();
}

// Adicionar produto ao carrinho
function addProductToCart() {
    const searchInput = document.getElementById('productSearch');
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        AppUtils.showToast('Digite o nome do produto', 'warning');
        return;
    }
    
    const product = availableProducts.find(p => 
        p.name.toLowerCase().includes(searchTerm)
    );
    
    if (!product) {
        AppUtils.showToast('Produto não encontrado', 'error');
        return;
    }
    
    // Verificar se já está no carrinho
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentCart.push({
            ...product,
            quantity: 1
        });
    }
    
    searchInput.value = '';
    updateCartDisplay();
    updateSaleTotal();
    AppUtils.showToast(`${product.name} adicionado ao carrinho`, 'success');
}

// Atualizar display do carrinho
function updateCartDisplay() {
    const container = document.getElementById('selectedProducts');
    
    if (currentCart.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = '';
    
    currentCart.forEach(item => {
        const productElement = createCartItemElement(item);
        container.appendChild(productElement);
    });
}

// Criar elemento do item do carrinho
function createCartItemElement(item) {
    const element = document.createElement('div');
    element.className = 'product-item';
    
    element.innerHTML = `
        <div class="product-info">
            <div class="product-name">${item.name}</div>
            <div class="product-price">${AppUtils.formatCurrency(item.price)} cada</div>
        </div>
        <div class="product-quantity">
            <button type="button" class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                <i class="fas fa-minus"></i>
            </button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                   onchange="setQuantity(${item.id}, this.value)">
            <button type="button" class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <button type="button" class="remove-product" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return element;
}

// Atualizar quantidade
function updateQuantity(productId, change) {
    const item = currentCart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        updateCartDisplay();
        updateSaleTotal();
    }
}

// Definir quantidade
function setQuantity(productId, quantity) {
    const item = currentCart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity) || 1);
        updateCartDisplay();
        updateSaleTotal();
    }
}

// Remover do carrinho
function removeFromCart(productId) {
    currentCart = currentCart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateSaleTotal();
    AppUtils.showToast('Produto removido do carrinho', 'info');
}

// Atualizar total da venda
function updateSaleTotal() {
    const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = Math.max(0, subtotal - discount);
    
    document.getElementById('subtotal').textContent = AppUtils.formatCurrency(subtotal);
    document.getElementById('total').textContent = AppUtils.formatCurrency(total);
}

// Salvar venda
function handleSaveSale() {
    const clientSelect = document.getElementById('clientSelect');
    const paymentMethod = document.getElementById('paymentMethod');
    
    if (!clientSelect.value) {
        AppUtils.showToast('Selecione um cliente', 'warning');
        return;
    }
    
    if (!paymentMethod.value) {
        AppUtils.showToast('Selecione a forma de pagamento', 'warning');
        return;
    }
    
    if (currentCart.length === 0) {
        AppUtils.showToast('Adicione pelo menos um produto', 'warning');
        return;
    }
    
    const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = Math.max(0, subtotal - discount);
    
    // Simular salvamento
    const newSale = {
        id: String(sales.length + 1).padStart(3, '0'),
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        client: clientSelect.options[clientSelect.selectedIndex].text,
        products: currentCart.reduce((sum, item) => sum + item.quantity, 0),
        total: total,
        payment: paymentMethod.value,
        status: 'concluida'
    };
    
    sales.unshift(newSale);
    applyFilters();
    closeNewSaleModal();
    
    AppUtils.showToast(`Venda #${newSale.id} realizada com sucesso!`, 'success');
}

// Inicializar ações das vendas
function initializeSaleActions() {
    // As ações são definidas inline nos botões da tabela
}

// Visualizar venda
function viewSale(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (sale) {
        AppUtils.showToast(`Visualizando venda #${saleId}`, 'info');
        // Aqui poderia abrir um modal de detalhes
    }
}

// Imprimir venda
function printSale(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (sale) {
        AppUtils.showToast(`Imprimindo venda #${saleId}`, 'info');
        // Aqui seria implementada a impressão
    }
}

// Finalizar venda
function finalizeSale(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (sale) {
        sale.status = 'concluida';
        renderSalesTable();
        AppUtils.showToast(`Venda #${saleId} finalizada!`, 'success');
    }
}

// Reativar venda
function reactivateSale(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (sale) {
        sale.status = 'pendente';
        renderSalesTable();
        AppUtils.showToast(`Venda #${saleId} reativada!`, 'success');
    }
}

// Exportar funções para uso global
window.SalesPage = {
    viewSale,
    printSale,
    finalizeSale,
    reactivateSale,
    updateQuantity,
    setQuantity,
    removeFromCart
};

// Tornar funções disponíveis globalmente para uso inline
window.viewSale = viewSale;
window.printSale = printSale;
window.finalizeSale = finalizeSale;
window.reactivateSale = reactivateSale;
window.updateQuantity = updateQuantity;
window.setQuantity = setQuantity;
window.removeFromCart = removeFromCart;

