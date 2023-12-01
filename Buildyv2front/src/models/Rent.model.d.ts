interface Rent {
    id: number;
    creation: Date;
    update: Date;
    comments: string;
    rentIsEnded: boolean;
    estateId: number;
    estate?: Estate;
    tenant?: Tenant;
    contract?: Contract;
  }
  