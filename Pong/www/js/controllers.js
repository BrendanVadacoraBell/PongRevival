angular.module('pongRevival.controllers', [])

    .controller('LoginController', function (Backand, $state, $rootScope, LoginService, ToastService) {
        var login = this;

        function signin() {
            console.log(login.email);
            LoginService.signin(login.email, login.password)
                .then(function () {
                    onLogin();
                }, function (error) {
                    ToastService.toast(error.error_description);
                    console.log(error);
                })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();
        }

        function onLogin(){
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

    .controller('UserController', function (ItemsModel, $rootScope) {
        var user = this;

        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        function getAll() {
            ItemsModel.all()
                .then(function (result) {
                    user.data = result.data.data;
                });
        }

        function clearData(){
            user.data = null;
        }

        function create(object) {
            ItemsModel.create(object)
                .then(function (result) {
                    cancelCreate();
                    getAll();
                });
        }

        function update(object) {
            ItemsModel.update(object.id, object)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function deleteObject(id) {
            ItemsModel.delete(id)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {
            user.newObject = {name: '', description: ''};
        }

        function setEdited(object) {
            user.edited = angular.copy(object);
            user.isEditing = true;
        }

        function isCurrent(id) {
            return user.edited !== null && user.edited.id === id;
        }

        function cancelEditing() {
            user.edited = null;
            user.isEditing = false;
        }

        function cancelCreate() {
            initCreateForm();
            user.isCreating = false;
        }

        user.objects = [];
        user.edited = null;
        user.isEditing = false;
        user.isCreating = false;
        user.getAll = getAll;
        user.create = create;
        user.update = update;
        user.delete = deleteObject;
        user.setEdited = setEdited;
        user.isCurrent = isCurrent;
        user.cancelEditing = cancelEditing;
        user.cancelCreate = cancelCreate;
        user.goToBackand = goToBackand;
        user.isAuthorized = false;

        $rootScope.$on('authorized', function () {
            user.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!user.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();

    });

