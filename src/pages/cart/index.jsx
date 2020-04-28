import Taro, {Component} from '@tarojs/taro';
import {View,Button,Block,CheckboxGroup,Navigator,Image,Text,Checkbox} from "@tarojs/components";
import {request} from "../../request";
import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
import './index.css'

class Index extends Component {
  config={
    "navigationBarTitleText":"购物车"
  }
  state={
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  }

  componentDidShow() {
    // 1 获取缓存中的收货地址信息
    const address = Taro.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    const cart = Taro.getStorageSync("cart") || [];

    this.setState({ address });
    this.setCart(cart);
  }
  async handleChooseAddress() {
    try {
      // 1 获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2 判断 权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 4 调用获取收货地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      // 5 存入到缓存中
      Taro.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  }
  // 商品的选中
  handeItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let { cart } = this.state;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);

  }
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length !== 0 ? allChecked : false;
    this.setState({
      cart,
      totalPrice, totalNum, allChecked
    });
    Taro.setStorageSync("cart", cart);
  }
  // 商品全选功能
  handleItemAllCheck() {
    // 1 获取data中的数据
    let { cart, allChecked } = this.state;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  }
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let { cart } = this.state;
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4  进行修改数量
      cart[index].num += operation;
      // 5 设置回缓存和data中
      this.setCart(cart);
    }
  }
  // 点击 结算
  async handlePay(){
    // 1 判断收货地址
    const {address,totalNum}=this.state;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 2 判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return ;
    }
    // 3 跳转到 支付页面
    Taro.navigateTo({
      url: '/pages/pay/index'
    });

  }


  render() {
    let {address,cart,allChecked,totalPrice,totalNum} = this.state
    let getAddress=null
    if (!address.userName){
      getAddress=
        // <!-- 当收货地址 不存在 按钮显示  对象 空对象 bool类型也是true  -->
        <View class="address_btn">
        <Button onTap={this.handleChooseAddress} type="primary"  plain >获取收货地址</Button>
      </View>
    }else{
      getAddress=
        // <!-- 当收货地址 存在 详细信息就显示 -->
        <View class="user_info_row" >
          <View class="user_info">
            <View>{address.userName}</View>
            <View>{address.all}</View>
          </View>
          <View class="user_phone">{address.telNumber}</View>
        </View>
    }
    let cartList =null
    if (cart.length!==0){
      cartList =<Block>
        {
          cart.map(item=>(
            <View class="cart_item"
                  key={item.goods_id}
            >
              {/*// <!-- 复选框 -->*/}
              <View class="cart_chk_wrap">
                <CheckboxGroup data-id={item.goods_id} onChange={this.handeItemChange}>
                  <Checkbox checked={item.checked}/>
                </CheckboxGroup>
              </View>
              {/*// <!-- 商品图片 -->*/}
              <Navigator class="cart_img_wrap">
                <Image mode="widthFix" src={item.goods_small_logo} />
              </Navigator>
              {/*// <!-- 商品信/息 -->*/}
              <View class="cart_info_wrap">
                <View class="goods_name">{item.goods_name}</View>
                <View class="goods_price_wrap">
                  <View class="goods_price">￥{item.goods_price}</View>
                  <View class="cart_num_tool">
                    <View onTap={this.handleItemNumEdit} data-id={item.goods_id} data-operation={-1}  class="num_edit">-</View>
                    <View class="goods_num">{item.num}</View>
                    <View onTap={this.handleItemNumEdit} data-id={item.goods_id} data-operation={1}  class="num_edit">+</View>
                  </View>
                </View>
              </View>
            </View>
          ))
        }
      </Block>
    }else {
        cartList=<Image mode="widthFix" src="http://hbimg.b0.upaiyun.com/e1b1467beea0a9c7d6a56b32bac6d7e5dcd914f7c3e6-YTwUd6_fw658" />
    }
    return (
      <View>
        {/*// <!-- 收货地址 -->*/}
        <View class="revice_address_row">
          {getAddress}
        </View>
        {/*// <!-- 购物车内容 -->*/}
        <View class="cart_content">
          <View class="cart_title">购物车</View>
          <View class="cart_main">
            {/*// <!-- 当cart数组 长度不为0 显示 商品信息 -->*/}
            {cartList}
          </View>
        </View>

        {/*// <!-- 底部工具栏 -->*/}
        <View class="footer_tool">
          {/*// <!-- 全选 -->*/}
          <View class="all_chk_wrap">
            <CheckboxGroup onChange={this.handleItemAllCheck}>
              <Checkbox checked={allChecked}>全选</Checkbox>
            </CheckboxGroup>
          </View>
          {/*// <!-- 总价格 -->*/}
          <View class="total_price_wrap">
            <View class="total_price">
              合计: <Text class="total_price_text">￥{totalPrice}</Text>
            </View>
            <View>包含运费</View>
          </View>
          {/*// <!-- 结算 -->*/}
          <View class="order_pay_wrap" onTap={this.handlePay} >
            结算({totalNum})
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
