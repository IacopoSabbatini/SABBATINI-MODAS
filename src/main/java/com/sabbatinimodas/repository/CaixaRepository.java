package com.sabbatinimodas.repository;

import com.sabbatinimodas.model.Caixa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository para entidade Caixa
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Repository
public interface CaixaRepository extends JpaRepository<Caixa, Long> {
    
    /**
     * Busca movimentações por tipo (entrada ou saída)
     */
    List<Caixa> findByEntradaOuSaidaOrderByDataDesc(String entradaOuSaida);
    
    /**
     * Busca movimentações por período
     */
    List<Caixa> findByDataBetweenOrderByDataDesc(LocalDateTime dataInicio, LocalDateTime dataFim);
    
    /**
     * Busca movimentações por descrição (case insensitive)
     */
    @Query("SELECT c FROM Caixa c WHERE LOWER(c.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')) ORDER BY c.data DESC")
    List<Caixa> findByDescricaoContainingIgnoreCase(@Param("descricao") String descricao);
    
    /**
     * Calcula total de entradas em um período
     */
    @Query("SELECT COALESCE(SUM(c.valor), 0) FROM Caixa c WHERE c.entradaOuSaida = 'entrada' AND c.data BETWEEN :dataInicio AND :dataFim")
    BigDecimal calcularTotalEntradas(@Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);
    
    /**
     * Calcula total de saídas em um período
     */
    @Query("SELECT COALESCE(SUM(c.valor), 0) FROM Caixa c WHERE c.entradaOuSaida = 'saida' AND c.data BETWEEN :dataInicio AND :dataFim")
    BigDecimal calcularTotalSaidas(@Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);
    
    /**
     * Busca último saldo registrado
     */
    @Query("SELECT c FROM Caixa c ORDER BY c.data DESC LIMIT 1")
    Caixa findUltimoSaldo();
    
    /**
     * Busca todas as movimentações ordenadas por data (mais recente primeiro)
     */
    List<Caixa> findAllByOrderByDataDesc();
    
    /**
     * Conta total de movimentações por tipo
     */
    Long countByEntradaOuSaida(String entradaOuSaida);
}

