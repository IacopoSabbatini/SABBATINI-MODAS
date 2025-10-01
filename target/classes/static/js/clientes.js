// JavaScript específico para a página de clientes

// Variáveis globais
let clients = [];
let filteredClients = [];
let currentPage = 1;
let clientsPerPage = 10;
let currentFilters = {
    status: '',
    city: '',
    sort: 'nome',
    search: ''
};

// Dados simulados dos clientes
const mockClients = [
    {
        id: 1,
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        phone: '(11) 99999-9999',
        phoneType: 'WhatsApp',
        city: 'São Paulo',
        state: 'SP',
        registrationDate: '2024-03-15',
        totalPurchases: 1250.00,
        purchaseCount: 8,
        lastPurchase: '2025-07-25',
        status: 'vip',
        cpf: '123.456.789-00',
        birthdate: '1985-05-20',
        gender: 'feminino',
        address: 'Rua das Flores, 123',
        neighborhood: 'Centro',
        cep: '01234-567',
        preference: 'vestidos',
        size: 'M',
        notes: 'Cliente VIP, sempre compra produtos premium'
    },
    {
        id: 2,
        name: 'João Santos',
        email: 'joao.santos@email.com',
        phone: '(11) 88888-8888',
        phoneType: 'Telefone',
        city: 'Rio de Janeiro',
        state: 'RJ',
        registrationDate: '2024-05-22',
        totalPurchases: 680.00,
        purchaseCount: 4,
        lastPurchase: '2025-07-20',
        status: 'active',
        cpf: '987.654.321-00',
        birthdate: '1990-08-15',
        gender: 'masculino',
        address: 'Av. Copacabana, 456',
        neighborhood: 'Copacabana',
        cep: '22070-001',
        preference: 'camisetas',
        size: 'G',
        notes: 'Compra regularmente, gosta de promoções'
    },
    {
        id: 3,
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        phone: '(31) 77777-7777',
        phoneType: 'WhatsApp',
        city: 'Belo Horizonte',
        state: 'MG',
        registrationDate: '2024-01-10',
        totalPurchases: 320.00,
        purchaseCount: 2,
        lastPurchase: '2025-06-15',
        status: 'inactive',
        cpf: '456.789.123-00',
        birthdate: '1992-12-03',
        gender: 'feminino',
        address: 'Rua da Liberdade, 789',
        neighborhood: 'Savassi',
        cep: '30112-000',
        preference: 'conjuntos',
        size: 'P',
        notes: 'Cliente inativa, última compra há mais de 30 dias'
    },
    {
        id: 4,
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@email.com',
        phone: '(11) 66666-6666',
        phoneType: 'WhatsApp',
        city: 'São Paulo',
        state: 'SP',
        registrationDate: '2024-06-10',
        totalPurchases: 890.00,
        purchaseCount: 5,
        lastPurchase: '2025-07-28',
        status: 'active',
        cpf: '789.123.456-00',
        birthdate: '1988-03-12',
        gender: 'masculino',
        address: 'Rua Augusta, 1000',
        neighborhood: 'Consolação',
        cep: '01305-100',
        preference: 'acessorios',
        size: 'M',
        notes: 'Cliente fiel, sempre indica amigos'
    },
    {
        id: 5,
        name: 'Fernanda Lima',
        email: 'fernanda.lima@email.com',
        phone: '(21) 55555-5555',
        phoneType: 'WhatsApp',
        city: 'Rio de Janeiro',
        state: 'RJ',
        registrationDate: '2024-04-18',
        totalPurchases: 1580.00,
        purchaseCount: 12,
        lastPurchase: '2025-07-30',
        status: 'vip',
        cpf: '321.654.987-00',
        birthdate: '1987-09-25',
        gender: 'feminino',
        address: 'Rua Visconde de Pirajá, 200',
        neighborhood: 'Ipanema',
        cep: '22410-000',
        preference: 'vestidos',
        size: 'G',
        notes: 'Cliente VIP, aniversário hoje!'
    }
];

// Inicialização da página de clientes
document.addEventListener('DOMContentLoaded', function() {
    initializeClientsPage();
});

// Função principal de inicialização
function initializeClientsPage() {
    loadClients();
    initializeFilters();
    initializeSearch();
    initializeModal();
    renderClientsTable();
    updateStats();
}

// Carregar clientes
function loadClients() {
    clients = [...mockClients];
    filteredClients = [...clients];
}

// Atualizar estatísticas
function updateStats() {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active' || c.status === 'vip').length;
    const vipClients = clients.filter(c => c.status === 'vip').length;
    
    // Verificar aniversários de hoje
    const today = new Date();
    const todayString = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const birthdaysToday = clients.filter(client => {
        if (client.birthdate) {
            const birthDate = new Date(client.birthdate);
            const birthString = `${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;
            return birthString === todayString;
        }
        return false;
    }).length;
    
    // Atualizar elementos da interface
    const statsElements = document.querySelectorAll('.stat-content h3');
    if (statsElements[0]) statsElements[0].textContent = totalClients;
    if (statsElements[1]) statsElements[1].textContent = activeClients;
    if (statsElements[2]) statsElements[2].textContent = vipClients;
    if (statsElements[3]) statsElements[3].textContent = birthdaysToday;
}

// Inicializar filtros
function initializeFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const cityFilter = document.getElementById('cityFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            applyFilters();
        });
    }
    
    if (cityFilter) {
        cityFilter.addEventListener('change', function() {
            currentFilters.city = this.value;
            applyFilters();
        });
        
        // Preencher opções de cidade dinamicamente
        populateCityFilter();
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyFilters();
        });
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Preencher filtro de cidades
function populateCityFilter() {
    const cityFilter = document.getElementById('cityFilter');
    if (!cityFilter) return;
    
    const cities = [...new Set(clients.map(client => client.city))].sort();
    
    // Limpar opções existentes (exceto a primeira)
    while (cityFilter.children.length > 1) {
        cityFilter.removeChild(cityFilter.lastChild);
    }
    
    // Adicionar cidades
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase().replace(/\s+/g, '-');
        option.textContent = city;
        cityFilter.appendChild(option);
    });
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
    filteredClients = clients.filter(client => {
        // Filtro por status
        if (currentFilters.status && client.status !== currentFilters.status) {
            return false;
        }
        
        // Filtro por cidade
        if (currentFilters.city) {
            const citySlug = client.city.toLowerCase().replace(/\s+/g, '-');
            if (citySlug !== currentFilters.city) {
                return false;
            }
        }
        
        // Filtro por busca
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            if (!client.name.toLowerCase().includes(searchTerm) &&
                !client.email.toLowerCase().includes(searchTerm) &&
                !client.phone.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Aplicar ordenação
    sortClients();
    
    // Resetar para primeira página
    currentPage = 1;
    
    // Renderizar clientes filtrados
    renderClientsTable();
}

// Ordenar clientes
function sortClients() {
    filteredClients.sort((a, b) => {
        switch (currentFilters.sort) {
            case 'nome':
                return a.name.localeCompare(b.name);
            case 'cadastro':
                return new Date(b.registrationDate) - new Date(a.registrationDate);
            case 'compras':
                return b.totalPurchases - a.totalPurchases;
            case 'ultima-compra':
                return new Date(b.lastPurchase) - new Date(a.lastPurchase);
            default:
                return 0;
        }
    });
}

// Limpar filtros
function clearFilters() {
    currentFilters = {
        status: '',
        city: '',
        sort: 'nome',
        search: ''
    };
    
    // Resetar elementos do formulário
    document.getElementById('statusFilter').value = '';
    document.getElementById('cityFilter').value = '';
    document.getElementById('sortFilter').value = 'nome';
    document.querySelector('.search-box input').value = '';
    
    applyFilters();
    AppUtils.showToast('Filtros limpos', 'info');
}

// Renderizar tabela de clientes
function renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;
    
    // Calcular clientes da página atual
    const startIndex = (currentPage - 1) * clientsPerPage;
    const endIndex = startIndex + clientsPerPage;
    const clientsToShow = filteredClients.slice(startIndex, endIndex);
    
    if (clientsToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div style="padding: 2rem; color: var(--gray);">
                        <i class="fas fa-search fa-2x" style="margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>Nenhum cliente encontrado</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    clientsToShow.forEach(client => {
        const row = createClientRow(client);
        tbody.appendChild(row);
    });
    
    // Atualizar paginação
    updatePagination();
}

// Criar linha da tabela de clientes
function createClientRow(client) {
    const row = document.createElement('tr');
    
    const statusClass = getStatusClass(client.status);
    const statusText = getStatusText(client.status);
    
    row.innerHTML = `
        <td>
            <div class="client-info">
                <div class="client-avatar">
                    <img src="images/icons/user.png" alt="${client.name}">
                </div>
                <div class="client-details">
                    <h4>${client.name}</h4>
                    <span>${client.email}</span>
                </div>
            </div>
        </td>
        <td>
            <div class="contact-info">
                <span>${client.phone}</span>
                <small>${client.phoneType}</small>
            </div>
        </td>
        <td>${client.city}, ${client.state}</td>
        <td>${formatDate(client.registrationDate)}</td>
        <td>
            <div class="purchase-info">
                <strong>${AppUtils.formatCurrency(client.totalPurchases)}</strong>
                <small>${client.purchaseCount} compras</small>
            </div>
        </td>
        <td>${formatDate(client.lastPurchase)}</td>
        <td>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </td>
        <td>
            <button class="btn btn-icon btn-primary" title="Ver Perfil" onclick="viewClient(${client.id})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-icon btn-secondary" title="Editar" onclick="editClient(${client.id})">
                <i class="fas fa-edit"></i>
            </button>
            ${client.phoneType === 'WhatsApp' ? `
                <button class="btn btn-icon btn-success" title="WhatsApp" onclick="openWhatsApp('${client.phone}', '${client.name}')">
                    <i class="fab fa-whatsapp"></i>
                </button>
            ` : ''}
            ${client.status === 'inactive' ? `
                <button class="btn btn-icon btn-warning" title="Reativar" onclick="reactivateClient(${client.id})">
                    <i class="fas fa-user-plus"></i>
                </button>
            ` : ''}
        </td>
    `;
    
    return row;
}

// Obter classe do status
function getStatusClass(status) {
    const classes = {
        'vip': 'vip',
        'active': 'active',
        'inactive': 'inactive'
    };
    return classes[status] || 'active';
}

// Obter texto do status
function getStatusText(status) {
    const texts = {
        'vip': 'VIP',
        'active': 'Ativo',
        'inactive': 'Inativo'
    };
    return texts[status] || 'Ativo';
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Atualizar paginação
function updatePagination() {
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
    const paginationInfo = document.querySelector('.pagination-info');
    const pagination = document.querySelector('.pagination');
    
    if (paginationInfo) {
        const startIndex = (currentPage - 1) * clientsPerPage + 1;
        const endIndex = Math.min(currentPage * clientsPerPage, filteredClients.length);
        paginationInfo.textContent = `Mostrando ${startIndex}-${endIndex} de ${filteredClients.length} clientes`;
    }
    
    if (pagination) {
        pagination.innerHTML = '';
        
        // Botão anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => changePage(currentPage - 1));
        pagination.appendChild(prevBtn);
        
        // Páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => changePage(i));
                pagination.appendChild(pageBtn);
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0.5rem';
                pagination.appendChild(ellipsis);
            }
        }
        
        // Botão próximo
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => changePage(currentPage + 1));
        pagination.appendChild(nextBtn);
    }
}

// Mudar página
function changePage(page) {
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderClientsTable();
    }
}

// Inicializar modal
function initializeModal() {
    const modal = document.getElementById('clientModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveClientBtn');
    const addClientBtn = document.getElementById('addClientBtn');
    
    if (addClientBtn) {
        addClientBtn.addEventListener('click', () => openClientModal());
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeClientModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeClientModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeClientModal();
            }
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSaveClient);
    }
}

// Abrir modal de cliente
function openClientModal(clientId = null) {
    const modal = document.getElementById('clientModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (clientId) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            modalTitle.textContent = 'Editar Cliente';
            populateClientForm(client);
        }
    } else {
        modalTitle.textContent = 'Novo Cliente';
        document.getElementById('clientForm').reset();
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de cliente
function closeClientModal() {
    const modal = document.getElementById('clientModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpar formulário
    document.getElementById('clientForm').reset();
}

// Preencher formulário com dados do cliente
function populateClientForm(client) {
    document.getElementById('clientName').value = client.name || '';
    document.getElementById('clientCpf').value = client.cpf || '';
    document.getElementById('clientBirthdate').value = client.birthdate || '';
    document.getElementById('clientGender').value = client.gender || '';
    document.getElementById('clientEmail').value = client.email || '';
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientCep').value = client.cep || '';
    document.getElementById('clientCity').value = client.city || '';
    document.getElementById('clientState').value = client.state || '';
    document.getElementById('clientNeighborhood').value = client.neighborhood || '';
    document.getElementById('clientAddress').value = client.address || '';
    document.getElementById('clientPreference').value = client.preference || '';
    document.getElementById('clientSize').value = client.size || '';
    document.getElementById('clientNotes').value = client.notes || '';
}

// Salvar cliente
function handleSaveClient() {
    const formData = {
        name: document.getElementById('clientName').value,
        cpf: document.getElementById('clientCpf').value,
        birthdate: document.getElementById('clientBirthdate').value,
        gender: document.getElementById('clientGender').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        cep: document.getElementById('clientCep').value,
        city: document.getElementById('clientCity').value,
        state: document.getElementById('clientState').value,
        neighborhood: document.getElementById('clientNeighborhood').value,
        address: document.getElementById('clientAddress').value,
        preference: document.getElementById('clientPreference').value,
        size: document.getElementById('clientSize').value,
        notes: document.getElementById('clientNotes').value
    };
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.phone) {
        AppUtils.showToast('Preencha todos os campos obrigatórios', 'warning');
        return;
    }
    
    // Simular salvamento
    const newClient = {
        id: clients.length + 1,
        ...formData,
        phoneType: 'WhatsApp',
        registrationDate: new Date().toISOString().split('T')[0],
        totalPurchases: 0,
        purchaseCount: 0,
        lastPurchase: null,
        status: 'active'
    };
    
    clients.push(newClient);
    applyFilters();
    updateStats();
    populateCityFilter();
    closeClientModal();
    
    AppUtils.showToast('Cliente salvo com sucesso!', 'success');
}

// Visualizar cliente
function viewClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (client) {
        const details = `
Perfil do Cliente

Nome: ${client.name}
E-mail: ${client.email}
Telefone: ${client.phone}
CPF: ${client.cpf || 'Não informado'}
Data de Nascimento: ${client.birthdate ? formatDate(client.birthdate) : 'Não informado'}
Endereço: ${client.address || 'Não informado'}
Cidade: ${client.city}, ${client.state}
CEP: ${client.cep || 'Não informado'}

Informações de Compras:
Total gasto: ${AppUtils.formatCurrency(client.totalPurchases)}
Número de compras: ${client.purchaseCount}
Última compra: ${client.lastPurchase ? formatDate(client.lastPurchase) : 'Nunca'}
Status: ${getStatusText(client.status)}

Preferências:
Categoria preferida: ${client.preference || 'Não informado'}
Tamanho: ${client.size || 'Não informado'}

Observações: ${client.notes || 'Nenhuma observação'}
        `;
        
        alert(details);
    }
}

// Editar cliente
function editClient(clientId) {
    openClientModal(clientId);
}

// Abrir WhatsApp
function openWhatsApp(phone, name) {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Olá ${name}! Tudo bem? Aqui é da Sabbatini Modas.`;
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Reativar cliente
function reactivateClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (client && confirm(`Deseja reativar o cliente ${client.name}?`)) {
        client.status = 'active';
        applyFilters();
        updateStats();
        AppUtils.showToast(`Cliente ${client.name} reativado!`, 'success');
    }
}

// Exportar funções para uso global
window.ClientsPage = {
    viewClient,
    editClient,
    openWhatsApp,
    reactivateClient
};

// Tornar funções disponíveis globalmente para uso inline
window.viewClient = viewClient;
window.editClient = editClient;
window.openWhatsApp = openWhatsApp;
window.reactivateClient = reactivateClient;

