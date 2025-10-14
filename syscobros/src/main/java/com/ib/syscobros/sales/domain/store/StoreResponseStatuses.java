package com.ib.syscobros.sales.domain.store;

import com.ib.syscobros.response.IResponseStatus;

public class StoreResponseStatuses
{
    public enum add implements IResponseStatus {SUCCESS,NAME_IN_USE,ADDRESS_IN_USE}
    public enum update implements IResponseStatus {SUCCESS,NOT_FOUND,NAME_IN_USE,ADDRESS_IN_USE}
    public enum softDelete implements IResponseStatus{SUCCESS,NOT_FOUND,ALREADY_SOFT_DELETED}
    public enum hardDelete implements IResponseStatus{SUCCESS,NOT_FOUND,STORE_IS_BEING_REFERENCED}
}
