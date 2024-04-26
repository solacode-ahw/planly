import { Appearance } from 'react-native';

import { weekDays } from './translations';


export function getTheme(thm){
	if(thm === 'auto'){
		thm = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
	}
	return thm;
}
export function getColor(thm){
	let color = thm==='dark'?'light':'dark';
	if(thm === 'auto'){
		color = Appearance.getColorScheme() === 'dark' ? 'light' : 'dark';
	}
	return color;
}

export function getWeekDays(ws,lang){
	let res = {};
	[...Array(7).keys()].forEach(i=>{
		res[i] = weekDays[lang][(ws+i)%7];
	});
	return res;
}