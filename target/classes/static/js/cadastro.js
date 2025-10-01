// JavaScript para a página de cadastro - Integrado com API REST

// Configuração da API
const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("registerForm");
    const phoneInput = document.getElementById("phone");

    // Máscara para telefone
    if (phoneInput) {
        phoneInput.addEventListener("input", function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                if (value.length < 14) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
            }
            e.target.value = value;
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            handleRegister();
        });
    }

    async function handleRegister() {
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const storeName = document.getElementById("storeName").value;
        const terms = document.getElementById("terms").checked;

        // Validações
        if (!fullName || !email || !phone || !password || !confirmPassword || !storeName) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (!terms) {
            alert("Você deve aceitar os termos de uso.");
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, insira um e-mail válido.");
            return;
        }

        try {
            // Mostra loading
            const submitButton = registerForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Cadastrando...';
            submitButton.disabled = true;

            // Faz requisição para a API
            const response = await fetch(`${API_BASE_URL}/auth/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: fullName,
                    email: email,
                    senha: password
                })
            });

            const data = await response.json();

            if (data.success) {
                alert(`Cadastro realizado com sucesso!\n\nBem-vindo(a), ${fullName}!\n\nRedirecionando para o dashboard...`);
                
                // Salva token e dados do usuário no localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                // Redireciona para o dashboard após 2 segundos
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 2000);
            } else {
                if (response.status === 409) {
                    alert("Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.");
                } else {
                    alert(data.message || "Erro ao realizar cadastro. Tente novamente.");
                }
            }

        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
            alert("Erro de conexão. Verifique se o servidor está funcionando.");
        } finally {
            // Restaura botão
            const submitButton = registerForm.querySelector('button[type="submit"]');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
});

