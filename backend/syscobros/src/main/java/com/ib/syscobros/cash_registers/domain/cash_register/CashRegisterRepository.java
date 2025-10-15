package com.ib.syscobros.cash_registers.domain.cash_register;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CashRegisterRepository extends JpaRepository<CashRegister,Long> {
    boolean existsCashRegisterByStore_IdAndCloseDateTimeNull(int storeId);

    Optional<CashRegister> findCashRegisterByStore_IdAndCloseDateTimeNull(int storeId);


    Optional<CashRegister> findCashRegisterById(Long id);

    List<CashRegister> findAllByStore_Id(int storeId);


    List<CashRegister> findCashRegistersByCloseDateTimeNull();
}
