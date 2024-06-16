/**
 * @class Api
 * @param {Object} options
 * @param {HTMLElement} options.containerElement - the first ancestor of the Tablist element which its width|height is not relative to tabList element but is relative to viewport
 * @param {HTMLElement} options.buttonElement - should be sibling element of Tablist element
 * @param {HTMLElement} options.tablistElement
 * @param {String} [options.tabDisplay="inline-flex"] - default value is "inline-flex". would be display of tab elements
 * @param {String} [options.containerDisplay="flex"] - default value is "flex". would be display of container element
 */
export const Api = function (options) {
  const arg = arguments;
  this._setOptions(arg[1]);
  this._tablistEl = null;
  const {getElManagementIns} = arg[0]();
  this._getElManagementIns = getElManagementIns;
  this._tabs = null;
  this._tabsCount = null;
  this._setEls();
};
Api.prototype = {
  _setOptions: function (options) {
    this._options = Object.assign(
      {},
      {
        containerDisplay: 'flex',
        tabDisplay: 'inline-flex',
        buttonElement: null,
        containerElement: null,
        tablistElement: null,
      },
      options,
    );
  },
  _setEls: function () {
    this._tablistEl = this._options.tablistElement;
    this._tablistEl.style.overflow = 'visible';
    this._options.containerElement.style.overflow = 'hidden';
    this._options.containerElement.style.whiteSpace = 'nowrap';
    return this;
  },
  _showBtn: function () {
    this._options.buttonElement.style.opacity = 1;
    this._options.buttonElement.style.position = 'relative';
    this._options.buttonElement.style.pointerEvents = 'all';
  },
  _hideBtn: function () {
    this._options.buttonElement.style.opacity = 0;
    this._options.buttonElement.style.position = 'absolute';
    this._options.buttonElement.style.pointerEvents = 'none';
  },
  _checkOverflow: function (lastTab) {
    return this.els.getDistance(lastTab).value < 0;
  },
  _showAll: function () {
    this._options.containerElement.style.display = 'none';
    const tabDisplay = this._options.tabDisplay;
    for (let i = 0, tabs = this._tablistEl.children, tabsCount = tabs.length; i < tabsCount; i++) {
      tabs[i].style.display = tabDisplay;
    }
    this._hideBtn();
    this._options.containerElement.style.display = this._options.containerDisplay;
  },
  _hideTabs: function (firstHiddenTabIndex, selectedTabInfo, includeSelectedTab) {
    const hiddenTabs = [];
    this._options.containerElement.style.display = 'none';
    const {index: selectedTabIndex} = selectedTabInfo;
    for (let i = firstHiddenTabIndex, tabsCount = this._tabsCount; i < tabsCount; i++) {
      if (includeSelectedTab || i !== selectedTabIndex) {
        this._tabs[i].style.display = 'none';
        hiddenTabs.push({el: this._tabs[i], index: i});
      }
    }
    this._showBtn();
    this._options.containerElement.style.display = this._options.containerDisplay;
    return hiddenTabs;
  },
  _getSelectedTabInfo: function (tabs, selectedTabIndex) {
    const index = selectedTabIndex;
    const el = index >= 0 ? tabs[index] : null;
    const overflow = el
      ? this.els.getDistance(el).sub(this.els.getEl(this._options.buttonElement).getFullSize()).value <= 0
      : false;
    const overflowFullSize = overflow ? this.els.getEl(el).getFullSize() : 0;
    return {index, overflowFullSize};
  },
  _validateTabsCount: function () {
    this._tabs = this._tablistEl.children;
    this._tabsCount = this._tabs.length;
    return this._tabsCount ? true : false;
  },
  /**
   *
   * @param {Number} selectedTabIndex
   * @param {"ltr"|"rtl"} [direction="ltr"]
   * @param {Boolean} [isVertical=false]
   * @returns {Array.<{el: HTMLElement , index: Number}>}
   */
  resize: function (selectedTabIndex = '', direction = 'ltr', isVertical = false) {
    if (this._validateTabsCount() === false) {
      return [];
    }
    this._showAll();
    this.els = this._getElManagementIns({
      baseEl: this._options.containerElement,
      isVertical,
      dir: direction,
    });
    const _lastTab = this._tabs[this._tabsCount - 1];
    if (this._checkOverflow(_lastTab) === false) {
      return [];
    }
    const selectedTabInfo = this._getSelectedTabInfo(this._tabs, selectedTabIndex);
    return this._validateSliderMinSize(selectedTabInfo)
      ? this._hideTabs(
          this._findFirstHiddenTabIndexFactory(
            selectedTabInfo,
            this._getSearchBoundries(selectedTabInfo),
            this._getOrder(_lastTab),
          ),
          selectedTabInfo,
        )
      : this._hideTabs(0, selectedTabInfo, true);
  },
  _validateSliderMinSize: function (selectedTabInfo) {
    //the slider's size should greater than size of selected tab + more button
    return selectedTabInfo.overflowFullSize + this.els.getEl(this._options.buttonElement).getFullSize() >=
      this.els.getEl(this._options.containerElement).getSize()
      ? false
      : true;
  },
  _getOrder: function (lastTab) {
    return Math.abs(this.els.getDistance(lastTab).value) > this.els.getEl(this._options.containerElement).getSize()
      ? 'asc'
      : 'desc';
  },
  _getSearchBoundries: function (selectedTabInfo) {
    const {overflowFullSize, index: pivotIndex} = selectedTabInfo;
    //if selected tab is not existed
    if (pivotIndex < 0) {
      return [0, this._tabsCount - 2];
    }
    const isSelectedTabOverflow = overflowFullSize > 0;
    return isSelectedTabOverflow ? [0, pivotIndex - 1] : [pivotIndex + 1, this._tabsCount - 2];
  },
  _getTabDis: function (selectedTabInfo, el) {
    return this.els
      .getDistance(el)
      .sub(selectedTabInfo.overflowFullSize)
      .sub(this.els.getEl(this._options.buttonElement).getFullSize());
  },
  _findFirstHiddenTabIndexDSCE: function (selectedTabInfo, start, stop) {
    let value = this._tabsCount - 1;
    for (let i = stop; i >= start; i--) {
      if (this._getTabDis(selectedTabInfo, this._tabs[i]).value <= 0) {
        value = i;
      } else {
        break;
      }
    }
    return value;
  },
  _findFirstHiddenTabIndexASC: function (selectedTabInfo, start, stop) {
    for (let i = start; i <= stop; i++) {
      if (this._getTabDis(selectedTabInfo, this._tabs[i]).value <= 0) {
        return i;
      }
    }
    return this._tabsCount - 1;
  },
  _findFirstHiddenTabIndexFactory: function (selectedTabInfo, [start, stop], order) {
    return order === 'asc'
      ? this._findFirstHiddenTabIndexASC(selectedTabInfo, start, stop)
      : this._findFirstHiddenTabIndexDSCE(selectedTabInfo, start, stop);
  },
};
