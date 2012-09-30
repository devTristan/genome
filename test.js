var genome = require('./genome');

var human = new genome();
human.add('skinColor', new genome.color({
	hue: [0, 100],
	saturation: [50, 100],
	lightness: [40, 100]
}));
human.add('hasHair', new genome.punnett());
human.add('hairColor', new genome.color({
	hue: [0, 100],
	saturation: [50, 100],
	lightness: [40, 100]
}));

var joe = human.create();
var jane = human.create();
console.log('joe', joe);
console.log('jane', jane);

for (var i = 0; i < 2; i++) {
	var child = human.breed(joe, jane, 0.05);
	console.log('child', child);
}
