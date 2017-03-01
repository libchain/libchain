(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('LibUserController', LibUserController);

    LibUserController.$inject = ['LibUser'];

    function LibUserController(LibUser) {
        var vm = this;

        vm.libUsers = [];

        loadAll();

        function loadAll() {
            LibUser.query(function(result) {
                vm.libUsers = result;
                vm.searchQuery = null;
            });
        }
    }
})();
