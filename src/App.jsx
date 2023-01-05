import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";




const getSchema = () =>
  yup.object({
    name: yup.string()
      .required('Type some text here...'),

    photo: yup
      .mixed()
      .test('required', "You need to provide a file", (value) => {
        return value && value.length
      })
      .test(
        "dimention",
        "At least 70x70 px dimention",
        value => {
          return value && value[0] && new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(value[0]);
            reader.onload = function (value) {
              const img = new Image();
              img.src = value.target.result;
              img.onload = function () {
                const leastDimention = this.width > 70 && this.height > 70;
                resolve(leastDimention);
              };
            };
          });
        }
      ),
  });

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(getSchema()),
    mode: "onChange"
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const errs = [];

  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      errs.push(errors[key]["message"]);
    }
  }

  if (errs.length) {
    console.log(errs);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="First name" {...register("name")} />
      <br />
      <input type="file" {...register("photo")} />
      <br />
      <input type="submit" />
      {errs.map((error, i) => {
        return <p key={i} style={{ color: 'red' }}>{error}</p>;
      })}
    </form>
  );
}
