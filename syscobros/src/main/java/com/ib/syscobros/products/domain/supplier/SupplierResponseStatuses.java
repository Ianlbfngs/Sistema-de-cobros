package com.ib.syscobros.products.domain.supplier;

import com.ib.syscobros.response.IResponseStatus;

public class SupplierResponseStatuses {
    public enum add implements IResponseStatus{SUCCESS,CUIT_IN_USE,COMPANY_NAME_IN_USE}
    public enum update implements IResponseStatus{SUCCESS,NOT_FOUND,CUIT_IN_USE,COMPANY_NAME_IN_USE}
    public enum softDelete implements IResponseStatus{SUCCESS,NOT_FOUND,ALREADY_SOFT_DELETED}
    public enum hardDelete implements IResponseStatus{SUCCESS,NOT_FOUND,SUPPLIER_IS_BEING_REFERENCED}

}
