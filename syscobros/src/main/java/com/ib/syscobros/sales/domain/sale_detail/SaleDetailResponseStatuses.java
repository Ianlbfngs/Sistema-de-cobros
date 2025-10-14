package com.ib.syscobros.sales.domain.sale_detail;

import com.ib.syscobros.response.IResponseStatus;

public class SaleDetailResponseStatuses {
    public enum add implements IResponseStatus {SUCCESS,PRODUCT_NOT_FOUND};
}
