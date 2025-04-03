
## **Steps to Clone, Build, and Run the Project**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/EkeminiThompson/ecommerce
cd closet-cater
```

---

### **2️⃣ Install Dependencies**  
```sh
npm run install-all
```

---

### **3️⃣ Build the Frontend**  
```sh
cd frontend
npm run build
```

---

### **4️⃣ Start the Backend (Production Mode)**  
```sh
cd ../backend
NODE_ENV=production node server.js
```

---

### **5️⃣ Serve the Frontend Build**  
Use `serve` to serve the built frontend files.  
```sh
cd ../frontend
npm install -g serve
serve -s build
```

> **Now, the app will be available on `http://localhost:3000` (or another port as shown).**  

🚀