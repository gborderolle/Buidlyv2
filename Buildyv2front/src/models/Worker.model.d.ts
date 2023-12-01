interface Worker {
    id: number;
    name: string;
    creation: Date;
    update: Date;
    phone1: string;
    phone2?: string;
    email?: string;
    identityDocument: string;
    comments: string;
    jobId: number;
    job?: Job;
  }
  