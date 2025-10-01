package com.sabbatinimodas.service;

import com.sabbatinimodas.model.Produto;
import com.sabbatinimodas.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service para lógica de negócio de produtos
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Service
@Transactional
public class ProdutoService {
    
    @Autowired
    private ProdutoRepository produtoRepository;
    
    /**
     * Salva um novo produto
     */
    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }
    
    /**
     * Atualiza um produto existente
     */
    public Produto atualizar(Produto produto) {
        Optional<Produto> produtoExistente = produtoRepository.findById(produto.getId());
        if (produtoExistente.isPresent()) {
            return produtoRepository.save(produto);
        }
        throw new RuntimeException("Produto não encontrado com ID: " + produto.getId());
    }
    
    /**
     * Busca produto por ID
     */
    @Transactional(readOnly = true)
    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }
    
    /**
     * Lista todos os produtos ativos
     */
    @Transactional(readOnly = true)
    public List<Produto> listarAtivos() {
        return produtoRepository.findByAtivoTrueOrderByNome();
    }
    
    /**
     * Lista todos os produtos
     */
    @Transactional(readOnly = true)
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }
    
    /**
     * Busca produtos por nome
     */
    @Transactional(readOnly = true)
    public List<Produto> buscarPorNome(String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome);
    }
    
    /**
     * Busca produtos por categoria
     */
    @Transactional(readOnly = true)
    public List<Produto> buscarPorCategoria(String categoria) {
        return produtoRepository.findByCategoriaAndAtivoTrueOrderByNome(categoria);
    }
    
    /**
     * Busca produtos por marca
     */
    @Transactional(readOnly = true)
    public List<Produto> buscarPorMarca(String marca) {
        return produtoRepository.findByMarcaAndAtivoTrueOrderByNome(marca);
    }
    
    /**
     * Busca produtos com estoque baixo
     */
    @Transactional(readOnly = true)
    public List<Produto> buscarProdutosComEstoqueBaixo() {
        return produtoRepository.findProdutosComEstoqueBaixo();
    }
    
    /**
     * Busca produtos por faixa de preço
     */
    @Transactional(readOnly = true)
    public List<Produto> buscarPorFaixaPreco(BigDecimal precoMin, BigDecimal precoMax) {
        return produtoRepository.findByPrecoRange(precoMin, precoMax);
    }
    
    /**
     * Busca produto por código de barras
     */
    @Transactional(readOnly = true)
    public Optional<Produto> buscarPorCodigoBarras(String codigoBarras) {
        return produtoRepository.findByCodigoBarrasAndAtivoTrue(codigoBarras);
    }
    
    /**
     * Lista todas as categorias
     */
    @Transactional(readOnly = true)
    public List<String> listarCategorias() {
        return produtoRepository.findAllCategorias();
    }
    
    /**
     * Lista todas as marcas
     */
    @Transactional(readOnly = true)
    public List<String> listarMarcas() {
        return produtoRepository.findAllMarcas();
    }
    
    /**
     * Atualiza estoque do produto
     */
    public void atualizarEstoque(Long produtoId, Integer novaQuantidade) {
        Optional<Produto> produtoOpt = produtoRepository.findById(produtoId);
        if (produtoOpt.isPresent()) {
            Produto produto = produtoOpt.get();
            produto.setQuantidadeEstoque(novaQuantidade);
            produtoRepository.save(produto);
        } else {
            throw new RuntimeException("Produto não encontrado com ID: " + produtoId);
        }
    }
    
    /**
     * Reduz estoque do produto (para vendas)
     */
    public void reduzirEstoque(Long produtoId, Integer quantidade) {
        Optional<Produto> produtoOpt = produtoRepository.findById(produtoId);
        if (produtoOpt.isPresent()) {
            Produto produto = produtoOpt.get();
            int novaQuantidade = produto.getQuantidadeEstoque() - quantidade;
            if (novaQuantidade < 0) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }
            produto.setQuantidadeEstoque(novaQuantidade);
            produtoRepository.save(produto);
        } else {
            throw new RuntimeException("Produto não encontrado com ID: " + produtoId);
        }
    }
    
    /**
     * Desativa produto (soft delete)
     */
    public void desativar(Long id) {
        Optional<Produto> produto = produtoRepository.findById(id);
        if (produto.isPresent()) {
            produto.get().setAtivo(false);
            produtoRepository.save(produto.get());
        } else {
            throw new RuntimeException("Produto não encontrado com ID: " + id);
        }
    }
    
    /**
     * Ativa produto
     */
    public void ativar(Long id) {
        Optional<Produto> produto = produtoRepository.findById(id);
        if (produto.isPresent()) {
            produto.get().setAtivo(true);
            produtoRepository.save(produto.get());
        } else {
            throw new RuntimeException("Produto não encontrado com ID: " + id);
        }
    }
    
    /**
     * Remove produto permanentemente
     */
    public void remover(Long id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
        } else {
            throw new RuntimeException("Produto não encontrado com ID: " + id);
        }
    }
    
    /**
     * Conta total de produtos ativos
     */
    @Transactional(readOnly = true)
    public Long contarProdutosAtivos() {
        return produtoRepository.countByAtivoTrue();
    }
    
    /**
     * Calcula valor total do estoque
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularValorTotalEstoque() {
        return produtoRepository.calcularValorTotalEstoque();
    }
}

