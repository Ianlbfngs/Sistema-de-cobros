package com.ib.syscobros.sales.domain.client;

import com.ib.syscobros.response.IResponseStatus;

public class ClientResponseStatuses {
    public enum update implements IResponseStatus{SUCCESS,NOT_FOUND}
    public enum softDelete implements IResponseStatus{SUCCESS,NOT_FOUND,ALREADY_SOFT_DELETED}
    public enum hardDelete implements IResponseStatus{SUCCESS,NOT_FOUND,CLIENT_IS_BEING_REFERENCED}
}
