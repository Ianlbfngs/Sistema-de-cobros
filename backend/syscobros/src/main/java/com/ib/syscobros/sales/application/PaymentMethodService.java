package com.ib.syscobros.sales.application;

import com.ib.syscobros.sales.domain.payment_method.PaymentMethod;
import com.ib.syscobros.sales.domain.payment_method.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    @Autowired
    public PaymentMethodService(PaymentMethodRepository paymentMethodRepository){
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public List<PaymentMethod> findAll() {
        return paymentMethodRepository.findAll();
    }

    public Optional<PaymentMethod> findPaymentMethodById(int id) {
        return paymentMethodRepository.findById(id);
    }
}
