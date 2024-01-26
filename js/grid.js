function resizeGridItem(item){
    grid = document.getElementsByClassName("grid-container")[0];
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    rowSpan = Math.ceil((item.querySelector('.notas').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
    item.style.gridRowEnd = "span "+rowSpan;
}
  
function resizeAllGridItems(){
    allItems = document.getElementsByClassName("grid-item");
    for(x=0;x<allItems.length;x++){
        resizeGridItem(allItems[x]);
    }
}