import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { de, enUS } from 'date-fns/locale';
import { Input } from '../../../../components/Form/Input';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  date: Date;
  error: string;
  field: string;
  isRequired: boolean;
  label: string;
  loading: boolean;
  onChange: (date: Date | null) => void;
}

// TODO: figure out why only name and field from ReactDatePicker matter.  The
// ones in the custom input are ignored.
const DatePicker = ({
  date,
  error,
  field,
  isRequired,
  label,
  loading,
  onChange,
}: DatePickerProps) => {
  registerLocale('de', de);
  registerLocale('en-US', enUS);
  const navLocale = navigator.language;
  const timeCaption = navLocale === 'de' ? 'Zeit' : 'Time';
  const dateFormat =
    navLocale === 'de' ? 'd. MMMM yyyy, h:mm' : 'MMMM d, yyyy, h:mm aa';
  const timeFormat = navLocale === 'de' ? 'h:mm' : 'h:mm aa';

  return (
    <ReactDatePicker
      name={field}
      id={field}
      selected={date}
      showTimeSelect
      timeIntervals={5}
      onChange={onChange}
      disabled={loading}
      dateFormat={dateFormat}
      timeFormat={timeFormat}
      timeCaption={timeCaption}
      locale={navLocale}
      customInput={
        <Input
          id={`${field}_trigger`}
          name={field}
          error={error}
          label={label}
          isDisabled={loading}
          isRequired={isRequired}
          value={date.toDateString()}
          width={'400px'}
        />
      }
    />
  );
};

export default DatePicker;
