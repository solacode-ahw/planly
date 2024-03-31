import { Pressable, Image, StyleSheet } from "react-native";
import { useContext } from "react";

import { themeColors } from "../utils/colors";
import { SettingsContext } from "../utils/hooks";
import { getColor } from "../utils/functions";

import { PlanlyView } from "./basics";


function TabBarButton({icon,fill,action}){ // component for the tab bar buttons
	const color = themeColors[getColor(useContext(SettingsContext).thm)];

	return (
		<Pressable style={styles.button} onPress={action}>
			<Image style={styles.button} source={icons[icon][fill?'fill':'light']} tintColor={color} />
		</Pressable>
	);
}

export default function TabBar({state,navigation,theme}){ // component to replace the default tab bar of tab navigator
	const name = state.routeNames[state.index];

	return (
		<PlanlyView transparent={false} style={styles.bar}>
			<TabBarButton icon='list' fill={name==='list'} action={()=>navigation.navigate('list')} />
			<TabBarButton icon='plan' fill={name==='plan'} action={()=>navigation.navigate('plan')} />
			<TabBarButton icon='archive' fill={name==='archive'} action={()=>navigation.navigate('archive')} />
		</PlanlyView>
	);
}

const styles = StyleSheet.create({
	bar: {
		display: 'flex',
		flexDirection: 'row',
		paddingHorizontal: 32,
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderColor: themeColors.primary.darkest+'0F',
		shadowColor: themeColors.primary.darkest,
		elevation: 12,
	},
	button: {
		width: 24,
		height: 24,
	},
});

const icons = { // images needed for tab bar icons are loaded here...
	list: {
		light: require('../assets/icons/list-light.png'),
		fill: require('../assets/icons/list-fill.png'),
	},
	plan: {
		light: require('../assets/icons/plan-light.png'),
		fill: require('../assets/icons/plan-fill.png'),
	},
	archive: {
		light: require('../assets/icons/archive-light.png'),
		fill: require('../assets/icons/archive-fill.png'),
	},
};