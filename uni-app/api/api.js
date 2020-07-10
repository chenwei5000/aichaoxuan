import request from "@/utils/request.js";
import request_new from "@/utils/request_new.js";
import store from '../store';
/**
 * 公共接口 ，优惠券接口 , 行业此讯 , 手机号码注册
 * 
*/

/**
 * 获取主页数据 无需授权
 * 
*/

export function getIndexData()
{
  //return request.get("index",{},{ noAuth : true});
  return request_new.get("Home.Index",{},{ noAuth : true});
}

/**
 * 获取登录授权login
 * 
*/
export function getLogo()
{
  return request.get('wechat/get_logo', {}, { noAuth : true});
}


/**
 * 保存form_id
 * @param string formId 
 */
export function setFormId(formId) {
  return request.post("wechat/set_form_id", { formId: formId});
}

/**
 * 手机号+验证码登录接口
 * @param object data
*/
export function loginMobile(data){
  return request.post('login/mobile',data,{noAuth:true})
}

/**
 * 验证码发送
 * @param object phone
*/
export function registerVerify(phone, reset){
  return request.post('register/verify', { phone: phone, type: reset === undefined ? 'reset' : reset },{noAuth:true})
}

/**
 * 绑定手机号
 * 
*/
export function bindingPhone(data){
  return request.post('binding',data);
}

/**
 * 退出登錄
 * 
*/
export function logout(){
  return request.get('logout');
}

/**
 * 获取订阅消息id
 */
export function getTemlIds()
{
  return request.get('wechat/teml_ids', {}, { noAuth:true});
}

/**
 * 获取城市信息
 */
export function getCity(id) {
  return request_new.get('Site.ListArea', {parent_id:id}, { noAuth: true });
}

/**
 * 获取小程序直播列表
 */
export function getLiveList(page,limit) {
  //return request.get('wechat/live', { page, limit}, { noAuth: true });
  return request_new.get('Home.ListRecommendLive', { page:page, limit:limit}, { noAuth: true });
}


/*
 * 获取首页推荐直播列表
*/
export function getLiveLists(page,limit) {
  return request_new.get('Home.ListRecommendLive', { page, limit}, { noAuth: true });
}

/*
 * 获取直播列表页直播间列表 直播中
*/
export async function get_Lives(type, page,limit) {
  return request_new.get('Live.ListLive', { type, page, limit}, { noAuth: true });
}

export async function getFlashSale(data) {
  return request_new.get('FlashSale.ListGoods', data, { noAuth: true });
}

// 直播详情
export async function get_Lives_Detail(data) {
  return request_new.get('Live.GetLiveDetail', data, { noAuth: true });
}

// 直播商品列表
export async function get_Lives_Prolist(data) {
  return request_new.get('Live.ListLiveGoods', data, { noAuth: true });
}

/*
 * 获取我的评价  待评价 / 已评价 / 评论详情
*/
export async function get_Review(page,limit) {
  return request_new.get('Review.ListMyWaitingReview', { page, limit}, { noAuth: true });
}

export async function get_FinishedReview(page,limit) {
  return request_new.get('Review.ListMyFinishedReview', { page, limit}, { noAuth: true });
}

export async function get_ReviewDetail(id) {
  return request_new.get('Review.GetDetail', { review_id: id});
}