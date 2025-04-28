### create APP (option1)
npx create-react-app template_app --template typescript
cd template_app
npm install react-router-dom
npm install --save-dev @types/react-router-dom

### create APP (option2)
npm create vite@latest template_app -- --template react-ts
cd template_app
npm install react-router-dom
npm install --save-dev @types/react-router-dom

### Running the Development Server
> npm run dev



## Additional Tips
### 1- Global Installation (Optional): If you want Vite available globally:
> npm install -g vite

### 2- Keeping Vite Updated: To update Vite in an existing project
> npm update vite @vitejs/plugin-react

### 3- Troubleshooting: If you encounter issues, try:
```
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
