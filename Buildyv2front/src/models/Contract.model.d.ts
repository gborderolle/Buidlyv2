interface Contract {
  id: number;
  creation: Date;
  update: Date;
  comments: string;
  monthlyValue?: number;
  duration: string;
  isLUC: boolean;
  listPhotoURL: string[];
  datetimeInit?: Date;
  datetimeEnd?: Date;
  rent?: Rent;
  notaryId: number;
  notary?: Notary;
  warrant?: Warrant;
}
