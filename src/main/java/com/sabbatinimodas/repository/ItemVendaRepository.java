package com.sabbatinimodas.repository;

import com.sabbatinimodas.model.ItemVenda;
import com.sabbatinimodas.model.Venda;
import com.sabbatinimodas.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository para entidade ItemVenda
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {
    
    /**
     * Busca itens de uma venda específica
     */
    List<ItemVenda> findByVenda(Venda venda);
    
    /**
     * Busca itens por produto
     */
    List<ItemVenda> findByProduto(Produto produto);
    
    /**
     * Busca produtos mais vendidos
     */
    @Query("SELECT iv.produto, SUM(iv.quantidade) as totalVendido FROM ItemVenda iv " +
           "JOIN iv.venda v WHERE v.status = 'concluida' " +
           "GROUP BY iv.produto ORDER BY totalVendido DESC")
    List<Object[]> findProdutosMaisVendidos();
    
    /**
     * Busca produtos mais vendidos em um período
     */
    @Query("SELECT iv.produto, SUM(iv.quantidade) as totalVendido FROM ItemVenda iv " +
           "JOIN iv.venda v WHERE v.status = 'concluida' AND v.dataVenda BETWEEN :dataInicio AND :dataFim " +
           "GROUP BY iv.produto ORDER BY totalVendido DESC")
    List<Object[]> findProdutosMaisVendidosPorPeriodo(@Param("dataInicio") LocalDateTime dataInicio, 
                                                      @Param("dataFim") LocalDateTime dataFim);
    
    /**
     * Calcula quantidade total vendida de um produto
     */
    @Query("SELECT COALESCE(SUM(iv.quantidade), 0) FROM ItemVenda iv " +
           "JOIN iv.venda v WHERE iv.produto = :produto AND v.status = 'concluida'")
    Integer calcularQuantidadeTotalVendida(@Param("produto") Produto produto);
    
    /**
     * Busca itens de vendas em um período
     */
    @Query("SELECT iv FROM ItemVenda iv JOIN iv.venda v WHERE v.dataVenda BETWEEN :dataInicio AND :dataFim ORDER BY v.dataVenda DESC")
    List<ItemVenda> findItensPorPeriodo(@Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);
    
    /**
     * Relatório de vendas por categoria de produto
     */
    @Query("SELECT p.categoria, SUM(iv.quantidade), SUM(iv.subtotal) FROM ItemVenda iv " +
           "JOIN iv.produto p JOIN iv.venda v WHERE v.status = 'concluida' AND p.categoria IS NOT NULL " +
           "GROUP BY p.categoria ORDER BY SUM(iv.subtotal) DESC")
    List<Object[]> relatorioVendasPorCategoria();
    
    /**
     * Busca itens com maior faturamento
     */
    @Query("SELECT iv FROM ItemVenda iv JOIN iv.venda v WHERE v.status = 'concluida' ORDER BY iv.subtotal DESC")
    List<ItemVenda> findItensMaiorFaturamento();
}

