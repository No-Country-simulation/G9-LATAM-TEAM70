#!/usr/bin/env python3
"""
Script de predicción para cargar modelo .pkl y clasificar contenido técnico.
Este script es llamado desde la aplicación Java Spring Boot.
"""

import sys
import json
import argparse
import pickle
import os


def load_model(model_path, vectorizer_path):
    """Carga el modelo y vectorizador desde archivos .pkl"""
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    
    with open(vectorizer_path, 'rb') as f:
        vectorizer = pickle.load(f)
    
    return model, vectorizer


def preprocess_text(text):
    """Preprocesa el texto de entrada"""
    if not text:
        return ""
    import re
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text


def predict_category(model, vectorizer, titulo, texto):
    """Predice la categoría del contenido"""
    # Combinar título y texto
    combined = titulo + ' ' + texto
    processed = preprocess_text(combined)
    
    # Vectorizar
    X = vectorizer.transform([processed])
    
    # Predecir
    categoria = model.predict(X)[0]
    
    # Obtener probabilidades
    probabilidades = model.predict_proba(X)[0]
    probabilidad = float(probabilidades.max())
    
    # Obtener todas las clases y sus probabilidades
    clases = model.classes_
    prob_dict = {clases[i]: float(probabilidades[i]) for i in range(len(clases))}
    
    # Extraer palabras clave importantes (top features del TF-IDF)
    feature_names = vectorizer.get_feature_names_out()
    tfidf_scores = X.toarray()[0]
    
    # Top 5 características
    top_indices = tfidf_scores.argsort()[-5:][::-1]
    palabras_clave = [feature_names[i] for i in top_indices if tfidf_scores[i] > 0]
    
    # Capitalizar palabras clave
    palabras_clave = [p.capitalize() for p in palabras_clave[:3]]
    
    return {
        "categoria": categoria,
        "probabilidad": round(probabilidad, 4),
        "informacion_adicional": palabras_clave if palabras_clave else ["Tecnología", "Programación"],
        "modelo_utilizado": "TF-IDF + LogisticRegression",
        "todas_probabilidades": {k: round(v, 4) for k, v in sorted(prob_dict.items(), key=lambda x: x[1], reverse=True)}
    }


def main():
    parser = argparse.ArgumentParser(description='Clasificador de contenido técnico usando modelo .pkl')
    parser.add_argument('--model', required=True, help='Ruta al archivo modelo.pkl')
    parser.add_argument('--vectorizer', required=True, help='Ruta al archivo vectorizer.pkl')
    parser.add_argument('--input', required=True, help='JSON con titulo y texto')
    
    args = parser.parse_args()
    
    # Verificar que existen los archivos
    if not os.path.exists(args.model):
        print(json.dumps({"error": f"Modelo no encontrado: {args.model}"}), file=sys.stderr)
        sys.exit(1)
    
    if not os.path.exists(args.vectorizer):
        print(json.dumps({"error": f"Vectorizador no encontrado: {args.vectorizer}"}), file=sys.stderr)
        sys.exit(1)
    
    try:
        # Cargar modelo
        model, vectorizer = load_model(args.model, args.vectorizer)
        
        # Parsear input
        input_data = json.loads(args.input)
        titulo = input_data.get('titulo', '')
        texto = input_data.get('texto', '')
        
        # Predecir
        result = predict_category(model, vectorizer, titulo, texto)
        
        # Output JSON
        print(json.dumps(result, ensure_ascii=False))
        
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"JSON inválido: {str(e)}"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Error en predicción: {str(e)}"}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()