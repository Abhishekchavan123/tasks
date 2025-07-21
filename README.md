# Task Manager CRUD with Supabase

A React-based Task Manager application with full CRUD (Create, Read, Update, Delete) functionality, integrated with Supabase for data persistence.

## Features

- ✅ Add new tasks with title and description
- ✅ View all tasks in a clean, dark-themed interface
- ✅ Edit existing tasks inline
- ✅ Delete tasks
- ✅ Real-time data persistence with Supabase
- ✅ Responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to the SQL Editor
3. Create the `tasks` table by running this SQL:

```sql
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
```

### 3. Configure Environment Variables

1. Copy the `env.example` file to `.env`:
```bash
cp env.example .env
```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the "Project URL" and "anon public" key

3. Update the `.env` file with your credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

The application uses a simple `tasks` table with the following structure:

- `id`: Primary key (auto-incrementing)
- `title`: Task title (required)
- `description`: Task description (required)
- `created_at`: Timestamp when the task was created
- `updated_at`: Timestamp when the task was last updated

## Technologies Used

- React 19
- Vite
- Supabase (PostgreSQL database)
- CSS3

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── supabase.js      # Supabase client configuration
└── index.css        # Global styles
```

## Features in Detail

### Adding Tasks
- Enter a title and description in the input fields
- Click "Add Task" to save to Supabase
- Tasks are displayed in reverse chronological order

### Editing Tasks
- Click the "Edit" button on any task
- Modify the title and/or description
- Click "Save" to update in Supabase or "Cancel" to discard changes

### Deleting Tasks
- Click the "Delete" button on any task
- The task is immediately removed from both the UI and Supabase

### Data Persistence
- All operations are synchronized with Supabase in real-time
- Tasks persist between browser sessions
- Loading states are handled gracefully
