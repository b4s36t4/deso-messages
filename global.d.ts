import { GetDecryptMessagesResponse } from "deso-protocol-types/src/lib/deso-types-custom";

declare module "*.svg" {
  export default string;
}

declare interface DecryptedMessage extends GetDecryptMessagesResponse {
  DecryptedMessage: string;
}
