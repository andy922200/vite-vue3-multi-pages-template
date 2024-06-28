import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import Swiper from 'swiper'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { CSSSelector, SwiperOptions } from 'swiper/types'
import { nextTick } from 'vue'

const defaultSwiperConfig: SwiperOptions = {
  modules: [Navigation, Pagination, Autoplay],
  rewind: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
}

export const useSwiper = ({
  dom,
  config = {},
}: {
  dom: HTMLElement | CSSSelector
  config?: SwiperOptions
}) => {
  let swiper: Swiper | null = null

  const initSwiper = async () => {
    swiper = new Swiper(dom, {
      ...defaultSwiperConfig,
      ...config,
    })
    return swiper
  }

  const updateSwiper = async () => {
    await nextTick()
    if (swiper) {
      swiper.update()
    }
  }

  return {
    initSwiper,
    updateSwiper,
  }
}
