# Full-Stack Todo List Application - Frontend

## Overview
The application provides a clean table-based interface for creating, editing, and deleting tasks.

## Prerequisite
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)
- Git

## Instalation and Local SetUp

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd full-stack-To-Do-List-application-Frontend
```

### 2. Navigate to Frontend Directory
```bash
cd todo-frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Install Angular CLI (if not installed)
```bash
npm install -g @angular/cli
```

### 5. Start Development Server
```bash
ng serve
```

### 6. Access Application
Open your browser and navigate to:
```
http://localhost:4200
```

## Google Cloud Platform (GCP) Deployment

### Prerequisites for GCP Deployment
- Google Cloud account
- Google Cloud SDK installed
- Project created in GCP Console

### Step 1: Prepare Application for Production
```bash
# Build for production
ng build --prod
```

### Step 2: Create App Engine Configuration
Create `app.yaml` in the root directory:
```yaml
runtime: nodejs18

handlers:
- url: /.*
  static_files: dist/todo-frontend/index.html
  upload: dist/todo-frontend/index.html

- url: /
  static_dir: dist/todo-frontend
```

### Step 3: Deploy to App Engine
```bash
# Initialize gcloud (if first time)
gcloud init

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Deploy application
gcloud app deploy

# View deployed application
gcloud app browse
```

### Alternative: Deploy to Cloud Storage + CDN
```bash
# Create storage bucket
gsutil mb gs://your-todo-app-bucket

# Upload build files
gsutil -m cp -r dist/todo-frontend/* gs://your-todo-app-bucket

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://your-todo-app-bucket

# Enable website configuration
gsutil web set -m index.html -e 404.html gs://your-todo-app-bucket
```

## Application Usage Guide

### Geting Started
1. **Access the Application**: Open the URL in your browser
2. **View Interface**: You'll see a clean table-based todo list interface

