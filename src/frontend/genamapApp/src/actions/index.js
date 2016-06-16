import { hashHistory } from 'react-router'

import fetch from '../components/fetch'
import config from '../../config'
import { removeToken, extractFromToken, setToken } from '../middleware/token'

/*
 * action types
 */

export const IMPORT_DATA = 'IMPORT_DATA'
export const IMPORT_DATA_REQUEST = 'IMPORT_DATA_REQUEST'
export const IMPORT_DATA_RECEIVE = 'IMPORT_DATA_RECEIVE'
export const RUN_ANALYSIS_REQUEST = 'RUN_ANALYSIS_REQUEST'
export const RUN_ANALYSIS_RECEIVE = 'RUN_ANALYSIS_RECEIVE'
export const TOGGLE_LEFT_NAV = 'TOGGLE_LEFT_NAV'
export const TOGGLE_RIGHT_NAV = 'TOGGLE_RIGHT_NAV'
export const DELETE_FILE = 'DELETE_FILE'
export const STAR_FILE = 'STAR_FILE'
export const CANCEL_ACTIVITY = 'CANCEL_ACTIVITY'
export const PAUSE_ACTIVITY = 'PAUSE_ACTIVITY'
export const RESTART_ACTIVITY = 'RESTART_ACTIVITY'
export const REQUEST_UPDATE_ACTIVITY = 'REQUEST_UPDATE_ACTIVITY'
export const RECEIVE_UPDATE_ACTIVITY = 'RECEIVE_UPDATE_ACTIVITY'
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'
export const SHOW_LOCK = 'SHOW_LOCK'
export const LOCK_SUCCESS = 'LOCK_SUCCESS'
export const LOCK_FAILURE = 'LOCK_FAILURE'
export const REDIRECT = 'REDIRECT'
export const USER_STATE_SUCCESS = 'USER_STATE_SUCCESS'
export const USER_STATE_FAILURE = 'USER_STATE_FAILURE'
export const LOAD_INITIAL_PROJECTS = 'LOAD_INITIAL_PROJECTS'
export const LOAD_INITIAL_ACTIVITIES = 'LOAD_INITIAL_ACTIVITIES'

/*
 * action creators
 */

function importDataReceive (data) {
  return {
    type: IMPORT_DATA_RECEIVE,
    data
  }
}

function createFormData (form) {
  let formData = new window.FormData()
  for (var i = 0; i < form.length; i++) {
    if (form.elements[i].id) {
      if (form.elements[i].type === 'file') {
        formData.append(form.elements[i].id, form.elements[i].files[0])
      } else {
        formData.append(form.elements[i].id, form.elements[i].value)
      }
    }
  }
  return formData
}

export function importData (form) {
  let importDataRequest = {
    method: 'POST',
    body: createFormData(form)
  }

  return (dispatch) => {
    return fetch(config.api.importDataUrl, importDataRequest)
    .then(response => {
      if (!response.ok) Promise.reject('Could not import data')
      return response.json()
    }).then(data => {
      dispatch(importDataReceive(data))
      Promise.resolve(data)
    }).catch(err => console.log(err))
  }
}

function runAnalysisRequest (data) {
  return {
    type: RUN_ANALYSIS_REQUEST,
    data
  }
}

function runAnalysisReceive (data) {
  return {
    type: RUN_ANALYSIS_RECEIVE,
    data
  }
}

export function runAnalysis (data) {
  let request = {
    method: 'POST',
    body: data
  }

  console.log('DATA: ', data)
  return (dispatch) => {
    dispatch(runAnalysisRequest(data))
    return fetch(this.props.runAnalysisUrl, request)
    .then(response => {
      if (!response.ok) Promise.reject(response.json())
      return response.json()
    }).then(processedData => {
      dispatch(runAnalysisReceive(processedData))
    }).catch(err => console.log('Error: ', err))
  }
}

export function toggleLeftNav () {
  return {
    type: TOGGLE_LEFT_NAV
  }
}

export function toggleRightNav () {
  return {
    type: TOGGLE_RIGHT_NAV
  }
}

function receiveDeleteFile (file, project) {
  return {
    type: DELETE_FILE,
    file,
    project
  }
}

export function deleteFile (file) {
  let request = {
    method: 'DELETE'
  }

  return dispatch => {
    return fetch(`${config.api.dataUrl}/${file}`, request)
    .then(response => {
      if (!response.ok) {
        console.log('Could not delete file')
        Promise.reject(response.json())
      } else {
        return response.json()
      }
    }).then(response => {
      dispatch(receiveDeleteFile(response.file, response.project))
    })
  }
}

export function starFile (file) {
  return {
    type: STAR_FILE,
    file
  }
}

export function cancelActivity (activity) {
  return {
    type: CANCEL_ACTIVITY,
    activity
  }
}

export function pauseActivity (activity) {
  return {
    type: PAUSE_ACTIVITY,
    activity
  }
}

export function restartActivity (activity) {
  return {
    type: RESTART_ACTIVITY,
    activity
  }
}

export function restartActivityAsync (activity) {
  return (dispatch) => {
    dispatch(restartActivity(activity))
    setTimeout(() => {
      dispatch(fetchUpdateActivityIfNeeded(activity))
    }, 1000)
  }
}

export function requestUpdateActivity (activity) {
  return {
    type: REQUEST_UPDATE_ACTIVITY,
    activity
  }
}

export function receiveUpdateActivity (activity, response) {
  return {
    type: RECEIVE_UPDATE_ACTIVITY,
    activity,
    response
  }
}

function fetchUpdateActivity (activity) {
  return (dispatch) => {
    dispatch(requestUpdateActivity(activity))
    return fetch(`${config.api.getActivityUrl}/${activity}`)
    .then(response => {
      if (!response.ok) {
        console.log('Could not fetch activity for activity ', activity)
      } else {
        return response.json()
      }
    }).then(response => {
      dispatch(receiveUpdateActivity(activity, response))
    })
  }
}

function shouldUpdateActivity (state, activity) {
  return (activity.status !== 'completed')
}

export function fetchUpdateActivityIfNeeded (activity) {
  return (dispatch, getState) => {
    if (shouldUpdateActivity(getState(), activity)) {
      Promise.reject(activity)
      return dispatch(fetchUpdateActivity(activity))
    } else {
      Promise.resolve()
    }
  }
}

function requestLogin (credentials) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false
  }
}

function receiveLogin (user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true
  }
}

function loginError (message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

function loadInitialProjects (data) {
  return {
    type: LOAD_INITIAL_PROJECTS,
    data
  }
}

function loadInitialActivities (data) {
  return {
    type: LOAD_INITIAL_ACTIVITIES,
    data
  }
}

function receiveUserState (state) {
  return dispatch => {
    dispatch(loadInitialProjects(state.userData.projects))
    dispatch(loadInitialActivities(state.userData.activities))
  }
}

function userStateError () {
  return {
    type: USER_STATE_FAILURE
  }
}

export function loginUser (creds) {
  let loginRequest = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${creds.username}&password=${creds.password}`
  }

  return dispatch => {
    dispatch(requestLogin(creds))
    return fetch(config.api.createSessionUrl, loginRequest)
    .then(response => {
      if (!response.ok) {
        dispatch(loginError(response.json().message))
        Promise.reject('Could not login user')
      }
      return response.json()
    }).then(user => {
      setToken(user.id_token)
      dispatch(receiveLogin(user))
      dispatch(getUserState(user.id_token))
      return user
    }).catch(err => console.log('Error: ', err))
  }
}

export function setInitialUserState (token) {
  return dispatch => {
    let initialUserStatePromise = dispatch(getUserState(token))
    initialUserStatePromise.then(state => {
      dispatch(receiveUserState(state))
    })
  }
}

export function getUserState (token) {
  let getUserStateRequest = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return dispatch => {
    const userId = extractFromToken(token, 'id')
    return fetch(`${config.api.saveUrl}/${userId}`, getUserStateRequest)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        dispatch(userStateError())
        Promise.reject({error: 'Could not get state'})
      }
    }).then(state => state
    ).catch(error => {
      console.log('error', error)
    })
  }
}

function requestCreateAccount (creds) {
  return {
    type: 'REQUEST_CREATE_ACCOUNT'
  }
}

function receiveCreateAccount (account) {
  return {
    type: 'RECEIVE_CREATE_ACCOUNT'
  }
}

function createAccountError (message) {
  return {
    type: 'ERROR_CREATE_ACCOUNT'
  }
}

export function createAccount (creds) {
  let createAccountRequest = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${creds.username}&password=${creds.password}`
  }

  return dispatch => {
    dispatch(requestCreateAccount(creds))
    return fetch(config.api.createAccountUrl, createAccountRequest)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        dispatch(createAccountError(response.json().message))
        Promise.reject(response.json().message)
      }
    }).then(account => {
      dispatch(receiveCreateAccount(account))
      Promise.resolve(account)
    }).catch(err => console.log('Error: ', err))
  }
}

function requestLogout () {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveLogout () {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}

export function logoutUser () {
  return (dispatch) => {
    dispatch(requestLogout())
    removeToken()
    dispatch(receiveLogout())
    dispatch(redirectToLogin())
  }
}

export function redirectTo (url) {
  return (dispatch) => {
    hashHistory.push(url)
    dispatch(redirect(url))
  }
}

function redirect (url) {
  return {
    type: REDIRECT,
    url
  }
}

export function redirectToLogin (next) {
  return (dispatch) => {
    const to = (!next)
      ? config.api.loginUrl
      : config.api.loginUrl + '?next=' + next
    dispatch(redirectTo(to))
  }
}