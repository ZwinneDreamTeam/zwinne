import Vue from 'vue'
import helloWorld from '@/components/HelloWorld'

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    var HellowWorld = helloWorld;
    const Constructor = Vue.extend(HellowWorld)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('')
  })
})
