import Taro, {Component} from '@tarojs/taro';
import {View,Input,Navigator,Button} from "@tarojs/components";
import {request} from "../../request";
import './index.css'

class Index extends Component {
  config={
    "navigationBarTitleText":"搜索中心"
  }
  state={
    goods:[],
    // 取消 按钮 是否显示
    isFocus:false,
    // 输入框的值
    inpValue:"",
    TimeId:-1,
  }
  // 输入框的值改变 就会触发的事件
  handleInput(e){
    // 1 获取输入框的值
    const {value}=e.detail;
    // 2 检测合法性
    if(!value.trim()){
      this.setState({
        goods:[],
        isFocus:false
      })
      // 值不合法
      return;
    }
    // 3 准备发送请求获取数据
    this.setState({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  }
  // 发送请求获取搜索建议 数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    // console.log(res);
    this.setState({
      goods:res
    })
  }
  // 点击 取消按钮
  handleCancel(){
    this.setState({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
  render() {
    let {inpValue,goods} = this.state
    return (
      <View>
        <View className="search_row">
          <Input value={inpValue} placeholder="请输入您要搜索的商品" onInput={this.handleInput}> </Input>
          <Button className="search_button" onTap={this.handleCancel} hidden={!isFocus}>取消</Button>
        </View>
        <View className="search_content">
          {
            goods.map(item=>(
              <Navigator url={'/pages/goods_detail/main?goods_id='+item.goods_id} className="search_item"
                         key={item.goods_id}>
                {item.goods_name}
              </Navigator>
            ))
          }
        </View>
      </View>
    );
  }
}

export default Index;
