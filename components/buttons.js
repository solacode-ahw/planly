import { Pressable, Image, StyleSheet } from 'react-native';
import { useContext } from 'react';

import { getTheme,getColor } from '../utils/functions';
import { SettingsContext } from '../utils/hooks';
import { themeColors } from '../utils/colors';

import { LabelText } from './basics';


export function HoverButton({icon,action}){
	const theme = getTheme(useContext(SettingsContext).thm);

	return (
		<Pressable style={{...styles.hoverButton,shadowColor:themeColors[getColor(theme)]}} onPress={action}>
			<Image style={styles.hoverIcon} source={icons[icon+'-bold']} tintColor={themeColors[theme]} />
		</Pressable>
	);
}

// a button with just a text
export function TextButton({label,action,style,active=true}){
	const theme = getTheme(useContext(SettingsContext).thm);
	const color = getColor(theme);

	return (
		<Pressable 
			onPress={action} 
			disabled={!active} 
			style={active?{...styles.buttonActive,shadowColor:themeColors[color],...style}:{...styles.buttonDeactive,...style}}
		>
			<LabelText style={{color:themeColors[theme]}}>{label}</LabelText>
		</Pressable>
	);
}

// a button with just an icon
export function TapButton({icon,action,style}){
	const color = getColor(useContext(SettingsContext).thm);
	
	return (
		<Pressable style={{...styles.tapButton,...style}} onPress={action}>
			<Image style={styles.tapButton} tintColor={themeColors[color]} source={icons[icon]} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	hoverButton: {
		backgroundColor: themeColors.primary.original,
		padding: 16,
		borderRadius: 12,
		elevation: 4,
		position: 'absolute',
		bottom: 16,
		end: 16,
	},
	hoverIcon: {
		width: 18,
		height: 18,
	},
	buttonActive: {
		backgroundColor: themeColors.primary.original,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 12,
		elevation: 4,
	},
	buttonDeactive: {
		backgroundColor: themeColors.gray,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 12,
	},
	tapButton: {
		width: 20,
		height: 20,
	},
});

const icons = {
	'plus-bold': require('../assets/icons/plus-bold.png'),
	'check-bold': require('../assets/icons/check-bold.png'),
	'edit': require('../assets/icons/edit-light.png'),
	'bin': require('../assets/icons/bin-light.png'),
	'add': require('../assets/icons/plus-light.png'),
	'up': require('../assets/icons/up-light.png'),
	'down': require('../assets/icons/down-light.png'),
	'view': require('../assets/icons/view-light.png'),
};