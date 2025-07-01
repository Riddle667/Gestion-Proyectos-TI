# 🧾 Sistema de Gestión de Documentos Montecristo

Este proyecto es una aplicación de escritorio construida con **Electron** y **Vite**, diseñada para gestionar documentos administrativos como facturas, órdenes de compra y guías de despacho. La app funciona con una base de datos **local (SQLite)** y puede sincronizar datos hacia y desde una base de datos **remota (MySQL)**.

---

## 🚀 Características

- Gestión de:
  - Facturas (`Invoice`)
  - Órdenes de compra (`PurchaseOrder`)
  - Guías de despacho (`DispatchGuide`)
  - Usuarios (`User`)
- Base de datos **local** en SQLite (`better-sqlite3`)
- Base de datos **en la nube** (MySQL)
- **Sincronización** de datos en ambas direcciones (local ↔ nube)
- CRUD completo mediante **IPC**
- Autenticación de usuarios
- Empaquetado modular con **Vite**

---

## 🛠️ Tecnologías Utilizadas

| Tecnología                | Descripción                                      |
|---------------------------|--------------------------------------------------|
| Electron                  | Entorno para construir aplicaciones de escritorio|
| Vite                      | Empaquetador y entorno de desarrollo             |
| SQLite (`better-sqlite3`) | Base de datos local ultrarrápida                 |
| MySQL (`mysql2/promise`)  | Base de datos remota                             |
| IPC (`ipcMain`)           | Comunicación entre procesos en Electron          |
| JavaScript (ESM)          | Uso de módulos modernos (`import/export`)        |

---

## 🔐 Seguridad y privacidad

Este software está diseñado para ejecutarse **de forma local**, con **respaldo manual en la nube**, asegurando la disponibilidad y confidencialidad de los datos financieros de la empresa Monte Cristo.


..




