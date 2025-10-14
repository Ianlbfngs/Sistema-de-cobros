package com.ib.syscobros.cash_registers.domain.cash_movement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CashMovementRepository extends JpaRepository<CashMovement,Long> {
    @Query("select SUM(cm.amount) as result from CashMovement as cm where cm.cashRegister.id = ?1 and cm.movementType = ?2")
    BigDecimal sumCash(Long cashRegisterId, MovementType movementType );

    @Query("select SUM(cm.amount) as result from CashMovement as cm where cm.cashRegister.id = ?1")
    BigDecimal sumAllCash(Long cashRegisterId);

    List<CashMovement> findAllByCashRegister_Id(Long cashRegisterId);

    List<CashMovement> findAllBySale_Id(Long saleId);

    Optional<CashMovement> findCashMovementsById(Long id);
}
