import { Select, SelectProps } from "antd";

const { Option } = Select;

interface ICSelectProps extends SelectProps {
  options: any[];
  valueOption: string;
  labelOption: string;
}

const CSelect = ({
  options,
  valueOption,
  labelOption,
  ...rest
}: ICSelectProps) => {
  return (
    <Select
      {...rest}
      filterOption={(input: any, option: any) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {options.map((option: any) => (
        <Option key={option[valueOption]} value={valueOption}>
          {option[labelOption].toUpperCase()}
        </Option>
      ))}
    </Select>
  );
};

export default CSelect;
