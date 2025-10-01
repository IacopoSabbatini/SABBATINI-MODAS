package com.sabbatinimodas.repository;

import com.sabbatinimodas.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para entidade Cliente
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    /**
     * Busca clientes ativos
     */
    List<Cliente> findByAtivoTrueOrderByNome();
    
    /**
     * Busca cliente por CPF
     */
    Optional<Cliente> findByCpfAndAtivoTrue(String cpf);
    
    /**
     * Busca cliente por email
     */
    Optional<Cliente> findByEmailAndAtivoTrue(String email);
    
    /**
     * Busca clientes por nome (case insensitive)
     */
    @Query("SELECT c FROM Cliente c WHERE LOWER(c.nome) LIKE LOWER(CONCAT('%', :nome, '%')) AND c.ativo = true ORDER BY c.nome")
    List<Cliente> findByNomeContainingIgnoreCase(@Param("nome") String nome);
    
    /**
     * Busca clientes por cidade
     */
    List<Cliente> findByCidadeAndAtivoTrueOrderByNome(String cidade);
    
    /**
     * Busca clientes por estado
     */
    List<Cliente> findByEstadoAndAtivoTrueOrderByNome(String estado);
    
    /**
     * Busca clientes por telefone
     */
    @Query("SELECT c FROM Cliente c WHERE c.telefone LIKE CONCAT('%', :telefone, '%') AND c.ativo = true ORDER BY c.nome")
    List<Cliente> findByTelefoneContaining(@Param("telefone") String telefone);
    
    /**
     * Verifica se existe cliente com CPF
     */
    boolean existsByCpf(String cpf);
    
    /**
     * Verifica se existe cliente com email
     */
    boolean existsByEmail(String email);
    
    /**
     * Busca todas as cidades distintas
     */
    @Query("SELECT DISTINCT c.cidade FROM Cliente c WHERE c.cidade IS NOT NULL AND c.ativo = true ORDER BY c.cidade")
    List<String> findAllCidades();
    
    /**
     * Busca todos os estados distintos
     */
    @Query("SELECT DISTINCT c.estado FROM Cliente c WHERE c.estado IS NOT NULL AND c.ativo = true ORDER BY c.estado")
    List<String> findAllEstados();
    
    /**
     * Conta total de clientes ativos
     */
    Long countByAtivoTrue();
}

