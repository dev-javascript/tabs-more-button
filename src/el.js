export default function El({ el, sizeDimension, sizeDirections }) {
  this._el = el;
  /**would be width|height */
  this._sizeDimension = sizeDimension;
  /**would be "right"|"left"|"top"|"bottom" */
  this._sizeDirections = sizeDirections;
}
El.prototype = {
  getStyle: function () {
    return (this._style = this._style || this._el.currentStyle || window.getComputedStyle(this._el));
  },
  getPos: function () {
    return (this._pos = this._pos || this._el.getBoundingClientRect());
  },
  /**
   * including padding, border and margin
   * @param {"Right"|"Bottom"|"Left"|"Top"} dir 
   * @returns {Number}
   */
  getSpacing: function (dir) {
    const style = this.getStyle();
    return (
      parseFloat(style[`margin${dir}`]) + parseFloat(style[`padding${dir}`]) + parseFloat(style[`border${dir}Width`])
    );
  },
  /**not include padding and borders */
  getSize: function () {
    return (this.size =
      this.size ||
      (function (that) {
        const style = that.getStyle();
        return (
          that.getPos()[that._sizeDimension] -
          parseFloat(style[`padding${that._sizeDirections[0]}`]) -
          parseFloat(style[`padding${that._sizeDirections[1]}`]) -
          parseFloat(style[`border${that._sizeDirections[1]}Width`]) -
          parseFloat(style[`border${that._sizeDirections[0]}Width`])
        );
      })(this));
  },
  /**include margin */
  getFullSize: function () {
    return (this.fullSize =
      this.fullSize ||
      (function (that) {
        const style = that.getStyle();
        return (
          that.getPos()[that._sizeDimension] +
          parseFloat(style[`margin${that._sizeDirections[0]}`]) +
          parseFloat(style[`margin${that._sizeDirections[1]}`])
        );
      })(this));
  },
};
