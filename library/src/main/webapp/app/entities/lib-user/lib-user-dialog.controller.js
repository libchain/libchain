(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('LibUserDialogController', LibUserDialogController);

    LibUserDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'LibUser', 'Book', 'Library'];

    function LibUserDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, LibUser, Book, Library) {
        var vm = this;

        vm.libUser = entity;
        vm.clear = clear;
        vm.save = save;
        vm.books = Book.query();
        vm.libraries = Library.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.libUser.id !== null) {
                LibUser.update(vm.libUser, onSaveSuccess, onSaveError);
            } else {
                LibUser.save(vm.libUser, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('libchainApp:libUserUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
