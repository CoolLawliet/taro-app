import Taro, {Component} from '@tarojs/taro';
import {View,Button,Image,Swiper,SwiperItem,Text,RichText,Navigator} from "@tarojs/components";
import {request} from "../../request";
import './index.css'

class Main extends Component {
  config={
    "navigationBarTitleText":"商品详情"
  }
  state={
    goodsObj: {},
    // 商品是否被收藏
    isCollect:false,
    GoodsInfo: {},
  }

  componentWillMount() {
    // let pages = getCurrentPages();
    // let currentPage = pages[pages.length - 1];
    // let options = currentPage.options;
    const { goods_id } = this.$router.params;
    this.getGoodsDetail(goods_id);
  }
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.state.GoodsInfo = goodsObj
    // 1 获取缓存中的商品收藏的数组
    let collect = Taro.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.state.GoodsInfo.goods_id);

    this.setState({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别 webp图片格式
        // 最好找到后台 让他进行修改
        // 临时自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  }
  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    // 1 先构造要预览的图片数组
    const urls = this.state.GoodsInfo.pics.map(v => v.pics_mid);
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    Taro.previewImage({
      current,
      urls
    });
  }
  // 点击 加入购物车
  handleCartAdd() {
    // 1 获取缓存中的购物车 数组
    let cart = Taro.getStorageSync("cart") || [];
    // 2 判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.state.GoodsInfo.goods_id);
    if (index === -1) {
      //3  不存在 第一次添加
      this.state.GoodsInfo.num = 1;
      this.state.GoodsInfo.checked = true;
      cart.push(this.state.GoodsInfo);
    } else {
      // 4 已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 5 把购物车重新添加回缓存中
    Taro.setStorageSync("cart", cart);

    // 6 弹窗提示
    Taro.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户 手抖 疯狂点击按钮
      mask: true
    });
  }
  // 点击 商品收藏图标
  handleCollect(){
    let isCollect=false;
    // 1 获取缓存中的商品收藏数组
    let collect=Taro.getStorageSync("collect")||[];
    // 2 判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.state.GoodsInfo.goods_id);
    // 3 当index！=-1表示 已经收藏过
    if(index!==-1){
      // 能找到 已经收藏过了  在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      Taro.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });

    }else{
      // 没有收藏过
      collect.push(this.state.GoodsInfo);
      isCollect=true;
      Taro.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 4 把数组存入到缓存中
    Taro.setStorageSync("collect", collect);
    // 5 修改data中的属性  isCollect
    this.setState({
      isCollect
    })
  }

  render() {
    let {goodsObj,isCollect} = this.state
    return (
      <View>
        <View className="detail_swiper">
          <Swiper
            autoplay
            circular
            indicator-dots
          >
            {
              goodsObj.pics.map(item=>(
                <SwiperItem
                  key={item.pics_id}
                  onTap={this.handlePrevewImage}
                  data-url={item.pics_mid}
                >
                  <Image mode="widthFix" src={item.pics_mid}/>
                </SwiperItem>
              ))
            }
          </Swiper>
        </View>

        <View className="goods_price">￥{goodsObj.goods_price}</View>
        <View className="goods_name_row">
          <View className="goods_name">{goodsObj.goods_name}{goodsObj.goods_name}</View>
          <View className="goods_collect" onTap={this.handleCollect.bind(this)}>
            <Text className={isCollect?'icon-shoucang1 iconfont':'icon-shoucang iconfont'}/>
            <View className="collect_text">收藏</View>
          </View>
        </View>

        <View className="goods_info">
          <View className="goods_info_title">图文详情</View>
          <View className="goods_info_content">
            {/*富文本 */}
            {/*{{goodsObj.goods_introduce}}*/}
            <RichText nodes={goodsObj.goods_introduce}/>
          </View>
        </View>

        <View className="btm_tool">
          <View className="tool_item">
            <View className="iconfont icon-kefu"/>
            <View>客服</View>
            <Button open-type="contact"/>
          </View>
          <View className="tool_item">
            <View className="iconfont icon-yixianshi-"/>
            <View>分享</View>
            <Button open-type="share"/>
          </View>
          <Navigator open-type="switchTab" url="/pages/cart/index" className="tool_item">
            <View className="iconfont icon-gouwuche"/>
            <View>购物车</View>
          </Navigator>
          <View className="tool_item btn_cart " onTap={this.handleCartAdd}>
            加入购物车
          </View>
          <View className="tool_item btn_buy">
            立即购买
          </View>
        </View>
      </View>
    );
  }
}

export default Main;
