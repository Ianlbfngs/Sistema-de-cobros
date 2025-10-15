package com.ib.syscobros.sales.domain.sale;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale,Long> {

    @Query(
            value = """
            select v.venta_id,v.usuario_id, v.cliente_id, v.metodo_de_pago_id, v.fecha, v.total, v.estado, l.nombre
            from ventas as v inner join movimientos_caja as mc on v.venta_id = mc.referencia_venta_id inner join caja as c on mc.caja_id = c.caja_id inner join locales as l on c.local_id = l.local_id
            """, nativeQuery = true
    )
    List<SaleWithStoreName> findAllSalesWithStoreName();

    List<Sale> findAllByStatus(SaleStatus status);

    Optional<Sale> findSaleById(Long id);
}
