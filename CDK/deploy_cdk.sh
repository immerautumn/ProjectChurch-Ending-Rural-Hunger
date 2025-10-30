#!/usr/bin/env bash

printf "%s\n" "Welcome to the setup for Project Church (Christ's Hands United to Rescue Communities from Hunger): Ending Rural Hunger" \
"The goal of this project is to provide super low-cost (\$5-\$15 monthly), gratis, free as in speech, free as in salvation: 'Freely you have received, freely give' software" \
" and cloud solution, in order to promote the fast start-up of Christian Food Bank Charities, whom collect, and give to the poor, considering Matthew 25. Jesus says His sheep hear" \
"His voice, and so the purpose of this software is to remove roadblocks, and give those involved in administration a quick option to get off the ground as fast as possible." \
"[Requirement A]: The current backend is AWS based, and requires an AWS Account. You can sign up here: https://aws.amazon.com/resources/create-account/" \
"[Requirement B]: An AWS IAM user with AWS Access Keys" \
"[Requirement C]: A registered Domain name to be used with AWS Route 53"
if [[ -z $AWS_ACCESS_KEY ]] && [[ -z $AWS_SECRET_ACCESS_KEY ]] && [[ -z $AWS_DEFAULT_REGION ]]; then
    printf "%s\n" "[Step 0:] Ensure you have exported your AWS_ACCESS_KEY and or AWS_SECRET_ACCESS_KEY, alongside your AWS_DEFAULT_REGION" \
    "EXPORT AWS_ACCESS_KEY='ABC1234ETC'" \
    "EXPORT AWS_ACCESS_KEY='MYSECRETSTRINGHERE'" \
    "EXPORT AWS_DEFAULT_REGION='us-east-2'"  \
    "[HINT]: You can make a user in the AWS IAM, that you can assign permissions to, and generate these access keys there. You should avoid using your root user for this!" \
    "The AWS region there should change depending on where you are. West coast may opt for us-west-1 (California) or us-west-2 (Oregon), etc. For a full list of AWS" \
    "regions, see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html"
    exit 1
fi

printf "%s\n" "[Step 1:] Login to your AWS account, and use the 'Account' on the right hand side of the top menu, look for 'account', copy, and now paste in that acccount number..."
export CDK_DEFAULT_ACCOUNT=$(read -p "Enter the AWS Account: ")