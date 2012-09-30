genome
======

Some basic pseudo-genetics for a new project of mine

Hello, Genome
=============

Note that george will only say hello 66% of the time, depending on whether or not he likes you. Fortunately, liking you enough to say hello happens to be a dominant trait.

	var genome = require('./genome');
	var human = new genome();
	
	human.add('likesYou', genome.punnett());
	
	var george = human.create();
	if (george.likesYou) {
		console.log('Hello, World!');
	}

Punnett Genes
=============

Punnett genes work with simple punnett square logic. genome.punnett() accepts no parameters.
A brand new punnett gene will have a random value of 0, 1, or 2.
0: gg
1: Gg
2: GG

Range Genes
===========

Range genes, created with genome.range(min, max), make numbers.
You provide a minimum and a maximum, and it'll do the rest.

	human.add('favoriteNumber', new genome.range(0, 10));
	console.log( human.create().favoriteNumber ); //random number between 0 and 10 (inclusive)

Range genes have rather interesting breeding mechanics. 0 + 100 != 50, for example.
A child will tend to be closer to one parent than another, and if the parents are at opposite ends of the range this effect will be more noticable.

Circular Range Genes
====================

Some genes are linear, like height. Some are circular, like hue. If a range of 0-10 is circular, then 10+1 could make 0.

	new genome.range(0, 10, true); //the third parameter indicates that it is circular

Color Genes
===========

Color genes are comprised of three sub-genes: hue, saturation, and lightness.
The HSL color model was chosen because it makes more sense.

	human.add('skinColor', new genome.color({
		hue: [0, 100], //these are ranges
		saturation: [50, 100],
		lightness: [50, 70]
	}));
	
	human.add('favoriteColor', new genome.color({
		hue: [0, 360, true], //by adding true, I made this circular
		saturation: [0, 100],
		lightness: [0, 100]
	}));

Creation
========

Creation of a random gene set is done with the create method.

	human.create() == {
		likesYou: 1,
		skinColor: [53, 93, 65],
		favoriteColor: [12, 76, 43]
	}

Breeding
========

Breeding is the combination of two gene sets into another. It is done with the breed method.

	human.breed(firstParent, secondParent, radiation)

The firstParent and secondParent parameters should be the in the same format as the output of create()
For details on that see above.

The radiation parameter should be between 0 and 1. It gives all ranges an extra bit of randomness.
0.05 is 5%, and I'd recommend using that.

Example
=======

	var human = new genome();
	
	human.add('eyeColor', new genome.color({
		hue: [0, 360, true],
		saturation: [50, 70],
		lightness: [40, 60]
	}));
	human.add('arms', new genome.range(1, 5));
	human.add('likesKale', new genome.punnett());
	
	var joe = human.create();
	var jane = human.create();
	
	console.log('joe', joe);
	console.log('jane', jane);
	
	var billybob = human.breed(joe, jane, 0.05);
	console.log('billybob', billybob);

Output:

	joe { eyeColor: [ 319, 58, 43 ], arms: 1, likesKale: 1 }
	jane { eyeColor: [ 51, 66, 48 ], arms: 4, likesKale: 0 }
	billybob { eyeColor: [ 300.5, 60.68, 44.53 ], arms: 1.41, likesKale: 1 }
