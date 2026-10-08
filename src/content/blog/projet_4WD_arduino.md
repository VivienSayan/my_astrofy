---
title: "Robot différentiel 4WD - Arduino"
description: "Présentation du robot 4WD différentiel de Freenove."
pubDate: "Oct 08 2026"
heroImage: "/freenove_4WD_car_arduino.jpeg"
# badge: "Demo badge"
tags: ["robotique","Freenove","Arduino","C++"]
---

## Motivation

J'ai découvert les robots montables de [Freenove](https://freenove.com/) depuis que mes anciens collègues de thèse m’ont offert l’un de ces produits pour mon pot de départ de fin de soutenance. Il s’agissait d’un hexapode contrôlé via Raspberry Pi. Je leur suis reconnaissant de ce cadeau car je n’ai jamais réellement eu d’expérience avec l’électronique embarquée avant ce jour. Dans tous mes projets robotiques passés, il s’agissait surtout de faire du MIL (Model-In-the-Loop) ou du SIL (Software-In-the-Loop). Aujourd’hui, je souhaite grandement me familiariser avec de vrais systèmes complets et combler certaines de mes lacunes, notemment en terme de hardware et de software embarqué. Je n’avais jamais touché à une Raspberry Pi avant, donc j’ai pris pas mal de temps à lire le tuto, à configurer la Raspi correctement pour l’hexapode et à me familiariser avec la terminologie, l’architecture logicielle, etc. À l’heure qu’il est, j’ai à peine touché en profondeur le système tellement il y a de choses à faire. 

Ce blog post marque le début de mon voyage vers le prototypage sur plateforme réelle. Je ferais sûrement des erreurs, je n'aurais même probablement pas envie de documenter et commenter chacune de mes avancées à chaque fois, mais je compte y aller à mon rythme, pas à pas, en commençant simplement.

## Le 4WD

J’ai remarqué que Freenove proposait des robots contrôlables via Arduino (dont j’étais déjà familier avant). J’ai donc privilégié dans un premier temps un modèle de [véhicule différentiel à quatre roues](https://store.freenove.com/products/fnk0041?srsltid=AU7gw4USdoWXXRZZ5dsbHWfrusxBGv8bsHj66WLuwJv3PNfQGA01otm1) pour me faire la main sur un système plus simple et pourquoi pas tenter d’y intégrer mes propres modules sans trop me casser la tête avec l’architecture logiciel.

Je présente ici mes avancements sur ce projet. À savoir que tout a pratiquement déjà été fait par Freenove, avec des sketchs Arduino disponibles au GitHub suivant : [Freenove_4WD_Car_Kit](https://github.com/Freenove/Freenove_4WD_Car_Kit). Le robot est commandable via télécommande infrarouge (IR_remote), radiofréquence (RF remote) et Bluetooth (depuis le smartphone). Il dispose d’un buzzer, de LEDs RGB, d’un capteur de distance à ultrasons (HC-SR04) et de trois capteurs optiques réfléchissants pour faire du suivi de ligne (Fig. 1).

<figure>
  <img src="/4WD_sensor_suite.png" />
  <figcaption>Figure 1 — Suite de capteurs fournit dans le kit.</figcaption>
</figure>

## 1ers tests

La première chose que j’ai voulu tester était de voir si le modèle cinématique différentiel [(obtenu ici)](http://localhost:4321/blog/cinmatique-dun-robot-diffrentiel) pouvait permettre de contrôler le robot via une consigne de vitesse. C’est-à-dire utiliser les expressions suivantes :

$\dot{\phi}_{g} = \frac{2v_x - \omega D}{2r}$

$\dot{\phi}_{d} = \frac{2v_x + \omega D}{2r}$

pour envoyer les consignes moteurs qui respectent les vitesses linéaire $v_x$ et angulaire $\omega$ imposées. Bien entendu, je ne m’attends pas à ce que cela soit exact, car ce modèle cinématique n’est qu’une approximation de la cinématique réelle du robot, sachant d’autant plus que les hypothèses de contact (i.e. pas de dérapage, pas de glissement) ne sont pas respectées dans la réalité.

Dans la vidéo ci-dessous, j’ai implémenté les expressions ci-dessus (avec $D$ = 12.75cm et $r$ = 3.3 cm) et programmé la carte Arduino de sorte que le robot fasse un bouclage rectangulaire, en prenant bien soin de convertir les valeurs de vitesse de rotation des roues en valeurs PWM pour l’Arduino.

[Voir le code utilisé (pdf)](/Code_Car_Move_and_Turn_modified.pdf) 

Pour la première longueur, j’ai donné comme consigne une vitesse linéaire de $v_x$ = 0.5 m/s pendant 1 seconde, si bien que le centre du robot aurait dû avancer de 0.5 mètre. À vrai dire, ce n’est pas trop le cas : à vue d’œil, j’ai pu observer un écart de 20 cm à cause de l’inertie du corps au moment de l’arrêt des moteurs. En soi, observer le comportement durant 1 seconde n’est pas suffisant pour conclure quoi que ce soit, mais on peut observer après plusieurs essais que commander le robot linéairement uniquement est robuste, car la distance d’arrêt est la même à chaque fois. De plus, on respecte les échelles car une vitesse linéaire $v_x$ = 1 m/s double effectivement la distance parcourue.

<video controls width="100%">
  <source src="/Freenove_4WD_carre.mov" type="video/mp4">
</video>

Cependant, on ne peut pas en dire autant lorsqu’on tente de faire tourner le robot. Sur la vidéo, j’ai fait en sorte de faire pivoter le robot de 90° pour chaque coin du rectangle. Pour cela, j'ai dû commettre une première « tricherie » : au lieu de donner la consigne $\omega$ = -$\pi$/2 rad/s, j’ai dû l’augmenter d’un facteur 4.285 afin de mettre suffisamment de couple sur les moteurs pour contrebalancer les frottements et faire tourner le robot effectivement de 90° vers la droite, montrant encore une fois qu’utiliser ce modèle cinématique pour un robot quatre roues peut nous jouer des tours (sans mauvais jeu de mots). À la fin de la vidéo, on atterrit bien sur la position initiale (à quelques centimètres près) mais cela a très bien pu être un coup de chance. En effet, un autre essai (vidéo ci-dessous) montre le décalage final (plus d’une dizaine de centimètres) qu’il peut y avoir à cause des rotations imparfaites dues aux contacts des roues contre le sol.

<video controls width="100%">
  <source src="/Freenove_4WD_carre_imparfait.mov" type="video/mp4">
</video>

Ces expériences montrent bien les limites de ce modèle cinématique face aux aléas du réel.

<!-- <iframe
  src="/Code_Car_Move_and_Turn_modified.pdf"
  width="100%"
  height="800px"
  style="border: none;"
>
</iframe> -->