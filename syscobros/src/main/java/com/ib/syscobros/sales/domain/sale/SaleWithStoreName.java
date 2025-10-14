package com.ib.syscobros.sales.domain.sale;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ib.syscobros.auth.domain.User;
import com.ib.syscobros.sales.domain.client.Client;
import com.ib.syscobros.sales.domain.payment_method.PaymentMethod;
import com.ib.syscobros.sales.domain.sale_detail.SaleDetail;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ventas")
public class SaleWithStoreName {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "venta_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", foreignKey = @ForeignKey(name = "FK_VENTAS_CLIENTE"))
    private Client client;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne
    @JoinColumn(name="usuario_id",nullable = false, foreignKey = @ForeignKey(name="FK_VENTA_USUARIO"))
    private User user;

    @JsonProperty("userId")
    public Integer getUserId() {
        if (user != null) return user.getId();
        else return null;
    }

    @JsonProperty("referenceName")
    public String getReferenceName() {
        if (user != null) return user.getReferenceName();
        else return null;
    }
    @ManyToOne
    @JoinColumn(name = "metodo_de_pago_id",nullable = false, foreignKey = @ForeignKey(name = "FK_VENTAS_METODO_PAGO"))
    private PaymentMethod paymentMethod;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(name = "fecha")
    private LocalDateTime dateTime;

    @Column(name = "total",precision = 12, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @OneToMany(mappedBy = "sale",orphanRemoval = true)
    private List<SaleDetail> details = new ArrayList<>();

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Transient
    Long cashRegisterId;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private SaleStatus status = SaleStatus.PENDIENTE;

    @Column(name="nombre")
    String storeName;

}
