import { StyleSheet, Pressable, Image, ScrollView, View } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";

import { SettingsContext } from "../utils/hooks";
import { categoryColors } from "../utils/colors";
import { newCatModal, editCatModal, newTaskModal, editTaskModal, viewTaskModal, archiveViewLabels } from "../utils/translations";
import { getCat } from "../utils/data";

import { PlanlyTextInput, LabelText, TitleText, PlanlyView, BodyText, DropDown } from "./basics";
import { TextButton, TapButton } from "./buttons";


function ColorItem({color,selected,action}){
	/*
		a color component to view a color in category modals

		color: the color name with keys in categoryColors object
		selected: whether the color is selected or not
		action: callback to call if color is tapped to be selected
	*/
	if(selected){
		return (
			<PlanlyView style={{width:36,height:36,borderRadius:18,borderColor:categoryColors[color],borderWidth:1,padding:5}}>
				<PlanlyView style={{width:24,height:24,borderRadius:12,backgroundColor:categoryColors[color]}}></PlanlyView>
			</PlanlyView>
		);
	} else {
		return (
			<Pressable 
				style={{width:36,height:36,borderRadius:18,backgroundColor:categoryColors[color]}} 
				onPress={()=>action(color)} 
			/>
		);
	}
}
export function NewCategory({action}){
	/*
		a component to allow user to create a new category

		action: callback to call when category is to be created
	*/
	const lang = useContext(SettingsContext).lang;

	const [title,setTitle] = useState('');
	const [color,setColor] = useState(Object.keys(categoryColors)[0]);

	return (
		<PlanlyView style={styles.modal}>
			<TitleText style={{textAlign: 'center'}}>{newCatModal.title[lang]}</TitleText>
			<PlanlyTextInput placeholder={newCatModal.placeholder[lang]} value={title} onChangeText={setTitle} autoFocus={true} autoCapitalize='words' />
			<PlanlyView>
				<LabelText style={{paddingBottom:8}}>{newCatModal.color[lang]}</LabelText>
				<PlanlyView style={styles.colorView}>
					{Object.keys(categoryColors).map(key=>
						<ColorItem color={key} selected={color===key} action={setColor} key={key} />
					)}
				</PlanlyView>
			</PlanlyView>
			<TextButton label={newCatModal.button[lang]} active={title!==''} action={()=>action(title,color)} style={{alignSelf: 'flex-start'}} />
		</PlanlyView>
	);
}
export function EditCategory({action,cat}){
	/*
		a component to allow user to edit a category

		action: callback to call when category is about to be fully edited
		cat: the category that is to be edited
	*/
	const lang = useContext(SettingsContext).lang;

	const [title,setTitle] = useState(cat.title);
	const [color,setColor] = useState(cat.color);

	return (
		<PlanlyView style={styles.modal}>
			<TitleText style={{textAlign: 'center'}}>{editCatModal.title[lang]}</TitleText>
			<PlanlyTextInput placeholder={editCatModal.placeholder[lang]} value={title} onChangeText={setTitle} autoCapitalize='words' />
			<PlanlyView>
				<LabelText style={{paddingBottom:8}}>{editCatModal.color[lang]}</LabelText>
				<PlanlyView style={styles.colorView}>
					{Object.keys(categoryColors).map(key=>
						<ColorItem color={key} selected={color===key} action={setColor} key={key} />
					)}
				</PlanlyView>
			</PlanlyView>
			<TextButton label={editCatModal.button[lang]} active={title!==''} action={()=>action(cat.id,title,color)} style={{alignSelf: 'flex-start'}} />
		</PlanlyView>
	);
}

export function NewTask({action,catid,items}){
	/*
		a component which allows user to create a new task

		action: callback to be called when the task is about to be created
		catid: the catid meant to pre-populate the category dropdown field
		items: the object of id:'title' of categories
	*/
	const lang = useContext(SettingsContext).lang;

	const [title,setTitle] = useState('');
	const [note,setNote] = useState('');
	const [cat,setCat] = useState(catid);

	const create = ()=>{
		action(title,note,cat);
	};

	return (
		<PlanlyView style={styles.modal}>
			<TitleText>{newTaskModal.title[lang]}</TitleText>
			<PlanlyTextInput placeholder={newTaskModal.task[lang]} value={title} onChangeText={setTitle} autoFocus={true} autoCapitalize='words' />
			<PlanlyTextInput placeholder={newTaskModal.note[lang]} value={note} onChangeText={setNote} multiline={true} style={styles.multiline} />
			<PlanlyView>
				<LabelText style={{paddingBottom:8}}>{newTaskModal.category[lang]}</LabelText>
				<DropDown items={items} action={setCat} initial={cat} width={252} direction="up" />
			</PlanlyView>
			<TextButton label={newTaskModal.button[lang]} active={title!==''} action={create} style={{alignSelf: 'flex-start'}} />
		</PlanlyView>
	);
}
export function EditTask({task,action,items}){
	/*
		a component which allows user to edit task

		task: the task to be edited
		action: callback to be called when the task is about to be edited
		items: the object of id:'title' of categories
	*/
	const lang = useContext(SettingsContext).lang;

	const [title,setTitle] = useState(task.title);
	const [note,setNote] = useState(task.note);
	const [cat,setCat] = useState(task.catid);

	const edit = ()=>{
		action(title,note,cat);
	};

	return (
		<PlanlyView style={styles.modal}>
			<TitleText>{editTaskModal.title[lang]}</TitleText>
			<PlanlyTextInput placeholder={editTaskModal.task[lang]} value={title} onChangeText={setTitle} autoCapitalize='words' />
			<PlanlyTextInput placeholder={editTaskModal.note[lang]} value={note} onChangeText={setNote} multiline={true} style={styles.multiline} />
			<PlanlyView>
				<LabelText style={{paddingBottom:8}}>{editTaskModal.category[lang]}</LabelText>
				<DropDown items={items} action={setCat} initial={cat} width={252} direction="up" />
			</PlanlyView>
			<TextButton label={editTaskModal.button[lang]} active={title!==''} action={edit} style={{alignSelf: 'flex-start'}} />
		</PlanlyView>
	);
}
export function ViewTask({task,back,onEdit}){
	/*
		a component which allows user to view the details of a task

		task: the task to view
		back: callback used when back button is tapped
		onEdit: callback to call when the user taps on edit the task button
	*/
	const lang = useContext(SettingsContext).lang;

	const cat = useRef(null);
	const [loaded,setLoaded] = useState(false);

	useEffect(()=>{
		// retrieves the category object of the task
		const get = async()=>{
			cat.current = await getCat(task.catid);
			setLoaded(true);
		};
		get();
	},[]);

	if(!loaded){
		return null;
	} else {
		return (
			<PlanlyView style={styles.modal}>
				<PlanlyView style={styles.taskBanner}>
					<LabelText>{viewTaskModal.title[lang]}</LabelText>
					<BodyText style={styles.taskTitle}>{task.title}</BodyText>
					<TapButton icon='edit' action={onEdit} />
				</PlanlyView>
				{task.note?
					<ScrollView style={styles.scroll}>
						<BodyText>{task.note}</BodyText>
					</ScrollView>
					:null
				}
				<PlanlyView style={styles.row}>
					<Image source={require('../assets/icons/mark-fill.png')} tintColor={categoryColors[cat.current.color]} style={{width:20,height:20}} />
					<BodyText>{cat.current.title}</BodyText>
				</PlanlyView>
				<TapButton icon='down' action={back} style={styles.center} />
			</PlanlyView>
		);
	}
}

export function ViewArchive({date,grats,tasks,back}){
	const lang = useContext(SettingsContext).lang;

	return (
		<PlanlyView style={styles.modal}>
			<LabelText style={styles.center}>{date}</LabelText>
			<PlanlyView style={styles.block}>
				<LabelText>{archiveViewLabels.grats[lang]}</LabelText>
				<BodyText>{`1. ${grats[0]}`}</BodyText>
				<BodyText>{`2. ${grats[1]}`}</BodyText>
				<BodyText>{`3. ${grats[2]}`}</BodyText>
			</PlanlyView>
			<PlanlyView style={styles.block}>
				<LabelText>{archiveViewLabels.tasks[lang]}</LabelText>
				<ScrollView style={styles.scroll}>
					{tasks.map(task=>
						<BodyText style={task.done?styles.stroked:styles.normal} key={tasks.indexOf(task)}>{task.title}</BodyText>
					)}
				</ScrollView>
			</PlanlyView>
			<TapButton icon='down' action={back} style={styles.center} />
		</PlanlyView>
	);
}

export function Warning({message,labels=[],actions=[]}){
	// a component that views a warning with multiple text buttons
	return (
		<PlanlyView style={styles.warning}>
			<BodyText>{message}</BodyText>
			<PlanlyView style={styles.warningButtons}>
				{[...Array(labels.length).keys()].map(i=> <TextButton label={labels[i]} action={actions[i]} key={i} /> )}
			</PlanlyView>
		</PlanlyView>
	);
}

export function VisionEditor({value,placeholder,buttonLabel,action}){

	const [input,setInput] = useState(value);

	return (
		<PlanlyView style={styles.visionEditor}>
			<PlanlyTextInput value={input} onChangeText={setInput} placeholder={placeholder} multiline={true} style={{width: '100%'}} autoFocus={true} />
			<TextButton label={buttonLabel} action={()=>action(input)} />
		</PlanlyView>
	);
}

const styles = StyleSheet.create({
	modal: {
		width: 252,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'stretch',
		gap: 32,
	},
	colorView: {
		display: 'flex',
		width: 252,
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 18,
	},
	taskBanner: {
		display: 'flex',
		flexDirection: 'row',
		gap: 16,
		alignItems: 'center',
	},
	taskTitle: {
		flex: 1,
		alignContent: 'stretch',
	},
	warning: {
		display: 'flex',
		paddingHorizontal: 32,
		gap: 16,
	},
	warningButtons: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		gap: 16,
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
		justifyContent: 'flex-start',
	},
	visionEditor: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		gap: 32,
		paddingHorizontal: 32,
	},
	stroked: {
		textDecorationLine: 'line-through',
		paddingStart: 20,
	},
	normal: {
		paddingStart: 20,
	},
	center: {
		alignSelf: 'center',
	},
	block: {
		display: 'flex',
		flexDirection: 'column',
		gap: 16,
	},
	scroll: {
		maxHeight: 150,
	},
	multiline: {
		maxHeight: 125,
	}
});