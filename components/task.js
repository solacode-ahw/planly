import { Pressable, Image, StyleSheet } from "react-native";
import { GestureDetector, Gesture, Directions } from "react-native-gesture-handler";
import { useContext, useState, useMemo } from "react";

import { themeColors } from "../utils/colors";
import { getColor } from "../utils/functions";
import { SettingsContext } from "../utils/hooks";
import { delTaskWarning } from "../utils/translations";

import { BodyText, PlanlyView, PlanlyModal } from "./basics";
import { TapButton } from "./buttons";
import { ViewTask, EditTask, Warning } from "./modals";

export function TaskItem ({task,picker,plan=false,pick=()=>{},items={},onEdit=()=>{},onDel=()=>{},onFlip=()=>{},onUp=()=>{},onDown=()=>{}}){
	/*
		displays a task

		task: the task object to view
		picker: whether the task is shown in task picker
		plan: whether the task is shown in planned section of plan page
		pick: callback to call if picker=true and the task is tapped
		items: to be passed to edit task modal
		onEdit: callback to call if task is edited.
		odDel: callback to call if task is deleted.
		onFlip: callback to call when task's done state is fliped
		onUp: callback to call when task is moved up
		onDown: callback to call when task is moved down
	*/
	const color = getColor(useContext(SettingsContext).thm);
	const lang = useContext(SettingsContext).lang;

	const [done,setDone] = useState(task.done);
	const [title,setTitle] = useState(task.title);

	const [view,setView] = useState(false);
	const [edit,setEdit] = useState(false);
	const [warn,setWarn] = useState(false);

	const gestures = useMemo(()=>{
		const up = Gesture.Fling().direction(Directions.UP).onStart(()=>{
			if(!done){
				onUp(task.id,task.rank);
			}
		});
		const down = Gesture.Fling().direction(Directions.DOWN).onStart(()=>{
			if(!done){
				onDown(task.id,task.rank);
			}
		});
		return Gesture.Exclusive(up,down);
	});

	const flipDone = async()=>{
		// flips the done state of the task
		await task.flipDone();
		onFlip();
		setDone(!done);
	};
	const editTask = (title,note,catid) => {
		// edits task if it is edited in list page according to what's changed
		if(catid===task.catid){
			task.updateTask(title,note);
			setTitle(title);
			setEdit(false);
			onEdit(task.id);
		} else {
			task.updateTask(title,note,catid);
			setTitle(title);
			setEdit(false);
			onEdit(task.id,1);
		}
	};
	const editFromView = () => {
		// launches editing from view modal
		setView(false);
		setEdit(true);
	};
	const del = () => {
		// deletes a task
		onDel(task.id);
		setWarn(false);
	};

	if(plan) {} else if(!(picker && done)) {
		return (
			<PlanlyView style={{width: '100%'}}>
				<PlanlyView style={styles.row}>
					{picker?null:
						<GestureDetector gesture={gestures}>
							<PlanlyView style={styles.gdetect}>
								<Image 
									source={require('../assets/icons/move-light.png')} 
									tintColor={done?themeColors.gray:themeColors[color]} 
									style={styles.img} 
								/>
							</PlanlyView>
						</GestureDetector>
					}
					<Pressable style={styles.label} onPress={picker?pick:flipDone}>
						<BodyText 
							style={done?{...styles.labelDone,textDecorationColor: themeColors[color]}:null}
						>
							{title}
						</BodyText>
					</Pressable>
					{picker?null: <TapButton icon='view' action={()=>setView(true)} /> }
					{picker?null: <TapButton icon='edit' action={()=>setEdit(true)} /> }
					{picker?null: <TapButton icon='bin' action={()=>setWarn(true)} /> }
				</PlanlyView>
				<PlanlyModal show={view} setShow={setView}>
					<ViewTask task={task} back={()=>setView(false)} onEdit={editFromView} />
				</PlanlyModal>
				<PlanlyModal show={edit} setShow={setEdit}>
					<EditTask task={task} action={editTask} items={items} />
				</PlanlyModal>
				<PlanlyModal show={warn} setShow={setWarn}>
					<Warning message={delTaskWarning.message[lang](task.title)} labels={delTaskWarning.labels[lang]} actions={[()=>setWarn(false),del]}  />
				</PlanlyModal>
			</PlanlyView>
		);
	} else {
		return null;
	}
}

const styles = StyleSheet.create({
	row: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
		paddingVertical: 10,
	},
	label: {
		alignContent: 'stretch',
		display: 'flex',
		flexGrow: 1,
		flexShrink: 1,
	},
	labelDone: {
		textDecorationLine: 'line-through',
	},
	gdetect: {
		width: 40,
		height: 40,
		padding: 10,
	},
	img: {
		width: 20,
		height: 20,
	}
});