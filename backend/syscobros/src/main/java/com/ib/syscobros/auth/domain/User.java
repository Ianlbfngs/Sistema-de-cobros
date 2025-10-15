package com.ib.syscobros.auth.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ib.syscobros.sales.domain.store.Store;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "usuarios")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_id")
    int id;

    @ManyToOne
    @JoinColumn(name = "local_id", foreignKey = @ForeignKey(name = "FK_USUARIO_LOCAL"))
    Store store;

    @Column(name = "usuario")
    @Size(max = 45)
    String username="";

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "contraseña")
    @Size(max = 45)
    String password="";

    @Column(name = "nombre")
    @Size(max=100)
    String referenceName= "";

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    UserRole role;

    @JsonIgnore
    @Column(name = "estado")
    boolean status = false;

    @Transient
    private String token;
}
