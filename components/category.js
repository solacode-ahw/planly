import { Image, StyleSheet } from "react-native";
import { useState, useContext, useEffect, useRef } from "react";

import { categoryColors } from "../utils/colors";
import { getColor } from "../utils/functions";
import { SettingsContext } from "../utils/hooks";
import { delCatWarning } from "../utils/translations";
import { getTask } from "../utils/data";

import { LabelText, PlanlyView, PlanlyModal } from "./basics";
import { TapButton } from "./buttons";
import { EditCategory, Warning, NewTask } from "./modals";
import { TaskItem } from "./task";


export function CategoryItem({cat,refresh,picker,onDel,onEdit,onAddTask,onEditTask,onDelTask,onPick,items,picks=[]}){
	/*
		the component which views a category with its tasks

		cat: the category to be viewed
		refresh: signals the component that it needs to re-render
		picker: whether or not the category is being viewed in picker menu
		onDel: callback to call when the category is to be deleted
		onEdit: callback to call when the category is to be edited
		onAddTask: callback to call when a task is to be added to the category
		onEditTask: callback to call when a task in category is to be edited
		onDelTask: callback to call when a task in category is to be deleted
		items: the object of id:'title' of categories
	*/
	const color = getColor(useContext(SettingsContext).thm);
	const lang = useContext(SettingsContext).lang;

	const tasks = useRef([]);
	const last = useRef(0);
	const [load,setLoad] = useState(0);
	const [loaded,setLoaded] = useState(0);

	const [open,setOpen] = useState(false);

	const [editModal,setEditModal] = useState(false);
	const [taskModal,setTaskModal] = useState(false);
	const [warn,setWarn] = useState(false);

	useEffect(()=>{
		// retrieves the tasks objects of categorie's tasks
		const get = async(id)=>{
			if(!picks.includes(id)){
				tasks.current.push(await getTask(id));
				if(tasks.current.at(-1).done && !tasks.current.at(-2).done){
					last.current = tasks.current.at(-2).id;
				}
			}
			if(id===cat.tasks.at(-1)){
				if(last.current===0){
					last.current=id;
				}
				setLoaded(loaded+1);
			}
		};
		tasks.current=[];
		if(cat.tasks.length===0){
			setLoaded(true);
		} else {
			last.current = 0;
			cat.tasks.forEach(tid=>{
				get(tid);
			});
		}	
	},[refresh,load]);

	const edit = (...args) => {
		// edits the category
		onEdit(...args);
		setEditModal(false);
	};
	const del = () => {
		// deletes the category
		onDel(cat.id);
		setWarn(false);
	};
	const addTask = async(title,note,catid)=>{
		// adds a new task
		setTaskModal(false);
		await onAddTask(title,note,catid);
		setLoad(load+1);
	};
	const onTaskFlip = async() => {
		// it rearranges tasks when a task's done state has changed
		await cat.getTasks();
		setLoad(load+1);
	};
	const downTask = async(id,rank) => {
		// moves given task one down
		await cat.moveDown(cat.id,id,rank);
		await cat.getTasks();
		setLoad(load+1);
	};

	if(!loaded){
		return null;
	} else {
		return (
			<PlanlyView transparent={false} style={{...styles.card,shadowColor:categoryColors[color]}}>
				<PlanlyView style={styles.row}>
					<Image style={styles.mark} tintColor={categoryColors[cat.color]} source={require('../assets/icons/mark-fill.png')} />
					<LabelText style={styles.label}>{cat.title}</LabelText>
					{open?<TapButton icon='add' action={()=>setTaskModal(true)} />:null}
					{picker?null:<TapButton icon='edit' action={()=>setEditModal(true)} />}
					{picker?null:<TapButton icon='bin' action={()=>setWarn(true)} />}
				</PlanlyView>
				{open?
					<PlanlyView style={styles.taskContainer}>
						{tasks.current.map(task=><TaskItem task={task} picker={picker} pick={onPick} items={picker?null:items} onEdit={picker?null:onEditTask} onDel={picker?null:onDelTask} onFlip={onTaskFlip} onDown={downTask} last={last.current===task.id} key={task.id} />)}
					</PlanlyView>
				:null}
				{open?<TapButton icon='up' action={()=>setOpen(false)} />:<TapButton icon='down' action={()=>setOpen(true)} />}
				<PlanlyModal show={editModal} setShow={setEditModal}>
					<EditCategory action={edit} cat={cat} />
				</PlanlyModal>
				<PlanlyModal show={taskModal} setShow={setTaskModal}>
					<NewTask action={addTask} catid={cat.id} items={items} />
				</PlanlyModal>
				<PlanlyModal show={warn} setShow={setWarn}>
					<Warning message={delCatWarning.message[lang](cat.title)} labels={delCatWarning.labels[lang]} actions={[()=>setWarn(false),del]}  />
				</PlanlyModal>
			</PlanlyView>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		padding: 20,
		elevation: 4,
		display: 'flex',
		gap: 20,
		alignItems: 'center',
	},
	row: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
	},
	label: {
		display: 'flex',
		flexGrow: 1,
		flexShrink: 1,
		alignContent: 'stretch',
	},
	taskContainer: {
		width: '100%',
	},
	mark: {
		width: 20,
		height: 20,
	}
});