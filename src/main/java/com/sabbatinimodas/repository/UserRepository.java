package com.sabbatinimodas.repository;

import com.sabbatinimodas.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para entidade User
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Busca usuário por email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Verifica se existe usuário com o email informado
     */
    boolean existsByEmail(String email);
    
    /**
     * Busca usuários ativos
     */
    List<User> findByAtivoTrue();
    
    /**
     * Busca usuários por nome (case insensitive)
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<User> findByNomeContainingIgnoreCase(@Param("nome") String nome);
    
    /**
     * Busca usuário por email e senha (para autenticação)
     */
    Optional<User> findByEmailAndSenha(String email, String senha);
    
    /**
     * Conta total de usuários ativos
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.ativo = true")
    Long countUsuariosAtivos();
}

