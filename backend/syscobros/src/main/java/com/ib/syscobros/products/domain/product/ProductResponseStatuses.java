package com.ib.syscobros.products.domain.product;

import com.ib.syscobros.response.IResponseStatus;

public class ProductResponseStatuses {
    public enum add implements IResponseStatus{SUCCESS,CODE_IN_USE,SUPPLIER_NOT_FOUND}
    public enum update implements IResponseStatus{SUCCESS,NOT_FOUND,SUPPLIER_NOT_FOUND}
    public enum softDelete implements IResponseStatus{SUCCESS,NOT_FOUND,ALREADY_SOFT_DELETED}
    public enum hardDelete implements IResponseStatus{SUCCESS,NOT_FOUND,PRODUCT_IS_BEING_REFERENCED}
}
