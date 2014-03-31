// ---------------------------------------------------------------------------------------------------------------------
// Brief Description of ng-tags.js.
//
// @module ng-tags.js
// ---------------------------------------------------------------------------------------------------------------------

var module = angular.module('ui.ngTags', ['ui.ngTags.templates']);

// ---------------------------------------------------------------------------------------------------------------------

function NGTagsController($scope)
{
    var self = this;

    // Setup our default events
    this.events = {
        enter: true,
        space: false,
        comma: false
    }; // end events

    // Default tag class
    $scope.getTagsClass = function(){ return 'label-default'; };

    // -----------------------------------------------------------------------------------------------------------------
    // Setup
    // -----------------------------------------------------------------------------------------------------------------

    // Filter tags
    if($scope.uniqueTags())
    {
        $scope.tags = $scope.tags.filter(function(elem, pos, self) {
            return self.indexOf(elem) == pos;
        });
    } // end if

    // Setup events
    if($scope.tagEvents())
    {
        // Undo default
        this.events.enter = false;

        // Split on spaces
        $scope.tagEvents().split(' ').forEach(function(event) {
            self.events[event] = true;
        });
    } // end if

    // -----------------------------------------------------------------------------------------------------------------
    // Watches
    // -----------------------------------------------------------------------------------------------------------------

    // Handle tagClass property
    $scope.$watch(function(){ return $scope.tagClass(); }, function(tagsClass)
    {
        if(tagsClass)
        {
            if(typeof tagsClass == 'function')
            {
                $scope.getTagsClass = tagsClass;
            } // end if

            if(typeof tagsClass == 'string')
            {
                $scope.getTagsClass = function(){ return tagsClass; };
            } // end if
        } // end if
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$on('enter pressed', function()
    {
        if(self.events.enter)
        {
            self.addTag($scope, $scope.newTag);
        } // end if
    });

    $scope.$on('space pressed', function()
    {
        if(self.events.space)
        {
            self.addTag($scope, $scope.newTag);
        } // end if
    });

    $scope.$on('comma pressed', function()
    {
        if(self.events.comma)
        {
            self.addTag($scope, $scope.newTag);
        } // end if
    });

    $scope.$on('backspace pressed', function()
    {
        $scope.tags.pop();
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.removeTag = function(tag)
    {
        var index = $scope.tags.indexOf(tag);

        if(index >= 0)
        {
            $scope.tags.splice(index, 1);
        } // end if
    };
} // end NGTagsController

NGTagsController.prototype.addTag = function($scope, tag)
{
    // If our model isn't created yet, build it.
    if(!$scope.tags || !Array.isArray($scope.tags))
    {
        $scope.tags = [];
    } // end if

    tag = angular.copy(tag);

    if($scope.replaceSpaces() && !this.events.space)
    {
        tag = tag.replace(/\s/g, '-');
    } // end if

    if(!$scope.uniqueTags() || $scope.tags.indexOf(tag) == -1)
    {
        $scope.tags.push(tag);
    } // end if

    $scope.$broadcast('clear');
}; // end addTag

module.controller('NGTagsController', ['$scope', NGTagsController]);

// ---------------------------------------------------------------------------------------------------------------------

module.directive('ngTags', function()
{
    return {
        restrict: 'E',
        scope: {
            tags: '=model',
            tagClass: '&',
            tagEvents: '&events',
            replaceSpaces: '&',
            uniqueTags: '&uniqueTags'
        },
        templateUrl: '/tags.html',
        link: function(scope, element) {
            var inputElem = element.children().children();

            // Focus the tags-input element instead
            element.bind('focus click', function()
            {
                inputElem[0].focus();
            });
        },
        controller: ['$scope', NGTagsController]
    }
});

// ---------------------------------------------------------------------------------------------------------------------

module.directive('tagsInput', function() {
    return {
        restrict: 'E',
        require: '?ngModel',
        template: '<span contenteditable="true" class="tags-input"></span>',
        link: function(scope, element, attr, ngModel) {

            var placeholderHtml = "<span class=\"placeholder\">" + attr.placeholder + "</span>";

            function read()
            {
                return ngModel.$setViewValue(element.html().trim().replace(/(&nbsp;|<br>)/g, ''));
            }

            // ---------------------------------------------------------------------------------------------------------
            // Setup
            // ---------------------------------------------------------------------------------------------------------

            // If we don't have ngModel, we don't do anything.
            if (!ngModel)
            {
                return;
            } // end if

            // String.trim polyfill
            if (!String.prototype.trim) {
                String.prototype.trim = function () {
                    return this.replace(/^\s+|\s+$/gm, '');
                };
            }

            // Setup the ngModel.$render function
            ngModel.$render = function()
            {
                var content = ngModel.$viewValue;

                if(!content || content.trim() == "")
                {
                    content = placeholderHtml;
                } // end if

                return element.html(content.trim());
            };

            // Configure listening on certain keys
            // Setup our default events
            events = {
                enter: true,
                space: false,
                comma: false
            }; // end events

            if(attr.events)
            {
                attr.events.split(' ').forEach(function(event) {
                    self.events[event] = true;
                });
            } // end if

            // ---------------------------------------------------------------------------------------------------------
            // Events
            // ---------------------------------------------------------------------------------------------------------

            scope.$on('clear', function()
            {
                element.html('');
            });

            // ---------------------------------------------------------------------------------------------------------
            // DOM Events
            // ---------------------------------------------------------------------------------------------------------

            element.bind('focus', function()
            {
                if(element.html().trim() == placeholderHtml)
                {
                    element.html('');
                }
            });

            element.bind('blur', ngModel.$render);

            // Tell our parent directive about our events
            element.bind('keydown', function(event)
            {
                scope.$apply(function()
                {
                    switch(event.which)
                    {
                        case 32:
                            if(events.space)
                            {
                                scope.$emit('space pressed');
                                event.preventDefault();
                                event.stopPropagation();
                            } // end if
                            break;
                        case 13:
                            if(events.enter)
                            {
                                scope.$emit('enter pressed');
                                event.preventDefault();
                                event.stopPropagation();
                            } // end if
                            break;
                        case 188:
                            if(events.comma)
                            {
                                scope.$emit('comma pressed');
                                event.preventDefault();
                                event.stopPropagation();
                            } // end if
                            break;
                        case 8:
                            if(element.html().trim() == '')
                            {
                                scope.$emit('backspace pressed');
                                event.preventDefault();
                                event.stopPropagation();
                            } // end if
                            break;
                    } // end switch
                });
            });

            element.bind('blur keyup change', function()
            {
                if ((ngModel.$viewValue !== element.html().trim()) && (element.html().trim() != placeholderHtml))
                {
                    return scope.$apply(read);
                } // end if
            });

            // ---------------------------------------------------------------------------------------------------------
        },
        replace: true
    };
});

// ---------------------------------------------------------------------------------------------------------------------


