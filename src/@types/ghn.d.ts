export interface ItemType {
    name: string
    code: string
    quantity: number
    price: number
    length: number
    width: number
    weight: number
    height: number
}

export interface ConfirmOrderRequest {
    payment_type_id: number
    note: string
    required_note: string
    to_name: string
    to_phone: string
    to_address: string
    to_ward_name: string
    to_district_name: string
    to_province_name: string
    cod_amount: number
    content: string
    weight: number
    length: number
    width: number
    height: number
    insurance_value: number
    service_type_id: number
    items: ItemType[]
}

interface FeeType {
    main_service: number
    insurance: number
    cod_fee: number
    station_do: number
    station_pu: number
    return: number
    r2s: number
    return_again: number
    coupon: number
    document_return: number
    double_check: number
    double_check_deliver: number
    pick_remote_areas_fee: number
    deliver_remote_areas_fee: number
    pick_remote_areas_fee_return: number
    deliver_remote_areas_fee_return: number
    cod_failed_fee: number
}

export interface OrderGHNType {
    order_code: string
    sort_code: string
    trans_type: string
    ward_encode: string
    district_encode: string
    fee: FeeType
    total_fee: number
    expected_delivery_time: string
    operation_partner: string
}

export interface CreateOrderGHNResponse {
    code: number
    code_message_value: string
    data: OrderGHNType
    message: string
    message_display: string
}

export interface GenTokenResponse {
    code: number
    message: string
    data: {
        token: string
    }
}
