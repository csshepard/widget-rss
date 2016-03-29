/*jshint expr:true */
"use strict";

describe("Feed Validator", function () {
  var $httpBackend, feedValidator;

  beforeEach(module("risevision.widget.rss.settings", function ($provide) {
    // need to mock xmlToJSON, it uses DOMParser
    $provide.value("$window", {
      xmlToJSON: {
        parseString: function (xmlString) {
          if (xmlString.indexOf("http://test.com/valid") !== -1) {
            return validFeedJSON;
          }
          else if (xmlString.indexOf("http://test.com/invalid") !== -1) {
            return invalidFeedJSON;
          }
        }
      }
    });
  }));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get("$httpBackend");

    $httpBackend.when("GET", "https://proxy.risevision.com/https://validator.w3.org/feed/check.cgi?url=http://test.com/valid&output=soap12")
      .respond(validFeedResponse);

    $httpBackend.when("GET", "https://proxy.risevision.com/https://validator.w3.org/feed/check.cgi?url=http://test.com/invalid&output=soap12")
      .respond(invalidFeedResponse);
  }));


  beforeEach(inject(function(_feedValidator_) {
    feedValidator = _feedValidator_;
  }));

  describe("feedValidator", function() {
    it("should exist", function() {
      expect(feedValidator).to.be.defined;
    });
  });

  describe("isValid", function() {
    it("should exist", function() {
      expect(feedValidator.isValid).be.defined;
      expect(feedValidator.isValid).to.be.a("function");
    });

    it("should return a value of true when feed is deemed W3C valid", function (done) {
      feedValidator.isValid("http://test.com/valid").then(function (value) {
        expect(value).to.be.true;
        done();
      });

      $httpBackend.flush();
    });

    it("should return a value of false when feed is deemed W3C invalid", function (done) {
      feedValidator.isValid("http://test.com/invalid").then(function (value) {
        expect(value).to.be.false;
        done();
      });

      $httpBackend.flush();

    });

  });

});
