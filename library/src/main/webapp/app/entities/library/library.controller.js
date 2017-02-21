(function() {
    'use strict';

    angular
        .module('libchainApp')
        .controller('LibraryController', LibraryController);

    LibraryController.$inject = ['Library'];

    function LibraryController(Library) {
        var vm = this;

        vm.libraries = [];

        loadAll();

        function loadAll() {
            Library.query(function(result) {
                vm.libraries = result;
                vm.searchQuery = null;
            });
        }
    }
})();
