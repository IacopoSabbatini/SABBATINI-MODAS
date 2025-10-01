// JavaScript para a página de produtos - Integrado com API REST

// Configuração da API
const API_BASE_URL = 'http://localhost:8080/api';

// Variáveis globais
let products = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 8;
let currentFilters = {
    category: '',
    status: '',
    sort: 'nome',
    search: ''
};

document.addEventListener("DOMContentLoaded", function() {
    // Verifica se o usuário está logado
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    initializePage();
});

async function initializePage() {
    try {
        await loadProducts();
        setupEventListeners();
        renderProducts();
        updateStats();
    } catch (error) {
        console.error('Erro ao inicializar página:', error);
        alert('Erro ao carregar dados. Verifique sua conexão.');
    }
}

function setupEventListeners() {
    // Botão de adicionar produto
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showAddProductModal);
    }

    // Filtros
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFilterChange);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', handleFilterChange);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', handleFilterChange);
    }
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchChange);
    }
}

async function loadProducts() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/produtos`);
        
        if (response.ok) {
            products = await response.json();
            filteredProducts = [...products];
        } else {
            throw new Error('Erro ao carregar produtos');
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        products = [];
        filteredProducts = [];
    }
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Aplicar filtros
    applyFilters();

    // Paginação
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <p>Nenhum produto encontrado.</p>
                <button onclick="showAddProductModal()" class="btn btn-primary">
                    Adicionar Primeiro Produto
                </button>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.imagem || 'images/produtos/default.jpg'}" alt="${product.nome}" onerror="this.src='images/produtos/default.jpg'">
                <div class="product-status ${product.ativo ? 'active' : 'inactive'}">
                    ${product.ativo ? 'Ativo' : 'Inativo'}
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-category">${product.categoria || 'Sem categoria'}</p>
                <div class="product-price">R$ ${product.preco ? product.preco.toFixed(2) : '0,00'}</div>
                <div class="product-stock">
                    <span class="stock-label">Estoque:</span>
                    <span class="stock-value ${product.quantidadeEstoque <= (product.estoqueMinimo || 5) ? 'low-stock' : ''}">${product.quantidadeEstoque || 0}</span>
                </div>
            </div>
            <div class="product-actions">
                <button onclick="editProduct(${product.id})" class="btn btn-secondary btn-sm">
                    Editar
                </button>
                <button onclick="toggleProductStatus(${product.id})" class="btn ${product.ativo ? 'btn-warning' : 'btn-success'} btn-sm">
                    ${product.ativo ? 'Desativar' : 'Ativar'}
                </button>
                <button onclick="deleteProduct(${product.id})" class="btn btn-danger btn-sm">
                    Excluir
                </button>
            </div>
        </div>
    `).join('');

    renderPagination();
}

function applyFilters() {
    filteredProducts = products.filter(product => {
        // Filtro de busca
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            if (!product.nome.toLowerCase().includes(searchTerm) &&
                !(product.categoria && product.categoria.toLowerCase().includes(searchTerm))) {
                return false;
            }
        }

        // Filtro de categoria
        if (currentFilters.category && product.categoria !== currentFilters.category) {
            return false;
        }

        // Filtro de status
        if (currentFilters.status) {
            if (currentFilters.status === 'ativo' && !product.ativo) return false;
            if (currentFilters.status === 'inativo' && product.ativo) return false;
        }

        return true;
    });

    // Ordenação
    filteredProducts.sort((a, b) => {
        switch (currentFilters.sort) {
            case 'nome':
                return a.nome.localeCompare(b.nome);
            case 'preco':
                return (a.preco || 0) - (b.preco || 0);
            case 'estoque':
                return (a.quantidadeEstoque || 0) - (b.quantidadeEstoque || 0);
            default:
                return 0;
        }
    });
}

function handleFilterChange(event) {
    const filterType = event.target.id.replace('Filter', '');
    currentFilters[filterType] = event.target.value;
    currentPage = 1;
    renderProducts();
}

function handleSearchChange(event) {
    currentFilters.search = event.target.value;
    currentPage = 1;
    renderProducts();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (!pagination || totalPages <= 1) {
        if (pagination) pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Botão anterior
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})" class="btn btn-secondary">Anterior</button>`;
    }

    // Números das páginas
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="btn btn-primary">${i}</button>`;
        } else {
            paginationHTML += `<button onclick="changePage(${i})" class="btn btn-secondary">${i}</button>`;
        }
    }

    // Botão próximo
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})" class="btn btn-secondary">Próximo</button>`;
    }

    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderProducts();
}

async function updateStats() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/produtos/estatisticas`);
        
        if (response.ok) {
            const stats = await response.json();
            
            // Atualiza elementos de estatísticas se existirem
            const totalProductsEl = document.getElementById('totalProducts');
            const totalValueEl = document.getElementById('totalValue');
            const lowStockEl = document.getElementById('lowStock');

            if (totalProductsEl) totalProductsEl.textContent = stats.totalProdutos || 0;
            if (totalValueEl) totalValueEl.textContent = `R$ ${(stats.valorTotalEstoque || 0).toFixed(2)}`;
            if (lowStockEl) lowStockEl.textContent = stats.produtosEstoqueBaixo || 0;
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

function showAddProductModal() {
    // Implementar modal de adicionar produto
    alert('Funcionalidade de adicionar produto será implementada em breve!');
}

function editProduct(id) {
    // Implementar edição de produto
    alert(`Editar produto ID: ${id}`);
}

async function toggleProductStatus(id) {
    try {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const action = product.ativo ? 'desativar' : 'ativar';
        const response = await authenticatedFetch(`${API_BASE_URL}/produtos/${id}/${action}`, {
            method: 'PUT'
        });

        if (response.ok) {
            await loadProducts();
            renderProducts();
            updateStats();
            alert(`Produto ${action === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`);
        } else {
            throw new Error(`Erro ao ${action} produto`);
        }
    } catch (error) {
        console.error('Erro ao alterar status do produto:', error);
        alert('Erro ao alterar status do produto.');
    }
}

async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadProducts();
            renderProducts();
            updateStats();
            alert('Produto excluído com sucesso!');
        } else {
            throw new Error('Erro ao excluir produto');
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto.');
    }
}

// Funções utilitárias (devem estar disponíveis globalmente)
function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    return fetch(url, mergedOptions);
}

