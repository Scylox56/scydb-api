require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./models/Role');
const Genre = require('./models/Genre');
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
  { name: 'War', description: 'Films depicting military conflicts', color: '#374151' }
];

// Import data
const importData = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to database');

    // Clear existing data
    await Role.deleteMany();
    await Genre.deleteMany();
    console.log('🗑️  Cleared existing roles and genres');

    // Import roles
    await Role.create(defaultRoles);
    console.log('👥 Default roles imported successfully');

    // Import genres
    await Genre.create(defaultGenres);
    console.log('🎬 Default genres imported successfully');

    console.log('✅ Data import completed successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to database');

    await Role.deleteMany();
    await Genre.deleteMany();
    console.log('🗑️  All roles and genres deleted successfully');

    process.exit();
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Please specify --import or --delete');
  console.log('Usage: node seeder.js --import');
  console.log('Usage: node seeder.js --delete');
  process.exit();
}