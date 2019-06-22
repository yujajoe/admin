import React from 'react'
import { Modal, Form, Upload, Icon, message, Input, Radio, DatePicker, Alert } from 'antd'
import {isAuthenticated} from '../../utils/session'
import moment from 'moment'

const RadioGroup = Radio.Group;

@Form.create()
class EditInfoModal extends React.Component {
    state = {
        visible: false,
        uploading: false
    }
    handleCancel = () => {
        this.props.form.resetFields()
        this.toggleVisible(false)
    }
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.onUpdate(values)
                this.handleCancel()
            }
        });
    }
    onUpdate= async (values)=>{
        const param = {
            ...values,
            birth:values.birth && moment(values.birth).valueOf()
        }
        console.log(param)
    }
    toggleVisible = (visible) => {
        this.setState({
            visible
        })
    }
    _normFile = (e)=>{
        if(e.file.response && e.file.response.data){
            return e.file.response.data.url
        } else {
            return ''
        }
    }
    render() {
        const { visible, uploading } = this.state
        const { getFieldDecorator, getFieldValue } = this.props.form

        const avatar = getFieldValue('avatar')

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }

        const uploadProps = {
            name: "avatar",
            listType: "picture-card",
            headers: {
                Authorization: `Bearer ${isAuthenticated()}`,
            },
            action: `${process.env.REACT_APP_BASE_URL}/upload?isImg=1`,
            showUploadList: false,
            accept: "image/*",
            onChange: (info) => {
                if (info.file.status !== 'uploading') {
                    this.setState({
                        uploading: true
                    })
                }
                if (info.file.status === 'done') {
                    this.setState({
                        uploading: false
                    })
                    message.success('上传头像成功')
                } else if (info.file.status === 'error') {
                    this.setState({
                        uploading: false
                    })
                    message.error(info.file.response.message || '上传头像失败')
                }
            }
        }
        return (
            <Modal
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                visible={visible}
                title="编辑个人信息">
                <Form>
                    <Form.Item label={'头像'} {...formItemLayout}>
                        {getFieldDecorator('avatar', {
                            rules: [{ required: true, message: '请上传用户头像' }],
                            getValueFromEvent: this._normFile,     //将上传的结果作为表单项的值（用normalize报错了，所以用的这个属性）
                        })(
                            <Upload {...uploadProps} style={styles.avatarUploader}>
                                {avatar ? <img src={avatar} alt="avatar" style={styles.avatar} /> : <Icon style={styles.icon} type={uploading ? 'loading' : 'plus'} />}
                            </Upload>
                        )}
                    </Form.Item>
                    <Form.Item label={'姓名'} {...formItemLayout}>
                        {getFieldDecorator('nickname', {
                            rules: [{ required: true, message: '请输入姓名' }],
                        })(
                            <Input placeholder="请输入姓名" />
                        )}
                    </Form.Item>
                    <Form.Item label={'出生年月日'} {...formItemLayout}>
                        {getFieldDecorator('birth', {
                            rules: [{ required: true, message: '请选择出生年月日' }],
                        })(
                            <DatePicker />
                        )}
                    </Form.Item>
                    <Form.Item label={'电话'} {...formItemLayout}>
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: '请输入电话号码' }, { pattern: /^[0-9]*$/, message: '请输入正确的电话号码' }],
                        })(
                            <Input placeholder="请输入电话号码" />
                        )}
                    </Form.Item>
                    <Form.Item label={'所在地'} {...formItemLayout}>
                        {getFieldDecorator('location', {
                            validateFirst: true,
                            rules: [{ required: true, message: '请输入目前所在地' }],
                        })(
                            <Input placeholder="请输入目前所在地" />
                        )}
                    </Form.Item>
                    <Form.Item label={'性别'} {...formItemLayout}>
                        {getFieldDecorator('gender', {
                            initialValue: '男',
                            rules: [{ required: true, message: '请选择性别' }],
                        })(
                            <RadioGroup>
                                <Radio value={'男'}>男</Radio>
                                <Radio value={'女'}>女</Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Alert message={"注：此信息仅为项目模拟数据，无其他用途"} type="info" />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

const styles = {
    avatarUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 150,
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    avatar: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
}


export default EditInfoModal