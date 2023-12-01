interface Estate {
  id: number;
  name: string;
  creation: Date;
  update: Date;
  comments: string;
  address: string;
  city: string;
  province: string;
  country: string;
  googleMapsURL: string;
  listReports: Report[];
  listJobs: Job[];
  presentRent?: Rent;
  listRentsHistory: Rent[];
  ownerEstateList: OwnerEstate[];
}
