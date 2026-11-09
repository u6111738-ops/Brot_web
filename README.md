# BROT · Un univers Yayoi Kusama

Lliurable 2 — creació col·lectiva. Web interactiva on cada sala fa viure un concepte de Kusama a través d'un gest repetit.

## Com obrir-la
Obre `index.html` amb qualsevol navegador (Chrome recomanat). No cal instal·lar res.
Per publicar-la: puja la carpeta sencera a GitHub Pages, Netlify Drop o Vercel.

## Estructura
```
index.html      contingut i estructura de les sales
css/style.css   sistema visual (colors, tipografia, composició de cada sala)
js/main.js      totes les interaccions (canvas 2D + Web Audio, sense llibreries)
```

## Sales i concepte
| Sala | Concepte | Gest | Tècnica |
|---|---|---|---|
| Portada | Repetició | moure el cursor | graella de punts reactiva |
| La pregunta | Repetició → acumulació | clicar | cada clic duplica tots els punts (1 → 4.096) |
| Repetició | Repetició, infinit | arrossegar | llaçades estampades al llarg del traç, capes successives |
| Acumulació | Acumulació, cos i objecte | clicar / mantenir | partícules amb atracció al centre i repulsió entre elles |
| Infinit | Infinit, immersió | moure el cap | 36 llums en 3D reflectits en una graella de miralls (7×3×7) |
| Dissolució del jo | Dissolució del jo | escriure + moure | el nom es mostreja en punts i el patró l'omple fins a fer-lo desaparèixer |
| Ritual | Obsessió i ritual | tocar / espai | bucle sonor de 6 s amb Web Audio que repeteix cada toc |
| Cicle vital | Cicle vital i naturalesa | plantar | creixement ramificat, floració, caiguda de llavors, descomposició |

Tot el recorregut compta els gestos de l'usuari i deixa un punt per gest sobre tota la pàgina (el "rastre").

## Fonts
Unbounded, Hanken Grotesk i Martian Mono (Google Fonts).
