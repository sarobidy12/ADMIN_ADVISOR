import React, { FC, useState } from "react";
import { IFieldContent } from "../../../models/Restaurant.model";
import { Grid, TextField, Typography } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import useStyles from "./Style";
import convertToBase64 from "../../../services/convertToBase64";

interface IFormFeild {
  listForm: any[];
  setValue: (data: any) => void;
  valueAll: any;
  errors: any;
}

const Render = (Props: any) => {
  const { data, handleChange, valueAll, errors, uploadImage, classes } =
    Props as any;

  if (data.type === "Text" || data.type === "Chiffre") {
    return (
      <>
        <Typography variant="h5" gutterBottom>
          {data.label || "label"}
        </Typography>
        <TextField
          name={data.name}
          placeholder={data?.label || ""}
          variant="outlined"
          fullWidth={true}
          defaultValue={valueAll.valueField?.[data.name]}
          error={!!errors.valueField?.[data.name]}
          type={data?.type === "Text" ? "text" : "number"}
          onChange={handleChange}
        />
      </>
    );
  }

  return (
    <>
      <Grid item={true} md={12}>
        <Typography variant="h5" gutterBottom align="center">
          {data.label || ""}
        </Typography>

        <DropzoneArea
          inputProps={{
            name: data.name,
          }}
          dropzoneText={data.label || ""}
          acceptedFiles={["image/*"]}
          filesLimit={1}
          classes={{ root: classes.dropzone }}
          getFileAddedMessage={() => "Fichier ajouté"}
          getFileRemovedMessage={() => "Fichier enlevé"}
          onChange={uploadImage(data.name)}
          initialFiles={[valueAll.valueField?.[data.name] ?? ""]}
        />
      </Grid>
    </>
  );
};

const FormFeild: FC<IFormFeild> = ({
  listForm,
  setValue,
  valueAll,
  errors,
}) => {
  const classes = useStyles();

  const handleChange = (e: any) => {
    const { value, name } = e.target;

    const dataSelected = {
      ...valueAll.valueField,
      [name]: value,
    };

    setValue({
      ...valueAll,
      valueField: dataSelected,
    });
  };

  const uploadImage = (name: string) => async (files: any) => {
    const file = files[0];

    if (file) {
      const base64 = await convertToBase64(file);

      const dataSelected = {
        ...valueAll.valueField,
        [name]: base64,
      };

      setValue({
        ...valueAll,
        valueField: dataSelected,
      });
    }
  };

  return (
    <div>
      <Grid container={true}>
        {listForm.length > 0 && listForm.map((item: IFieldContent) => (
          <Grid item={true} md={12}>
            <Render
              data={item}
              handleChange={handleChange}
              valueAll={valueAll}
              errors={errors}
              uploadImage={uploadImage}
              classes={classes}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FormFeild;
