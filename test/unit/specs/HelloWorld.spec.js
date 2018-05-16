import Vue from 'vue'
import helloWorld from '@/components/HelloWorld'

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    var HellowWorld = helloWorld;
    const Constructor = Vue.extend(HellowWorld);
    const vm = new Constructor().$mount();
    const defaultData = HellowWorld.data();

    expect(defaultData.msg).toBe('Welcome to Your Vue.js App')
  })
})
