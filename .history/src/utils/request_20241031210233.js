//1.引入axios
import axios from "axios";
import globalConfig from "@/utils/gloabl.config";
//2.创建axios对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  // baseURL: "http://localhost:8888/",
  timeout: 6000,
});
//3.请求拦截器==>前端给后端发送请求，还没有到后端,统一将token封装在请求头headers中
service.interceptors.request.use(
  (config) => {
    //设置token
    let whitelist = globalConfig.WhiteListApi; //白名单：不需要设置token的请求
    let url = config.url;
    let adminInfo = JSON.parse(window.localStorage.getItem("access-admin"));
    //如果请求不在白名单中且携带token,则在请求头设置token
    if (whitelist.indexOf(url) === -1 && adminInfo) {
      config.headers["token"] = adminInfo.token;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);
//4.响应拦截器==>后端给前端返回数据
service.interceptors.response.use(
  (response) => {
    let code = response.data.code || 200;
    let mag = response.data.msg || "未知错误";
    if (code === 401) {
      //token过期，无权限访问

      return;
    }
    if (code === 200) {
      return response.data;
    }
  },
  (error) => {
    return Promise.reject(new Error(error.response.data));
  }
);
export default service;
