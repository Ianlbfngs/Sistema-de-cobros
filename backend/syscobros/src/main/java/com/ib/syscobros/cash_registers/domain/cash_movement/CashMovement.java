package com.ib.syscobros.cash_registers.domain.cash_movement;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ib.syscobros.cash_registers.domain.cash_register.CashRegister;
import com.ib.syscobros.sales.domain.sale.Sale;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "movimientos_caja")
public class CashMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movimiento_id")
    private Long id;

    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne
    @JoinColumn(name = "caja_id",foreignKey = @ForeignKey(name = "FK_MOVIMIENTOCAJA_CAJA"))
    private CashRegister cashRegister;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)

    @ManyToOne
    @JoinColumn(name = "referencia_venta_id",foreignKey = @ForeignKey(name = "FK_MOVIMIENTOCAJA_VENTA"))
    private Sale sale;

    @JsonProperty("saleId")
    public Long getSaleId(){
        if(sale != null){
            return sale.getId();
        }else{
            return null;
        }
    }

    @JsonProperty("cashRegisterId")
    public Long getCashRegisterId(){
        return cashRegister.getId();
    }

    @Enumerated(EnumType.STRING)

    @Column(name = "tipo")
    MovementType movementType;

    @Column(name = "monto",precision = 12, scale = 2)
    BigDecimal amount;

    @Size(max = 45)
    @Column(name = "concepto")
    String concept;

    @Column(name = "fecha")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    LocalDateTime date;




}
