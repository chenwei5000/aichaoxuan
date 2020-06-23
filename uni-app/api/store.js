import request from "@/utils/request.js";
import request_new from "@/utils/request_new.js";
/**
 * 获取产品详情
 * @param int id
 * 
*/
export function getProductDetail(id){
  //return request.get('product/detail/' + id, {}, { noAuth : true });
  return request_new.get('Goods.GetDetail', {}, { noAuth : true });
}

/**
 * 添加收藏
 * @param int id
 * @param string category product=普通产品,product_seckill=秒杀产品
*/
export function collectAdd(id, category){
  return request.post('collect/add', { id: id, 'product': category === undefined ? 'product' : category });
}

/**
 * 删除收藏产品
 * @param int id
 * @param string category product=普通产品,product_seckill=秒杀产品
*/
export function collectDel(id, category) {
  return request.post('collect/del', { id: id, category: category === undefined ? 'product' : category });
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
  return request.get('category', {}, { noAuth:true});
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
  return request.get("product/hot", { 
    page: page === undefined ? 1 : page, 
    limit:limit === undefined ? 4 :limit
  },{noAuth:true});
}
/**
 * 批量收藏
 * 
 * @param object id  产品编号 join(',') 切割成字符串
 * @param string category 
*/
export function collectAll(id, category) {
  return request.post('collect/all', { id: id, category: category === undefined ? 'product' : category });
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
 * 获取收藏列表
 * @param object data
*/
export function getCollectUserList(data) {
  return request.get('collect/user', data)
}

/**
 * 获取产品评论
 * @param int id
 * @param object data
 * 
*/
export function getReplyList(id,data){
  return request.get('reply/list/'+id,data)
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
  return request.get('search/keyword',{},{noAuth:true});
}

