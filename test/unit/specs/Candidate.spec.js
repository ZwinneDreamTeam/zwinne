import Vue from 'vue'
import Candidate from '@/components/Candidate'

describe('Candidate.vue', () => {
  it('should render correct title', () => {
    const Constructor = Vue.extend(Candidate);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.title').textContent)
      .toEqual('Candidate')
  });

});
