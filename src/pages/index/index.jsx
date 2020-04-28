import Taro, {Component} from '@tarojs/taro'
import {View, Swiper, SwiperItem, Image, Navigator} from '@tarojs/components'
import SearchInput from "../../components/SearchInput/SearchInput";
import {request} from "../../request";
import './index.css'

export default class Index extends Component {


  state = {
    // 轮播图数组
    swiperList: [],
    // 导航 数组
    // eslint-disable-next-line react/no-unused-state
    catesList: [],
    // 楼层数据
    floorList: []
  }

  componentWillMount() {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  }

  // 获取轮播图数据
  getSwiperList() {
    request({url: "/home/swiperdata"})
      .then(result => {
        this.setState({
          swiperList: result
        })
      })
  }

  // 获取 分类导航数据
  getCateList() {
    request({url: "/home/catitems"})
      .then(result => {
        this.setState({
          catesList: result
        })
      })
  }

  // 获取 楼层数据
  getFloorList() {
    request({url: "/home/floordata"})
      .then(result => {
        this.setState({
          floorList: result
        })
      })
  }

  config = {
    navigationBarTitleText: '优购首页'
  }

  render() {
    let {swiperList,catesList,floorList} = this.state
    return (
      <View className='pyg_index'>
        <SearchInput/>
        <View className='index_swiper'>
          <Swiper autoplay indicator-dots circular>
            {
              swiperList.map(item => (
                <SwiperItem
                  key={item.goods_id}
                >
                  <Navigator url={item.navigator_url}>
                    <Image mode='widthFix' src={item.image_src}/>
                  </Navigator>
                </SwiperItem>
              ))
            }

          </Swiper>
        </View>
        <View className='index_cate'>
          {
            catesList.map(item => (
              <Navigator
                key={item.name}
                url='/pages/category/index'
                open-type='switchTab'
              >
                <Image mode='widthFix' src={item.image_src}/>
              </Navigator>
            ))
          }

        </View>

        <View className='index_floor'>
          {
            floorList.map((item1,index1)=>(
              <View className='floor_group'
                    for-item={item1}
                    for-index={index1}
                    key={item.floor_title}
              >

                <View className='floor_title'>
                  <Image mode='widthFix' src={item1.floor_title.image_src}/>
                </View>

                <View className='floor_list'>
                  {
                    item1.product_list.map((item2,index2)=>(
                      <Navigator
                        for-item={item2}
                        for-index={index2}
                        key={item.name}
                        url={item2.navigator_url}
                      >
                        <Image mode={index2===0?'widthFix':'scaleToFill'} src={item2.image_src}/>
                      </Navigator>
                    ))
                  }

                </View>
              </View>
            ))
          }

        </View>
      </View>
    )
  }
}
