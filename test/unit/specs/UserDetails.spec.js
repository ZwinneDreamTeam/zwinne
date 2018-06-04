import Vue from 'vue'
import UserDetails from '@/components/UserDetails'

describe('UserDetails.vue', () => {
  it('should render correct toolbar title', () => {
    const Constructor = Vue.extend(UserDetails);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.toolbarTitle').textContent)
      .toEqual('Dane użytkownika')
  });

  it('should render correct edit User label', () => {
    const Constructor = Vue.extend(UserDetails);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.editUserLabel').textContent)
      .toEqual('Nazwa użytkownika')
  });

  it('should render correct edit Email label', () => {
    const Constructor = Vue.extend(UserDetails);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.editEmailLabel').textContent)
      .toEqual('Email')
  });

  it('should render correct edit button', () => {
    const Constructor = Vue.extend(UserDetails);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.editButton').textContent)
      .toEqual(' Edit ')
  });
});
