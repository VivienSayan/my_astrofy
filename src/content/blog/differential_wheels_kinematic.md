---
title: "Cinématique d'un robot différentiel"
description: "Modélisation des mouvements d'un robot différentiel avec hypothèse de roulement sans glissement."
pubDate: "Oct 01 2026"
heroImage: "/diff_drive_example.png"
# badge: "Demo badge"
tags: ["modélisation","robotique"]
---

## Contexte

En robotique, on aime bien caractériser le comportement d'un système dynamique par des équations -- pour la plupart issus des lois de la physique -- afin d'en tirer une connaissance formelle de l'état du système à un instant futur $t+\delta t$ étant donné la connaissance de son état à un instant $t$ et d'entrées connues sur celui-ci. De manière générale, on rassemble les $n$ variables d'état du système dans un vecteur d'états, noté $\mathbf{x} \in \mathbb{R}^n$, dont chaque variable caractérise une quantité d'intérêt que l'on souhaite suivre au cours du temps et qui évolue selon une certaine dynamique lorsqu'on applique $m$ variables en entrée du système. Ces variables sont rassemblées dans un vecteur noté $\mathbf{u} \in \mathbb{R}^m$. Pour calculer la position d'un robot dans un repère, on commence souvent par décrire l'évolution de l'état du système par une équations des vitesses (équations cinématiques) de la forme suivante:

$\dot{\mathbf{x}}(t) = \mathbf{f}(\mathbf{x}(t), \mathbf{u}(t))$

## Cas du robot différentiel

Ce blog post se propose d'établir les équations cinématiques d'un robot différentiel tel qu'aperçu en haut de cette page. Pour cela, on considère un repère inertiel $\mathcal{I} = (O, \mathcal{e}_{x}, \mathcal{e}_{y}, \mathcal{e}_{z})$ (Fig. 1) et on se choisit le système d'états $\mathbf{x} = [x,y,\theta]^\top$ où:
- $x$ est la position le long de l'axe horizontal $\mathcal{e}_{x}$
- $y$ est la position le long de l'axe vertical $\mathcal{e}_{y}$
- $\theta$ est l'orientation du véhicule autour de l'axe $\mathcal{e}_{z}$ du repère

<figure>
  <img src="/diff_drive_frame.png" />
  <figcaption>Figure 1 — Robot différentiel avec pose $(x,y,\theta)$ dans un repère inertiel $\mathcal{I}$ et vitesses instantanées $(\dot{x}_{\mathcal{R}},\dot{y}_{\mathcal{R}})$ exprimées dans le repère robot $\mathcal{R}$.</figcaption>
</figure>

On établit un repère $\mathcal{R}$ attaché au corps du robot et on exprime ses vitesses instantanées $(\dot{x}_{\mathcal{R}}, \dot{y}_{\mathcal{R}},\dot{\theta}_{\mathcal{R}})$ dans ce même repère. On s'intéresse à comment ces vitesses traduisent un mouvement dans le repère inertielle $\mathcal{I}$. Cela peut être fait en employant la trigonométrie. Visuellement, un mouvement de translation selon l'axe horizontal $e_x$ peut se traduire par une composante issue de $\dot{x}_{\mathcal{R}}$ et une composante issue de $\dot{y}_{\mathcal{R}}$. Il suffit de faire la projection de chacune de ces deux vitesses sur l'axe $e_x$ puis d'additioner les contributions (Fig. 2). Cela donne:

$\dot{x} = \dot{x}_{\mathcal{R}} \cos(\theta) - \dot{y}_{\mathcal{R}} \sin(\theta)$

<figure>
  <img src="/diff_drive_frame_how_to_find_xdot.png" />
  <figcaption>Figure 2 — Projection des vitesses instantanées du repère corps $\mathcal{R}$ vers l'axe $e_x$ du repère inertiel $\mathcal{I}$.</figcaption>
</figure>

Le même raisonnement peut s'appliquer selon l'axe vertical $e_y$ afin d'obtenir:

$\dot{y} = \dot{x}_{\mathcal{R}} \sin(\theta) + \dot{y}_{\mathcal{R}} \cos(\theta)$

Pour ce qui est de la vitesse de rotation dans le repère inertiel, nous avons:

$\dot{\theta} = \dot{\theta}_{\mathcal{R}}$

Car les repères $\mathcal{R}$ et $\mathcal{I}$ partagent le même axe $e_z$.

Pour simplifier les notations, on peut écrire:
- $v_x = \dot{x}_{\mathcal{R}}$
- $v_y = \dot{y}_{\mathcal{R}}$
- $\omega = \dot{\theta}$

Et en réarrangeant les termes sous forme d'un produit matrice-vecteur, nous obtenons l'équation cinématique suivante:

$
\underbrace{\begin{pmatrix} \dot{x} \\ \dot{y} \\ \dot{\theta} \end{pmatrix}}_{\dot{\mathbf{x}}} = 
\underbrace{\begin{pmatrix} \cos(\theta) & -\sin(\theta) & 0 \\ \sin(\theta) & \cos(\theta) & 0 \\ 0 & 0 & 1 \end{pmatrix}}_{\mathbf{R}(\theta)}
\underbrace{\begin{pmatrix} v_x \\ v_y \\ \omega \end{pmatrix}}_{\mathbf{u}} = \mathbf{f}(\mathbf{x}, \mathbf{u})
$

où $\mathbf{R}(\theta)$ est la matrice de rotation (d'un angle $\theta$ autour de $e_z$) du repère corps vers le repère inertiel. L'équation ci-dessus est non-linéaire en l'état $\mathbf{x}$.

## Expression analytique des vitesses dans le repère corps

En pratique, nous ne disposons par des entrées $v_x$, $v_y$ et $\omega$ directement. En effet, on les calcule plutôt indirectement à partir de mesures odométriques qui nous fournissent la distance parcourue par chaque roue. On se propose de voir comment nous en déduisons les quantités $v_x$, $v_y$ et $\omega$.

Pour ce qui va suivre, on considère un robot mobile ayant une roue de chaque côté (le raisonnement et les équations seront les mêmes que pour un robot mobile doté de deux roues parallèles de chaque côté). Les roues sont de rayon $r$ et séparées d'une distance $D$. On suppose aussi un scénario idéal tel que les contraintes cinématiques impliquent strictement un mouvement d'avant-arrière et n'autorisent pas de mouvements latéraux ni de glissement. Ainsi, on peut d'ores et déjà conclure que la vitesse latérale dans le repère corps est nulle:

$\dot{y}_{\mathcal{R}} = v_y = 0$

Cela n'est pas forcément le cas dans la réalité, car il peut y avoir quelques résidus de déplacements latéraux. Il s'agit donc d'une erreur de modélisation. Mais pour ce type de véhicule (possédant des [contraintes non-holonomes](http://localhost:4321/blog/contraintes-non-holonomes)), il est très raisonnable de supposer cela. Par ailleurs, la plus grande source d'incertitude pourrait bien être l'hypothèse de roulement sans glissement (moins raisonnable à faire), mais simplifions-nous les choses dans un premier temps. 

Les vitesses instantanées $v_x$ et $\omega$ sont fonctions des vitesses de rotations des roues, de leur rayon et de la distance séparant les roues gauches et droites. Par intuition, on sait que pour obtenir la vitesse d'avancée $v_x$, nous avons besoin de la vitesse de rotation des roues. Pour cela, nous exploitons la relation permettant de calculer la distance parcourue par une portion de roue de rayon $r$ faisant une rotation d'angle $\phi$ radians. Cette distance s'exprime comme étant $\phi r$ (Fig. 3). En effet, on sait qu'un tour complet ($2\pi$ radians) donne une circonférence de $2\pi r$.

<figure>
  <img src="/wheel.png" />
  <figcaption>Figure 3 — Une roue de rayon $r$ se déplace d'une distance $\phi r$ quand elle est orientée de $\phi$ radians.</figcaption>
</figure>

En prenant la dérivée de l'expression précédente (à partir des mesures d'un encodeur, nous pouvons faire une dérivation numérique pour passer dans l'espace des vitesses), nous obtenons la vitesse translationnelle de la roue, donnée par $r\dot{\phi}$.

#### -- Aparté sur le fonctionnement d'un encodeur --
Un encodeur fournit des impulsions (ou ticks), puis un driver réalise le comptage et fournit une distance angulaire. Par exemple, pour un encodeur à $N$ ticks/tour, on compte $k$ ticks et on calcule la distance angulaire $\phi_k = \frac{k}{N} \times 2\pi$ (en radian). On multiplie ensuite par le rayon, càd $\phi_k r$ pour obtenir la portion de distance (en mètre) parcourue par la roue à l'instant $t_k$. Par différence temporelle, on peut ensuite en déduire la vitesse longitudinale d'une roue $r\dot{\phi}_k = r\frac{\phi_k - \phi_{k-1}}{t_k - t_{k-1}}$ (ou bien rester sur une vitesse angulaire en enlevant $r$ de la formule).
#### --

Pour revenir au robot différentiel, chaque roue est actionné selon une certaine vitesse de rotation. On note $\phi_g$ la vitesse de rotation de la roue gauche et $\phi_d$ celle de la roue droite. Nous avons donc $r\dot{\phi}_g$ et $r\dot{\phi}_d$ pour chaque roue respectivement.

Ainsi, la vitesse $v_x$ parcourue par le centre du robot est la moyenne de la vitesse parcourue par les deux roues:

$v_x = \frac{r \dot{\phi}_g + r \dot{\phi}_d}{2}$

Nous devons maintenant calculer la vitesse de rotation du robot autour de son axe $e_z$. Cette rotation peut être visualisée en imaginant les roues du robots tourner dans des sens opposées. Prenons chaque roue indépendamment l'une de l'autre: en supposant la roue gauche non actionnée, et la roue droite actionnée vers l'avant, nous observons une rotation du corps dans le sens trigonométrique (anti-horaire). En imaginant (vu de dessus) que la roue droite réalise un arc de cercle de rayon $D$ dont le point d'origine coïncide avec le centre de la roue gauche, et que cet arc de cercle possède un angle $\alpha_d$, nous pouvons écrire que la distance de cet arc de cercle est égale à la distance parcourue par la roue droite ayant avancé de $\phi_d$ radian (Fig. 4). Ainsi, on a:

$D \alpha_d = r \phi_d$

<figure>
  <img src="/rotation_autour_de_roue_gauche.png" />
  <figcaption>Figure 4 — Robot différentiel pivotant autour de la roue gauche.</figcaption>
</figure>

En prenant la dérivée de chaque côté pour passer dans l'espace des vitesses, nous obtenons:

$\dot{\alpha}_d = \frac{r \dot{\phi}_d}{D}$

Enfin, on ajoute la rotation inverse (celle de la roue gauche actionnée vers l'arrière et la roue droite non actionnée), nous obtenons:

$\omega = \frac{r \dot{\phi}_d - r \dot{\phi}_g}{D}$

Au final, connaissant les vitesses de rotation $\dot{\phi}_d$ et $\dot{\phi}_g$ issues des encodeurs, le rayon r et l'empattement $D$, nous avons:

- $v_x = \frac{r \dot{\phi}_g + r \dot{\phi}_d}{2}$
- $v_y = 0$
- $\omega = \frac{r \dot{\phi}_d - r \dot{\phi}_g}{D}$

### -- Explications plus détaillées --
Nous pouvons obtenir ces expressions d'une autre manière, en supposant que les mouvements du centre du robot peuvent se décomposer en de petites portions d'arc de cercle entre chaque instant. Admettons que chaque arc de cercle possède un rayon de courbure $R$, d'une origine $A$ et que les extrémités de l'arc correspondent à la position angulaire $\theta(t)$ et $\theta(t+\delta t)$ (Fig. 5).

<figure>
  <img src="/arc_de_cercle_R.png" />
  <figcaption>Figure 5 — Portion d'arc de cercle entre deux instants de mouvement.</figcaption>
</figure>

Ainsi, la vitesse de rotation du robot est $\dot{\theta} = \omega = \frac{\delta \theta}{\delta t}$, et la vitesse longitudinale instantanée vaut donc:

$v_x = R \omega$

De plus, nous avons la même relation pour la vitesse longitudinale instantanée de la roue gauche, avec la même vitesse de rotation $\omega$ que le centre du robot, mais pour un rayon de courbure $R_g = R-\frac{D}{2}$. En ce qui concerne le côté droit, nous avons quelque chose de similaire mais avec un rayon de courbure $R_d = R+\frac{D}{2}$:

$v_g = R_g  \omega = (R-\frac{D}{2}) \omega = (R-\frac{e}{2}) \frac{v_x}{R} = v_x(1-\frac{D}{2R})$

$v_d = R_d  \omega = (R+\frac{D}{2}) \omega = (R+\frac{D}{2}) \frac{v_x}{R} = v_x(1+\frac{D}{2R})$

On rappel que $v_g = r \dot{\phi}_g$ et $v_d = r \dot{\phi}_d$

Il nous faut inverser ce système d'équations de sorte à obtenir $v_x$ en fonction de $\dot{\phi}_g$ et $\dot{\phi}_d$, pour en déduire par la suite $\omega$ d'après $\frac{v_x}{R}$. Ci-dessous la démonstration:

$ v_x = \frac{v_d}{1+\frac{D}{2R}} = \frac{v_g}{1-\frac{D}{2R}} $

$ \Rightarrow \frac{v_d}{v_g} = \frac{1+\frac{D}{2R}}{1-\frac{D}{2R}} $

$ \Rightarrow \frac{v_d}{v_g} = \frac{\frac{2R+D}{2R}}{\frac{2R-D}{2R}} $ 

$ \Rightarrow \frac{v_d}{v_g} = \frac{2R+D}{2R-D} $

$ \Rightarrow \frac{v_d}{v_g}(2R-D) = 2R+D $

$ \Rightarrow 2R\frac{v_d}{v_g}-\frac{v_d}{v_g}D = 2R+D $

$ \Rightarrow 2R(\frac{v_d}{v_g}-1) = D(1+\frac{v_d}{v_g}) $

$ \Rightarrow R(\frac{v_d-v_g}{v_g}) = \frac{D}{2} (\frac{v_g+v_d}{v_g})$

$ \Rightarrow R = \frac{D}{2}(\frac{v_g+v_d}{v_d-v_g})$

On injecte cette dernière expression dans $ v_d =  v_x(1+\frac{D}{2R}) $ et on trouve :

$ v_x = \frac{v_d+v_g}{2} = \frac{r \dot{\phi}_g + r \dot{\phi}_d}{2} $

Pour $\omega$, on injecte l'expression de $R$ et $v_x$ dans $\omega = \frac{v_x}{R}$, et on obtient:

$ \omega = \frac{\frac{v_d + v_g}{2}}{\frac{D}{2}\frac{v_d+v_g}{v_d-v_g}} = \frac{v_d - v_g}{D} = \frac{r \dot{\phi}_d - r \dot{\phi}_g}{D}$

En rassemblant le tout, nous obtenons finalement:

$
\underbrace{\begin{pmatrix} \dot{x} \\ \dot{y} \\ \dot{\theta} \end{pmatrix}}_{\dot{\mathbf{x}}} = 
\underbrace{\begin{pmatrix} \cos(\theta) & -\sin(\theta) & 0 \\ \sin(\theta) & \cos(\theta) & 0 \\ 0 & 0 & 1 \end{pmatrix}}_{\mathbf{R}(\theta)}
\underbrace{\begin{pmatrix} \frac{r \dot{\phi}_g + r \dot{\phi}_d}{2} \\ 0 \\ \frac{r \dot{\phi}_d - r \dot{\phi}_g}{D} \end{pmatrix}}_{\mathbf{u}} = \mathbf{f}(\mathbf{x}, \mathbf{u})
$

## Cinématique inverse

Nous pouvons inverser la cinématique de sorte à calculer les vitesses locales $\dot{\mathbf{x}}_{\mathcal{R}} = [v_x, v_y, \omega]^\top$ étant donné des vitesses inertielles désirées $\dot{\mathbf{x}} = \dot{\mathbf{x}}_{\mathcal{I}} = [\dot{x}, \dot{y}, \dot{\theta}]^\top$. Il suffit de multiplier chaque côté du modèle cinématique directe par l'inverse de la matrice $\mathbf{R}(\theta)$:

$\mathbf{R}^{-1}(\theta) \dot{\mathbf{x}}_{\mathcal{I}} = \mathbf{R}^{-1}(\theta) \mathbf{R}(\theta) \dot{\mathbf{x}}_{\mathcal{R}}$

$\Rightarrow 
\underbrace{\begin{pmatrix} v_x \\ v_y \\ \theta \end{pmatrix}}_{\dot{\mathbf{x}}_{\mathcal{R}}} = \underbrace{\begin{bmatrix} \cos(\theta) & \sin(\theta) & 0 \\ -\sin(\theta) & \cos(\theta) & 0 \\ 0 &0& 1 \end{bmatrix}}_{\mathbf{R}^{-1}(\theta)} \underbrace{\begin{pmatrix} \dot{x} \\ \dot{y} \\ \dot{\theta} \end{pmatrix}}_{\dot{\mathbf{x}}_\mathcal{I}}$

Cela signifie devoir connaître à chaque instant l'angle $\theta$ du corps dans le repère inertiel.

Enfin, on peut aussi obtenir les vitesses de rotation souhaitées des roues gauche et droite en donnant comme indication la vitesse linéaire désirée $v_x$ et la vitesse angulaire désirée $\omega$ en inversant $\mathbf{u}$:

$\dot{\phi}_{g} = \frac{2v_x - \omega D}{2r}$

$\dot{\phi}_{d} = \frac{2v_x + \omega D}{2r}$

Notons que cette approche ne nous permet pas de gérer les situations $v_y \neq 0$ qui résulterait du calcul de $\dot{\mathbf{x}}_{\mathcal{R}}$ depuis $\dot{\mathbf{x}}_{\mathcal{I}}$. Ces solutions sont simplement ignorées.

Dans [ce blog post](http://localhost:4321/blog/robot-diffrentiel-4wd---arduino), je tente d'implémenter ces expressions sur une vraie plateforme à quatre roues.