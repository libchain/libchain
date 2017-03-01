(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('LibUserDetailController', LibUserDetailController);

    LibUserDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'LibUser', 'Book', 'Library'];

    function LibUserDetailController($scope, $rootScope, $stateParams, previousState, entity, LibUser, Book, Library) {
        var vm = this;

        vm.libUser = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('libchainApp:libUserUpdate', function(event, result) {
            vm.libUser = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
