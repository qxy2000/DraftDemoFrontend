import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Draft from '@/components/Draft'
import result from '@/components/result'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Draft',
      component: Draft
    },
    {
      path: '/result',
      name: 'result',
      component: ()=>import('@/components/result')
    }
  ]
})
