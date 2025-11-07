# Proyecto Web
Este proyecto se basa en la tienda de café que se dio de ejemplo.
Se implementaron estilos, funcionalidades y base de datos para guardar contactos y cargar productos. 

## Base de datos 
- Para esto se utiliza MongoDB. 
- Cuando se registra una carga en el newsletter o un contacto, se guardan en la BD. 

## Script de inicio 
1) npm install (para descargar dependencias de node y mongo)
2) node server/server.js (desde la raíz del proyecto)

## IMPORTANTE 
- Revisar que exista el archivo .env en la base del proyecto, con el siguiente contenido. 

MONGODB_URI="mongodb://localhost:27017/webcafe"
PORT=3000
NODE_ENV=development