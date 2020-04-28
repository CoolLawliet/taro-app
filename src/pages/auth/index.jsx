import Taro, {Component} from '@tarojs/taro';
import {Button} from "@tarojs/components";
import {request} from "../../request";
import {login} from "../../utils/asyncWx";

class Index extends Component {
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {

      // 1 获取用户信息
      const { encryptedData, rawData, iv, signature } = e;
      // 2 获取小程序登录成功后的code
      const { code } = await login();
      const loginParams={ encryptedData, rawData, iv, signature ,code};
      //  3 发送请求 获取用户的token
      // const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      // 4 把token存入缓存中 同时跳转回上一个页面
      Taro.setStorageSync("token", token);
      Taro.navigateBack({
        delta: 1
      });

    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <Button type="primary"
              plain open-type="getUserInfo" onGetuserinfo={this.handleGetUserInfo} >
        获取授权
      </Button>
    );
  }
}

export default Index;
