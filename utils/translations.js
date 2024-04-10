/*
	messages used in the app in different languages
	var: {
		lang_code: 'message'
	}
	currently only available in English and Farsi
*/

export const newCatModal = {
	title: {
		en: 'Create New Category',
		fa: 'ساخت دسته‌ی جدید',
	},
	placeholder: {
		en: 'Category Title',
		fa: 'عنوان دسته',
	},
	color: {
		en: 'Color',
		fa: 'رنگ',
	},
	button: {
		en: 'Add',
		fa: 'اضافه کن',
	},
};
export const editCatModal = {
	title: {
		en: 'Edit Category',
		fa: 'ویرایش دسته',
	},
	placeholder: {
		en: 'Category Title',
		fa: 'عنوان دسته',
	},
	color: {
		en: 'Color',
		fa: 'رنگ',
	},
	button: {
		en: 'Save',
		fa: 'ذخیره',
	},
};

export const delCatWarning = {
	message: {
		en: (name)=>`You are about to remove ${name} category and all the tasks within it. This action is not reversible!`,
		fa: (name)=>`شما در حال حذف دسته‌ی ${name} و تمام کارهای موجود در آن هستید. این عمل برگشت‌پذیر نخواهد بود!`,
	},
	labels: {
		en: [
			'Go Back',
			'Continue'
		],
		fa: [
			'برگرد',
			'ادامه'
		],
	}
};

export const newTaskModal = {
	title: {
		en: 'Create New Task',
		fa: 'ساخت کار جدید',
	},
	task: {
		en: 'Task',
		fa: 'عنوان کار',
	},
	note: {
		en: 'Notes',
		fa: 'یادداشت‌ها',
	},
	category: {
		en: 'Category',
		fa: 'دسته',
	},
	button: {
		en: 'Add',
		fa: 'اضافه کن',
	},
};
export const editTaskModal = {
	title: {
		en: 'Edit Task',
		fa: 'ویرایش کار',
	},
	task: {
		en: 'Task',
		fa: 'عنوان کار',
	},
	note: {
		en: 'Notes',
		fa: 'یادداشت‌ها',
	},
	category: {
		en: 'Category',
		fa: 'دسته',
	},
	button: {
		en: 'Save',
		fa: 'ذخیره',
	},
};
export const viewTaskModal = {
	title: {
		en: 'Task',
		fa: 'کار',
	},
	note: {
		en: 'No Note',
		fa: 'بدون یادداشت',
	},
};

export const delTaskWarning = {
	message: {
		en: (name)=>`You are about to remove ${name} task. This action is not reversible!`,
		fa: (name)=>`شما در حال حذف کار ${name} هستید. این عمل برگشت‌پذیر نخواهد بود!`,
	},
	labels: {
		en: [
			'Go Back',
			'Continue'
		],
		fa: [
			'برگرد',
			'ادامه'
		],
	}
};