import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  // Railway injects these automatically
  endpoint: process.env.AWS_ENDPOINT, 
  region: process.env.AWS_DEFAULT_REGION || "us-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, 
});

export async function uploadToBucket(buffer, fileName, contentType) {
  const command = new PutObjectCommand({
    // Use the bucket name Railway provided (or name it if you set a custom one)
    Bucket: process.env.AWS_BUCKET_NAME, 
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  
  // Construct the public URL using the endpoint
  return `${process.env.AWS_ENDPOINT}/${process.env.AWS_BUCKET_NAME}/${fileName}`;
}
