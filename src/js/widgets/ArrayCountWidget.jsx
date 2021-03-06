import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class ArrayCountWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userCount: props.value
      ? props.value.length - (this.props.options.countOffset || 0)
      : undefined };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userCount !== this.state.userCount) {
      let count = parseInt(this.state.userCount, 10);
      if (isNaN(count)) {
        count = 0;
      }

      // Too high of a count can crash the browser. We’ve been using
      // this for marriage counts and 29 is the record, so 29 seems like
      // a good upper limit. Filling out more than 29 pages is probably
      // not reasonable in a form anyway
      if (count > 29) {
        count = 29;
      }

      this.props.onChange(this.getValue(count, this.props.value));
    }
  }
  // We’re expanding or contracting the array based on the count
  // and returning undefined if the array should be empty
  getValue = (count, value = []) => {
    if (count === 0) {
      return undefined;
    }

    const intCount = count + (this.props.options.countOffset || 0);

    if (intCount < 0) {
      return undefined;
    }

    if (intCount < value.length) {
      return value.slice(0, intCount);
    }

    return Array(intCount - value.length).fill({}).concat(value);
  }

  updateArrayLength = (event) => {
    this.setState({ userCount: event.target.value });
  }

  render() {
    const props = this.props;

    if (props.formContext.reviewMode) {
      return (
        <div className="review-row">
          <dt>{props.uiSchema['ui:title']}</dt><dd>{this.state.userCount}</dd>
        </div>
      );
    }

    return (
      <input
        autoComplete={props.options.autocomplete}
        type="number"
        step="1"
        min="1"
        id={props.id}
        name={props.id}
        disabled={props.disabled}
        className={classnames(props.options.widgetClassNames)}
        value={typeof this.state.userCount === 'undefined' ? '' : this.state.userCount}
        onBlur={() => props.onBlur(props.id)}
        onChange={this.updateArrayLength}/>
    );
  }
}

ArrayCountWidget.propTypes = {
  /**
   * ui:options from uiSchema
   */
  options: PropTypes.shape({
    /*
    * input's autocomplete attribute value
    */
    autocomplete: PropTypes.string
  }),
};

ArrayCountWidget.defaultProps = {
  options: {}
};
