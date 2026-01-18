# How to Run the E-Commerce Project

You need **two terminals**: one for the **backend** (Django) and one for the **frontend** (React/Vite).

---

## 1. Backend (Django API)

### First-time setup

```powershell
cd "e:\Course Project\AMIT Full Stack E-Commerce Project\backenddd"

# Create a virtual environment (recommended)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run migrations (creates the SQLite database)
python manage.py migrate

# Optional: create a superuser to add products via admin
# python manage.py createsuperuser
```

### Run the backend server

```powershell
cd "e:\Course Project\AMIT Full Stack E-Commerce Project\backenddd"
.\.venv\Scripts\Activate.ps1   # if using venv
python manage.py runserver
```

- API: **http://127.0.0.1:8000/api/**
- Admin: **http://127.0.0.1:8000/admin/** (after `createsuperuser`)

---

## 2. Frontend (React + Vite)

### First-time setup

```powershell
cd "e:\Course Project\AMIT Full Stack E-Commerce Project\frontend"
npm install
```

### Run the frontend dev server

```powershell
cd "e:\Course Project\AMIT Full Stack E-Commerce Project\frontend"
npm run dev
```

- App: **http://localhost:5173/** (or the URL shown in the terminal)

---

## 3. Use the app

1. Start **backend** first (`python manage.py runserver`).
2. Start **frontend** (`npm run dev`).
3. Open **http://localhost:5173** in your browser.

**If there are no products:**

- Go to **http://127.0.0.1:8000/admin/**
- Log in with the superuser from `createsuperuser`
- Add products in the **Products** section (each product needs a **seller** = a user).

**How to log in:**

1. **Register first:** open **Register**, enter username, email, password, and submit.
2. **Log in:** open **Login**, enter the **same username and password** you used to register, and submit.
3. The navbar should show “Hi, *username*” after a successful login.

**If login fails:**

- **“Cannot reach server”** → Start the **backend** (`python manage.py runserver`) and ensure it is running at **http://127.0.0.1:8000**.
- **“Invalid username or password”** → Register a new account first, or check that you use the correct username and password (password is case-sensitive).
- The API uses JWT; the frontend saves the token and sends it with requests.
