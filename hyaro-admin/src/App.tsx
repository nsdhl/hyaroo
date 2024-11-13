import './App.css'
import { RouterCollection } from './routes/routes'
import { Layout } from './layouts/layout'
import { PageLayoutWrapper } from './components/hoc/PageLayoutWrapper'
import { Toaster } from 'react-hot-toast'
import { AuthController } from './components/hoc/AuthController'

function App() {

  return (
    <>
      <AuthController>
        <Layout />
        <PageLayoutWrapper>
          <Toaster />
          <RouterCollection />
        </PageLayoutWrapper>
      </AuthController>
    </>
  )
}

export default App
