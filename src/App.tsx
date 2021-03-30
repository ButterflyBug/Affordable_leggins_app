import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import { Container, Row } from 'react-bootstrap'


function SingleLeggin(props: { leggin: any }) {
  const { leggin } = props

  return (
    <tr>
      <td>{leggin.leggin_id}</td>
      <td><a target='_blank' href={`https://www.myprotein.pl/${leggin.leggin_id}.html`}>{leggin.leggin_name}</a></td>
      <td>{leggin.leggin_price}</td>
      <td>{leggin.leggin_rrp}</td>
      <td>{leggin.sizes?.join(', ')}</td>
    </tr>
  )
}


function Leggins(props: { leggins: any[] }) {
  const { leggins } = props

  return (<>
    {leggins.map((item) => <SingleLeggin leggin={item} />)}
  </>)
}

function getLeggins() {
  return fetch('https://europe-west2-affordable-leggins.cloudfunctions.net/run')
}

function App() {
  const [leggins, setLeggins] = useState<any>([])
  const [loaded, setLoaded] = useState<any>(false)

  useEffect(() => {
    if (loaded) { return }

    const listOfLeggins = getLeggins()
      .then((response) => response.json())
      .then((json) => json.leggins)
      .then((leggins) => leggins.sort((itemA: any, itemB: any) => itemA.leggin_price - itemB.leggin_price))
      .then((legginsResult) => {
        setLeggins(legginsResult)
        setLoaded(true)
      })
  })

  const renderLeggins = () => {
    if (loaded) {
      return <Leggins leggins={leggins} />
    } else {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )
    }
  }

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>Leggin ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Retail price</th>
                <th>Sizes</th>
              </tr>
            </thead>
            <tbody>
              {renderLeggins()}
            </tbody>
          </Table>
        </Row>
      </Container>

    </div>
  )
}

export default App
