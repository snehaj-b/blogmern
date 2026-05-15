# 📝 Blog Application — MERN Stack

A full-stack blog app where users can create, view, edit, and delete blog posts.

## Project Structure
```
blog-app/
├── backend/
│   ├── controllers/postController.js
│   ├── models/Post.js
│   ├── routes/postRoutes.js
│   ├── server.js
│   ├── .env              ← Set your MongoDB URI here
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env              ← Set your backend URL here
    └── package.json
```

## Setup & Run (Local)

### 1. Configure .env files

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/blogdb?retryWrites=true&w=majority
```

**frontend/.env**
```
REACT_APP_API_URL=http://52.66.208.72:5000/api
```

### 2. Run Backend
```bash
cd backend
npm install
npm run dev        # development (nodemon)
# OR
npm start          # production
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm start
```

App runs at: http://52.66.208.72:3000
API runs at: http://52.66.208.72:5000

## Features
- Create blog posts (title, author, category, content)
- View all posts (newest first)
- Edit existing posts
- Delete posts

## API Endpoints
| Method | Route            | Description       |
|--------|-----------------|-------------------|
| GET    | /api/posts       | Get all posts     |
| GET    | /api/posts/:id   | Get single post   |
| POST   | /api/posts       | Create post       |
| PUT    | /api/posts/:id   | Update post       |
| DELETE | /api/posts/:id   | Delete post       |

---

## AWS EC2 Deployment

### Step 1 — Launch EC2
- AMI: Ubuntu 22.04 LTS
- Instance type: t2.micro (free tier)
- Security Group inbound rules:
  - SSH: port 22
  - HTTP: port 80
  - Custom TCP: port 5000 (backend)
  - Custom TCP: port 3000 (frontend dev) or 80 (production build)

### Step 2 — Connect & Install Dependencies
```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install nginx (for serving frontend build)
sudo apt install nginx -y
```

### Step 3 — Deploy Backend
```bash
# Upload project (from your local machine)
scp -r -i your-key.pem blog-app ubuntu@<EC2_PUBLIC_IP>:/home/ubuntu/

# On EC2
cd /home/ubuntu/blog-app/backend
npm install
# Edit .env with your real MongoDB Atlas URI
nano .env

pm2 start server.js --name blog-backend
pm2 save
pm2 startup
```

### Step 4 — Build & Deploy Frontend
```bash
cd /home/ubuntu/blog-app/frontend
# Edit .env: set REACT_APP_API_URL=http://<EC2_PUBLIC_IP>:5000/api
nano .env
npm install
npm run build

# Serve with nginx
sudo cp -r build/* /var/www/html/
sudo systemctl restart nginx
```

### Step 5 — Update EC2 Security Group
Open ports 5000 (backend) and 80 (nginx frontend) in your EC2 security group inbound rules.

Access at: http://<EC2_PUBLIC_IP>
