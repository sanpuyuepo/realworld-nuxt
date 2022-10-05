import Vue from 'vue'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

Vue.filter('date', (val, format = 'LL') => {
  return dayjs(val).format(format)
})
