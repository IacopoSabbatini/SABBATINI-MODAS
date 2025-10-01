package com.sabbatinimodas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidade Venda para registro de vendas
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Entity
@Table(name = "venda")
public class Venda {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    
    @Column(name = "data_venda", nullable = false)
    @NotNull(message = "Data da venda é obrigatória")
    private LocalDateTime dataVenda;
    
    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Valor total é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor total deve ser maior que zero")
    private BigDecimal valorTotal;
    
    @Column(name = "desconto", precision = 10, scale = 2)
    @DecimalMin(value = "0.00", message = "Desconto não pode ser negativo")
    private BigDecimal desconto = BigDecimal.ZERO;
    
    @Column(name = "valor_final", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Valor final é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor final deve ser maior que zero")
    private BigDecimal valorFinal;
    
    @Column(name = "forma_pagamento", length = 50)
    private String formaPagamento; // "dinheiro", "cartao_debito", "cartao_credito", "pix"
    
    @Column(name = "status", length = 20)
    private String status = "concluida"; // "pendente", "concluida", "cancelada"
    
    @Column(name = "observacoes", length = 500)
    private String observacoes;
    
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ItemVenda> itens;
    
    // Construtores
    public Venda() {
        this.dataVenda = LocalDateTime.now();
    }
    
    public Venda(Cliente cliente, BigDecimal valorTotal, String formaPagamento) {
        this();
        this.cliente = cliente;
        this.valorTotal = valorTotal;
        this.valorFinal = valorTotal;
        this.formaPagamento = formaPagamento;
    }
    
    // Métodos auxiliares
    public void calcularValorFinal() {
        this.valorFinal = this.valorTotal.subtract(this.desconto != null ? this.desconto : BigDecimal.ZERO);
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Cliente getCliente() {
        return cliente;
    }
    
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    
    public LocalDateTime getDataVenda() {
        return dataVenda;
    }
    
    public void setDataVenda(LocalDateTime dataVenda) {
        this.dataVenda = dataVenda;
    }
    
    public BigDecimal getValorTotal() {
        return valorTotal;
    }
    
    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
    
    public BigDecimal getDesconto() {
        return desconto;
    }
    
    public void setDesconto(BigDecimal desconto) {
        this.desconto = desconto;
        calcularValorFinal();
    }
    
    public BigDecimal getValorFinal() {
        return valorFinal;
    }
    
    public void setValorFinal(BigDecimal valorFinal) {
        this.valorFinal = valorFinal;
    }
    
    public String getFormaPagamento() {
        return formaPagamento;
    }
    
    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getObservacoes() {
        return observacoes;
    }
    
    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
    
    public List<ItemVenda> getItens() {
        return itens;
    }
    
    public void setItens(List<ItemVenda> itens) {
        this.itens = itens;
    }
    
    @Override
    public String toString() {
        return "Venda{" +
                "id=" + id +
                ", cliente=" + (cliente != null ? cliente.getNome() : "N/A") +
                ", dataVenda=" + dataVenda +
                ", valorTotal=" + valorTotal +
                ", valorFinal=" + valorFinal +
                ", formaPagamento='" + formaPagamento + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}

