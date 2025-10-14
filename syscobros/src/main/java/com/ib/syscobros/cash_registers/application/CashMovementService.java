package com.ib.syscobros.cash_registers.application;

import com.ib.syscobros.cash_registers.domain.cash_movement.CashMovementResponseStatus;
import com.ib.syscobros.cash_registers.domain.cash_movement.CashMovement;
import com.ib.syscobros.cash_registers.domain.cash_movement.CashMovementRepository;
import com.ib.syscobros.cash_registers.domain.cash_movement.MovementType;
import com.ib.syscobros.cash_registers.domain.cash_register.CashRegister;
import com.ib.syscobros.response.GenericResponse;
import com.ib.syscobros.sales.application.SaleService;
import com.ib.syscobros.sales.domain.sale.Sale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CashMovementService {

    private final CashMovementRepository cashMovementRepository;
    private final CashRegisterService cashRegisterService;
    private final SaleService saleService;

    @Autowired
    public CashMovementService(CashMovementRepository cashMovementRepository, @Lazy CashRegisterService cashRegisterService, @Lazy SaleService saleService){
        this.cashMovementRepository = cashMovementRepository;
        this.cashRegisterService = cashRegisterService;
        this.saleService = saleService;
    }

    public BigDecimal sumCash(Long cashRegisterId, MovementType movementType) {
        if(movementType  == null) return cashMovementRepository.sumAllCash(cashRegisterId);
        else return cashMovementRepository.sumCash(cashRegisterId,movementType);

    }

    public List<CashMovement> findAll() {
        return cashMovementRepository.findAll();
    }

    public List<CashMovement> findAllByCashRegister(Long cashRegisterId) {
        return cashMovementRepository.findAllByCashRegister_Id(cashRegisterId);
    }

    public List<CashMovement> findAllBySale(Long saleId) {
        return cashMovementRepository.findAllBySale_Id(saleId);
    }

    public Optional<CashMovement> findCashMovementById(Long id) {
        return cashMovementRepository.findCashMovementsById(id);
    }

    public GenericResponse<CashMovementResponseStatus.add, CashMovement> addCashMovement(CashMovement cashMovement) {
        cashMovement.setDate(LocalDateTime.now());

        if(cashMovement.getSale() != null){
            if(!saleService.existsSaleById(cashMovement.getSale().getId())) return new GenericResponse<>(CashMovementResponseStatus.add.SALE_NOT_FOUND, null);
        }

        Optional<CashRegister> cashRegister = cashRegisterService.findCashRegisterById(cashMovement.getCashRegister().getId());
        if(cashRegister.isEmpty()) return new GenericResponse<>(CashMovementResponseStatus.add.CASH_REGISTER_NOT_FOUND,null);
        if(cashRegister.get().getCloseDateTime() != null) return new GenericResponse<>(CashMovementResponseStatus.add.CASH_REGISTER_IS_CLOSED,null);

        if(cashMovement.getMovementType().equals(MovementType.RETIRO)) cashMovement.setAmount(cashMovement.getAmount().negate());

        return new GenericResponse<>(CashMovementResponseStatus.add.SUCCESS,cashMovementRepository.save(cashMovement));

    }

    public void addSaleCashMovement(Sale sale) {
        CashMovement cashMovement = new CashMovement();
        cashMovement.setCashRegister(new CashRegister());
        cashMovement.getCashRegister().setId(sale.getCashRegisterId());

        cashMovement.setSale(new Sale());
        cashMovement.getSale().setId(sale.getId());

        cashMovement.setMovementType(MovementType.INGRESO);
        cashMovement.setAmount(sale.getTotal());
        cashMovement.setConcept("VENTA");

        GenericResponse<CashMovementResponseStatus.add, CashMovement> result = addCashMovement(cashMovement);
        if(result.data() == null) throw new IllegalArgumentException("error:"+result.status());

    }
}
