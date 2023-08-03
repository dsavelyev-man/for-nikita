import express from "express";
import bodyParser from "body-parser";
import {de} from "@faker-js/faker";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Некит гей',
            version: '1.0.0',
        },
    },
    apis: ['./index.js'],
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

class Post {
    id
    static count = 0
    title
    description
    constructor(title, description) {
        Post.count = Post.count + 1

        this.id = Post.count
        this.title = title
        this.description = description

        console.log(this)
    }
}

const posts = []

/**
 * @openapi
 * /posts:
 *   get:
 *     description: Получишь все посты
 *     responses:
 *       200:
 *         description: выйдет массив json []
 */
app.get("/posts", (req, res) => {
    res.json(posts)
})

/**
 * @openapi
 * /posts:
 *   post:
 *     description: Создашь пост
 *     responses:
 *       201:
 *         description: вернет пост
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      title:
 *                          type: string
 *                          description: Заголовок поста
 *                          example: Некит гей
 *                      description:
 *                          type: string
 *                          description: Описание поста
 *                          example: Доказательство что он гей
 */
app.post("/posts", (req, res) => {
    const title = req.body?.title
    const description = req.body?.description

    const post = new Post(title, description)

    posts.push(post)

    res.json(post)
})

/**
 * @openapi
 * /posts/{id}:
 *   delete:
 *     description: Получишь все посты
 *     responses:
 *       201:
 *         description: пост удален
 *       404:
 *          description: POST_NOT_FOUND пост с таким id не найден
 *
 */
app.delete("/posts/:id", (req, res) => {
    const id = parseInt(req.params.id)

    const index = posts.findIndex((post) => post.id === id)

    if(index !== -1) {
        posts.splice(index, 1)

        res.json(true)
    } else {
        res.status(404)
        res.json("POST_NOT_FOUND")
    }
})

/**
 * @openapi
 * /posts/{id}:
 *   put:
 *         description: обновишь пост
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      title:
 *                          type: string
 *                          description: Заголовок поста
 *                          example: Некит гей
 *                      description:
 *                          type: string
 *                          description: Описание поста
 *                          example: Доказательство что он гей
 */

app.put("/posts/:id", (req, res) => {
    const id = parseInt(req.params.id)

    const index = posts.findIndex((post) => post.id === id)

    if(index !== -1) {
        const post = posts[index]

        const title = req.body.title;
        const description = req.body.description;

        if(title) post.title = title;
        if(description) post.description = description;

        res.json(post)
    } else {
        res.status(404)
        res.json("POST_NOT_FOUND")
    }
})

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     description: Получишь пост по id
 *     responses:
 *       201:
 *         description: тут будет пост
 *       404:
 *          description: POST_NOT_FOUND пост с таким id не найден
 *
 */
app.get("/posts/:id", (req, res) => {
    const id = parseInt(req.params.id)

    const index = posts.findIndex((post) => post.id === id)

    if(index !== -1) {
        const post = posts[index]

        res.json(post)
    } else {
        res.status(404)
        res.json("POST_NOT_FOUND")
    }
})

app.listen(3000, () => console.log("server started: http://localhost:3000"))