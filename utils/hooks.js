import * as SecureStore from 'expo-secure-store';
import { I18nManager } from 'react-native';
import { createContext } from 'react';

// settings context creation
export const SettingsContext = createContext({});

// settings reducer function
export function settingReducer(state,action){
	/*
		state: {
			thm: 'auto',	// THEME - 'auto', 'light', 'dark'
			lang: 'en',	// LANGUAGE - if system='fa', it defaults to 'fa', otherwise it defaults to 'en'
			ds: 'intl',	// DATE STYLE - 'intl', 'usa'
			ws: 6	// WEEK START - sat:6, sun:0, mon:1
		}
		action: {
			field: 'thm' OR 'lang' OR 'ds' OR 'ws'
			value: <the new value>
		}
	*/
	switch(action.field){
		case 'thm':
			SecureStore.setItem('thm',action.value);
			return {...state,thm:action.value};
		case 'lang':
			SecureStore.setItem('lang',action.value);
			if(['fa'].includes(action.value)){
				I18nManager.isRTL = true;
				I18nManager.forceRTL(true);
			} else {
				I18nManager.isRTL = false;
				I18nManager.forceRTL(false);
			}
			return {...state,lang:action.value};
		case 'ds':
			SecureStore.setItem('ds',action.value);
			return {...state,ds:action.value};
		case 'ws':
			SecureStore.setItem('ws',String(action.value));
			return {...state,ws:action.value};
		default:
			console.log('\nfield value is invalid!\n');
			return state;
	}
}