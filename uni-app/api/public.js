import request from "@/utils/request.js";
import request_new from "@/utils/request_new.js";

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function getWechatConfig() {
  //return request.get(
  //  "wechat/config",
  //  { url: document.location.href },
  //  { noAuth: true }
  //);
  return request_new.get(
    "Site.GetWechatConfig",
    { url: document.location.href },
    { noAuth: true }
  );
 
}

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function wechatAuth(code, spread, login_type) {
  //return request.get(
  //  "wechat/auth",
  //  { code, spread, login_type },
  //  { noAuth: true }
  //);
  return request_new.get(
    "Weixin.MpAuth",
    { code, spread, login_type },
    { noAuth: true }
  );
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
 * 小程序用户登录
 * @param data object 小程序用户登陆信息
 */
export function login(data) {
  return request_new.post("Weixin.MiniappAuth", data, { noAuth : true });
}
/**
 * 分享
 * @returns {*}
 */
export function getShare() {
  //return request.get("share", {}, { noAuth: true });
  return request_new.get("Site.GetWechatShareInfo", {}, { noAuth: true });
}

export function getMiniappShareInfo(code)
{
    return request_new.get("Site.GetMiniappShareInfo",{code:code}, { noAuth: true });
}

/**
 * 获取图片base64
 * @retins {*}
 * */
export function imageBase64(image, code) {
  return request.post(
    "/image_base64",
    { image: image, code: code },
    { noAuth: true }
  );
}

