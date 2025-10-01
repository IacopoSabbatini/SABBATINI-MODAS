// JavaScript para a página de login e cadastro - Integrado com API REST

// Configuração da API
const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector(".login-form");
    const registerLink = document.querySelector(".login-footer a");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            handleLogin();
        });
    }

    if (registerLink) {
        registerLink.addEventListener("click", function(event) {
            event.preventDefault();
            handleRegisterClick();
        });
    }

    async function handleLogin() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validação básica
        if (!email || !password) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            // Mostra loading
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Entrando...';
            submitButton.disabled = true;

            // Faz requisição para a API
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    senha: password
                })
            });

            const data = await response.json();

            if (data.success) {
                // Salva token e dados do usuário no localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                alert("Login realizado com sucesso!");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message || "Erro ao fazer login. Verifique suas credenciais.");
            }

        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert("Erro de conexão. Verifique se o servidor está funcionando.");
        } finally {
            // Restaura botão
            const submitButton = loginForm.querySelector('button[type="submit"]');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    function handleRegisterClick() {
        window.location.href = "cadastro.html";
    }
});

// Função utilitária para verificar se o usuário está logado
function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

// Função utilitária para obter dados do usuário
function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Função utilitária para fazer logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

// Função utilitária para fazer requisições autenticadas
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

