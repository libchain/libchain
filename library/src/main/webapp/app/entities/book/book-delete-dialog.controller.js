(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('BookDeleteController',BookDeleteController);

    BookDeleteController.$inject = ['$uibModalInstance', 'entity', 'Book'];

    function BookDeleteController($uibModalInstance, entity, Book) {
        var vm = this;

        vm.book = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Book.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
