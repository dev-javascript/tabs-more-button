import ElManagement from './distanceFromFactory.js';
import {Api} from './api.factory.js';
let container = document.createElement('div');
let getElManagementIns, ins, buttonElement, containerElement;
beforeAll(() => {
  const d = document;
  document.body.appendChild(container);
  container.innerHTML = `
  <div id='view'>
  <div id='container'>
      <div id='overflow'>
          <ul id="ul">
              <li>Tab 0</li>
              <li>Tab 1</li>
              <li>Tab 2</li>
              <li>Tab 3</li>
              <li style='color:red;'>Tab 4</li>
              <li>Tab 5</li>
              <li>Tab 6</li>
          </ul>
          <button id='more-button'>more</button>
      </div>
  </div>
</div>
  `;
  (buttonElement = d.getElementById('more-button')), (containerElement = d.getElementById('container'));
});
beforeEach(() => {
  getElManagementIns = (params) => new ElManagement(params);
  ins = new Api(() => ({getElManagementIns}), {buttonElement, containerElement, containerDisplay: 'block'});
});
afterEach(() => {
  ins = null;
  getElManagementIns = null;
});
afterAll(() => {
  buttonElement = null;
  containerElement = null;
  container.innerHTML = '';
  document.body.removeChild(container);
  container = null;
});
describe('_setEls method : ', () => {
  test('it should set _tablistEl and make its overflow, visible', () => {
    ins._options = {
      buttonElement: {
        previousElementSibling: {
          style: {overflow: 'unset'},
        },
      },
      containerElement: {
        style: {overflow: 'unset'},
      },
    };
    ins._setEls();
    expect(ins._tablistEl).toEqual(ins._options.buttonElement.previousElementSibling);
    expect(ins._tablistEl.style.overflow).toBe('visible');
  });
  test('it should set overflow of containerElement element, hidden', () => {
    ins._options = {
      buttonElement: {
        previousElementSibling: {
          style: {overflow: 'unset'},
        },
      },
      containerElement: {
        style: {overflow: 'unset'},
      },
    };
    ins._setEls();
    expect(ins._options.containerElement.style.overflow).toBe('hidden');
  });
});
describe('resize method : ', () => {
  test('it should call showAll method at frist if validateTabsCount method returns true, regardless of return value from checkOverflow method', () => {
    ins._showAll = jest.fn(() => {});
    ins._validateTabsCount = jest.fn(() => {
      ins._tabs = ins._tablistEl.children;
      ins._tabsCount = ins._tabs.length;
      return true;
    });
    ins._checkOverflow = () => false;
    ins.resize(4);
    expect(ins._validateTabsCount.mock.calls.length).toBe(1);
    expect(ins._showAll.mock.calls.length).toBe(1);

    ins._showAll = jest.fn(() => {});
    ins._validateTabsCount = jest.fn(() => {
      ins._tabs = ins._tablistEl.children;
      ins._tabsCount = ins._tabs.length;
      return false;
    });
    ins._checkOverflow = () => false;
    ins.resize(4);
    expect(ins._validateTabsCount.mock.calls.length).toBe(1);
    expect(ins._showAll.mock.calls.length).toBe(0);
  });
  test('it should set els prop and then calls checkOverflow method', () => {
    expect.assertions(1);
    ins._checkOverflow = jest.fn(() => {
      expect(!!ins.els).toBe(true);
      return false;
    });
    ins.resize(4);
  });
  test('if checkOverflow method returns false then it should returns a empty array', () => {
    ins._checkOverflow = jest.fn(() => false);
    expect(ins.resize()).toEqual([]);
  });
  test('it should call hideTabs method if checkOverflow method returns true', () => {
    ins._hideTabs = jest.fn(() => []);
    ins._checkOverflow = () => true;
    ins.resize(4);
    expect(ins._hideTabs.mock.calls.length).toBe(1);
  });
  test('it should call hideTabs method based on returned value of validateSliderMinSize method', () => {
    ins._checkOverflow = () => true;
    ins._getSelectedTabInfo = () => 'selectedTabInfo';
    ins._findFirstHiddenTabIndexFactory = () => '_findFirstHiddenTabIndexFactory';
    ins._getSearchBoundries = () => [0, 6];
    ins._getOrder = () => 'asc';
    ins._hideTabs = jest.fn(() => []);
    // if _validateSliderMinSize return true
    ins._validateSliderMinSize = () => true;
    ins.resize(4);
    expect(ins._hideTabs.mock.calls[0][0]).toBe('_findFirstHiddenTabIndexFactory');
    expect(ins._hideTabs.mock.calls[0][1]).toBe('selectedTabInfo');
    expect(ins._hideTabs.mock.calls[0][2]).toBe(undefined);
    // if _validateSliderMinSize return false
    ins._validateSliderMinSize = () => false;
    ins.resize(4);
    expect(ins._hideTabs.mock.calls[1][0]).toBe(0);
    expect(ins._hideTabs.mock.calls[1][1]).toBe('selectedTabInfo');
    expect(ins._hideTabs.mock.calls[1][2]).toBe(true);
  });
  test('if _validateTabsCount method returns false then it should returns a empty array', () => {
    ins._validateTabsCount = jest.fn(() => false);
    expect(ins.resize()).toEqual([]);
  });
});
describe('hideTabs method : ', () => {
  test('it should hide tabs from firstHiddenTabIndex', () => {
    ins._validateTabsCount();
    const selectedTabInfo = {index: 4};
    ins._options.containerElement = {style: {display: ''}};
    ins._showBtn = () => {};
    ins._hideTabs(5, selectedTabInfo);
    expect(ins._tabs[0].style.display === 'none').toBe(false);
    expect(ins._tabs[1].style.display === 'none').toBe(false);
    expect(ins._tabs[2].style.display === 'none').toBe(false);
    expect(ins._tabs[3].style.display === 'none').toBe(false);
    expect(ins._tabs[4].style.display === 'none').toBe(false);
    expect(ins._tabs[5].style.display === 'none').toBe(true);
    expect(ins._tabs[6].style.display === 'none').toBe(true);
  });
  test('it should return the array of objects including el and index properties', () => {
    ins._validateTabsCount();
    const selectedTabInfo = {index: 4};
    ins._options.containerElement = {style: {display: ''}};
    ins._showBtn = () => {};
    const result = ins._hideTabs(5, selectedTabInfo);
    expect(result.length).toBe(2);
    expect(result[0].el).toEqual(ins._tabs[5]);
    expect(result[0].index).toBe(5);
    expect(result[1].el).toEqual(ins._tabs[6]);
    expect(result[1].index).toBe(6);
  });
  test('it should not consider selected tab if third parameter is not true', () => {
    ins._validateTabsCount();
    const selectedTabInfo = {index: 4};
    ins._options.containerElement = {style: {display: ''}};
    ins._showBtn = () => {};
    const result = ins._hideTabs(3, selectedTabInfo);
    expect(ins._tabs[0].style.display === 'none').toBe(false);
    expect(ins._tabs[1].style.display === 'none').toBe(false);
    expect(ins._tabs[2].style.display === 'none').toBe(false);
    expect(ins._tabs[3].style.display === 'none').toBe(true);
    expect(ins._tabs[4].style.display === 'none').toBe(false);
    expect(ins._tabs[5].style.display === 'none').toBe(true);
    expect(ins._tabs[6].style.display === 'none').toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].el).toEqual(ins._tabs[3]);
    expect(result[0].index).toBe(3);
    expect(result[1].el).toEqual(ins._tabs[5]);
    expect(result[1].index).toBe(5);
    expect(result[2].el).toEqual(ins._tabs[6]);
    expect(result[2].index).toBe(6);
  });
  test('it should consider selected tab if third parameter is true', () => {
    ins._validateTabsCount();
    const selectedTabInfo = {index: 4};
    ins._options.containerElement = {style: {display: ''}};
    ins._showBtn = () => {};
    const result = ins._hideTabs(3, selectedTabInfo, true);
    expect(ins._tabs[0].style.display === 'none').toBe(false);
    expect(ins._tabs[1].style.display === 'none').toBe(false);
    expect(ins._tabs[2].style.display === 'none').toBe(false);
    expect(ins._tabs[3].style.display === 'none').toBe(true);
    expect(ins._tabs[4].style.display === 'none').toBe(true);
    expect(ins._tabs[5].style.display === 'none').toBe(true);
    expect(ins._tabs[6].style.display === 'none').toBe(true);
    expect(result.length).toBe(4);
    expect(result[0].el).toEqual(ins._tabs[3]);
    expect(result[0].index).toBe(3);
    expect(result[1].el).toEqual(ins._tabs[4]);
    expect(result[1].index).toBe(4);
    expect(result[2].el).toEqual(ins._tabs[5]);
    expect(result[2].index).toBe(5);
    expect(result[3].el).toEqual(ins._tabs[6]);
    expect(result[3].index).toBe(6);
  });
  test('it should call _showBtn method', () => {
    ins._validateTabsCount();
    const selectedTabInfo = {index: 4};
    ins._options.containerElement = {style: {display: ''}};
    ins._showBtn = jest.fn(() => {});
    ins._hideTabs(3, selectedTabInfo, true);
    expect(ins._showBtn.mock.calls.length).toBe(1);
  });
});
describe('validateTabsCount method : ', () => {
  test('it should set tabs and tabsCount properties', () => {
    ins._tablistEl = {children: {length: 2}};
    ins._validateTabsCount();
    expect(ins._tabs).toEqual(ins._tablistEl.children);
    expect(ins._tabsCount).toEqual(ins._tablistEl.children.length);
  });
  test('it should returns true if tabsCount is greater than zero', () => {
    ins._tablistEl = {children: {length: 2}};
    expect(ins._validateTabsCount()).toBe(true);
    ins._tablistEl = {children: {length: 0}};
    expect(ins._validateTabsCount()).toBe(false);
  });
});
describe('showAll method : ', () => {
  test('it should set display of all tabs into tabDisplay option', () => {
    ins._validateTabsCount();
    ins._options.containerElement = {style: {display: ''}};
    ins._options.tabDisplay = 'flex';
    ins._hideBtn = () => {};
    ins._showAll();
    expect(ins._tabs[0].style.display === 'flex').toBe(true);
    expect(ins._tabs[1].style.display === 'flex').toBe(true);
    expect(ins._tabs[2].style.display === 'flex').toBe(true);
    expect(ins._tabs[3].style.display === 'flex').toBe(true);
    expect(ins._tabs[4].style.display === 'flex').toBe(true);
    expect(ins._tabs[5].style.display === 'flex').toBe(true);
    expect(ins._tabs[6].style.display === 'flex').toBe(true);
  });
  test('it should call _hideBtn method', () => {
    ins._validateTabsCount();
    ins._options.containerElement = {style: {display: ''}};
    ins._options.tabDisplay = 'flex';
    ins._hideBtn = jest.fn(() => {});
    ins._showAll();
    expect(ins._hideBtn.mock.calls.length).toBe(1);
  });
});
describe('findFirstHiddenTabIndexFactory mehtod : ', () => {
  test('its default value for returning is the last tab if it wont find it', () => {
    ins._validateTabsCount();
    expect(ins._findFirstHiddenTabIndexFactory({}, [1, 0], 'asc')).toBe(6);
    expect(ins._findFirstHiddenTabIndexFactory({}, [1, 0], 'desc')).toBe(6);
  });
  test('it should call findFirstHiddenTabIndexASC method if order is asc', () => {
    ins._validateTabsCount();
    ins._findFirstHiddenTabIndexASC = jest.fn(() => 1);
    ins._findFirstHiddenTabIndexDSCE = jest.fn(() => 1);
    ins._findFirstHiddenTabIndexFactory({}, [1, 0], 'asc');
    expect(ins._findFirstHiddenTabIndexASC.mock.calls.length).toBe(1);
    expect(ins._findFirstHiddenTabIndexDSCE.mock.calls.length).toBe(0);
  });
  test('it should call findFirstHiddenTabIndexDSCE method if order is desc', () => {
    ins._validateTabsCount();
    ins._findFirstHiddenTabIndexASC = jest.fn(() => 1);
    ins._findFirstHiddenTabIndexDSCE = jest.fn(() => 1);
    ins._findFirstHiddenTabIndexFactory({}, [1, 0], 'desc');
    expect(ins._findFirstHiddenTabIndexASC.mock.calls.length).toBe(0);
    expect(ins._findFirstHiddenTabIndexDSCE.mock.calls.length).toBe(1);
  });
  test('the findFirstHiddenTabIndexASC method should return last tab index if the getTabDis method always returns a positive value', () => {
    ins._validateTabsCount();
    ins._getTabDis = () => 1;
    expect(ins._findFirstHiddenTabIndexASC({}, 0, 10)).toBe(6);
  });
  test('the findFirstHiddenTabIndexDSCE method should return last tab index if the getTabDis method always returns a positive value', () => {
    ins._validateTabsCount();
    ins._getTabDis = () => 1;
    expect(ins._findFirstHiddenTabIndexDSCE({}, 0, 10)).toBe(6);
  });
});
describe('getOrder method : ', () => {
  test('it should return asc if : last tab child distance from end-edge of tablist container would greater then tablist container size', () => {
    ins._validateTabsCount();
    ins.els = {
      getDistance: () => ({value: 100}),
      getEl: () => ({getSize: () => 99}),
    };
    expect(ins._getOrder()).toBe('asc');
  });
  it('it should return desc if : last tab child distance from end-edge of tablist container would equal or less then tablist container size', () => {
    ins._validateTabsCount();
    ins.els = {
      getDistance: () => ({value: 100}),
      getEl: () => ({getSize: () => 101}),
    };
    expect(ins._getOrder()).toBe('desc');
  });
});
describe('getSearchBoundries method : ', () => {
  test('it should return [0, tabsCount - 2] if there is not any tab selected', () => {
    ins._validateTabsCount();
    const boundry = ins._getSearchBoundries({index: -1});
    expect(boundry[0]).toBe(0); //start value
    expect(boundry[1]).toBe(ins._tabsCount - 2); //stop value
  });
  test('it should return [0, selectedTabIndex - 1]  if selected tab is overflow', () => {
    ins._validateTabsCount();
    const boundry = ins._getSearchBoundries({index: 3, overflowFullSize: 1});
    expect(boundry[0]).toBe(0); //start value
    expect(boundry[1]).toBe(3 - 1); //stop value
  });
  test('it should return [selectedTabIndex + 1, tabsCount - 2]  if selected tab is not overflow', () => {
    ins._validateTabsCount();
    const boundry = ins._getSearchBoundries({index: 3, overflowFullSize: 0});
    expect(boundry[0]).toBe(3 + 1); //start value
    expect(boundry[1]).toBe(ins._tabsCount - 2); //stop value
  });
});
describe('hideBtn method : ', () => {
  test(`it should not hide the button, because the button size is needed when all tabs are visible 
  but the button should not be visible`, () => {
    ins._options.buttonElement = {
      style: {display: 'flex', position: 'relative', opacity: 1, pointerEvents: 'all'},
    };
    ins._hideBtn();
    expect(ins._options.buttonElement.style.display).toBe('flex');
    expect(ins._options.buttonElement.style.opacity).toBe(0);
    expect(ins._options.buttonElement.style.position).toBe('absolute');
    expect(ins._options.buttonElement.style.pointerEvents).toBe('none');
  });
});
