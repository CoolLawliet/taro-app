import Taro,{Component} from '@tarojs/taro'
import {View,Image} from '@tarojs/components'
import './UpImg.css'

class UpImg extends Component {
  render() {
    let {src} = this.props
    return (
      <View className='up_img_wrap'>
        <Image src={src} />
        <icon type='clear' size='23' color='red'>

        </icon>

      </View>
    );
  }
}

export default UpImg;
