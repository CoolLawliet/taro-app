import Taro, {Component} from '@tarojs/taro';
import {View,Image,Navigator} from "@tarojs/components";
import './index.css'

class Index extends Component {
  config={
    "navigationBarTitleText":"个人中心"
  }
  state={
    userinfo:{},
    // 被收藏的商品的数量
    collectNums:0
  }
  componentDidShow(){
    const userinfo=Taro.getStorageSync("userinfo");
    const collect=Taro.getStorageSync("collect")||[];
    this.setState({userinfo,collectNums:collect.length});
  }
  render() {
    let {userinfo,collectNums} = this.state
    let userlist=null
    if (userinfo.avatarUrl){
      userlist=
        <View className="user_img_wrap">
        <Image className="user_bg" src={userinfo.avatarUrl}/>
        <View className="user_info">
          <Image className="user_icon" src={userinfo.avatarUrl}/>
          <View className="user_name">{userinfo.nickName}</View>
        </View>
      </View>
    }else{
      userlist=
        <View className="user_btn">
        <Navigator url="/pages/login/index">登录</Navigator>
      </View>
    }
    return (
      <View>
        <View className="user_info_wrap">
          {userlist}
        </View>
        <View className="user_content">
          <View className="user_main">
            {/*// <!-- 历史足迹 -->*/}
            <View className="history_wrap">
              <Navigator>
                <View className="his_num">0</View>
                <View className="his_name">收藏的店铺</View>
              </Navigator>
              <Navigator url="/pages/collect/index">
                <View className="his_num">{collectNums}</View>
                <View className="his_name">收藏的商品</View>
              </Navigator>
              <Navigator>
                <View className="his_num">0</View>
                <View className="his_name">关注的商品</View>
              </Navigator>
              <Navigator>
                <View className="his_num">0</View>
                <View className="his_name">我的足迹</View>
              </Navigator>
            </View>
            {/*// <!-- 我的订单 -->*/}
            <View className="orders_wrap">
              <View className="orders_title">我的订单</View>
              <View className="order_content">
                <Navigator url="/pages/order/index?type=1">
                  <View className="iconfont icon-ding_dan"/>
                  <View className="order_name">全部订单</View>
                </Navigator>
                <Navigator url="/pages/order/index?type=2">
                  <View className="iconfont icon-fukuantongzhi"/>
                  <View className="order_name">待付款</View>
                </Navigator>
                <Navigator url="/pages/order/index?type=3">
                  <View className="iconfont icon-receipt-address"/>
                  <View className="order_name">待收货</View>
                </Navigator>
                <Navigator>
                  <View className="iconfont icon-tuihuotuikuan_dianpu"/>
                  <View className="order_name">退款/退货</View>
                </Navigator>
              </View>
            </View>
            {/*// <!-- 收货地址管理 -->*/}
            <View className="address_wrap">
              收货地址管理
            </View>
            {/*// <!-- 应用信息相关 -->*/}
            <View className="app_info_wrap">
              <View className="app_info_item app_info_contact">
                <text>联系客服</text>
                <text>400-618-4000</text>
              </View>
              <Navigator url="/pages/feedback/index" className="app_info_item">意见反馈</Navigator>
              <View className="app_info_item">关于我们</View>
            </View>
            {/*// <!-- 推荐 -->*/}
            <View className="recommend_wrap">
              把应用推荐给其他人
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
