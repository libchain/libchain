(function() {
    'use strict';

    angular
        .module('libchainApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('social-register', {
            parent: 'account',
            url: '/social-register/:provider?{success:boolean}',
            data: {
                authorities: [],
                pageTitle: 'Register with {{ label }}'
            },
            views: {
                'content@': {
                    templateUrl: 'app/account/social/social-register.html',
                    controller: 'SocialRegisterController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('social-auth', {
            parent: 'account',
            url: '/social-auth',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    controller: 'SocialAuthController'
                }
            }
        });
    }
})();
