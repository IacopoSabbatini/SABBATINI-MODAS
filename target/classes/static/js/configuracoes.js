// JavaScript específico para a página de configurações

// Variáveis globais
let currentTab = 'general';
let settings = {
    general: {
        systemLanguage: 'pt-br',
        timezone: 'America/Sao_Paulo',
        dateFormat: 'dd/mm/yyyy',
        currency: 'BRL',
        darkMode: false,
        compactSidebar: false,
        animations: true
    },
    store: {
        storeName: 'Sabbatini Modas',
        storeCnpj: '',
        storePhone: '',
        storeEmail: '',
        storeAddress: '',
        maxDiscount: 20,
        minStock: 5,
        allowZeroStock: false,
        autoStock: true
    },
    notifications: {
        notifyNewSale: true,
        notifySalesGoal: true,
        notifyLowStock: true,
        notifyOutOfStock: true,
        notifyNewClient: false,
        notifyBirthdays: true
    },
    security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactor: false,
        rememberLogin: true
    },
    backup: {
        autoBackup: true,
        backupFrequency: 'daily',
        backupTime: '02:00'
    }
};

// Inicialização da página de configurações
document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsPage();
});

// Função principal de inicialização
function initializeSettingsPage() {
    initializeTabs();
    initializeSettings();
    initializeSaveButton();
    loadSettings();
}

// Inicializar abas
function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
}

// Trocar aba
function switchTab(tabId) {
    // Atualizar aba ativa
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Mostrar conteúdo correspondente
    document.querySelectorAll('.settings-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(`${tabId}-content`).style.display = 'block';
    
    currentTab = tabId;
}

// Inicializar configurações
function initializeSettings() {
    initializeGeneralSettings();
    initializeStoreSettings();
    initializeNotificationSettings();
    initializeSecuritySettings();
    initializeBackupSettings();
    initializeUserManagement();
}

// Configurações gerais
function initializeGeneralSettings() {
    // Listeners para selects
    const systemLanguage = document.getElementById('systemLanguage');
    const timezone = document.getElementById('timezone');
    const dateFormat = document.getElementById('dateFormat');
    const currency = document.getElementById('currency');
    
    if (systemLanguage) {
        systemLanguage.addEventListener('change', function() {
            settings.general.systemLanguage = this.value;
            AppUtils.showToast('Idioma alterado', 'info');
        });
    }
    
    if (timezone) {
        timezone.addEventListener('change', function() {
            settings.general.timezone = this.value;
            AppUtils.showToast('Fuso horário alterado', 'info');
        });
    }
    
    if (dateFormat) {
        dateFormat.addEventListener('change', function() {
            settings.general.dateFormat = this.value;
            AppUtils.showToast('Formato de data alterado', 'info');
        });
    }
    
    if (currency) {
        currency.addEventListener('change', function() {
            settings.general.currency = this.value;
            AppUtils.showToast('Moeda alterada', 'info');
        });
    }
    
    // Listeners para toggles
    const darkMode = document.getElementById('darkMode');
    const compactSidebar = document.getElementById('compactSidebar');
    const animations = document.getElementById('animations');
    
    if (darkMode) {
        darkMode.addEventListener('change', function() {
            settings.general.darkMode = this.checked;
            toggleDarkMode(this.checked);
        });
    }
    
    if (compactSidebar) {
        compactSidebar.addEventListener('change', function() {
            settings.general.compactSidebar = this.checked;
            toggleCompactSidebar(this.checked);
        });
    }
    
    if (animations) {
        animations.addEventListener('change', function() {
            settings.general.animations = this.checked;
            toggleAnimations(this.checked);
        });
    }
}

// Configurações da loja
function initializeStoreSettings() {
    const storeName = document.getElementById('storeName');
    const storeCnpj = document.getElementById('storeCnpj');
    const storePhone = document.getElementById('storePhone');
    const storeEmail = document.getElementById('storeEmail');
    const storeAddress = document.getElementById('storeAddress');
    const maxDiscount = document.getElementById('maxDiscount');
    const minStock = document.getElementById('minStock');
    const allowZeroStock = document.getElementById('allowZeroStock');
    const autoStock = document.getElementById('autoStock');
    
    // Listeners para campos de texto
    [storeName, storeCnpj, storePhone, storeEmail, storeAddress].forEach(field => {
        if (field) {
            field.addEventListener('change', function() {
                const key = this.id.replace('store', '').toLowerCase();
                settings.store[this.id] = this.value;
            });
        }
    });
    
    // Listeners para campos numéricos
    if (maxDiscount) {
        maxDiscount.addEventListener('change', function() {
            settings.store.maxDiscount = parseInt(this.value);
            if (this.value > 100) {
                this.value = 100;
                AppUtils.showToast('Desconto máximo não pode ser superior a 100%', 'warning');
            }
        });
    }
    
    if (minStock) {
        minStock.addEventListener('change', function() {
            settings.store.minStock = parseInt(this.value);
            if (this.value < 1) {
                this.value = 1;
                AppUtils.showToast('Estoque mínimo deve ser pelo menos 1', 'warning');
            }
        });
    }
    
    // Listeners para toggles
    if (allowZeroStock) {
        allowZeroStock.addEventListener('change', function() {
            settings.store.allowZeroStock = this.checked;
        });
    }
    
    if (autoStock) {
        autoStock.addEventListener('change', function() {
            settings.store.autoStock = this.checked;
        });
    }
}

// Configurações de notificações
function initializeNotificationSettings() {
    const notificationToggles = [
        'notifyNewSale',
        'notifySalesGoal',
        'notifyLowStock',
        'notifyOutOfStock',
        'notifyNewClient',
        'notifyBirthdays'
    ];
    
    notificationToggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('change', function() {
                settings.notifications[toggleId] = this.checked;
                AppUtils.showToast('Configuração de notificação atualizada', 'info');
            });
        }
    });
}

// Configurações de segurança
function initializeSecuritySettings() {
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const twoFactor = document.getElementById('twoFactor');
    const rememberLogin = document.getElementById('rememberLogin');
    
    // Botão de alterar senha
    const changePasswordBtn = document.querySelector('.form-section .btn-primary');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', handlePasswordChange);
    }
    
    // Listeners para toggles
    if (twoFactor) {
        twoFactor.addEventListener('change', function() {
            settings.security.twoFactor = this.checked;
            if (this.checked) {
                AppUtils.showToast('Autenticação de dois fatores ativada', 'success');
            } else {
                AppUtils.showToast('Autenticação de dois fatores desativada', 'warning');
            }
        });
    }
    
    if (rememberLogin) {
        rememberLogin.addEventListener('change', function() {
            settings.security.rememberLogin = this.checked;
        });
    }
}

// Configurações de backup
function initializeBackupSettings() {
    const autoBackup = document.getElementById('autoBackup');
    const backupFrequency = document.getElementById('backupFrequency');
    const backupTime = document.getElementById('backupTime');
    
    if (autoBackup) {
        autoBackup.addEventListener('change', function() {
            settings.backup.autoBackup = this.checked;
            toggleBackupOptions(this.checked);
        });
    }
    
    if (backupFrequency) {
        backupFrequency.addEventListener('change', function() {
            settings.backup.backupFrequency = this.value;
        });
    }
    
    if (backupTime) {
        backupTime.addEventListener('change', function() {
            settings.backup.backupTime = this.value;
        });
    }
    
    // Botões de ação
    const backupNowBtn = document.querySelector('.backup-actions .btn-primary');
    const restoreBackupBtn = document.querySelector('.backup-actions .btn-secondary');
    
    if (backupNowBtn) {
        backupNowBtn.addEventListener('click', performBackup);
    }
    
    if (restoreBackupBtn) {
        restoreBackupBtn.addEventListener('click', restoreBackup);
    }
}

// Gerenciamento de usuários
function initializeUserManagement() {
    const addUserBtn = document.getElementById('addUserBtn');
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            AppUtils.showToast('Funcionalidade de adicionar usuário em desenvolvimento', 'info');
        });
    }
}

// Botão salvar todas
function initializeSaveButton() {
    const saveAllBtn = document.getElementById('saveAllBtn');
    
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllSettings);
    }
}

// Carregar configurações
function loadSettings() {
    // Carregar configurações gerais
    document.getElementById('systemLanguage').value = settings.general.systemLanguage;
    document.getElementById('timezone').value = settings.general.timezone;
    document.getElementById('dateFormat').value = settings.general.dateFormat;
    document.getElementById('currency').value = settings.general.currency;
    document.getElementById('darkMode').checked = settings.general.darkMode;
    document.getElementById('compactSidebar').checked = settings.general.compactSidebar;
    document.getElementById('animations').checked = settings.general.animations;
    
    // Carregar configurações da loja
    document.getElementById('storeName').value = settings.store.storeName;
    document.getElementById('maxDiscount').value = settings.store.maxDiscount;
    document.getElementById('minStock').value = settings.store.minStock;
    document.getElementById('allowZeroStock').checked = settings.store.allowZeroStock;
    document.getElementById('autoStock').checked = settings.store.autoStock;
    
    // Carregar configurações de notificações
    Object.keys(settings.notifications).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.checked = settings.notifications[key];
        }
    });
    
    // Carregar configurações de segurança
    document.getElementById('twoFactor').checked = settings.security.twoFactor;
    document.getElementById('rememberLogin').checked = settings.security.rememberLogin;
    
    // Carregar configurações de backup
    document.getElementById('autoBackup').checked = settings.backup.autoBackup;
    document.getElementById('backupFrequency').value = settings.backup.backupFrequency;
    document.getElementById('backupTime').value = settings.backup.backupTime;
    
    toggleBackupOptions(settings.backup.autoBackup);
}

// Alternar modo escuro
function toggleDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        AppUtils.showToast('Modo escuro ativado', 'info');
    } else {
        document.body.classList.remove('dark-mode');
        AppUtils.showToast('Modo escuro desativado', 'info');
    }
}

// Alternar sidebar compacta
function toggleCompactSidebar(enabled) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        if (enabled) {
            sidebar.classList.add('compact');
            AppUtils.showToast('Sidebar compacta ativada', 'info');
        } else {
            sidebar.classList.remove('compact');
            AppUtils.showToast('Sidebar compacta desativada', 'info');
        }
    }
}

// Alternar animações
function toggleAnimations(enabled) {
    if (enabled) {
        document.body.classList.remove('no-animations');
        AppUtils.showToast('Animações ativadas', 'info');
    } else {
        document.body.classList.add('no-animations');
        AppUtils.showToast('Animações desativadas', 'info');
    }
}

// Alternar opções de backup
function toggleBackupOptions(enabled) {
    const backupFrequency = document.getElementById('backupFrequency');
    const backupTime = document.getElementById('backupTime');
    
    if (backupFrequency) {
        backupFrequency.disabled = !enabled;
    }
    
    if (backupTime) {
        backupTime.disabled = !enabled;
    }
}

// Alterar senha
function handlePasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        AppUtils.showToast('Preencha todos os campos de senha', 'warning');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        AppUtils.showToast('A nova senha e a confirmação não coincidem', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        AppUtils.showToast('A nova senha deve ter pelo menos 6 caracteres', 'warning');
        return;
    }
    
    // Simular alteração de senha
    AppUtils.showToast('Senha alterada com sucesso!', 'success');
    
    // Limpar campos
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Realizar backup
function performBackup() {
    AppUtils.showToast('Iniciando backup...', 'info');
    
    // Simular processo de backup
    setTimeout(() => {
        const now = new Date();
        const backupName = `Backup Manual - ${now.toLocaleString('pt-BR')}`;
        const backupSize = `${(Math.random() * 10 + 5).toFixed(1)} MB`;
        
        // Adicionar à lista de backups
        addBackupToHistory(backupName, backupSize);
        
        AppUtils.showToast('Backup realizado com sucesso!', 'success');
    }, 3000);
}

// Restaurar backup
function restoreBackup() {
    if (confirm('Deseja realmente restaurar um backup? Esta ação não pode ser desfeita.')) {
        AppUtils.showToast('Funcionalidade de restauração em desenvolvimento', 'info');
    }
}

// Adicionar backup ao histórico
function addBackupToHistory(name, size) {
    const backupHistory = document.querySelector('.backup-history');
    if (!backupHistory) return;
    
    const backupItem = document.createElement('div');
    backupItem.className = 'backup-item';
    backupItem.innerHTML = `
        <div class="backup-info">
            <h5>${name}</h5>
            <p>${new Date().toLocaleString('pt-BR')}</p>
            <small>Tamanho: ${size}</small>
        </div>
        <div class="backup-actions">
            <button class="btn btn-icon btn-primary" title="Baixar">
                <i class="fas fa-download"></i>
            </button>
            <button class="btn btn-icon btn-secondary" title="Restaurar">
                <i class="fas fa-undo"></i>
            </button>
        </div>
    `;
    
    backupHistory.insertBefore(backupItem, backupHistory.firstChild);
}

// Salvar todas as configurações
function saveAllSettings() {
    AppUtils.showToast('Salvando configurações...', 'info');
    
    // Simular salvamento
    setTimeout(() => {
        // Aqui seria feita a persistência real das configurações
        localStorage.setItem('sabbatini_settings', JSON.stringify(settings));
        
        AppUtils.showToast('Todas as configurações foram salvas!', 'success');
    }, 1000);
}

// Carregar configurações do localStorage
function loadSettingsFromStorage() {
    const savedSettings = localStorage.getItem('sabbatini_settings');
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            settings = { ...settings, ...parsed };
        } catch (e) {
            console.error('Erro ao carregar configurações:', e);
        }
    }
}

// Inicializar configurações do storage
loadSettingsFromStorage();

// Exportar funções para uso global
window.SettingsPage = {
    switchTab,
    saveAllSettings,
    performBackup,
    restoreBackup
};

// Tornar funções disponíveis globalmente para uso inline
window.switchTab = switchTab;
window.saveAllSettings = saveAllSettings;
window.performBackup = performBackup;
window.restoreBackup = restoreBackup;

