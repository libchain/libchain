(function() {
    'use strict';

    angular
        .module('libchainApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('lib-user', {
            parent: 'entity',
            url: '/lib-user',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'LibUsers'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/lib-user/lib-users.html',
                    controller: 'LibUserController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('lib-user-detail', {
            parent: 'lib-user',
            url: '/lib-user/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'LibUser'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/lib-user/lib-user-detail.html',
                    controller: 'LibUserDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'LibUser', function($stateParams, LibUser) {
                    return LibUser.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'lib-user',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('lib-user-detail.edit', {
            parent: 'lib-user-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/lib-user/lib-user-dialog.html',
                    controller: 'LibUserDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['LibUser', function(LibUser) {
                            return LibUser.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('lib-user.new', {
            parent: 'lib-user',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/lib-user/lib-user-dialog.html',
                    controller: 'LibUserDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                firstName: null,
                                lastName: null,
                                email: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('lib-user', null, { reload: 'lib-user' });
                }, function() {
                    $state.go('lib-user');
                });
            }]
        })
        .state('lib-user.edit', {
            parent: 'lib-user',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/lib-user/lib-user-dialog.html',
                    controller: 'LibUserDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['LibUser', function(LibUser) {
                            return LibUser.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('lib-user', null, { reload: 'lib-user' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('lib-user.delete', {
            parent: 'lib-user',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/lib-user/lib-user-delete-dialog.html',
                    controller: 'LibUserDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['LibUser', function(LibUser) {
                            return LibUser.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('lib-user', null, { reload: 'lib-user' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
