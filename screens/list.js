import { Pressable, StyleSheet } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useEffect, useState } from "react";

import { HoverButton } from "../components/buttons";
import { PlanlyModal, PlanlyScreen, PlanlyScroll, PlanlyView } from "../components/basics";
import { NewCategory } from "../components/modals";
import { CategoryItem } from "../components/category";


// the list screen component
export default function List({setTDel,setTEdit,nTask,curT,data}){
	const cats = data.categories;
	const current = data.current;

	const [catModal,setCatModal] = useState(false);
	const [cat,setCat] = useState(0); // signals page when it should re-render due to cats changing

	const getCats = async()=>{
		// retrieves the category and signals page refresh
		await cats.getCats();
		setCat(cat+1);
	}

	useEffect(()=>{
		getCats();
	},[nTask,curT]);

	const addCat = async(title,color) => {
		// callback to add a new category
		await cats.addCat(title,color);
		setCatModal(false);
		setCat(cat+1);
	};
	const editCat = async(id,title,color) => {
		// callback to edit a category
		await cats.editCat(id,title,color);
		setCat(cat+1);
	};
	const delCat = async(id) => {
		// callback to delete a category
		const tids = await cats.removeCat(id);
		if(tids.filter((tid)=>current.tasks.includes(tid)).length){
			setTDel(tids[0]);
		}
		current.tasks = current.tasks.filter(tid=>!tids.includes(tid));
		current.save();
		setCat(cat+1);
	};
	const addTask = async(title,note,catid) => {
		// callback to add a new task
		await cats.addTask(title,note,catid);
	};
	const editTask = (tid,mode=0) => {
		// callback to edit a task
		// mode: 1 for cat change
		if(current.tasks.includes(tid)){
			// setTEdit(0);
			setTEdit(tid);
		}
		if(mode!==0){
			getCats();
		}
	};
	const delTask = async(tid) => {
		// callback to delete a task
		if(current.tasks.includes(tid)){
			current.tasks = current.tasks.filter(t=>t!=tid);
			current.save();
			setTDel(tid);
		}
		await cats.removeTask(tid);
		setCat(cat+1);
	};
	const moveCat = ({data,from,to}) => {
		if(from!==to){
			cats.categories = data;
			setCat(cat+1);
			cats.moveCat(to);
		}
	};

	const renderCat = ({item,getIndex,drag,isActive}) => {
		return (
			<Pressable disabled={isActive} style={getIndex()===cats.categories.length-1?{...styles.catItem,paddingBottom:48}:styles.catItem} onLongPress={drag}>
				<CategoryItem cat={item} refresh={cat} picker={false} onDel={delCat} onEdit={editCat} items={cats.items()} onAddTask={addTask} onEditTask={editTask} onDelTask={delTask} />
			</Pressable>
		);
	};

	return (
		<GestureHandlerRootView><PlanlyScreen>
			<DraggableFlatList
				data={cats.categories}
				onDragEnd={moveCat}
				keyExtractor={(item)=>item.id}
				renderItem={renderCat}
			/>
			<HoverButton icon='plus' action={()=>setCatModal(true)} />
			<PlanlyModal show={catModal} setShow={setCatModal}>
				<NewCategory action={addCat} />
			</PlanlyModal>
		</PlanlyScreen></GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	catItem: {
		width: '100%',
		padding: 16,
	},
});