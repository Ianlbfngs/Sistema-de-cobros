package com.ib.syscobros.cash_registers.application;

import com.ib.syscobros.auth.domain.User;
import com.ib.syscobros.cash_registers.domain.cash_movement.MovementType;
import com.ib.syscobros.cash_registers.domain.cash_register.AuditStatuses;
import com.ib.syscobros.cash_registers.domain.cash_register.CashRegister;
import com.ib.syscobros.cash_registers.domain.cash_register.CashRegisterRepository;
import com.ib.syscobros.cash_registers.domain.cash_register.CashRegisterResponseStatus;
import com.ib.syscobros.config.JWT.JwtUser;
import com.ib.syscobros.response.GenericResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CashRegisterService {

    private final CashRegisterRepository cashRegisterRepository;
    private final CashMovementService cashMovementService;

    @Autowired
    public CashRegisterService(CashRegisterRepository cashRegisterRepository, CashMovementService cashMovementService){
        this.cashRegisterRepository = cashRegisterRepository;
        this.cashMovementService = cashMovementService;
    }

    public List<CashRegister> findAll() {
        return cashRegisterRepository.findAll();
    }

    public List<CashRegister> findAllByStore(int storeId) {
        return cashRegisterRepository.findAllByStore_Id(storeId);
    }

    public Optional<CashRegister> findCashRegisterById(Long id) {
        return cashRegisterRepository.findCashRegisterById(id);
    }

    private Integer obtainUserId(){ //function that obtains the user id via the JWT request token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof JwtUser jwtUser) {
           return jwtUser.getUserId();
        }
        throw new IllegalArgumentException("userId couldn't be retrieved from JWT token");
    }

    public GenericResponse<CashRegisterResponseStatus.open,CashRegister> openCashRegister(CashRegister cashRegisterToOpen) { //function that opens/creates a cash register
        //verifies if there is a cash register already open via store ID
        //there is no "status" on cash register table, so the flag is the close date time
        //if it is null, then the cash register is open
        if(cashRegisterRepository.existsCashRegisterByStore_IdAndCloseDateTimeNull(cashRegisterToOpen.getStore().getId())){
            //cash register already open case
            return new GenericResponse<>(CashRegisterResponseStatus.open.THERE_IS_A_CASH_REGISTER_OPEN,null);
        }
        cashRegisterToOpen.setOpenDateTime(LocalDateTime.now());    //open datetime set

        cashRegisterToOpen.setOpeningUser(new User());
        cashRegisterToOpen.getOpeningUser().setId(obtainUserId()); //user that opened the cash register set

        return new GenericResponse<>(CashRegisterResponseStatus.open.SUCCESS,cashRegisterRepository.save(cashRegisterToOpen)); //open cash register saved
    }

    private CashRegister closeCashRegisterSet(CashRegister open, BigDecimal closeAmount){ //function that sets the cash register (to close) data
        open.setCloseDateTime(LocalDateTime.now()); //close date time set

        open.setClosingUser(new User());
        open.getClosingUser().setId(obtainUserId());    //user that closed the cash register set

        open.setCloseAmount(closeAmount);   //declared close amount set

        BigDecimal aux = cashMovementService.sumCash(open.getId(),MovementType.INGRESO);
        open.setTotalReceivedAmount(aux != null ? aux : BigDecimal.ZERO);

        aux = cashMovementService.sumCash(open.getId(), MovementType.RETIRO);
        open.setTotalWithdrawnAmount(aux != null ? aux : BigDecimal.ZERO);
        auditCashRegister(open);
        return open;
    }

    public GenericResponse<CashRegisterResponseStatus.close, CashRegister> closeCashRegister(BigDecimal closeAmount, int storeId) { //function that closes a cash register
        //finds open cash register by store ID
        Optional<CashRegister> cashRegisterOpen = cashRegisterRepository.findCashRegisterByStore_IdAndCloseDateTimeNull(storeId);
        //if not found:
        if(cashRegisterOpen.isEmpty()) return new GenericResponse<>(CashRegisterResponseStatus.close.NO_CASH_REGISTER_OPEN, null);
        //if found:
        //closed cash register is made by adding closing data (amount, datetime, user, withdrawn & received amount) to the open cash regsiter
        CashRegister closedCashRegister = closeCashRegisterSet(cashRegisterOpen.get(),closeAmount);
        return new GenericResponse<>(CashRegisterResponseStatus.close.SUCCESS, cashRegisterRepository.save(closedCashRegister)); //closed cash register saved
    }

    private void auditCashRegister (CashRegister cr){

        BigDecimal auditedCloseAmount = cr.getOpenAmount().add(cr.getTotalReceivedAmount().subtract(cr.getTotalWithdrawnAmount()));
        if(auditedCloseAmount.compareTo(cr.getCloseAmount()) == 0) cr.setAuditStatus(AuditStatuses.CONSISTENT);
        else cr.setAuditStatus(AuditStatuses.INCONSISTENT);

    }

    public Long findOpenCashRegisterByStore(int storeId) {
        Optional<CashRegister> searchedCashRegister = cashRegisterRepository.findCashRegisterByStore_IdAndCloseDateTimeNull(storeId);
        return searchedCashRegister.map(CashRegister::getId).orElse(null);
    }

    public List<CashRegister> findAllOpen() { return cashRegisterRepository.findCashRegistersByCloseDateTimeNull();
    }
}
