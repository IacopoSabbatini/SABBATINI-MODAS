package com.sabbatinimodas.repository;

import com.sabbatinimodas.model.Venda;
import com.sabbatinimodas.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository para entidade Venda
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    
    /**
     * Busca vendas por cliente
     */
    List<Venda> findByClienteOrderByDataVendaDesc(Cliente cliente);
    
    /**
     * Busca vendas por período
     */
    List<Venda> findByDataVendaBetweenOrderByDataVendaDesc(LocalDateTime dataInicio, LocalDateTime dataFim);
    
    /**
     * Busca vendas por status
     */
    List<Venda> findByStatusOrderByDataVendaDesc(String status);
    
    /**
     * Busca vendas por forma de pagamento
     */
    List<Venda> findByFormaPagamentoOrderByDataVendaDesc(String formaPagamento);
    
    /**
     * Busca vendas do dia atual
     */
    @Query("SELECT v FROM Venda v WHERE DATE(v.dataVenda) = CURRENT_DATE ORDER BY v.dataVenda DESC")
    List<Venda> findVendasDoDia();
    
    /**
     * Calcula total de vendas em um período
     */
    @Query("SELECT COALESCE(SUM(v.valorFinal), 0) FROM Venda v WHERE v.dataVenda BETWEEN :dataInicio AND :dataFim AND v.status = 'concluida'")
    BigDecimal calcularTotalVendas(@Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);
    
    /**
     * Calcula total de vendas do dia
     */
    @Query("SELECT COALESCE(SUM(v.valorFinal), 0) FROM Venda v WHERE DATE(v.dataVenda) = CURRENT_DATE AND v.status = 'concluida'")
    BigDecimal calcularTotalVendasDoDia();
    
    /**
     * Conta vendas por status
     */
    Long countByStatus(String status);
    
    /**
     * Busca vendas com valor acima de um limite
     */
    @Query("SELECT v FROM Venda v WHERE v.valorFinal >= :valorMinimo ORDER BY v.valorFinal DESC")
    List<Venda> findVendasAcimaDeValor(@Param("valorMinimo") BigDecimal valorMinimo);
    
    /**
     * Busca top clientes por valor de compras
     */
    @Query("SELECT v.cliente, SUM(v.valorFinal) as total FROM Venda v WHERE v.status = 'concluida' GROUP BY v.cliente ORDER BY total DESC")
    List<Object[]> findTopClientesPorValor();
    
    /**
     * Relatório de vendas por forma de pagamento
     */
    @Query("SELECT v.formaPagamento, COUNT(v), SUM(v.valorFinal) FROM Venda v WHERE v.status = 'concluida' GROUP BY v.formaPagamento ORDER BY SUM(v.valorFinal) DESC")
    List<Object[]> relatorioVendasPorFormaPagamento();
    
    /**
     * Busca todas as vendas ordenadas por data (mais recente primeiro)
     */
    List<Venda> findAllByOrderByDataVendaDesc();
}

