import AppFactory from './appFactory';
import blockStore from 'fit-block-store';
export default AppFactory.getAppByName('fitblock', blockStore.getClient());
export const getAppByName = AppFactory.getAppByName;