import request from "@/utils/request.js";
/**
 * 
 * 所有活动接口 包括：拼团，砍价，秒杀
 * 
*/

/**
 * 秒杀产品时间区间
 * 
*/
export function getSeckillIndexTime(){
  return request.get('seckill/index',{},{noAuth:true});
}

/**
 * 秒杀产品列表
 * @param int time
 * @param object data
*/
export function getSeckillList(time,data){
  return request.get('seckill/list/'+time,data,{noAuth:true});
}

/**
 * 秒杀产品详情
 * @param int id
*/
export function getSeckillDetail(id){
  return request.get('seckill/detail/'+id);
}

/**
 * 获取秒杀小程序二维码
 */
export function seckillCode(id,data) {
  return request.get("seckill/code/"+id,data);
}
