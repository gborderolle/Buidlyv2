interface Job {
  id: number;
  name: string;
  creation: Date;
  update: Date;
  comments: string;
  problem: string;
  labourCost: number;
  estateId: number;
  estate?: Estate;
  listReports: Report[];
  listWorkers: Worker[];
  listPurchases: Purchase[];
}
