export interface VisualAid {
  emojis: string;
  description: string;
}

export type DifficultyKey = 'easy' | 'medium' | 'hard';

export interface WordPair {
  common: string;
  impostor: string;
  hints: string[];
  commonVisual: VisualAid;
  impostorVisual: VisualAid;
  difficulty: DifficultyKey;
}

export type CategoryKey = 
  | 'Animals' 
  | 'Food' 
  | 'Objects & Things' 
  | 'School & Learning' 
  | 'Silly & Random' 
  | 'Geography (Countries & Cities)' 
  | 'Movies & TV' 
  | 'Music & Entertainment' 
  | 'Sports & Games' 
  | 'Technology & Gadgets' 
  | 'Nature & Outdoors' 
  | 'Colors & Shapes' 
  | 'Emotions & Feelings' 
  | 'Jobs & Professions' 
  | 'Vehicles & Transportation' 
  | 'Places (Landmarks & Locations)' 
  | 'Video Games & Internet Culture' 
  | 'Fantasy & Mythical Creatures'
  | 'Mixed' 
  | 'Custom';

export const wordDatabase: Record<Exclude<CategoryKey, 'Mixed' | 'Custom'>, WordPair[]> = {
  Animals: [
    { 
      common: 'Cat', impostor: 'Dog', hints: ['Pet', 'Feline', 'Domestic'],
      commonVisual: { emojis: '🐱🐾🐈', description: 'A small furry pet with whiskers, pointed ears, retractable claws, and a long tail.' },
      impostorVisual: { emojis: '🐶🐾🐕', description: 'A friendly domestic canine with floppy or alert ears, a snout, and a wagging tail.' },
      difficulty: 'medium'
    },
    { 
      common: 'Lion', impostor: 'Tiger', hints: ['Predator', 'Big Cat', 'Safari'],
      commonVisual: { emojis: '🦁👑🐆', description: 'A large golden cat where males have a huge furry mane. Known as the king of the jungle.' },
      impostorVisual: { emojis: '🐯🐅🔥', description: 'A large wild cat with a striking orange coat covered in black vertical stripes.' },
      difficulty: 'medium'
    },
    { 
      common: 'Horse', impostor: 'Donkey', hints: ['Equine', 'Riding', 'Hooves'],
      commonVisual: { emojis: '🐴🐎🌾', description: 'A tall hooved mammal with a long flowing mane and tail, used for riding and drawing carts.' },
      impostorVisual: { emojis: '🫏🫏🪵', description: 'A smaller hooved equine with long ears, a short mane, and a loud braying call.' },
      difficulty: 'medium'
    },
    { 
      common: 'Cow', impostor: 'Buffalo', hints: ['Livestock', 'Dairy', 'Farm'],
      commonVisual: { emojis: '🐮🐄🥛', description: 'A large domestic farm mammal with patches, known for producing milk and chewing grass.' },
      impostorVisual: { emojis: '🦬🦬🌾', description: 'A massive dark brown wild mammal with a large shoulder hump, thick fur, and curved horns.' },
      difficulty: 'medium'
    },
    { 
      common: 'Sheep', impostor: 'Goat', hints: ['Wool', 'Livestock', 'Farm'],
      commonVisual: { emojis: '🐑🐑🧶', description: 'A fluffy domestic mammal covered in thick curly white wool, grazing in green fields.' },
      impostorVisual: { emojis: '🐐🐐🧗', description: 'A hooved mammal with horns, a small chin beard, and rectangular pupils, known for climbing.' },
      difficulty: 'medium'
    },
    { 
      common: 'Wolf', impostor: 'Fox', hints: ['Canine', 'Wild', 'Forest'],
      commonVisual: { emojis: '🐺🐺❄️', description: 'A large grey wild canine that runs in packs, has sharp fangs, and howls at the moon.' },
      impostorVisual: { emojis: '🦊🦊🍂', description: 'A small clever wild canine with a bright orange coat, a bushy white-tipped tail, and a pointed snout.' },
      difficulty: 'medium'
    },
    { 
      common: 'Leopard', impostor: 'Cheetah', hints: ['Wild Cat', 'Spotted', 'Predator'],
      commonVisual: { emojis: '🐆🐆🌳', description: 'A muscular big cat with black rosette-shaped spots, known for climbing trees to hide prey.' },
      impostorVisual: { emojis: '🐆⚡🏃', description: 'A slender big cat with solid round black spots and tear-like facial stripes, built for speed.' },
      difficulty: 'medium'
    },
    { 
      common: 'Crocodile', impostor: 'Alligator', hints: ['Reptile', 'Jaws', 'Swamp'],
      commonVisual: { emojis: '🐊🐊🌊', description: 'A large aquatic reptile with a long narrow V-shaped snout, and exposed teeth when its mouth is shut.' },
      impostorVisual: { emojis: '🐊🐊🪵', description: 'A heavy swamp reptile with a broad U-shaped snout, darker skin, and teeth hidden when mouth is shut.' },
      difficulty: 'hard'
    },
    { 
      common: 'Dolphin', impostor: 'Whale', hints: ['Ocean', 'Mammal', 'Blowhole'],
      commonVisual: { emojis: '🐬🐬🌊', description: 'A sleek grey aquatic mammal with a curved dorsal fin, famous for jumping out of waves.' },
      impostorVisual: { emojis: '🐋🐳💦', description: 'A colossal ocean mammal with a huge tail, blowhole spouts, and a massive rounded head.' },
      difficulty: 'easy'
    },
    { 
      common: 'Shark', impostor: 'Octopus', hints: ['Ocean', 'Aquatic', 'Predator'],
      commonVisual: { emojis: '🦈🦈🌊', description: 'A fierce predatory fish with rows of sharp triangular teeth, a tall dorsal fin, and gills.' },
      impostorVisual: { emojis: '🐙🐙🌊', description: 'A soft-bodied ocean creature with eight arms lined with suckers, a bulbous head, and ink sprays.' },
      difficulty: 'easy'
    },
    { 
      common: 'Penguin', impostor: 'Puffin', hints: ['Bird', 'Cold', 'Flightless'],
      commonVisual: { emojis: '🐧🐧❄️', description: 'A flightless seabird that walks with a waddle, wearing a tuxedo-like coat of black and white.' },
      impostorVisual: { emojis: '🪶🪶🌊', description: 'A small flying seabird with black and white feathers and a bright triangular orange beak.' },
      difficulty: 'hard'
    },
    { 
      common: 'Eagle', impostor: 'Hawk', hints: ['Bird of Prey', 'Talons', 'Flight'],
      commonVisual: { emojis: '🦅🦅🏔️', description: 'A large majestic bird of prey with a white head, curved yellow beak, and massive wingspan.' },
      impostorVisual: { emojis: '🦅🦅🌲', description: 'A medium-sized swift predatory bird with sharp eyes, broad wings, and a long striped tail.' },
      difficulty: 'medium'
    },
    { 
      common: 'Owl', impostor: 'Bat', hints: ['Nocturnal', 'Night', 'Flying'],
      commonVisual: { emojis: '🦉🦉🌙', description: 'A nocturnal bird with large round eyes, a flat face, and feathers designed for silent flight.' },
      impostorVisual: { emojis: '🦇🦇🦇', description: 'A small flying mammal with leathery wings, hanging upside down, navigating using echoes.' },
      difficulty: 'easy'
    },
    { 
      common: 'Frog', impostor: 'Toad', hints: ['Amphibian', 'Swamp', 'Jumping'],
      commonVisual: { emojis: '🐸🐸🐸', description: 'A small green amphibian with smooth wet skin, long legs for jumping, and big bulging eyes.' },
      impostorVisual: { emojis: '🐸🪨🍂', description: 'A bumpy brown amphibian with dry warty skin, shorter legs for crawling, living mostly on land.' },
      difficulty: 'medium'
    },
    { 
      common: 'Rabbit', impostor: 'Hare', hints: ['Ears', 'Herbivore', 'Fluffy'],
      commonVisual: { emojis: '🐰🐇🥕', description: 'A small fluffy mammal with long soft ears, a twitchy nose, and a short cotton-ball tail.' },
      impostorVisual: { emojis: '🐇🌾🏃', description: 'A larger wild mammal with very long ears, strong hind legs, and a lean body built for running.' },
      difficulty: 'medium'
    },
    { 
      common: 'Rat', impostor: 'Mouse', hints: ['Rodent', 'Squeak', 'Tail'],
      commonVisual: { emojis: '🐀🐀🐀', description: 'A medium-sized rodent with a long scaly tail, pointed snout, and grey or brown fur.' },
      impostorVisual: { emojis: '🐭🐁🧀', description: 'A tiny rodent with large round ears, a thin tail, and a cute twitching nose.' },
      difficulty: 'easy'
    },
    { 
      common: 'Monkey', impostor: 'Gorilla', hints: ['Primate', 'Tree', 'Banana'],
      commonVisual: { emojis: '🐒🐵🍌', description: 'A playful primate with a long tail used for swinging between tree branches.' },
      impostorVisual: { emojis: '🦍🦍🦍', description: 'A massive, chest-beating primate with thick black fur, broad shoulders, and no tail.' },
      difficulty: 'easy'
    },
    { 
      common: 'Deer', impostor: 'Antelope', hints: ['Forest', 'Herbivore', 'Hooves'],
      commonVisual: { emojis: '🦌🦌🌲', description: 'A slender forest mammal with a spotted coat when young, and large branching antlers.' },
      impostorVisual: { emojis: '🦌🌾🏃', description: 'A swift grassland mammal with slender legs, short fur, and long, thin, ringed horns.' },
      difficulty: 'medium'
    },
    { 
      common: 'Crab', impostor: 'Lobster', hints: ['Shellfish', 'Pincers', 'Ocean'],
      commonVisual: { emojis: '🦀🦀🏖️', description: 'A flat sea creature with a round shell, ten legs, two pincers, that walks sideways.' },
      impostorVisual: { emojis: '🦞🦞🦞', description: 'A long ocean crustacean with a fan tail, long antennae, and two huge crushing claws.' },
      difficulty: 'hard'
    },
    { 
      common: 'Octopus', impostor: 'Squid', hints: ['Cephalopod', 'Tentacles', 'Ink'],
      commonVisual: { emojis: '🐙🐙🌊', description: 'A round-headed sea creature with eight long arms, suckers, and the ability to camouflage.' },
      impostorVisual: { emojis: '🦑🦑🌊', description: 'A torpedo-shaped sea creature with ten tentacles, triangular fins, and large round eyes.' },
      difficulty: 'hard'
    },
  ],
  Food: [
    { 
      common: 'Pizza', impostor: 'Burger', hints: ['Fast Food', 'Cheesy', 'Flour'],
      commonVisual: { emojis: '🍕🍕🧀', description: 'A flat circular baked dough topped with red tomato sauce, melted cheese, and pepperoni.' },
      impostorVisual: { emojis: '🍔🍔🍟', description: 'A round sandwich with a grilled meat patty, lettuce, cheese, placed inside sliced buns.' },
      difficulty: 'medium'
    },
    { 
      common: 'Tea', impostor: 'Coffee', hints: ['Beverage', 'Caffeine', 'Hot'],
      commonVisual: { emojis: '🍵☕🫖', description: 'A warm light brown drink brewed by steeping dried green or black leaves in hot water.' },
      impostorVisual: { emojis: '☕🫘☕', description: 'A dark aromatic beverage brewed from roasted beans, often topped with foam or milk.' },
      difficulty: 'medium'
    },
    { 
      common: 'Cake', impostor: 'Donut', hints: ['Dessert', 'Sweet', 'Bakery'],
      commonVisual: { emojis: '🍰🎂🕯️', description: 'A soft baked sweet dessert made of sponge layers, frosted with cream, topped with candles.' },
      impostorVisual: { emojis: '🍩🍩🍩', description: 'A small ring-shaped fried dough with a hole in the center, covered in glaze and sprinkles.' },
      difficulty: 'medium'
    },
    { 
      common: 'Rice', impostor: 'Pasta', hints: ['Staple', 'Carb', 'Grains'],
      commonVisual: { emojis: '🍚🍚🌾', description: 'Tiny soft white grains cooked by boiling, served as a staple in a bowl.' },
      impostorVisual: { emojis: '🍝🍝🍝', description: 'Yellow strands of dough made from wheat, boiled and topped with red tomato sauce.' },
      difficulty: 'easy'
    },
    { 
      common: 'Apple', impostor: 'Pear', hints: ['Fruit', 'Orchard', 'Red/Green'],
      commonVisual: { emojis: '🍎🍏🍎', description: 'A round crisp orchard fruit with red or green skin and a small stem at the top.' },
      impostorVisual: { emojis: '🍐🍐🍐', description: 'A bell-shaped green or yellow fruit that is narrow at the top and wide at the bottom.' },
      difficulty: 'medium'
    },
    { 
      common: 'Orange', impostor: 'Lemon', hints: ['Citrus', 'Fruit', 'Acidic'],
      commonVisual: { emojis: '🍊🍊🍊', description: 'A round bright citrus fruit with a thick dimpled peel, divided into juicy sweet slices.' },
      impostorVisual: { emojis: '🍋🍋🍋', description: 'An oval bright yellow citrus fruit with pointed ends, known for its extremely sour juice.' },
      difficulty: 'medium'
    },
    { 
      common: 'Butter', impostor: 'Cheese', hints: ['Dairy', 'Fatty', 'Spreadable'],
      commonVisual: { emojis: '🧈🧈🍞', description: 'A solid block of churned cream yellow fat, which melts quickly on hot toast.' },
      impostorVisual: { emojis: '🧀🧀🐭', description: 'A yellow dairy block with holes in it, made from curdled milk, sliced or shredded.' },
      difficulty: 'medium'
    },
    { 
      common: 'Ice Cream', impostor: 'Gelato', hints: ['Frozen', 'Sweet', 'Creamy'],
      commonVisual: { emojis: '🍦🍨🍧', description: 'A cold whipped dairy dessert served in scoops on a waffle cone, topped with a cherry.' },
      impostorVisual: { emojis: '🍨🍨🇮🇹', description: 'A denser, smoother Italian frozen dessert with intense flavors, served with a spade spoon.' },
      difficulty: 'hard'
    },
    { 
      common: 'Sushi', impostor: 'Sashimi', hints: ['Japanese', 'Seafood', 'Rice'],
      commonVisual: { emojis: '🍣🥢🇯🇵', description: 'Bite-sized rolls of seasoned white rice wrapped in dark green seaweed with raw fish fillings.' },
      impostorVisual: { emojis: '🍣🐟🔪', description: 'Thin, neat slices of raw fresh fish (like salmon or tuna) served directly on a plate without rice.' },
      difficulty: 'hard'
    },
    { 
      common: 'Bread', impostor: 'Bun', hints: ['Bakery', 'Wheat', 'Loaf'],
      commonVisual: { emojis: '🍞🍞🍞', description: 'A sliced rectangular loaf of baked flour, yeast, and water, perfect for sandwich slices.' },
      impostorVisual: { emojis: '🥯🥯🥯', description: 'A small round soft baked roll of bread, often used to hold burgers or sliders.' },
      difficulty: 'medium'
    },
    { 
      common: 'Soup', impostor: 'Stew', hints: ['Liquid Meal', 'Warm', 'Bowl'],
      commonVisual: { emojis: '🥣🥣🥄', description: 'A clear liquid broth cooked with chopped vegetables and meats, eaten with a spoon.' },
      impostorVisual: { emojis: '🍲🍲🥘', description: 'A thick, hearty mixture of chunky meats, potatoes, and gravy simmered slowly in a pot.' },
      difficulty: 'medium'
    },
    { 
      common: 'Cookie', impostor: 'Biscuit', hints: ['Sweet', 'Baked', 'Snack'],
      commonVisual: { emojis: '🍪🍪🍪', description: 'A flat circular baked sweet treat studded with chocolate chips.' },
      impostorVisual: { emojis: '🧈🍞🥯', description: 'A small flaky, buttery baked bread roll, often eaten with gravy or honey at breakfast.' },
      difficulty: 'medium'
    },
    { 
      common: 'Pancake', impostor: 'Waffle', hints: ['Breakfast', 'Syrup', 'Batter'],
      commonVisual: { emojis: '🥞🥞🥞', description: 'A stack of flat, circular, fluffy griddle cakes topped with a pat of butter and maple syrup.' },
      impostorVisual: { emojis: '🫓🧇🧇', description: 'A golden baked batter cake with a distinct grid pattern of square pockets to hold syrup.' },
      difficulty: 'medium'
    },
    { 
      common: 'Chicken', impostor: 'Turkey', hints: ['Meat', 'Poultry', 'Bird'],
      commonVisual: { emojis: '🍗🐔🍗', description: 'A common farm poultry bird, served roasted, fried as drumsticks, or grilled.' },
      impostorVisual: { emojis: '🦃🦃🦃', description: 'A large fan-tailed poultry bird, traditionally roasted whole for holiday dinners.' },
      difficulty: 'medium'
    },
    { 
      common: 'Taco', impostor: 'Burrito', hints: ['Mexican', 'Tortilla', 'Wrap'],
      commonVisual: { emojis: '🌮🌮🌮', description: 'A folded hard or soft corn shell filled with ground beef, cheese, lettuce, and salsa.' },
      impostorVisual: { emojis: '🌯🌯🌯', description: 'A large flour tortilla wrapped into a cylinder, packed with rice, beans, meat, and cheese.' },
      difficulty: 'medium'
    },
    { 
      common: 'Chocolate', impostor: 'Fudge', hints: ['Sweet', 'Cocoa', 'Brown'],
      commonVisual: { emojis: '🍫🍫🍫', description: 'A sweet brown confectionery bar made from cocoa beans, wrapped in foil.' },
      impostorVisual: { emojis: '🍬🍬🤎', description: 'A soft, extremely rich and dense square of boiled sugar, butter, and cocoa.' },
      difficulty: 'hard'
    },
    { 
      common: 'Honey', impostor: 'Maple Syrup', hints: ['Sweetener', 'Viscous', 'Sticky'],
      commonVisual: { emojis: '🍯🐝🍯', description: 'A thick, golden, sticky liquid produced by bees, stored in a glass jar.' },
      impostorVisual: { emojis: '🍁🥞🍁', description: 'A sweet amber syrup tapped from the sap of maple trees, poured from a leaf-shaped bottle.' },
      difficulty: 'easy'
    },
    { 
      common: 'Cucumber', impostor: 'Zucchini', hints: ['Vegetable', 'Green', 'Salad'],
      commonVisual: { emojis: '🥒🥒🥗', description: 'A long green vegetable with watery crisp flesh and small seeds, eaten raw in salads.' },
      impostorVisual: { emojis: '🥒🍆🍳', description: 'A summer squash resembling a cucumber but with dry, soft flesh cooked in stir-fries.' },
      difficulty: 'hard'
    },
    { 
      common: 'Potato', impostor: 'Sweet Potato', hints: ['Root', 'Starch', 'Tuber'],
      commonVisual: { emojis: '🥔🥔🍟', description: 'A rounded tuber with brown skin and white starchy flesh, used to make french fries.' },
      impostorVisual: { emojis: '🍠🍠🍂', description: 'An elongated root vegetable with reddish-purple skin and bright orange sweet flesh.' },
      difficulty: 'medium'
    },
    { 
      common: 'Peach', impostor: 'Plum', hints: ['Fruit', 'Fuzzy', 'Stone'],
      commonVisual: { emojis: '🍑🍑🍑', description: 'A round fruit with fuzzy orange-pink skin, sweet yellow flesh, and a large central pit.' },
      impostorVisual: { emojis: '🟣🟣🟣', description: 'A small round fruit with smooth dark purple skin, sweet-tart yellow or red flesh, and a pit.' },
      difficulty: 'medium'
    },
  ],
  'Objects & Things': [
    {
      common: 'Pencil', impostor: 'Pen', hints: ['Writing', 'Stationery', 'Office'],
      commonVisual: { emojis: '✏️🪵✏️', description: 'A wooden writing instrument with a graphite core that can be erased.' },
      impostorVisual: { emojis: '🖊️✒️🖋️', description: 'A plastic or metal writing tool containing liquid ink, non-erasable.' },
      difficulty: 'medium'
    },
    {
      common: 'Mirror', impostor: 'Window', hints: ['Glass', 'Reflection', 'Home'],
      commonVisual: { emojis: '🪞🪞💇', description: 'A reflective glass pane showing anything directly in front of it.' },
      impostorVisual: { emojis: '🪟🏙️🪟', description: 'A transparent glass pane set in a wall to let light in and see the outside.' },
      difficulty: 'easy'
    },
    {
      common: 'Clock', impostor: 'Watch', hints: ['Time', 'Gadget', 'Face'],
      commonVisual: { emojis: '⏰🕰️🕒', description: 'A circular device hung on walls or placed on tables displaying the current hour.' },
      impostorVisual: { emojis: '⌚⌚📅', description: 'A small timekeeper strapped to the wrist for quick checks on the go.' },
      difficulty: 'medium'
    },
    {
      common: 'Candle', impostor: 'Flashlight', hints: ['Light', 'Darkness', 'Energy'],
      commonVisual: { emojis: '🕯️🔥🕯️', description: 'A wax cylinder with a central wick that melts when lit, giving a warm flame.' },
      impostorVisual: { emojis: '🔦🔋💡', description: 'A portable battery-powered torch casting a bright beam of LED light.' },
      difficulty: 'easy'
    },
    {
      common: 'Umbrella', impostor: 'Raincoat', hints: ['Waterproof', 'Storm', 'Shelter'],
      commonVisual: { emojis: '🌂☂️☔', description: 'A folding dome canopy on a metal rod, held in hand to block rainfall.' },
      impostorVisual: { emojis: '🧥🌧️🧥', description: 'A waterproof hooded jacket worn over clothes to stay dry in wet weather.' },
      difficulty: 'easy'
    },
    {
      common: 'Key', impostor: 'Lock', hints: ['Security', 'Metal', 'Door'],
      commonVisual: { emojis: '🔑🗝️🔓', description: 'A small shaped metal piece inserted into a slot to open gates or boxes.' },
      impostorVisual: { emojis: '🔒🔐🔒', description: 'A heavy metal device that clamps shut to secure doors and chains.' },
      difficulty: 'medium'
    },
    {
      common: 'Pillow', impostor: 'Blanket', hints: ['Bed', 'Sleep', 'Fluffy'],
      commonVisual: { emojis: '🛏️💤☁️', description: 'A soft rectangular cushion used to support the head during sleep.' },
      impostorVisual: { emojis: '🛌🧣🛌', description: 'A large sheet of fabric or wool draped over the body to retain heat.' },
      difficulty: 'medium'
    },
    {
      common: 'Spoon', impostor: 'Fork', hints: ['Eating', 'Utensil', 'Table'],
      commonVisual: { emojis: '🥄🥄🥣', description: 'A metallic utensil with a shallow oval bowl, used for scooping soups and cereals.' },
      impostorVisual: { emojis: '🍴🍽️🍴', description: 'A metallic table utensil with three or four sharp tines used to spear food.' },
      difficulty: 'medium'
    }
  ],
  'School & Learning': [
    {
      common: 'Math', impostor: 'Science', hints: ['Subject', 'Study', 'Formulas'],
      commonVisual: { emojis: '➕📐📊', description: 'The study of numbers, equations, geometry, calculations, and logic.' },
      impostorVisual: { emojis: '🧪🔬🌋', description: 'The study of the physical world, elements, chemistry, physics, and biology.' },
      difficulty: 'medium'
    },
    {
      common: 'Teacher', impostor: 'Professor', hints: ['Educator', 'School', 'Instruction'],
      commonVisual: { emojis: '👩‍🏫🏫📝', description: 'An educator instructing students in primary or secondary schools, grading homework.' },
      impostorVisual: { emojis: '👨‍🎓🎓🏛️', description: 'A high-level academic who lectures university students and conducts scientific research.' },
      difficulty: 'hard'
    },
    {
      common: 'Library', impostor: 'Classroom', hints: ['School Room', 'Quiet', 'Study'],
      commonVisual: { emojis: '📚🏛️📚', description: 'A silent building filled with rows of bookshelves and study desks.' },
      impostorVisual: { emojis: '🏫🎒🚪', description: 'A room containing student desks, a whiteboard, and folders where lessons are taught.' },
      difficulty: 'easy'
    },
    {
      common: 'Pencil', impostor: 'Eraser', hints: ['School Supply', 'Stationery', 'Correction'],
      commonVisual: { emojis: '✏️✏️✏️', description: 'A lead/graphite drawing stick housed in a wooden sleeve.' },
      impostorVisual: { emojis: '🧼🧼🧼', description: 'A small rubber block rubbed over pencil marks to lift lead off the paper.' },
      difficulty: 'easy'
    },
    {
      common: 'Ruler', impostor: 'Protractor', hints: ['Measurement', 'Geometry', 'Math Tool'],
      commonVisual: { emojis: '📏📏📏', description: 'A straight plastic strip marked in centimeters, used to draw straight lines.' },
      impostorVisual: { emojis: '📐📐📐', description: 'A semi-circular layout tool used to measure and construct angles in degrees.' },
      difficulty: 'hard'
    },
    {
      common: 'Homework', impostor: 'Exam', hints: ['Assessment', 'Schoolwork', 'Grades'],
      commonVisual: { emojis: '🏠📝🎒', description: 'Exercises assigned by teachers to be completed at home after school hours.' },
      impostorVisual: { emojis: '📝⏱️💯', description: 'A silent, timed test taken in class under strict observation to earn final grades.' },
      difficulty: 'medium'
    },
    {
      common: 'Backpack', impostor: 'Pencil Case', hints: ['School Gear', 'Storage', 'Zip'],
      commonVisual: { emojis: '🎒🎒🎒', description: 'A large double-strap bag worn on the back to carry textbooks and folders.' },
      impostorVisual: { emojis: '👝✏️🖊', description: 'A small zippered pouch containing pens, highlighters, and small tools.' },
      difficulty: 'easy'
    },
    {
      common: 'Calculator', impostor: 'Abacus', hints: ['Counting', 'Math Tool', 'Digits'],
      commonVisual: { emojis: '🧮📟🔢', description: 'An electronic pocket device with buttons and screen, used to solve arithmetic.' },
      impostorVisual: { emojis: '🧮🧮🪵', description: 'An ancient counting frame fitted with wooden beads sliding on wires.' },
      difficulty: 'hard'
    }
  ],
  'Silly & Random': [
    {
      common: 'Banana Peel', impostor: 'Wet Floor', hints: ['Slip', 'Hazard', 'Accident'],
      commonVisual: { emojis: '🍌🫗⚠️', description: 'A yellow fruit skin discarded on the ground, a classic cartoon slip hazard.' },
      impostorVisual: { emojis: '🫗🚧⚠️', description: 'A freshly mopped tile surface marked by a yellow A-frame warning sign.' },
      difficulty: 'medium'
    },
    {
      common: 'Unicorn', impostor: 'Narwhal', hints: ['Horn', 'Mythical vs Real', 'Creature'],
      commonVisual: { emojis: '🦄🦄🌈', description: 'A legendary magical horse with a glowing spiral horn on its forehead.' },
      impostorVisual: { emojis: '🐋🐳❄️', description: 'A real arctic whale with a long spiral tusk protruding from its head.' },
      difficulty: 'hard'
    },
    {
      common: 'Bubble Wrap', impostor: 'Pop It', hints: ['Fidget', 'Popping', 'Plastic'],
      commonVisual: { emojis: '📦🫧📦', description: 'A sheet of plastic containing air-filled bubbles, popped once for packaging relief.' },
      impostorVisual: { emojis: '🫧🪁🦄', description: 'A colorful silicone toy with bubbles that can be pushed back and forth repeatedly.' },
      difficulty: 'medium'
    },
    {
      common: 'Toilet Paper', impostor: 'Paper Towel', hints: ['Bathroom vs Kitchen', 'Roll', 'Absorbent'],
      commonVisual: { emojis: '🧻🧻🚽', description: 'A soft, thin paper roll kept in restrooms for personal hygiene.' },
      impostorVisual: { emojis: '🧻🧻🧽', description: 'A thick, large paper roll kept in kitchens to wipe up spills and clean grease.' },
      difficulty: 'easy'
    },
    {
      common: 'Clown', impostor: 'Mime', hints: ['Performer', 'Funny', 'Makeup'],
      commonVisual: { emojis: '🤡🎈🎪', description: 'A circus performer wearing a red nose, huge shoes, doing silly tricks.' },
      impostorVisual: { emojis: '🎭🤍🖤', description: 'A silent performer in face paint and striped shirt, acting inside invisible walls.' },
      difficulty: 'hard'
    },
    {
      common: 'Pillow Fight', impostor: 'Water Balloon', hints: ['Playtime', 'Target', 'Impact'],
      commonVisual: { emojis: '🛏️🪶😴', description: 'A messy bedroom game of swinging soft pillows at friends.' },
      impostorVisual: { emojis: '🎈💦💣', description: 'An outdoor battle throwing tiny rubber balloons packed with cold water.' },
      difficulty: 'medium'
    },
    {
      common: 'Sock', impostor: 'Glove', hints: ['Clothing', 'Warmth', 'Limbs'],
      commonVisual: { emojis: '🧦🧦👟', description: 'A soft tube of fabric slipped over feet inside shoes.' },
      impostorVisual: { emojis: '🧤🧤🧤', description: 'A hand covering featuring five individual slots for fingers.' },
      difficulty: 'easy'
    },
    {
      common: 'Mustache', impostor: 'Beard', hints: ['Facial Hair', 'Grooming', 'Barber'],
      commonVisual: { emojis: '🥸🧔🥸', description: 'Facial hair styled exclusively above the upper lip.' },
      impostorVisual: { emojis: '🧔🧔🧔', description: 'Full facial hair covering the chin, jawlines, and cheeks.' },
      difficulty: 'medium'
    }
  ],
  'Geography (Countries & Cities)': [
    { 
      common: 'India', impostor: 'Pakistan', hints: ['Country', 'Asia', 'Heritage'],
      commonVisual: { emojis: '🇮🇳🐅🕉️', description: 'A South Asian country known for the Taj Mahal, peacock symbol, and a tricolor flag with a wheel.' },
      impostorVisual: { emojis: '🇵🇰🏜️☪️', description: 'A South Asian nation featuring a green and white flag with a crescent moon and star.' },
      difficulty: 'medium'
    },
    { 
      common: 'Japan', impostor: 'China', hints: ['Country', 'Asia', 'Culture'],
      commonVisual: { emojis: '🇯🇵🍣🏯', description: 'An East Asian island nation featuring a white flag with a central red sun circle.' },
      impostorVisual: { emojis: '🇨🇳🐼🐉', description: 'A massive East Asian country known for the Great Wall, giant pandas, and a red flag with five stars.' },
      difficulty: 'medium'
    },
    { 
      common: 'France', impostor: 'Italy', hints: ['Country', 'Europe', 'Art'],
      commonVisual: { emojis: '🇫🇷🗼🥐', description: 'A Western European country famous for the Eiffel Tower, baguettes, and a blue-white-red flag.' },
      impostorVisual: { emojis: '🇮🇹🍕🏛️', description: 'A boot-shaped European nation famous for ancient Rome, pasta, and a green-white-red flag.' },
      difficulty: 'medium'
    },
    { 
      common: 'Spain', impostor: 'Portugal', hints: ['Country', 'Europe', 'Peninsula'],
      commonVisual: { emojis: '🇪🇸💃🐂', description: 'A sunny European country famous for flamenco dance, bullfighting, and a red-yellow-red flag.' },
      impostorVisual: { emojis: '🇵🇹⛵🐟', description: 'A coastal European nation famous for tile art, egg tarts, and a green-red flag.' },
      difficulty: 'medium'
    },
    { 
      common: 'USA', impostor: 'Canada', hints: ['Country', 'North America', 'Border'],
      commonVisual: { emojis: '🇺🇸🦅🗽', description: 'A large North American nation known for the Statue of Liberty, and a stars-and-stripes flag.' },
      impostorVisual: { emojis: '🇨🇦🍁🫎', description: 'A northern country famous for maple syrup, moose, cold winters, and a red maple leaf flag.' },
      difficulty: 'medium'
    },
    { 
      common: 'Germany', impostor: 'Austria', hints: ['Country', 'Europe', 'German'],
      commonVisual: { emojis: '🇩🇪🏰🥨', description: 'A central European country known for castles, pretzels, and a black-red-gold horizontal flag.' },
      impostorVisual: { emojis: '🇦🇹🏔️🎻', description: 'A mountainous central European country famous for classical music and a red-white-red striped flag.' },
      difficulty: 'medium'
    },
    { 
      common: 'Brazil', impostor: 'Argentina', hints: ['Country', 'South America', 'Football'],
      commonVisual: { emojis: '🇧🇷🌴⚽', description: 'The largest South American nation, famous for the Amazon, Carnival, and a green-yellow-blue flag.' },
      impostorVisual: { emojis: '🇦🇷🏔️🥩', description: 'A South American nation famous for tango dance, steak, and a light blue-white flag with a sun.' },
      difficulty: 'medium'
    },
    { 
      common: 'Egypt', impostor: 'Morocco', hints: ['Country', 'Africa', 'Desert'],
      commonVisual: { emojis: '🇪🇬🔺🐪', description: 'A North African country famous for ancient stone pyramids, the Nile river, and sphinxes.' },
      impostorVisual: { emojis: '🇲🇦🕌🏺', description: 'A North African kingdom known for spice bazaars, red clay towns, and a red flag with a green star.' },
      difficulty: 'medium'
    },
    { 
      common: 'Australia', impostor: 'New Zealand', hints: ['Country', 'Oceania', 'Islands'],
      commonVisual: { emojis: '🇦🇺🦘🐨', description: 'A massive island continent country known for kangaroos, the Outback, and koalas.' },
      impostorVisual: { emojis: '🇳🇿🥝⛰️', description: 'An island nation famous for kiwi birds, stunning mountains, and Maori culture.' },
      difficulty: 'medium'
    },
    { 
      common: 'Russia', impostor: 'Ukraine', hints: ['Country', 'Europe/Asia', 'Cold'],
      commonVisual: { emojis: '🇷🇺❄️🏰', description: 'The largest country in the world by landmass, spanning across northern Asia and Europe.' },
      impostorVisual: { emojis: '🇺🇦🌻🌾', description: 'A large Eastern European country famous for sunflower fields and a blue-yellow flag.' },
      difficulty: 'medium'
    },
    { 
      common: 'Mexico', impostor: 'Colombia', hints: ['Country', 'Spanish', 'Latin America'],
      commonVisual: { emojis: '🇲🇽🌮🌴', description: 'A North American nation famous for ancient Aztec ruins, tacos, and a green-white-red flag.' },
      impostorVisual: { emojis: '🇨🇴☕🌴', description: 'A South American nation famous for coffee bean production, and a yellow-blue-red striped flag.' },
      difficulty: 'medium'
    },
    { 
      common: 'South Korea', impostor: 'North Korea', hints: ['Country', 'Asia', 'Peninsula'],
      commonVisual: { emojis: '🇰🇷💻🏙️', description: 'A high-tech East Asian country famous for K-pop, and a white flag with a red-blue yin-yang.' },
      impostorVisual: { emojis: '🇰🇵🛡️🏔️', description: 'A highly isolated East Asian nation on the northern half of the Korean peninsula.' },
      difficulty: 'medium'
    },
    { 
      common: 'UK', impostor: 'Ireland', hints: ['Country', 'Europe', 'Isles'],
      commonVisual: { emojis: '🇬🇧💂🚌', description: 'An island nation comprising England, Scotland, Wales, and Northern Ireland, with a Union Jack flag.' },
      impostorVisual: { emojis: '🇮🇪🍀🍺', description: 'An island nation famous for green landscapes, shamrocks, castles, and a green-white-orange flag.' },
      difficulty: 'medium'
    },
    { 
      common: 'Greece', impostor: 'Turkey', hints: ['Country', 'Mediterranean', 'Ancient'],
      commonVisual: { emojis: '🇬🇷🏛️🌊', description: 'A Mediterranean nation famous for white stone ruins, sunny islands, and a blue-white striped flag.' },
      impostorVisual: { emojis: '🇹🇷🕌☕', description: 'A transcontinental country known for historic mosques, hot air balloons, and a red crescent flag.' },
      difficulty: 'medium'
    },
    { 
      common: 'Switzerland', impostor: 'Sweden', hints: ['Country', 'Europe', 'Neutral'],
      commonVisual: { emojis: '🇨🇭🏔️🧀', description: 'A landlocked European country famous for the Alps, watches, and a red flag with a white cross.' },
      impostorVisual: { emojis: '🇸🇪🇸🇪❄️', description: 'A northern European nation known for flat-pack furniture, and a blue flag with a yellow cross.' },
      difficulty: 'medium'
    },
    { 
      common: 'South Africa', impostor: 'Kenya', hints: ['Country', 'Africa', 'Safari'],
      commonVisual: { emojis: '🇿🇦🦁🇿🇦', description: 'A diverse nation at the tip of Africa, famous for Table Mountain and a colorful flag.' },
      impostorVisual: { emojis: '🇰🇪🏃🐘', description: 'An East African country famous for wildlife safaris, running champions, and savanna plains.' },
      difficulty: 'medium'
    },
    { 
      common: 'Thailand', impostor: 'Vietnam', hints: ['Country', 'Asia', 'Tropical'],
      commonVisual: { emojis: '🇹🇭🏯🐘', description: 'A Southeast Asian country famous for golden temples, tropical beaches, and elephants.' },
      impostorVisual: { emojis: '🇻🇳🍜🌾', description: 'A coastal Southeast Asian country famous for pho noodle soup and a red flag with a yellow star.' },
      difficulty: 'medium'
    },
    { 
      common: 'Netherlands', impostor: 'Belgium', hints: ['Country', 'Europe', 'Flat'],
      commonVisual: { emojis: '🇳🇱🌷🚲', description: 'A flat European country famous for tulips, windmills, canals, and bicycle lanes.' },
      impostorVisual: { emojis: '🇧🇪🍫🧇', description: 'A European nation famous for waffles, chocolate, and a black-yellow-red vertical striped flag.' },
      difficulty: 'medium'
    },
    { 
      common: 'Norway', impostor: 'Finland', hints: ['Country', 'Europe', 'Nordic'],
      commonVisual: { emojis: '🇳🇴❄️⛵', description: 'A mountainous Nordic nation famous for deep coastal fjords, Vikings, and cold winters.' },
      impostorVisual: { emojis: '🇫🇮🌲🦌', description: 'A northern European country famous for cold pine forests, thousands of lakes, and saunas.' },
      difficulty: 'medium'
    },
    { 
      common: 'Saudi Arabia', impostor: 'UAE', hints: ['Country', 'Middle East', 'Desert'],
      commonVisual: { emojis: '🇸🇦🐪🌴', description: 'A large Middle Eastern country covered in desert, known for a green flag with a sword.' },
      impostorVisual: { emojis: '🇦🇪🏙️🐪', description: 'A Middle Eastern country famous for futuristic glass skyscrapers (like Dubai) and deserts.' },
      difficulty: 'medium'
    },
  ],
  'Movies & TV': [
    { 
      common: 'Batman', impostor: 'Superman', hints: ['Movie', 'Superhero', 'Comics'],
      commonVisual: { emojis: '🦇🦇🌆', description: 'A movie about a dark masked vigilante in Gotham City who drives a high-tech armored car.' },
      impostorVisual: { emojis: '🦸‍♂️⚡💥', description: 'A movie about an alien hero in a blue suit and red cape who flies and has laser vision.' },
      difficulty: 'easy'
    },
    { 
      common: 'Avengers', impostor: 'Justice League', hints: ['Movie', 'Superhero', 'Team'],
      commonVisual: { emojis: '🦸‍♂️🛡️🔨', description: 'A Marvel blockbuster movie where Iron Man, Captain America, and Thor team up to save Earth.' },
      impostorVisual: { emojis: '🦸‍♂️🦇🔱', description: 'A DC movie where Batman, Superman, and Wonder Woman unite to defend the planet.' },
      difficulty: 'medium'
    },
    { 
      common: 'Harry Potter', impostor: 'Lord of the Rings', hints: ['Movie', 'Fantasy', 'Magic'],
      commonVisual: { emojis: '⚡🦉🧙‍♂️', description: 'A fantasy movie series about a boy wizard with a lightning scar attending a magic boarding school.' },
      impostorVisual: { emojis: '💍🌋🧝', description: 'An epic fantasy movie trilogy about hobbits traveling to destroy a dark gold ring in a volcano.' },
      difficulty: 'medium'
    },
    { 
      common: 'Star Wars', impostor: 'Star Trek', hints: ['Movie', 'Sci-Fi', 'Space'],
      commonVisual: { emojis: '🚀⚔️🌌', description: 'A legendary space fantasy franchise featuring lightsabers, the Force, and a dark masked lord.' },
      impostorVisual: { emojis: '🖖🌌🛸', description: 'A classic sci-fi space franchise focused on exploration, featuring a starship crew with pointed ears.' },
      difficulty: 'medium'
    },
    { 
      common: 'Titanic', impostor: 'Avatar', hints: ['Movie', 'Director', 'Record'],
      commonVisual: { emojis: '🚢🧊🌊', description: 'A romantic epic movie about a luxurious passenger ship that strikes an iceberg and sinks.' },
      impostorVisual: { emojis: '🔵🌌🏹', description: 'A sci-fi blockbuster movie set on a glowing moon populated by tall blue humanoid hunters.' },
      difficulty: 'easy'
    },
    { 
      common: 'Inception', impostor: 'Interstellar', hints: ['Movie', 'Director', 'Nolan'],
      commonVisual: { emojis: '🌀💤🏢', description: 'A mind-bending sci-fi movie about thieves who enter dreams to plant ideas.' },
      impostorVisual: { emojis: '🚀🪐🌌', description: 'An epic space sci-fi movie about astronauts searching for a new home through a wormhole.' },
      difficulty: 'hard'
    },
    { 
      common: 'Toy Story', impostor: 'Shrek', hints: ['Movie', 'Animated', 'CGI'],
      commonVisual: { emojis: '🤠🧑‍🚀🧸', description: 'A classic animated movie about toys that come to life when humans leave the room.' },
      impostorVisual: { emojis: '🟢🧌🏰', description: 'A hilarious animated comedy about a grumpy green ogre who lives in a swamp and saves a princess.' },
      difficulty: 'medium'
    },
    { 
      common: 'The Matrix', impostor: 'Terminator', hints: ['Movie', 'Sci-Fi', 'Action'],
      commonVisual: { emojis: '🕶️🧥🟢', description: 'A sci-fi movie where a hacker learns that reality is a simulation run by machines.' },
      impostorVisual: { emojis: '🤖💀🕶️', description: 'A sci-fi action movie about a robotic assassin sent back in time to eliminate a target.' },
      difficulty: 'medium'
    },
    { 
      common: 'Finding Nemo', impostor: 'Shark Tale', hints: ['Movie', 'Animated', 'Ocean'],
      commonVisual: { emojis: '🐠🐠🌊', description: 'A cute animated Pixar film about an orange clownfish looking for his lost son in Sydney.' },
      impostorVisual: { emojis: '🦈🐟🏙️', description: 'An animated undersea comedy about a small fish who lies about slaying a vegetarian shark.' },
      difficulty: 'medium'
    },
    { 
      common: 'Jurassic Park', impostor: 'Godzilla', hints: ['Movie', 'Monsters', 'Action'],
      commonVisual: { emojis: '🦖🦕🧬', description: 'A classic sci-fi thriller about a theme park populated by cloned dinosaurs that escape.' },
      impostorVisual: { emojis: '🦎☢️🏙️', description: 'A monster action movie about a colossal radioactive sea lizard that tramples skyscrapers.' },
      difficulty: 'easy'
    },
    { 
      common: 'Gladiator', impostor: 'Braveheart', hints: ['Movie', 'History', 'Combat'],
      commonVisual: { emojis: '🛡️⚔️🏛️', description: 'A historical epic about a betrayed Roman general who fights as a slave in the Colosseum.' },
      impostorVisual: { emojis: '🏴󠁧󠁢󠁳󠁣󠁴󠁿⚔️🪵', description: 'A historical epic about a blue-painted Scottish hero leading a rebellion for independence.' },
      difficulty: 'medium'
    },
    { 
      common: 'Iron Man', impostor: 'Captain America', hints: ['Movie', 'Marvel', 'Avenger'],
      commonVisual: { emojis: '🤖⚡🔴', description: 'A superhero movie about a wealthy inventor who builds a high-tech red and gold flying suit.' },
      impostorVisual: { emojis: '🛡️💙⭐', description: 'A superhero film about a supersoldier with a circular star-spangled shield.' },
      difficulty: 'medium'
    },
    { 
      common: 'Spider-Man', impostor: 'Batman', hints: ['Movie', 'Superhero', 'Mask'],
      commonVisual: { emojis: '🕸️🕷️🔴', description: 'A movie about a teenager bitten by a genetically altered insect, who swings from webs.' },
      impostorVisual: { emojis: '🦇🦇🌑', description: 'A dark movie about a wealthy orphan who fights crime wearing a black bat suit.' },
      difficulty: 'medium'
    },
    { 
      common: 'Joker', impostor: 'Riddler', hints: ['Movie', 'Villain', 'Gotham'],
      commonVisual: { emojis: '🤡🃏🎭', description: 'A movie focusing on a green-haired, laughing criminal mastermind dressed in a purple suit.' },
      impostorVisual: { emojis: '❓❓👓', description: 'A movie about a green-suited villain who leaves complicated puzzles and riddles for detectives.' },
      difficulty: 'medium'
    },
    { 
      common: 'Frozen', impostor: 'Moana', hints: ['Movie', 'Disney', 'Princess'],
      commonVisual: { emojis: '❄️⛄👸', description: 'A Disney animated hit about an ice princess and her talking snowman companion.' },
      impostorVisual: { emojis: '🌊🛶🏝️', description: 'A Disney animated musical about a Polynesian girl sailing the ocean to save her island.' },
      difficulty: 'medium'
    },
    { 
      common: 'Lion King', impostor: 'Madagascar', hints: ['Movie', 'Animated', 'Animals'],
      commonVisual: { emojis: '🦁👑🐗', description: 'A beautiful animated musical about a lion cub who returns to reclaim his crown.' },
      impostorVisual: { emojis: '🦓🦁🦒', description: 'An animated comedy about zoo animals that escape and get shipwrecked on a wild island.' },
      difficulty: 'medium'
    },
    { 
      common: 'Inside Out', impostor: 'Up', hints: ['Movie', 'Pixar', 'Animation'],
      commonVisual: { emojis: '🧠💡🎭', description: 'An animated movie taking place inside a young girl\'s mind, starring Joy and Sadness.' },
      impostorVisual: { emojis: '🎈🏠🎈', description: 'An animated Pixar classic about an elderly man who flies his house using thousands of balloons.' },
      difficulty: 'medium'
    },
    { 
      common: 'Ghostbusters', impostor: 'Men in Black', hints: ['Movie', 'Sci-Fi', 'Comedy'],
      commonVisual: { emojis: '👻🚫🧪', description: 'A classic sci-fi comedy about researchers who trap ghosts in New York.' },
      impostorVisual: { emojis: '🕶️🤵👽', description: 'A sci-fi comedy about secret agents in black suits who police alien activity on Earth.' },
      difficulty: 'medium'
    },
    { 
      common: 'Home Alone', impostor: 'Elf', hints: ['Movie', 'Holiday', 'Comedy'],
      commonVisual: { emojis: '🏠🎄🎒', description: 'A classic Christmas comedy about a boy accidentally left behind who defends his house.' },
      impostorVisual: { emojis: '🧝🟢🎄', description: 'A holiday comedy about a human raised by Santa\'s elves who travels to New York.' },
      difficulty: 'medium'
    },
    { 
      common: 'Pulp Fiction', impostor: 'Fight Club', hints: ['Movie', 'Drama', 'Classic'],
      commonVisual: { emojis: '💼🕶️📻', description: 'A dialogue-rich crime movie with non-linear storytelling, hits, and burgers.' },
      impostorVisual: { emojis: '🧼👊🧼', description: 'A gritty drama about an insomniac office worker who starts an underground fighting club.' },
      difficulty: 'hard'
    },
  ],
  'Music & Entertainment': [
    {
      common: 'Guitar', impostor: 'Violin', hints: ['Instrument', 'Strings', 'Music'],
      commonVisual: { emojis: '🎸🎸🪵', description: 'A stringed instrument held flat against the torso, strummed or plucked with fingers.' },
      impostorVisual: { emojis: '🎻🎻🎻', description: 'A small wooden instrument tucked under the chin, played by drawing a hair bow across strings.' },
      difficulty: 'medium'
    },
    {
      common: 'Piano', impostor: 'Keyboard', hints: ['Instrument', 'Keys', 'Acoustic vs Digital'],
      commonVisual: { emojis: '🎹🎹🏛️', description: 'A large wooden acoustic instrument with internal hammers striking metal strings.' },
      impostorVisual: { emojis: '🎹🔌💻', description: 'A digital synthesizer block plugged into speakers, simulating multiple sounds.' },
      difficulty: 'hard'
    },
    {
      common: 'Singer', impostor: 'Rapper', hints: ['Vocalist', 'Performer', 'Tempo'],
      commonVisual: { emojis: '🎤🎙️🎶', description: 'A musical artist who performs songs using melodic voice, holding sustained notes.' },
      impostorVisual: { emojis: '🎤⚡🔥', description: 'A vocal artist who speaks rhyming lyrics in rapid, rhythmic tempo over a beat.' },
      difficulty: 'medium'
    },
    {
      common: 'Concert', impostor: 'Festival', hints: ['Show', 'Live Music', 'Audience'],
      commonVisual: { emojis: '🎫🎸🏟️', description: 'A single musical act playing for an audience inside an indoor hall or stadium.' },
      impostorVisual: { emojis: '⛺🌳🎪', description: 'A multi-day outdoor event featuring multiple stages, food trucks, and camping areas.' },
      difficulty: 'hard'
    },
    {
      common: 'Rock', impostor: 'Pop', hints: ['Genre', 'Sound', 'Beats'],
      commonVisual: { emojis: '🎸🥁🔥', description: 'A energetic music genre built around heavy electric guitars and fast drums.' },
      impostorVisual: { emojis: '🎶🎤✨', description: 'Catchy mainstream music featuring electronic beats, synthesizers, and dance hooks.' },
      difficulty: 'medium'
    },
    {
      common: 'Headphones', impostor: 'Speaker', hints: ['Audio', 'Sound Output', 'Device'],
      commonVisual: { emojis: '🎧🎧🔋', description: 'A personal wearable audio device with padded cups covering both ears.' },
      impostorVisual: { emojis: '🔊📻🔊', description: 'A stationary audio box that projects loud music outward to fill an entire room.' },
      difficulty: 'easy'
    },
    {
      common: 'Dance', impostor: 'Karaoke', hints: ['Activity', 'Party', 'Movement vs Voice'],
      commonVisual: { emojis: '💃🕺🎉', description: 'Moving the body rhythmically in sync with the beat and tempo of play.' },
      impostorVisual: { emojis: '🎤📺🎶', description: 'Singing along to a backing track while reading scrolling lyrics on a screen.' },
      difficulty: 'easy'
    },
    {
      common: 'Drum', impostor: 'Tambourine', hints: ['Percussion', 'Rhythm', 'Beating'],
      commonVisual: { emojis: '🥁🥁🥁', description: 'A hollow cylinder with a stretched membrane, beaten with wooden sticks.' },
      impostorVisual: { emojis: '🪇🔔🪇', description: 'A wooden ring fitted with metal jingling discs, shaken or struck with the palm.' },
      difficulty: 'hard'
    }
  ],
  'Sports & Games': [
    {
      common: 'Soccer', impostor: 'Basketball', hints: ['Ball Game', 'Teammates', 'Goals vs Hoops'],
      commonVisual: { emojis: '⚽🏃🥅', description: 'A game played on grass where players kick a black-and-white ball into a net.' },
      impostorVisual: { emojis: '🏀👟🗑️', description: 'A game played on a court where players bounce and throw an orange ball into a hoop.' },
      difficulty: 'easy'
    },
    {
      common: 'Tennis', impostor: 'Badminton', hints: ['Racket', 'Net', 'Court'],
      commonVisual: { emojis: '🎾🎾🎾', description: 'A sport where players strike a bouncy neon-green ball over a net with strings.' },
      impostorVisual: { emojis: '🏸🏸🏸', description: 'A sport where players hit a feathered cone (shuttlecock) over a high net.' },
      difficulty: 'medium'
    },
    {
      common: 'Chess', impostor: 'Checkers', hints: ['Board Game', 'Strategy', 'Pieces'],
      commonVisual: { emojis: '♟️👑🏰', description: 'A strategy game played with Kings, Queens, Knights, and Pawns moving in distinct patterns.' },
      impostorVisual: { emojis: '🔴⚫🔴', description: 'A board game played with identical red and black round discs sliding diagonally.' },
      difficulty: 'hard'
    },
    {
      common: 'Video Game', impostor: 'Board Game', hints: ['Gaming', 'Leisure', 'Digital vs Physical'],
      commonVisual: { emojis: '🎮📺🔌', description: 'An interactive digital entertainment program controlled using a pad on screens.' },
      impostorVisual: { emojis: '🎲📦🃏', description: 'A physical tabletop game involving dice, cards, or pieces on cardboard grids.' },
      difficulty: 'easy'
    },
    {
      common: 'Running', impostor: 'Swimming', hints: ['Exercise', 'Cardio', 'Medium'],
      commonVisual: { emojis: '🏃🏃👟', description: 'Moving rapidly on foot across tracks, paths, or trails.' },
      impostorVisual: { emojis: '🏊‍♀️🏊‍♂️🌊', description: 'Propelling the body through open water or lanes inside pools.' },
      difficulty: 'easy'
    },
    {
      common: 'Cricket', impostor: 'Baseball', hints: ['Bat & Ball', 'Pitch', 'Outs'],
      commonVisual: { emojis: '🏏🏏🏏', description: 'A sport where bats are flat, wickets are defended, and runs are run on a central pitch.' },
      impostorVisual: { emojis: '⚾🧢🧤', description: 'A sport with a round wooden bat, a diamond field, base runners, and gloves.' },
      difficulty: 'hard'
    },
    {
      common: 'Bowling', impostor: 'Billiards', hints: ['Ball Game', 'Pins vs Pockets', 'Target'],
      commonVisual: { emojis: '🎳🎳🎳', description: 'Rolling a heavy ball down a wooden lane to knock down ten pins.' },
      impostorVisual: { emojis: '🎱🎱🦯', description: 'Striked colored spheres on a green felt table into corner pockets using a stick.' },
      difficulty: 'medium'
    },
    {
      common: 'Skateboard', impostor: 'Rollerblades', hints: ['Wheels', 'Ride', 'Stunts'],
      commonVisual: { emojis: '🛹🛹🛹', description: 'A wooden board fitted with four wheels, propelled by pushing with one foot.' },
      impostorVisual: { emojis: '🛼🛼🛼', description: 'Boots equipped with a single inline row of wheels underneath.' },
      difficulty: 'medium'
    }
  ],
  'Technology & Gadgets': [
    { 
      common: 'Python', impostor: 'Java', hints: ['Coding', 'Software', 'Language'],
      commonVisual: { emojis: '🐍💻⌨️', description: 'A modern programming language known for readable code, indentation, and a snake logo.' },
      impostorVisual: { emojis: '☕💻⌨️', description: 'A class-based programming language known for a coffee cup logo and compiler syntax.' },
      difficulty: 'hard'
    },
    { 
      common: 'Windows', impostor: 'Linux', hints: ['OS', 'Software', 'PC'],
      commonVisual: { emojis: '🪟💻🪟', description: 'A graphical computer operating system with a blue window logo, used on most laptops.' },
      impostorVisual: { emojis: '🐧🐧🐚', description: 'An open-source operating system represented by a penguin logo, used by developers.' },
      difficulty: 'medium'
    },
    { 
      common: 'Android', impostor: 'iPhone', hints: ['Mobile', 'OS', 'Smartphone'],
      commonVisual: { emojis: '🤖📱💚', description: 'An operating system for mobile phones represented by a green robot mascot.' },
      impostorVisual: { emojis: '🍎📱🍏', description: 'A premium mobile smartphone designed by Apple, featuring a flat screen and Apple logo.' },
      difficulty: 'medium'
    },
    { 
      common: 'Laptop', impostor: 'Desktop', hints: ['Hardware', 'Computer', 'Device'],
      commonVisual: { emojis: '💻💻🔋', description: 'A portable, clamshell computer that opens up, having a built-in keyboard and battery.' },
      impostorVisual: { emojis: '🖥️🔌🖥️', description: 'A stationary computer setup consisting of a separate monitor tower, keyboard, and power plug.' },
      difficulty: 'medium'
    },
    { 
      common: 'Keyboard', impostor: 'Mouse', hints: ['Input', 'Device', 'Peripheral'],
      commonVisual: { emojis: '⌨️⌨️⌨️', description: 'A flat plastic board packed with lettered keys, used for typing text into a computer.' },
      impostorVisual: { emojis: '🖱️🖱️🖱️', description: 'A handheld pointing device with left/right click buttons and a scrolling wheel.' },
      difficulty: 'easy'
    },
    { 
      common: 'Google', impostor: 'Bing', hints: ['Search', 'Website', 'Internet'],
      commonVisual: { emojis: '🔍🌐🔴', description: 'The most popular internet search engine, famous for a multicolored logo.' },
      impostorVisual: { emojis: '🔍🌐🟢', description: 'A search engine owned by Microsoft, integrated with a green/teal logo.' },
      difficulty: 'easy'
    },
    { 
      common: 'Wi-Fi', impostor: 'Bluetooth', hints: ['Wireless', 'Network', 'Radio'],
      commonVisual: { emojis: '📶📶📡', description: 'A local wireless network signal allowing devices to connect to high-speed internet.' },
      impostorVisual: { emojis: '🛜🎧📱', description: 'A short-range wireless frequency used to connect accessories like headphones to phones.' },
      difficulty: 'hard'
    },
    { 
      common: 'Monitor', impostor: 'TV', hints: ['Screen', 'Display', 'Video'],
      commonVisual: { emojis: '🖥️🖥️🖥️', description: 'A computer screen placed on a desk, used to display PC visuals.' },
      impostorVisual: { emojis: '📺📺🍿', description: 'A large display screen placed in a living room, connected to cable or streaming boxes.' },
      difficulty: 'medium'
    },
    { 
      common: 'CPU', impostor: 'GPU', hints: ['Chip', 'Hardware', 'Processing'],
      commonVisual: { emojis: '🎛️💾🧠', description: 'A small square microchip called the brain of a computer, seated in a motherboard socket.' },
      impostorVisual: { emojis: '🎮🔌📦', description: 'A large graphics expansion card equipped with cooling fans, used to process 3D games.' },
      difficulty: 'hard'
    },
    { 
      common: 'Database', impostor: 'Spreadsheet', hints: ['Data', 'Storage', 'Tables'],
      commonVisual: { emojis: '🗄️📊💾', description: 'A structured collection of tables stored in server arrays, accessed using SQL queries.' },
      impostorVisual: { emojis: '📊📈📄', description: 'A grid sheet composed of rows and columns (cells) used to input formulas and budgets.' },
      difficulty: 'hard'
    },
    { 
      common: 'Headphones', impostor: 'Earbuds', hints: ['Audio', 'Sound', 'Music'],
      commonVisual: { emojis: '🎧🎧🎶', description: 'A padded headband with two ear cups worn over the ears to listen to audio.' },
      impostorVisual: { emojis: '🛜🎧🔋', description: 'Tiny plastic sound drivers placed directly inside the ear canal, kept in a charging case.' },
      difficulty: 'medium'
    },
    { 
      common: 'Smartwatch', impostor: 'Fitness Tracker', hints: ['Wearable', 'Wrist', 'Gadget'],
      commonVisual: { emojis: '⌚⌚📅', description: 'A wrist gadget with a touchscreen that runs apps, shows notifications, and tracks time.' },
      impostorVisual: { emojis: '⌚🏃❤️', description: 'A narrow rubber band worn on the wrist to monitor heart rate, steps, and calories.' },
      difficulty: 'medium'
    },
    { 
      common: 'Camera', impostor: 'Camcorder', hints: ['Photos', 'Lens', 'Optics'],
      commonVisual: { emojis: '📷📸🖼️', description: 'A rectangular device with a circular lens used to snap static photographs.' },
      impostorVisual: { emojis: '📹📼📹', description: 'A handheld recording device with a flip-out screen, used to film video footage.' },
      difficulty: 'hard'
    },
    { 
      common: 'Email', impostor: 'Letter', hints: ['Inbox', 'Message', 'Mail'],
      commonVisual: { emojis: '📧✉️📬', description: 'A digital text message sent instantly across the internet to an address like name@domain.com.' },
      impostorVisual: { emojis: '✉️📮📝', description: 'A physical paper note written by hand, folded in a stamped envelope, and delivered by a postman.' },
      difficulty: 'easy'
    },
    { 
      common: 'Virtual Reality', impostor: 'Augmented Reality', hints: ['Tech', 'Simulation', 'Visuals'],
      commonVisual: { emojis: '🥽🎮🌌', description: 'A fully closed headset that blocks the real world to immerse the user in a 3D digital simulation.' },
      impostorVisual: { emojis: '📱🕶️👓', description: 'A technology that overlays digital graphics onto the real world (like phone screen filters).' },
      difficulty: 'hard'
    },
    { 
      common: 'Bitcoin', impostor: 'Ethereum', hints: ['Crypto', 'Money', 'Blockchain'],
      commonVisual: { emojis: '🪙🪙🪙', description: 'The original decentralized digital currency, represented by an orange B symbol.' },
      impostorVisual: { emojis: '💎💎🌐', description: 'A blockchain platform supporting smart contracts, represented by a diamond-like logo.' },
      difficulty: 'hard'
    },
    { 
      common: 'Photoshop', impostor: 'Illustrator', hints: ['Adobe', 'Design', 'Software'],
      commonVisual: { emojis: '🎨🖌️💻', description: 'A professional image editing software used to edit photos and raster layers.' },
      impostorVisual: { emojis: '📐🎨💻', description: 'A professional vector design software used to design logos, icons, and scalable graphics.' },
      difficulty: 'hard'
    },
    { 
      common: 'Router', impostor: 'Modem', hints: ['Network', 'Internet', 'Blink'],
      commonVisual: { emojis: '📶📟📶', description: 'A network box with antennae that distributes Wi-Fi signals to multiple devices in a home.' },
      impostorVisual: { emojis: '📟🔌📟', description: 'A hardware box that connects directly to the wall cable to translate internet signals from the ISP.' },
      difficulty: 'hard'
    },
    { 
      common: 'Web Browser', impostor: 'Search Engine', hints: ['Software', 'Internet', 'App'],
      commonVisual: { emojis: '🌐🌐🧭', description: 'An application (like Chrome or Safari) used to open websites by typing URLs.' },
      impostorVisual: { emojis: '🔍🌐🔍', description: 'An online service that indexes websites to help users find information based on queries.' },
      difficulty: 'hard'
    },
    { 
      common: 'Hard Drive', impostor: 'SSD', hints: ['Storage', 'Memory', 'Hardware'],
      commonVisual: { emojis: '💾💾💿', description: 'A mechanical storage device containing spinning metal disks to write bytes.' },
      impostorVisual: { emojis: '💾⚙️⚡', description: 'A solid-state storage chip with no moving parts, offering high-speed memory read/writes.' },
      difficulty: 'hard'
    },
  ],
  'Nature & Outdoors': [
    {
      common: 'Tree', impostor: 'Bush', hints: ['Plant', 'Wood', 'Height'],
      commonVisual: { emojis: '🌳🌲🪵', description: 'A tall woody perennial plant featuring a single massive trunk and high leafy canopy.' },
      impostorVisual: { emojis: '🌿🏡🌿', description: 'A low-height woody plant branching heavily from the base near the ground.' },
      difficulty: 'easy'
    },
    {
      common: 'Forest', impostor: 'Jungle', hints: ['Ecosystem', 'Trees', 'Wild'],
      commonVisual: { emojis: '🌲🌲🦌', description: 'A large wooded area dominated by pine, oak, or maple trees in temperate zones.' },
      impostorVisual: { emojis: '🌴🐍🐒', description: 'A dense, hot, tropical rain-forest teeming with exotic vines, ferns, and high humidity.' },
      difficulty: 'hard'
    },
    {
      common: 'Desert', impostor: 'Beach', hints: ['Landscape', 'Sand', 'Water'],
      commonVisual: { emojis: '🏜️🐪🌵', description: 'A dry, barren landscape covered in sand dunes and cacti, with close to zero rainfall.' },
      impostorVisual: { emojis: '🏖️🌊🏝️', description: 'A sandy shoreline bordering a massive ocean or lake, with waves crashing.' },
      difficulty: 'easy'
    },
    {
      common: 'Star', impostor: 'Comet', hints: ['Space', 'Sky', 'Light'],
      commonVisual: { emojis: '⭐🌟✨', description: 'A static glowing sphere of hot plasma twinkling in the night sky light-years away.' },
      impostorVisual: { emojis: '☄️☄️☄️', description: 'A moving cosmic chunk of ice and dust leaving a glowing vapor tail behind it.' },
      difficulty: 'medium'
    },
    {
      common: 'Rain', impostor: 'Snow', hints: ['Precipitation', 'Weather', 'Water'],
      commonVisual: { emojis: '🌧️☔🌧️', description: 'Liquid water droplets falling from storm clouds, creating puddles on the ground.' },
      impostorVisual: { emojis: '❄️☃️🌨️', description: 'Frozen crystalline ice flakes drifting slowly down, forming a soft white blanket.' },
      difficulty: 'easy'
    },
    {
      common: 'Cloud', impostor: 'Fog', hints: ['Vapor', 'Weather', 'Altitude'],
      commonVisual: { emojis: '☁️🌥️☁️', description: 'Floating masses of condensed water vapor high up in the sky, blocking the sun.' },
      impostorVisual: { emojis: '🌫️🌁🌫️', description: 'Thick water vapor condensed near the ground surface, reducing driving visibility.' },
      difficulty: 'medium'
    },
    {
      common: 'Volcano', impostor: 'Earthquake', hints: ['Disaster', 'Nature Force', 'Tectonic'],
      commonVisual: { emojis: '🌋🌋🔥', description: 'A mountain with an opening venting molten rock, ash, and lava from the mantle.' },
      impostorVisual: { emojis: '🫨🏚️⚠️', description: 'A sudden, violent shaking of the ground caused by movement along fault lines.' },
      difficulty: 'medium'
    },
    {
      common: 'Flower', impostor: 'Weed', hints: ['Plant', 'Garden', 'Growth'],
      commonVisual: { emojis: '🌸🌹💐', description: 'The colorful, aromatic seed-bearing reproductive part of a plant, grown for display.' },
      impostorVisual: { emojis: '🌱🌱🌾', description: 'A wild, unwanted plant that grows rapidly in gardens, competing with crops.' },
      difficulty: 'medium'
    }
  ],
  'Colors & Shapes': [
    {
      common: 'Red', impostor: 'Orange', hints: ['Color', 'Warm Tone', 'Spectrum'],
      commonVisual: { emojis: '🔴🍎🎒', description: 'The color of strawberries, fire engines, and stop signs.' },
      impostorVisual: { emojis: '🟠🍊🎃', description: 'A warm color between red and yellow, seen in tangerines and pumpkins.' },
      difficulty: 'medium'
    },
    {
      common: 'Blue', impostor: 'Purple', hints: ['Color', 'Cool Tone', 'Spectrum'],
      commonVisual: { emojis: '🔵🐳🐳', description: 'The color of a clear daytime sky and deep ocean waters.' },
      impostorVisual: { emojis: '🟣🍇🦄', description: 'A rich color between blue and red, seen in grapes and lavender flowers.' },
      difficulty: 'medium'
    },
    {
      common: 'Circle', impostor: 'Oval', hints: ['Shape', 'Geometry', 'Round'],
      commonVisual: { emojis: '⭕🎯🪙', description: 'A perfectly round two-dimensional shape with all points equidistant from the center.' },
      impostorVisual: { emojis: '🥚🪞🥎', description: 'An elongated, egg-like round shape featuring two axes of symmetry.' },
      difficulty: 'hard'
    },
    {
      common: 'Square', impostor: 'Rectangle', hints: ['Shape', 'Geometry', 'Angles'],
      commonVisual: { emojis: '🟪⬜🟪', description: 'A four-sided polygon where all four sides are equal and all corners are 90 degrees.' },
      impostorVisual: { emojis: '📄🧱📺', description: 'A four-sided shape with four right angles, but opposite sides are longer than the others.' },
      difficulty: 'hard'
    },
    {
      common: 'Pink', impostor: 'Magenta', hints: ['Color', 'Red/Purple Shade', 'Vibrant'],
      commonVisual: { emojis: '🌸🐖🍧', description: 'A soft, light red hue often associated with cherry blossoms and cotton candy.' },
      impostorVisual: { emojis: '🦩🦩🦩', description: 'A deep, intense purplish-red color that is highly saturated.' },
      difficulty: 'hard'
    },
    {
      common: 'Gold', impostor: 'Silver', hints: ['Metals', 'Valuable', 'Shine'],
      commonVisual: { emojis: '🪙👑🥇', description: 'A warm metallic yellow color representing wealth, crown jewelry, and first place.' },
      impostorVisual: { emojis: '🥈🔩🍴', description: 'A cool metallic grey color representing coins, cutlery, and second place.' },
      difficulty: 'easy'
    },
    {
      common: 'Triangle', impostor: 'Pyramid', hints: ['Shape', 'Geometry', 'Dimensions'],
      commonVisual: { emojis: '🔺📐🔺', description: 'A flat two-dimensional geometric shape defined by three points and three straight lines.' },
      impostorVisual: { emojis: '🔺🏜️🔺', description: 'A solid three-dimensional structure with a square base and four triangular side faces.' },
      difficulty: 'medium'
    },
    {
      common: 'Sphere', impostor: 'Cube', hints: ['Shape', 'Geometry', '3D Dimensions'],
      commonVisual: { emojis: '🔮🏀🔮', description: 'A perfectly round three-dimensional shape, like a basketball or crystal ball.' },
      impostorVisual: { emojis: '📦🎲📦', description: 'A three-dimensional solid block with six equal square faces, like a die.' },
      difficulty: 'medium'
    }
  ],
  'Emotions & Feelings': [
    {
      common: 'Happy', impostor: 'Excited', hints: ['Emotion', 'Positive', 'Joy'],
      commonVisual: { emojis: '🙂😊☀️', description: 'A pleasant feeling of content, satisfaction, and inner warmth.' },
      impostorVisual: { emojis: '🤩🥳🎉', description: 'A high-energy state of anticipation, eagerness, and racing pulse.' },
      difficulty: 'medium'
    },
    {
      common: 'Angry', impostor: 'Frustrated', hints: ['Emotion', 'Negative', 'Tension'],
      commonVisual: { emojis: '😡😠🔥', description: 'A strong feeling of hostility or displeasure, steam-venting.' },
      impostorVisual: { emojis: '😩😫😤', description: 'The annoyed feeling of being blocked from achieving a task or resolving a puzzle.' },
      difficulty: 'hard'
    },
    {
      common: 'Sad', impostor: 'Lonely', hints: ['Emotion', 'Low Energy', 'Blue'],
      commonVisual: { emojis: '😢😭💧', description: 'A feeling of sorrow, grief, or unhappiness, often accompanied by tears.' },
      impostorVisual: { emojis: '🥀👤🥀', description: 'A feeling of sadness resulting from being isolated or lacking companionship.' },
      difficulty: 'hard'
    },
    {
      common: 'Scared', impostor: 'Anxious', hints: ['Feeling', 'Fear', 'Worry'],
      commonVisual: { emojis: '😱😨👻', description: 'A sharp, immediate reaction to a real and visible threat or scary event.' },
      impostorVisual: { emojis: '😰⏳😰', description: 'A persistent, uneasy worry about future events, unknowns, or possibilities.' },
      difficulty: 'hard'
    },
    {
      common: 'Tired', impostor: 'Sleepy', hints: ['Feeling', 'Rest', 'Fatigue'],
      commonVisual: { emojis: '🥱😴💤', description: 'Physical fatigue, lacking the energy to perform tasks after exertion.' },
      impostorVisual: { emojis: '💤💤🛌', description: 'The heavy-eyed feeling of being ready to fall asleep right now.' },
      difficulty: 'medium'
    },
    {
      common: 'Surprised', impostor: 'Shocked', hints: ['Feeling', 'Unexpected', 'Startled'],
      commonVisual: { emojis: '😲😮✨', description: 'The startled feeling when something unexpected happens, like a gift.' },
      impostorVisual: { emojis: '⚡😱🚨', description: 'The absolute state of disbelief and alarm after hearing dramatic news.' },
      difficulty: 'hard'
    },
    {
      common: 'Bored', impostor: 'Relaxed', hints: ['Feeling', 'Calm', 'Activity'],
      commonVisual: { emojis: '😑😑⏳', description: 'The feeling of having nothing interesting to do, making time drag.' },
      impostorVisual: { emojis: '🛋️🍹🧘', description: 'A pleasant state of calm, free from stress, resting comfortably.' },
      difficulty: 'medium'
    },
    {
      common: 'Love', impostor: 'Friendship', hints: ['Feeling', 'Relationship', 'Heart'],
      commonVisual: { emojis: '❤️💖👩‍❤️‍👨', description: 'An intense, deep affection and romantic bond between individuals.' },
      impostorVisual: { emojis: '🤝👦👧', description: 'A mutual bond of trust, support, and shared fun between peers.' },
      difficulty: 'medium'
    }
  ],
  'Jobs & Professions': [
    {
      common: 'Doctor', impostor: 'Nurse', hints: ['Career', 'Medical', 'Hospital'],
      commonVisual: { emojis: '🩺👨‍⚕️🏥', description: 'A licensed medical practitioner who diagnoses illnesses and prescribes surgeries.' },
      impostorVisual: { emojis: '👩‍⚕️🩹🏥', description: 'A healthcare professional focused on patient care, administering shots and checks.' },
      difficulty: 'hard'
    },
    {
      common: 'Firefighter', impostor: 'Police Officer', hints: ['Career', 'Emergency', 'Uniform'],
      commonVisual: { emojis: '🚒👨‍🚒🔥', description: 'An emergency responder equipped to put out fires and rescue stranded pets.' },
      impostorVisual: { emojis: '👮🚓🚨', description: 'A law enforcement officer charged with patrolling streets and arresting suspects.' },
      difficulty: 'medium'
    },
    {
      common: 'Chef', impostor: 'Baker', hints: ['Career', 'Food preparation', 'Kitchen'],
      commonVisual: { emojis: '👨‍🍳🍳🥘', description: 'A professional cook managing restaurant menus, preparing savory dishes and meats.' },
      impostorVisual: { emojis: '🍞🍰🧁', description: 'A professional who specializes in baking breads, pastries, donuts, and cakes.' },
      difficulty: 'medium'
    },
    {
      common: 'Pilot', impostor: 'Astronaut', hints: ['Career', 'Flight', 'Cockpit'],
      commonVisual: { emojis: '👨‍✈️✈️🛫', description: 'A trained operator who flies commercial passenger aircraft between cities.' },
      impostorVisual: { emojis: '👨‍🚀🚀🪐', description: 'A space voyager trained to pilot rocket capsules and walk on the moon.' },
      difficulty: 'easy'
    },
    {
      common: 'Artist', impostor: 'Photographer', hints: ['Career', 'Creative', 'Visuals'],
      commonVisual: { emojis: '🎨👨‍🎨🖌️', description: 'A creative who draws, paints on canvases, or sculpts clay objects.' },
      impostorVisual: { emojis: '📷📸🖼️', description: 'A visual professional who captures digital or film images using camera lenses.' },
      difficulty: 'medium'
    },
    {
      common: 'Lawyer', impostor: 'Judge', hints: ['Career', 'Courtroom', 'Legal'],
      commonVisual: { emojis: '💼👨‍💼⚖️', description: 'A legal representative who defends or prosecutes clients during trials.' },
      impostorVisual: { emojis: '⚖️👨‍⚖️🔨', description: 'A high-ranking courtroom official who hears cases and hammers the final verdict.' },
      difficulty: 'hard'
    },
    {
      common: 'Builder', impostor: 'Architect', hints: ['Career', 'Construction', 'Structure'],
      commonVisual: { emojis: '👷🔨🧱', description: 'A tradesperson executing manual labor to lay bricks and build houses.' },
      impostorVisual: { emojis: '📐🏗️📝', description: 'A designer drafting complex blueprints and structural math layouts on drawing boards.' },
      difficulty: 'hard'
    },
    {
      common: 'Actor', impostor: 'Director', hints: ['Career', 'Entertainment', 'Movie Set'],
      commonVisual: { emojis: '🎭🎭🎭', description: 'A performer who plays a character in plays, theater, or movie scenes.' },
      impostorVisual: { emojis: '🎬📣📽️', description: 'The project manager who calls "Action!" and guides the actors on set.' },
      difficulty: 'medium'
    }
  ],
  'Vehicles & Transportation': [
    {
      common: 'Car', impostor: 'Bicycle', hints: ['Vehicle', 'Wheels', 'Road'],
      commonVisual: { emojis: '🚗🚗⛽', description: 'A passenger vehicle powered by internal engines, driving on four tires.' },
      impostorVisual: { emojis: '🚲🚲🚲', description: 'A two-wheeled lightweight frame propelled by pushing foot pedals.' },
      difficulty: 'easy'
    },
    {
      common: 'Airplane', impostor: 'Helicopter', hints: ['Vehicle', 'Aviation', 'Flight'],
      commonVisual: { emojis: '✈️🛫✈️', description: 'A fixed-wing jet vehicle flying passengers across high altitude jetstreams.' },
      impostorVisual: { emojis: '🚁🚁🚁', description: 'A rotorcraft lifting vertically using massive spinning overhead blades.' },
      difficulty: 'easy'
    },
    {
      common: 'Train', impostor: 'Subway', hints: ['Vehicle', 'Rails', 'Tracks'],
      commonVisual: { emojis: '🚂🚃🛤️', description: 'A long string of carriages pulled along overland steel tracks by a locomotive.' },
      impostorVisual: { emojis: '🚇🚇🚇', description: 'An electric underground rail network weaving tunnels beneath city blocks.' },
      difficulty: 'medium'
    },
    {
      common: 'Boat', impostor: 'Submarine', hints: ['Vehicle', 'Water', 'Hull'],
      commonVisual: { emojis: '⛵🚤🌊', description: 'A floating watercraft cruising across the surface of lakes and oceans.' },
      impostorVisual: { emojis: '🚢⚓🌊', description: 'A pressurized metallic vessel designed to cruise deep beneath the ocean waves.' },
      difficulty: 'medium'
    },
    {
      common: 'Motorcycle', impostor: 'Scooter', hints: ['Vehicle', 'Two-Wheeler', 'Engine'],
      commonVisual: { emojis: '🏍️🏍️🏍️', description: 'A heavy, powerful two-wheeled vehicle equipped with a loud exhaust engine.' },
      impostorVisual: { emojis: '🛴🛴🛴', description: 'A lightweight micro-vehicle with small wheels, steered with a tall handlebar.' },
      difficulty: 'easy'
    },
    {
      common: 'Rocket', impostor: 'Spaceship', hints: ['Vehicle', 'Space', 'Engine'],
      commonVisual: { emojis: '🚀🚀🔥', description: 'A vertical launch tube powered by chemical fuel to escape Earth gravity.' },
      impostorVisual: { emojis: '🛸🛸🛸', description: 'A fictional craft navigating interstellar space, carrying laser pods.' },
      difficulty: 'medium'
    },
    {
      common: 'Bus', impostor: 'Taxi', hints: ['Vehicle', 'Transit', 'Passenger'],
      commonVisual: { emojis: '🚌🚌🚌', description: 'A massive yellow mass transit vehicle dropping off dozens of commuters at stops.' },
      impostorVisual: { emojis: '🚕🚕🚕', description: 'A yellow sedan hired to drive individual passengers directly to their address.' },
      difficulty: 'easy'
    },
    {
      common: 'Hot Air Balloon', impostor: 'Glider', hints: ['Vehicle', 'Aviation', 'Wind'],
      commonVisual: { emojis: '🎈🧺🔥', description: 'A wicker basket suspended below a large fabric envelope inflated with burner flames.' },
      impostorVisual: { emojis: '🛩️🪶🏔️', description: 'A lightweight fixed-wing aircraft flying without any engine, riding wind drafts.' },
      difficulty: 'hard'
    }
  ],
  'Places (Landmarks & Locations)': [
    {
      common: 'Eiffel Tower', impostor: 'Pisa Tower', hints: ['Landmark', 'Europe', 'Tower'],
      commonVisual: { emojis: '🇫🇷🗼🥐', description: 'A massive iron lattice tower standing tall in Paris, France.' },
      impostorVisual: { emojis: '🇮🇹🏛️🗼', description: 'An ornate white marble bell tower in Italy, famous for its severe lean.' },
      difficulty: 'medium'
    },
    {
      common: 'Pyramids', impostor: 'Sphinx', hints: ['Landmark', 'Egypt', 'Sand'],
      commonVisual: { emojis: '🏜️🔺🐪', description: 'Huge triangular stone tombs built by pharaohs in Giza.' },
      impostorVisual: { emojis: '🦁🏜️👤', description: 'A colossal limestone statue showing a recumbent lion body with a human head.' },
      difficulty: 'medium'
    },
    {
      common: 'Castle', impostor: 'Palace', hints: ['Location', 'Royal', 'Defenses'],
      commonVisual: { emojis: '🏰🛡️⚔️', description: 'A fortified stone home fitted with battlements, drawbridges, and moats for siege defense.' },
      impostorVisual: { emojis: '🏛️👑⛲', description: 'A luxurious royal mansion featuring sprawling gardens, chandeliers, and no defensive walls.' },
      difficulty: 'hard'
    },
    {
      common: 'Museum', impostor: 'Art Gallery', hints: ['Location', 'Exhibits', 'Culture'],
      commonVisual: { emojis: '🏛️🦖🏺', description: 'A public building housing historical artifacts, dinosaur skeletons, and relics.' },
      impostorVisual: { emojis: '🖼️🎨🖌️', description: 'A quiet exhibition space where paintings and canvas pieces are hung for viewing.' },
      difficulty: 'hard'
    },
    {
      common: 'Zoo', impostor: 'Aquarium', hints: ['Location', 'Animals', 'Exhibits'],
      commonVisual: { emojis: '🦁🦒🐘', description: 'An outdoor park containing cages and enclosures displaying exotic land animals.' },
      impostorVisual: { emojis: '🐠🦈🌊', description: 'An indoor complex featuring massive glass tanks displaying ocean fish and sharks.' },
      difficulty: 'easy'
    },
    {
      common: 'Amusement Park', impostor: 'Water Park', hints: ['Location', 'Fun', 'Attractions'],
      commonVisual: { emojis: '🎡🎢🍿', description: 'A theme park packed with roller coasters, games, and candy shops.' },
      impostorVisual: { emojis: '🌊👙🛝', description: 'An outdoor park packed with water slides, wave pools, and lazy rivers.' },
      difficulty: 'easy'
    },
    {
      common: 'Supermarket', impostor: 'Mall', hints: ['Location', 'Shopping', 'Stores'],
      commonVisual: { emojis: '🛒🍎🥫', description: 'A large grocery store lined with carts, shelves of foods, and checkouts.' },
      impostorVisual: { emojis: '🛍️🏢🍿', description: 'A sprawling multi-story shopping complex packed with individual retail stores and food courts.' },
      difficulty: 'easy'
    },
    {
      common: 'Cinema', impostor: 'Theater', hints: ['Location', 'Entertainment', 'Show'],
      commonVisual: { emojis: '🍿🎬📺', description: 'A dark room showing recent movie releases on a massive screen with surround sound.' },
      impostorVisual: { emojis: '🎭🎭🎟️', description: 'A performance hall featuring live actors executing plays on a wooden stage.' },
      difficulty: 'medium'
    }
  ],
  'Video Games & Internet Culture': [
    {
      common: 'Minecraft', impostor: 'Roblox', hints: ['Game', 'Blocks', 'Platform'],
      commonVisual: { emojis: '🧱⛏️🟩', description: 'A pixelated survival game focused on mining blocks, crafting items, and building structures.' },
      impostorVisual: { emojis: '🪁🎮🧱', description: 'A massive online gaming platform where players design and play user-created games.' },
      difficulty: 'medium'
    },
    {
      common: 'Mario', impostor: 'Sonic', hints: ['Character', 'Gaming', 'Mascot'],
      commonVisual: { emojis: '🍄🧢🔧', description: 'A famous Italian plumber wearing a red cap, stomping on turtles in the Mushroom Kingdom.' },
      impostorVisual: { emojis: '🦔🌀⚡', description: 'A fast blue hedgehog who collects golden rings while sprinting through loops.' },
      difficulty: 'easy'
    },
    {
      common: 'TikTok', impostor: 'YouTube', hints: ['App', 'Social Media', 'Video'],
      commonVisual: { emojis: '🎵📱🌀', description: 'A social network famous for mobile-first vertical short videos and trends.' },
      impostorVisual: { emojis: '📺🟥▶️', description: 'The world\'s largest video sharing library hosting streams, vlogs, and tutorials.' },
      difficulty: 'easy'
    },
    {
      common: 'Meme', impostor: 'Emoji', hints: ['Web Culture', 'Communication', 'Visuals'],
      commonVisual: { emojis: '🐸🤪🖼️', description: 'A humorous image or caption combination that spreads rapidly across internet forums.' },
      impostorVisual: { emojis: '😀💩🔥', description: 'A set of standard icons embedded on keyboards to express emotions in chat.' },
      difficulty: 'medium'
    },
    {
      common: 'Fortnite', impostor: 'PUBG', hints: ['Game', 'Battle Royale', 'Shooter'],
      commonVisual: { emojis: '🛠️🔫🛡️', description: 'A vibrant battle royale shooter where players build wooden walls and dance.' },
      impostorVisual: { emojis: '🪂🍳🔫', description: 'A realistic battle royale game featuring military gear, supply drops, and frying pans.' },
      difficulty: 'medium'
    },
    {
      common: 'Discord', impostor: 'Skype', hints: ['App', 'Communication', 'Chat'],
      commonVisual: { emojis: '🎮💬🎧', description: 'A popular chat application for gamers featuring servers, channels, and game activity.' },
      impostorVisual: { emojis: '💬📞🔵', description: 'An older telecommunications program famous for its blue logo and ringtone sound.' },
      difficulty: 'medium'
    },
    {
      common: 'Pokémon', impostor: 'Digimon', hints: ['Franchise', 'Monsters', 'Evolution'],
      commonVisual: { emojis: '🔴⚡🐹', description: 'A monster-catching game where creatures are kept in red-and-white balls.' },
      impostorVisual: { emojis: '🦖👾🔋', description: 'An anime franchise where digital monsters evolve into heavily armed beasts inside screens.' },
      difficulty: 'hard'
    },
    {
      common: 'Streamer', impostor: 'YouTuber', hints: ['Career', 'Creator', 'Video'],
      commonVisual: { emojis: '🎮🎙️🚨', description: 'An online entertainer who broadcasts live video gameplay and chats with viewers in real time.' },
      impostorVisual: { emojis: '🟥🎬💻', description: 'A video creator who records, edits, and uploads files for on-demand streaming.' },
      difficulty: 'hard'
    }
  ],
  'Fantasy & Mythical Creatures': [
    {
      common: 'Dragon', impostor: 'Wyvern', hints: ['Monster', 'Fantasy', 'Wings'],
      commonVisual: { emojis: '🐉🔥🏰', description: 'A legendary massive winged reptile that breathes fire, possessing four legs and two wings.' },
      impostorVisual: { emojis: '🐉🧗🐉', description: 'A dragon-like creature featuring two wings which also function as its front legs.' },
      difficulty: 'hard'
    },
    {
      common: 'Elf', impostor: 'Dwarf', hints: ['Race', 'Fantasy', 'Lore'],
      commonVisual: { emojis: '🧝🏹🌲', description: 'A slender, long-lived fantasy race with pointed ears, famous for archery and forest homes.' },
      impostorVisual: { emojis: '🧔⛏️🍻', description: 'A short, muscular subterranean fantasy race with long beards, using battleaxes.' },
      difficulty: 'medium'
    },
    {
      common: 'Vampire', impostor: 'Werewolf', hints: ['Monster', 'Horror', 'Bite'],
      commonVisual: { emojis: '🧛🩸🦇', description: 'An undead immortal creature with fangs who drinks blood and avoids sunlight.' },
      impostorVisual: { emojis: '🐺🌕🐺', description: 'A human cursed to transform into a savage wolf monster under a full moon.' },
      difficulty: 'easy'
    },
    {
      common: 'Mermaid', impostor: 'Siren', hints: ['Monster', 'Ocean', 'Song'],
      commonVisual: { emojis: '🧜‍♀️🧜‍♂️🐠', description: 'A legendary aquatic creature with a human upper body and a fish tail.' },
      impostorVisual: { emojis: '🧜‍♀️💀🌊', description: 'A dangerous ocean beast that lures sailors to shipwreck by singing hypnotic melodies.' },
      difficulty: 'hard'
    },
    {
      common: 'Ghost', impostor: 'Zombie', hints: ['Monster', 'Undead', 'Spooky'],
      commonVisual: { emojis: '👻👻🏰', description: 'The translucent spirit of a deceased person haunting physical buildings.' },
      impostorVisual: { emojis: '🧟🧟🧠', description: 'A reanimated rotting corpse that walks slowly and eats human brains.' },
      difficulty: 'easy'
    },
    {
      common: 'Wizard', impostor: 'Witch', hints: ['Spellcaster', 'Magic', 'Staff'],
      commonVisual: { emojis: '🧙‍♂️🪄⚡', description: 'A magic user wearing long robes and a pointed hat, casting spells with a wand or staff.' },
      impostorVisual: { emojis: '🧹🧙‍♀️🐈‍⬛', description: 'A spellcaster brewing potions in cauldrons, riding flying brooms with black cats.' },
      difficulty: 'medium'
    },
    {
      common: 'Phoenix', impostor: 'Pegasus', hints: ['Creature', 'Flight', 'Mythical'],
      commonVisual: { emojis: '🔥🦅🔥', description: 'A mythical firebird that burns into ashes and is reborn in flames.' },
      impostorVisual: { emojis: '🐎🪶🐴', description: 'A legendary white horse equipped with massive bird-like wings.' },
      difficulty: 'medium'
    },
    {
      common: 'Goblin', impostor: 'Orc', hints: ['Race', 'Fantasy', 'Green'],
      commonVisual: { emojis: '👺🪙🎒', description: 'A small, greedy green-skinned fantasy creature obsessed with stealing gold coins.' },
      impostorVisual: { emojis: '👹👹🪓', description: 'A large, muscular green warrior race with tusks, carrying huge axes.' },
      difficulty: 'hard'
    }
  ]
};

/**
 * Gets a random word pair from the database for the given category list.
 * Supports a single category key or an array of category keys for multi-selection.
 * Filters by difficulty, using standard fallback checks.
 */
export function getRandomWordPair(
  categories: CategoryKey | CategoryKey[],
  difficulty: DifficultyKey = 'medium',
  customPool: WordPair[] = []
): { pair: WordPair; chosenCategory: Exclude<CategoryKey, 'Mixed'> } {
  
  // Convert to array if it is a single item
  const categoryList = Array.isArray(categories) ? categories : [categories];
  
  // Filter out 'Mixed' from candidate list, and if 'Mixed' is selected or list is empty, include all built-in categories
  let targetCategories = categoryList.filter(c => c !== 'Mixed');
  if (categoryList.includes('Mixed') || targetCategories.length === 0) {
    targetCategories = [
      'Animals', 'Food', 'Objects & Things', 'School & Learning', 'Silly & Random',
      'Geography (Countries & Cities)', 'Movies & TV', 'Music & Entertainment',
      'Sports & Games', 'Technology & Gadgets', 'Nature & Outdoors', 'Colors & Shapes',
      'Emotions & Feelings', 'Jobs & Professions', 'Vehicles & Transportation',
      'Places (Landmarks & Locations)', 'Video Games & Internet Culture', 'Fantasy & Mythical Creatures'
    ];
  }

  // Pick a random category from the target categories
  const chosenCategory = targetCategories[Math.floor(Math.random() * targetCategories.length)];

  if (chosenCategory === 'Custom') {
    if (customPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * customPool.length);
      return { pair: customPool[randomIndex], chosenCategory: 'Custom' };
    }
    // Fallback if custom pool is empty
    return { 
      pair: { 
        common: 'Pizza', 
        impostor: 'Burger', 
        hints: ['Fast Food', 'Cheesy', 'Takeout'],
        commonVisual: { emojis: '🍕🍕🧀', description: 'A flat circular baked dough topped with red tomato sauce, melted cheese, and pepperoni.' },
        impostorVisual: { emojis: '🍔🍔🍟', description: 'A round sandwich with a grilled meat patty, lettuce, cheese, placed inside sliced buns.' },
        difficulty: 'medium'
      }, 
      chosenCategory: 'Custom' 
    };
  }

  const list = wordDatabase[chosenCategory as Exclude<CategoryKey, 'Mixed' | 'Custom'>];
  
  // Filter list by selected difficulty level
  let filteredList = list.filter(pair => pair.difficulty === difficulty);
  
  // Fallback to full list if filter results are empty
  if (filteredList.length === 0) {
    filteredList = list;
  }

  const randomIndex = Math.floor(Math.random() * filteredList.length);
  return { pair: filteredList[randomIndex], chosenCategory: chosenCategory as Exclude<CategoryKey, 'Mixed'> };
}
export {};
