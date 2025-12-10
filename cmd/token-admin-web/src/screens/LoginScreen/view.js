import React from 'react';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';
import { Box, Container, withStyles } from '@material-ui/core';
import Button from '~/components/Buttons';
import Typography from '~/components/Typography';
import { Panel, PanelBody } from '~/components/Panels';
import TextInput from '~/components/FormFields/TextInput';
import LoginLogo from '~/assets/images/login-logo.png';
import {
  loginAccountSchema,
  passwordSchema,
} from '~/constants/yupSchemas/user';
import { handleYupSchema, handleYupErrors } from '~/utils/formCheck';
import packageConfig from '~/../package.json';

const loginSchema = yup.object().shape({
  account: loginAccountSchema,
  password: passwordSchema,
});

class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      password: '',
      errors: {},
    };
  }

  onKeydown = event => {
    if (event.code === 'Enter' || event.code === 'NumpadEnter')
      this.handleSubmit();
  };

  handleInputChange = ({ value, name }) => this.setState({ [name]: value });

  validateData = async () => {
    try {
      const { account, password } = this.state;
      await handleYupSchema(loginSchema, { account, password });
      this.setState(state => ({ ...state, errors: {} }));
      return true;
    } catch (error) {
      const errors = handleYupErrors(error);
      this.setState(state => ({ ...state, errors }));
      return false;
    }
  };

  onBlur = async () => {
    if (!isEmpty(this.state.errors)) await this.validateData();
  };

  onConfirm = async () => {
    if (!(await this.validateData())) return;
    const { history } = this.props;
    const { account, password } = this.state;
    this.props.handleLogin({ account, password, history });
  };

  render() {
    const { classes } = this.props;

    return (
      <form>
        <Container className={classes.container}>
          <Panel className={classes.loginPanel}>
            <PanelBody className={classes.panelBody}>
              <Box className={classes.logoBox}>
                <img
                  src={LoginLogo}
                  alt='LoginLogo'
                  className={classes.logoImage}
                />
              </Box>
              <Box className={classes.inputBox}>
                <TextInput
                  title='賬號'
                  name='account'
                  placeholder='請輸入帳號'
                  onBlur={this.onBlur}
                  value={this.state.account}
                  onChange={this.handleInputChange}
                  errorMessage={this.state.errors.account}
                />
                <TextInput
                  title='登錄密碼'
                  name='password'
                  type='password'
                  maxLength={20}
                  autocomplete={false}
                  placeholder='請輸入登錄密碼'
                  onBlur={this.onBlur}
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  errorMessage={this.state.errors.password}
                />
              </Box>
              <Box className={classes.buttonBox}>
                <Button
                  text='登錄'
                  type='primary'
                  size='large'
                  data-testid='submit'
                  onClick={this.onConfirm}
                />
              </Box>
              <Box className={classes.version}>
                <Typography variant='h5'>
                  V {`${packageConfig.version}`}
                </Typography>
              </Box>
            </PanelBody>
          </Panel>
        </Container>
      </form>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: theme.colors.bodybg,
    padding: theme.spacing(2),
    boxSizing: 'border-box',
  },
  loginPanel: {
    width: '100%',
    maxWidth: 500,
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: theme.colors.error,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  panelBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: `${theme.spacing(4)}px ${theme.spacing(3)}px !important`,
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(3)}px ${theme.spacing(2)}px !important`,
    },
  },
  logoBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(3),
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(2),
    },
  },
  logoImage: {
    maxWidth: '100%',
    maxHeight: '120px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
  },
  inputBox: {
    textAlign: 'left',
    width: '100%',
    padding: `0 ${theme.spacing(2)}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: `0 ${theme.spacing(1)}px`,
    },
  },
  buttonBox: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(3),
    },
  },
  version: {
    color: theme.colors.greylight,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
});

export default withStyles(styles)(LoginScreen);
