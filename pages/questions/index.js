import React from 'react';
import Layout from '../../components/layout';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import useSWR from 'swr';
import fetcher from '../../libs/fetcher';
import { Formik, Field, FieldArray } from 'formik';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { TextField, Select, Switch } from 'formik-material-ui';
import * as Yup from 'yup';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Icon } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useSession } from 'next-auth/client';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    overflowX: 'hide',
  },
  container: {
    maxHeight: 200,
  },
  table: {
    minWidth: 650,
  },
}));

export default function Questions() {
  const [session, loading] = useSession();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);
  const [sbar, setSbar] = React.useState(false);

  const handleCloseSbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSbar(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { data, error, mutate } = useSWR(
    `{
      questionMany{
        _id
        qname
        qtype
        ansList
        locked
        prevQuestion
        nextQuestion
        show
        nQuestion{
          qname
        }
        pQuestion{
          qname
        }
      }
    }`,
    fetcher
  );

  return (
    <Layout title="Pertanyaan" role="admin">
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={sbar}
        autoHideDuration={5000}
        onClose={handleCloseSbar}
      >
        <Alert onClose={handleCloseSbar} severity="success">
          Pertanyaan Berhasil Ditambahkan!
        </Alert>
      </Snackbar>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography component="h2" variant="h6">
              {data && (
                <Tooltip title="Tambah">
                  <IconButton aria-label="add" onClick={handleClickOpen}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
              Daftar Pertanyaan
            </Typography>
            <Formik
              initialValues={{
                qname: '',
                qtype: 'text',
                ansList: ['', ''],
                locked: false,
                prevQuestion: '-',
                show: true,
              }}
              validationSchema={Yup.object({
                qname: Yup.string().required('Harus diisi'),
                ansList: Yup.array()
                  .of(Yup.string())
                  .when('qtype', {
                    is: (qtype) => qtype === 'radio' || qtype === 'select',
                    then: Yup.array().of(Yup.string().required('Harus diisi')),
                  }),
              })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const query = `mutation{
                  questionAdd(record:{
                    qname:"${values.qname}"
                    qtype:"${values.qtype}"
                    locked:${values.locked}
                    show:${values.show}
                    ansList:${
                      values.qtype === 'radio' || values.qtype === 'select'
                        ? JSON.stringify(values.ansList)
                        : '[]'
                    }
                    ${
                      values.prevQuestion !== '-'
                        ? 'prevQuestion: "' + values.prevQuestion + '"'
                        : ''
                    }
                  }){
                    qname
                  }
                }
                  `;
                const data = await fetcher(query);
                setSubmitting(false);
                resetForm();
                handleClose();
                mutate();
                setSbar(true);
              }}
            >
              {({ handleSubmit, handleReset, values, isSubmitting }) => (
                <Dialog
                  open={open}
                  aria-labelledby="form-dialog-title"
                  fullWidth
                  maxWidth="sm"
                  fullScreen={fullScreen}
                  onClose={() => {
                    handleReset();
                    handleClose();
                  }}
                >
                  <DialogTitle id="form-dialog-title">
                    Tambah Pertanyaan
                  </DialogTitle>
                  <DialogContent>
                    <Field
                      component={TextField}
                      name="qname"
                      label="Nama Pertanyaan"
                      fullWidth
                    />

                    <FormControl fullWidth>
                      <InputLabel htmlFor="qtype-simple">
                        Jenis Pertanyaan
                      </InputLabel>
                      <Field
                        component={Select}
                        name="qtype"
                        inputProps={{
                          id: 'qtype-simple',
                        }}
                      >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="radio">Radio</MenuItem>
                        <MenuItem value="select">Select</MenuItem>
                      </Field>
                    </FormControl>
                    {values.qtype !== 'text' && (
                      <FieldArray name="ansList">
                        {(arrayHelpers) => (
                          <div>
                            {values.ansList &&
                              values.ansList.length > 0 &&
                              values.ansList.map((ansl, index) => (
                                <div key={index}>
                                  <Field
                                    component={TextField}
                                    name={`ansList.${index}`}
                                    label={`Jawaban ${index + 1}`}
                                    fullWidth
                                    InputProps={
                                      values.ansList.length > 2 && {
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <IconButton
                                              onClick={() => {
                                                arrayHelpers.remove(index);
                                              }}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </InputAdornment>
                                        ),
                                      }
                                    }
                                  />
                                </div>
                              ))}
                            <IconButton
                              onClick={() => {
                                arrayHelpers.push('');
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </div>
                        )}
                      </FieldArray>
                    )}
                    <FormControl fullWidth>
                      <InputLabel htmlFor="prevQuestion-simple">
                        Pertanyaan Sebelumnya
                      </InputLabel>
                      <Field
                        component={Select}
                        name="prevQuestion"
                        inputProps={{
                          id: 'prevQuestion-simple',
                        }}
                      >
                        <MenuItem value="-">-</MenuItem>
                        {data &&
                          data.questionMany.map((question, index) => (
                            <MenuItem key={index} value={question._id}>
                              {question.qname}
                            </MenuItem>
                          ))}
                      </Field>
                    </FormControl>
                    <FormControl>
                      <FormControlLabel
                        label="Kunci"
                        labelPlacement="start"
                        control={
                          <Field
                            component={Switch}
                            type="checkbox"
                            name="locked"
                            disabled={isSubmitting}
                          />
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormControlLabel
                        label="Tampilkan"
                        labelPlacement="start"
                        control={
                          <Field
                            component={Switch}
                            type="checkbox"
                            name="show"
                            disabled={isSubmitting}
                          />
                        }
                      />
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        handleReset();
                        handleClose();
                      }}
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            </Formik>

            <TableContainer>
              <Table stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Nama Pertanyaan</TableCell>
                    <TableCell>Jenis Pertanyaan</TableCell>
                    <TableCell>Pertanyaan Sebelumnya</TableCell>
                    <TableCell>Pertanyaan Selanjutnya</TableCell>
                    <TableCell>Kunci</TableCell>
                    <TableCell>Tampilkan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!data ? (
                    <TableRow>
                      <TableCell>loading</TableCell>
                    </TableRow>
                  ) : (
                    data.questionMany.map((question, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{question.qname}</TableCell>
                        <TableCell>{question.qtype}</TableCell>
                        <TableCell>
                          {question.pQuestion ? (
                            question.pQuestion.qname
                          ) : (
                            <p>-</p>
                          )}
                        </TableCell>
                        <TableCell>
                          {question.nQuestion.length != 0 &&
                            question.nQuestion.map((txt, index) => (
                              <p key={index}>{txt.qname}</p>
                            ))}
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={question.locked} disabled={true} />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={question.show}
                            disabled={false}
                            onChange={async (event) => {
                              const query = `mutation{
                              questionUpdateById(
                                _id:"${question._id}"
                                record:{
                                  show:${event.target.checked}
                              }){
                                recordId
                              }
                            }`;
                              const data = await fetcher(query);
                              mutate();
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
