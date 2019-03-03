import { SAVE_TOKEN } from './actionTypes';

export const saveToken = (name) => {
    return {
        type: SAVE_TOKEN,
        name: name
    };
};