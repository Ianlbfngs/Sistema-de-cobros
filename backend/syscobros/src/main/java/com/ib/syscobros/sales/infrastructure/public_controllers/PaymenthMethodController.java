package com.ib.syscobros.sales.infrastructure.public_controllers;

import com.ib.syscobros.sales.application.PaymentMethodService;
import com.ib.syscobros.sales.domain.payment_method.PaymentMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/paymentMethods")
public class PaymenthMethodController {
    private static final Logger logger = LoggerFactory.getLogger(PaymenthMethodController.class);

    private final PaymentMethodService paymentMethodService;

    @Autowired
    public PaymenthMethodController(PaymentMethodService paymentMethodService){
        this.paymentMethodService = paymentMethodService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> obtainAllPaymentMethods () {
        List<PaymentMethod> result = paymentMethodService.findAll();
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtainPaymentMethod (@PathVariable int id) {
        try{
            Optional<PaymentMethod> result = paymentMethodService.findPaymentMethodById(id);
            if(result.isEmpty()) return ResponseEntity.notFound().build();
            else return ResponseEntity.ok(result.get());
        }catch(Exception e){
            logger.error("Error obtaining the payment method with id {}: {}", id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

}
