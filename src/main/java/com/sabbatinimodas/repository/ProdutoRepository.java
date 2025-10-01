package com.sabbatinimodas.repository;

import com.sabbatinimodas.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Repository para entidade Produto
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    /**
     * Busca produtos ativos
     */
    List<Produto> findByAtivoTrueOrderByNome();
    
    /**
     * Busca produtos por nome (case insensitive)
     */
    @Query("SELECT p FROM Produto p WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%')) AND p.ativo = true ORDER BY p.nome")
    List<Produto> findByNomeContainingIgnoreCase(@Param("nome") String nome);
    
    /**
     * Busca produtos por categoria
     */
    List<Produto> findByCategoriaAndAtivoTrueOrderByNome(String categoria);
    
    /**
     * Busca produtos por marca
     */
    List<Produto> findByMarcaAndAtivoTrueOrderByNome(String marca);
    
    /**
     * Busca produtos com estoque baixo
     */
    @Query("SELECT p FROM Produto p WHERE p.quantidadeEstoque <= p.estoqueMinimo AND p.ativo = true ORDER BY p.quantidadeEstoque")
    List<Produto> findProdutosComEstoqueBaixo();
    
    /**
     * Busca produtos por faixa de preço
     */
    @Query("SELECT p FROM Produto p WHERE p.preco BETWEEN :precoMin AND :precoMax AND p.ativo = true ORDER BY p.preco")
    List<Produto> findByPrecoRange(@Param("precoMin") BigDecimal precoMin, @Param("precoMax") BigDecimal precoMax);
    
    /**
     * Busca produto por código de barras
     */
    Optional<Produto> findByCodigoBarrasAndAtivoTrue(String codigoBarras);
    
    /**
     * Busca todas as categorias distintas
     */
    @Query("SELECT DISTINCT p.categoria FROM Produto p WHERE p.categoria IS NOT NULL AND p.ativo = true ORDER BY p.categoria")
    List<String> findAllCategorias();
    
    /**
     * Busca todas as marcas distintas
     */
    @Query("SELECT DISTINCT p.marca FROM Produto p WHERE p.marca IS NOT NULL AND p.ativo = true ORDER BY p.marca")
    List<String> findAllMarcas();
    
    /**
     * Conta total de produtos ativos
     */
    Long countByAtivoTrue();
    
    /**
     * Calcula valor total do estoque
     */
    @Query("SELECT COALESCE(SUM(p.preco * p.quantidadeEstoque), 0) FROM Produto p WHERE p.ativo = true")
    BigDecimal calcularValorTotalEstoque();
}

