interface Warrant {
    id: number;
    name: string;
    creation: Date;
    update: Date;
    comments: string;
    type: string;
    contractId: number;
    contract?: Contract;
  }
  