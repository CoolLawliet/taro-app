import Taro, {Component} from '@tarojs/taro';
import {View,Navigator,Image,Text} from "@tarojs/components";
import Tabs from "../../components/Tabs/Tabs";
import './index.css'

class Index extends Component {
  config={
    "navigationBarTitleText":"商品收藏"
  }
  state={
    collect:[],
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览器足迹",
        isActive: false
      }
    ]
  }
  componentDidShow(){
    const collect=Taro.getStorageSync("collect")||[];
    this.setState({
      collect
    });

  }
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const  index  = e;
    // 2 修改源数组
    let { tabs } = this.state;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setState({
      tabs
    })
  }
  render() {
    let {tabs,collect} = this.state
    return (
      <Tabs tabs={tabs} onTabsItemChange={this.handleTabsItemChange.bind(this)}>
        <View class="collect_main">
          <View class="collect_title">
            <Text class="collect_tips active">全部</Text>
            <Text class="collect_tips">正在热卖</Text>
            <Text class="collect_tips">即将上线</Text>
          </View>
          <View class="collect_content">
            {
              collect.map(item=>(
                <Navigator class="goods_item" key={item.goods_id}
                           url={'/pages/goods_detail/index?goods_id='+item.goods_id}>
                  {/*// <!-- 左侧 图片容器 -->*/}
                  <View class="goods_img_wrap">
                    <Image mode="widthFix"
                           src={item.goods_small_logo?item.goods_small_logo:'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'}>
                    </Image>
                  </View>
                  {/*// <!-- 右侧 商品容器 -->*/}
                  <View class="goods_info_wrap">
                    <View class="goods_name">{item.goods_name}</View>
                    <View class="goods_price">￥{item.goods_price}</View>
                  </View>
                </Navigator>
              ))
            }
          </View>
        </View>
      </Tabs>
    );
  }
}

export default Index;
