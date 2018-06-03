import Vue from 'vue'
import Login from '@/components/Login'


describe('Login.vue', () => {
  it('should render correct login header title', () => {
    const Constructor = Vue.extend(Login);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.loginHeader').textContent)
      .toEqual('Zaloguj się')
  });

  it('should render correct or title', () => {
    const Constructor = Vue.extend(Login);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.orTitle').textContent)
      .toEqual('Albo...')
  });

  it('should render correct login button', () => {
    const Constructor = Vue.extend(Login);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.logInButton').textContent)
      .toEqual('Kontynuuj z Google')
  });

  it('should render correct register button', () => {
    const Constructor = Vue.extend(Login);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.registerButton').textContent)
      .toEqual('Zarejestruj się')
  });

  it('should render correct confirm button', () => {
    const Constructor = Vue.extend(Login);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.confirmButton').textContent)
      .toEqual('Zaloguj')
  });

  it('should render correct reset title', () => {
    const Constructor = Vue.extend(Login);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.resetDialogTitle').textContent)
      .toEqual('Reset hasła')
  });

  it('should render correct reset placeholder', () => {
    const Constructor = Vue.extend(Login);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.resetDialogPlaceholder').textContent)
      .toEqual('Podaj adres e-mail na który wysłany zostanie link resetujący hasło')
  });

  it('should render correct confirm reset password', () => {
    const Constructor = Vue.extend(Login);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.forgotButton').textContent)
      .toEqual('Wyślij')
  });


});
