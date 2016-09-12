##Matrix Bar

Matrix is a project made in collaboration with [Arnaud Delente] and [Woma] / [Ourcq Blanc] .
The goal is to create a lighting bar connect with the web.

##Install

edit server/config

```bash
$ npm install -g nodemon
$ npm start
```

with docker-compose:
```bash
$ cd ~
$ git clone https://github.com/ltempier/matrix.git
$ git clone https://github.com/ltempier/DockerCompose.git
$ cd DockerCompose
$ docker-compose up matrix
```

##Architecture

![Architecture](http://i.imgur.com/WDj3DEv.png)

* Server: [Nodejs] + [Express]
* Client: [Firebase] for client synchronization
* Hardware: [Particle] + [MQTT] for two-way communication


##Result

![wip](http://i.imgur.com/tUFLRuo.jpg)
![result](http://i.imgur.com/oy2Sa2l.jpg)


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[Arnaud Delente]: https://twitter.com/arnauddelente
[Woma]: http://www.woma.fr/
[Ourcq Blanc]: http://ourcqblanc.com/

[Nodejs]: https://nodejs.org/en/
[Express]: http://expressjs.com/
[Firebase]: https://www.firebase.com/
[MQTT]: http://mosquitto.org/
[Particle]: https://www.particle.io/





