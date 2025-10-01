package com.sabbatinimodas.service;

import com.sabbatinimodas.model.Cliente;
import com.sabbatinimodas.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service para lógica de negócio de clientes
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Service
@Transactional
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    /**
     * Salva um novo cliente
     */
    public Cliente salvar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
    
    /**
     * Atualiza um cliente existente
     */
    public Cliente atualizar(Cliente cliente) {
        Optional<Cliente> clienteExistente = clienteRepository.findById(cliente.getId());
        if (clienteExistente.isPresent()) {
            return clienteRepository.save(cliente);
        }
        throw new RuntimeException("Cliente não encontrado com ID: " + cliente.getId());
    }
    
    /**
     * Busca cliente por ID
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }
    
    /**
     * Lista todos os clientes ativos
     */
    @Transactional(readOnly = true)
    public List<Cliente> listarAtivos() {
        return clienteRepository.findByAtivoTrueOrderByNome();
    }
    
    /**
     * Lista todos os clientes
     */
    @Transactional(readOnly = true)
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }
    
    /**
     * Busca clientes por nome
     */
    @Transactional(readOnly = true)
    public List<Cliente> buscarPorNome(String nome) {
        return clienteRepository.findByNomeContainingIgnoreCase(nome);
    }
    
    /**
     * Busca cliente por CPF
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorCpf(String cpf) {
        return clienteRepository.findByCpfAndAtivoTrue(cpf);
    }
    
    /**
     * Busca cliente por email
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorEmail(String email) {
        return clienteRepository.findByEmailAndAtivoTrue(email);
    }
    
    /**
     * Verifica se CPF já existe
     */
    @Transactional(readOnly = true)
    public boolean cpfJaExiste(String cpf) {
        return clienteRepository.existsByCpf(cpf);
    }
    
    /**
     * Verifica se email já existe
     */
    @Transactional(readOnly = true)
    public boolean emailJaExiste(String email) {
        return clienteRepository.existsByEmail(email);
    }
    
    /**
     * Desativa cliente (soft delete)
     */
    public void desativar(Long id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent()) {
            cliente.get().setAtivo(false);
            clienteRepository.save(cliente.get());
        } else {
            throw new RuntimeException("Cliente não encontrado com ID: " + id);
        }
    }
    
    /**
     * Ativa cliente
     */
    public void ativar(Long id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent()) {
            cliente.get().setAtivo(true);
            clienteRepository.save(cliente.get());
        } else {
            throw new RuntimeException("Cliente não encontrado com ID: " + id);
        }
    }
    
    /**
     * Remove cliente permanentemente
     */
    public void remover(Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Cliente não encontrado com ID: " + id);
        }
    }
    
    /**
     * Conta total de clientes ativos
     */
    @Transactional(readOnly = true)
    public Long contarClientesAtivos() {
        return clienteRepository.countByAtivoTrue();
    }
}

