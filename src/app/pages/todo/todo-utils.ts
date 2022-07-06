
export const applyDrag = (columnid, arr, dragResult) => {
	const { removedIndex, addedIndex, payload } = dragResult;
	if (removedIndex === null && addedIndex === null) return arr;

	const result = [...arr];
	let itemToAdd = payload;

	if (removedIndex !== null) {
		itemToAdd = result.splice(removedIndex, 1)[0];
	}

	if (addedIndex !== null) {
		result.splice(addedIndex, 0, itemToAdd);
	}
	for (let i = 0; i < result.length; i++) {
		if (itemToAdd.id === result[i].id) {
			result[i].position = addedIndex;
			result[i].column = columnid;
			break;
		}
	}
	return result;
};

export const generateItems = (count, creator) => {
	const result = [];
	for (let i = 0; i < count; i++) {
		result.push(creator(i));
	}
	return result;
};