package com.ib.syscobros.sales.domain.sale_detail;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ib.syscobros.products.domain.product.Product;
import com.ib.syscobros.sales.domain.sale.Sale;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "detalles_de_venta")
public class SaleDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detalle_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venta_id", nullable = false, foreignKey = @ForeignKey(name = "FK_DETALLE_VENTA"))
    @JsonIgnore
    private Sale sale;

    @JsonProperty("saleId")
    public Long getSaleId(){
        return sale.getId();
    }

    @ManyToOne
    @JoinColumn(name = "producto_codigo", nullable = false,  foreignKey = @ForeignKey(name = "FK_DETALLE_PRODUCTO"))
    private Product product;

    @Column(name = "cantidad",precision = 10, scale = 3)
    private BigDecimal amount = BigDecimal.ZERO;

    @Column(name = "subtotal",precision = 12, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;
}
