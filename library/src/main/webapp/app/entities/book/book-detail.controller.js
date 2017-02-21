(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('BookDetailController', BookDetailController);

    BookDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Book', 'LibUser'];

    function BookDetailController($scope, $rootScope, $stateParams, previousState, entity, Book, LibUser) {
        var vm = this;

        vm.book = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('libchainApp:bookUpdate', function(event, result) {
            vm.book = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
