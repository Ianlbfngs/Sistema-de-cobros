package com.ib.syscobros.cash_registers.domain.cash_movement;

import com.ib.syscobros.response.IResponseStatus;

public class CashMovementResponseStatus {

    public enum add implements IResponseStatus {SUCCESS,CASH_REGISTER_NOT_FOUND,SALE_NOT_FOUND,CASH_REGISTER_IS_CLOSED}


}
