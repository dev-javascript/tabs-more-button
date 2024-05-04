import ElManagement from './distanceFromFactory.js';
import {Api} from './api.factory.js';
/**
 * @type {typeof Api}
 */
export default Api.bind(undefined, () => ({getElManagementIns: (params) => new ElManagement(params)}));
