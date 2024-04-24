import * as SecureStore from 'expo-secure-store';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from "react";

import { themeColors } from '../utils/colors';
import { vision } from '../utils/translations';
import { SettingsContext } from '../utils/hooks';

import { BodyText, PlanlyModal, PlanlyView } from './basics';
import { VisionEditor } from './modals';
import { getColor } from '../utils/functions';


export function VisionBoard(){
	const lang = useContext(SettingsContext).lang;
	const color = getColor(useContext(SettingsContext).thm);

	const [goal,setGoal] = useState('');
	const [why,setWhy] = useState('');
	
	const [gModal,setGModal] = useState(false);
	const [yModal,setYModal] = useState(false);

	useEffect(()=>{
		let g = SecureStore.getItem('goal');
		let y = SecureStore.getItem('why');
		if(g){
			setGoal(g);
		}
		if(y){
			setWhy(y);
		}
	},[]);

	const updateGoal = (g)=>{
		setGModal(false);
		SecureStore.setItem('goal',g);
		setGoal(g);
	};
	const updateWhy = (y)=>{
		setYModal(false);
		SecureStore.setItem('why',y);
		setWhy(y);
	};

	return (
		<PlanlyView>
			<PlanlyView transparent={false} style={{...styles.board,shadowColor:themeColors[color]}}>
				<Pressable style={styles.row} onLongPress={()=>setGModal(true)}>
					<Image source={require('../assets/icons/flag-fill.png')} tintColor={themeColors.accent.original} style={styles.icon} />
					<BodyText style={goal?styles.text:styles.textGray}>{goal?goal:vision.goalPlaceHolder[lang]}</BodyText>
				</Pressable>
				<Pressable style={styles.row} onLongPress={()=>setYModal(true)}>
					<Image source={require('../assets/icons/fire-fill.png')} tintColor={themeColors.accent.original} style={styles.icon} />
					<BodyText style={why?styles.text:styles.textGray}>{why?why:vision.whyPlaceHolder[lang]}</BodyText>
				</Pressable>
			</PlanlyView>
			<PlanlyModal show={gModal} setShow={setGModal}>
				<VisionEditor value={goal} placeholder={vision.goalPlaceHolder[lang]} buttonLabel={vision.modalButton[lang]} action={updateGoal} />
			</PlanlyModal>
			<PlanlyModal show={yModal} setShow={setYModal}>
				<VisionEditor value={why} placeholder={vision.whyPlaceHolder[lang]} buttonLabel={vision.modalButton[lang]} action={updateWhy} />
			</PlanlyModal>
		</PlanlyView>
	);
}

const styles = StyleSheet.create({
	board: {
		borderRadius: 16,
		padding: 32,
		elevation: 4,
		display: 'flex',
		gap: 16,
	},
	row: {
		display: 'flex',
		gap: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	text: {
		display: 'flex',
		flexGrow: 1,
		flexShrink: 1,
	},
	textGray: {
		display: 'flex',
		flexGrow: 1,
		flexShrink: 1,
		color: themeColors.gray,
	},
	icon: {
		width: 32,
		height: 32,
	},
});