package com.ib.syscobros.sales.application;

import com.ib.syscobros.products.application.ProductService;
import com.ib.syscobros.products.domain.product.Product;
import com.ib.syscobros.sales.domain.sale.Sale;
import com.ib.syscobros.sales.domain.sale_detail.SaleDetail;
import com.ib.syscobros.sales.domain.sale_detail.SaleDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class SaleDetailService {

    private final SaleDetailRepository saleDetailRepository;
    private final ProductService productService;

    @Autowired
    public SaleDetailService(SaleDetailRepository saleDetailRepository, ProductService productService){
        this.saleDetailRepository = saleDetailRepository;
        this.productService=productService;
    }

    public BigDecimal addSaleDetail(SaleDetail detail, Sale sale){
        detail.setSale(sale);
        detail.setSubtotal(productService.getPriceByCode(detail.getProduct().getProductCode()).multiply(detail.getAmount()));

        Optional<Product> product = productService.findProductByCode(detail.getProduct().getProductCode());
        if(product.isEmpty()) throw new IllegalArgumentException("Codigo de producto no encontrado");
        if(!product.get().isStatus()) throw new IllegalArgumentException("El producto esta suspendido");

        saleDetailRepository.save(detail);
        return detail.getSubtotal();
    }

}
