import todolist from '../apis/todolist';
import jwt_decode from 'jwt-decode';

import {GET_ERRORS} from './types';

export const registerUser = (userData, history) => dispatch => {
    todolist.post('users/register', userData)
        .then(res => {
            console.log(res);
            history.push('/login')
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}