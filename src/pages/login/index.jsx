import Taro, {Component} from '@tarojs/taro';
import {Button} from "@tarojs/components";
import './index.css'

class Index extends Component {
  config={
    "navigationBarTitleText":"登录"
  }
  handleGetUserInfo(e){
    // console.log(e);
    const {userInfo}=e.detail;
    Taro.setStorageSync("userinfo", userInfo);
    Taro.navigateBack({
      delta: 1
    });

  }
  render() {
    return (
        <Button
          type="primary"
          plain
          open-type="getUserInfo"
          onGetuserinfo={this.handleGetUserInfo}> 登录 </Button>
    );
  }
}

export default Index;
