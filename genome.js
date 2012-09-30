var util = require('util');

var genome = function(){
	this.genes = {};
};
genome.prototype.add = function(name, newGene){
	this.genes[name] = newGene;
};
genome.prototype.create = function(){
	var newGenome = {};
	for (var i in this.genes) {
		newGenome[i] = this.genes[i].create();
	}
	return newGenome;
};
genome.prototype.breed = function(mommy, daddy, radiation){
	var newGenome = {};
	for (var i in this.genes) {
		newGenome[i] = this.genes[i].breed(mommy[i], daddy[i], radiation);
	}
	return newGenome;
};

genome.gene = function(){
	throw new Error('Hey man, don\'t run me! Inherit from me instead.');
};
genome.range = function(min, max, circular){
	this.min = min;
	this.max = max;
	this.circular = circular ? true : false;
};
util.inherits(genome.range, genome.gene);
genome.range.prototype.create = function(){
	return Math.floor(Math.random()*(this.max-this.min+1)) + this.min;
};
genome.range.prototype.breed = function(mommy, daddy, radiation){
	//FYI, they can both be daddies for all I care, I only name the variables
	//as such for clarity.
	
	var diff = Math.min( Math.abs(mommy - daddy), (this.max-this.min)/3 );
	//diff is the difference between both genes or 33.33% of the gene range,
	//which ever one is smaller. Therefore, if opposites breed they won't
	//have a baby half way in between their genes, it'll be closer to one of them.
	
	//The child gene will be closer to one parent than the other, chosen randomly
	var baseParent, otherParent;
	if (Math.round(Math.random()) == 0) {
		baseParent = mommy;
		otherParent = daddy;
	} else {
		baseParent = daddy;
		otherParent = mommy;
	}
	var mutationDirection;
	if (baseParent < otherParent) {
		mutationDirection = 1;
	} else if (baseParent > otherParent) {
		mutationDirection = -1;
	} else {mutationDirection = 0;}
	
	var gaussianRandom = (Math.random()+Math.random()+Math.random())/3;
	//gaussian random number between 0 and 1, likely to be near 0.5
	//not using a perfect algorithm by any means, but it should work fine.
	
	//the child gene is 2/3-ish of the difference between mommy and daddy away
	//from a random parent called
	var newGene = baseParent + (gaussianRandom * diff * (2/3) * mutationDirection);
	
	var radiationGaussian = (Math.random()+Math.random())/2 - 0.5;
	newGene += radiationGaussian * (this.max - this.min) * radiation;
	
	//round newGene to the nearest hundreth
	newGene = Math.round(newGene * 100) / 100;
	
	if (this.circular) {
		if (newGene < this.min) {newGene = this.max - (this.min - newGene);}
		else if (newGene > this.max) {newGene = this.min + (newGene - this.max);}
	} else {
		if (newGene < this.min) {newGene = this.min;}
		else if (newGene > this.max) {newGene = this.max;}
	}
	
	return newGene;
};

genome.color = function(args){
	var options = {
		hue: [0, 0],
		saturation: [0, 0],
		lightness: [0, 0]
	};
	for (var i in args) { options[i] = args[i]; }
	
	this.hue = new genome.range(options.hue[0], options.hue[1], options.hue[2]);
	this.saturation = new genome.range(options.saturation[0], options.saturation[1], options.saturation[2]);
	this.lightness = new genome.range(options.lightness[0], options.lightness[1], options.lightness[2]);
};
util.inherits(genome.color, genome.gene);
genome.color.prototype.create = function(){
	return [ this.hue.create(), this.saturation.create(), this.lightness.create() ];
};
genome.color.prototype.breed = function(mommy, daddy, radiation) {
	return [
		this.hue.breed(mommy[0], daddy[0], radiation),
		this.saturation.breed(mommy[1], daddy[1], radiation),
		this.lightness.breed(mommy[2], daddy[2], radiation)
	];
};

genome.punnett = function(){};
util.inherits(genome.punnett, genome.gene);
genome.punnett.prototype.create = function(){
	return Math.floor(Math.random()*3);
};
genome.punnett.prototype.breed = function(firstParent, secondParent){
	if (firstParent > secondParent) {
		var tmp = secondParent;
		secondParent = firstParent;
		firstParent = tmp;
	}
	
	var child;
	if (firstParent == 0 && secondParent == 0) {
		//yy + yy
		child = 0;
	} else if (firstParent == 0 && secondParent == 1) {
		//yy + Yy
		child = Math.round(Math.random()); //half Yy half yy
	} else if (firstParent == 0 && secondParent == 2) {
		//YY + yy
		child = 1; //Yy
	} else if (firstParent == 1 && secondParent == 1) {
		//Yy + Yy
		var square = Math.floor(Math.random()*4);
		if (square == 0) {child = 0}
		else if (square == 1 || square == 2) {child = 1;}
		else {child = 2;}
	} else if (firstParent == 1 && secondParent == 2) {
		if (Math.floor(Math.random()*2)) {
			child = 1;
		} else {
			child = 2;
		}
	} else if (firstParent == 2 && secondParent == 2) {
		child = 2;
	}
	
	return child;
};

module.exports = genome;
