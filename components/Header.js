import { Text, Image, Pressable, StyleSheet, StatusBar } from "react-native";
import { useContext } from "react";

import { themeColors } from "../utils/colors";
import { SettingsContext } from "../utils/hooks";
import { getTheme,getColor } from "../utils/functions";

import { PlanlyView } from "./basics";


function HeaderButton({icon,fill,action}){ // component for the header buttons
	const color = getColor(useContext(SettingsContext).thm);

	return (
		<Pressable style={styles.button} onPress={action}>
			<Image style={styles.button} source={icons[icon][fill?'fill':'light']} tintColor={themeColors[color]} />
		</Pressable>
	);
}

export default function Header({navigation,route}){ // component to replace default header of stack navigator
	const theme = getTheme(useContext(SettingsContext).thm);

	return (
		<PlanlyView transparent={false} style={styles.header}>
			<StatusBar backgroundColor={themeColors[theme]} barStyle={theme==='dark'?'light-content':'dark-content'} />
			<Text style={styles.name}>PLANLY</Text>
			<HeaderButton icon='about' fill={route.name==='about'} action={()=>navigation.navigate('about')} />
			<HeaderButton icon='setting' fill={route.name==='settings'} action={()=>navigation.navigate('settings')} />
		</PlanlyView>
	);
}

const styles = StyleSheet.create({
	header: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 32,
		gap: 32,
		elevation: 4,
		shadowColor: themeColors.primary.darkest,
	},
	name: {
		alignContent: 'stretch',
		flexGrow: 1,
		color: themeColors.primary.original,
		fontSize: 20,
		fontFamily: 'BornaBold',
		textAlign: 'justify',
	},
	button: {
		width: 24,
		height: 24,
	}
});

const icons = { // list of images needed for header icons are loaded here
	setting: {
		light: require('../assets/icons/setting-light.png'),
		fill: require('../assets/icons/setting-fill.png'),
	},
	about: {
		light: require('../assets/icons/about-light.png'),
		fill: require('../assets/icons/about-fill.png'),
	},
};