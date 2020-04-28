import Taro, {Component} from '@tarojs/taro';
import {View} from "@tarojs/components";
import Tabs from "../../components/Tabs/Tabs";
import {request} from "../../request";
import './index.css'

class Index extends Component {
  config={
    "navigationBarTitleText":"订单查询"
  }
  state={
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  }
  componentDidShow() {
    const token = Taro.getStorageSync("token");
    if (!token) {
      Taro.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的type参数
    const { type } = currentPage.options;
    // const { goods_id } = this.$router.params;

    // 4 激活选中页面标题 当 type=1 index=0
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  }
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    this.setState({
      orders: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  }
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 2 修改源数组
    let { tabs } = this.state;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setState({
      tabs
    })
  }
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const index = e;
    this.changeTitleByIndex(index);
    // 2 重新发送请求 type=1 index=0
    this.getOrders(index+1);
  }
  render() {
    let {tabs,orders} = this.state
    return (
      <Tabs tabs={tabs} onTabsItemChange={this.handleTabsItemChange.bind(this)} >

        <View class="order_main">
          {
            orders.map(item=>(
              <View
                key={item.order_id}
                class="order_item">

                <View class="order_no_row">
                  <View class="order_no_text">订单编号</View>
                  <View class="order_no_value">{item.order_number}</View>
                </View>
                <View class="order_price_row">
                  <View class="order_price_text">订单价格</View>
                  <View class="order_price_value">￥{item.order_price}</View>
                </View>
                <View class="order_time_row">
                  <View class="order_time_text">订单日期</View>
                  <View class="order_time_value">{item.create_time_cn}</View>
                </View>
              </View>
            ))
          }
        </View>
      </Tabs>
    );
  }
}

export default Index;
