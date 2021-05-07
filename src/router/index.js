import Vue from 'vue'
import Router from 'vue-router'
import Draft from '@/views/Draft'
import Introduce from '@/views/Introduce'
import Display from '@/views/Display'
import DraftSearch from '@/views/DraftSearch'
import result from '@/views/result'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Introduce',
      component: Introduce
    },
    {
      path: '/draft',
      name: 'Draft',
      component: Draft
    },
    {
      path: '/display',
      name: 'Display',
      component: Display
    },
    {
      path: '/draftsearch',
      name: 'DraftSearch',
      component: DraftSearch
    },
    {
      path: '/result',
      name: 'result',
      component: ()=>import('@/views/result')
    }
  ]
})
