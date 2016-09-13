import React, { Component, PropTypes } from 'react'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import SelectField from 'material-ui/lib/select-field'
import MenuItem from 'material-ui/lib/menus/menu-item'
import TextField from 'material-ui/lib/text-field'
import ListItem from 'material-ui/lib/lists/list-item'
import FontIcon from 'material-ui/lib/font-icon'
import router from 'react-router'
import { Link } from 'react-router'

import config from '../../config'

const errorText = 'This is a required field'
const styles = {
  slider: {
    flex: '2 1 auto'
  },
  sliderValue: {
    position: 'relative',
    fontSize: '14px',
    fontFamily: 'Roboto,sans-serif',
    fontWeight: 'bold',
    flex: '0 1 auto',
    bottom: '7px',
    marginLeft: '15px',
    marginRight: '20px'
  },
  action: {
    flex: '2 1 auto'
  }
}

class GMManhattanDialog extends Component {
  initialState () {
    return {
      open: false,
      traitName: ''
    }
  }

  getDataUrl() {
    return '/visualization/manhattan/3/4/5'
    // const file = this.props.data
    // if (file.filetype === 'resultFile' && file.info.resultType === 'matrix') {
    //   const markerLabelId = file.info.labels.marker
    //   const traitLabelId = file.info.labels.trait
    //   return '/visualization/matrix/' + markerLabelId + '/' + traitLabelId + '/' + file.id
    // } else {
    //   return '/data/' + file.id
    // }
  }

  constructor (props, context) {
    super(props, context)
    this.state = this.initialState()
  }

  validateForm () {
    return (!!this.state.traitName)
  }

  handleSubmit () {
    this.setState(this.initialState())
    this.handleClose()
  }

  handleOpen () {
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  handleChangeTraitName(event, index, value){
    this.setState({traitName: value})
  }

  render () {
    var actions = [
      <FlatButton
        label='Cancel'
        secondary={true}
        onClick={this.handleClose.bind(this)}
      />,
      <FlatButton
        label='View'
        primary={true}
        keyboardFocused={true}
        onClick={this.handleSubmit.bind(this)}
        disabled={!this.validateForm()}
        containerElement={<Link to={this.getDataUrl()}/>}
        linkButton={true}
      />
    ]
    return (
      <div>
        <FlatButton
          label='Manhattan Visualization'
          style={styles.action}
          icon={<FontIcon className='material-icons'>equalizer</FontIcon>}
          onClick={this.handleOpen.bind(this)}
        />
        <Dialog
          title='Choose Trait for Manhattan View'
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
        >
          <form name='ChooseTrait'>
            <div>
              <SelectField
                className='gm-dialog__import'
                hintText='Trait Name'
                value={this.state.traitName}
                onChange={this.handleChangeTraitName.bind(this)}
                >
                <MenuItem value={1} primaryText='Tumour' />
              </SelectField>

            </div>
          </form>
        </Dialog>
      </div>
    )
  }
}

export default GMManhattanDialog