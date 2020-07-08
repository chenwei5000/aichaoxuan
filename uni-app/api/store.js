import request from "@/utils/request.js";
import request_new from "@/utils/request_new.js";
/**
 * 获取产品详情
 * @param int id
 * 
*/
export function getProductDetail(id){
  //return request.get('product/detail/' + id, {}, { noAuth : true });
  return request_new.get('Goods.GetDetail', {'goods_id':id}, { noAuth : true });
}

/**
 * 购车添加
 * 
*/
export function postCartAdd(data) {
  //return request.post('cart/add', data);
  return request_new.post('Cart.AddCart', data);
}

/**
 * 获取分类列表
 * 
*/
export function getCategoryList(){
  //return request.get('category', {}, { noAuth:true});
  return request_new.get('Category.ListCategory', {}, { noAuth:true});
}

/**
 * 获取产品列表
 * @param object data
*/
export function getProductslist(data){
  return request_new.get('Goods.ListGoods', data,{noAuth:true});
}

/**
 * 获取推荐产品
 * 
 */
export function getProductHot(page,limit) {
//  return request.get("product/hot", { 
//    page: page === undefined ? 1 : page, 
//    limit:limit === undefined ? 4 :limit
//  },{noAuth:true});
  return request_new.get("Goods.ListGoods", { 
    page: page === undefined ? 1 : page, 
    limit:limit === undefined ? 4 :limit,
    type:'hot'
  },{noAuth:true});
}

/**
 * 首页产品的轮播图和产品信息
 * @param int type 
 * 
*/
export function getIndexProductList(data){
  //return request.get('groom/list/1',data,{noAuth:true});
  return request_new.get('Goods.ListGoods',data,{noAuth:true});
}

/**
 * 获取产品评论
 * @param int id
 * @param object data
 * 
*/
export function getReplyList(id,data){
  //return request.get('reply/list/'+id,data)
    return request_new.get('Review.ListAll',{sku_id:id});
}

/**
 * 产品评价数量和好评度
 * @param int id
*/
export function getReplyConfig(id){
  return request.get('reply/config/'+id);
} 

/**
 * 获取搜索关键字获取
 * 
*/
export function getSearchKeyword(){
  //return request.get('search/keyword',{},{noAuth:true});
  return request_new.get('Home.ListSearchKeyword',{},{noAuth:true});
}

export function getWechatShareInfo(goods_id) {
  return request_new.get('Share.GetWechatShareInfo', { goods_id:goods_id}, { noAuth: true });
}