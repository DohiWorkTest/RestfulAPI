
var App = angular.module("App", ['ngRoute', 'uiGmapgoogle-maps']);

App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/Home', {
                templateUrl: '/App/Views/home.html',
                controller: 'HomeController'
            })
            .when('/BundleList', {
                templateUrl: '/App/Views/bundleList.html',
                controller: 'BundleListController'
            })
            .when('/PathList', {
                templateUrl: '/App/Views/pathList.html',
                controller: 'PathListController'
            })
            .when('/PlaceList', {
                templateUrl: '/App/Views/placeList.html',
                controller: 'PlaceListController'
            })
            .when('/CreateNewBundle', {
                templateUrl: '/App/Views/createBundle.html',
                controller: 'CreateBundleController'
            })
            .when('/CreateNewPath', {
                templateUrl: '/App/Views/createPath.html',
                controller: 'CreatePathController'
            })
            .when('/CreateNewPlace', {
                templateUrl: '/App/Views/createPlace.html',
                controller: 'CreatePlaceController'
            })
            .when('/EditBundle/:Id', {
                templateUrl: '/App/Views/editBundle.html',
                controller: 'EditBundleController'
            })
            .when('/BundleDetails/:Id', {
                templateUrl: '/App/Views/bundleDetails.html',
                controller: 'BundleDetailsController'
            })
            .when('/EditPath/:Id', {
                templateUrl: '/App/Views/editPath.html',
                controller: 'EditPathController'
            })
            .when('/EditPlace/:Id', {
                templateUrl: '/App/Views/editPlace.html',
                controller: 'EditPlaceController'
            })
            .when('/DeleteBundle/:Id', {
                templateUrl: '/App/Views/deleteBundle.html',
                controller: 'DeleteBundleController'
            })
            .when('/DeletePath/:Id', {
                templateUrl: '/App/Views/deletePath.html',
                controller: 'DeletePathController'
            })
            .when('/DeletePlace/:Id', {
                templateUrl: '/App/Views/deletePlace.html',
                controller: 'DeletePlaceController'
            })
            .when('/PathDetails/:Id', {
                templateUrl: '/App/Views/pathDetails.html',
                controller: 'PathDetailsController'
            })
            .when('/PlaceDetails/:Id', {
                templateUrl: '/App/Views/placeDetails.html',
                controller: 'PlaceDetailsController'
            })

            .when('/hejigen', {
                templateUrl: '/App/Views/test.html',
                controller: 'TestController'
            })

            .otherwise({
                redirectTo: '/Home'
            });
    }])


    .controller('HomeController', ['$scope', '$http', function ($scope, $http) {
        $scope.message = "In home controller";
        $scope.paths = [];
        $scope.markers = [];
        $scope.polyline = { path: [] }
        $scope.map = { center: { latitude: 63.8258471, longitude: 20.2630354 }, zoom: 9 };

        $http.get("/api/paths").then(function (response) {
            $scope.paths = response.data;
            console.log(response.data);
        })

        $scope.showPlacesAndPolyline = function (path) {
            $scope.markers = [];
            $scope.marker = {};
            $scope.polyline = { path: [] };
            angular.forEach(path.Places, function (value, key) {
                $scope.markers.push({ id: value.Id, coords: { latitude: value.LocationLat, longitude: value.LocationLong }, fit: true })
            })
            console.log($scope.markers)

            $scope.polyline = { path: [], visible: true, draggable: false };
            angular.forEach($scope.markers, function (value, key) {
                $scope.polyline.path.push({ latitude: value.coords.latitude, longitude: value.coords.longitude })
            })
            console.log($scope.polyline);
        }
    }])

    .controller('DeleteBundleController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
        $scope.message = "DeleteBundleController"
        $scope.bundle = {};

        $http.get('/api/bundles/' + $routeParams.Id).then(function (response) {
            $scope.bundle = response.data;
        }, function () {
            console.log(response)
        });

        $scope.deleteBundle = function (bundle) {
            $http.delete('/api/bundles/' + bundle.Id).then(function (response) {
                console.log(response)
                $location.path('/BundleList')
            }, function () {
                console.log(response)
            })
        }


    }])

    .controller('DeletePathController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
        $scope.message = "DeletePathController"
        $scope.path = {};

        $http.get('/api/paths/' + $routeParams.Id).then(function (response) {
            $scope.path = response.data;
        }, function () {
            console.log(response)
        });

        $scope.deletePath = function (path) {
            $http.delete('/api/paths/' + path.Id).then(function (response) {
                console.log(response)
                $location.path('/PathList')
            }, function () {
                console.log(response)
            })
        }

    }])

    .controller('DeletePlaceController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
        $scope.message = "DeletePlaceController"
        $scope.place = {};

        $http.get('/api/places/' + $routeParams.Id).then(function (response) {
            $scope.place = response.data;
        }, function () {
            console.log(response)
        });

        $scope.deletePlace = function (place) {
            $http.delete('/api/places/' + place.Id).then(function (response) {
                console.log(response)
                $location.path('/PlaceList')
            }, function () {
                console.log(response)
            })
        }

    }])

    .controller('EditPathController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
        $scope.message = "Edit path controller";
        $scope.path = {};
        $scope.places = [];
        $scope.placesId = {};
        $scope.placesInPath = [];
        $scope.updatedPlacesInBundle = [];

        if ($routeParams.Id) {
            $scope.Id = $routeParams.Id;

            $http.get("/api/paths/" + $routeParams.Id).then(function (response) {
                $scope.path = response.data;
                angular.forEach($scope.path.Places, function (value, key) {
                    $scope.placesId[value.Id] = true;
                })
                console.log($scope.placesId);
            }, function () {
                console.log(response)
            })

            $http.get("/api/places").then(function (response) {
                angular.forEach(response.data, function (value, key) {
                    if (value.PathId == null || value.PathId == $routeParams.Id)
                        $scope.places.push(value)
                })
            }, function (data) {
                console.log(data)
            })

            $scope.checkPlaces = function (placesId) {
                $scope.updatedPlacesInBundle = [];
                angular.forEach(placesId, function (value, key) {
                    if (value == true) {
                        $scope.updatedPlacesInBundle.push(key);
                    }
                })
                console.log($scope.updatedPlacesInBundle)
            }, function () {
                console.log(response)
            }


            $scope.Update = function () {
                $scope.checkPlaces($scope.placesId);

                $scope.path.Places = [];
                angular.forEach($scope.places, function (place, placeIndex) {
                    angular.forEach($scope.updatedPlacesInBundle, function (value) {
                        if (value == place.Id) {
                            $scope.path.Places.push($scope.places[placeIndex]);
                            $scope.places[placeIndex].PathId = $scope.path.Id;
                        }
                    })
                })
                console.log($scope.path.Places);

                var data = {
                    Id: $scope.path.Id,
                    BundleId: $scope.path.BundleId,
                    Name: $scope.path.Name,
                    Places: $scope.path.Places,
                }

                console.log(data);
                $http.put("api/paths/" + $routeParams.Id, data).success(function (data) {
                    $location.path('/PathList');
                }, function (data) {
                    console.log(data)
                }, function () {
                    console.log(response)
                })
            }
        };
    }])

    .controller('EditBundleController', ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
        $scope.message = "In Edit Bundle controller";
        $scope.bundle = {};
        $scope.paths = [];
        $scope.pathsId = {};
        $scope.pathsInBundle = [];
        $scope.updatedPathsInBundle = [];

        if ($routeParams.Id) {
            $scope.Id = $routeParams.Id;

            $http.get("/api/bundles/" + $routeParams.Id).then(function (response) {
                $scope.bundle = response.data;
                angular.forEach($scope.bundle.Paths, function (value, key) {
                    $scope.pathsId[value.Id] = true;
                })
                console.log($scope.pathsId);
            }, function () {
                console.log(response)
            })

            $http.get("/api/paths").then(function (response) {
                angular.forEach(response.data, function (value, key) {
                    if (value.BundleId == null || value.BundleId == $routeParams.Id)
                        $scope.paths.push(value)
                })
            }, function (data) {
                console.log(data)
            })

            $scope.checkPaths = function (pathsId) {
                $scope.updatedPathsInBundle = [];
                angular.forEach(pathsId, function (value, key) {
                    if (value == true) {
                        $scope.updatedPathsInBundle.push(key);
                    }
                })
                console.log($scope.updatedPathsInBundle)
            }

            $scope.Update = function () {
                $scope.checkPaths($scope.pathsId);
                $scope.bundle.Paths = [];
                angular.forEach($scope.paths, function (path, pathIndex) {
                    angular.forEach($scope.updatedPathsInBundle, function (value) {
                        if (value == path.Id) {
                            $scope.bundle.Paths.push($scope.paths[pathIndex]);
                            $scope.paths[pathIndex].BundleId = $scope.bundle.Id;
                        }
                    })
                })
                console.log($scope.bundle.Paths);

                var data = {
                    Name: $scope.bundle.Name,
                    Id: $scope.bundle.Id,
                    Paths: $scope.bundle.Paths,
                }

                console.log(data);
                $http.put("api/bundles/" + $routeParams.Id, data).success(function (data) {
                    $location.path('/BundleList');
                }, function (data) {
                    console.log(data)
                }, function () {
                    console.log(response)
                })
            }
        }
    }])

    .controller("EditPlaceController", ['$scope', '$http', '$location', '$routeParams', function ($scope, $http, $location, $routeParams) {
        $scope.message = "EditPlaceController";
        $scope.marker = { id: 1 };
        $scope.place = {};
        $scope.map = { center: {} };

        if ($routeParams.Id) {
            $scope.Id = $routeParams.Id;

            $http.get("/api/places/" + $routeParams.Id).then(function (response) {
                $scope.place = response.data;
                console.log($scope.place)
                UpdateMapAndMarker();
            }, function () {
                console.log(response)
            })
        }

        $scope.Update = function () {
            var data = {
                Id: $scope.place.Id,
                Name: $scope.place.Name,
                LocationLat: $scope.marker.coords.latitude,
                LocationLong: $scope.marker.coords.longitude,
                PathId: $scope.place.PathId
            }
            $http.put("api/places/" + $routeParams.Id, data).success(function (data) {
                $location.path('/PlaceList');
            }, function (data) {
                console.log(data)
            }, function () {
                console.log(response)
            })
        }

        $scope.map = { center: { latitude: 63.8258471, longitude: 20.2630354 }, zoom: 11 }

        $scope.GetAddress = function (address) {
            if (address) {
                $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + " &key=AIzaSyAywoYLVN0tfCKuSQm3DCMIzZp0NPhUDMQ").then(function (response) {
                    $scope.addressInfo = response.data.results;
                    $scope.locationLat = response.data.results[0].geometry.location.lat;
                    $scope.locationLong = response.data.results[0].geometry.location.lng;
                    console.log($scope.addressInfo);
                    UpdateMapAndMarker();
                }, function () {
                    console.log(response)
                })
            }
        }

        var UpdateMapAndMarker = function () {
            if ($scope.locationLat == null || $scope.locationLong == null) {
                $scope.locationLat = $scope.place.LocationLat;
                $scope.locationLong = $scope.place.LocationLong;
            }
            $scope.marker = {
                id: 1,
                coords: {
                    latitude: $scope.locationLat,
                    longitude: $scope.locationLong
                },
            }
            $scope.map = { center: { latitude: $scope.marker.coords.latitude, longitude: $scope.marker.coords.longitude }, zoom: 11 }
        }
    }])

    .controller('CreatePlaceController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.message = "Create Place Controller";

        $scope.marker = { id: 1 };
        $scope.map = { center: {} };

        $scope.GetAddress = function (address) {
            if (address) {
                $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + " &key=AIzaSyAywoYLVN0tfCKuSQm3DCMIzZp0NPhUDMQ").then(function (response) {
                    $scope.addressInfo = response.data.results;
                    $scope.locationLat = response.data.results[0].geometry.location.lat;
                    $scope.locationLong = response.data.results[0].geometry.location.lng;
                    console.log($scope.addressInfo);
                    UpdateMapAndMarker();
                }, function () {
                    console.log(response)
                })
            }
        }

        var UpdateMapAndMarker = function () {
            if ($scope.marker.Id = 0) {
                $scope.map = { center: { latitude: 63.8258471, longitude: 20.2630354 }, zoom: 11 }
            }
            else {
                $scope.marker = {
                    id: 1,
                    coords: {
                        latitude: $scope.locationLat,
                        longitude: $scope.locationLong
                    },
                }
                $scope.map = { center: { latitude: $scope.marker.coords.latitude, longitude: $scope.marker.coords.longitude }, zoom: 11 }
            }
        }

        $scope.map = { center: { latitude: 63.8258471, longitude: 20.2630354 }, zoom: 11 }

        $scope.AddPlace = function () {
            if ($scope.marker.coords) {
                if ($scope.Name != null) {
                    var placeData = {
                        Name: $scope.Name,
                        LocationLat: $scope.marker.coords.latitude,
                        LocationLong: $scope.marker.coords.longitude
                    }
                    console.log(placeData);
                    $http.post("/api/places", placeData).then(function (data) {
                        $location.path("/BundleList");
                    }, function (data) {
                        console.log(data);
                    })
                }
                else {
                    window.alert("You need to enter a location of the place");
                }
            }
        }

    }])

    .controller('CreatePathController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.message = "Create new path controller";

        $scope.places = [];
        $scope.pathsIdd = {};
        $scope.includedPlaces = [];
        $scope.placesToAdd = [];

        $http.get("/api/places").then(function (response) {
            angular.forEach(response.data, function (value) {
                if (value.PathId == null)
                    $scope.places.push(value)
            }, function () {
                console.log(response)
            })
            console.log($scope.places);
        })

        $scope.checkPlaces = function (placesId) {
            console.log(placesId)
            $scope.placesToAdd = [];
            angular.forEach(placesId, function (value, key) {
                if (value == true) {
                    $scope.placesToAdd.push(key);
                }
            })
            console.log($scope.placesToAdd);
        }

        GetPlacesForBundle = function () {
            for (var i = 0; i < $scope.placesToAdd.length; i++)
                for (var j = 0; j < $scope.places.length ; j++)
                    if ($scope.placesToAdd[i] == $scope.places[j].Id)
                        $scope.includedPlaces.push($scope.places[j])
        }

        $scope.AddPath = function () {
            if ($scope.Name != null) {
                GetPlacesForBundle();
                var pathData = {
                    Name: $scope.Name,
                    Places: $scope.includedPlaces
                }
                console.log(pathData);
                $http.post("/api/paths/", pathData).then(function (data) {
                    $location.path("/BundleList");
                }, function (data) {
                    console.log(data);
                })
            }
        }
    }])

    .controller('CreateBundleController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.message = "Create new bundle controller";

        $scope.paths = [];
        $scope.pathsId = {};
        $scope.includedPaths = [];
        $scope.pathsToAdd = [];

        $http.get("/api/paths")
        .then(function (response) {
            angular.forEach(response.data, function (value) {
                if (value.BundleId == null)
                    $scope.paths.push(value);
            })
            console.log($scope.paths);
        }, function () {
            console.log(response)
        });

        $scope.checkPaths = function (pathsId) {
            console.log(pathsId)
            $scope.pathsToAdd = [];
            angular.forEach(pathsId, function (value, key) {
                if (value == true) {
                    $scope.pathsToAdd.push(key);
                }
            })
            console.log($scope.pathsToAdd)
        }

        GetPathsForBundle = function () {
            for (var i = 0; i < $scope.pathsToAdd.length; i++)
                for (var j = 0; j < $scope.paths.length ; j++)
                    if ($scope.pathsToAdd[i] == $scope.paths[j].Id)
                        $scope.includedPaths.push($scope.paths[j])
        }

        $scope.AddBundle = function () {
            if ($scope.Name != null) {
                GetPathsForBundle();
                var bundleData = {
                    Name: $scope.Name,
                    Paths: $scope.includedPaths
                }
                console.log(bundleData);
                $http.post("/api/bundles/PostBundle", bundleData)
                    .then(function (data) {
                        $location.path("/BundleList");
                    }, function (data) {
                        console.log(data);
                    })
            }
        }
    }])

    .controller("BundleListController", ['$scope', '$http', function ($scope, $http) {
        $scope.message = "BundleList controller";
        $scope.bundles = [];

        $http.get("/api/bundles")
        .then(function (response) {
            $scope.bundles = response.data;
            console.log($scope.bundles);
        }, function () {
            console.log(response)
        });
    }])

    .controller("PathListController", ['$scope', '$http', function ($scope, $http) {
        $scope.message = "PathList controller";
        $scope.paths = [];

        $http.get("/api/paths").then(function (response) {
            $scope.paths = response.data;
            console.log($scope.paths);
        }, function () {
            console.log(response)
        });
    }])

    .controller("PlaceListController", ['$scope', '$http', function ($scope, $http) {
        $scope.message = "BundleList controller";
        $scope.places = [];

        $http.get("/api/places")
        .then(function (response) {
            $scope.places = response.data;
            console.log($scope.places);
        }, function () {
            console.log(response)
        });
    }])

    .controller("PlaceDetailsController", ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $scope.message = "Place details controller"
        $scope.place = {};
        $scope.map = { center: {} }
        $scope.marker = { id: 1 };

        var UpdateMapAndMarker = function () {
            $scope.marker = {
                id: 1,
                coords: {
                    latitude: $scope.place.LocationLat,
                    longitude: $scope.place.LocationLong
                },
            }
            $scope.map = { center: { latitude: $scope.marker.coords.latitude, longitude: $scope.marker.coords.longitude }, zoom: 13 }
        }


        $http.get("/api/places/" + $routeParams.Id).then(function (response) {
            $scope.place = response.data;
            UpdateMapAndMarker();
        }, function () {
            console.log(response)
        })

    }])

    .controller("PathDetailsController", ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $scope.message = ""
        $scope.path = {};
        $scope.map = { center: {} }
        $scope.markers = [];
        $scope.polyline = { path: [] }

        $http.get("/api/paths/" + $routeParams.Id).then(function (response) {
            $scope.path = response.data;
            console.log($scope.path);
            $scope.markers = [];
            $scope.marker = {};
            $scope.polyline = { path: [] };
            angular.forEach($scope.path.Places, function (value, key) {
                $scope.markers.push({ id: value.Id, coords: { latitude: value.LocationLat, longitude: value.LocationLong }, fit: true })
            })
            $scope.polyline = { path: [], visible: true, draggable: false };
            angular.forEach($scope.markers, function (value, key) {
                $scope.polyline.path.push({ latitude: value.coords.latitude, longitude: value.coords.longitude })
            })
            console.log($scope.markers)
        }, function () {
            console.log(response)
        })
    }])

    .controller("BundleDetailsController", ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $scope.message = "BundleListController";
        $scope.bundle = {};
        $scope.markers = [];
        $scope.marker = { id: 1 };
        $scope.polyline = { path: [] }

        if ($routeParams.Id) {
            $scope.Id = $routeParams.Id;

            $http.get("/api/bundles/" + $routeParams.Id).then(function (response) {
                $scope.bundle = response.data;
                console.log(response.data);
            }, function () {
                console.log(response)
            })
        }

        $scope.showPlace = function (place) {
            $scope.markers = [];
            $scope.map = { center: { latitude: place.LocationLat, longitude: place.LocationLong }, zoom: 16 }
            $scope.marker = {
                id: 1,
                coords: {
                    latitude: place.LocationLat,
                    longitude: place.LocationLong
                },
            }
            console.log($scope.marker)
        }

        $scope.showPlacesOfPath = function (path) {
            $scope.markers = [];
            $scope.marker = {};
            $scope.polyline = { path: [] };
            angular.forEach(path.Places, function (value, key) {
                $scope.markers.push({ id: value.Id, coords: { latitude: value.LocationLat, longitude: value.LocationLong }, fit: true })
            })
            console.log($scope.markers)
        }

        $scope.drawPolyline = function () {
            if ($scope.polyline.visible == true) {
                $scope.polyline = { path: [] }
            }
            else {
                $scope.polyline = { path: [], visible: true, draggable: false };
                angular.forEach($scope.markers, function (value, key) {
                    $scope.polyline.path.push({ latitude: value.coords.latitude, longitude: value.coords.longitude })
                })
                console.log($scope.polyline);
            }
        }

        $scope.map = { center: { latitude: 63.8258471, longitude: 20.2630354 }, zoom: 11 }

    }])

    .controller("hejigenController", function ($scope) {
        $scope.message = "In hejigenController";
    })

    .controller("TestController", ['$scope', '$http', function ($scope, $http) {
        $scope.message = "In test controller"
        $scope.addressInfo = "";
        $scope.locationLat = "";
        $scope.locationLong = "";
        $scope.places = [];
        $scope.markers = [];
        $scope.polyline = { path: [] };

        $scope.GetAddress = function (address) {
            if (address) {
                $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + " &key=AIzaSyAywoYLVN0tfCKuSQm3DCMIzZp0NPhUDMQ").then(function (response) {
                    $scope.addressInfo = response.data.results;
                    $scope.locationLat = response.data.results[0].geometry.location.lat;
                    $scope.locationLong = response.data.results[0].geometry.location.lng;
                    console.log($scope.addressInfo);
                    UpdateMapAndMarker();
                })
            }
        }

        GetPlaces = function () {
            $http.get("/api/places").then(function (response) {
                $scope.places = response.data;
                console.log($scope.places);
            }, function (response) {
                console.log(response);
            })
        }
        GetPlaces();

        $scope.GetAddress('umeå, sweden');

        UpdateMapAndMarker = function () {
            $scope.polyline = { path: [] }
            $scope.map = { center: { latitude: $scope.locationLat, longitude: $scope.locationLong }, zoom: 11 }
            $scope.markers = [];
            $scope.markers[0] = {
                id: 1,
                coords: {
                    latitude: $scope.locationLat,
                    longitude: $scope.locationLong
                },
            }
            console.log($scope.markers)
        }
        $scope.map = { center: { latitude: "", longitude: "" }, zoom: 11 }


        $scope.showPlace = function (place) {
            $scope.polyline = { path: [] }
            $scope.map = { center: { latitude: place.LocationLat, longitude: place.LocationLong }, zoom: 16 }
            $scope.markers = [];
            $scope.markers[0] = {
                id: 1,
                coords: {
                    latitude: place.LocationLat,
                    longitude: place.LocationLong
                },
            }
        }

        $scope.showAllPlaces = function () {
            $scope.markers = [];
            $scope.polyline = {};
            angular.forEach($scope.places, function (value, key) {
                $scope.markers.push({ id: value.Id, coords: { latitude: value.LocationLat, longitude: value.LocationLong } })
            })
            console.log($scope.markers)
        }

        $scope.drawPolyline = function () {
            $scope.polyline = { path: [], visible: true, draggable: false };
            angular.forEach($scope.markers, function (value, key) {
                $scope.polyline.path.push({ latitude: value.coords.latitude, longitude: value.coords.longitude })
            })
            console.log($scope.polyline);
        }


    }])

