import * as SecureStore from 'expo-secure-store';
import { getLocales } from 'expo-localization';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useReducer, useEffect, useState, useContext, useMemo } from 'react';

import { SettingsContext, settingReducer } from './utils/hooks';
import { getTheme } from './utils/functions';
import { initDB, Categories, Current } from './utils/data';

import About from './screens/about';
import Settings from './screens/settings';
import List from './screens/list';
import Plan from './screens/plan';
import Archive from './screens/archive';
import Tour from './screens/tour';

import Header from './components/Header';
import TabBar from './components/TabBar';


preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Main() { // tab navigator component that is embeded inside of stack navigator
	const theme = getTheme(useContext(SettingsContext).thm);
	// defining helper states that will signal a change between screens
	const [tDel, setTDel] = useState(0); // a task in present in current has been deleted in list page
	const [tEdit, setTEdit] = useState(0); // a task in present in current has been edited in list page
	const [cur, setCur] = useState(0); // the current day has been archived
	const [nTask, setNTask] = useState(0); // a new task has been created from task picker
	const [curT, setCurT] = useState(0); // a task has been edited from the plan page

	const [loaded,setLoaded] = useState(false);
	const data = useMemo(()=>{ // getting the data used throughout the app
		const getData = async(catList)=>{
			await catList.getCats();
			setLoaded(true);
		};
		let cats = new Categories();
		let cur = new Current();
		getData(cats);
		return {
			categories: cats, // the list of categories and their tasks
			current: cur, // the current day information
		};
	},[]);

	if(!loaded){
		return null;
	} else {
		return (
			<Tab.Navigator initialRouteName='plan' backBehavior='initialRoute' tabBar={props => TabBar({...props,theme:theme})} 
					screenOptions={{
						headerShown: false,
				}}>
				<Tab.Screen name='list'>
					{(props) => <List {...props} setTDel={setTDel} setTEdit={setTEdit} nTask={nTask} curT={curT} data={data} />}
				</Tab.Screen>
				<Tab.Screen name='plan'>
					{(props) => <Plan {...props} tDel={tDel} tEdit={tEdit} setCur={setCur} setNTask={setNTask} setCurT={setCurT} data={data} />}
				</Tab.Screen>
				<Tab.Screen name='archive'>
					{(props) => <Archive {...props} cur={cur} />}
				</Tab.Screen>
			</Tab.Navigator>
		);
	}
}

export default function App() {

	const [settings,dispatch] = useReducer(settingReducer,{
		thm: 'auto',
		lang: 'en',
		ds: 'intl',
		ws: 6,
	});
	const [loaded, setLoaded] = useState(false);
	/*
		The following fonts are considered proprietary software.
		To gain information about the laws regarding the use of these fonts, please visit www.fontiran.com
		This set of fonts are used in this project under the license: (VYLT4F08)
	*/
	const [font] = useFonts({
		'BornaRegular': require('./assets/fonts/BornaRegular.ttf'),
		'BornaBold': require('./assets/fonts/BornaBold.ttf'),
	});
	const [tour,setTour] = useState(false);

	useEffect(()=>{
		setLoaded(false);
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
		// run tour if it's the first time app is running
		val = SecureStore.getItem('init');
		if(!val){
			SecureStore.setItem('init','true');
			setTour(true);
		}
		// database initialization
		const dbSetup = async() => {
			await initDB();
			setLoaded(true);
		};
		dbSetup();
	},[]);

	if(!loaded || !font){
		return null;
	} else {
		hideAsync();
		return (
			<NavigationContainer><SettingsContext.Provider value={settings}>
				<Stack.Navigator initialRouteName='main' screenOptions={{ header: Header}}>
					<Stack.Screen name='about'>
						{(props) => <About {...props} setTour={setTour} />}
					</Stack.Screen>
					<Stack.Screen name='settings'>
						{(props) => <Settings {...props} dispatch={dispatch} />}
					</Stack.Screen>
					<Stack.Screen name='main' component={Main} />
				</Stack.Navigator>
				<Tour show={tour} setShow={setTour} />
			</SettingsContext.Provider></NavigationContainer>
		);
	}
}