package com.ib.syscobros.auth.domain.DTO;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChangePasswordRequest {
    @NotNull
    @NotEmpty
    @Size(min = 1, max = 45, message = "el usuario debe tener entre 1 y 45 caracteres")
    private String username;
    @NotNull
    @NotEmpty
    @Size(min = 1, max = 45, message = "la contraseña debe tener entre 1 y 45 caracteres")
    private String password;
}
