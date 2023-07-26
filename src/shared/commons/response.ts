type Props = {
  data?: any;
  message?: string;
};
const formattedResponse = ({ data, message = "success" }: Props) => {
  return {
    data,
    message,
  };
};

export default formattedResponse;
