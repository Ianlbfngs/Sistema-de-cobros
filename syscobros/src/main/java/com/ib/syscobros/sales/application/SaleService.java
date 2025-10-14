package com.ib.syscobros.sales.application;

import com.ib.syscobros.auth.domain.User;
import com.ib.syscobros.cash_registers.application.CashMovementService;
import com.ib.syscobros.config.JWT.JwtUser;
import com.ib.syscobros.response.GenericResponse;
import com.ib.syscobros.sales.domain.sale.*;
import com.ib.syscobros.sales.domain.sale_detail.SaleDetail;
import com.ib.syscobros.utils.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleDetailService saleDetailService;
    private final CashMovementService cashMovementService;

    @Autowired
    public SaleService(SaleRepository saleRepository, CashMovementService cashMovementService, SaleDetailService saleDetailService){
        this.saleRepository = saleRepository;
        this.saleDetailService = saleDetailService;
        this.cashMovementService = cashMovementService;
    }


    public List<SaleWithStoreName> findAll() {
        return saleRepository.findAllSalesWithStoreName();
    }

    public List<Sale> findAllByStatus(SaleStatus status) {
        return saleRepository.findAllByStatus(status);
    }

    public Optional<Sale> findSaleById(Long id) {
        return saleRepository.findSaleById(id);
    }

    private Integer obtainUserId(){ //function that obtains the user id via the JWT request token
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof JwtUser jwtUser) {
            return jwtUser.getUserId();
        }
        throw new IllegalArgumentException("userId couldn't be retrieved from JWT token");
    }

    @Transactional
    public Sale addSale(Sale sale) {
        sale.setDateTime(LocalDateTime.now());

        User saleUser = new User();
        saleUser.setId(obtainUserId());
        sale.setUser(saleUser);

        Sale savedSale = saleRepository.save(sale);

        BigDecimal total = BigDecimal.ZERO;

        for(SaleDetail detail : sale.getDetails()){
            total = total.add(saleDetailService.addSaleDetail(detail, savedSale));
        }

        savedSale.setTotal(total);
        savedSale = saleRepository.save(savedSale);

        cashMovementService.addSaleCashMovement(savedSale);

        return savedSale;
    }

    public GenericResponse<SaleResponseStatuses.updateStatus, Sale> updateStatus(Long id, SaleStatus status) {
        Optional<Sale> originalSale = saleRepository.findSaleById(id);
        if(originalSale.isEmpty()) return new GenericResponse<>(SaleResponseStatuses.updateStatus.NOT_FOUND,null);
        if (!originalSale.get().getStatus().equals(SaleStatus.PENDIENTE)) return new GenericResponse<>(SaleResponseStatuses.updateStatus.ONLY_PENDING_SALES,null);
        originalSale.get().setStatus(status);
        return new GenericResponse<>(SaleResponseStatuses.updateStatus.SUCCESS,saleRepository.save(originalSale.get()));

    }

    public boolean existsSaleById(Long saleId) {
        return saleRepository.existsById(saleId);
    }
}
