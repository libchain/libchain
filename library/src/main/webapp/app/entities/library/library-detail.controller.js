(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('LibraryDetailController', LibraryDetailController);

    LibraryDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Library', 'LibUser'];

    function LibraryDetailController($scope, $rootScope, $stateParams, previousState, entity, Library, LibUser) {
        var vm = this;

        vm.library = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('libchainApp:libraryUpdate', function(event, result) {
            vm.library = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
