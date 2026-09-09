"""
api/ai_advisor.py - Versión empaquetada para Vercel Serverless
Motor de Inteligencia Artificial para ÁUREA Atelier Joyería
"""
import sys
import os

# Importar la implementación central o definirla
CURRENT_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.dirname(CURRENT_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

try:
    from ai_advisor import process_chat_message, JEWELRY_SYSTEM_PROMPT, is_off_topic
except ImportError:
    # Si por alguna razón la ruta raíz no se resolvió en Lambda, cargamos localmente
    sys.path.insert(0, CURRENT_DIR)
    import ai_advisor
    process_chat_message = ai_advisor.process_chat_message
    JEWELRY_SYSTEM_PROMPT = ai_advisor.JEWELRY_SYSTEM_PROMPT
    is_off_topic = ai_advisor.is_off_topic
