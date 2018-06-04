import Vue from 'vue'
import Moderator from '@/components/Moderator'

describe('Moderator.vue', () => {
  it('should render correct title', () => {
    const Constructor = Vue.extend(Moderator);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.title').textContent)
      .toEqual('Moderator')
  });

});
