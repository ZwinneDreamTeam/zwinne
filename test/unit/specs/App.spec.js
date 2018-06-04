import Vue from 'vue'
import App from '@/App'

describe('App.vue', () => {
  it('should render correct toolbar title', () => {
    const Constructor = Vue.extend(App);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.toolbarTitle').textContent)
      .toEqual('Zwinne XD')
  });
});
