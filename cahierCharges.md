Gestionnaire de Créneaux Temporels

_Objectif:_ Développer un script en Node.js pour analyser et trouver des créneaux temporels spécifiques dans une période donnée, basé sur les entrées utilisateur.

_Environnement de Développement:_

- Langage de Programmation: Node.js
- Bibliothèques/Frameworks: Express.js (pour la gestion des requêtes, si nécessaire), Moment.js ou date-fns (pour la manipulation des dates)

_Fonctionnalités:_

1. _Entrée de Données:_

   - // Le script prendra l'input (un fichier CSV) en paramètre.
   - // Le format d'entrée exact et les spécifications devront être définies (par exemple, format de la date, structure des données).

2. _Traitement des Données:_

   - // Conversion des données d'entrée en un array d'objets pour faciliter la manipulation.
   - // Itération sur chaque objet de l'array pour l'analyse.

3. _Analyse de Durée:_

   - // Calcul de la durée entre deux dates spécifiées pour chaque objet.
   - Identification du milieu de cette période, en tenant compte des contraintes spécifiques (jours ouvrés, créneaux horaires) pour 30 minutes.
   - je trouve le milieu de la durée sur un jour ouvré pour un créneau de 30 mins le mardi/vendredi entre 12h et 14h ou entre 17h et 18h le mercredi
   - je trouve un créneau sur la période de fin entre 15 jours avant et 5 jours après pour 1 h le mardi/vendredi entre 12h et 14h ou entre 17h et 18h le mercredi
   - Identification d'un créneau dans la période de fin (15 jours avant jusqu'à 5 jours après la période spécifiée) pour une durée d'1 heure, en respectant les mêmes contraintes.

4. _Génération de Résultats:_
   - // Production d'un array d'objets en sortie.
   - /Chaque objet de l'array contiendra trois sous-objets correspondant à trois colonnes :
     //1. Première colonne : Contient un objet, un texte, et la date correspondant à la première date de la période.
   //  2. Deuxième colonne : Contient un objet, un texte, et la date correspondant au milieu de la période (jour ouvré).
   //  3. Troisième colonne : Contient un objet, un texte, et la date correspondant à la fin de la période (jour ouvré).

_Contraintes et Conditions:_

-// Les créneaux doivent être définis uniquement sur des jours ouvrés.
- // Les plages horaires acceptables sont mercredi/vendredi entre 12h et 14h, ou entre 17h et 18h le mercredi.
- Gestion des exceptions et des erreurs de format de données.

_Livraison:_

- Code source complet avec des commentaires explicatifs.
- Documentation détaillée incluant des instructions d'installation et d'utilisation.
- Exemples de données d'entrée et de sortie.

_Tests:_

- Tests unitaires pour valider chaque fonctionnalité.
- Tests d'intégration pour assurer le bon fonctionnement du script dans son ensemble.


-// je prends l'input en paramètre de mon script
- //je mets le cdv dans un array d'objet
- //je boucle dessus
- // j'analyse la durée entre les deux dates
- je trouve le milieu de la durée sur un jour ouvré pour un créneau de 30 mins le mardi/vendredi entre 12h et 14h ou entre 17h et 18h le mercredi
- je trouve un créneau sur la période de fin entre 15 jours avant et 5 jours après pour 1 h le mardi/vendredi entre 12h et 14h ou entre 17h et 18h le mercredi
- Je ressors un array d'objet avec un objet par ligne qui va contenir trois sous objets (un par email) 
1/ pour la première colonne qui va juste contenir un objet et un texte + la date (correspondant à la première date de la période)
2/ pour la deuxième colonne qui va contenir un objet et un texte + la date (correspondant à au milieu de la période jour ouvré)
3/ pour la deuxième colonne qui va contenir un objet et un texte + la date (correspondant à la fin de la période jour ouvré)