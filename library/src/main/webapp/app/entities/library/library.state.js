(function() {
    'use strict';

    angular
        .module('libchainApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('library', {
            parent: 'entity',
            url: '/library',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Libraries'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/library/libraries.html',
                    controller: 'LibraryController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('library-detail', {
            parent: 'library',
            url: '/library/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Library'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/library/library-detail.html',
                    controller: 'LibraryDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Library', function($stateParams, Library) {
                    return Library.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'library',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('library-detail.edit', {
            parent: 'library-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/library/library-dialog.html',
                    controller: 'LibraryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Library', function(Library) {
                            return Library.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('library.new', {
            parent: 'library',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/library/library-dialog.html',
                    controller: 'LibraryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                pubKey: null,
                                privKey: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('library', null, { reload: 'library' });
                }, function() {
                    $state.go('library');
                });
            }]
        })
        .state('library.edit', {
            parent: 'library',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/library/library-dialog.html',
                    controller: 'LibraryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Library', function(Library) {
                            return Library.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('library', null, { reload: 'library' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('library.delete', {
            parent: 'library',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/library/library-delete-dialog.html',
                    controller: 'LibraryDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Library', function(Library) {
                            return Library.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('library', null, { reload: 'library' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
