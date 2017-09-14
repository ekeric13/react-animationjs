import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
const anime = typeof window !== 'undefined' ? require('animejs') : _ => _;

export class Anime extends Component {
  constructor(props) {
    super(props);

    // Current Anime DOM Targets
    this.targets = [];

    // Time based children store
    let { children } = props;
    if (!Array.isArray(children)) children = [children];
    this.children = {
      cur: children
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

    const filteredChildren = children.filter((el)=> el !== null);
    const filteredPrevChildren = prevChildren.filter((el)=> el !== null);
    // new child added
    if ( filteredChildren.length > filteredPrevChildren.length ) {
      this.props.onEnter();
      // child removed
    } else if ( filteredChildren.length < filteredPrevChildren.length ) {
      this.props.onExit();
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
    let animeProps = { targets: this.targets, ...props };
    anime.remove(this.targets);
    delete animeProps.children;
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
    this.targets = [...this.targets, newTarget].filter((el)=> el !== null);
  }

  /**
   * Render children, and their diffs until promise of anime finishes.
   */
  render() {
    let { style } = this.props;
    let { cur } = this.children;

    return (
      <g style={{ ...style }}>
        {
          cur
          .filter((el)=> el !== null )
          .map((child, i) =>
            React.cloneElement(child, { key: i, ref: this.addTarget })
          )
        }
      </g>
    );
  }
}

Anime.defaultProps = {
  onEnter: ()=>{},
  onExit: ()=>{},
};

export default Anime;
