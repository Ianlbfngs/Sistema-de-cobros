package com.ib.syscobros.sales.domain.store;

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
@Table(name = "locales")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "local_id")
    int id;

    @Column(name = "nombre")
    @Size(max = 100, message = "el nombre del local debe tener como maximo 100 caracteres")
    String name ="";

    @Column(name = "direccion")
    @Size(max = 100, message = "la direccion debe tener como maximo 100 caracteres")
    String address ="";

    @JsonIgnore
    @Column(name = "estado")
    boolean status = false;

}
