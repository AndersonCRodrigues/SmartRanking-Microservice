import {
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';

config();

const { AWS_REGION, S3_BUCKET_NAME } = process.env;

@Injectable()
export class S3Service {
  private region: string;
  private s3: S3Client;
  private logger = new Logger(S3Service.name);

  constructor() {
    this.region = AWS_REGION || 'sa-east-1';
    this.s3 = new S3Client({
      region: this.region,
    });
  }

  async uploadFile(id: string, file: any) {
    const fileExtension = this.getFileExtension(file.originalname);
    const urlKey = `${id}.${fileExtension}`;
    const bucket = S3_BUCKET_NAME || 'NONE';
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: bucket,
      Key: urlKey,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return this.generateS3Url(bucket, this.region, urlKey);
      }
      throw new Error('Image not saved in S3!');
    } catch (error) {
      this.logger.error('Cannot save file inside S3', error.message);
      throw error;
    }
  }

  private getFileExtension(filename: string) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  }

  private generateS3Url(bucket: string, region: string, key: string) {
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }
}
