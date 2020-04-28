import Taro,{Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './Tabs.css'

class Tabs extends Component {
  // 点击事件
  handleItemTap(e){
    // 1 获取点击的索引
    const {index}=e.currentTarget.dataset;
    // 2 触发 父组件中的事件 自定义\
    // console.log(this.props)
    this.props.onTabsItemChange(index);

  }


  render() {
   let {tabs} = this.props
    return (
      <View class='tabs'>
        <View class='tabs_title'>
          {
            tabs.map((item,index)=>(
              <View
                key={item.id}
                class={item.isActive?'title_item active':'title_item'}
                onTap={this.handleItemTap}
                data-index={index}
              >
                {item.value}
              </View>
            ))
          }
        </View>
        <View className='tabs_content'>
          <slot></slot>
        </View>
      </View>
    );
  }
}

export default Tabs;
