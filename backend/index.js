
require("dotenv").config()
// imports
const morgan = require("morgan");
const { createConnection } = require("mysql2"),
express = require("express"),
cors = require("cors")
// inicializations
app = express(),
prepareDBConnection = () => {
    const connection = createConnection({
        host: "localhost",
        user: "root",
        database: "ezassi",
        password: "alejandroperidot"
    })
    connection.connect();
    return connection
};

// settings
app.set("port", process.env.PORT || 3000)

// middleweares
app.use(cors({
    origin: "*"
}));
app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// sql queries
const GET_ALL = `SELECT * from tasks`
const CREATE_ONE = (task) => `INSERT INTO \`ezassi\`.\`tasks\`
(\`summary\`,
\`img\`,
\`assigness\`,
\`workflow\`,
\`review\`,
\`createdAt\`,
\`rewiews\`)
VALUES
('${task.summary}',
'${task.img}',
'${task.assigness}',
'${task.workflow}',
'${task.review}',
'2022-00-00 00:00:00',
'${task.rewiews}');`
const CHANGE_TASK = (task) => `UPDATE \`ezassi\`.\`tasks\`
SET
\`summary\` = '${task.summary}',
\`img\` = '${task.img}',
\`assigness\` = '${task.assigness}',
\`workflow\` = '${task.workflow}',
\`review\` = '${task.review}',
\`createdAt\` = '2022-00-00 00:00:00',
\`rewiews\` = '${task.rewiew}'
WHERE \`ID\` = '${task.id}';`
const DELETE_TASK = (id) => `DELETE FROM \`ezassi\`.\`tasks\`
WHERE ID=${id};`
// routes
app.route("/")
    .get(async ({query}, res) => {
        let connection = prepareDBConnection();
        connection.query(GET_ALL, (error, results, fields) => {
            if(error) throw error;
            connection.end();
            res.json(results)
        })
    })
    .post(async ({body}, res) => {
        let connection = prepareDBConnection();
        connection.query(CREATE_ONE(body), (error, result, fields) => {
            if(error) throw error;
            connection.end();
            res.json(result)
        })
    })
    .put(async ({body}, res) => {
        let connection = prepareDBConnection();
        connection.query(CHANGE_TASK(body), (error, result, fields) => {
            if(error) throw error;

            connection.end();
            res.json(result)
        })
    })
    .delete( async ({query}, res) => {
        let connection = prepareDBConnection();
        connection.query(DELETE_TASK(query.id), (error, result, fields) => {
            if(error) throw error;

            connection.end();
            res.json(result)
        })
    })

app.listen(app.get("port"), _ => console.log(`server on port ${app.get("port")}`))
// model
/*
{
    summary: "",
    img: img,
    assignees: "",
    workflow: "",
    review: number,
    reviews: review[],
    createdAt: ""
}
 */