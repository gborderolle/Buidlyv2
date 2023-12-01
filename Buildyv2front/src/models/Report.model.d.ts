interface Report {
    id: number;
    name: string;
    creation: Date;
    update: Date;
    comments: string;
    listPhotoURL: string[];
    estateId: number;
    estate?: Estate;
    job?: Job;
  }
  