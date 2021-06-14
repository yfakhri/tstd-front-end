import React from 'react';
import useSWR from 'swr';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import fetcher from '../../libs/fetcher';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useSession } from 'next-auth/client';
import { Formik, Field, ErrorMessage } from 'formik';
import {
  TextField,
  Select,
  RadioGroup,
  CheckboxWithLabel,
} from 'formik-material-ui';
import * as Yup from 'yup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { FormControlLabel } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function QuestionList() {
  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState({});
  const [sbar, setSbar] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [session, loading] = useSession();
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
        pQuestion{
          answers{
            user
          }
        }
      }
      questionAllUserAnswers(userId:"${session.user._id}")
    }`,
    fetcher
  );

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

  const disButton = (quest, answers) => {
    if (quest.pQuestion) {
      if (quest.pQuestion.answers.length > 0) {
        if (
          !quest.pQuestion.answers.some(
            (answer) => answer.user == session.user._id
          )
        ) {
          return true;
        }
      } else {
        return true;
      }
    }
    if (quest.locked) {
      if (answers[quest._id]) {
        return true;
      }
      return false;
    }
    return false;
  };
  const handlerClickQuestion = (question) => {
    const answer = data.questionAllUserAnswers[question._id];

    setQuestion({
      ...question,
      answer,
    });

    handleClickOpen();
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={sbar}
        autoHideDuration={2000}
        onClose={handleCloseSbar}
      >
        <Alert onClose={handleCloseSbar} severity="success">
          Jawaban Berhasil Disimpan!
        </Alert>
      </Snackbar>
      <Grid container spacing={3}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            answer: `${question.answer ? question.answer : ''}`,
            sure: !question.locked,
          }}
          validationSchema={Yup.object({
            answer: Yup.string().required('Harus diisi'),
            sure: Yup.boolean().oneOf([true], 'Pastikan Jawaban Sudah Benar!'),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const query = `mutation{
            questionUpsertAnswer(
              questionId:"${question._id}"
              userId:"${session.user._id}"
              answer:"${values.answer}"
            ){
              qname
            }
          }`;
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
              arial-labelledby="form-dialoganw-title"
              fullWidth
              maxWidth="sm"
              fullScreen={fullScreen}
              onClose={() => {
                handleReset();
                handleClose();
              }}
            >
              <DialogTitle id="form-dialoganw-title">
                {question.qname}
              </DialogTitle>
              <DialogContent>
                {question.qtype === 'text' && (
                  <Field
                    component={TextField}
                    name="answer"
                    label="Jawaban"
                    fullWidth
                  />
                )}
                {question.qtype === 'radio' && (
                  <>
                    <Field component={RadioGroup} name="answer">
                      {question.ansList.map((quest, index) => (
                        <FormControlLabel
                          key={index}
                          value={quest}
                          control={<Radio disabled={isSubmitting} />}
                          label={quest}
                          disabled={isSubmitting}
                        />
                      ))}
                    </Field>
                    <ErrorMessage
                      name="answer"
                      component={Typography}
                      color="secondary"
                    />
                  </>
                )}
                {question.qtype === 'select' && (
                  <>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="answer-simple">Jawaban</InputLabel>
                      <Field
                        component={Select}
                        name="answer"
                        inputProps={{ id: 'answer-simple' }}
                      >
                        {question.ansList.map((quest, index) => (
                          <MenuItem key={index} value={quest}>
                            {quest}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                    <ErrorMessage
                      name="answer"
                      component={Typography}
                      color="secondary"
                    />
                  </>
                )}
                {question.locked && (
                  <>
                    <Field
                      component={CheckboxWithLabel}
                      type="checkbox"
                      name="sure"
                      Label={{
                        label:
                          'Harap centang apabila jawaban sudah benar, karena tidak dapat diubah. ',
                      }}
                    />
                    <ErrorMessage
                      name="sure"
                      component={Typography}
                      color="secondary"
                    />
                  </>
                )}
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
        {!data && <div>loading</div>}
        {data &&
          data.questionMany.map(
            (quest, index) =>
              quest.show && (
                <Grid item xs={6} sm={3} key={index}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlerClickQuestion(quest)}
                    disabled={disButton(quest, data.questionAllUserAnswers)}
                    fullWidth
                  >
                    {quest.qname}
                  </Button>
                </Grid>
              )
          )}
      </Grid>
    </>
  );
}
