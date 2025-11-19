import { promises as fs } from 'fs';
import { DynamoDbClient, GetItemsCommand, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { table } from 'console';

/* This area is stay resident while the instance is warm,
 which should mean a responsive system after the first ingestion. */
const config = await fs.readFile('../config/lambda_config.json', 'utf-8').then(JSON.parse);
const region = config.region;
var dynamoDBClient = new DynamoDbClient({region: region});
var manifestIndex = null;

async function GetItemsFromTable(tableName: string, keyValue: string) {
  const getItems = new GetItemsCommand({
    TableName: tableName,
    Key: keyValue
  });
  const response = await dynamoDBClient.send(getItems);
  return unmarshall(response.Item).keyValue //Typically we should be able to access the remainder from attributes
}

async function putIteminTable(tableName: string, item: any) {
  const putItems = new PutItemCommand({
    TableName: tableName,
    Item: marshall(item)
  });
  await dynamoDBClient.send(putItems);
}

if (config.use_dynamodb_config_table) {
  var arn = config.dynamo_db_config_table
  var configTable = arn.split('/').pop();
  var dataShape = GetItemsFromTable(configTable, "app_config");
} else {
  // Optional fallback in the off-chance you don't want to store a config table in dynamodb.
  dataShape = await fs.readFile('../../app_config.json', 'utf-8').then(JSON.parse);
};

exports.handler = async (event) => {
  /* TODO: Warning we're a WIP here as I get the time.
  Here we need to insert data from the manifest into the dynamodb table.
      % Snag that data from the event handler
      % Minor ETL if required, basic cleanup, 
      % Use the DDL from dataShape to construct a map/json
      % marshall to package that data, and ship it to the appropriate table
      % consider construction a wrapper package/importable class for DRY.
  */
  return {
    statusCode: 200,
    body: JSON.stringify({ message: ' ingest OK' }),
  };
};