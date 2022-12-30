//for swipable tabs

Array.prototype.tabIndex = 0;

Array.prototype.nextTab = function() { 
    return this.tabIndex<this.length-1? this[++this.tabIndex] : this[this.length-1]; 
}; 

Array.prototype.previousTab = function() { 
    return this.tabIndex>0? this[--this.tabIndex] : this[0];
}; 

Array.prototype.currentTab = function () {
    return this[this.tabIndex];
} 

Array.prototype.jumpTab = function (key) {
    this.tabIndex = this.indexOf(key);
    return this[this.tabIndex];
}