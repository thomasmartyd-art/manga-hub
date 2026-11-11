# MANGA HUB

Application mobile iOS / Android construite avec Expo et React Native.

## Première version de l'application
- Interface mobile sombre avec accents violets
- Accueil et catalogue de démonstration
- Recherche par titre et genre
- Fiches manga avec synopsis
- Bibliothèque personnelle
- Suivi manuel du dernier chapitre lu
- Sauvegarde locale de la bibliothèque sur l'appareil

## Technologies
- Expo SDK 54
- React Native 0.81
- React 19
- AsyncStorage pour conserver les données localement
- EAS Build configuré dans `eas.json`

## Lancer le projet
Le projet doit être ouvert dans un environnement disposant de Node.js et des outils Expo :
1. `npm install`
2. `npx expo start`
3. Ouvrir le projet dans Expo Go, ou utiliser EAS Build pour produire une application native.

## État et limites
Cette version est une première base de développement, pas encore une application publiée ni un fichier iPhone installable. Les titres, nombres de chapitres et statuts sont des données de démonstration à vérifier. Les visuels de couverture sont temporaires. Il n'y a pas encore de compte utilisateur, de synchronisation cloud, de flux de nouveautés en direct ni de liens de lecture vérifiés. Aucun scan ou chapitre protégé n'est hébergé.

## Prochaines étapes
- Valider l'exécution du projet sur Expo Go
- Ajouter des couvertures et métadonnées provenant de sources autorisées
- Ajouter des liens officiels de lecture, vérifiés par pays
- Mettre en place comptes et synchronisation cloud
- Ajouter un système de propositions communautaires avec modération
- Préparer et tester la distribution iOS et Android