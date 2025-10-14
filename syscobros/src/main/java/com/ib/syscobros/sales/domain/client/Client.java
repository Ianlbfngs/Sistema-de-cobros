package com.ib.syscobros.sales.domain.client;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "clientes")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cliente_id")
    int id;

    @Column(name = "nombre")
    @Size(max = 45, message = "el nombre debe tener como maximo 45 caracteres")
    String name = "";

    @Column(name = "apellido")
    @Size(max = 45, message = "el apellido debe tener como maximo 45 caracteres")
    String surname ="";

    @Column(name = "telefono")
    @Size(max = 45, message = "el numero de telefono debe tener como maximo 15 digitos")
    String phoneNumber ="";

    @Column(name = "email")
    @Size(max = 100, message = "el correo debe tener como maximo 100 caracteres")
    String email ="";

    @Column(name = "direccion")
    @Size(max = 100, message = "el direccion debe tener como maximo 100 caracteres")
    String address ="";

    @JsonIgnore
    @Column(name = "estado")
    boolean status = false;

}
