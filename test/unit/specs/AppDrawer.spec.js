import Vue from 'vue'
import AppDrawer from '@/components/AppDrawer'

describe('AppDrawer.vue', () => {
  it('should render correct general header title', () => {
    const Constructor = Vue.extend(AppDrawer);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.generalHeaderTitle').textContent)
      .toEqual('Ogólne')
  });

  it('should render correct position title', () => {
    const Constructor = Vue.extend(AppDrawer);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.positionsTitle').textContent)
      .toEqual('Stanowiska')
  });

  it('should render correct user profile title', () => {
    const Constructor = Vue.extend(AppDrawer);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.userProfileTitle').textContent)
      .toEqual(' Dane użytkownika ')
  });
});
