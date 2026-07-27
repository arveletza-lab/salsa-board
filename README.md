# Salsa Musicality Board

Board interactivo para visualizar y escuchar cómo encastran los instrumentos de la salsa
en el conteo On1 (paso 1-2-3, 5-6-7), sobre 2 compases de 4/4.

- **Filas por instrumento:** conteo, clave (2-3 / 3-2), campana, conga, bajo, piano, güiro.
- **Play / tempo ajustable / volumen** y toggles para prender y apagar cada instrumento.
- **Barra de pulsos** que marca el paso del tiempo (los 8 tiempos), y destello por golpe.
- Percusión con samples reales (clave, campana, conga, güiro); bajo y piano sintetizados.

## Estructura

```
index.html      Estructura
styles.css      Estilos
app.js          Lógica: grilla, secuenciador y audio (Web Audio API)
audio/          Samples .wav
```

## Correr localmente

Como usa `fetch` para cargar el audio, no alcanza con abrir el archivo directamente
(el navegador bloquea fetch en `file://`). Levantá un servidor local:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar en GitHub Pages

Push a `main` y activar Pages sirviendo desde la raíz de la rama `main`.

## Créditos de audio

Ver `audio/CREDITS.md`.
