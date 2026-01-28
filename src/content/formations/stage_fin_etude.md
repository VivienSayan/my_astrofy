---
title: "Stage de fin d'étude"
description: "À propos de mon stage de fin d'étude au CEA"
pubDate: "Feb 01 2022"
heroImage: "/Jackal.jpg"
tags: ["Robotique","Master","Stage","Gazebo","ROS","C++"]
---

### Période
Du 01 Février 2022 au 31 Juillet 2022

### Résumé
L'objectif du stage était d'étudier la possibilité de **commander** de manière autonome un **robot à roues**, de type skid-steering, dans une **canalisation cylindrique**. Ce projet s'inscrivait dans un contexte d'inspection de tuyau nucléaire, dans le cadre des activités du **Commissariat à l'Energie Atomique** (CEA). 

La 1ère partie du stage fut la réalisation d'une **étude bibliographique** concernant les différentes méthodes d'asservissement de robots mobiles dans des canalisations cylindriques. À l'issue de cet état de l'art, le reste du stage devait se porter sur **l'implémentation et la validation d'une ou deux méthodes** de loi de commande sur le robot *"Jackal"* de la société ClearPath Robotics. Le robot Jackal avait l'avantage de fournir un **environnement ROS** intégré dans son système, ce qui a facilité la mise en place des méthodes.

Avant de tester et valider les méthodes en conditions réelles, une grande partie du stage fut de les **valider en simulation** via le simulateur **Gazebo**, en implémentant les dites lois de commande dans une version simulée du robot Jackal grâce à l'architecture ROS. L'implémentation s'est principalement faite en C++.
Au final, nous avons tenté **trois méthodes** d'asservissement: un Proportionel-Integral-Derivée (**PID**), une loi de commande basée sur un modèle cinématique dont la stabilité a été démontré par **analyse de Lyapunov** (issue de [ce papier](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=7358463&casa_token=SsXf26HctXgAAAAA:FWIr5NvwQpWKjHPaZyUWqf7rnpg50gLs5lbC8vh4Co2GAQ7q828w4URxsQWz9kE71WtOKL0euAgL)), et une commande basée sur de la **logique floue**.

Las **deux derniers mois** du stage furent dédiés à l'implémentation des méthodes sur le **système réel** et de procéder aux expérimentations dans un (très) gros morceau de canalisation spécialement commandé pour l'occasion.

### Principales missions
- Réalisation d'un état de l'art
- Codage en C++
- Gestion d'une architecture ROS
- Implémentation/validation en simulation (Gazebo) et en conditions réelles (robot Jackal + canalisation cylindrique)