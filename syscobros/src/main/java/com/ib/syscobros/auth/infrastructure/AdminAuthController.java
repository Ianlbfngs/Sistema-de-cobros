package com.ib.syscobros.auth.infrastructure;

import com.ib.syscobros.auth.application.AuthService;
import com.ib.syscobros.auth.domain.AuthResponseStatuses;
import com.ib.syscobros.auth.domain.DTO.ChangePasswordRequest;
import com.ib.syscobros.auth.domain.User;
import com.ib.syscobros.response.GenericResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/authentication")
public class AdminAuthController {
    private static final Logger logger = LoggerFactory.getLogger(AdminAuthController.class);

    private final AuthService authService;

    @Autowired
    public AdminAuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> obtainAllUsers(){
        List<User> result = authService.findAllUsers();
        if(result.isEmpty())return ResponseEntity.noContent().build();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtainUserById(@PathVariable int id){
        Optional<User> result = authService.findUserById(id);
        if(result.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(result.get());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @Valid User user){
        try{

            GenericResponse<AuthResponseStatuses.register,User> result = authService.register(user);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case USER_IN_USE -> ResponseEntity.badRequest().body(Map.of("error","El nombre de usuario '"+user.getUsername()+"' esta en uso"));
                case STORE_NOT_FOUND -> ResponseEntity.badRequest().body(Map.of("error","No se encontro el local con id '"+user.getStore().getId()+"'"));
            };
        }catch(Exception e){
            logger.error("Error registering credential of user {}: {}", user.getUsername(), e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }

    }

    @PutMapping("/updatePassword")
    public ResponseEntity<?> changePassword(@RequestBody @Valid ChangePasswordRequest changePasswordRequest){
        try{
            GenericResponse<AuthResponseStatuses.updatePassword,User> result = authService.updatePassword(changePasswordRequest.getUsername(),changePasswordRequest.getPassword());
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.status(404).body(Map.of("error","No existe el usuario: '"+changePasswordRequest.getUsername()+"' "));
            };
        }catch(Exception e){
            logger.error("Error updating the password of user {}: {}", changePasswordRequest.getUsername(), e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<?> softDeleteUser(@PathVariable int id){
        try{
            GenericResponse<AuthResponseStatuses.softDelete,User> result = authService.softDeleteUser(id);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.status(404).body(Map.of("error","No existe el usuario con id '"+id+"' "));
                case ALREADY_SOFT_DELETED -> ResponseEntity.badRequest().body(Map.of("error","El usuario con id '"+id+"' ya esta suspendido"));
            };
        }catch(Exception e){
            logger.error("Error deleting the user with id {}: {}", id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PutMapping("/update/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @RequestBody User user){
        try{
            GenericResponse<AuthResponseStatuses.updateUser,User> result = authService.updateUser(username,user);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.status(404).body(Map.of("error","No existe el usuario: '"+username+"' "));
            };
        }catch(Exception e){
            logger.error("Error updating the user {}: {}", user.getUsername(), e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

}
