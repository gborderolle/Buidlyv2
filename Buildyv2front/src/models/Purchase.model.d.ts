interface Purchase {
    id: number;
    name: string;
    creation: Date;
    update: Date;
    comments: string;
    amount: number;
    supplier: string;
    totalCost: number;
    datetimePurchase: Date;
    jobId: number;
    job?: Job;
  }
  