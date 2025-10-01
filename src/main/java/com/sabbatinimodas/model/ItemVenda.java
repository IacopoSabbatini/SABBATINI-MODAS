package com.sabbatinimodas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

/**
 * Entidade ItemVenda para itens de uma venda
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Entity
@Table(name = "item_venda")
public class ItemVenda {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venda_id", nullable = false)
    @NotNull(message = "Venda é obrigatória")
    private Venda venda;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    @NotNull(message = "Produto é obrigatório")
    private Produto produto;
    
    @Column(name = "quantidade", nullable = false)
    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    private Integer quantidade;
    
    @Column(name = "preco_unitario", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Preço unitário é obrigatório")
    @DecimalMin(value = "0.01", message = "Preço unitário deve ser maior que zero")
    private BigDecimal precoUnitario;
    
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Subtotal é obrigatório")
    @DecimalMin(value = "0.01", message = "Subtotal deve ser maior que zero")
    private BigDecimal subtotal;
    
    @Column(name = "desconto_item", precision = 10, scale = 2)
    @DecimalMin(value = "0.00", message = "Desconto não pode ser negativo")
    private BigDecimal descontoItem = BigDecimal.ZERO;
    
    // Construtores
    public ItemVenda() {}
    
    public ItemVenda(Venda venda, Produto produto, Integer quantidade, BigDecimal precoUnitario) {
        this.venda = venda;
        this.produto = produto;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
        calcularSubtotal();
    }
    
    // Métodos auxiliares
    public void calcularSubtotal() {
        if (quantidade != null && precoUnitario != null) {
            BigDecimal subtotalBruto = precoUnitario.multiply(BigDecimal.valueOf(quantidade));
            this.subtotal = subtotalBruto.subtract(descontoItem != null ? descontoItem : BigDecimal.ZERO);
        }
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Venda getVenda() {
        return venda;
    }
    
    public void setVenda(Venda venda) {
        this.venda = venda;
    }
    
    public Produto getProduto() {
        return produto;
    }
    
    public void setProduto(Produto produto) {
        this.produto = produto;
    }
    
    public Integer getQuantidade() {
        return quantidade;
    }
    
    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
        calcularSubtotal();
    }
    
    public BigDecimal getPrecoUnitario() {
        return precoUnitario;
    }
    
    public void setPrecoUnitario(BigDecimal precoUnitario) {
        this.precoUnitario = precoUnitario;
        calcularSubtotal();
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getDescontoItem() {
        return descontoItem;
    }
    
    public void setDescontoItem(BigDecimal descontoItem) {
        this.descontoItem = descontoItem;
        calcularSubtotal();
    }
    
    @Override
    public String toString() {
        return "ItemVenda{" +
                "id=" + id +
                ", produto=" + (produto != null ? produto.getNome() : "N/A") +
                ", quantidade=" + quantidade +
                ", precoUnitario=" + precoUnitario +
                ", subtotal=" + subtotal +
                '}';
    }
}

