import Taro, {Component} from '@tarojs/taro';
import {View,Textarea,Button,Text,Icon} from "@tarojs/components";
import Tabs from "../../components/Tabs/Tabs";
import UpImg from "../../components/UpImg/UpImg";
import './index.css'

class Index extends Component {
  config={
    "navigationBarTitleText": "意见反馈"
  }
  state={
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    // 文本域的内容
    textVal: "",
    UpLoadImgs: [],
  }
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const index = e;
    // 2 修改源数组
    let { tabs } = this.state;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setState({
      tabs
    })
  }
  // 点击 “+” 选择图
  handleChooseImg() {
    // 2 调用小程序内置的选择图片api
    Taro.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式  原图  压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源  相册  照相机
      sourceType: ['album', 'camera'],
      success: (result) => {

        this.setState({
          // 图片数组 进行拼接
          chooseImgs: [...this.state.chooseImgs, ...result.tempFilePaths]
        })
      }
    });

  }
  // 点击 自定义图片组件
  handleRemoveImg(e) {
    // 2 获取被点击的组件的索引
    const { index } = e.currentTarget.dataset;
    // 3 获取data中的图片数组
    let { chooseImgs } = this.state;
    // 4 删除元素
    chooseImgs.splice(index, 1);
    this.setState({
      chooseImgs
    })
  }
  // 文本域的输入的事件
  handleTextInput(e) {
    this.setState({
      textVal: e.detail.value
    })
  }
  // 提交按钮的点击
  handleFormSubmit() {
    // 1 获取文本域的内容 图片数组
    const { textVal, chooseImgs } = this.state;
    // 2 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      Taro.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    // 3 准备上传图片 到专门的图片服务器
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传
    // 显示正在等待的图片
    Taro.showLoading({
      title: "正在上传中",
      mask: true
    });

    // 判断有没有需要上传的图片数组

    if (chooseImgs.length !== 0) {
      chooseImgs.forEach((v, i) => {
        Taro.uploadFile({
          // 图片要上传到哪里
          url: 'https://images.ac.cn/api/upload/upload',
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件  file
          name: "file",
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).url;
            this.state.UpLoadImgs.push(url);

            // 所有的图片都上传完毕了才触发
            if (i === chooseImgs.length - 1) {
              Taro.hideLoading();
              console.log("把文本的内容和外网的图片数组 提交到后台中");
              //  提交都成功了
              // 重置页面
              this.setState({
                textVal: "",
                chooseImgs: []
              })
              // 返回上一个页面
              Taro.navigateBack({
                delta: 1
              });

            }
          }
        });
      })
    }else{
      Taro.hideLoading();

      console.log("只是提交了文本");
      Taro.navigateBack({
        delta: 1
      });

    }
  }
  render() {
    let {tabs,textVal,chooseImgs} = this.state
    return (
      <Tabs tabs={tabs} onTabsItemChange={this.handleTabsItemChange.bind(this)} >
        <View class="fb_main">
          <View class="fb_title">问题的种类</View>
          <View class="fb_tips">
            <Text>功能建议</Text>
            <Text>购买遇到问题</Text>
            <Text>性能问题</Text>
            <Text>其他</Text>
          </View>
          <View class="fb_content">
            <Textarea value={textVal} onInput={this.handleTextInput} placeholder="请描述一下您的问题"> </Textarea>
            <View class="fb_tool">
              <Button onTap={this.handleChooseImg}>+</Button>
              {
                chooseImgs.map((item,index)=>(
                  <View class="up_img_item"
                        key={index}
                        onTap={this.handleRemoveImg}
                        data-index={index}
                  >
                    <UpImg src={item} />
                  </View>
                ))
              }
            </View>
          </View>
          <View class="form_btn_wrap">
            <Button onTap={this.handleFormSubmit}>
              <Icon  type="success_no_circle" size="23" color="white">
              </Icon>
              提交
            </Button>
          </View>
        </View>
      </Tabs>
    );
  }
}

export default Index;
