"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");


let bucketName = "s3-website-bucket"

let siteBucket = new aws.s3.Bucket(bucketName, {
  acl: "public-read",
  website: {
    indexDocument: "index.htm",
    errorDocument: "error.htm"
  }
});

function publicReadPolicyForBucket(bucketName) {
  return JSON.stringify(
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "PublicRead",
          "Effect": "Allow",
          "Principal": "*",
          "Action": [
            "s3:GetObject",
            "s3:GetObjectVersion"
          ],
          "Resource": [
            `arn:aws:s3:::${bucketName}/*`
          ]
        }
      ]
    }
  );
}

let bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
  bucket: siteBucket.bucket,
  policy: siteBucket.bucket.apply(publicReadPolicyForBucket)
})



exports.bucketName = siteBucket.bucket;
exports.websiteUrl = siteBucket.websiteEndpoint;