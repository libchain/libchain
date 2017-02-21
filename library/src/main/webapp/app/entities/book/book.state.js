(function() {
    'use strict';

    angular
        .module('libchainApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('book', {
            parent: 'entity',
            url: '/book',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Books'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/book/books.html',
                    controller: 'BookController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('book-detail', {
            parent: 'book',
            url: '/book/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Book'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/book/book-detail.html',
                    controller: 'BookDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Book', function($stateParams, Book) {
                    return Book.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'book',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('book-detail.edit', {
            parent: 'book-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/book/book-dialog.html',
                    controller: 'BookDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Book', function(Book) {
                            return Book.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('book.new', {
            parent: 'book',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/book/book-dialog.html',
                    controller: 'BookDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                title: null,
                                pubKey: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('book', null, { reload: 'book' });
                }, function() {
                    $state.go('book');
                });
            }]
        })
        .state('book.edit', {
            parent: 'book',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/book/book-dialog.html',
                    controller: 'BookDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Book', function(Book) {
                            return Book.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('book', null, { reload: 'book' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('book.delete', {
            parent: 'book',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/book/book-delete-dialog.html',
                    controller: 'BookDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Book', function(Book) {
                            return Book.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('book', null, { reload: 'book' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
