package com.ib.syscobros.products.domain.supplier;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "proveedores")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proveedor_id")
    int id;

    @Column(name = "razon_social")
    @Size(max = 100, message = "la razon social debe tener como maximo 100 caracteres")
    String companyName = "";

    @Column(name = "cuit")
    @Size(min = 11,max = 11, message = "el tamaño del cuit debe ser de 11 caracteres")
    String cuit = "00000000000";

    @Column(name = "telefono")
    @Size(max = 15, message = "el telefono debe tener como maximo 15 digitos")
    String phoneNumber ="";

    @Column(name = "email")
    @Size(max = 100, message = "el correo debe tener como maximo 100 caracteres")
    @Email
    String email ="";

    @Column(name = "direccion")
    @Size(max = 100, message = "la direccion debe tener como maximo 100 caracteres")
    String address ="";

    @JsonIgnore
    @Column(name = "estado")
    boolean status = false;

}
