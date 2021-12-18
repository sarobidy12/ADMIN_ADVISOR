import React, { useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import useForm, { FormError, FormValidationHandler } from '../../hooks/useForm';
import { DropzoneArea } from 'material-ui-dropzone';

export type PostFormType = {
  _id?: string;
  title: string;
  description: string;
  url: string;
  urlMobile?: string;
  image?: any;
  imageWeb?: any;
  imageMobile?: File;
  priority?: number;
};


const useStyles = makeStyles(() => ({
  dropzone: {
    height: '100%',
  },
}));

interface PostFormProps {
  saving?: boolean;
  modification?: boolean;
  initialValues?: PostFormType;
  onSave?: (data: PostFormType) => void;
  onCancel?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({
  saving,
  initialValues = {
    title: '',
    description: '',
    url: ''
  },
  onSave,
  onCancel,
}) => {
  const validation = useCallback<FormValidationHandler<PostFormType>>(
    (data) => {
      const errors: FormError<PostFormType> = {};

      if (!data.title.length) errors.title = 'Ce champ ne doit pas être vide';
      if (!data.description.length) errors.description = 'Ce champ ne doit pas être vide';
      return errors;
    },
    [],
  );

  const {
    values,
    setValues,
    validate,
    errors,
    handleInputBlur,
  } = useForm<PostFormType>(initialValues, false, validation);

  const classes = useStyles();
  const theme = useTheme();

  return (
    <form
      noValidate
      method="post"
      encType="multipart/form-data"
      onSubmit={(e) => {
        e.preventDefault();
        (e.currentTarget.querySelector(
          '[type=submit]',
        ) as HTMLButtonElement).focus();
        if (validate()) onSave?.(values);
      }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Titre
          </Typography>
          <TextField
            name="title"
            placeholder="Titre"
            variant="outlined"
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
            defaultValue={initialValues.title}
            onBlur={handleInputBlur}
          />
          <Box height={theme.spacing(2)} />

          <Typography variant="h5" gutterBottom>
            URL
          </Typography>

          <TextField
            name="url"
            placeholder="URL"
            variant="outlined"
            fullWidth
            error={!!errors.url}
            helperText={errors.url}
            defaultValue={initialValues.url}
            onBlur={handleInputBlur}
          />

          <Box height={theme.spacing(2)} />

          <Typography variant="h5" gutterBottom>
            URL MOBILE
          </Typography>

          <TextField
            name="urlMobile"
            placeholder="URL MOBILE"
            variant="outlined"
            fullWidth
            error={!!errors.urlMobile}
            helperText={errors.urlMobile}
            defaultValue={initialValues.urlMobile}
            onBlur={handleInputBlur}
          />

          <Box height={theme.spacing(2)} />

          <Typography variant="h5" gutterBottom>
            Contenu
          </Typography>

          <TextField
            name="description"
            placeholder="Contenu"
            variant="outlined"
            fullWidth
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={6}
            defaultValue={initialValues.description}
            onBlur={handleInputBlur}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={3}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            align="center"
          >
            Image de couverture pour le mobile
            Taille: 800 px à 300 px
          </Typography>
          <DropzoneArea
            inputProps={{
              name: 'imageMobile',
            }}
            previewGridProps={{
              container: { spacing: 2, justify: 'center' },
            }}
            dropzoneText="Image de couverture pour le mobile"
            acceptedFiles={['image/*']}
            filesLimit={1}
            classes={{ root: classes.dropzone }}
            getFileAddedMessage={() => 'Fichier ajouté'}
            getFileRemovedMessage={() => 'Fichier enlevé'}
            onChange={(files) => {
              if (files.length) setValues((v) => ({ ...v, imageMobile: files[0] }));
            }}
            initialFiles={[initialValues.imageMobile ?? ""]}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={3}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            align="center"
          >
            Image de couverture pour le web
            Taille: 1024 px à 1280 px
          </Typography>
          <DropzoneArea
            inputProps={{
              name: 'imageWeb',
            }}
            previewGridProps={{
              container: { spacing: 2, justify: 'center' },
            }}
            dropzoneText="Image de couverture pour le web"
            acceptedFiles={['image/*']}
            filesLimit={1}
            classes={{ root: classes.dropzone }}
            getFileAddedMessage={() => 'Fichier ajouté'}
            getFileRemovedMessage={() => 'Fichier enlevé'}
            onChange={(files) => {
              if (files.length) setValues((v) => ({ ...v, imageWeb: files[0] }));
            }}
            initialFiles={[initialValues.imageWeb ?? ""]}
          />
        </Grid>
        <Grid
          item
          container
          justify="flex-end"
          alignItems="center"
          xs={12}
          spacing={2}
        >
          <Button
            variant="contained"
            color="default"
            disabled={saving}
            size="large"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Box width={theme.spacing(2)} />
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
          >
            {!saving ? (
              'Enregistrer'
            ) : (
              <CircularProgress color="inherit" size="25.45px" />
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PostForm;
