import Taro, {Component} from '@tarojs/taro';
import {View,ScrollView,Image} from "@tarojs/components";
import SearchInput from "../../components/SearchInput/SearchInput";
import {request} from "../../request";
import './index.css'

class Index extends Component {
  config = {
    "navigationBarTitleText": "商品分类"
  }
  state={
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
    // 接口的返回数据
    Cates: []
  }

  componentWillMount () {
    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Cates = Taro.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间  10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.state.Cates = Cates.data;
        let leftMenuList = this.state.Cates.map(v => v.cat_name);

        let rightContent = this.state.Cates[0].children;
        this.setState({
          leftMenuList,
          rightContent
        })
      }
    }
  }
  // 获取分类数据
   async getCates() {
    // let {Cates} = this.state
    // 1 使用es7的async await来发送请求
    const res = await request({ url: "/categories" });
     // this.Cates = res.data.message;
     this.state.Cates = res;
    // 把接口的数据存入到本地存储中
    Taro.setStorageSync("cates", { time: Date.now(), data:this.state.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList = this.state.Cates.map(v => v.cat_name);
     // 构造右侧的商品数据
    let rightContent = this.state.Cates[0].children;
    this.setState({
      leftMenuList,
      rightContent
    })
   }
  // 左侧菜单的点击事件
  handleItemTap(e) {
    /*
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    3 根据不同的索引来渲染右侧的商品内容
     */
    const { index } = e.currentTarget.dataset;

    let rightContent = this.state.Cates[index].children;
    this.setState({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })

  }
  render() {
    let {leftMenuList,rightContent,currentIndex,scrollTop} = this.state
    return (
      <View className="cates">
        <SearchInput/>
        <View className="cates_container">
          <ScrollView scroll-y className="left_menu">
            {
              leftMenuList.map((item,index)=> {
                return (
                  <View
                    className={index===currentIndex?'menu_item active':'menu_item'}
                    key={index}
                    onTap="handleItemTap"
                    data-index={index}
                  >{item}
                  </View>
                )
              })
            }
          </ScrollView>
           <ScrollView scroll-top={scrollTop} scroll-y className="right_content">
             {
              rightContent.map((item1,index1)=>(
                <View className="goods_group"
                      for-index={index1}
                      for-item={item1}
                >
                  <View className="goods_title">
                    <text className="delimiter">/</text>
                    <text className="title">{item1.cat_name}</text>
                    <text className="delimiter">/</text>
                  </View>
                  <View className="goods_list">
                    {
                      item1.children.map((item2,index2)=>(
                        <navigator
                                   for-item={item2}
                                   for-index={index2}
                                   key={item2.cat_id}
                                   url={'/pages/goods_list/index?cid=' +item2.cat_id}
                        >
                          <Image mode="widthFix" src={item2.cat_icon}/>
                          <View className="goods_name">{item2.cat_name}</View>
                        </navigator>
                      ))
                    }
                  </View>
                </View>
              ))
            }
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default Index;
