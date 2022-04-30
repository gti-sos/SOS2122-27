<script>
    import {
      Button,
      Card,
      CardBody,
      CardFooter,
      CardHeader,
      CardSubtitle,
      CardText,
      CardTitle,
      Col,
      Container,
      Row,
    } from "sveltestrap";
  </script>
  
  <main>
    <h1>SOS2122-27</h1>
  
    <h2>Componentes</h2>
    <Container>
      <Col>
        <a href="https://github.com/roque-fernandez">Roque Fernandez Iglesias</a>
      </Col>
      <Col>
        <a href="https://github.com/famvcucu">Fco Alexis Morales Vallado</a>
      </Col>
      <Col>
        <a href="https://github.com/jfeliperamos">Jose Felipe Ramos</a>
      </Col>
    </Container>
    <p />
    <h2>Descripción del proyecto</h2>
    <p>
        Análisis económico mundial donde observaremos las relaciones en las variaciones 
        entre la inversión en Gasto Público y la Deuda Pública, así como descubrir como 
        ambos factores afectan al Salario Mínimo Interprofesional.
    </p>
  
    <Container>
      <Col>
        <a href="https://github.com/gti-sos/SOS2122-27">
            <b>Repositorio: </b>gti-sos/SOS2122-27
        </a>
      </Col>
      <Col>
        <a href="http://sos2122-27.herokuapp.com"
          ><b>Enlace: </b>http://sos2122-27.herokuapp.com
        </a>
      </Col>
    </Container>
    <p />
  
    <a href="/#/info">
      <Button color="primary">Info</Button>
    </a>

    <a href="/#/analytics">
      <Button color="primary">Gráfica Conjunta</Button>
    </a>
    <a href="/#/integrations">
      <Button color="dark">Integraciones</Button>
    </a>
    <a href="/#/charts">
      <Button color="dark">Gráficas Personales</Button>
    </a>
    <a href="/#/about">
      <Button color="dark">Videos</Button>
    </a>
    
    <p />
  
    <h2>API's</h2>
    <Container>
      <Col xs="auto">
        <Card class="mb-3">
          <CardHeader>
            <CardTitle><h5>Public expenditure stats</h5></CardTitle>
          </CardHeader>
          <CardBody>
            <CardSubtitle />
            <CardText>
               Estadísticas sobre el gasto público en diferentes países,
               así como % relativos al gasto en defensa o al PIB.
               </CardText>

            <a href="https://sos2122-27.herokuapp.com/api/v1/public-expenditure-stats">
              <Button color="primary">API v1</Button></a>

              <a href="https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats">
                <Button color="primary">API v2</Button></a>

            <a href="/#/public-expenditure-stats">
              <Button color="primary">Interfaz</Button>
            </a>
            <a href="https://documenter.getpostman.com/view/8975262/UVyn2yyn"
              ><Button color="info">Documentación v1</Button></a>

            <a href="https://documenter.getpostman.com/view/8975262/Uyr8nyWh"
              ><Button color="info">Documentación v2</Button></a>

            </CardBody>

          <CardFooter
            >desarrollado por
            <a href="https://github.com/roque-fernandez">Roque Fernandez Iglesias</a>
          </CardFooter>
        </Card>

      </Col>

      <Col xs="auto">
        <Card class="mb-3">
          <CardHeader>
            <CardTitle><h5>Public expenditure stats</h5></CardTitle>
          </CardHeader>
          <CardBody>
            <CardSubtitle />
            <CardText>
               Estadísticas sobre el gasto público en diferentes países,
               así como % relativos al gasto en defensa o al PIB.
               </CardText>

            <a href="https://sos2122-27.herokuapp.com/api/v1/public-expenditure-stats">
              <Button color="primary">API v1</Button></a>

              <a href="https://sos2122-27.herokuapp.com/api/v2/public-expenditure-stats">
                <Button color="primary">API v2</Button></a>

            <a href="/#/public-expenditure-stats">
              <Button color="primary">Interfaz</Button>
            </a>
            <a href="https://documenter.getpostman.com/view/8975262/UVyn2yyn"
              ><Button color="info">Documentación v1</Button></a>

            <a href="https://documenter.getpostman.com/view/8975262/Uyr8nyWh"
              ><Button color="info">Documentación v2</Button></a>

            </CardBody>

          <CardFooter
            >desarrollado por
            <a href="https://github.com/roque-fernandez">Roque Fernandez Iglesias</a>
          </CardFooter>
        </Card>

      </Col>
      
    </Container>
  </main>
  
  <style>
    main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
    }
    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
    }
    b {
      color: #00c1ff;
    }
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style>