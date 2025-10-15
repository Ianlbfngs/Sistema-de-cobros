package com.ib.syscobros.sales.domain.sale;

import com.ib.syscobros.response.IResponseStatus;

public class SaleResponseStatuses {
    public enum add implements IResponseStatus {SUCCESS,CLIENT_NOT_FOUND,INEXISTENT_PAYMENT_METHOD}
    public enum updateStatus implements IResponseStatus {SUCCESS,NOT_FOUND,ONLY_PENDING_SALES}

}
