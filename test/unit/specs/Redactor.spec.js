import Vue from 'vue'
import Redactor from '@/components/Redactor'

describe('UsersList.vue', () => {
  it('should render correct title', () => {
    const Constructor = Vue.extend(Redactor);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.title').textContent)
      .toEqual('Redactor')
  });

});
