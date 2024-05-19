const dropBox = $$("#fileArea");
dropBox.addEventListener("dragenter", dragEnter, false);
dropBox.addEventListener("dragover", dragOver, false);
dropBox.addEventListener("drop", drop, false);
dropBox.addEventListener("click", disableClick, false);

function dragEnter(e) {
	e.stopPropagation();
	e.preventDefault();
}

function dragOver(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = "copy";
}

let fileQueue = new Map();

function disableClick(e) {
	e.stopPropagation();
	e.preventDefault();
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();

	let itms = e.dataTransfer.items;
	let promises = [];
	for (let i = 0; i < itms.length; i++) {
		let item = itms[i].webkitGetAsEntry();
		if (item) {
			promises.push(traverseFileTree(item, fileQueue));
		}
	}

	Promise.all(promises)
		.then(async () => {
			console.log("files loaded");
			for (let [k, v] of fileQueue) {
				let kvus = document.createElement("canvas");
				let ctx = kvus.getContext("2d");
				kvusHeight = await calculateTotalHeight(v);
				kvus.height = kvusHeight;
				kvus.width = 800;
				await drawImagesAsync(v, ctx);
				let link = document.createElement("a");
				link.download = k + ".png";
				link.href = kvus.toDataURL();
				link.click();
				link.remove();
				v.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
				ctx.clearRect(0, 0, kvus.width, kvus.height);
			}
		})
		.catch((error) => {
			console.error("Error happpened:", error);
		});
}

function traverseFileTree(item, fileQueue, path = "") {
	return new Promise((resolve, reject) => {
		if (item.isFile) {
			item.file(function (file) {
				if (file.type.startsWith("image/")) {
					if (!fileQueue.has(path)) {
						fileQueue.set(path, [URL.createObjectURL(file)]);
					} else if (fileQueue.has(path)) {
						fileQueue.get(path).push(URL.createObjectURL(file));
					}
				}
				resolve();
			});
		} else if (item.isDirectory) {
			let dirReader = item.createReader();
			dirReader.readEntries(function (entries) {
				let subPromiss = [];
				for (let x = 0; x < entries.length; x++) {
					subPromiss.push(traverseFileTree(entries[x], fileQueue, path + item.name));
				}
				Promise.all(subPromiss)
					.then(() => {
						resolve();
					})
					.catch((err) => {
						reject(err);
					});
			});
		} else {
			reject("whathell?");
		}
	});
}

async function calculateTotalHeight(imageSources) {
	try {
		const heights = await Promise.all(imageSources.map((src) => loadImage(src)));
		const totalHeight = heights.reduce((sum, height) => sum + height, 0);
		return totalHeight;
	} catch (error) {
		console.error("Error loading images", error);
	}
}

async function drawImagesAsync(images, ctx) {
	let currentY = 0;
	for (let src of images) {
		const img = new Image();
		img.src = src;
		await new Promise((resolve, reject) => {
			img.onload = () => {
				ctx.drawImage(img, 0, currentY, img.width, img.height);
				// console.log(img.width, "+", img.height);
				currentY += img.height;
				resolve();
			};
			img.onerror = reject;
		});
	}
}

function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img.height);
		img.onerror = reject;
		img.src = src;
	});
}
