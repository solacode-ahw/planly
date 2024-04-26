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

export const vision = {
	goalPlaceHolder: {
		en: 'Write down your goal...',
		fa: 'هدف خود را یادداشت کن...',
	},
	whyPlaceHolder: {
		en: 'Write down your reason...',
		fa: 'انگیزه‌ی خود را یادداشت کن...',
	},
	modalButton: {
		en: 'Save',
		fa: 'ذخیره',
	},
};

export const dateView = {
	day: {
		en: 'day',
		fa: 'روز',
	},
	month: {
		en: 'month',
		fa: 'ماه',
	},
	year: {
		en: 'year',
		fa: 'سال',
	},
	weekDay: {
		en: 'week day',
		fa: 'روز هفته',
	},
};
export const weekDays = {
	en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
	fa: ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'],
};

export const archiveWarning = {
	msg: {
		en: 'You are about to archive the current day, after which you will not be able to make any edits. Do you want to continue?',
		fa: 'شما در حال آرشیو روز کنونی هستید. پس از این اقدام قادر به ویرایش این روز نخواهید بود. آیا می‌خواهید ادامه دهید؟',
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

export const gratsLabel = {
	en: 'Today, I am grateful for:',
	fa: 'امروز، شکرگزار هستم برای:',
};
export const tasksLabel = {
	en: 'Today, I want to do:',
	fa: 'امروز، می‌خواهم انجام دهم:',
};
export const noTasks = {
	en: 'Nothing Planned Yet...',
	fa: 'هنوز کاری برنامه‌ریزی نشده است...',
};
export const addTaskButton = {
	en: 'Plan More Tasks',
	fa: 'برنامه‌ریزی کارهای بیشتر',
};

export const archiveRemoveWarning = {
	message: {
		en: 'You are about to remove this archived plan. This action is not reversible. Are you sure?',
		fa: 'شما در حال حذف این آرشیو هستید. این عمل غیرقابل بازگشت است. آیا می‌خواهید ادامه بدهید؟',
	},
	labels: {
		en: ['Go Back','Continue'],
		fa: ['برگرد','ادامه'],
	},
};
export const archiveDate = {
	en: 'No Date',
	fa: 'بدون تاریخ',
};
export const noArchive = {
	en: 'No Plan Has Been Archived Yet...',
	fa: 'هیچ آرشیوی وجود ندارد...',
};
export const archiveViewLabels = {
	grats: {
		en: 'I was grateful for:',
		fa: 'شکرگزار بودم برای:',
	},
	tasks: {
		en: 'I wanted to do:',
		fa: 'می‌خواستم انجام دهم',
	},
};

export const settingsLabels = {
	thm: {
		en: {
			title: 'Theme',
			options: ['Auto','Dark','Light'],
		},
		fa: {
			title: 'تم',
			options: ['خودکار','تیره','روشن'],
		},
	},
	lang: {
		en: {
			title: 'Language',
			options: ['English','فارسی'],
		},
		fa: {
			title: 'زبان',
			options: ['English','فارسی'],
		},
	},
	ds: {
		en: {
			title: 'Date Style',
			options: ['International','American'],
		},
		fa: {
			title: 'نحوه نمایش تاریخ',
			options: ['بین‌المللی','آمریکایی'],
		},
	},
	ws: {
		en: {
			title: 'Start of the Week',
			options: ['Saturday','Sunday','Monday'],
		},
		fa: {
			title: 'شروع هفته',
			options: ['شنبه','یکشنبه','دوشنبه'],
		},
	},
};