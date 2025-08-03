require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./models/Role');
const Genre = require('./models/Genre');
const Movie = require('./models/Movie');
const User = require('./models/User');
const { connectDB } = require('./config/db');

// Default roles data
const defaultRoles = [
  {
    name: 'client',
    description: 'Regular user with basic permissions',
    permissions: ['read']
  },
  {
    name: 'admin',
    description: 'Administrator with elevated permissions',
    permissions: ['read', 'write', 'delete']
  },
  {
    name: 'super-admin',
    description: 'Super administrator with all permissions',
    permissions: ['read', 'write', 'delete', 'admin']
  }
];

// Default genres data
const defaultGenres = [
  { name: 'Action', description: 'High-energy films with exciting sequences', color: '#EF4444' },
  { name: 'Adventure', description: 'Stories of exciting journeys and exploration', color: '#F59E0B' },
  { name: 'Comedy', description: 'Films intended to make audiences laugh', color: '#10B981' },
  { name: 'Drama', description: 'Serious stories focusing on character development', color: '#3B82F6' },
  { name: 'Fantasy', description: 'Films with magical or supernatural elements', color: '#8B5CF6' },
  { name: 'Horror', description: 'Films designed to frighten and create suspense', color: '#1F2937' },
  { name: 'Mystery', description: 'Films involving puzzles and unsolved cases', color: '#6B7280' },
  { name: 'Romance', description: 'Stories centered around love relationships', color: '#EC4899' },
  { name: 'Sci-Fi', description: 'Science fiction films set in the future', color: '#06B6D4' },
  { name: 'Thriller', description: 'Suspenseful films that keep audiences on edge', color: '#DC2626' },
  { name: 'Western', description: 'Films set in the American Old West', color: '#92400E' },
  { name: 'Animation', description: 'Films created using animation techniques', color: '#F97316' },
  { name: 'Documentary', description: 'Non-fiction films about real events', color: '#059669' },
  { name: 'Musical', description: 'Films featuring songs and dance numbers', color: '#7C3AED' },
  { name: 'War', description: 'Films depicting military conflicts', color: '#374151' },
  { name: 'Crime', description: 'Films involving criminal activity', color: '#991B1B' },
  { name: 'Biography', description: 'Films based on real people lives', color: '#0F766E' },
  { name: 'Family', description: 'Films suitable for all family members', color: '#059669' },
  { name: 'Sport', description: 'Films centered around sports', color: '#EA580C' }
];

// Sample users data
const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@scydb.com',
    password: 'admin123',
    passwordConfirm: 'admin123',
    role: 'admin'
  },
  {
    name: 'Super Admin',
    email: 'superadmin@scydb.com',
    password: 'superadmin123',
    passwordConfirm: 'superadmin123',
    role: 'super-admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'client'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'client'
  }
];

// Movies data
const defaultMovies = [
  {
    title: 'The Dark Knight',
    year: 2008,
    duration: 152,
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY'
  },
  {
    title: 'Inception',
    year: 2010,
    duration: 148,
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'],
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into a CEO mind.',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
  },
  {
    title: 'The Shawshank Redemption',
    year: 1994,
    duration: 142,
    genre: ['Drama'],
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton', 'William Sadler'],
    description: 'Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency.',
    poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg',
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco'
  },
  {
    title: 'Pulp Fiction',
    year: 1994,
    duration: 154,
    genre: ['Crime', 'Drama'],
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson', 'Bruce Willis'],
    description: 'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    trailer: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY'
  },
  {
    title: 'Forrest Gump',
    year: 1994,
    duration: 142,
    genre: ['Drama', 'Romance'],
    director: 'Robert Zemeckis',
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise', 'Sally Field'],
    description: 'The presidencies of Kennedy and Johnson, Vietnam War, and other events unfold from the perspective of an Alabama man.',
    poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg',
    trailer: 'https://www.youtube.com/watch?v=bLvqoHBptjg'
  },
  {
    title: 'The Matrix',
    year: 1999,
    duration: 136,
    genre: ['Action', 'Sci-Fi'],
    director: 'Lana Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'],
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against controllers.',
    poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
    trailer: 'https://www.youtube.com/watch?v=vKQi3bBA1y8'
  },
  {
    title: 'Goodfellas',
    year: 1990,
    duration: 146,
    genre: ['Biography', 'Crime', 'Drama'],
    director: 'Martin Scorsese',
    cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci', 'Lorraine Bracco'],
    description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill.',
    poster: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/sw7mordbZxgITU877yTpOfsfgRo.jpg',
    trailer: 'https://www.youtube.com/watch?v=2ilzidi_J8Q'
  },
  {
    title: 'The Godfather',
    year: 1972,
    duration: 175,
    genre: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan', 'Diane Keaton'],
    description: 'The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.',
    poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    trailer: 'https://www.youtube.com/watch?v=sY1S34973zA'
  },
  {
    title: 'Interstellar',
    year: 2014,
    duration: 169,
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E'
  },
  {
    title: 'Fight Club',
    year: 1999,
    duration: 139,
    genre: ['Drama'],
    director: 'David Fincher',
    cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter', 'Meat Loaf'],
    description: 'An insomniac office worker and a soap salesman build a global organization to help vent male aggression.',
    poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
    trailer: 'https://www.youtube.com/watch?v=qtRKdVHc-cE'
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
    duration: 178,
    genre: ['Adventure', 'Drama', 'Fantasy'],
    director: 'Peter Jackson',
    cast: ['Elijah Wood', 'Ian McKellen', 'Orlando Bloom', 'Sean Bean'],
    description: 'A meek Hobbit and eight companions set out to destroy the One Ring and save Middle-earth from the Dark Lord.',
    poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/56zTpe2xvaA4alU51sRWPoKPYZy.jpg',
    trailer: 'https://www.youtube.com/watch?v=V75dMMIW2B4'
  },
  {
    title: 'Star Wars: A New Hope',
    year: 1977,
    duration: 121,
    genre: ['Adventure', 'Fantasy', 'Sci-Fi'],
    director: 'George Lucas',
    cast: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher', 'Alec Guinness'],
    description: 'Luke Skywalker joins forces with a Jedi Knight to rescue a rebel princess and save the galaxy.',
    poster: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/4iK6fPaxaKfV1og7O7JZwdBUL8n.jpg',
    trailer: 'https://www.youtube.com/watch?v=vZ734NWnAHA'
  },
  {
    title: 'Avengers: Endgame',
    year: 2019,
    duration: 181,
    genre: ['Action', 'Adventure', 'Drama'],
    director: 'Anthony Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
    description: 'After devastating events, the Avengers assemble once more to reverse Thanos actions and restore balance.',
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c'
  },
  {
    title: 'Parasite',
    year: 2019,
    duration: 132,
    genre: ['Comedy', 'Drama', 'Thriller'],
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    description: 'Greed and class discrimination threaten the relationship between the wealthy Park family and the destitute Kim clan.',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoHshkBcQZzr.jpg',
    trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY'
  },
  {
    title: 'Spider-Man: No Way Home',
    year: 2021,
    duration: 148,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Jon Watts',
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon'],
    description: 'With Spider-Man identity revealed, Peter asks Doctor Strange for help, but dangerous foes from other worlds appear.',
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
    trailer: 'https://www.youtube.com/watch?v=JfVOs4VSpmA'
  }
];

// Import data function
const importData = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await Promise.all([
      Role.deleteMany({}),
      Genre.deleteMany({}),
      Movie.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Import all data
    const [roles, genres, users, movies] = await Promise.all([
      Role.create(defaultRoles),
      Genre.create(defaultGenres),
      User.create(defaultUsers),
      Movie.create(defaultMovies)
    ]);

    console.log(`✅ Import completed successfully!`);
    console.log(`   • ${roles.length} Roles`);
    console.log(`   • ${genres.length} Genres`);
    console.log(`   • ${users.length} Users`);
    console.log(`   • ${movies.length} Movies`);
    
    console.log('\n🔐 Default accounts:');
    console.log('   Super Admin: superadmin@scydb.com / superadmin123');
    console.log('   Admin: admin@scydb.com / admin123');
    console.log('   Client: john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error.message);
    process.exit(1);
  }
};

// Delete data function
const deleteData = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    await Promise.all([
      Role.deleteMany({}),
      Genre.deleteMany({}),
      Movie.deleteMany({}),
      User.deleteMany({})
    ]);

    console.log('✅ All data deleted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting data:', error.message);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Please specify --import or --delete');
  console.log('Usage: node seeder.js --import');
  console.log('Usage: node seeder.js --delete');
  process.exit(0);
}