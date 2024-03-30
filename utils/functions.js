import { Appearance } from 'react-native';


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