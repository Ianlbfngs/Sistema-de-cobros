package com.ib.syscobros.sales.infrastructure.private_controllers;

import com.ib.syscobros.sales.application.ClientService;
import com.ib.syscobros.sales.domain.client.Client;
import com.ib.syscobros.sales.domain.client.ClientResponseStatuses;
import com.ib.syscobros.response.GenericResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/clients")
public class PrivateClientController {
    private static final Logger logger = LoggerFactory.getLogger(PrivateClientController.class);

    private final ClientService clientService;

    @Autowired
    public PrivateClientController(ClientService clientService){
        this.clientService = clientService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> obtainAllClients () {
        List<Client> result = clientService.findAll();
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtainClient (@PathVariable int id) {
        try{
            Optional<Client> result = clientService.findClientById(id);
            if(result.isEmpty()) return ResponseEntity.notFound().build();
            else return ResponseEntity.ok(result.get());
        }catch(Exception e){
            logger.error("Error obtaining the client with id {}: {}", id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addClient (@RequestBody Client client) {
        try{
            Client result = clientService.addClient(client);
            return ResponseEntity.ok(result);
        }catch (NumberFormatException e) {
            logger.error("Error adding the client: {}", e.getMessage(),e);
            return ResponseEntity.badRequest().body("Format error: "+e.getMessage());
        }catch(Exception e){
            logger.error("Error adding the client: {}", e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateClient (@PathVariable int id,@RequestBody Client client) {
        try{
            GenericResponse<ClientResponseStatuses.update, Client> result = clientService.updateClient(id,client);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
            };
        }catch (NumberFormatException e) {
            logger.error("Error adding the client: {}", e.getMessage(),e);
            return ResponseEntity.badRequest().body("Format error: "+e.getMessage());
        }catch(Exception e){
            logger.error("Error updating the client with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<?> softDeleteClient (@PathVariable int id) {
        try{
            GenericResponse<ClientResponseStatuses.softDelete,Client> result = clientService.softDeleteClient(id);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case ALREADY_SOFT_DELETED -> ResponseEntity.badRequest().body(Map.of("error","El cliente ya se encuentra suspendido"));
            };
        }catch(Exception e){
            logger.error("Error soft deleting the client with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> hardDeleteClient (@PathVariable int id) {
        try{
            GenericResponse<ClientResponseStatuses.hardDelete,Client> result = clientService.hardDeleteClient(id);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case CLIENT_IS_BEING_REFERENCED -> ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","El cliente esta siendo referenciado por otra tabla en la base de datos"));
            };
        }catch(Exception e){
            logger.error("Error hard deleting the client with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }


}

