import Taro, {Component} from '@tarojs/taro';
import {View, Image, Block, Navigator} from "@tarojs/components";
import SearchInput from "../../components/SearchInput/SearchInput";
import Tabs from "../../components/Tabs/Tabs";
import {request} from "../../request";
import './index.css'

class Index extends Component {
  config = {
    "navigationBarTitleText": "商品列表",
    "enablePullDownRefresh": true,
    "backgroundTextStyle": "dark"
  }
  state = {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: [],
    // 接口要的参数
    QueryParams: {
      query: "",
      cid: "",
      pagenum: 1,
      pagesize: 10
    },
    // 总页数
    totalPages: 1,
  }

  componentWillMount() {
    this.state.QueryParams.cid = this.$router.params.cid || "";
    this.state.QueryParams.query = this.$router.params.query || "";
    this.getGoodsList();
  }

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({url: "/goods/search", data: this.state.QueryParams});
    // 获取 总条数
    const total = res.total;
    // 计算总页数
    this.state.totalPages = Math.ceil(total / this.state.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setState({
      // 拼接了数组
      goodsList: [...this.state.goodsList, ...res.goods]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
    Taro.stopPullDownRefresh();

  }


  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const index = e;
    // 2 修改源数组
    let {tabs} = this.state;
    tabs.map((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setState({
      tabs
    })
  }

  // 页面上滑 滚动条触底事件
  onReachBottom() {
    //  1 判断还有没有下一页数据
    if (this.state.QueryParams.pagenum >= this.state.totalPages) {
      // 没有下一页数据
      //  console.log('%c'+"没有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      Taro.showToast({title: '没有下一页数据'});

    } else {
      // 还有下一页数据
      //  console.log('%c'+"有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      this.state.QueryParams.pagenum++;
      this.getGoodsList();
    }
  }

  // 下拉刷新事件
  onPullDownRefresh() {
    // 1 重置数组
    this.setState({
      goodsList: []
    })
    // 2 重置页码
    this.state.QueryParams.pagenum = 1;
    // 3 发送请求
    this.getGoodsList();
  }

  render() {
    let {tabs, goodsList, QueryParams, totalPages} = this.state
    let list =null
    if (tabs[0].isActive){
      list=
        <View class="first_tab">
          {
            goodsList.map(item=>(
              <Navigator class="goods_item"
                         key={item.goods_id}
                         url={'/pages/goods_detail/main?goods_id='+item.goods_id}
              >
                <View class="goods_img_wrap">
                  <Image mode="widthFix"
                         src={item.goods_small_logo?item.goods_small_logo:'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'}/>
                </View>
                <View class="goods_info_wrap">
                  <View class="goods_name">{item.goods_name}</View>
                  <View class="goods_price">￥{item.goods_price}</View>
                </View>
              </Navigator>
            ))
          }
        </View>
    }else if (tabs[1].isActive){
      list =<View>暂无数据</View>
    }else if (tabs[2].isActive){
      list =<View>暂无数据</View>
    }
    return (
      <View>
        <SearchInput/>
        {/*监听自定义事件*/}
        <Tabs tabs={tabs} onTabsItemChange={this.handleTabsItemChange.bind(this)}>
          {list}
        </Tabs>
      </View>
    );
  }
}

export default Index;
