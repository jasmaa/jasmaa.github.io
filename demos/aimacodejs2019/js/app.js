
var selectedRow;
var selectedCol;

function init(){
	
	selectedRow = 0;
	selectedCol = 0
	
	// init tables
	var randTable = [];
	for(let i=0; i < 5; i++){
		var currRow = [];
		for(let j=0; j < 5; j++){
			currRow.push(Math.floor(Math.random() * 10));
		}
		randTable.push(currRow);
	}
	
	var gaussian = [
		[1, 2, 1],
		[2, 4, 2],
		[1, 2, 1],
	];
	
	writeTable("conv-input", randTable);
	writeTable("conv-filter", gaussian);
	updateTable();
}

// Moves selected area
function moveSelection(deltaRow, deltaCol){
	selectedRow += deltaRow;
	selectedCol += deltaCol;
	
	updateTable();
}

// Updates table
function updateTable(){
	var original = readTable("conv-input");
	var filter = readTable("conv-filter");
	
	var output = applyFilter(original, filter, selectedRow, selectedCol);
	
	writeTable("conv-output", output);
	paintBox("conv-output", output, filter, selectedRow, selectedCol);
}

// Reads table into 2d array
function readTable(id){
	var myTableArray = [];

	$(`table#${id} tr`).each(function() {
		var arrayOfThisRow = [];
		var tableData = $(this).find('td');
		if (tableData.length > 0) {
			tableData.each(function() {
				arrayOfThisRow.push(+$(this).children().first().val());
			});
			myTableArray.push(arrayOfThisRow);
		}
	});
	
	return myTableArray;
}

// Writes 2d array to table by id
function writeTable(id, arr){
	
	var rowCount = 0;
	var colCount = 0;
	
	$(`table#${id} tr`).each(function() {
		var tableData = $(this).find('td');
		if (tableData.length > 0) {
			tableData.each(function() {
				$(this).children().first().val(arr[rowCount][colCount]);
				colCount++;
			});
			colCount = 0;
			rowCount++;
		}
	});
}

// paints box around table
function paintBox(id, arr, filter, iStart, jStart){
	var rowCount = 0;
	var colCount = 0;
	
	var filterWidth = filter.length;
	var filterHeight = filter[0].length;
	
	$(`table#${id} tr`).each(function() {
		var tableData = $(this).find('td');
		if (tableData.length > 0) {
			tableData.each(function() {
				if(rowCount - iStart >= 0 && rowCount - iStart < filterHeight &&
				   colCount - jStart >= 0 && colCount - jStart < filterWidth){
					$(this).attr("bgColor", "#FF0000");
				}
				else{
					$(this).attr("bgColor", "#FFFFFF");
				}
				colCount++;
			});
			colCount = 0;
			rowCount++;
		}
	});
}

// Does filter math
function applyFilter(src, filter, iStart, jStart){
	var outputArr = [];
	
	var filterWidth = filter.length;
	var filterHeight = filter[0].length;
	var width = src.length;
	var height = src[0].length;
	
	for(let i = 0; i < width; i++){
		var currRow = [];
		for(let j = 0; j < height; j++){
			let val = src[i][j];
			if(i - iStart >= 0 && i - iStart < filterHeight &&
			   j - jStart >= 0 && j - jStart < filterWidth){
				
				val *= filter[i-iStart][j-jStart]
			}
			currRow.push(val);
		}
		outputArr.push(currRow);
	}
	
	return outputArr;
}

init();