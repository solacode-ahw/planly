import * as sqlite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';


// datatypes used throughout the app
export class Categories {
	constructor(){
		// categories devided into lists based on their color
		this.categories = {
			violet: [],
			lilac: [],
			purple: [],
			blue: [],
			sky: [],
			ocean: [],
			grass: [],
			green: [],
			lemon: [],
			yellow: [],
			sun: [],
			orange: [],
			coral: [],
			red: [],
			pink: [],
		};
	}
	items(){
		// returns an object of all categories id: 'category title'
		let itms = {};
		Object.values(this.categories).forEach(list=>{
			list.forEach(cat=>{
				itms[cat.id] = cat.title;
			});
		});
		return itms;
	}
	async getCats(){
		// reads categories from database and saves the category object for them in categories list
		Object.keys(this.categories).forEach(k=>{
			this.categories[k]=[];
		});
		db = sqlite.openDatabase('main');
		const [res] = await db.execAsync([
			{sql:'SELECT rowid,title,color FROM category',args:[]},
		],true);
		db.closeAsync();
		if(res.rows) {
			for(row of res.rows){
				this.categories[row.color].push(new Category(row.rowid,row.title,row.color));
				await this.categories[row.color].at(-1).getTasks();
			}
		}
	}
	async addCat(title,color){
		// adds a category to the database and to the categories list of this object
		const db = sqlite.openDatabase('main');
		const [res] = await db.execAsync([
			{sql:'INSERT INTO category(title,color) VALUES(?,?)',args:[title,color]},
		],false);
		db.closeAsync();
		this.categories[color].push(new Category(res.insertId,title,color));
	}
	async editCat(id,title,color){
		// edits a category
		const db = sqlite.openDatabase('main');
		await db.execAsync([
			{sql:'UPDATE category SET title=?,color=? WHERE rowid=?',args:[title,color,id]},
		],false);
		await this.getCats();
		db.closeAsync();
	}
	async removeCat(id){
		// deletes a category from database and the categories list
		db = sqlite.openDatabase('main');
		const res = await db.execAsync([
			{sql:'SELECT rowid FROM task WHERE catid=?',args:[id]},
			{sql:'DELETE FROM task WHERE catid=?',args:[id]},
			{sql:'DELETE FROM category WHERE rowid=?',args:[id]},
		],false);
		db.closeAsync();
		Object.keys(this.categories).forEach(key=>{
			this.categories[key] = this.categories[key].filter(cat=>cat.id!=id);
		});
		if(res[0].rows){
			return res[0].rows.map(row=>row.rowid);
		} else {
			return [];
		}
	}
	async addTask(title,note,catid) {
		// adds a new task to the database and the respective category
		db = sqlite.openDatabase('main');
		let [rank] = await db.execAsync([
			{sql:'SELECT max(rank) FROM task WHERE catid=?',args:[catid]}
		],true);
		if(rank.rows[0]){
			rank = rank.rows[0]['max(rank)']+1;
		} else {
			rank = 1;
		}
		const [res] = await db.execAsync([
			{sql:'INSERT INTO task(title,note,rank,catid) VALUES (?,?,?,?)',args:[title,note,rank,catid]}
		],false);
		db.closeAsync();
		Object.values(this.categories).forEach(list=>{
			list.forEach(cat=>{
				if(catid==cat.id){
					cat.tasks.push(res.insertId);
				}
			});
		});
		return res.insertId;
	}
	async removeTask(tid) {
		// removes task from database and respective category
		db = sqlite.openDatabase('main');
		await db.execAsync([
			{sql:'DELETE FROM task WHERE rowid=?',args:[tid]},
		],false);
		Object.values(this.categories).forEach(list=>{
			list.forEach(cat=>{
				cat.tasks = cat.tasks.filter(id=>id!==tid);
			});
		});
		db.closeAsync();
	}
}

class Category {
	// the object representing a category
	constructor(id,title,color){
		this.id = id;
		this.title = title;
		this.color = color;
		this.tasks = []; // a list of task ids of tasks belonging to this category
	}
	addTask(id){
		this.tasks.push(id);
	}
	async getTasks(){
		// populates this.tasks
		this.tasks = [];
		const db = sqlite.openDatabase('main');
		const [res] = await db.execAsync([
			{sql:'SELECT rowid FROM task WHERE catid=? ORDER BY done,rank',args:[this.id]}
		],true);
		if(res.rows){
			res.rows.forEach(row => {
				this.tasks.push(row.rowid);
			});
		}
	}
	async moveUp(catid,id,rank){
		const db = sqlite.openDatabase('main');
		await db.execAsync([
			{sql:'UPDATE task SET rank=? WHERE catid=? AND rank=?',args:[rank,catid,rank-1]},
			{sql:'UPDATE task SET rank=? WHERE rowid=?',args:[rank-1,id]},
		],false);
		db.closeAsync();
	}
	async moveDown(catid,id,rank){
		const db = sqlite.openDatabase('main');
		await db.execAsync([
			{sql:'UPDATE task SET rank=? WHERE catid=? AND rank=?',args:[rank,catid,rank+1]},
			{sql:'UPDATE task SET rank=? WHERE rowid=?',args:[rank+1,id]},
		],false);
		db.closeAsync();
	}
}

class Task {
	//the object representing a task
	constructor(id,title,note,done,rank,catid){
		this.id = id;
		this.title = title;
		this.note = note;
		this.done = Boolean(done);
		this.rank = rank;
		this.catid = catid;
	}
	async flipDone(){
		// flips done properties
		this.done = !this.done;
		const db = sqlite.openDatabase('main');
		await db.execAsync([
			{sql:'UPDATE task SET done=? WHERE rowid=?',args:[Number(this.done),this.id]},
		],false);
		db.closeAsync();
	}
	async updateTask(title,note,catid=0){
		// updates the task
		const db = sqlite.openDatabase('main');
		if(catid===0){
			await db.execAsync([
				{sql: 'UPDATE task SET title=?,note=? WHERE rowid=?',args: [title,note,this.id]},
			],false);
		} else {
			let [rank,count] = await db.execAsync([
				{sql:'SELECT max(rank) FROM task WHERE catid=?',args:[catid]},
				{sql:'SELECT count(rank) FROM task WHERE catid=?',args:[this.catid]}
			],true);
			if(rank.rows[0]){
				rank = rank.rows[0]['max(rank)']+1;
			} else {
				rank = 1;
			}
			if(count.rows[0]){
				count = count.rows[0]['count(rank)']-this.rank;
			} else {
				count = 0;
			}
			await db.execAsync([
				{sql: 'UPDATE task SET title=?,note=?,catid=?,rank=? WHERE rowid=?',args: [title,note,catid,rank,this.id]},
				...[...Array(count).keys()].map(i=>{
					return {
						sql: 'UPDATE task SET rank=? WHERE catid=? and rank=?',
						args: [i+this.rank,this.catid,i+this.rank+1],
					};
				})
			],false);
			this.catid = catid;
			this.rank = rank;
		}
		db.closeAsync();
		this.title=title;
		this.note=note;
	}
}

export class Date {
	// object representing a date
	constructor(day='',month='',year='',weekday=-1){
		this.day = day;
		this.month = month;
		this.year = year;
		this.weekday = weekday;
	}
	stringify(){
		return JSON.stringify({
			day: this.day,
			month: this.month,
			year: this.year,
			weekday: this.weekday,
		});
	}
	display(ds,weekdays,ifEmpty=''){
		// mode=1 for dmy - mode=2 for mdy
		if(!this.day && !this.month && !this.year){
			if(this.weekday===-1){
				return ifEmpty;
			} else {
				return weekdays[this.weekday];
			}
		}
		if(ds==='intl'){
			return `${this.day} ${this.month} ${this.year} ${this.weekday===-1?'':'- '+weekdays[this.weekday]}`;
		} else {
			return `${this.month} ${this.day} ${this.year} ${this.weekday===-1?'':'- '+weekdays[this.weekday]}`;
		}
	}
}
export class  Current {
	// object representing the current plan
	constructor(){
		let cur = SecureStore.getItem('current');
		if(cur){
			cur = JSON.parse(cur);
			this.date = new Date(...Object.values(JSON.parse(cur.date)));
			this.gratitude = JSON.parse(cur.gratitude);
			this.tasks = JSON.parse(cur.tasks);
		} else {
			this.date = new Date();
			this.gratitude = ['','',''];
			this.tasks = [];
			SecureStore.setItem('current',this.stringify());
		}
	}
	stringify(){
		return JSON.stringify({
			date: this.date.stringify(),
			gratitude: JSON.stringify(this.gratitude),
			tasks: JSON.stringify(this.tasks),
		});
	}
	save(){
		SecureStore.setItem('current',this.stringify());
	}
	async archive(){
		let tasks = [];
		const db = sqlite.openDatabase('main');
		const ts = await db.execAsync(this.tasks.map(tid=>{
			return {sql: 'SELECT title,done FROM task WHERE rowid=?',args: [tid]};
		}),true);
		ts.forEach(t=>{
			if(t.rows){
				tasks.push({
					title: t.rows[0].title,
					done: Boolean(t.rows[0].done),
				});
			}
		});
		const [res] = await db.execAsync([
			{
				sql:'INSERT INTO archived(date,gratitude,tasks) VALUES(?,?,?)',
				args:[
					this.date.stringify(),
					JSON.stringify(this.gratitude),
					JSON.stringify(tasks),
				]
			},
		],false);
		db.closeAsync();
		this.date = new Date();
		this.gratitude = ['','',''];
		this.tasks = [];
		SecureStore.setItem('current',this.stringify());
		return res.insertId;
	}
}

class Archived {
	constructor(id,date,gratitude,tasks){
		this.id = id;
		this.date = new Date(...Object.values(JSON.parse(date)));
		this.gratitude = JSON.parse(gratitude);
		this.tasks = JSON.parse(tasks);
	}
}

export async function initDB(){
	// initializes database tables
	const db = sqlite.openDatabase('main');
	await db.execAsync([
		{sql:'CREATE TABLE IF NOT EXISTS category(title TEXT NOT NULL, color TEXT NOT NULL)',args:[]},
		{sql:'CREATE TABLE IF NOT EXISTS task(title TEXT NOT NULL, note TEXT, done INTEGER DEFAULT 0, rank INTEGER NOT NULL, catid INTEGER NOT NULL, FOREIGN KEY(catid) REFERENCES category(rowid))',args:[]},
		{sql:'CREATE TABLE IF NOT EXISTS archived(date TEXT, gratitude TEXT, tasks TEXT)',args:[]},
	],false);
	db.closeAsync();
}

export async function getTask(id){
	// get the task object with the given id from database
	const db = sqlite.openDatabase('main');
	const [res] = await db.execAsync([
		{sql:'SELECT * FROM task WHERE rowid=?',args:[id]},
	],true);
	db.closeAsync();
	if(res.rows){
		return new Task(id,...Object.values(res.rows[0]));
	} else {
		return null;
	}
}

export async function getCat(id){
	// get the category object with the given id from database
	const db = sqlite.openDatabase('main');
	const [res] = await db.execAsync([
		{sql:'SELECT * FROM category WHERE rowid=?',args:[id]}
	],true);
	db.closeAsync();
	if(res.rows){
		return new Category(id,res.rows[0].title,res.rows[0].color);
	} else {
		return null;
	}
}

export async function getArchived(){
	const db = sqlite.openDatabase('main');
	const [res] = await db.execAsync([
		{sql:'SELECT rowid,date,gratitude,tasks FROM archived ORDER BY rowid DESC',args:[]},
	],true);
	db.closeAsync();
	return res.rows.map(row=>new Archived(...Object.values(row)));
}
export async function deleteArchived(id){
	const db = sqlite.openDatabase('main');
	await db.execAsync([
		{sql:'DELETE FROM archived WHERE rowid=?',args:[id]}
	],false);
	db.closeAsync();
}