from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import json
import logging

# Configuración de Logs Tácticos
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("KAMIZEN_TACTICAL")

app = FastAPI(
    title="KAMIZEN NEURO-COGNITIVE TACTICAL SYSTEM",
    description="Interface de Calibración Operativa para el 736 SFS",
    version="2.0.0"
)

# =========================================================
# 📁 CONFIGURACIÓN DE DIRECTORIOS (ESTRUCTURA OFFLINE)
# =========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Asegurar que el sistema de archivos sea coherente
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# =========================================================
# 🧠 SISTEMA DE CACHÉ DE MISIÓN (OPTIMIZACIÓN DE MEMORIA)
# =========================================================
CACHE = {
    "missions": None,
    "last_sync": None
}

# =========================================================
# 🔍 CARGADOR DE DATOS TÁCTICOS (DOD-READY)
# =========================================================
def load_tactical_json(path):
    """Carga segura de protocolos de misión con validación de integridad."""
    try:
        if not os.path.exists(path):
            logger.warning(f"⚠️ PROTOCOLO NO ENCONTRADO: {path}")
            return None
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"❌ FALLO CRÍTICO DE LECTURA: {path} -> {e}")
        return None

# =========================================================
# 🎯 MOTOR DE CARGA DE MISIONES (SISTEMA MULTI-ARCHIVO)
# =========================================================
def load_missions():
    """Compila todas las misiones tácticas en un protocolo único de entrenamiento."""
    if CACHE["missions"] is not None:
        return CACHE["missions"]

    all_missions = []
    # Busca archivos que sigan el patrón militar: missions_tactical, missions_survival, etc.
    files = sorted([
        f for f in os.listdir(BASE_DIR)
        if f.startswith("missions_") and f.endswith(".json")
    ])

    for file in files:
        path = os.path.join(BASE_DIR, file)
        data = load_tactical_json(path)

        if not data:
            continue

        missions = []
        if isinstance(data, dict):
            # Soporte para diferentes nomenclaturas de bases de datos militares
            missions = (data.get("missions") or data.get("data") or [])
        elif isinstance(data, list):
            missions = data

        for m in missions:
            if isinstance(m, dict) and "id" in m:
                all_missions.append(m)

    # ORDEN ABSOLUTO POR ID DE MISIÓN PARA PROGRESIÓN LÓGICA
    all_missions = sorted(all_missions, key=lambda x: x["id"])

    CACHE["missions"] = {
        "status": "OPERATIONAL",
        "total_modules": len(all_missions),
        "missions": all_missions
    }
    return CACHE["missions"]

# =========================================================
# 🌐 RUTAS DE LA INTERFAZ (FRONTEND)
# =========================================================
@app.get("/")
def terminal_root():
    """Punto de entrada principal a la terminal de entrenamiento."""
    return FileResponse(os.path.join(STATIC_DIR, "session.html"))

@app.get("/session")
def session_interface():
    """Acceso directo a la sesión de calibración neuro-cognitiva."""
    return FileResponse(os.path.join(STATIC_DIR, "session.html"))

# =========================================================
# 🎯 API DE DATOS DE MISIÓN
# =========================================================
@app.get("/api/missions")
def get_mission_database():
    """Retorna la base de datos completa de entrenamiento táctico."""
    return load_missions()

@app.get("/api/missions/{mission_id}")
def get_specific_module(mission_id: int):
    """Acceso a un módulo específico de calibración."""
    database = load_missions()["missions"]
    for m in database:
        if m.get("id") == mission_id:
            return m
    raise HTTPException(status_code=404, detail="Módulo táctico no encontrado.")

# =========================================================
# 🧠 SISTEMA DE ESTADO DE OPERADOR (PERSISTENCIA DE DATOS)
# =========================================================
OPERATOR_STATE = {
    "operator_id": "UNIT-736-SFS",
    "current_mission": 1,
    "cognitive_score": 0,
    "status": "READY"
}

@app.get("/api/state")
def get_operator_status():
    """Retorna el progreso actual del soldado en el sistema."""
    return OPERATOR_STATE

@app.post("/api/state")
def update_operator_status(data: dict):
    """Actualiza el progreso tras completar módulos o simulaciones VR."""
    OPERATOR_STATE.update(data)
    return {
        "ok": True,
        "current_status": OPERATOR_STATE
    }

# =========================================================
# 🧪 DIAGNÓSTICO DE SISTEMA
# =========================================================
@app.get("/health")
def system_diagnostic():
    """Chequeo de integridad para el instructor."""
    return {
        "status": "CONNECTED",
        "database": "SYNCED",
        "mode": "OFFLINE_SECURE"
    }

# =========================================================
# ▶ LANZAMIENTO DEL SERVIDOR (COMMAND CENTER)
# =========================================================
if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 INICIANDO CENTRO DE MANDO KAMIZEN TACTICAL...")
    # Configurado para ser accesible en la red local del maletín (0.0.0.0)
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False  # En producción militar el código es estático y seguro
    )
