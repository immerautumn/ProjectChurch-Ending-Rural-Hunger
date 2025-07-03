* Create the basic table data definition for user data.
* Create a second CDK stack for the S3 and DynamoDB storage. One that is protected removalPolicy: RETAIN, protect: true
* Add the DynamoDB table to CDK, and see if it is possible 
* Fleshout the Ingest Lambda Function:
    - Add the SES so that administrators can send PDFs or post script to an email inbox
    - Optionally create some IMAP/POP3 based software that interfaces with the printer to send it directly to the stockers in the back.
* Flesh out the fraud detection function:
    - Perhaps investigate using near-real time typing to autofill users who've been seen before for administrators.
* Figure out the R53 DNS situation and routing to the ApiGateway.
* Ensure that the .$lambdaname hands off context from the stepfunctions state machines.
* Start real work on the react ui.
    - Ensure we create an admin-only version of the site as well with additional elements, or make it toggleable for those sites with large communities but small administrative staff.
* Create user installation scripts and guides.