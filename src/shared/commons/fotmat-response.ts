import { Meta } from "../interfaces/response";

export type Props = {
  data?: any;
  message?: string;
  meta?: Meta;
};
const formattedResponse = ({ data, message = "success", meta }: Props) => {
  return {
    data,
    message,
    meta,
  };
};

export default formattedResponse;
