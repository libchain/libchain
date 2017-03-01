(function() {
    'use strict';
    angular
        .module('libchainApp')
        .factory('Library', Library);

    Library.$inject = ['$resource'];

    function Library ($resource) {
        var resourceUrl =  'api/libraries/:id';

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
