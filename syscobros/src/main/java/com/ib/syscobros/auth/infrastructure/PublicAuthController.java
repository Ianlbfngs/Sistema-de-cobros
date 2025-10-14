package com.ib.syscobros.auth.infrastructure;

import com.ib.syscobros.auth.application.AuthService;
import com.ib.syscobros.auth.domain.User;
import com.ib.syscobros.response.GenericResponse;
import com.ib.syscobros.auth.domain.AuthResponseStatuses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/public/authentication")
public class PublicAuthController {
    private static final Logger logger = LoggerFactory.getLogger(PublicAuthController.class);

    private final AuthService authService;
    @Autowired
    public PublicAuthController(AuthService authService){
        this.authService=authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user){
        try{
            GenericResponse<AuthResponseStatuses.login,User> result = authService.login(user);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case USER_SUSPENDED -> ResponseEntity.badRequest().body(Map.of("error","El usuario esta suspendido"));
                case DENIED -> ResponseEntity.status(401).body(Map.of("error","Usuario o contraseña incorrectos"));
            };
        }catch(Exception e){
            logger.error("Error verifying the credentials of {}: {}",user.getUsername(), e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }

    }

}
