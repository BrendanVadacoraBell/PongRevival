angular.module('pongRevival.controllers', [])

  .controller('LoginController', function (Backand, $state, $rootScope, LoginService, ToastService) {
    var login = this;

    function signin() {
      LoginService.signin(login.email, login.password)
        .then(function () {
          onLogin();
        }, function (error) {
          ToastService.toast(error.error_description);
        })
    }

    function anonymousLogin() {
      LoginService.anonymousLogin();
      onLogin();
    }

    function onLogin() {
      $rootScope.$broadcast('authorized');
      $state.go('profile');
    }

    function signout() {
      LoginService.signout()
        .then(function () {
          //$state.go('tab.login');
          $rootScope.$broadcast('logout');
          $state.go($state.current, {}, {reload: true});
        })

    }

    login.signin = signin;
    login.signout = signout;
    login.anonymousLogin = anonymousLogin;
  })

  .controller('UserController', function (UserModel, $rootScope, userData) {
    var user = this;

    user.details = userData;

    function clearData() {
      user.data = null;
    }

    user.isAuthorized = false;

    $rootScope.$on('authorized', function () {
      user.isAuthorized = true;
    });

    $rootScope.$on('logout', function () {
      clearData();
    });

    if (!user.isAuthorized) {
      $rootScope.$broadcast('logout');
    }

  });

