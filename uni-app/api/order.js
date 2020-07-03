import request from "@/utils/request.js";
import request_new from "@/utils/request_new.js";

/**
 * 获取购物车列表
 * @param numType boolean true 购物车数量,false=购物车产品数量
 */
export function getCartCounts(numType) {
  //return request.get("cart/count", { numType: numType === undefined ? true : numType });
  return request_new.get("Cart.GetCartNum", { numType: numType === undefined ? true : numType });
}
/**
 * 获取购物车列表
 * 
 */
export function getCartList() {
  //return request.get("cart/list");
  return request_new.get("Cart.ListCart");
}

/**
 * 修改购物车数量
 * @param int cartId  购物车id
 * @param int number 修改数量
 */
export function changeCartNum(cartId, number) {
  //return request.post("cart/num", { id: cartId, number: number });
  return request_new.post("Cart.EditGoodsQuantity", { id: cartId, number: number });
}
/**
 * 清除购物车
 * @param object ids join(',') 切割成字符串
*/
export function cartDel(ids){
  if (typeof ids === 'object') 
    ids = ids.join(',');
  //return request.post('cart/del', { ids: ids});
  return request_new.post('Cart.DeleteCart', { ids: ids});
}
/**
 * 订单列表
 * @param object data
*/
export function getOrderList(data){
  //return request.get('order/list',data);
  return request_new.get('Order.ListOrder',data);
}

/**
 * 订单产品信息
 * @param string unique 
*/
export function orderProduct(unique){
  return request.post('order/product', { unique: unique});
}

/**
 * 订单评价
 * @param object data
 * 
*/
export function orderComment(data){
  return request_new.post('Review.AddReview',data);
}

/**
 * 订单支付
 * @param object data
*/
export function orderPay(data){
  return request.post('order/pay',data);
}

/**
 * 订单统计数据
*/
export function orderData(){
  //return request.get('order/data')
  return request_new.get('Order.GetOrderCount');
}

/**
 * 订单取消
 * @param string id
 * 
*/
export function orderCancel(id){
  return request_new.post('Order.CancelOrder',{order_id:id});
}

/**
 * 删除已完成订单
 * @param string uni
 * 
*/
export function orderDel(uni){
  return request_new.post('Order.DeleteOrder',{uni:uni});
}

/**
 * 订单详情
 * @param string uni 
*/
export function getOrderDetail(uni){
  return request_new.get('Order.GetOrderDetail',{order_id:uni});
}

/**
 * 再次下单
 * @param string uni
 * 
*/
export function orderAgain(uni){
  return request.post('order/again',{uni:uni});
}

/**
 * 订单收货
 * @param string uni
 * 
*/
export function orderTake(uni){
  //return request.post('order/take',{uni:uni});
  return request_new.post('Order.ConfirmReceipt',{order_id:uni});
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(uni) {
  return request_new.get("Order.QueryExpress",{'order_id':uni});
}
export function getOrderGoodsDetail(data){
  return request_new.get('Order.GetOrderGoodsDetail',data);
}
/**
 * 获取退款理由
 * 
*/
export function ordeRefundReason(){
  return request_new.get('Order.ListRefundReason');
}

export function afterSaleList(data){
  return request_new.post('Order.AfterSaleList',data);
}
export function afterSaleDetails(data){
  return request_new.get('Order.AfterSaleDetails',data);
}

/**
 * 订单退款审核
 * @param object data
*/
export function orderRefundVerify(data){
  return request_new.post('Order.AddAfterSale',data);
}

/**
 * 订单确认获取订单详细信息
 * @param string cartId
*/
export function orderConfirm(cartId){
  //return request.post('order/confirm', { cartId: cartId});
  return request_new.post('Order.Confirm', { cartId: cartId});
}

/**
 * 获取当前金额能使用的优惠卷
 * @param string price
 * 
*/
export function getCouponsOrderPrice(price, data){
  return request.get('coupons/order/' + price, data)
}

/**
 * 订单创建
 * @param string key
 * @param object data
 * 
*/
export function orderCreate(key,data){
  return request_new.post('Order.Create',data);
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
export function postOrderComputed(key, data) {
  return request.post("/order/computed/" + key, data);
}

export function WxJsapiPay(data){
  return request_new.post('Billing.WxJsapiPay',data);
}
export function WxH5Pay(data){
  return request_new.post('Billing.WxH5Pay',data);
}
export function WxWxaPay(data){
  return request_new.post('Billing.WxWxaPay',data);
}
