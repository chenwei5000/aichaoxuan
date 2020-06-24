import request from "@/utils/request.js";
import request_new from "@/utils/request_new.js";

/**
 * 获取用户信息
 * 
*/
export function getUserInfo(){
//  return request.get('user');
  return request_new.get('User.GetProfile');
}

/**
 * 设置用户分享
 * 
*/
export function userShare(){
  return request.post('user/share');
}

/**
 * h5用户登录
 * @param data object 用户账号密码
 */
export function loginH5(data) {
  //return request.post("/login", data, { noAuth : true });
  return request_new.post("Login.Login", data, { noAuth : true });
}

/**
 * 
 * 地址列表
 * @param object data
*/
export function getAddressList(data){
  //return request.get('address/list',data);
  return request_new.get('Address.ListAll',data);
}

/**
 * 设置默认地址
 * @param int id
*/
export function setAddressDefault(id){
  //return request.post('address/default/set',{id:id})
  return request_new.post('Address.SaveAsDefault',{address_id:id})
}

/**
 * 修改 添加地址
 * @param object data
*/
export function editAddress(data){
  //return request.post('address/edit',data);
  return request_new.post('Address.UpdateAddress',data);
}

/**
 * 删除地址
 * @param int id
 * 
*/
export function delAddress(id){
  //return request.post('address/del',{id:id})
  return request_new.post('Address.DeleteAddress',{address_id:id})
}

/**
 * 获取单个地址
 * @param int id 
*/
export function getAddressDetail(id){
  //return request.get('address/detail/'+id);
  return request_new.get('Address.GetDetail',{address_id:id});
}

/**
 * 修改用户信息
 * @param object
*/
export function userEdit(data){
  return request.post('user/edit',data);
}

/*
 * 退出登录
 * */
export function getLogout() {
  return request.get("logout");
}
/**
 * 获取默认地址
 * 
*/
export function getAddressDefault(){
  //return request.get('address/default');
  return request_new.get('Address.GetDefault');
}

/**
 * 登陆记录
 */
export function setVisit(data)
{
  return request.post('user/set_visit', {...data}, { noAuth:true});
}

