import { SfuExtended } from "@flashphoner/sfusdk";

export const loadSfuInstance = () =>
  new Promise<SfuExtended>((resolve, reject) => {
    resolve(new SfuExtended());
    reject(new Error('Sfu error initialize'));
  });
