export const constructor = function DistanceFrom(deps, {baseEl, isVertical, dir}) {
  deps.Base.call(this, {isVertical});
  this.baseEl = baseEl;
  this._distanceFactory(isVertical, dir)._getVisibleSizeFactory(isVertical, dir);
};
export const methods = {
  _getVisibleSizeFactory: function (isVertical, dir) {
    if (isVertical == true) this.getVisibleSize = this._getVisibleSizeInVerticalMode;
    else if (dir === 'ltr') this.getVisibleSize = this._getVisibleSizeInLtrMode;
    else this.getVisibleSize = this._getVisibleSizeInRtlMode;
  },
  _distanceFactory: function (isVertical, dir) {
    if (isVertical == true) this.getDistance = this._getVerticalDistance;
    else if (dir === 'ltr') this.getDistance = this._getLtrDistance;
    else this.getDistance = this._getRtlDistance;
    return this;
  },
  _getVerticalDistance: function (el) {
    const baseElIns = this.getEl(this.baseEl);
    return this._getResult(
      baseElIns.getPos().bottom - this.getEl(el).getPos().bottom - parseFloat(baseElIns.getStyle().paddingBottom),
    );
  },
  _getRtlDistance: function (el) {
    const baseElIns = this.getEl(this.baseEl);
    return this._getResult(
      this.getEl(el).getPos().left - baseElIns.getPos().left - parseFloat(baseElIns.getStyle().paddingLeft),
    );
  },
  _getLtrDistance: function (el) {
    const baseElIns = this.getEl(this.baseEl);
    return this._getResult(
      baseElIns.getPos().right - this.getEl(el).getPos().right - parseFloat(baseElIns.getStyle().paddingRight),
    );
  },
  _getVisibleSizeInLtrMode: function (el) {
    const baseElIns = this.getEl(this.baseEl);
    const elIns = this.getEl(el);
    return this._getResult(
      baseElIns.getPos().right -
        elIns.getPos().left -
        parseFloat(baseElIns.getStyle().paddingRight) -
        parseFloat(elIns.getStyle().paddingLeft),
    );
  },
  _getVisibleSizeInRtlMode: function (el) {
    const baseElIns = this.getEl(this.baseEl);
    const elIns = this.getEl(el);
    return this._getResult(
      elIns.getPos().right -
        baseElIns.getPos().left -
        parseFloat(elIns.getStyle().paddingRight) -
        parseFloat(baseElIns.getStyle().paddingLeft),
    );
  },
  _getVisibleSizeInVerticalMode: function (el) {
    const baseElIns = this.getEl(this.baseEl);
    const elIns = this.getEl(el);
    return this._getResult(
      baseElIns.getPos().bottom -
        elIns.getPos().top -
        parseFloat(baseElIns.getStyle().paddingBottom) -
        parseFloat(elIns.getStyle().paddingTop),
    );
  },
  _getResult: function (value) {
    const obj = Object.create({
      sub: function (value) {
        this.value = this.value - value;
        return this;
      },
    });
    obj.value = value;
    return obj;
  },
};
