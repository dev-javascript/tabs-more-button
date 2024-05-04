import ElManagement from './distanceFromFactory.js';
import ApiFactory from './api.factory.js';
export default ApiFactory.bind(undefined, () => ({getElManagementIns: (param) => new ElManagement(param)}));
