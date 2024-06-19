import * as sqlite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';


// datatypes used throughout the app
export class Categories {
	constructor(){
		// categories devided into lists based on their color
		this.categories = [];
	}
	items(){
		// returns an object of all categories id: 'category title'
		let itms = {};
		this.categories.forEach(cat=>{
			itms[cat.id] = cat.title;
		});
		return itms;
	}
	async getCats(){
		// reads categories from database and saves the category object for them in categories list
		this.categories = [];
		db = sqlite.openDatabaseSync('main');
		const res = db.getAllSync(
			'SELECT rowid,title,color,rank FROM category ORDER BY rank'
		);
		db.closeSync();
		if(res) {
			for(row of res){
				this.categories.push(new Category(row.rowid,row.title,row.color,row.rank));
				await this.categories.at(-1).getTasks();
			}
		}
	}
	async addCat(title,color){
		// adds a category to the database and to the categories list of this object
		const db = sqlite.openDatabaseSync('main');
		const rank = await getCatRank(db);
		const res = await db.runAsync(
			'INSERT INTO category(title,color,rank) VALUES(?,?,?)',
			[title,color,rank]
		);
		db.closeSync();
		this.categories.push(new Category(res.lastInsertRowId,title,color,rank));
	}
	async moveCat(to){
		const db = sqlite.openDatabaseSync('main');
		let rank;
		if(to===0){
			// if cat is moved to begining of list
			rank = this.categories[1].rank/2;
		} else if(to===this.categories.length-1){
			// if cat is moved to end of list
			rank = this.categories[to-1].rank+4;
		} else {
			// if cat is moved somewhere in between
			rank = (this.categories[to-1].rank + this.categories[to+1].rank)/2;
		}
		this.categories[to].rank = rank;
		db.runSync(
			'UPDATE category SET rank=? WHERE rowid=?',
			[
				rank,
				this.categories[to].id
			]
		);
		db.closeSync();
	}
	async editCat(id,title,color){
		// edits a category
		const db = sqlite.openDatabaseSync('main');
		await db.runAsync(
			'UPDATE category SET title=?,color=? WHERE rowid=?',
			[title,color,id]
		);
		await this.getCats();
		db.closeSync();
	}
	async removeCat(id){
		// deletes a category from database and the categories list
		db = sqlite.openDatabaseSync('main');
		const res = db.getAllSync(
			'SELECT rowid FROM task WHERE catid=?',
			[id],
		);
		await db.runAsync(
			'DELETE FROM task WHERE catid=?',
			id
		);
		await db.runAsync(
			'DELETE FROM category WHERE rowid=?',
			id
		);
		// hi
		db.closeSync();
		this.categories = this.categories.filter(cat=>cat.id!=id);
		if(res){
			return res.map(row=>row.rowid);
		} else {
			return [];
		}
	}
	async addTask(title,note,catid) {
		// adds a new task to the database and the respective category
		db = sqlite.openDatabaseSync('main');
		const rank = await getTaskRank(db,catid);
		const res = await db.runAsync(
			'INSERT INTO task(title,note,rank,catid) VALUES (?,?,?,?)',
			[title,note,rank,catid]
		);
		db.closeSync();
		for(cat of this.categories){
			if(cat.id==catid){
				await cat.getTasks();
			}
		}
		return res.lastInsertRowId;
	}
	async removeTask(tid) {
		// removes task from database and respective category
		db = sqlite.openDatabaseSync('main');
		await db.runAsync(
			'DELETE FROM task WHERE rowid=?',
			[tid]
		);
		this.categories.forEach(cat=>{
			cat.tasks = cat.tasks.filter(id=>id!==tid);
		});
		db.closeSync();
	}
}

class Category {
	// the object representing a category
	constructor(id,title,color,rank){
		this.id = id;
		this.title = title;
		this.color = color;
		this.rank = rank;
		this.tasks = []; // a list of task ids of tasks belonging to this category
	}
	addTask(id){
		this.tasks.push(id);
	}
	async getTasks(){
		// populates this.tasks
		this.tasks = [];
		const db = sqlite.openDatabaseSync('main');
		const res = db.getAllSync(
			'SELECT rowid FROM task WHERE catid=? ORDER BY done,rank',
			[this.id]
		);
		db.closeSync();
		if(res){
			res.forEach(row => {
				this.tasks.push(row.rowid);
			});
		}
	}
	async moveTask(to){
		// write this
		const db = sqlite.openDatabaseSync('main');
		let rank;
		if(to===0){
			// if cat is moved to begining of list
			rank = db.getFirstSync('SELECT rank FROM task WHERE rowid=?',this.tasks[1]).rank/2;
		} else if(to===this.tasks.length-1){
			// if cat is moved to end of list
			rank = db.getFirstSync('SELECT rank FROM task WHERE rowid=?',this.tasks[to-1]).rank+4;
		} else {
			// if cat is moved somewhere in between
			rank = ( db.getFirstSync('SELECT rank FROM task WHERE rowid=?',this.tasks[to-1]).rank + db.getFirstSync('SELECT rank FROM task WHERE rowid=?',this.tasks[to+1]).rank ) / 2;
		}
		db.runSync(
			'UPDATE task SET rank=? WHERE rowid=?',
			[
				rank,
				this.tasks[to]
			]
		);
		db.closeSync();
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
		const db = sqlite.openDatabaseSync('main');
		await db.runAsync(
			'UPDATE task SET done=? WHERE rowid=?',
			[Number(this.done),this.id]
		);
		db.closeSync();
	}
	async updateTask(title,note,catid=0){
		// updates the task
		const db = sqlite.openDatabaseSync('main');
		if(catid===0){
			await db.runAsync(
				'UPDATE task SET title=?,note=? WHERE rowid=?',
				[title,note,this.id]
			);
		} else {
			const rank = await getTaskRank(db,catid);
			await db.runAsync(
				'UPDATE task SET title=?,note=?,catid=?,rank=? WHERE rowid=?',
				[title,note,catid,rank,this.id]
			);
			this.catid = catid;
			this.rank = rank;
		}
		db.closeSync();
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
		const db = sqlite.openDatabaseSync('main');
		const ts = this.tasks.map(tid=>
			db.getFirstSync('SELECT title,done FROM task WHERE rowid=?',tid)
		);
		ts.forEach(t=>{
			if(t){
				tasks.push({
					title: t.title,
					done: Boolean(t.done),
				});
			}
		});
		const res = await db.runAsync(
			'INSERT INTO archived(date,gratitude,tasks) VALUES(?,?,?)',
			this.date.stringify(),
			JSON.stringify(this.gratitude),
			JSON.stringify(tasks),
		);
		db.closeSync();
		this.date = new Date();
		this.gratitude = ['','',''];
		this.tasks = [];
		SecureStore.setItem('current',this.stringify());
		return res.lastInsertRowId;
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
	const db = sqlite.openDatabaseSync('main');
	await db.execAsync(
		`
			CREATE TABLE IF NOT EXISTS category(title TEXT NOT NULL, color TEXT NOT NULL, rank REAL NOT NULL);
			CREATE TABLE IF NOT EXISTS task(title TEXT NOT NULL, note TEXT, done INTEGER DEFAULT 0, rank REAL NOT NULL, catid INTEGER NOT NULL, FOREIGN KEY(catid) REFERENCES category(rowid));
			CREATE TABLE IF NOT EXISTS archived(date TEXT, gratitude TEXT, tasks TEXT);
		`
	);
	checkNormalize(db);
	db.closeSync();
}

async function getTaskRank(db,catid){
	let rank = db.getFirstSync(
		'SELECT max(rank) FROM task WHERE catid=?',
		[catid]
	);
	if(rank){
		rank = rank['max(rank)']+4;
	} else {
		rank = 1;
	}
	return rank;
}
async function getCatRank(db){
	const rank = db.getFirstSync(
		'SELECT max(rank) FROM category',
	);
	if(rank){
		return rank['max(rank)']+4;
	} else {
		return 1;
	}
}

export async function getTask(id){
	// get the task object with the given id from database
	const db = sqlite.openDatabaseSync('main');
	const res = db.getFirstSync(
		'SELECT * FROM task WHERE rowid=?',
		id
	);
	db.closeSync();
	if(res){
		return new Task(id,...Object.values(res));
	} else {
		return null;
	}
}

export async function getCat(id){
	// get the category object with the given id from database
	const db = sqlite.openDatabaseSync('main');
	const res = db.getFirstSync(
		'SELECT * FROM category WHERE rowid=?',
		id
	);
	db.closeSync();
	if(res){
		return new Category(id,res.title,res.color,res.rank);
	} else {
		return null;
	}
}

export async function getArchived(){
	const db = sqlite.openDatabaseSync('main');
	const res = db.getAllSync(
		'SELECT rowid,date,gratitude,tasks FROM archived ORDER BY rowid DESC',
		[]
	);
	db.closeSync();
	return res.map(row=>new Archived(...Object.values(row)));
}
export async function deleteArchived(id){
	const db = sqlite.openDatabaseSync('main');
	await db.runAsync(
		'DELETE FROM archived WHERE rowid=?',
		id
	);
	db.closeSync();
}

function checkNormalize(db){
	// check and normalize ranks if needed

	const catIds = db.getAllSync('SELECT rowid FROM category ORDER BY rank').map(item=>item.rowid);

	// category table
	const catLowest = db.getFirstSync('SELECT min(rank) FROM category')['min(rank)'];
	const catDiffs = db.getFirstSync('SELECT min(diff) AS min,max(diff) AS max FROM (SELECT rank - LAG(rank) OVER (ORDER BY rank) AS diff FROM category)');
	if(catLowest>100 || catDiffs['min']<0.1 || catDiffs['max']>100){
		[...Array(catIds.length).keys()].forEach(i=>{
			db.runSync('UPDATE category SET rank=? WHERE rowid=?',(4*i)+1,catIds[i]);
		});
	}

	// task table
	let taskLowest,taskDiffs,taskIds;
	catIds.forEach(id=>{
		taskLowest = db.getFirstSync('SELECT min(rank) FROM task WHERE catid=?',id)['min(rank)'];
		taskDiffs = db.getFirstSync('SELECT min(diff) AS min,max(diff) AS max FROM (SELECT rank - LAG(rank) OVER (ORDER BY rank) AS diff FROM task WHERE catid=?)',id);
		if(taskLowest>100 || taskDiffs['min']<0.1 || taskDiffs['max']>100){
			taskIds = db.getAllSync('SELECT rowid FROM task WHERE catid=? ORDER BY rank',id).map(item=>item.rowid);
			[...Array(taskIds.length).keys()].forEach(i=>{
				db.runSync('UPDATE task SET rank=? WHERE rowid=?',(4*i)+1,taskIds[i]);
			});
		}
	});
}