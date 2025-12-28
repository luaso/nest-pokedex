<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```bash
$ npm install
```
3. Tener nest CLI instalado
```bash
$ npm i -g @nest/cli
```
4. Levantar la BD
```bash
$ docker-compose up -d
```
5. Reconstruir la BD con la semilla
```bash
http://localhost:3000/api/v2/seed
```

## Stack usado

* MongoDB
* Nestjs
* Typescript