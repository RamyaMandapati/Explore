import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";

export const StyledFormControl = styled(FormControl)({
  "& label.Mui-focused": {
    color: "#aeb6f3", // Replace with your desired color
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#aeb6f3", // Optional: change border color when focused
    },
  },
});
export const CustomCheckbox = styled(Checkbox)({
  "&.Mui-checked": {
    color: "#aeb6f3", // Replace 'desiredColor' with your chosen color
  },
});
