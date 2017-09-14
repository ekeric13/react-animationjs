'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Anime = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var anime = typeof window !== 'undefined' ? require('animejs') : function (_) {
  return _;
};

function filterNullEls(el) {
  return el !== null;
}

function filterNullKeys(el) {
  return el.key !== null;
}

function createKeyHash(hash, el) {
  hash[el.key] = true;
  return hash;
}

var Anime = exports.Anime = function (_Component) {
  _inherits(Anime, _Component);

  function Anime(props) {
    _classCallCheck(this, Anime);

    // Current Anime DOM Targets
    var _this = _possibleConstructorReturn(this, (Anime.__proto__ || Object.getPrototypeOf(Anime)).call(this, props));

    _initialiseProps.call(_this);

    _this.targets = [];

    // Time based children store
    var children = props.children;

    if (!Array.isArray(children)) children = [children];
    _this.children = {
      cur: children
    };
    return _this;
  }

  _createClass(Anime, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateAnime();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var children = nextProps.children;

      var prevChildren = this.props.children;

      if (!Array.isArray(children)) children = [children];
      if (!Array.isArray(prevChildren)) prevChildren = [prevChildren];

      var filteredChildren = children.filter(filterNullEls);
      var filteredPrevChildren = prevChildren.filter(filterNullEls);
      // new child added
      if (filteredChildren.length > filteredPrevChildren.length) {
        var filteredPrevChildrenHash = filteredPrevChildren.filter(filterNullKeys).reduce(createKeyHash, {});
        var addedChildren = filteredChildren.filter(filterNullKeys).filter(function (el) {
          return !filteredPrevChildrenHash.hasOwnProperty(el.key);
        });
        this.props.onEnter(addedChildren);
        // child removed
      } else if (filteredChildren.length < filteredPrevChildren.length) {
        var filteredChildrenHash = filteredChildren.filter(filterNullKeys).reduce(createKeyHash, {});
        var removedChildren = filteredPrevChildren.filter(filterNullKeys).filter(function (el) {
          return !filteredChildrenHash.hasOwnProperty(el.key);
        });
        this.props.onExit(removedChildren);
      }

      this.children = {
        cur: children
      };

      this.updateAnime(nextProps);
    }

    // componentDidUpdate() {
    //   this.createAnime(this.props);
    // }

  }, {
    key: 'render',


    /**
     * Render children, and their diffs until promise of anime finishes.
     */
    value: function render() {
      var _this2 = this;

      var style = this.props.style;
      var cur = this.children.cur;


      return _react2.default.createElement(
        'g',
        { style: _extends({}, style) },
        cur.filter(filterNullEls).map(function (child, i) {
          return _react2.default.cloneElement(child, { key: i, ref: _this2.addTarget });
        })
      );
    }
  }]);

  return Anime;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.updateAnime = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this3.props;

    var animeProps = _extends({ targets: _this3.targets }, props);
    anime.remove(_this3.targets);
    delete animeProps.children;
    _this3.anime = anime(animeProps);
  };

  this.createAnime = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this3.props;

    var animeProps = _extends({ targets: _this3.targets }, props);
    _this3.anime = anime(animeProps);
  };

  this.removeAnime = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this3.props;

    var animeProps = _extends({ targets: _this3.targets }, props);
    anime.remove(_this3.targets);
    delete animeProps.children;
  };

  this.addTarget = function (newTarget) {
    _this3.targets = [].concat(_toConsumableArray(_this3.targets), [newTarget]).filter(filterNullEls);
  };
};

Anime.defaultProps = {
  onEnter: function onEnter() {},
  onExit: function onExit() {}
};

exports.default = Anime;
