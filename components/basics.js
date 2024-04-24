import { ScrollView,View, Text, TextInput, Modal, Pressable, Image, StyleSheet } from "react-native";
import { useContext, useState, useRef, useEffect } from "react";

import { getTheme, getColor } from "../utils/functions";
import { themeColors } from "../utils/colors";
import { SettingsContext } from "../utils/hooks";


// the basic widgets to use in the app including the basic styling of the app

export function PlanlyScreen({children}){
	return (
		<PlanlyView transparent={false} style={styles.container}>
			{children}
		</PlanlyView>
	);
}
export function PlanlyScroll({children,padded=false}){
	return (
		<ScrollView><PlanlyView style={padded?{...styles.scroll,paddingBottom:48}:styles.scroll}>
			{children}	
		</PlanlyView></ScrollView>
	);
}

export function PlanlyView({transparent=true,style={},...props}){
	const theme = getTheme(useContext(SettingsContext).thm);

	return (
		<View style={{backgroundColor:transparent?'#00000000':themeColors[theme],...style}} {...props} />
	);
}

export function PlanlyModal({show,setShow,children,height='auto'}){
	const theme = getTheme(useContext(SettingsContext).thm);
	const color = getColor(theme);

	return (
		<Modal animationType="slide" transparent={true} visible={show} onRequestClose={()=>setShow(false)}>
			<PlanlyView style={styles.modalOut}><PlanlyView transparent={false} style={{...styles.modalIn,shadowColor:themeColors[color],height:height}}>
				{children}
			</PlanlyView></PlanlyView>
		</Modal>
	);
}

export function BodyText({style,...props}){
	const color = getColor(useContext(SettingsContext).thm);

	return (
		<Text style={{color:themeColors[color],...styles.body,...style}} {...props} />
	);
}
export function LabelText({style,...props}){
	const color = getColor(useContext(SettingsContext).thm);

	return (
		<Text style={{color:themeColors[color],...styles.label,...style}} {...props} />
	);
}
export function TitleText({style,...props}){
	const color = getColor(useContext(SettingsContext).thm);

	return (
		<Text style={{color:themeColors[color],...styles.title,...style}} {...props} />
	);
}

export function PlanlyTextInput({style,...props}){
	const theme = getTheme(useContext(SettingsContext).thm);
	const color = getColor(theme);

	return (
		<TextInput 
			style={{...styles.textInput,...styles.body,backgroundColor:themeColors[theme],borderColor:themeColors[color],color:themeColors[color],...style}} 
			cursorColor={themeColors.accent.original} selectionColor={themeColors.accent.original} 
			placeholderTextColor={themeColors.gray} {...props}
		/>
	);
}

export function DropDown({items,action,width,initial='',label='',direction='down',refresh=0}){
	/*
		items: an object with items as id:'value' to view in the dropdown menu
		action: callback to call when value changes
		width: the width of the dropdown menu
		initial: the initial value of the dropdown. if empty, the label will be shown
		label: if initial is not given, this would show as the placeholder
		direction: the direction which the menu should open in. default is down
	*/
	const theme = getTheme(useContext(SettingsContext).thm);
	const color = getColor(theme);

	const [open,setOpen] = useState(false);
	const [value,setValue] = useState(initial);

	const [pose,setPose] = useState(StyleSheet.create({}));
	const elemRef = useRef(null);

	useEffect(()=>{
		setValue(initial);
	},[refresh]);

	const expand = ()=>{
		let n = Object.keys(items).length;
		if(value!==''){
			n = n-1;
		}
		elemRef.current.measure((x,y,width,height,pageX,pageY)=>{
			if(direction=='down'){
				setPose(StyleSheet.create({left:pageX,top:pageY}));
			} else {
				setPose(StyleSheet.create({left:pageX,top:pageY-(n*height)}));
			}
		});
		setOpen(true);
	};
	const pick = (val)=>{
		action(val);
		setValue(val);
		setOpen(false);
	};

	return (
		<View>
			<Pressable onPress={expand} style={{...styles.dropClose,borderColor:themeColors[color],width:width}} ref={elemRef}>
				<BodyText style={value?{}:{color:themeColors.gray}}>{value!==''?items[value]:label}</BodyText>
				<Image source={require('../assets/icons/drop-fill.png')} tintColor={themeColors[color]} style={{width:12,height:12}} />
			</Pressable>
			<Modal transparent={true} visible={open} animationType="fade" onRequestClose={()=>setOpen(false)}>
				<View><PlanlyView transparent={false} style={{...pose,shadowColor:themeColors[color],...styles.dropOpen,width:width}}>
					{direction!=='down'?null:
						<Pressable onPress={()=>setOpen(false)} style={styles.dropTop}>
							<BodyText style={value?{}:{color:themeColors.gray}}>{value?items[value]:label}</BodyText>
							<Image source={require('../assets/icons/dropup-fill.png')} tintColor={themeColors[color]} style={{width:12,height:12}} />
						</Pressable>
					}
					{Object.keys(items).map(key=>
						key==value?null:
							<Pressable onPress={()=>pick(key)} style={styles.dropItem} key={key}>
								<BodyText>{items[key]}</BodyText>
							</Pressable>
					)}
					{direction==='down'?null:
						<Pressable onPress={()=>setOpen(false)} style={styles.dropTop}>
							<BodyText style={value?{}:{color:themeColors.gray}}>{value?items[value]:label}</BodyText>
							<Image source={require('../assets/icons/drop-fill.png')} tintColor={themeColors[color]} style={{width:12,height:12}} />
						</Pressable>
					}
				</PlanlyView></View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%',
	},
	scroll: {
		display: 'flex',
		gap: 32,
		paddingVertical: 32,
		paddingHorizontal: 16,
	},
	modalOut: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	modalIn: {
		paddingVertical: 32,
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderTopRightRadius: 32,
		borderTopLeftRadius: 32,
		elevation: 16,
	},
	textInput: {
		borderBottomWidth: 1,
		padding: 8,
		textAlign: 'justify',
	},
	body: {
		fontFamily: 'BornaRegular',
		fontSize: 14,
		lineHeight: 24,
		textAlign: 'justify',
	},
	label: {
		fontFamily: 'BornaBold',
		fontSize: 14,
		lineHeight: 24,
		textAlign: 'justify',
	},
	title: {
		fontFamily: 'BornaBold',
		fontSize: 16,
		lineHeight: 26,
		textAlign: 'justify',
	},
	dropClose: {
		display: 'flex',
		flexDirection: 'row',
		padding: 8,
		gap: 8,
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderRadius: 12,
	},
	dropOpen: {
		elevation: 4,
		borderRadius: 12,
		padding: 8,
	},
	dropTop: {
		display: 'flex',
		flexDirection: 'row',
		gap: 8,
		padding: 8,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	dropItem: {
		padding:8,
	}
});