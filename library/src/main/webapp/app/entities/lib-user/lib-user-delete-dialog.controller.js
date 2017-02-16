(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('LibUserDeleteController',LibUserDeleteController);

    LibUserDeleteController.$inject = ['$uibModalInstance', 'entity', 'LibUser'];

    function LibUserDeleteController($uibModalInstance, entity, LibUser) {
        var vm = this;

        vm.libUser = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            LibUser.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
