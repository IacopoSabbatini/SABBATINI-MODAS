package com.sabbatinimodas.service;

import com.sabbatinimodas.model.User;
import com.sabbatinimodas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service para lógica de negócio de usuários
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Salva um novo usuário
     */
    public User salvar(User user) {
        // Criptografa a senha antes de salvar
        if (user.getSenha() != null) {
            user.setSenha(passwordEncoder.encode(user.getSenha()));
        }
        return userRepository.save(user);
    }
    
    /**
     * Atualiza um usuário existente
     */
    public User atualizar(User user) {
        Optional<User> userExistente = userRepository.findById(user.getId());
        if (userExistente.isPresent()) {
            User userAtual = userExistente.get();
            userAtual.setEmail(user.getEmail());
            userAtual.setNome(user.getNome());
            userAtual.setAtivo(user.getAtivo());
            
            // Só atualiza a senha se foi fornecida uma nova
            if (user.getSenha() != null && !user.getSenha().isEmpty()) {
                userAtual.setSenha(passwordEncoder.encode(user.getSenha()));
            }
            
            return userRepository.save(userAtual);
        }
        throw new RuntimeException("Usuário não encontrado com ID: " + user.getId());
    }
    
    /**
     * Busca usuário por ID
     */
    @Transactional(readOnly = true)
    public Optional<User> buscarPorId(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Busca usuário por email
     */
    @Transactional(readOnly = true)
    public Optional<User> buscarPorEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Lista todos os usuários ativos
     */
    @Transactional(readOnly = true)
    public List<User> listarAtivos() {
        return userRepository.findByAtivoTrue();
    }
    
    /**
     * Lista todos os usuários
     */
    @Transactional(readOnly = true)
    public List<User> listarTodos() {
        return userRepository.findAll();
    }
    
    /**
     * Busca usuários por nome
     */
    @Transactional(readOnly = true)
    public List<User> buscarPorNome(String nome) {
        return userRepository.findByNomeContainingIgnoreCase(nome);
    }
    
    /**
     * Autentica usuário
     */
    @Transactional(readOnly = true)
    public boolean autenticar(String email, String senha) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getAtivo()) {
            return passwordEncoder.matches(senha, user.get().getSenha());
        }
        return false;
    }
    
    /**
     * Verifica se email já existe
     */
    @Transactional(readOnly = true)
    public boolean emailJaExiste(String email) {
        return userRepository.existsByEmail(email);
    }
    
    /**
     * Desativa usuário (soft delete)
     */
    public void desativar(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            user.get().setAtivo(false);
            userRepository.save(user.get());
        } else {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
    }
    
    /**
     * Ativa usuário
     */
    public void ativar(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            user.get().setAtivo(true);
            userRepository.save(user.get());
        } else {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
    }
    
    /**
     * Remove usuário permanentemente
     */
    public void remover(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
    }
    
    /**
     * Conta total de usuários ativos
     */
    @Transactional(readOnly = true)
    public Long contarUsuariosAtivos() {
        return userRepository.countUsuariosAtivos();
    }
}

