package com.ib.syscobros.cash_registers.domain.cash_register;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ib.syscobros.auth.domain.User;
import com.ib.syscobros.sales.domain.store.Store;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "caja")
public class CashRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "caja_id")
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "local_id", foreignKey = @ForeignKey(name = "FK_CAJA_LOCAL"))
    private Store store = new Store();

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne
    @JoinColumn(name = "usuario_apertura_id", foreignKey = @ForeignKey(name = "FK_CAJA_USUARIO_APERTURA"))
    private User openingUser;

    @JsonProperty("openingUserId")
    public int getOpeningUserId() {
        return openingUser.getId();
    }

    @JsonProperty("openingUserName")
    public String getOpeningUserName() {
        return openingUser.getReferenceName();
    }

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne
    @JoinColumn(name = "usuario_cierre_id", foreignKey = @ForeignKey(name = "FK_CAJA_USUARIO_CIERRE"))
    private User closingUser;

    @JsonProperty("closingUserId")
    public Integer getClosingUserId() {
        if (closingUser != null) return closingUser.getId();
        else return null;
    }

    @JsonProperty("closingUserName")
    public String getClosingUserName() {
        if (closingUser != null) return closingUser.getReferenceName();
        else return null;
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(name = "fecha_apertura")
    private LocalDateTime openDateTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(name = "fecha_cierre")
    private LocalDateTime closeDateTime;

    @Column(name = "saldo_apertura", precision = 12, scale = 2)
    private BigDecimal openAmount;

    @Column(name = "saldo_cierre", precision = 12, scale = 2)
    private BigDecimal closeAmount;

    @Column(name = "dinero_retirado_total", precision = 12, scale = 2)
    private BigDecimal totalWithdrawnAmount = BigDecimal.ZERO;

    @Column(name = "dinero_ingresado_total", precision = 12, scale = 2)
    private BigDecimal totalReceivedAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name="estado_auditoria")
    private AuditStatuses auditStatus;




}
