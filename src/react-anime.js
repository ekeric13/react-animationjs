import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import ReactDOM from 'react-dom';
const anime = typeof window !== 'undefined' ? require('animejs') : _ => _;

function filterNullEls (el) {
  return  el !== null;
}

function filterNullKeys (el) {
  return el.key !== null;
}

function createKeyHash (hash, el) {
  hash[el.key] = true;
  return hash;
}

export class Anime extends Component {
  constructor(props) {
    super(props);

    // Current Anime DOM Targets
    this.targets = [];

    // Time based children store
    let { children } = props;
    if (!Array.isArray(children)) children = [children];
    this.children = {
      cur: children.filter(filterNullEls)
    };
  }

  componentDidMount() {
    this.updateAnime();
  }

  componentWillReceiveProps(nextProps) {
    let { children } = nextProps;
    let prevChildren = this.props.children;

    if (!Array.isArray(children)) children = [children];
    if (!Array.isArray(prevChildren)) prevChildren = [prevChildren];

    const filteredChildren = children.filter(filterNullEls);
    const filteredPrevChildren = prevChildren.filter(filterNullEls);
    // new child added
    if ( filteredChildren.length > filteredPrevChildren.length ) {
      const filteredPrevChildrenHash = filteredPrevChildren.filter(filterNullKeys).reduce(createKeyHash, {});
      const addedChildren = filteredChildren.filter(filterNullKeys).filter((el)=>{
        return !filteredPrevChildrenHash.hasOwnProperty(el.key);
      });
      this.props.onEnter(addedChildren);
      // child removed
    } else if ( filteredChildren.length < filteredPrevChildren.length ) {
      const filteredChildrenHash = filteredChildren.filter(filterNullKeys).reduce(createKeyHash, {});
      const removedChildren = filteredPrevChildren.filter(filterNullKeys).filter((el)=>{
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

  updateAnime = (props = this.props) => {
    let modifiedProps = Object.assign({}, props);
    delete modifiedProps['styleEl'];
    delete modifiedProps['onEnter'];
    delete modifiedProps['onExit'];
    delete modifiedProps.children;
    const animeProps = { targets: this.targets, ...modifiedProps };
    anime.remove(this.targets);
    this.anime = anime(animeProps);
  }

  createAnime = (props = this.props) => {
    let animeProps = { targets: this.targets, ...props };
    this.anime = anime(animeProps);
  }

  removeAnime = (props = this.props) => {
    let animeProps = { targets: this.targets, ...props };
    anime.remove(this.targets);
    delete animeProps.children;
  }

  addTarget = newTarget => {
    if ( newTarget instanceof Component ) {
      newTarget = ReactDOM.findDOMNode(newTarget);
    }
    this.targets = [...this.targets, newTarget].filter(filterNullEls);
  }

  checkIfStyledComponent(child) {
    if ( typeof child.type === 'function' ) {
      return child.type.displayName === 'styled(Component)';
    }
  }

  /**
   * Render children, and their diffs until promise of anime finishes.
   */
  render() {
    let { styleEl } = this.props;
    let { cur } = this.children;

    return (
      <g style={{ ...styleEl }}>
        {
          cur
          .filter(filterNullEls)
          .map((child, i) =>{
            let props = {
              key: i,
              ref: this.addTarget
            };
            if (this.checkIfStyledComponent(child)) {
              props.innerRef = this.addTarget;
            }          
            return React.cloneElement(child, props);
          })
        }
      </g>
    );
  }
}

Anime.defaultProps = {
  onEnter: ()=>{},
  onExit: ()=>{},
  styleEl: {}
};

export default Anime;
