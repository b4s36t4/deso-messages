import { GetDecryptMessagesResponse } from "deso-protocol-types/src/lib/deso-types-custom";

declare module "*.svg" {
  export default string;

  export interface DecryptedMessage extends GetDecryptMessagesResponse {
    DecryptedMessage: string;
  }
}
