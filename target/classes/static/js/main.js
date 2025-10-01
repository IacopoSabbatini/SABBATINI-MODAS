// JavaScript principal para o sistema da loja de roupas

// Variáveis globais
let sidebar = null;
let menuToggle = null;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    initializeSidebar();
    initializeNotifications();
    initializeUserMenu();
    initializeSearch();
    initializeTooltips();
    initializeAnimations();
}

// Inicialização do sidebar
function initializeSidebar() {
    sidebar = document.getElementById('sidebar');
    menuToggle = document.getElementById('menuToggle');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', toggleSidebar);
        
        // Fechar sidebar ao clicar fora (apenas em mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    closeSidebar();
                }
            }
        });
        
        // Ajustar sidebar no redimensionamento da janela
        window.addEventListener('resize', handleWindowResize);
    }
}

// Toggle do sidebar
function toggleSidebar() {
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Fechar sidebar
function closeSidebar() {
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}

// Lidar com redimensionamento da janela
function handleWindowResize() {
    if (window.innerWidth > 992) {
        closeSidebar();
    }
}

// Inicialização das notificações
function initializeNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotificationDropdown();
        });
    }
}

// Mostrar dropdown de notificações
function showNotificationDropdown() {
    // Simular dropdown de notificações
    const notifications = [
        {
            icon: 'fas fa-shopping-cart',
            message: 'Nova venda realizada',
            time: 'há 5 minutos',
            type: 'success'
        },
        {
            icon: 'fas fa-exclamation-triangle',
            message: 'Estoque baixo detectado',
            time: 'há 1 hora',
            type: 'warning'
        },
        {
            icon: 'fas fa-user-plus',
            message: 'Novo cliente cadastrado',
            time: 'há 2 horas',
            type: 'info'
        }
    ];
    
    showToast('Você tem ' + notifications.length + ' notificações não lidas', 'info');
}

// Inicialização do menu do usuário
function initializeUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    
    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            e.preventDefault();
            showUserDropdown();
        });
    }
}

// Mostrar dropdown do usuário
function showUserDropdown() {
    const options = [
        { icon: 'fas fa-user', text: 'Meu Perfil', action: () => showToast('Perfil do usuário', 'info') },
        { icon: 'fas fa-cog', text: 'Configurações', action: () => showToast('Configurações', 'info') },
        { icon: 'fas fa-sign-out-alt', text: 'Sair', action: () => logout() }
    ];
    
    // Por enquanto, apenas mostrar toast
    showToast('Menu do usuário', 'info');
}

// Função de logout
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        showToast('Saindo do sistema...', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Inicialização da busca
function initializeSearch() {
    const searchInputs = document.querySelectorAll('.search-box input');
    
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
        
        // Busca em tempo real (debounced)
        let searchTimeout;
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length >= 3) {
                    performLiveSearch(this.value);
                }
            }, 500);
        });
    });
    
    const searchButtons = document.querySelectorAll('.search-box button');
    searchButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.parentElement.querySelector('input');
            performSearch(input.value);
        });
    });
}

// Executar busca
function performSearch(query) {
    if (query.trim()) {
        showToast(`Buscando por: ${query}`, 'info');
        // Aqui seria implementada a lógica de busca real
    }
}

// Busca em tempo real
function performLiveSearch(query) {
    // Implementar busca em tempo real
    console.log('Live search:', query);
}

// Inicialização de tooltips
function initializeTooltips() {
    const elementsWithTooltip = document.querySelectorAll('[title]');
    
    elementsWithTooltip.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Mostrar tooltip
function showTooltip(e) {
    const element = e.target;
    const title = element.getAttribute('title');
    
    if (title) {
        element.setAttribute('data-original-title', title);
        element.removeAttribute('title');
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = title;
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '0.5rem';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '0.875rem';
        tooltip.style.zIndex = '9999';
        tooltip.style.pointerEvents = 'none';
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
        
        element.tooltipElement = tooltip;
    }
}

// Esconder tooltip
function hideTooltip(e) {
    const element = e.target;
    
    if (element.tooltipElement) {
        document.body.removeChild(element.tooltipElement);
        element.tooltipElement = null;
    }
    
    if (element.getAttribute('data-original-title')) {
        element.setAttribute('title', element.getAttribute('data-original-title'));
        element.removeAttribute('data-original-title');
    }
}

// Inicialização de animações
function initializeAnimations() {
    // Animação de entrada para elementos
    const animatedElements = document.querySelectorAll('.card, .stat-card, .product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Sistema de Toast/Notificações
function showToast(message, type = 'info', duration = 3000) {
    // Remover toast existente
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos do toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getToastColor(type),
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        minWidth: '300px',
        maxWidth: '500px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    const toastContent = toast.querySelector('.toast-content');
    Object.assign(toastContent.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flex: '1'
    });
    
    const closeBtn = toast.querySelector('.toast-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '0.25rem',
        borderRadius: '4px',
        opacity: '0.7',
        transition: 'opacity 0.2s ease'
    });
    
    closeBtn.addEventListener('click', () => removeToast(toast));
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
    
    document.body.appendChild(toast);
    
    // Animação de entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

// Obter cor do toast baseada no tipo
function getToastColor(type) {
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#4a6da7'
    };
    return colors[type] || colors.info;
}

// Remover toast
function removeToast(toast) {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Utilitários de formatação
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Validação de formulários
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo é obrigatório');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

// Mostrar erro no campo
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
}

// Limpar erro do campo
function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Loading state
function showLoading(element, text = 'Carregando...') {
    element.classList.add('loading');
    element.setAttribute('data-original-text', element.textContent);
    element.textContent = text;
    element.disabled = true;
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.textContent = element.getAttribute('data-original-text') || 'Salvar';
    element.disabled = false;
    element.removeAttribute('data-original-text');
}

// Confirmação de ações
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Exportar funções para uso global
window.AppUtils = {
    showToast,
    formatCurrency,
    formatDate,
    formatDateTime,
    validateForm,
    showLoading,
    hideLoading,
    confirmAction,
    debounce,
    throttle
};

