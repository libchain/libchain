(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('LibraryDeleteController',LibraryDeleteController);

    LibraryDeleteController.$inject = ['$uibModalInstance', 'entity', 'Library'];

    function LibraryDeleteController($uibModalInstance, entity, Library) {
        var vm = this;

        vm.library = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Library.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
