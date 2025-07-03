import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions'
import * as sfn_tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as api_gw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // We start with our VPC here, nothing fancy, after that, we'll move on to our API Gateway and Lambda instances.
    const vpc = new ec2.Vpc(this, 'ChurchVPC', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
    });
    const selection = vpc.selectSubnets({
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
    });
    // Lambda Functions:
    const ingestLambda = new lambda.Function(this, 'ingest', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/ingest/index.ts'),
    });
    const fraudDetectionLambda = new lambda.Function(this, 'fraudDetection', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/fraudDetection/index.ts'),
    });
    // StepFunctions + StateMachine steps:
    const ingestStep = new sfn_tasks.LambdaInvoke(this, 'IngestStep', {
      lambdaFunction: ingestLambda,
      resultPath: '$.ingest' // Make sure we check these to ensure we pass them off, IIRC, this was tricksy in the past.
    })

    const fraudStep = new sfn_tasks.LambdaInvoke(this, 'fraudDetectionStep', {
      lambdaFunction: fraudDetectionLambda,
      resultPath: '$.fraud' // Make sure we check these to ensure we pass them off, IIRC, this was tricksy in the past.
    })
    ingestStep.next(fraudStep);

    const machine = new sfn.StateMachine(this, 'Workflow', {
      stateMachineType: sfn.StateMachineType.EXPRESS,
      definition: ingestStep
    })

    // ApiGateway and endpoints:
    const apiGateway = new api_gw.RestApi(this, 'ChurchApi', {
    });
    const ping = apiGateway.root.addResource('ping');
    ping.addMethod('GET', new api_gw.LambdaIntegration(ingestLambda))
    const ingest = apiGateway.root.addResource('ingest');
    ingest.addMethod('POST', api_gw.StepFunctionsIntegration.startExecution(machine));
  }
}
