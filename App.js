import * as SecureStore from 'expo-secure-store';
import { getLocales } from 'expo-localization';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useReducer, useEffect, useState, useContext } from 'react';

import { SettingsContext, settingReducer } from './utils/hooks';
import { getTheme } from './utils/functions';

import About from './screens/about';
import Settings from './screens/settings';
import List from './screens/list';
import Plan from './screens/plan';
import Archive from './screens/archive';

import Header from './components/Header';
import TabBar from './components/TabBar';


preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Main() { // tab navigator component that is embeded inside of stack navigator
	const theme = getTheme(useContext(SettingsContext).thm);

	// defining helper states that will signal a change between screens
	const [tDel, setTDel] = useState(0);
	const [tEdit, setTEdit] = useState(0);
	const [cur, setCur] = useState(0);
	const [nTask, setNTask] = useState(0);
	const [curT, setCurT] = useState(0);

	return (
		<Tab.Navigator initialRouteName='plan' backBehavior='initialRoute' tabBar={props => TabBar({...props,theme:theme})} screenOptions={{
			headerShown: false,
		}}>
			<Tab.Screen name='list'>
				{(props) => <List {...props} setTDel={setTDel} setTEdit={setTEdit} nTask={nTask} curT={curT} />}
			</Tab.Screen>
			<Tab.Screen name='plan'>
				{(props) => <Plan {...props} tDel={tDel} tEdit={tEdit} setCur={setCur} setNTask={setNTask} setCurT={setCurT} />}
			</Tab.Screen>
			<Tab.Screen name='archive'>
				{(props) => <Archive {...props} cur={cur} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
}

export default function App() {

	const [settings,dispatch] = useReducer(settingReducer,{
		thm: 'auto',
		lang: 'en',
		ds: 'intl',
		ws: 6,
	});
	const [loaded, setLoaded] = useState(false);
	const [font] = useFonts({
		'BornaRegular': require('./assets/fonts/BornaRegular.ttf'),
		'BornaBold': require('./assets/fonts/BornaBold.ttf'),
	});

	useEffect(()=>{
		// reading setting values from device and applying them
		let val = SecureStore.getItem('thm');
		if(val!='auto'){
			dispatch({
				field: 'thm',
				value: val?val:'auto',
			});
		}
		val = SecureStore.getItem('lang');
		if(val!='en'){
			dispatch({
				field: 'lang',
				value: val?val:(getLocales()[0].languageCode=='fa'?'fa':'en'),
			});
		}
		val = SecureStore.getItem('ds');
		if(val!='intl'){
			dispatch({
				field: 'ds',
				value: val?val:'intl',
			});
		}
		val = SecureStore.getItem('ws');
		if(val!='6'){
			dispatch({
				field: 'ws',
				value: val?Number(val):6,
			});
		}
		// database prep code
		setLoaded(true);
	},[]);

	if(!loaded || !font){
		return null;
	} else {
		hideAsync();
		return (
			<NavigationContainer><SettingsContext.Provider value={settings}><Stack.Navigator initialRouteName='main' screenOptions={{
				header: Header,
			}}>
				<Stack.Screen name='about' component={About} />
				<Stack.Screen name='settings'>
					{(props) => <Settings {...props} dispatch={dispatch} />}
				</Stack.Screen>
				<Stack.Screen name='main' component={Main} />
			</Stack.Navigator></SettingsContext.Provider></NavigationContainer>
		);
	}
}


/*

	TO DO

	1. setup database

*/