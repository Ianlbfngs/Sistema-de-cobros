package com.ib.syscobros.products.domain.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ib.syscobros.products.domain.supplier.Supplier;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "productos")
public class Product {
    @Id
    @Column(name = "producto_codigo")
    @Size(min = 1, max = 8, message = "el codigo debe tener entre 1 y 8 caracteres")
    String productCode;

    @ManyToOne
    @JoinColumn(name = "proveedor_id", foreignKey = @ForeignKey(name = "FK_PRODUCTOS_PROVEEDOR_ID"))
    Supplier supplier;

    @Column(name = "nombre")
    @Size(max = 45,message = "el nombre debe tener como maximo 45 caracteres")
    String name="";

    @Column(name = "precio_unitario", precision = 12, scale = 2)
    BigDecimal price = BigDecimal.ZERO;

    @Column(name="descripcion")
    @Size(max = 100, message = "la descripcion debe tener como maximo 100 caracteres")
    String description ="";

    @JsonIgnore
    @Column(name = "estado")
    boolean status = false;

}
