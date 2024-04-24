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

export function IconTextButton({icon,label,action,style}){
	const theme = getTheme(useContext(SettingsContext).thm);
	const color = getColor(theme);

	return (
		<Pressable 
			onPress={action}
			style={{...styles.iconText,shadowColor:themeColors[color],...style}}
		>
			<Image tintColor={themeColors[theme]} source={icons[icon+'-bold']} style={styles.iconTextIcon} />
			<LabelText style={{color:themeColors[theme]}}>{label}</LabelText>
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
	iconTextIcon: {
		width: 18,
		height: 18
	},
	iconText: {
		display: 'flex',
		flexDirection: 'row',
		gap: 8,
		backgroundColor: themeColors.primary.original,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 12,
		elevation: 4,
	},
});

const icons = {
	'plus-bold': require('../assets/icons/plus-bold.png'),
	'check-bold': require('../assets/icons/check-bold.png'),
	'play-bold': require('../assets/icons/play-bold.png'),
	'edit': require('../assets/icons/edit-light.png'),
	'bin': require('../assets/icons/bin-light.png'),
	'add': require('../assets/icons/plus-light.png'),
	'up': require('../assets/icons/up-light.png'),
	'down': require('../assets/icons/down-light.png'),
	'view': require('../assets/icons/view-light.png'),
	'box': require('../assets/icons/box-light.png'),
	'checkbox': require('../assets/icons/checkbox-light.png'),
	'remove': require('../assets/icons/remove-light.png'),
};