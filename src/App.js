import { Component } from "react";
import './css/bootstrap.min.css'
import { Container, Table, Card, Row, Col, Button, Form } from 'react-bootstrap'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      items: [],
      error: null,
      editData: false,
      dataApi: {
        id: 0,
        nama_karyawan: "",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
      }
    }
    this.handlerDeleteData = this.handlerDeleteData.bind(this)
    this.handlerInputData = this.handlerInputData.bind(this)
    this.saveData = this.saveData.bind(this)
    this.resetData = this.resetData.bind(this)
  }
  componentDidMount() {
    this.handlerDataApi()
  }
  handlerDataApi() {
    axios.get('http://localhost:3001/data-karyawan')
      .then((response) => {
        this.setState({
          isLoaded: true,
          items: response.data

        })
      },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }
  handlerDeleteData(e) {
    console.log(e.target.value)
    fetch(`http://localhost:3001/data-karyawan/${e.target.value}`, { method: 'DELETE' })
      .then(() => this.handlerDataApi())
  }

  handlerInputData(e) {
    console.log(e.target.value)
    let newDataApi = { ...this.state.dataApi }
    newDataApi['id'] = new Date().getTime()
    newDataApi[e.target.name] = e.target.value

    this.setState({
      dataApi: newDataApi
    })
  }
  saveData(e) {
    if (this.state.editData === false) {
      axios.post('http://localhost:3001/data-karyawan/', this.state.dataApi)
        .then(() => {
          this.handlerDataApi()
          this.resetData()
        })
    } else {
      axios.put(`http://localhost:3001/data-karyawan/${e.target.value}`)
        .then(() => {
          this.handlerDataApi()
          this.resetData()
        })
    }
  }
  resetData = () => {
    let newDataApi = { ...this.state.dataApi }
    newDataApi['id'] = ''
    newDataApi['jabatan'] = ''
    newDataApi['jenis_kelamin'] = ''
    newDataApi['nama_karyawan'] = ''
    newDataApi['tanggal_lahir'] = ''

    this.setState({
      dataApi: newDataApi
    })
  }





  render() {
    let { isLoaded, items, error } = this.state
    if (error) {
      return (
        <div>
          <p className='h3'>Error : {error.message}</p>
        </div>
      )
    } else if (!isLoaded) {
      return (
        <div>
          <p className='h3 text-center'>is Loading ...</p>
        </div>
      )
    } else {
      return (
        <div>
          <p className='h1 text-center my-3'>Daftar Karyawan</p>
          <Container>
            <Row className='border rounded p-3'>
              <Col>
                <Form>
                  <Form.Group className='mb-3'>
                    <Form.Label>Nama Karyawan</Form.Label>
                    <Form.Control name='nama_karyawan' onChange={this.handlerInputData} type='text' placeholder='Nama Lengkap' />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Jabatan</Form.Label>
                    <Form.Control name='jabatan' onChange={this.handlerInputData} type='text' placeholder='Jabatan' />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Jenis Kelamin</Form.Label>
                    <Form.Control name='jenis_kelamin' onChange={this.handlerInputData} type='text' placeholder='Jenis Kelamin' />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Tanggal Lahir</Form.Label>
                    <Form.Control name='tanggal_lahir' onChange={this.handlerInputData} type='date' />
                  </Form.Group>
                  <div className='d-grid gap-1'>
                    <Button variant='primary' size='md' onClick={this.saveData} className='mx-auto'><b>Save Data</b></Button>
                  </div>
                </Form>

              </Col>
            </Row>
            <p className='h1 text-center mt-5 my-1'>Data Karyawan</p>
            <Row xs={1} md={3} className='g-4 mt-2 '>
              {items.map((item, index) => {
                return (
                  <Col key={index}>
                    <Card className='shadow-sm rounded'>
                      <Card.Body>
                        <Table striped >
                          <tbody>
                            <tr>
                              <td>Id</td>
                              <td>:</td>
                              <td>{item.id}</td>
                            </tr>
                            <tr>
                              <td>Nama Karyawan</td>
                              <td>:</td>
                              <td>{item.nama_karyawan}</td>
                            </tr><tr>
                              <td>Jabatan</td>
                              <td>:</td>
                              <td>{item.jabatan}</td>
                            </tr><tr>
                              <td>Jenis Kelamin</td>
                              <td>:</td>
                              <td>{item.jenis_kelamin}</td>
                            </tr><tr>
                              <td>Tanggal Lahir</td>
                              <td>:</td>
                              <td>{item.tanggal_lahir}</td>
                            </tr>
                          </tbody>
                        </Table>

                        <Button variant='danger' value={item.id} className='me-3' onClick={this.handlerDeleteData}>Delete</Button>
                        <Button variant='primary' value={item.id} onClick={this.handlerEditData}>Edit Data</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          </Container >
        </div >
      )
    }

  }
}
export default App