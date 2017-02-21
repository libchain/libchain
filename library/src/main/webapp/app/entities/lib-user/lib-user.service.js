(function() {
    'use strict';
    angular
        .module('libchainApp')
        .factory('LibUser', LibUser);

    LibUser.$inject = ['$resource'];

    function LibUser ($resource) {
        var resourceUrl =  'api/lib-users/:id';

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
