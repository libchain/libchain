(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('LibraryDialogController', LibraryDialogController);

    LibraryDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Library', 'LibUser'];

    function LibraryDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Library, LibUser) {
        var vm = this;

        vm.library = entity;
        vm.clear = clear;
        vm.save = save;
        vm.libusers = LibUser.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.library.id !== null) {
                Library.update(vm.library, onSaveSuccess, onSaveError);
            } else {
                Library.save(vm.library, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('libchainApp:libraryUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
