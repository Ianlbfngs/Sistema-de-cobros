package com.ib.syscobros.sales.domain.payment_method;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "metodos_de_pago")
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "metodo_pago_id")
    int id;
    @Column(name = "tipo")
    @Size(max = 25, message = "el metodo de pago debe tener como maximo 25 caracteres")
    String method;

}
