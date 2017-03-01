(function() {
    'use strict';
    angular
        .module('libchainApp')
        .factory('Book', Book);

    Book.$inject = ['$resource'];

    function Book ($resource) {
        var resourceUrl =  'api/books/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
